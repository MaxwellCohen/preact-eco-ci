// Builds .build/index (static landing page listing every deployed variant) from .build/*/src/version.json.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const LABEL = {
	baseline: ['main', 'Upstream main for preact + preact-render-to-string. Reference (<preact-island>).'],
	'main-fork-preact': ['control', 'Upstream preact-render-to-string main with the fork’s preact — proves preact version is not the variable.'],
	pr474: ['PR #474 (old head 6a02913)', 'preactjs/preact-render-to-string#474 as opened (template-for + MutationObserver polyfill).'],
	'dpu-end-stamp': ['end-stamp (pushed)', 'Pushed fork branch dpu-end-stamp (comment end stamp).'],
	'local-end-stamp': ['PR #474 line + local changes', 'Local dpu-end-stamp tip (unpushed commits): hydration + SVG handling using the stamp method.'],
	'dpu-support': ['PR #474 (current)', 'dpu-support c1d0a66: <template for> + newline stamp. Same code as the PR #474 head e1e62e6.'],
	'dpu-support-react-style': ['PR #490', 'preactjs/preact-render-to-string#490 head (dpu-support-react-style): <template for> + per-chunk <script> + one init script.'],
	'local-react-style': ['react-style (local)', 'Local dpu-support-react-style tip (differs from the pushed commit).'],
};
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const vs = readdirSync('.build').filter(d => existsSync(`.build/${d}/src/version.json`) && d !== 'index');
const order = ['baseline','dpu-support','dpu-support-react-style','pr474','main-fork-preact','dpu-end-stamp','local-end-stamp','local-react-style'];
vs.sort((a, b) => order.indexOf(a) - order.indexOf(b));

const rows = vs.map(v => {
	const j = JSON.parse(readFileSync(`.build/${v}/src/version.json`, 'utf8'));
	const [name, desc] = LABEL[v] ?? [v, ''];
	const link = (p, t) => `<a href="${host(v)}${p}">${t}</a>`;
	return `<tr><td><b>${name}</b><br><code>${v}</code></td><td>${desc}<br><small>rts <code>${j.rts.ref.split('/').pop()}@${j.rts.sha.slice(0, 7)}</code> · preact <code>${j.preact.sha.slice(0, 7)}</code></small></td>
<td>${link('/dpu', 'diagnostics')} · ${link('/dpu?csp=strict', 'strict CSP')} · ${link('/', 'all 54 scenarios')} · ${link('/s/popcorning', 'popcorning')} · ${link('/index.json', 'json')}</td></tr>`;
}).join('\n');

// Results summary (main vs #474 vs #490) from results/*.json
const J = f => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
const size = J('results/size.json'), cmpOff = J('results/compare-off.json'), cmpLate = J('results/compare-late.json');
const B = Object.fromEntries(['chromium', 'firefox', 'webkit'].map(b => [b, J(`results/bench-${b}.json`)?.variants]));
const RV = [['baseline', 'main'], ['dpu-support', '#474'], ['dpu-support-react-style', '#490']];
const med = a => { a = a.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : null; };
const n = x => (x == null ? '–' : Math.round(x));
const pass = (c, v) => c?.[v] ? Object.values(c[v].browsers).map(r => (r.hung ? 'HUNG' : `${Object.values(r.checks).filter(Boolean).length}/${Object.keys(r.checks).length}`)).join(' · ') : '–';
const pb = (v, k) => size ? (size[v].grid[k] - size[v].popcorn[k]) / (size[v].grid.boundaries - size[v].popcorn.boundaries) : null;
const lag = (b, v) => ['popcorn', 'many', 'grid'].map(k => n(med((B[b]?.[v]?.[k] ?? []).filter(x => !x.hung).map(x => x.lagMedian)))).join(' / ');
const gap = (v, m) => ['chromium', 'firefox', 'webkit'].map(b => n(med((B[b]?.[v]?.interactive?.[m] ?? []).filter(x => !x.hung).map(x => x.gap)))).join(' / ');
const rr = (label, f) => `<tr><th>${label}</th>${RV.map(([v]) => `<td>${f(v)}</td>`).join('')}</tr>`;
const wire = {
	baseline: { mk: 23, fb: 10, wrap: 54, div: 18, per: 87, init: 1168, once: 1186, t: [1273, 1360, 1621, 2056] },
	'dpu-support': { mk: 46, fb: 10, wrap: 30, div: 0, per: 86, init: 1056, once: 1056, t: [1142, 1228, 1486, 1916] },
	'dpu-support-react-style': { mk: 46, fb: 10, wrap: 57, div: 0, per: 113, init: 720, once: 720, t: [832, 945, 1285, 1850] },
};
const resultsHtml = size ? `<h2>Results: main vs #474 vs #490</h2>
<p><small>Interleaved runs, 5 iterations per cell, 3 browsers. Full write-up and method: <a href="https://github.com/MaxwellCohen/preact-eco-ci/blob/main/REPORT.md">REPORT.md</a>. gzip/brotli are estimates. Wire-size rows: <code>id=5</code>, fallback <code>loading...</code>, content excluded, no nonce.</small></p>
<table class="r"><thead><tr><th></th>${RV.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead><tbody>
<tr><th colspan=4>Wire size (raw bytes)</th></tr>
${rr('Markers', v => wire[v].mk)}${rr('Fallback', v => wire[v].fb)}${rr('Subtree wrap', v => wire[v].wrap)}${rr('Hidden &lt;div&gt;', v => wire[v].div)}${rr('<b>Per boundary</b>', v => wire[v].per)}${rr('Init script', v => wire[v].init)}${rr('<b>Once total</b>', v => wire[v].once)}
${[1, 2, 5, 10].map((c, i) => rr(`Total, ${c} boundar${c === 1 ? 'y' : 'ies'}`, v => wire[v].t[i])).join('')}
<tr><th colspan=4>Demo-app page size (estimated)</th></tr>
${rr('Per boundary raw / gzip / brotli', v => `${pb(v, 'raw').toFixed(1)} / ${pb(v, 'gzip').toFixed(1)} / ${pb(v, 'brotli').toFixed(1)}`)}${rr('60-boundary page, gzip', v => size[v].many.gzip)}${rr('100-boundary page, gzip', v => size[v].grid.gzip)}
<tr><th colspan=4>Correctness (26 checks; Chromium · Firefox · WebKit)</th></tr>
${rr('Stream only (hydrate=off)', v => pass(cmpOff, v))}${rr('After hydration (hydrate=late)', v => pass(cmpLate, v))}
<tr><th colspan=4>Timing (median; Chromium / Firefox / WebKit)</th></tr>
${['chromium', 'firefox', 'webkit'].map(b => rr(`Patch lag ${b}, 16/60/100 boundaries (ms)`, v => lag(b, v))).join('')}
${rr('Patched → interactive, script after stream (ms)', v => gap(v, 'late'))}${rr('Patched → interactive, script mid-stream (ms)', v => gap(v, 'early'))}
${rr('Strict CSP: templates unapplied', v => ['chromium', 'firefox', 'webkit'].map(b => B[b]?.[v]?.csp?.leftoverTpl ?? '–').join(' / '))}
</tbody></table>` : '';

