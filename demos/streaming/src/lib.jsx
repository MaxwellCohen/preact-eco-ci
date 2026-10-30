import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

// Per-request state. `cache` makes a boundary's promise stable across re-renders;
// `scale` multiplies every delay (?scale=2). On the client the document is already
// resolved, so useDelay is a no-op (same contract as the pract-dpu playground).
export const Ctx = createContext({ cache: new Map(), scale: 1 });

export function useDelay(key, ms) {
	const { cache, scale } = useContext(Ctx);
	if (typeof window !== 'undefined' || ms <= 0) return;
	let e = cache.get(key);
	if (!e) {
		e = { done: false };
		e.promise = new Promise(r => setTimeout(r, ms * scale)).then(() => (e.done = true));
		cache.set(key, e);
	}
	if (!e.done) throw e.promise;
}

export function Late({ id, ms = 500, children }) {
	useDelay(id, ms);
	return <>{children}</>;
}

export const Fallback = ({ text = 'Loading…' }) => <p data-testid="fallback">{text}</p>;

/** Fixture card. `data-scenario` is the hook tests target. */
export function Scenario({ s }) {
	return (
		<section data-scenario={s.id} class="card">
			<h3>
				<a href={`/s/${s.id}`}>{s.title}</a> <small>{s.group}</small>
			</h3>
			<p class="expected">
				<b>Expected: </b>
				{s.expected}
			</p>
			<div data-slot="stage" class="stage">
				{s.render()}
			</div>
		</section>
	);
}
