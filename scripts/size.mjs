// Payload comparison: raw / gzip / brotli bytes (estimated by compressing the decoded stream locally),
// per-boundary overhead, and fixed overhead. Writes results/size.json.
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const variants = process.argv.slice(2).length ? process.argv.slice(2) : ['baseline', 'pr474', 'local-end-stamp', 'local-react-style', 'dpu-support'];
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const pages = { zero: ['/s/zero-delay', 0], one: ['/s/html-baseline', 1], popcorn: ['/s/popcorning', 16], many: ['/s/many-boundaries', 60], grid: ['/s/grid-100', 100], big: ['/s/big-boundary', 1] };

// Boundary ids come from a counter that keeps growing inside a long-lived Worker isolate (-51 on a fresh one,
// -25000 after many requests), in every variant. That changes digit counts and therefore compressed size, so
// variants hit on differently-aged isolates are not comparable. Shift every id so the page's first id is -51.
function normalizeIds(html) {
	const ctx = /(\$s:|\$p:|\/\$s:|for="|data-target="|name="|\$RC\(")(-\d+)/g;
	const mags = [...html.matchAll(ctx)].map(m => -Number(m[2]));
	if (!mags.length) return html;
	const shift = Math.min(...mags) - 51;
	return html.replace(ctx, (_, pre, id) => pre + '-' + (-Number(id) - shift));
}

const out = {};
for (const v of variants) {
	out[v] = {};
	for (const [k, [path, n]] of Object.entries(pages)) {
		let buf = Buffer.from(await (await fetch(host(v) + path)).arrayBuffer());
		const html = normalizeIds(buf.toString('utf8'));
		buf = Buffer.from(html);
		const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].reduce((a, m) => a + Buffer.byteLength(m[0]), 0);
		// Projection only: what the stream would weigh if each `<!--$p:id-->` end stamp were a single newline.
		const nl = Buffer.from(html.replace(/<!--\$p:-?\d+-->/g, '\n'));
		out[v][k] = { nlRaw: nl.length, nlGzip: gzipSync(nl).length, nlBrotli: brotliCompressSync(nl).length, boundaries: n, raw: buf.length, gzip: gzipSync(buf).length, brotli: brotliCompressSync(buf).length, scriptBytes: scripts,
			templates: (html.match(/<template for/g) || []).length, islands: (html.match(/<preact-island/g) || []).length, stamps: (html.match(/<!--\$p:-?\d+-->/g) || []).length, rcCalls: (html.match(/\$RC\(/g) || []).length };
	}
}
mkdirSync('results', { recursive: true });
writeFileSync('results/size.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1).slice(0, 1500));
