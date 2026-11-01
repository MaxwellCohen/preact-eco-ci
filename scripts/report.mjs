// Builds results/DATA.md from results/bench-*.json, size.json and compare.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const rd = f => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
const bench = Object.fromEntries(['chromium', 'firefox', 'webkit'].map(b => [b, rd(`results/bench-${b}.json`)]).filter(([, v]) => v));
const size = rd('results/size.json');
const cmps = { off: rd('results/compare-off.json'), late: rd('results/compare-late.json') };
const V = Object.keys(Object.values(bench)[0]?.variants ?? {});
const med = a => { const s = a.filter(x => x != null && !isNaN(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const f = (x, d = 0) => (x == null ? '–' : x.toFixed(d));
const col = (rows, k) => med(rows.filter(r => !r.hung).map(r => r[k]));
let md = '';

md += `## Timing (median of ${Object.values(bench)[0]?.runs} runs per cell, deployed Workers, ms)\n\n`;
md += `Patch lag = time a boundary became visible − (responseStart + its server delay). Lower is better; it isolates the cost of getting a resolved boundary onto the screen. Scenario \`popcorning\` = 16 boundaries, \`many-boundaries\` = 60, \`grid-100\` = 100.\n\n`;
for (const [scn, label] of [['popcorn', 'popcorning (16)'], ['many', 'many-boundaries (60)'], ['grid', 'grid-100 (100)']]) {
	md += `### ${label}\n\n| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
	for (const [b, d] of Object.entries(bench)) for (const v of V) {
		const r = d.variants[v]?.[scn] ?? [];
		md += `| ${b} | ${v} | ${f(col(r, 'ttfb'))} | ${f(col(r, 'fcp'))} | ${f(col(r, 'lcp'))} | ${f(col(r, 'lagMedian'))} | ${f(col(r, 'lagP95'))} | ${f(col(r, 'lagMax'))} | ${f(col(r, 'lastVisible'))} | ${f(col(r, 'maxGap'))} | ${b === 'chromium' ? f(col(r, 'longTask')) : 'n/a'} | ${r.reduce((a, x) => a + (x.missing || 0), 0)} |\n`;
	}
	md += '\n';
}

md += `## Patched content → interactive (\`/s/patch-interactive\`)\n\nGap between the patched counter becoming visible and the first click registering (ms). Includes hydration start mode: \`late\` = client script runs after the stream ends, \`early\` = async script mid-stream.\n\n| browser | variant | hydrate | visible at | interactive at | gap (median) | runs never interactive |\n|---|---|---|---|---|---|---|\n`;
for (const [b, d] of Object.entries(bench)) for (const v of V) for (const mode of ['late', 'early']) {
	const r = (d.variants[v]?.interactive?.[mode] ?? []).filter(x => !x.hung);
	md += `| ${b} | ${v} | ${mode} | ${f(med(r.map(x => x.visible)))} | ${f(med(r.map(x => x.live)))} | ${f(med(r.map(x => x.gap)))} | ${r.filter(x => x.live == null).length}/${r.length} |\n`;
}

md += `\n## Strict CSP (\`script-src 'self' 'nonce-…'\`, stream's inline scripts have no nonce)\n\n| browser | variant | template[for] left unapplied | fallbacks left on screen |\n|---|---|---|---|\n`;
for (const [b, d] of Object.entries(bench)) for (const v of V) { const c = d.variants[v]?.csp; md += `| ${b} | ${v} | ${c ? c.leftoverTpl : 'n/a'} | ${c ? c.leftoverFb : 'n/a'} |\n`; }

if (size) {
	md += `\n## Payload (bytes; gzip/brotli are estimated by compressing the decoded stream locally, not measured on the wire)\n\n| page | boundaries | variant | raw | gzip | brotli | inline script bytes |\n|---|---|---|---|---|---|---|\n`;
	for (const k of ['zero', 'one', 'popcorn', 'many', 'grid', 'big']) for (const v of V) {
		const s = size[v][k]; md += `| ${k} | ${s.boundaries} | ${v} | ${s.raw} | ${s.gzip} | ${s.brotli} | ${s.scriptBytes} |\n`;
	}
	md += `\n### Projection: end stamp as a single newline instead of \`<!--$p:id-->\` (variants that emit stamps only; string substitution on the real output, NOT a working implementation, no behavior/timing measured)\n\n| page | boundaries | variant | stamps | raw | raw if newline | gzip | gzip if newline | brotli | brotli if newline |\n|---|---|---|---|---|---|---|---|---|---|\n`;
	for (const k of ['one', 'popcorn', 'many', 'grid']) for (const v of V) {
		const x = size[v][k]; if (!x.stamps) continue;
		md += `| ${k} | ${x.boundaries} | ${v} | ${x.stamps} | ${x.raw} | ${x.nlRaw} | ${x.gzip} | ${x.nlGzip} | ${x.brotli} | ${x.nlBrotli} |\n`;
	}
	md += `\n### Overhead model (raw bytes)\n\nFixed = bytes added once a page has ≥1 boundary (init script/CE) = \`one − zero\` minus that boundary's own content. Per-boundary = slope between 16, 60 and 100 boundaries.\n\n| variant | one boundary − zero | per boundary (16→100) | per boundary gzip (16→100) |\n|---|---|---|---|\n`;
	for (const v of V) {
		const s = size[v]; const pb = (a, b2, key) => (s[b2][key] - s[a][key]) / (s[b2].boundaries - s[a].boundaries);
		md += `| ${v} | ${s.one.raw - s.zero.raw} | ${f(pb('popcorn', 'grid', 'raw'), 1)} | ${f(pb('popcorn', 'grid', 'gzip'), 1)} |\n`;
	}
}

for (const [mode, cmp] of Object.entries(cmps)) {
	if (!cmp) continue;
	md += `\n## Correctness, hydrate=${mode} (${mode === 'off' ? 'stream + polyfill/native only, no client JS' : 'after client hydration; hydration can mask a failed patch'}) — \`/dpu\`, 26 checks + isolated foreignObject page\n\n| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |\n|---|---|---|---|---|\n`;
	for (const v of Object.keys(cmp)) {
		md += `| ${v} | ${['chromium', 'firefox', 'webkit'].map(b => { const r = cmp[v].browsers[b]; return r.hung ? 'HUNG' : `${Object.values(r.checks).filter(Boolean).length}/${Object.keys(r.checks).length}`; }).join(' | ')} | ${['chromium', 'firefox', 'webkit'].map(b => cmp[v].browsers[b].foreignObject).join(' / ')} |\n`;
	}
	const fails = Object.entries(cmp).flatMap(([v, x]) => Object.entries(x.browsers).flatMap(([b, r]) => Object.entries(r.checks || {}).filter(([, ok]) => !ok).map(([k]) => [k, v, b])));
	const byScn = {}; for (const [k, v, b] of fails) (byScn[k] ??= []).push(`${v}/${b}`);
	md += `\nFailing checks: ${Object.entries(byScn).map(([k, l]) => `**${k}** (${l.join(', ')})`).join('; ') || 'none'}\n`;
}
writeFileSync('results/DATA.md', md);
console.log(md);
