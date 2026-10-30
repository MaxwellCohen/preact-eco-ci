import { hydrate } from 'preact';
import { Ctx } from './lib.jsx';
import { App } from './app.jsx';

const props = JSON.parse(document.getElementById('__props').textContent);
window.__hydrateStart = performance.now();
hydrate(<Ctx.Provider value={{ cache: new Map(), scale: 1, autofocus: !!props.autofocus }}><App {...props} /></Ctx.Provider>, document.getElementById('root'));
window.__hydrated = performance.now();
