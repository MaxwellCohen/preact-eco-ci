# Variant comparison (2026-11-02)

Live `/dpu` page, 14s settle. Variants: baseline, pr474, local-end-stamp, local-react-style, dpu-support.

| variant | bytes | first chunk | total |
|---|---|---|---|
| baseline | 64713 | 233ms | 2682ms |
| pr474 | 64844 | 218ms | 2691ms |
| local-end-stamp | 66556 | 237ms | 2723ms |
| local-react-style | 67742 | 228ms | 2714ms |
| dpu-support | 64859 | 255ms | 2802ms |

## Scenario pass/fail

| scenario | baseline<br>chromium | baseline<br>firefox | baseline<br>webkit | pr474<br>chromium | pr474<br>firefox | pr474<br>webkit | local-end-stamp<br>chromium | local-end-stamp<br>firefox | local-end-stamp<br>webkit | local-react-style<br>chromium | local-react-style<br>firefox | local-react-style<br>webkit | dpu-support<br>chromium | dpu-support<br>firefox | dpu-support<br>webkit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| html-baseline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| popcorning | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| out-of-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| table-rows | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| select-options | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| list-items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| svg-namespace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| mathml-namespace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| style-hoist | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| inline-script | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| empty | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multi-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| text-only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| link-stylesheet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| iframe-srcdoc | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| big-boundary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patch-interactive | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| client-wins | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| adjacent-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nested-inner-first | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| many-boundaries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| zero-delay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| deep-nesting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| reverse-order | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| foreign-object (isolated page) | ✅ | ✅ | ✅ | **HUNG** | **HUNG** | **HUNG** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **passed** (checks above) | 23/26 | 23/26 | 23/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 | 26/26 |

## Patch diagnostics

| variant | browser | $RC inits | $RC calls | native | polyfill | leftover templates | leftover fallbacks | preact-islands | max stall ms | page errors |
|---|---|---|---|---|---|---|---|---|---|---|
| baseline | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10 | 0 |
| baseline | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 570 | 0 |
| baseline | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 0 |
| pr474 | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 0 |
| pr474 | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 738 | 0 |
| pr474 | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 0 |
| local-end-stamp | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 0 |
| local-end-stamp | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 137 | 0 |
| local-end-stamp | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 11 | 0 |
| local-react-style | chromium | 1 | 111 | 111 | 0 | 0 | 0 | 0 | 10 | 0 |
| local-react-style | firefox | 1 | 111 | 0 | 111 | 0 | 0 | 0 | 15 | 0 |
| local-react-style | webkit | 1 | 111 | 0 | 111 | 0 | 0 | 0 | 8 | 0 |
| dpu-support | chromium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 353 | 0 |
| dpu-support | firefox | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 65 | 0 |
| dpu-support | webkit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 0 |
