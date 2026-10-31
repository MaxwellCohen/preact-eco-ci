// Usage: node scripts/compare.mjs [variant ...]   (defaults to all in versions.json)
// Loads <host>/dpu in Chromium, Firefox and WebKit for each variant and records per-scenario pass/fail,
// patch diagnostics, bytes and timings. Writes results/compare.json and results/compare.md.
import { chromium, firefox, webkit } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const versions = JSON.parse(readFileSync('versions.json', 'utf8'));
const variants = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(versions);
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const browsers = { chromium, firefox, webkit };

// Runs inside the page. Each returns true when the scenario ended in its expected state.
const CHECKS = `(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const sc = id => '[data-scenario="' + id + '"] ';
const ns = el => el && el.namespaceURI.split('/').pop();
const noFallback = id => $$(sc(id) + '[data-testid=fallback]').length === 0;
return {
 'html-baseline': () => $('[data-testid=html-done]') && noFallback('html-baseline'),
 'popcorning': () => $$('[data-testid=popcorn] [data-cell]').length === 16,
 'nested': () => $('[data-testid=panel-Details]') && $('[data-testid=panel-Account]'),
 'out-of-order': () => $('[data-testid="panel-fast-second"]') && $('[data-testid="panel-slow-first"]'),
 'table-rows': () => $$(sc('table-rows') + 'tbody > tr').length === 3,
 'select-options': () => $$(sc('select-options') + 'option').length === 3 && $('[data-testid=sel]').value === '2',
 'list-items': () => $$(sc('list-items') + 'ul > li').length === 3,
 'svg-namespace': () => ns($(sc('svg-namespace') + 'circle')) === 'svg',
 'mathml-namespace': () => ns($(sc('mathml-namespace') + 'mi')) === 'MathML',
 'style-hoist': () => $('[data-testid=styled]') && getComputedStyle($('[data-testid=styled]')).color === 'rgb(255, 99, 71)',
 'foreign-object': () => ns($('[data-testid=fo]')) === 'xhtml',
 'inline-script': () => $('[data-testid=script-done]') && noFallback('inline-script'),
 'empty': () => noFallback('empty'),
 'multi-root': () => $('[data-testid=multi-host]').textContent === '123',
 'text-only': () => $('[data-testid=text-host]').textContent === 'resolved text',
 'nested-template': () => $('[data-testid=inner-tpl]') && $('[data-testid=ntpl-done]') && $('[data-testid=inner-tpl]').content.childNodes.length === 1,
 'link-stylesheet': () => $('[data-testid=lnk]') && getComputedStyle($('[data-testid=lnk]')).color === 'rgb(0, 128, 0)',
 'iframe-srcdoc': () => !!$('[data-testid=ifr]'),
 'big-boundary': () => $$('[data-testid=big] p').length === 600,
 'patch-interactive': () => !!$('[data-testid=patched-btn]') && noFallback('patch-interactive'),
 'client-wins': () => $$('[data-testid=client-wins-content]').length === 1,
 'adjacent-boundaries': () => $('[data-testid=adj-a]') && $('[data-testid=adj-b]'),
 'nested-inner-first': () => $$('[data-testid=nest-outer]').length === 1 && $$('[data-testid=nest-inner]').length === 1,
 'many-boundaries': () => new Set($$('[data-testid=many-grid] [data-cell]').map(e => e.dataset.cell)).size === 60,
 'zero-delay': () => !!$('[data-testid=zero-done]'),
 'deep-nesting': () => $$('[data-level]').length === 5,
 'reverse-order': () => $$('[data-testid=reverse] [data-cell]').map(e => e.dataset.cell).join('') === '01234',
};
})()`;

async function bytes(url) {
	const t0 = performance.now();
	const r = await fetch(url);
	const reader = r.body.getReader();
	let n = 0, ttfb = 0, first = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (!first) first = performance.now() - t0;
		if (done) break;
		n += value.length;
	}
	return { bytes: n, firstChunkMs: Math.round(first), totalMs: Math.round(performance.now() - t0) };
}

