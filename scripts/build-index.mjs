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
const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const vs = readdirSync('.build').filter(d => existsSync(`.build/${d}/src/version.json`) && d !== 'index');
const order = ['baseline','dpu-support','dpu-support-react-style','pr474','main-fork-preact','dpu-end-stamp','local-end-stamp','local-react-style'];
vs.sort((a, b) => order.indexOf(a) - order.indexOf(b));

const rows = vs.map(v => {
	const j = JSON.parse(readFileSync(`.build/${v}/src/version.json`, 'utf8'));
	const [name, desc] = LABEL[v] ?? [v, ''];
	const link = (p, t) => `<a href="${host(v)}${p}">${t}</a>`;
	return `<tr><td><b>${esc(name)}</b><br><code>${v}</code></td><td>${esc(desc)}<br><small>rts <code>${j.rts.ref.split('/').pop()}@${j.rts.sha.slice(0, 7)}</code> · preact <code>${j.preact.sha.slice(0, 7)}</code></small></td>
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
// Wire bytes for one boundary (id=5, fallback "loading...", content excluded, no nonce), from the deployed output.
const wire = {
	baseline: { per: 87, once: 1186 },
	'dpu-support': { per: 86, once: 1056 },
	'dpu-support-react-style': { per: 112, once: 863 },
};
const total = (v, c) => wire[v].once + wire[v].per * c;
const num = x => Number(x).toLocaleString('en-US');
const BR = ['chromium', 'firefox', 'webkit'];
const lag60 = (b, v) => n(med((B[b]?.[v]?.many ?? []).filter(x => !x.hung).map(x => x.lagMedian)));
const allPass = (c, v) => c?.[v] && Object.values(c[v].browsers).every(r => !r.hung && Object.values(r.checks).every(Boolean));
const failing = (c, v) => c?.[v] ? [...new Set(Object.values(c[v].browsers).flatMap(r => Object.entries(r.checks).filter(([, ok]) => !ok).map(([k]) => k)))] : [];
const headSha = v => { try { return JSON.parse(readFileSync(`.build/${v}/src/version.json`, 'utf8')).rts.sha.slice(0, 7); } catch { return null; } };
const prsPass = allPass(cmpOff, 'dpu-support') && allPass(cmpLate, 'dpu-support') && allPass(cmpOff, 'dpu-support-react-style') && allPass(cmpLate, 'dpu-support-react-style');
const mainFails = failing(cmpOff, 'baseline');
const gz = v => pb(v, 'gzip');
const sec = (title, note) => `<tr class="sec"><th colspan=4>${title}${note ? ` <small>${note}</small>` : ''}</th></tr>`;
const resultsHtml = size ? `<h2>Results: main vs #474 vs #490</h2>
<p>Three ways to stream a Suspense completion, measured on the deployed Workers above in Chromium, Firefox and WebKit.</p>
<ul class="k">
<li><b>main</b> — <code>&lt;preact-island&gt;</code> custom element plus an inline client script.</li>
<li><b>#474</b> — <code>&lt;template for&gt;</code>; browsers without native support are patched by a polyfill in the init script.</li>
<li><b>#490</b> — <code>&lt;template for&gt;</code> followed by a <code>$PRS(id)</code> script per chunk, with one small init script${headSha('dpu-support-react-style') ? ` (head <code>${headSha('dpu-support-react-style')}</code>)` : ''}.</li>
</ul>
<h3>What the numbers say</h3>
<ul class="k">
<li><b>Correctness:</b> ${prsPass ? 'both PRs pass all 26 checks in every browser, streaming alone and after hydration' : 'see the table — not every check passes for both PRs'}.${mainFails.length ? ` main fails ${mainFails.length} when streaming alone (${mainFails.map(x => `<code>${esc(x)}</code>`).join(', ')}).` : ''}</li>
<li><b>Speed:</b> no meaningful difference. In all three, content shows within about a frame of arriving. The one repeatable gap is Firefox at 60 boundaries: main ${lag60('firefox', 'baseline')} ms, #474 ${lag60('firefox', 'dpu-support')} ms, #490 ${lag60('firefox', 'dpu-support-react-style')} ms.</li>
<li><b>Size:</b> #474 costs the same per boundary as main (${wire['dpu-support'].per} vs ${wire.baseline.per} bytes). #490 adds ${wire['dpu-support-react-style'].per - wire['dpu-support'].per} bytes per boundary for its script call (about ${(gz('dpu-support-react-style') - gz('dpu-support')).toFixed(0)} after gzip) and has the smallest one-time script: ${num(wire['dpu-support-react-style'].once)} bytes vs ${num(wire['dpu-support'].once)} and ${num(wire.baseline.once)}. That makes #490 the smallest up to ${Math.floor((wire['dpu-support'].once - wire['dpu-support-react-style'].once) / (wire['dpu-support-react-style'].per - wire['dpu-support'].per))} boundaries and #474 the smallest beyond that.</li>
<li><b>Inline scripts blocked</b> (strict CSP, no nonce): Chromium still applies both PRs natively. Firefox and WebKit need the script, so fallbacks stay. main leaves its fallbacks in every browser.</li>
</ul>
<table class="r"><thead><tr><th></th>${RV.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead><tbody>
${sec('Correctness', 'checks passed of 26 · Chromium · Firefox · WebKit')}
${rr('Streaming alone', v => pass(cmpOff, v))}${rr('After hydration', v => pass(cmpLate, v))}
${sec('Speed', 'median ms, lower is better')}
${BR.map(b => rr(`Delay before content shows, ${{chromium: 'Chromium', firefox: 'Firefox', webkit: 'WebKit'}[b]} <small>16 / 60 / 100 boundaries</small>`, v => lag(b, v))).join('')}
${rr('Visible → clickable, hydration after the stream <small>C / F / W</small>', v => gap(v, 'late'))}${rr('Visible → clickable, hydration mid-stream <small>C / F / W</small>', v => gap(v, 'early'))}
${sec('Bytes on the wire', 'raw, content excluded')}
${rr('Per boundary', v => wire[v].per)}${rr('Once per page', v => num(wire[v].once))}
${[1, 10, 100].map(c => rr(`Total, ${c} boundar${c === 1 ? 'y' : 'ies'}`, v => num(total(v, c)))).join('')}
${sec('Demo pages as served', 'compression estimated locally')}
${rr('Per boundary <small>raw / gzip / brotli</small>', v => `${pb(v, 'raw').toFixed(1)} / ${pb(v, 'gzip').toFixed(1)} / ${pb(v, 'brotli').toFixed(1)}`)}${rr('60-boundary page, gzip', v => num(size[v].many.gzip))}${rr('100-boundary page, gzip', v => num(size[v].grid.gzip))}
${sec('Inline scripts blocked', 'strict CSP · C / F / W')}
${rr('Templates left unapplied', v => v === 'baseline' ? 'n/a' : BR.map(b => B[b]?.[v]?.csp?.leftoverTpl ?? '–').join(' / '))}${rr('Fallbacks left on screen', v => BR.map(b => B[b]?.[v]?.csp?.leftoverFb ?? '–').join(' / '))}
</tbody></table>
<p><small>5 interleaved runs per cell. Timer resolution is about 16 ms, and the “visible → clickable” rows move between runs by as much as the columns differ, so read them as equal. Negative delays mean content showed before the nominal server delay elapsed. Method and full write-up: <a href="https://github.com/MaxwellCohen/preact-eco-ci/blob/main/REPORT.md">REPORT.md</a> · <a href="/runs">every run</a>.</small></p>` : '';

mkdirSync('.build/index/public', { recursive: true });

// ---- Raw data: copy JSON + generate a page with every individual run ----
import { copyFileSync, readdirSync as rd } from 'node:fs';
mkdirSync('.build/index/public/data/earlier', { recursive: true });
for (const f of rd('results')) if (f.endsWith('.json') || f.endsWith('.md')) copyFileSync(`results/${f}`, `.build/index/public/data/${f}`);
if (existsSync('results/prev')) for (const f of rd('results/prev')) copyFileSync(`results/prev/${f}`, `.build/index/public/data/earlier/${f}`);

const listing = (dir, base) => rd(dir).filter(f => /\.(json|md)$/.test(f)).map(f => `<li><a href="${base}${f}">${f}</a></li>`).join('');
writeFileSync('.build/index/public/data/index.html', `<!doctype html><meta charset=utf-8><title>raw data</title><h1>Raw data</h1><p><a href="/">← back</a> · <a href="/runs">all runs (readable)</a></p><h2>Latest run set (main, #474, #490)</h2><ul>${listing('results', '/data/')}</ul>${existsSync('results/prev') ? `<h2>Previous run set (#490 at its earlier head 44c96f0)</h2><ul>${listing('results/prev', '/data/earlier/')}</ul>` : ''}`);
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
<style>body{font:15px/1.45 system-ui,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#18181b}table{border-collapse:collapse;width:100%}td{border-top:1px solid #e4e4e7;padding:10px 8px;vertical-align:top}small{color:#52525b}code{background:#f4f4f5;padding:0 4px;border-radius:4px}table.r th{text-align:left;font-weight:500;padding:3px 8px;border-top:1px solid #e4e4e7}table.r td{padding:3px 8px;border-top:1px solid #e4e4e7;font-variant-numeric:tabular-nums}table.r thead th{font-weight:700}table.r tr.sec th{padding-top:14px;font-weight:700;border-top:2px solid #a1a1aa}table.r small,ul.k small{font-weight:400}ul.k{padding-left:20px}ul.k li{margin:4px 0}h2{margin-top:28px}h3{margin:18px 0 4px}</style>
<h1>Preact streaming / DPU test bed</h1>
<p>Same demo app (54 scenarios) served by each build of <code>preact-render-to-string</code>. Source, report and scripts:
<a href="https://github.com/MaxwellCohen/preact-eco-ci">MaxwellCohen/preact-eco-ci</a>. Start with <b>diagnostics</b> for each variant.</p>
<p><a href="/runs"><b>All runs (every individual measurement)</b></a> · <a href="/data/">raw JSON</a></p>
<h2>Variants</h2><table>${rows}</table>
${resultsHtml}
<p><small>Made with LLMs (Claude via Claude Code), directed by the repo owner. Expectations are proposals to review, not ground truth.</small></p>`);
writeFileSync('.build/index/wrangler.jsonc', JSON.stringify({ name: 'preact-eco-index', compatibility_date: '2026-01-01', assets: { directory: 'public' } }, null, 2));
console.log(vs.join(', '));
