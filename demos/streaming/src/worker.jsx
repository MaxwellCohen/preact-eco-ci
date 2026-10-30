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
#controls{background:#fff;border:1px solid #e4e4e7;border-radius:10px;padding:10px 14px;margin:12px 0}
#controls summary{cursor:pointer;font-weight:600}#controls fieldset{border:1px solid #e4e4e7;border-radius:8px;margin:8px 0;padding:6px 10px}
#controls legend{font-size:13px;color:#52525b}#controls label{display:inline-block;margin:2px 12px 2px 0;font-size:13px}
#controls .list{columns:2}#controls .list label{display:block}#controls .bar{position:sticky;bottom:0;background:#fff;padding:8px 0}`;

const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Server-rendered control panel (plain GET form: works with hydration off, no framework). */
function controls({ delays, scale, hydrate, autofocus, selected }) {
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
<script>document.addEventListener('click',function(e){var a=e.target.closest('[data-sel]');if(!a)return;e.preventDefault();var p=a.dataset.sel.split(':'),on=p[1]==='1';document.querySelectorAll('#controls input[name=only]').forEach(function(i){if(p[0]==='*'||i.dataset.g===p[0])i.checked=on})})</script>
</details>`;
}


function head(opts) {
	const hydrate = opts.hydrate;
	return (
		`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
		`<title>Preact streaming — ${version.variant}</title><style>${CSS}</style>` +
		`<script type="application/json" id="__props">${JSON.stringify(opts.props).replace(/</g, '\\u003c')}</script>` +
		(hydrate === 'early' ? `<script async src="/client.js"></script>` : '') +
		`</head><body>${controls(opts.ui)}<div id="root">`
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
		const m = url.pathname.match(/^\/s\/([\w-]+)$/);
		if (m) only = [m[1]];
		const skip = multi('skip').length ? multi('skip') : undefined;
		const group = q.get('group') || undefined;
		const autofocus = q.get('autofocus') === '1' || (only && only.length === 1 && only[0] === 'autofocus');
		const props = { delays, only, skip, group, version, autofocus };
		const everyId = allScenarios(delays).map(x => x.id);
		const selected = new Set((only || everyId).filter(id => !(skip || []).includes(id)));
		const ui = { delays, scale, hydrate, autofocus: !!autofocus, selected };

		const stream = renderToReadableStream(
			<Ctx.Provider value={{ cache: new Map(), scale, autofocus }}><App {...props} /></Ctx.Provider>
		);
		// Stream: head chunk → app (suspense-streamed) → tail chunk.
		const enc = new TextEncoder();
		const body = new ReadableStream({
			async start(c) {
				c.enqueue(enc.encode(head({ hydrate, props, ui })));
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
			headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
		});
	},
};
