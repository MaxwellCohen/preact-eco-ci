import { Suspense } from 'preact/compat';
import { Fallback, Late } from '../lib.jsx';

const KERNELS = [420, 1680, 780, 2100, 1100, 540, 1900, 1320, 2260, 860, 1480, 640, 1980, 980, 1200, 1540];
const circle = <circle cx="80" cy="55" r="24" fill="tomato" stroke="white" stroke-width="2" />;

export const edge = () => [
	{
		id: 'popcorning', group: 'edge-cases', title: 'Popcorning (16 staggered siblings)',
		expected: 'All 16 cells filled, labeled 0–15, appearing one by one out of source order.',
		render: () => (
			<div class="grid4" data-testid="popcorn">
				{KERNELS.map((ms, i) => (
					<Suspense key={i} fallback={<span class="pulse">…</span>}>
						<Late id={`k${i}`} ms={ms}><span data-cell={i} class="done">{i}</span></Late>
					</Suspense>
				))}
			</div>
		),
	},
	{
		id: 'html-baseline', group: 'edge-cases', title: 'HTML — DPU works',
		expected: 'Fallback removed; text “Done — declarative DPU worked”.',
		render: () => (
			<Suspense fallback={<Fallback />}>
				<Late id="edge-html" ms={600}><p data-testid="html-done">Done — declarative DPU worked</p></Late>
			</Suspense>
		),
	},
	{
		id: 'svg-namespace', group: 'edge-cases', title: 'SVG — namespace',
		expected: 'A tomato circle paints; the node is a real SVGElement (svg namespace).',
		render: () => (
			<svg width="160" height="100" viewBox="0 0 160 100" data-testid="svg-stage">
				<Suspense fallback={<text x="8" y="20" font-size="12">Loading…</text>}>
					<Late id="edge-svg" ms={800}>{circle}</Late>
				</Suspense>
			</svg>
		),
	},
	{
		id: 'mathml-namespace', group: 'edge-cases', title: 'MathML — namespace',
		expected: 'Renders x + 1 as MathML elements (MathML namespace), not HTML text.',
		render: () => (
			<math display="block" data-testid="math-stage">
				<Suspense fallback={<mtext>Loading…</mtext>}>
					<Late id="edge-math" ms={800}><mi>x</mi><mo>+</mo><mn>1</mn></Late>
				</Suspense>
			</math>
		),
	},
	{
		id: 'style-hoist', group: 'edge-cases', title: 'Styles — hoist',
		expected: '“Styled hello” is tomato and bold; ideally the <style> is hoisted to <head>.',
		render: () => (
			<Suspense fallback={<Fallback />}>
				<Late id="edge-style" ms={900}>
					<style>{`.dpu-edge-style{color:tomato;font-weight:700}`}</style>
					<p class="dpu-edge-style" data-testid="styled">Styled hello</p>
				</Late>
			</Suspense>
		),
	},
];