mkdirSync('.build/index/public', { recursive: true });

// ---- Raw data: copy JSON + generate a page with every individual run ----
import { copyFileSync, readdirSync as rd } from 'node:fs';
mkdirSync('.build/index/public/data/earlier', { recursive: true });
for (const f of rd('results')) if (f.endsWith('.json') || f.endsWith('.md')) copyFileSync(`results/${f}`, `.build/index/public/data/${f}`);
if (existsSync('results/prev')) for (const f of rd('results/prev')) copyFileSync(`results/prev/${f}`, `.build/index/public/data/earlier/${f}`);

const listing = (dir, base) => rd(dir).filter(f => /\.(json|md)$/.test(f)).map(f => `<li><a href="${base}${f}">${f}</a></li>`).join('');
writeFileSync('.build/index/public/data/index.html', `<!doctype html><meta charset=utf-8><title>raw data</title><h1>Raw data</h1><p><a href="/">← back</a> · <a href="/runs">all runs (readable)</a></p><h2>Latest run set (main, #474, #490)</h2><ul>${listing('results', '/data/')}</ul>${existsSync('results/prev') ? `<h2>Earlier run set (main, PR 474 old head, local builds, #474 current, #490 older)</h2><ul>${listing('results/prev', '/data/earlier/')}</ul>` : ''}`);
const f1 = x => (x == null || Number.isNaN(x) ? '–' : (Math.round(x * 10) / 10).toString());
const LBL = Object.fromEntries(RV);
const tr = (cells, h) => `<tr>${cells.map(c => `<${h ? 'th' : 'td'}>${c}</${h ? 'th' : 'td'}>`).join('')}</tr>`;
const T = (head, rows) => `<table class="r"><thead>${tr(head, 1)}</thead><tbody>${rows.map(r => tr(r)).join('')}</tbody></table>`;
let runsHtml = `<h1>All runs</h1><p><a href="/">← back</a> · Raw JSON: ${rd('results').filter(f => f.endsWith('.json')).map(f => `<a href="/data/${f}">${f}</a>`).join(' · ')} · earlier run set: see <a href="/data/">/data/</a></p>
<p><small>Every individual measurement, nothing aggregated. Iteration order = order in the file; variants were visited in a fresh random order each iteration. Patch lag = visible − (responseStart + server delay). Times in ms. Timing resolution ≈16 ms. Made with LLMs (Claude via Claude Code).</small></p>`;
for (const b of ['chromium', 'firefox', 'webkit']) {
	const V = B[b]; if (!V) continue;
	runsHtml += `<h2>${b}</h2>`;
	for (const [k, label] of [['popcorn', 'popcorning (16 boundaries)'], ['many', 'many-boundaries (60)'], ['grid', 'grid-100 (100)']]) {
		const rows = [];
		for (const [v] of RV) (V[v]?.[k] ?? []).forEach((x, i) => rows.push(x.hung ? [LBL[v], i + 1, 'HUNG', '', '', '', '', '', '', '', '', '', ''] :
			[LBL[v], i + 1, f1(x.ttfb), f1(x.fcp), f1(x.lcp), f1(x.lagMedian), f1(x.lagP95), f1(x.lagMax), x.missing, f1(x.lastVisible), f1(x.maxGap), f1(x.longTask), x.errors]));
		runsHtml += `<h3>${label}</h3>` + T(['variant', 'run', 'TTFB', 'FCP', 'LCP', 'lag median', 'lag p95', 'lag max', 'never shown', 'last visible', 'longest stall', 'long-task ms', 'page errors'], rows);
	}
	const irows = [];
	for (const [v] of RV) for (const m of ['late', 'early']) (V[v]?.interactive?.[m] ?? []).forEach((x, i) => irows.push(x.hung ? [LBL[v], m, i + 1, 'HUNG', '', ''] : [LBL[v], m, i + 1, f1(x.visible), f1(x.live), f1(x.gap)]));
	runsHtml += `<h3>patched counter → interactive</h3>` + T(['variant', 'hydrate', 'run', 'visible at', 'interactive at', 'gap'], irows);
	runsHtml += `<h3>strict CSP</h3>` + T(['variant', 'templates unapplied', 'fallbacks left', 'page errors'], RV.map(([v, l]) => [l, V[v]?.csp?.leftoverTpl ?? '–', V[v]?.csp?.leftoverFb ?? '–', V[v]?.csp?.errors ?? '–']));
}
for (const [mode, c] of [['off', cmpOff], ['late', cmpLate]]) {
	if (!c) continue;
	const vs = RV.map(([v]) => v).filter(v => c[v]);
	const ids = Object.keys(c[vs[0]].browsers.chromium.checks);
	const head = ['check', ...vs.flatMap(v => ['chromium', 'firefox', 'webkit'].map(b => `${LBL[v]}<br>${b}`))];
	const rows = ids.map(id => [id, ...vs.flatMap(v => ['chromium', 'firefox', 'webkit'].map(b => (c[v].browsers[b].hung ? 'HUNG' : c[v].browsers[b].checks[id] ? '✅' : '❌')))]);
	rows.push(['foreignObject page', ...vs.flatMap(v => ['chromium', 'firefox', 'webkit'].map(b => c[v].browsers[b].foreignObject))]);
	runsHtml += `<h2>Correctness per check, hydrate=${mode}</h2>` + T(head, rows);
}
if (size) {
	const rows = [];
	for (const [v, l] of RV) for (const [k, x] of Object.entries(size[v])) rows.push([l, k, x.boundaries, x.raw, x.gzip, x.brotli, x.scriptBytes, x.templates, x.islands, x.rcCalls, x.stamps ?? '–']);
	runsHtml += `<h2>Payload per page</h2>` + T(['variant', 'page', 'boundaries', 'raw', 'gzip (est.)', 'brotli (est.)', 'inline script bytes', 'template[for]', 'preact-island', 'script calls', 'stamps'], rows);
}
const STYLE = '<style>body{font:14px/1.4 system-ui,sans-serif;max-width:1200px;margin:24px auto;padding:0 16px;color:#18181b}table.r{border-collapse:collapse;margin:6px 0 18px}table.r th,table.r td{padding:2px 8px;border-top:1px solid #e4e4e7;text-align:right;font-variant-numeric:tabular-nums}table.r th:first-child,table.r td:first-child{text-align:left}h2{margin-top:30px}</style>';
writeFileSync('.build/index/public/runs.html', `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>All runs — preact-eco-ci</title>${STYLE}${runsHtml}`);

writeFileSync('.build/index/public/index.html', `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>preact-eco-ci — streaming / DPU variants</title>
<style>body{font:15px/1.45 system-ui,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#18181b}table{border-collapse:collapse;width:100%}td{border-top:1px solid #e4e4e7;padding:10px 8px;vertical-align:top}small{color:#52525b}code{background:#f4f4f5;padding:0 4px;border-radius:4px}table.r th{text-align:left;font-weight:500;padding:3px 8px;border-top:1px solid #e4e4e7}table.r td{padding:3px 8px;border-top:1px solid #e4e4e7;font-variant-numeric:tabular-nums}table.r thead th{font-weight:700}h2{margin-top:28px}</style>
<h1>Preact streaming / DPU test bed</h1>
<p>Same demo app (54 scenarios) served by each build of <code>preact-render-to-string</code>. Source, report and scripts:
<a href="https://github.com/MaxwellCohen/preact-eco-ci">MaxwellCohen/preact-eco-ci</a>. Start with <b>diagnostics</b> for each variant.</p>
<p><a href="/runs"><b>All runs (every individual measurement)</b></a> · <a href="/data/">raw JSON</a></p>
<h2>Variants</h2><table>${rows}</table>
${resultsHtml}
<p><small>Made with LLMs (Claude via Claude Code), directed by the repo owner. Expectations are proposals to review, not ground truth.</small></p>`);
writeFileSync('.build/index/wrangler.jsonc', JSON.stringify({ name: 'preact-eco-index', compatibility_date: '2026-01-01', assets: { directory: 'public' } }, null, 2));
console.log(vs.join(', '));
