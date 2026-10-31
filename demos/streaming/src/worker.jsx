import { renderToReadableStream } from 'preact-render-to-string/stream';
import { App, Ctx, GROUPS, allScenarios } from './app.jsx';
import version from './version.json';

const CSS = `body{font:15px/1.4 system-ui,sans-serif;max-width:960px;margin:0 auto;padding:16px;color:#18181b;background:#fafafa}
nav a{margin-right:8px}.meta{color:#52525b;font-size:13px}.toc{columns:2;font-size:13px}
.card{background:#fff;border:1px solid #e4e4e7;border-radius:10px;padding:12px;margin:12px 0}
.card h3{margin:0 0 6px}.card small{color:#71717a;font-weight:400;margin-left:6px}
.expected{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;padding:6px 10px;font-size:13px;margin:6px 0}
.stage{border:1px dashed #d4d4d8;border-radius:6px;padding:10px;background:#fafafa;min-height:32px;overflow:auto}
.panel{border:1px solid #bae6fd;background:#f0f9ff;border-radius:6px;padding:8px;margin:4px 0}
.grid10{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.done{background:#a7f3d0;border-radius:4px;padding:6px;text-align:center}.pulse{background:#e4e4e7;border-radius:4px;padding:6px;text-align:center}
button{padding:4px 10px}
#dpu-diag{background:#fff;border:1px solid #e4e4e7;border-radius:10px;padding:10px 14px;margin:12px 0}#dpu-diag th{text-align:left;font-weight:400;padding-right:16px}#dpu-diag td{font-variant-numeric:tabular-nums}.ok{color:#047857;font-weight:600}.bad{color:#b91c1c;font-weight:700}#dpu-diag pre{font-size:12px;max-height:200px;overflow:auto}
#controls{background:#fff;border:1px solid #e4e4e7;border-radius:10px;padding:10px 14px;margin:12px 0}
#controls summary{cursor:pointer;font-weight:600}#controls fieldset{border:1px solid #e4e4e7;border-radius:8px;margin:8px 0;padding:6px 10px}
#controls legend{font-size:13px;color:#52525b}#controls label{display:inline-block;margin:2px 12px 2px 0;font-size:13px}
#controls .list{columns:2}#controls .list label{display:block}#controls .bar{position:sticky;bottom:0;background:#fff;padding:8px 0}`;

const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Server-rendered control panel (plain GET form: works with hydration off, no framework). */
function controls({ delays, scale, hydrate, autofocus, selected, nonce }) {
	const all = allScenarios(delays);
	const radio = (name, val, cur, label = val) =>
		`<label><input type="radio" name="${name}" value="${esc(val)}"${String(cur) === String(val) ? ' checked' : ''}> ${esc(label)}</label>`;
	const groups = GROUPS.map(g => {
		const items = all.filter(x => x.group === g).map(x =>
			`<label title="${esc(x.expected)}"><input type="checkbox" name="only" value="${x.id}" data-g="${g}"${selected.has(x.id) ? ' checked' : ''}> ${esc(x.title)}</label>`
		).join('');
		return `<fieldset><legend>${g} <a href="#" data-sel="${g}:1">all</a> / <a href="#" data-sel="${g}:0">none</a></legend><div class="list">${items}</div></fieldset>`;
	}).join('');
	return `<details id="controls" open><summary>Choose scenarios &amp; options</summary>
<form method="GET" action="/">
<fieldset><legend>Hydration</legend>${radio('hydrate', 'late', hydrate, 'late (after stream)')}${radio('hydrate', 'early', hydrate, 'early (mid-stream)')}${radio('hydrate', 'off', hydrate, 'off (no JS)')}</fieldset>
<fieldset><legend>Speed (delay ×)</legend>${[1, 2, 3, 5].map(n => radio('scale', n, scale, '×' + n)).join('')}
<label>delays <input name="delays" value="${esc(delays.join(','))}" size="14"></label></fieldset>
<fieldset><legend>Options</legend><label><input type="checkbox" name="autofocus" value="1"${autofocus ? ' checked' : ''}> enable autofocus scenario</label></fieldset>
<fieldset><legend>Scenarios <a href="#" data-sel="*:1">all</a> / <a href="#" data-sel="*:0">none</a></legend></fieldset>
${groups}
<div class="bar"><button type="submit">Run selected</button> <a href="/">reset</a></div>
</form>
<script${nonce ? ` nonce="${nonce}"` : ''}>document.addEventListener('click',function(e){var a=e.target.closest('[data-sel]');if(!a)return;e.preventDefault();var p=a.dataset.sel.split(':'),on=p[1]==='1';document.querySelectorAll('#controls input[name=only]').forEach(function(i){if(p[0]==='*'||i.dataset.g===p[0])i.checked=on})})</script>
</details>`;
}



// Curated set aimed at the "<template for> + $RC(id)" design (dpu-support-react-style).
export const DPU_SET = ['html-baseline', 'popcorning', 'nested', 'out-of-order', 'table-rows', 'select-options', 'list-items',
	'svg-namespace', 'mathml-namespace', 'style-hoist', 'foreign-object', 'inline-script', 'empty', 'multi-root', 'text-only',
	'nested-template', 'link-stylesheet', 'iframe-srcdoc', 'big-boundary', 'patch-interactive', 'client-wins', 'adjacent-boundaries',
	'nested-inner-first', 'many-boundaries', 'zero-delay', 'deep-nesting', 'reverse-order'];

