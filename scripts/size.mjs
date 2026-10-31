// Payload comparison: raw / gzip / brotli bytes (estimated by compressing the decoded stream locally),
// per-boundary overhead, and fixed overhead. Writes results/size.json.
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const variants = ['baseline', 'dpu-end-stamp', 'dpu-support-react-style'];
const host = v => `https://preact-eco-${v}.to-email-max.workers.dev`;
const pages = { zero: ['/s/zero-delay', 0], one: ['/s/html-baseline', 1], popcorn: ['/s/popcorning', 16], many: ['/s/many-boundaries', 60], grid: ['/s/grid-100', 100], big: ['/s/big-boundary', 1] };

const out = {};
for (const v of variants) {
	out[v] = {};
	for (const [k, [path, n]] of Object.entries(pages)) {
		const buf = Buffer.from(await (await fetch(host(v) + path)).arrayBuffer());
		const html = buf.toString('utf8');
		const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].reduce((a, m) => a + Buffer.byteLength(m[0]), 0);
		out[v][k] = { boundaries: n, raw: buf.length, gzip: gzipSync(buf).length, brotli: brotliCompressSync(buf).length, scriptBytes: scripts,
			templates: (html.match(/<template for/g) || []).length, islands: (html.match(/<preact-island/g) || []).length, rcCalls: (html.match(/\$RC\(/g) || []).length };
	}
}
mkdirSync('results', { recursive: true });
writeFileSync('results/size.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1).slice(0, 1500));
