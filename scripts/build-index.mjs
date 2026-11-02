// Builds .build/index (static landing page listing every deployed variant) from .build/*/src/version.json.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const LABEL = {
	baseline: ['main', 'Upstream main for preact + preact-render-to-string. Reference (<preact-island>).'],
	'main-fork-preact': ['control', 'Upstream preact-render-to-string main with the fork’s preact — proves preact version is not the variable.'],
	pr474: ['PR #474', 'preactjs/preact-render-to-string#474 as opened (template-for + MutationObserver polyfill).'],
	'dpu-end-stamp': ['end-stamp (pushed)', 'Pushed fork branch dpu-end-stamp (comment end stamp).'],
	'local-end-stamp': ['PR #474 line + local changes', 'Local dpu-end-stamp tip (unpushed commits): hydration + SVG handling using the stamp method.'],
	'dpu-support': ['dpu-support (PR #474 content)', 'Pushed dpu-support c1d0a66: <template for> + newline stamp (same code as PR #474 head e1e62e6).'],
	'dpu-support-react-style': ['react-style (pushed)', 'Pushed fork branch: <template for> + <script>$RC(id)</script>.'],
	'local-react-style': ['react-style (local)', 'Local dpu-support-react-style tip (differs from the pushed commit).'],
};
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const vs = readdirSync('.build').filter(d => existsSync(`.build/${d}/src/version.json`) && d !== 'index');
const order = Object.keys(LABEL);
vs.sort((a, b) => order.indexOf(a) - order.indexOf(b));

const rows = vs.map(v => {
	const j = JSON.parse(readFileSync(`.build/${v}/src/version.json`, 'utf8'));
	const [name, desc] = LABEL[v] ?? [v, ''];
	const link = (p, t) => `<a href="${host(v)}${p}">${t}</a>`;
	return `<tr><td><b>${name}</b><br><code>${v}</code></td><td>${desc}<br><small>rts <code>${j.rts.ref.split('/').pop()}@${j.rts.sha.slice(0, 7)}</code> · preact <code>${j.preact.sha.slice(0, 7)}</code></small></td>
<td>${link('/dpu', 'diagnostics')} · ${link('/dpu?csp=strict', 'strict CSP')} · ${link('/', 'all 54 scenarios')} · ${link('/s/popcorning', 'popcorning')} · ${link('/index.json', 'json')}</td></tr>`;
}).join('\n');

mkdirSync('.build/index/public', { recursive: true });
writeFileSync('.build/index/public/index.html', `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>preact-eco-ci — streaming / DPU variants</title>
<style>body{font:15px/1.45 system-ui,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#18181b}table{border-collapse:collapse;width:100%}td{border-top:1px solid #e4e4e7;padding:10px 8px;vertical-align:top}small{color:#52525b}code{background:#f4f4f5;padding:0 4px;border-radius:4px}</style>
<h1>Preact streaming / DPU test bed</h1>
<p>Same demo app (54 scenarios) served by each build of <code>preact-render-to-string</code>. Source, report and scripts:
<a href="https://github.com/MaxwellCohen/preact-eco-ci">MaxwellCohen/preact-eco-ci</a>. Start with <b>diagnostics</b> for each variant.</p>
<table>${rows}</table>
<p><small>Made with LLMs (Claude via Claude Code), directed by the repo owner. Expectations are proposals to review, not ground truth.</small></p>`);
writeFileSync('.build/index/wrangler.jsonc', JSON.stringify({ name: 'preact-eco-index', compatibility_date: '2026-01-01', assets: { directory: 'public' } }, null, 2));
console.log(vs.join(', '));
