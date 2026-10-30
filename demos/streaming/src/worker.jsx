import { renderToReadableStream } from 'preact-render-to-string/stream';
import { App, Ctx, allScenarios } from './app.jsx';
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
button{padding:4px 10px}`;

function head(opts) {
	const hydrate = opts.hydrate;
	return (
		`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
		`<title>Preact streaming — ${version.variant}</title><style>${CSS}</style>` +
		`<script type="application/json" id="__props">${JSON.stringify(opts.props).replace(/</g, '\\u003c')}</script>` +
		(hydrate === 'early' ? `<script async src="/client.js"></script>` : '') +
		`</head><body><div id="root">`
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

		let only = q.get('only') ? q.get('only').split(',') : undefined;
		const m = url.pathname.match(/^\/s\/([\w-]+)$/);
		if (m) only = [m[1]];
		const skip = q.get('skip') ? q.get('skip').split(',') : undefined;
		const group = q.get('group') || undefined;
		const autofocus = q.get('autofocus') === '1' || (only && only.length === 1 && only[0] === 'autofocus');
		const props = { delays, only, skip, group, version, autofocus };

		const stream = renderToReadableStream(
			<Ctx.Provider value={{ cache: new Map(), scale, autofocus }}><App {...props} /></Ctx.Provider>
		);
		// Stream: head chunk → app (suspense-streamed) → tail chunk.
		const enc = new TextEncoder();
		const body = new ReadableStream({
			async start(c) {
				c.enqueue(enc.encode(head({ hydrate, props })));
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
