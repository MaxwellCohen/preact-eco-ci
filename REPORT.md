# Preact streaming: DPU design comparison

Evidence for choosing how `preact-render-to-string` should stream Suspense completions with
[Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) (DPU).
Everything here is reproducible from this repo; full tables are in [`results/DATA.md`](./results/DATA.md).

> **Made with LLMs.** The test pages, scripts, measurements harness and this write-up were produced with
> Claude (Anthropic) via Claude Code, directed by the repo owner. Expectations encoded in the scenarios are
> proposals to review, not ground truth. Statements marked *hypothesis* are unverified.

## What was compared

| variant | `preact-render-to-string` | `preact` | completion format |
|---|---|---|---|
| `baseline` | upstream `main` (`dc7d06b`) | upstream `main` | `<preact-island>` custom element + inline client script |
| `dpu-end-stamp` | fork branch `dpu-end-stamp` | fork `main` | `<template for="id">…</template><!--$p:id-->`; one inline MutationObserver polyfill |
| `dpu-support-react-style` | fork branch `dpu-support-react-style` | fork `main` | `<template for="id">…</template><script>$RC("id")</script>`; one inline `window.$RC` init script |
| `main-fork-preact` *(control)* | upstream `main` | fork `main` | same as baseline — used to prove `preact` version differences do not explain results |

The control scored identically to `baseline` on every correctness check, so the differences below come from the
`preact-render-to-string` change.

## Headline results

| question | baseline | dpu-end-stamp | dpu-support-react-style |
|---|---|---|---|
| Correct final DOM (27 scenarios × Chromium/Firefox/WebKit) | 25/27 | **27/27** | **27/27** |
| SVG / MathML boundary lands in the right namespace | ❌ | ✅ | ✅ |
| Patch lag vs. server resolve time (16–100 boundaries) | within ~±15 ms, Firefox ~20–30 ms | within ~±15 ms, Firefox ~11–15 ms | within ~±15 ms, Firefox ≈0 ms |
| Patched content → interactive (client script after stream / mid-stream) | ~110–130 ms / ~11–17 ms | ~93–137 ms / ~11–16 ms | ~95–121 ms / ~11–21 ms |
| Extra gzip bytes per boundary vs baseline (est.) | – | +5.5 B | +5.3 B |
| Extra raw bytes per boundary vs baseline | – | +12.5 B | +24.8 B |
| Fixed overhead (raw, first boundary) | 1322 B | 1250 B | **885 B** |
| Strict CSP (no nonce on stream scripts), Chromium | fallbacks stay (16) | **works** (native) | **works** (native) |
| Strict CSP, Firefox / WebKit | fallbacks stay (16) | **112 templates unapplied** | **112 templates unapplied** |
| Main-thread stall / page errors | none | none | none |

### What the data supports

1. **Either DPU design fixes a real correctness gap in `main`.** A Suspense boundary inside `<svg>` or `<math>` is
   inserted in the HTML namespace with `<preact-island>` (circle does not paint, MathML is not MathML). Both DPU
   branches handle it in all three browsers.
2. **No measurable timing penalty at ≤100 boundaries.** Patch lag differences in Chromium and WebKit are inside the
   measurement resolution (~16 ms scan interval). In Firefox, where the polyfill path runs, both DPU variants were
   at or below `baseline`; `dpu-support-react-style` was lowest. No long tasks, no stalls above ~20 ms, no page errors.
3. **Payload cost is small and similar.** About +5 B gzip per boundary for both DPU variants. In raw bytes
   `dpu-support-react-style` is larger per boundary (the per-chunk `<script>$RC(id)</script>` tags) but cheaper to
   start (smaller init script): it is larger than `main` once a page has more than roughly 18 boundaries (raw).
4. **Strict CSP is the real differentiator and neither design solves it.** Where the browser does not support DPU
   natively (Firefox, WebKit in these runs), both designs depend on inline scripts that carry no nonce, so a
   `script-src 'nonce-…'` page is left with unapplied templates. `main` has the same limitation for its client
   script. Chromium handles `<template for>` natively, so no script is needed there.

### Where the designs differ (from the emitted HTML, not from benchmarks)

