# Variant comparison (2026-10-31)

Live `/dpu` page, 14s settle. Variants: baseline, main-fork-preact, dpu-end-stamp, dpu-support-react-style.

| variant | bytes | first chunk | total |
|---|---|---|---|
| baseline | 64713 | 184ms | 2671ms |
| main-fork-preact | 64750 | 220ms | 2698ms |
| dpu-end-stamp | 66376 | 210ms | 2690ms |
| dpu-support-react-style | 67726 | 239ms | 2705ms |

## Scenario pass/fail

| scenario | baseline<br>chromium | baseline<br>firefox | baseline<br>webkit | main-fork-preact<br>chromium | main-fork-preact<br>firefox | main-fork-preact<br>webkit | dpu-end-stamp<br>chromium | dpu-end-stamp<br>firefox | dpu-end-stamp<br>webkit | dpu-support-react-style<br>chromium | dpu-support-react-style<br>firefox | dpu-support-react-style<br>webkit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| html-baseline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| popcorning | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| out-of-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| table-rows | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| select-options | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| list-items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| svg-namespace | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| mathml-namespace | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| style-hoist | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| foreign-object | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| inline-script | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| empty | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multi-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| text-only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| link-stylesheet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| iframe-srcdoc | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| big-boundary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patch-interactive | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| client-wins | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| adjacent-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-inner-first | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| many-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| zero-delay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| deep-nesting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| reverse-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **passed** | 25/27 | 25/27 | 25/27 | 25/27 | 25/27 | 25/27 | 27/27 | 27/27 | 27/27 | 27/27 | 27/27 | 27/27 |

## Patch diagnostics

| variant | browser | $RC inits | $RC calls | native | polyfill | leftover templates | leftover fallbacks | preact-islands | max stall ms | page errors |
|---|---|---|---|---|---|---|---|---|---|---|
| baseline | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17 | 0 |
| baseline | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16 | 0 |
| baseline | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 0 |
| main-fork-preact | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 21 | 0 |
| main-fork-preact | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18 | 0 |
| main-fork-preact | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 14 | 0 |
| dpu-end-stamp | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| dpu-end-stamp | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18 | 0 |
| dpu-end-stamp | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10 | 0 |
| dpu-support-react-style | chromium | 1 | 112 | 112 | 0 | 0 | 0 | 0 | 1 | 0 |
| dpu-support-react-style | firefox | 1 | 112 | 0 | 112 | 0 | 0 | 0 | 85 | 0 |
| dpu-support-react-style | webkit | 1 | 112 | 0 | 112 | 0 | 0 | 0 | 5 | 0 |
