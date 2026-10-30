import { Component as PC } from 'preact';
import { Suspense } from 'preact/compat';
import { Fallback, Late } from '../lib.jsx';

function Boom() {
	throw new Error('boom');
}
class Catch extends PC {
	state = { err: false };
	static getDerivedStateFromError() { return { err: true }; }
	componentDidCatch() { this.setState({ err: true }); }
	render() { return this.state.err ? <p data-testid="caught">caught</p> : this.props.children; }
}
const fb = (t) => <Fallback text={t} />;

export const special = () => [
	{
		id: 'table-rows', group: 'special', title: 'Table rows',
		expected: 'Both <tr> rows appear inside the <tbody>, in order (3 rows total).',
		render: () => (
			<table><tbody>
				<tr><td>static</td></tr>
				<Suspense fallback={<tr data-testid="fallback"><td>loading</td></tr>}>
					<Late id="table-rows">
						<tr data-testid="row-a"><td>A</td></tr>
						<tr data-testid="row-b"><td>B</td></tr>
					</Late>
				</Suspense>
			</tbody></table>
		),
	},
	{
		id: 'select-options', group: 'special', title: 'Select options',
		expected: 'Three options in the <select>; the second is selected.',
		render: () => (
			<select data-testid="sel">
				<Suspense fallback={<option>loading</option>}>
					<Late id="select-options">
						<option value="1">one</option><option value="2" selected>two</option><option value="3">three</option>
					</Late>
				</Suspense>
			</select>
		),
	},
	{
		id: 'list-items', group: 'special', title: 'List items',
		expected: 'Three <li> children, no stray wrappers.',
		render: () => (
			<ul data-testid="ul">
				<Suspense fallback={<li>loading</li>}><Late id="list-items"><li>1</li><li>2</li><li>3</li></Late></Suspense>
			</ul>
		),
	},
	{
		id: 'textarea-value', group: 'special', title: 'Textarea default value',
		expected: "Textarea shows 'hello'.",
		render: () => (
			<Suspense fallback={fb()}><Late id="textarea-value"><textarea data-testid="ta" defaultValue="hello" /></Late></Suspense>
		),
	},
	{
		id: 'details-open', group: 'special', title: 'Details open state',
		expected: '<details open> is open after the patch.',
		render: () => (
			<Suspense fallback={fb()}><Late id="details-open"><details open data-testid="details"><summary>s</summary>body</details></Late></Suspense>
		),
	},
	{
		id: 'autofocus', group: 'special', title: 'Autofocus in a patch',
		expected: 'Records whether the patched input is focused (browser-dependent); must not throw.',
		render: () => (
			<Suspense fallback={fb()}><Late id="autofocus"><input data-testid="af" autofocus /></Late></Suspense>
		),
	},
	{
		id: 'inline-script', group: 'special', title: 'Inline script inside a patch',
		expected: 'Observed behaviour recorded via window.__scriptRan (scripts from declarative patches may not execute).',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="inline-script">
					<script dangerouslySetInnerHTML={{ __html: 'window.__scriptRan=(window.__scriptRan||0)+1' }} />
					<p data-testid="script-done">done</p>
				</Late>
			</Suspense>
		),
	},
	{
		id: 'text-only', group: 'special', title: 'Text-only boundary',
		expected: 'A text node replaces the fallback; no wrapper element needed.',
		render: () => (
			<p data-testid="text-host"><Suspense fallback="loading"><Late id="text-only">resolved text</Late></Suspense></p>
		),
	},
	{
		id: 'empty', group: 'special', title: 'Empty boundary',
		expected: 'Fallback is removed and nothing replaces it.',
		render: () => (
			<div data-testid="empty-host"><Suspense fallback={fb()}><Late id="empty" /></Suspense></div>
		),
	},
	{
		id: 'multi-root', group: 'special', title: 'Fragment with multiple roots',
		expected: 'Three sibling roots appear in order (text "123").',
		render: () => (
			<div data-testid="multi-host"><Suspense fallback={fb()}><Late id="multi-root"><b>1</b><i>2</i><u>3</u></Late></Suspense></div>
		),
	},
	{
		id: 'custom-element', group: 'special', title: 'Custom element',
		expected: 'The node is present either way (upgrades if defined).',
		render: () => (
			<Suspense fallback={fb()}><Late id="custom-element"><x-dpu-demo data-testid="ce">custom</x-dpu-demo></Late></Suspense>
		),
	},
	{
		id: 'foreign-object', group: 'special', title: 'HTML inside SVG foreignObject',
		expected: 'HTML paragraph renders in the XHTML namespace inside foreignObject. (Known to hang the pract-dpu build.)',
		render: () => (
			<svg width="200" height="60"><foreignObject width="200" height="60">
				<Suspense fallback={fb()}><Late id="foreign-object"><p data-testid="fo">html in svg</p></Late></Suspense>
			</foreignObject></svg>
		),
	},
	{
		id: 'error-boundary', group: 'special', title: 'Boundary that throws',
		expected: "Error boundary content ('caught') is shown; other scenarios unaffected.",
		render: () => (<Catch><Suspense fallback={fb()}><Boom /></Suspense></Catch>),
	},
	{
		id: 'slow-boundary', group: 'special', title: 'Slow boundary (8s) stays pending',
		expected: 'Fallback "still waiting" remains during the test window; page stays interactive.',
		render: () => (
			<Suspense fallback={fb('still waiting')}><Late id="slow-boundary" ms={8000}><p>finally</p></Late></Suspense>
		),
	},
	{
		id: 'entity-escaping', group: 'special', title: 'Entities and markup-like text',
		expected: 'Text "<b>&amp;</b> --> ]]>" is shown literally.',
		render: () => (
			<Suspense fallback={fb()}><Late id="entity-escaping"><p data-testid="ent">{'<b>&amp;</b> --> ]]>'}</p></Late></Suspense>
		),
	},
];
