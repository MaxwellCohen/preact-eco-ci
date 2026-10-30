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
		expected: 'Open with ?hydrate=off (client hydration masks it). BUG: only "outer" is shown and "inner" is lost, because its patch is emitted with no fallback markers to target. Should show inner + outer.',
		render: () => nested(300, 1200, 'oof'),
	},
	{
		id: 'orphan-inner-first', group: 'orphan', title: 'Orphan: inner resolves first, outer still pending',
		expected: 'Not user-visible: final DOM is correct. The stream still emits an inner patch with no markers (orphan) before the outer patch, which inlines the inner content. See view-source.',
		render: () => nested(1200, 300, 'oif'),
	},
];
