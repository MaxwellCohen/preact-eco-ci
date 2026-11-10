# Variant comparison (2026-11-10)

Live `/dpu` page, 14s settle. Variants: baseline, dpu-support, dpu-support-react-style.

| variant | bytes | first chunk | total |
|---|---|---|---|
| baseline | 65025 | 163ms | 2699ms |
| dpu-support | 64859 | 261ms | 2733ms |
| dpu-support-react-style | 68502 | 159ms | 2651ms |

## Scenario pass/fail

| scenario | baseline<br>chromium | baseline<br>firefox | baseline<br>webkit | dpu-support<br>chromium | dpu-support<br>firefox | dpu-support<br>webkit | dpu-support-react-style<br>chromium | dpu-support-react-style<br>firefox | dpu-support-react-style<br>webkit |
|---|---|---|---|---|---|---|---|---|---|
| html-baseline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| popcorning | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| out-of-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| table-rows | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
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
| **passed** (checks above) | 24/26 | 24/26 | 24/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 |

## Patch diagnostics

| variant | browser | $RC inits | $RC calls | native | polyfill | leftover templates | leftover fallbacks | preact-islands | max stall ms | page errors |
|---|---|---|---|---|---|---|---|---|---|---|
| baseline | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 13 | 0 |
| baseline | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 14 | 0 |
| baseline | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 0 |
| dpu-support | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 0 |
| dpu-support | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16 | 0 |
| dpu-support | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 0 |
| dpu-support-react-style | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 0 |
| dpu-support-react-style | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 28 | 0 |
| dpu-support-react-style | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 31 | 0 |
