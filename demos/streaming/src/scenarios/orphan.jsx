import { Suspense } from 'preact/compat';
import { Late } from '../lib.jsx';

const fb = t => <p data-testid="fallback">{t}</p>;

// Outer boundary has TWO suspending children: a nested Suspense and a sibling.
// The inner boundary registers its own completion before the outer fallback replaces its markers.
const nested = (outerMs, innerMs, tag) => (
	<Suspense fallback={fb('outer…')}>
		<Suspense fallback={fb('inner…')}>
			<Late id={`${tag}-inner`} ms={innerMs}><b data-testid={`${tag}-inner`}>inner</b></Late>
		</Suspense>
		<Late id={`${tag}-outer`} ms={outerMs}><i data-testid={`${tag}-outer`}>outer</i></Late>
	</Suspense>
);

export const orphan = () => [
	{
		id: 'orphan-outer-first', group: 'orphan', title: 'Orphan: outer resolves first, inner still pending',
		expected: 'BUG if "inner" never appears (content lost): inner template is emitted with no fallback markers to patch. Should show outer + inner once.',
		render: () => nested(300, 1200, 'oof'),
	},
	{
		id: 'orphan-inner-first', group: 'orphan', title: 'Orphan: inner resolves first, outer still pending',
		expected: 'BUG if a leftover hidden <template for> / orphaned island remains in the DOM. Should show outer + inner once with no stray templates.',
		render: () => nested(1200, 300, 'oif'),
	},
];