- **Polyfill trigger.** `dpu-end-stamp` uses one `MutationObserver` over the document that disconnects after load;
  `dpu-support-react-style` runs an explicit `$RC(id)` call per chunk and removes each script after it runs.
- **Per-chunk markup.** `react-style` adds a `<script>` element per chunk (more DOM churn, easier to reason about);
  `end-stamp` adds only a comment node.
- **Global surface.** `react-style` defines `window.$RC`. *Hypothesis:* this name matches React Fizz's runtime global
  and could collide on a page that mixes both; not tested.
- **Native-vs-polyfill observability.** With `$RC` you can tell, per chunk, whether the browser already consumed
  the template natively (see the `/dpu` diagnostics page); `end-stamp` has no per-chunk hook.

## Method

- Variants are built from pinned repo/ref pairs in [`versions.json`](./versions.json) and deployed as separate
  Cloudflare Workers (`preact-eco-<variant>`); the same demo app and scenarios run on each.
- **Correctness** (`scripts/compare.mjs`): 27 scenarios on `/dpu`, final state after a 14 s settle, Playwright
  Chromium, Firefox and WebKit.
- **Timing** (`scripts/bench.mjs`): 5 runs per cell, fresh browser context per load. A `MutationObserver` plus a 16 ms
  scan records when each cell becomes laid out. *Patch lag* = visible − (responseStart + known server delay).
  Scenarios: popcorning (16 boundaries), many-boundaries (60), grid-100 (100), patched-counter interactivity with
  hydration `late` (script after stream) and `early` (async script mid-stream).
- **Payload** (`scripts/size.mjs`): raw bytes of the HTML stream; gzip/brotli are **estimated** by compressing the
  decoded stream locally, not measured on the wire.
- **CSP**: `?csp=strict` serves `script-src 'self' 'nonce-…'` with nonces only on the harness's own scripts.

## Limitations — read before relying on any number

- One machine, one network path, Cloudflare edge as seen from there, single day. Not a lab.
- Variants were benchmarked sequentially (all `baseline` runs, then the next variant), so **TTFB/FCP/LCP
  differences between variants (~100 ms in places) are confounded with time/cold-start and should be ignored.**
  Patch lag is relative to each page's own `responseStart` and is more robust. Interleaving runs would fix this.
- Timing resolution is ~16 ms; sub-16 ms differences are noise.
- Chromium in Playwright handled `<template for>` natively, so Chromium numbers measure the native path; Firefox
  and WebKit measure the polyfill path. Native support may differ across Chrome versions/flags.
- Not measured: CPU/memory on low-end devices, throttled networks, real compressed wire size, very large pages
  (>100 boundaries), hydration cost with DPU, back/forward cache, streaming through proxies that buffer.
- The final-state correctness checks do not capture intermediate states (flashes, ordering).
- Known issues seen in other implementations (e.g. a `foreignObject` hang in a separate playground) did **not**
  reproduce on these variants; that playground used a different completion script.

## Reproduce

```bash
npm install
node scripts/build-variant.mjs <variant>      # clone pinned refs read-only, pack, build the demo
cd .build/<variant> && npx wrangler deploy    # or run `npx wrangler dev`
node scripts/compare.mjs                      # correctness matrix  -> results/compare.md
node scripts/bench.mjs chromium 5             # timing (repeat for firefox, webkit)
node scripts/size.mjs                         # payload             -> results/size.json
node scripts/report.mjs                       # tables              -> results/DATA.md
```

Live pages (each variant): `/` all 54 scenarios with selection controls, `/dpu` diagnostics + curated set,
`/dpu?csp=strict`, `/s/<id>` single scenario, `/index.json` scenario list.

## Decision guide (interpretation, not measurement)

- If the priority is **correctness and parity with the DPU spec**, both branches meet it equally; `main` does not.
- If the priority is **smallest steady cost on long pages**, `dpu-end-stamp` (comment stamp, no per-chunk script).
- If the priority is **small fixed cost, per-chunk observability, and explicit control flow**,
  `dpu-support-react-style`.
- If the priority is **strict-CSP sites**, neither is sufficient yet in non-native browsers; a nonce hook or a
  non-inline fallback would be the next piece of work regardless of which design is chosen.
