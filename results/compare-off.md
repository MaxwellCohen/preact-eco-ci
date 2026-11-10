# Variant comparison (2026-11-10)

Live `/dpu` page, 14s settle. Variants: baseline, dpu-support, dpu-support-react-style.

| variant | bytes | first chunk | total |
|---|---|---|---|
| baseline | 65361 | 129ms | 2622ms |
| dpu-support | 64859 | 547ms | 3010ms |
| dpu-support-react-style | 67982 | 216ms | 2703ms |

## Scenario pass/fail

| scenario | baseline<br>chromium | baseline<br>firefox | baseline<br>webkit | dpu-support<br>chromium | dpu-support<br>firefox | dpu-support<br>webkit | dpu-support-react-style<br>chromium | dpu-support-react-style<br>firefox | dpu-support-react-style<br>webkit |
|---|---|---|---|---|---|---|---|---|---|
| html-baseline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| popcorning | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| out-of-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| table-rows | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| select-options | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| list-items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| svg-namespace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| mathml-namespace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| style-hoist | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| inline-script | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| empty | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multi-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| text-only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| link-stylesheet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| iframe-srcdoc | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| big-boundary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patch-interactive | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| client-wins | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| adjacent-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-inner-first | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| many-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| zero-delay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| deep-nesting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| reverse-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| foreign-object (isolated page) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **passed** (checks above) | 23/26 | 23/26 | 23/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 |

## Patch diagnostics

| variant | browser | $RC inits | $RC calls | native | polyfill | leftover templates | leftover fallbacks | preact-islands | max stall ms | page errors |
|---|---|---|---|---|---|---|---|---|---|---|
| baseline | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 |
| baseline | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16 | 0 |
| baseline | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 |
| dpu-support | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| dpu-support | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 13 | 0 |
| dpu-support | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 |
| dpu-support-react-style | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| dpu-support-react-style | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 254 | 0 |
| dpu-support-react-style | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 |
