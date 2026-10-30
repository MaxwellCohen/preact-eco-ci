import { renderToReadableStream } from 'preact-render-to-string/stream';
import { Suspense } from 'preact/compat';
import version from './version.json';

const cache = new Map();
function useDelayed(key, ms) {
	let e = cache.get(key);
	if (!e) {
		e = { done: false };
		e.promise = new Promise(r => setTimeout(r, ms)).then(() => (e.done = true));
		cache.set(key, e);
	}
	if (!e.done) throw e.promise;
}

function Slow({ id, ms }) {
	useDelayed(id, ms);
	return <section id={id}>Resolved <b>{id}</b> after {ms}ms</section>;
}

function App({ delays }) {
	return (
		<html>
			<head><title>Preact streaming — {version.variant}</title></head>
			<body>
				<h1>Preact streaming: {version.variant}</h1>
				<pre>{JSON.stringify(version, null, 2)}</pre>
				{delays.map((ms, i) => (
					<Suspense fallback={<p>Loading {i}…</p>}>
						<Slow id={`b${i}`} ms={ms} />
					</Suspense>
				))}
			</body>
		</html>
	);
}

export default {
	async fetch(req) {
		const url = new URL(req.url);
		// ?delays=300,900,1500 — per-boundary delays; ?_=<n> busts the per-isolate cache
		const delays = (url.searchParams.get('delays') || '300,900,1500').split(',').map(Number);
		cache.clear();
		const stream = renderToReadableStream(<App delays={delays} />);
		return new Response(stream, {
			headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
		});
	}
};