/** Wraps window.$RC (defined later by the stream's init script) to record who applied each patch. */
const RECORDER = `(function(){
var log=window.__rc={calls:[],inits:0,errors:0,maxGap:0,t0:performance.now()},real;
Object.defineProperty(window,'$RC',{configurable:true,get:function(){return real&&wrap},set:function(f){log.inits++;real=f}});
function wrap(id){var had=!!document.querySelector('template[for="'+id+'"]');
 log.calls.push({id:id,t:Math.round(performance.now()-log.t0),by:had?'polyfill':'native'});return real(id)}
addEventListener('error',function(){log.errors++});
var last=performance.now();setInterval(function(){var n=performance.now();log.maxGap=Math.max(log.maxGap,n-last-100);last=n},100);
})();`;

const PANEL = `<section id="dpu-diag"><h2>DPU diagnostics</h2>
<table><tbody id="dpu-rows"></tbody></table>
<details><summary>per-chunk log</summary><pre id="dpu-log"></pre></details></section>
<script nonce="__N__">(function(){
function row(k,v,ok){return '<tr><th>'+k+'</th><td class="'+(ok===true?'ok':ok===false?'bad':'')+'">'+v+'</td></tr>'}
function paint(){var r=window.__rc,c=r.calls,nat=c.filter(function(x){return x.by==='native'}).length,
 left=document.querySelectorAll('template[for]').length,fb=document.querySelectorAll('[data-testid=fallback]').length,
 done=document.readyState==='complete';
 document.getElementById('dpu-rows').innerHTML=
  row('$RC init script runs (expect 1)',r.inits,r.inits===1)+
  row('$RC calls',c.length)+
  row('applied natively (template already consumed)',nat)+
  row('applied by polyfill (template still present)',c.length-nat)+
  row('leftover &lt;template for&gt; '+(done?'(final)':'(streaming…)'),left,done?left===0:undefined)+
  row('fallbacks still showing',fb)+
  row('uncaught errors',r.errors,r.errors===0)+
  row('worst main-thread stall (ms)',Math.round(r.maxGap),r.maxGap<500)+
  row('document.readyState',document.readyState);
 document.getElementById('dpu-log').textContent=c.map(function(x){return x.t+'ms  '+x.by+'  '+x.id}).join('\\n')}
paint();setInterval(paint,250)})();</script>`;

function head(opts) {
	const hydrate = opts.hydrate;
	return (
		`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
		`<title>Preact streaming — ${version.variant}</title><style>${CSS}</style>` +
		`<script type="application/json" id="__props">${JSON.stringify(opts.props).replace(/</g, '\\u003c')}</script>` +
		(opts.dpuPage ? `<script${opts.nonce ? ` nonce="${opts.nonce}"` : ''}>${RECORDER}</script>` : '') +
		(hydrate === 'early' ? `<script async src="/client.js"></script>` : '') +
		`</head><body>${opts.dpuPage ? PANEL.replace('__N__', opts.nonce || '') : ''}${controls({ ...opts.ui, nonce: opts.nonce })}<div id="root">`
	);
}
const tail = hydrate =>
	`</div>${hydrate === 'late' ? '<script defer src="/client.js"></script>' : ''}</body></html>`;

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const q = url.searchParams;
		const delays = (q.get('delays') || '300,900,1500').split(',').map(Number).filter(n => !isNaN(n));
		const scale = Number(q.get('scale') || 1);
		const hydrate = q.get('hydrate') || 'late'; // late | early | off

		if (url.pathname === '/index.json') {
			const list = allScenarios(delays).map(({ id, group, title, expected }) => ({ id, group, title, expected, url: `/s/${id}` }));
			return Response.json({ ...version, scenarios: list });
		}
		if (url.pathname === '/client.js' || url.pathname === '/health') {
			return env.ASSETS ? env.ASSETS.fetch(req) : new Response('ok');
		}

		const multi = k => q.getAll(k).flatMap(v => v.split(',')).filter(Boolean);
		let only = multi('only').length ? multi('only') : undefined;
		const dpuPage = url.pathname === '/dpu';
		if (dpuPage && !only) only = DPU_SET;
		const m = url.pathname.match(/^\/s\/([\w-]+)$/);
		if (m) only = [m[1]];
		const skip = multi('skip').length ? multi('skip') : undefined;
		const group = q.get('group') || undefined;
		const autofocus = q.get('autofocus') === '1' || (only && only.length === 1 && only[0] === 'autofocus');
		const props = { delays, only, skip, group, version, autofocus };
		const everyId = allScenarios(delays).map(x => x.id);
		const selected = new Set((only || everyId).filter(id => !(skip || []).includes(id)));
		const nonce = q.get('csp') === 'strict' ? crypto.randomUUID().replace(/-/g, '') : '';
		const ui = { delays, scale, hydrate, autofocus: !!autofocus, selected };

		const stream = renderToReadableStream(
			<Ctx.Provider value={{ cache: new Map(), scale, autofocus }}><App {...props} /></Ctx.Provider>
		);
		// Stream: head chunk → app (suspense-streamed) → tail chunk.
		const enc = new TextEncoder();
		const body = new ReadableStream({
			async start(c) {
				c.enqueue(enc.encode(head({ hydrate, props, ui, dpuPage, nonce })));
				const r = stream.getReader();
				for (;;) {
					const { done, value } = await r.read();
					if (done) break;
					c.enqueue(value);
				}
				c.enqueue(enc.encode(tail(hydrate)));
				c.close();
			},
		});
		return new Response(body, {
			headers: {
				'content-type': 'text/html; charset=utf-8',
				'cache-control': 'no-store',
				// ?csp=strict: only our nonced scripts + /client.js run; the stream's inline $RC scripts are blocked.
				...(nonce ? { 'content-security-policy': `script-src 'self' 'nonce-${nonce}'` } : {}),
			},
		});
	},
};
