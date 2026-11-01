# Preact streaming: DPU design comparison

Evidence for choosing how `preact-render-to-string` should stream Suspense completions with
[Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) (DPU).
Everything here is reproducible from this repo (except the two `local-*` variants, which are built from unpushed local commits); full tables are in [`results/DATA.md`](./results/DATA.md).

> **Made with LLMs.** The test pages, scripts, measurements harness and this write-up were produced with
> Claude (Anthropic) via Claude Code, directed by the repo owner. Expectations encoded in the scenarios are
> proposals to review, not ground truth. Statements marked *hypothesis* are unverified.

## What was compared

| variant | `preact-render-to-string` | completion format |
|---|---|---|
| `baseline` (= `main`) | upstream `main` `dc7d06b` | `<preact-island>` custom element + inline client script |
| `pr474` | [PR #474](https://github.com/preactjs/preact-render-to-string/pull/474) head `6a02913` | `<template for>` + `<?start>/<?end>` markers, MutationObserver polyfill |
| `local-end-stamp` | local `dpu-end-stamp` `3fb6f11` (**unpushed**; rebased on current `main`, not stacked on the PR branch) | `<template for>` + `<!--$p:id-->` end stamp, hydration + SVG handling |
| `local-react-style` | local `dpu-support-react-style` `c1cdbac` (**unpushed**, differs from the pushed commit) | `<template for>` + `<script>$RC("id")</script>` per chunk, one `window.$RC` init script |

All use the same `preact` (`MaxwellCohen/preact` `main` `921df34`) and the same demo app, deployed as separate
Cloudflare Workers. A control (upstream `main` + the fork's `preact`) matched `baseline` on every correctness check,
so differences come from the `preact-render-to-string` change.

## Headline results

| question | main | PR #474 | local end-stamp | local react-style |
|---|---|---|---|---|
| Correct final DOM, stream only (`hydrate=off`), 26 checks × 3 browsers | 23/26 | 26/26 | 26/26 | 26/26 |
| What `main` fails | `table-rows`, `svg-namespace`, `mathml-namespace` | – | – | – |
| `<svg><foreignObject>` boundary | ok | **hangs the main thread (all 3 browsers)** | ok | ok |
| Last-resolving boundary shown when hydration starts right after the stream (Firefox, WebKit) | ok | **lost in every run** (cell 8 of 16; cell 97 of 100) | ok | ok |
| Patch lag in Firefox (median over 16/60/100 boundaries) | 21–34 ms | 13–134 ms (includes the lost boundary) | 9–14 ms | −7…4 ms |
| Patch lag in Chromium / WebKit | ≈0–10 ms | ≈0–10 ms (WebKit: lost boundary) | ≈0–5 ms | ≈0–11 ms |
| Fixed overhead, first boundary (raw) | 1322 B | 1278 B | 1390 B | **885 B** |
| Per boundary, raw / gzip (est.) | 107.0 / 14.6 B | 107.9 / 17.4 B | 120.2 / 20.4 B | 131.8 / 19.9 B |
| Strict CSP, Chromium | fallbacks stay | works (native) | works (native) | works (native) |
| Strict CSP, Firefox / WebKit | fallbacks stay | 112 templates unapplied | 112 unapplied | 112 unapplied |
| Page errors / main-thread stalls >50 ms | none | none (except the hang above) | none | none |

### What the data supports

1. **Any DPU variant fixes real `main` problems.** Without client JS, `main` also fails `table-rows` (rows inserted
   into a `<tbody>`), and puts SVG/MathML boundaries in the HTML namespace. Hydration masks `table-rows` but not the
   namespace cases.
2. **PR #474 as opened has two defects the local end-stamp work resolves**, both reproducible on the live pages:
   (a) a boundary inside `<svg><foreignObject>` freezes the page in Chromium, Firefox and WebKit; (b) in Firefox and
   WebKit the last streamed boundary is missing when hydration runs right after the stream ends. It applies fine with
   `hydrate=off`, so this looks like a race between the final patch and hydration/observer teardown *(hypothesis; not
   root-caused)*.
3. **No timing penalty otherwise.** Patch lag for `local-end-stamp` and `local-react-style` is at or below `main` in
   every browser (interleaved runs, 5 per cell). Differences under ~16 ms are noise.
4. **Payload cost is small:** +3 to +6 B gzip per boundary vs `main`. `local-react-style` has the smallest fixed cost
   but the largest per-boundary raw cost (extra `<script>` per chunk).
5. **Strict CSP is unsolved by all of them** in browsers without native DPU (Firefox, WebKit here): inline scripts
   carry no nonce.

### The end stamp and "just use a newline"

Measured on the real `local-end-stamp` output (60 boundaries, gzip level 9): the current `<!--$p:-19321-->` stamp
costs 16 raw / 3.55 gzip bytes per boundary; a single `\n` costs 1 raw / 0.12 gzip; no stamp costs 0. The comment's
gzip cost is almost entirely the unique id (constant id ⇒ 0.32 B). So a newline would save ≈15 raw / ≈3.4 gzip bytes
per boundary (≈780 B raw, ≈200 B gzip on 60 boundaries; ≈1.1 KB raw, ≈300 B gzip on 85 stamps in the 100-cell page).
**Caveat:** the stamp's id is what ties it to a boundary. A bare newline carries no id, so the client would have to
infer the boundary by position. That has not been built or tested; this is a size projection only.

### Where the designs differ (from the emitted HTML, not benchmarks)

- **Trigger.** PR #474 / end-stamp: one `MutationObserver`; react-style: an explicit `$RC(id)` call per chunk, the
  script removes itself after running.
- **Per-chunk markup.** react-style adds a `<script>` per chunk; end-stamp adds a comment.
- **Global.** react-style defines `window.$RC` *(hypothesis: collides with React Fizz's global on mixed pages; untested)*.
- **Observability.** `$RC` lets the harness see per chunk whether the browser already consumed the template natively.

## Method

- Variants are pinned in [`versions.json`](./versions.json) (+ untracked `versions.local.json` for local checkouts) and
  built by `scripts/build-variant.mjs` (read-only clones, pack, build). Same demo app for every variant.
- **Correctness** (`scripts/compare.mjs`, `HYDRATE=off|late`): 26 checks on `/dpu` (14 s settle) plus an isolated
  `foreignObject` page, in Playwright Chromium, Firefox and WebKit. `hydrate=off` judges the stream/polyfill alone;
  `late` runs after client hydration and can hide a failed patch.
- **Timing** (`scripts/bench.mjs`): 5 iterations; each iteration visits every variant in a fresh random order
  (interleaved, fixes the order confound of the first report). *Patch lag* = visible − (responseStart + server delay),
  observed via MutationObserver plus a 16 ms layout scan. Scenarios: popcorning (16), many-boundaries (60), grid-100
  (100), and patched-counter interactivity with hydration `late`/`early`.
- **Payload** (`scripts/size.mjs`): raw bytes; gzip/brotli are **estimates** (decoded stream compressed locally).
- **CSP**: `?csp=strict` → `script-src 'self' 'nonce-…'`, nonces only on harness scripts.

## Limitations

- One machine/network/day. Timing resolution ≈16 ms. Chromium handled `<template for>` natively (native path);
  Firefox/WebKit exercised the polyfills.
- Not measured: low-end CPU/memory, throttled networks, real wire compression, >100 boundaries, bfcache, buffering
  proxies, intermediate visual states.
- `local-*` variants are unpushed commits; SHAs are recorded above and in each page's `/index.json`. To reproduce,
  push those commits (or point `versions.local.json` at your checkout).
- The cause of the PR #474 last-boundary loss and of the `foreignObject` hang were not investigated beyond isolating
  them to the stream format/polyfill; both are reproducible with `/s/popcorning` (Firefox/WebKit) and
  `/s/foreign-object`.

## Reproduce

```bash
npm install
node scripts/build-variant.mjs <variant> && (cd .build/<variant> && npx wrangler deploy)
HYDRATE=off node scripts/compare.mjs <variants…>   # also HYDRATE=late
node scripts/bench.mjs chromium 5                   # also firefox, webkit
node scripts/size.mjs <variants…> && node scripts/report.mjs
node scripts/build-index.mjs && (cd .build/index && npx wrangler deploy)   # landing page
```

Live pages per variant: `/` (54 scenarios + selection controls), `/dpu` (diagnostics), `/dpu?csp=strict`,
`/s/<id>`, `/index.json`. Landing page: https://preact-eco-index.to-email-max.workers.dev

## Decision guide (interpretation)

- Parity with the DPU spec and no hangs: `local-end-stamp` and `local-react-style` meet it equally; PR #474 as opened does not.
- Smallest per-boundary cost: end-stamp (comment, or a newline if id-less matching proves feasible).
- Smallest fixed cost, explicit control flow, per-chunk observability: react-style.
- Strict-CSP sites: none is sufficient in non-native browsers; a nonce hook or non-inline fallback is separate work.
