import { Suspense } from 'preact/compat';
import { useState } from 'preact/hooks';
import { Fallback, Late } from '../lib.jsx';

function Counter({ name }) {
	const [n, setN] = useState(0);
	return (
		<button type="button" data-testid={`${name}-btn`} onClick={() => setN(v => v + 1)}>
			{name} clicks: <span data-testid={`${name}-count`}>{n}</span>
		</button>
	);
}
const fb = t => <Fallback text={t} />;

export const races = () => [
	{
		id: 'patch-interactive', group: 'races',
		title: 'Interactive content inside a streamed boundary',
		expected: 'Counter present after the patch and increments on click, whether the patch lands before or after hydration.',
		render: () => (
			<Suspense fallback={fb('Loading counter…')}>
				<Late id="patch-interactive" ms={400}><Counter name="patched" /></Late>
			</Suspense>
		),
	},
	{
		id: 'typed-input', group: 'races',
		title: 'User input in the shell before a sibling resolves',
		expected: 'Typed text is preserved after the sibling boundary patches in (input not re-created).',
		render: () => (<>
			<input data-testid="typed-input" placeholder="type here" />
			<Suspense fallback={fb('Loading sibling…')}>
				<Late id="typed-input" ms={800}><p data-testid="typed-sibling">sibling resolved</p></Late>
			</Suspense>
		</>),
	},
	{
		id: 'typed-input-inside', group: 'races',
		title: 'Input inside the fallback is replaced',
		expected: 'Fallback input disappears; exactly one (resolved) input remains.',
		render: () => (
			<Suspense fallback={<input data-testid="fb-input" placeholder="fallback input" />}>
				<Late id="typed-input-inside" ms={800}><input data-testid="done-input" placeholder="resolved input" /></Late>
			</Suspense>
		),
	},
	{
		id: 'focus-in-shell', group: 'races',
		title: 'Focus outside the boundary survives a patch',
		expected: 'A focused input keeps focus when a later boundary patches in.',
		render: () => (<>
			<input data-testid="focus-input" />
			<Suspense fallback={fb()}>
				<Late id="focus-in-shell" ms={900}><p data-testid="focus-done">done</p></Late>
			</Suspense>
		</>),
	},
	{
		id: 'click-before-hydration', group: 'races',
		title: 'Click on server HTML before hydration',
		expected: 'Button is inert HTML first; once hydrated, clicks increment. Early clicks need not replay.',
		render: () => (<>
			<Counter name="shell" />
			<Suspense fallback={fb()}>
				<Late id="click-before-hydration" ms={600}><p data-testid="click-done">done</p></Late>
			</Suspense>
		</>),
	},
	{
		id: 'client-wins', group: 'races',
		title: 'Client render beats a late patch',
		expected: 'Exactly one copy of the content exists; a stale server patch never duplicates or replaces it.',
		render: () => (
			<Suspense fallback={fb()}>
				<Late id="client-wins" ms={1800}><p data-testid="client-wins-content">content</p></Late>
			</Suspense>
		),
	},
	{
		id: 'adjacent-boundaries', group: 'races',
		title: 'Adjacent boundaries resolving in the same tick',
		expected: 'Both patch; no node from one is removed by the other.',
		render: () => (<>
			<Suspense fallback={fb('A…')}><Late id="adj-a" ms={500}><p data-testid="adj-a">A</p></Late></Suspense>
			<Suspense fallback={fb('B…')}><Late id="adj-b" ms={500}><p data-testid="adj-b">B</p></Late></Suspense>
		</>),
	},
	{
		id: 'nested-inner-first', group: 'races',
		title: 'Nested: inner resolves before outer',
		expected: 'Final DOM has outer content with inner content once, in order.',
		render: () => (
			<Suspense fallback={fb('outer…')}>
				<Late id="nest-outer" ms={1200}>
					<div data-testid="nest-outer">outer
						<Suspense fallback={fb('inner…')}>
							<Late id="nest-inner" ms={300}><p data-testid="nest-inner">inner</p></Late>
						</Suspense>
					</div>
				</Late>
			</Suspense>
		),
	},
	{
		id: 'many-boundaries', group: 'races', title: '60 boundaries, scattered order',
		expected: 'All 60 cells filled exactly once; none duplicated or dropped.',
		render: () => (
			<div class="grid10" data-testid="many-grid">
				{Array.from({ length: 60 }, (_, i) => (
					<Suspense key={i} fallback={<span>·</span>}>
						<Late id={`many-${i}`} ms={200 + ((i * 37) % 23) * 60}><span data-cell={i}>{i}</span></Late>
					</Suspense>
				))}
			</div>
		),
	},
];