const out = {};
for (const v of variants) {
	out[v] = { net: await bytes(`${host(v)}/dpu`), browsers: {} };
	for (const [bn, bt] of Object.entries(browsers)) {
		const b = await bt.launch();
		const page = await b.newPage();
		const errors = [];
		page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
		await page.goto(`${host(v)}/dpu`, { waitUntil: 'commit' });
		await page.waitForTimeout(14000);
		const res = await Promise.race([
			page.evaluate(`(() => { const c = ${CHECKS}; const r = {};
				for (const [k, f] of Object.entries(c)) { try { r[k] = !!f(); } catch (e) { r[k] = false; } }
				const rc = window.__rc || null;
				return { checks: r, rc: rc && { inits: rc.inits, calls: rc.calls.length, native: rc.calls.filter(x => x.by === 'native').length,
					polyfill: rc.calls.filter(x => x.by === 'polyfill').length, errors: rc.errors, maxGap: Math.round(rc.maxGap) },
					leftoverTemplates: document.querySelectorAll('template[for]').length,
					leftoverFallbacks: document.querySelectorAll('[data-testid=fallback]').length,
					preactIslands: document.querySelectorAll('preact-island').length }; })()`),
			new Promise(r => setTimeout(() => r('HUNG'), 8000)),
		]);
		out[v].browsers[bn] = res === 'HUNG' ? { hung: true, errors } : { ...res, errors };
		await b.close().catch(() => {});
		console.error(`done ${v} ${bn}`);
	}
}

mkdirSync('results', { recursive: true });
writeFileSync('results/compare.json', JSON.stringify(out, null, 2));

const ids = Object.keys(Object.values(out).flatMap(x => Object.values(x.browsers)).find(b => b.checks)?.checks ?? {});
let md = `# Variant comparison (${new Date().toISOString().slice(0, 10)})\n\nLive \`/dpu\` page, 14s settle. Variants: ${variants.join(', ')}.\n\n`;
md += `| variant | bytes | first chunk | total |\n|---|---|---|---|\n`;
for (const v of variants) md += `| ${v} | ${out[v].net.bytes} | ${out[v].net.firstChunkMs}ms | ${out[v].net.totalMs}ms |\n`;
const cols = variants.flatMap(v => Object.keys(browsers).map(b => [v, b]));
md += `\n## Scenario pass/fail\n\n| scenario | ${cols.map(([v, b]) => `${v}<br>${b}`).join(' | ')} |\n|---|${cols.map(() => '---').join('|')}|\n`;
for (const id of ids) md += `| ${id} | ${cols.map(([v, b]) => { const r = out[v].browsers[b]; return r.hung ? 'HUNG' : r.checks[id] ? '✅' : '❌'; }).join(' | ')} |\n`;
md += `| **passed** | ${cols.map(([v, b]) => { const r = out[v].browsers[b]; return r.hung ? 'HUNG' : `${Object.values(r.checks).filter(Boolean).length}/${ids.length}`; }).join(' | ')} |\n`;
md += `\n## Patch diagnostics\n\n| variant | browser | $RC inits | $RC calls | native | polyfill | leftover templates | leftover fallbacks | preact-islands | max stall ms | page errors |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const [v, b] of cols) { const r = out[v].browsers[b]; md += r.hung ? `| ${v} | ${b} | HUNG |||||||||\n` :
	`| ${v} | ${b} | ${r.rc?.inits ?? '–'} | ${r.rc?.calls ?? '–'} | ${r.rc?.native ?? '–'} | ${r.rc?.polyfill ?? '–'} | ${r.leftoverTemplates} | ${r.leftoverFallbacks} | ${r.preactIslands} | ${r.rc?.maxGap ?? '–'} | ${r.errors.length} |\n`; }
writeFileSync('results/compare.md', md);
console.log(md);
