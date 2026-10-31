// Usage: node scripts/browser-check.mjs <baseUrl> <out.json> <off|late|early>
// Loads every scenario from <baseUrl>/index.json in Chromium with the given hydration mode and
// records leftover <template for>, leftover fallbacks, console errors/warnings and the stage HTML.
// Diff two runs (or off vs late/early, with <!-- --> markers stripped) to spot hydration issues.
// Needs `playwright` resolvable from the cwd (npm i -D playwright).
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const [base, out, mode] = process.argv.slice(2);
if (!base || !out || !['off', 'late', 'early'].includes(mode)) throw new Error('usage: browser-check.mjs <baseUrl> <out.json> <off|late|early>');

const { scenarios } = await (await fetch(base + '/index.json')).json();
const browser = await chromium.launch();
const res = {};
for (const sc of scenarios) {
	const page = await browser.newPage();
	const logs = [];
	page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(m.type() + ': ' + m.text().slice(0, 200)));
	page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 200)));
	try {
		await page.goto(`${base}/s/${sc.id}?hydrate=${mode}`, { waitUntil: 'load', timeout: 20000 });
	} catch (e) {
		logs.push('goto: ' + String(e).slice(0, 80));
	}
	await page.waitForTimeout(600);
	res[`${mode}:${sc.id}`] = {
		...(await page.evaluate(() => {
			const stage = document.querySelector('[data-slot=stage]');
			return {
				templates: document.querySelectorAll('template[for]').length,
				fallbacks: document.querySelectorAll('[data-testid=fallback]').length,
				html: stage ? stage.innerHTML : null
			};
		})),
		logs
	};
	await page.close();
}
await browser.close();
writeFileSync(out, JSON.stringify(res, null, 1));
