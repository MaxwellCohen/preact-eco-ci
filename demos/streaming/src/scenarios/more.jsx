import { Component as PC } from 'preact';
import { Suspense } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { Fallback, Late } from '../lib.jsx';

const fb = t => <Fallback text={t} />;
const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

function EffectCount() {
	const [runs, setRuns] = useState(0);
	useEffect(() => setRuns(r => r + 1), []);
	return <p data-testid="effect-runs">effect runs: <span data-testid="effect-count">{runs}</span></p>;
}
function Mismatch() {
	// Differs between server and client render on purpose.
	return <p data-testid="mismatch">{typeof window === 'undefined' ? 'server' : 'client'}</p>;
}
function ControlledForm() {
	const [v, setV] = useState('');
	return (
		<form data-testid="form" onSubmit={e => e.preventDefault()}>
			<input data-testid="ctl" value={v} onInput={e => setV(e.currentTarget.value)} />
			<span data-testid="ctl-echo">{v}</span>
		</form>
	);
}

export const more = () => [
	{
		id: 'zero-delay', group: 'more', title: 'Already-resolved boundary (0ms)',
		expected: 'Content is in the initial shell; no fallback and no completion needed.',
		render: () => <Suspense fallback={fb()}><Late id="zero" ms={0}><p data-testid="zero-done">instant</p></Late></Suspense>,
	},
	{
		id: 'deep-nesting', group: 'more', title: 'Five levels of nesting',
		expected: 'Levels 1–5 each appear once, nested in order.',
		render: () => {
			const L = ({ n }) => n > 5 ? null : (
				<Suspense fallback={fb(`level ${n}…`)}>
					<Late id={`deep-${n}`} ms={250}><div data-level={n}>level {n}<L n={n + 1} /></div></Late>
				</Suspense>
			);
			return <L n={1} />;
		},
	},
	{
		id: 'reverse-order', group: 'more', title: 'Reverse-order resolution',
		expected: 'Five siblings declared slowest-first resolve fastest-first; final DOM order is still source order 0–4.',
		render: () => (
			<div data-testid="reverse">
				{[0, 1, 2, 3, 4].map(i => (
					<Suspense key={i} fallback={<span>…</span>}>
						<Late id={`rev-${i}`} ms={(5 - i) * 300}><span data-cell={i}>{i}</span></Late>
					</Suspense>
				))}
			</div>
		),
	},
	{
		id: 'big-boundary', group: 'more', title: 'Large boundary (600 nodes)',
		expected: '600 <p> children arrive in one patch, none dropped.',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="big" ms={600}><div data-testid="big">{Array.from({ length: 600 }, (_, i) => <p key={i} data-i={i}>row {i}</p>)}</div></Late>
			</Suspense>
		),
	},
	{
		id: 'dialog-open', group: 'more', title: '<dialog open>',
		expected: 'Dialog element present with the open attribute.',
		render: () => <Suspense fallback={fb()}><Late id="dialog"><dialog open data-testid="dlg">hi</dialog></Late></Suspense>,
	},
	{
		id: 'iframe-srcdoc', group: 'more', title: 'iframe srcdoc',
		expected: 'iframe loads its srcdoc content after the patch.',
		render: () => <Suspense fallback={fb()}><Late id="iframe"><iframe data-testid="ifr" srcdoc="<p id=x>inside</p>" /></Late></Suspense>,
	},
	{
		id: 'img-load', group: 'more', title: 'Image inside a patch',
		expected: 'img.complete and naturalWidth > 0 after load.',
		render: () => <Suspense fallback={fb()}><Late id="img"><img data-testid="img" src={GIF} alt="" /></Late></Suspense>,
	},
	{
		id: 'link-stylesheet', group: 'more', title: '<link rel=stylesheet> inside a patch',
		expected: 'Paragraph is green once the linked stylesheet applies.',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="link">
					<link rel="stylesheet" href="data:text/css,.lnk{color:rgb(0,128,0)}" />
					<p class="lnk" data-testid="lnk">linked</p>
				</Late>
			</Suspense>
		),
	},
	{
		id: 'nested-template', group: 'more', title: '<template> element inside a patch',
		expected: 'The inner template stays inert (content not rendered) and is not consumed by the completion.',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="ntpl"><template data-testid="inner-tpl"><p>inert</p></template><p data-testid="ntpl-done">done</p></Late>
			</Suspense>
		),
	},
	{
		id: 'optgroup', group: 'more', title: 'Option inside optgroup',
		expected: 'Two options appear inside the optgroup.',
		render: () => (
			<select><optgroup label="g" data-testid="og">
				<Suspense fallback={<option>loading</option>}><Late id="og"><option>x</option><option>y</option></Late></Suspense>
			</optgroup></select>
		),
	},
	{
		id: 'colgroup', group: 'more', title: '<col> inside colgroup',
		expected: 'Two <col> elements appear inside the colgroup.',
		render: () => (
			<table><colgroup data-testid="cg">
				<Suspense fallback={null}><Late id="cg"><col /><col /></Late></Suspense>
			</colgroup><tbody><tr><td>a</td><td>b</td></tr></tbody></table>
		),
	},
	{
		id: 'inside-anchor', group: 'more', title: 'Boundary inside an <a>',
		expected: 'Link text resolves in place; the anchor is not duplicated.',
		render: () => <a href="#x" data-testid="anchor"><Suspense fallback="loading…"><Late id="anchor">resolved link</Late></Suspense></a>,
	},
	{
		id: 'unicode', group: 'more', title: 'Unicode, RTL and script-like text',
		expected: 'Text renders literally, including emoji, RTL and "</script><b>".',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="unicode"><p data-testid="uni">{'héllo 👩‍👩‍👧 שלום </script><b>x</b>'}</p></Late>
			</Suspense>
		),
	},
	{
		id: 'svg-text', group: 'more', title: 'Boundary inside SVG <text>',
		expected: 'The tspan text appears, in the SVG namespace.',
		render: () => (
			<svg width="200" height="30"><text x="4" y="20">
				<Suspense fallback="…"><Late id="svgtext"><tspan data-testid="tspan">svg text</tspan></Late></Suspense>
			</text></svg>
		),
	},
	{
		id: 'attrs', group: 'more', title: 'Boolean, data and style attributes',
		expected: 'hidden, disabled, data-*, and inline style survive the patch.',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="attrs"><button data-testid="attrs" disabled data-x="1" style="color:red" hidden>b</button></Late>
			</Suspense>
		),
	},
	{
		id: 'contenteditable', group: 'more', title: 'contenteditable inside a patch',
		expected: 'The element is editable (isContentEditable) after the patch.',
		render: () => <Suspense fallback={fb()}><Late id="ce"><div contenteditable data-testid="cedit">edit me</div></Late></Suspense>,
	},
	{
		id: 'hydration-mismatch', group: 'more', title: 'Server/client text mismatch',
		expected: 'Records which text wins ("server" vs "client") and that hydration does not throw.',
		render: () => <Mismatch />,
	},
	{
		id: 'effect-once', group: 'more', title: 'useEffect runs exactly once after hydration',
		expected: 'effect runs: 1 (not 0, not 2) once hydrated.',
		render: () => <Suspense fallback={fb()}><Late id="effect" ms={300}><EffectCount /></Late></Suspense>,
	},
	{
		id: 'controlled-form', group: 'more', title: 'Controlled input beside a streaming boundary',
		expected: 'Typing echoes, and the value survives a sibling patch.',
		render: () => (<>
			<ControlledForm />
			<Suspense fallback={fb()}><Late id="cform" ms={900}><p data-testid="cform-done">done</p></Late></Suspense>
		</>),
	},
];
