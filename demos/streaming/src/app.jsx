import { Ctx, Scenario } from './lib.jsx';
import { basics } from './scenarios/basics.jsx';
import { edge } from './scenarios/edge.jsx';
import { races } from './scenarios/races.jsx';
import { special } from './scenarios/special.jsx';
import { more } from './scenarios/more.jsx';

export const GROUPS = ['basics', 'edge-cases', 'races', 'special', 'more'];

export function allScenarios(delays) {
	return [...basics(delays), ...edge(), ...races(), ...special(), ...more()];
}

export function App({ delays, only, skip, group, version }) {
	let list = allScenarios(delays);
	if (group) list = list.filter(s => s.group === group);
	if (only) list = list.filter(s => only.includes(s.id));
	if (skip) list = list.filter(s => !skip.includes(s.id));
	return (
		<div id="app">
			<h1>Preact streaming: {version.variant}</h1>
			<p class="meta">
				preact <code>{version.preact.repo}@{version.preact.ref}</code> (<code>{version.preact.sha.slice(0, 7)}</code>) ·
				preact-render-to-string <code>{version.rts.repo}@{version.rts.ref}</code> (<code>{version.rts.sha.slice(0, 7)}</code>) ·{' '}
				{list.length} scenarios
			</p>
			<nav>
				<a href="/">all</a>
				{GROUPS.map(g => <a href={`/?group=${g}`}>{g}</a>)}
				<span> | hydrate:</span>
				<a href="?hydrate=late">late</a> <a href="?hydrate=early">early</a> <a href="?hydrate=off">off</a>
				<span> | </span><a href="/index.json">index.json</a>
				<span> | </span><a href="?autofocus=1">autofocus on</a>
			</nav>
			<p class="meta">
				URL params: <code>?only=a,b</code> · <code>?skip=a,b</code> · <code>?group=races</code> · <code>?delays=300,900</code> ·{' '}
				<code>?scale=2</code> · <code>?hydrate=late|early|off</code> · <code>?autofocus=1</code> · <code>/s/&lt;id&gt;</code>
			</p>
			<ol class="toc">
				{list.map(s => <li><a href={`#${s.id}`}>{s.title}</a></li>)}
			</ol>
			{list.map(s => <div id={s.id}><Scenario s={s} /></div>)}
		</div>
	);
}

export { Ctx };
