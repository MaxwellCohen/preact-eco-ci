import { Suspense } from 'preact/compat';
import { Fallback, Late } from '../lib.jsx';

const Panel = ({ label, ms, children }) => (
	<Late id={`panel:${label}`} ms={ms}>
		<div class="panel" data-testid={`panel-${label}`}>
			<b>{label}</b> resolved after {ms}ms {children}
		</div>
	</Late>
);
const S = ({ label, ms, children }) => (
	<Suspense fallback={<Fallback text={`Loading ${label}…`} />}>
		<Panel label={label} ms={ms}>{children}</Panel>
	</Suspense>
);

export const basics = (delays) => [
	{
		id: 'original-delays', group: 'basics',
		title: 'Original: boundaries from ?delays=',
		expected: 'One boundary per value in ?delays=300,900,1500; each resolves after its delay.',
		render: () => delays.map((ms, i) => <S key={i} label={`d${i}`} ms={ms} />),
	},
	{
		id: 'basic', group: 'basics', title: 'Basic boundary',
		expected: 'Shell is instant; panel streams in after 1.5s.',
		render: () => <S label="Profile" ms={1500} />,
	},
	{
		id: 'parallel', group: 'basics', title: 'Parallel boundaries',
		expected: 'Three siblings resolve at 800/1600/2400ms without blocking each other.',
		render: () => (<>
			<S label="Stats" ms={800} /><S label="Activity" ms={1600} /><S label="Billing" ms={2400} />
		</>),
	},
	{
		id: 'nested', group: 'basics', title: 'Nested boundaries',
		expected: 'Outer at 1s; inner fallback shows until 2.5s total.',
		render: () => (
			<Suspense fallback={<Fallback text="account shell…" />}>
				<Panel label="Account" ms={1000}>
					<Suspense fallback={<Fallback text="nested details…" />}>
						<Panel label="Details" ms={1500} />
					</Suspense>
				</Panel>
			</Suspense>
		),
	},
	{
		id: 'out-of-order', group: 'basics', title: 'Out-of-order reveal',
		expected: 'The fast panel (declared second) appears before the slow one (declared first).',
		render: () => (<><S label="slow-first" ms={2500} /><S label="fast-second" ms={600} /></>),
	},
	{
		id: 'grid-100', group: 'basics', title: '100-cell grid',
		expected: 'All 100 cells filled exactly once, delay (i % 7) × 100ms.',
		render: () => (
			<div class="grid10" data-testid="grid-100">
				{Array.from({ length: 100 }, (_, i) => (
					<Suspense key={i} fallback={<span>·</span>}>
						<Late id={`g${i}`} ms={(i % 7) * 100}><span data-cell={i}>{i}</span></Late>
					</Suspense>
				))}
			</div>
		),
	},
];
