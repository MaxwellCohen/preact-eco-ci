## Timing (median of 5 runs per cell, deployed Workers, ms)

Patch lag = time a boundary became visible − (responseStart + its server delay). Lower is better; it isolates the cost of getting a resolved boundary onto the screen. Scenario `popcorning` = 16 boundaries, `many-boundaries` = 60, `grid-100` = 100.

### popcorning (16)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 119 | 148 | 148 | -3 | -0 | -0 | 2369 | 9 | 0 | 0 |
| chromium | dpu-support | 213 | 248 | 248 | -9 | 4 | 4 | 2466 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 190 | 240 | 240 | -13 | -7 | -7 | 2436 | 9 | 0 | 0 |
| firefox | baseline | 115 | 155 | 155 | 23 | 31 | 31 | 2387 | 4 | n/a | 0 |
| firefox | dpu-support | 134 | 157 | 157 | 13 | 18 | 18 | 2393 | 6 | n/a | 0 |
| firefox | dpu-support-react-style | 112 | 146 | 146 | -6 | 9 | 9 | 2365 | 4 | n/a | 0 |
| webkit | baseline | 198 | 244 | 256 | -4 | -1 | -1 | 2454 | 3 | n/a | 0 |
| webkit | dpu-support | 111 | 130 | 138 | -2 | 10 | 10 | 2368 | 3 | n/a | 0 |
| webkit | dpu-support-react-style | 137 | 161 | 170 | -6 | -1 | -1 | 2389 | 5 | n/a | 0 |

### many-boundaries (60)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 99 | 128 | 128 | -1 | 13 | 13 | 1626 | 9 | 0 | 0 |
| chromium | dpu-support | 184 | 228 | 228 | -0 | 1 | 1 | 1705 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 194 | 220 | 220 | 0 | 2 | 5 | 1710 | 9 | 0 | 0 |
| firefox | baseline | 160 | 202 | 202 | 23 | 34 | 47 | 1687 | 5 | n/a | 0 |
| firefox | dpu-support | 154 | 190 | 190 | 14 | 19 | 22 | 1668 | 5 | n/a | 0 |
| firefox | dpu-support-react-style | 92 | 130 | 130 | -2 | 3 | 7 | 1607 | 4 | n/a | 0 |
| webkit | baseline | 116 | 138 | 145 | -1 | 10 | 17 | 1643 | 8 | n/a | 0 |
| webkit | dpu-support | 181 | 203 | 210 | -4 | -1 | 2 | 1696 | 5 | n/a | 0 |
| webkit | dpu-support-react-style | 165 | 190 | 199 | 1 | 10 | 13 | 1684 | 8 | n/a | 0 |

### grid-100 (100)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 166 | 196 | 196 | 4 | 9 | 13 | 772 | 9 | 0 | 0 |
| chromium | dpu-support | 162 | 188 | 188 | 1 | 7 | 7 | 763 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 418 | 464 | 464 | -0 | 8 | 8 | 1019 | 9 | 0 | 0 |
| firefox | baseline | 159 | 190 | 190 | 23 | 38 | 40 | 782 | 9 | n/a | 0 |
| firefox | dpu-support | 166 | 201 | 201 | 15 | 19 | 19 | 768 | 5 | n/a | 0 |
| firefox | dpu-support-react-style | 263 | 321 | 321 | 4 | 24 | 24 | 866 | 5 | n/a | 0 |
| webkit | baseline | 131 | 157 | 165 | 12 | 28 | 31 | 760 | 11 | n/a | 0 |
| webkit | dpu-support | 150 | 183 | 192 | 1 | 11 | 11 | 759 | 3 | n/a | 0 |
| webkit | dpu-support-react-style | 134 | 159 | 170 | 9 | 19 | 22 | 768 | 8 | n/a | 0 |

## Patched content → interactive (`/s/patch-interactive`)

Gap between the patched counter becoming visible and the first click registering (ms). Includes hydration start mode: `late` = client script runs after the stream ends, `early` = async script mid-stream.

| browser | variant | hydrate | visible at | interactive at | gap (median) | runs never interactive |
|---|---|---|---|---|---|---|
| chromium | baseline | late | 497 | 590 | 114 | 0/5 |
| chromium | baseline | early | 254 | 270 | 11 | 0/5 |
| chromium | dpu-support | late | 818 | 1030 | 227 | 0/5 |
| chromium | dpu-support | early | 242 | 252 | 13 | 0/5 |
| chromium | dpu-support-react-style | late | 623 | 761 | 167 | 0/5 |
| chromium | dpu-support-react-style | early | 265 | 278 | 13 | 0/5 |
| firefox | baseline | late | 594 | 780 | 137 | 0/5 |
| firefox | baseline | early | 265 | 277 | 14 | 0/5 |
| firefox | dpu-support | late | 542 | 647 | 100 | 0/5 |
| firefox | dpu-support | early | 430 | 446 | 17 | 0/5 |
| firefox | dpu-support-react-style | late | 539 | 666 | 115 | 0/5 |
| firefox | dpu-support-react-style | early | 342 | 356 | 14 | 0/5 |
| webkit | baseline | late | 554 | 720 | 166 | 0/5 |
| webkit | baseline | early | 205 | 223 | 16 | 0/5 |
| webkit | dpu-support | late | 468 | 595 | 127 | 0/5 |
| webkit | dpu-support | early | 252 | 268 | 15 | 0/5 |
| webkit | dpu-support-react-style | late | 518 | 627 | 109 | 0/5 |
| webkit | dpu-support-react-style | early | 469 | 482 | 13 | 0/5 |

## Strict CSP (`script-src 'self' 'nonce-…'`, stream's inline scripts have no nonce)

| browser | variant | template[for] left unapplied | fallbacks left on screen |
|---|---|---|---|
| chromium | baseline | 0 | 16 |
| chromium | dpu-support | 0 | 0 |
| chromium | dpu-support-react-style | 0 | 0 |
| firefox | baseline | 0 | 16 |
| firefox | dpu-support | 112 | 10 |
| firefox | dpu-support-react-style | 112 | 10 |
| webkit | baseline | 0 | 16 |
| webkit | dpu-support | 112 | 10 |
| webkit | dpu-support-react-style | 112 | 10 |

## Payload (bytes; gzip/brotli are estimated by compressing the decoded stream locally, not measured on the wire)

| page | boundaries | variant | raw | gzip | brotli | inline script bytes |
|---|---|---|---|---|---|---|
| zero | 0 | baseline | 17472 | 5273 | 4415 | 775 |
| zero | 0 | dpu-support | 17516 | 5298 | 4433 | 798 |
| zero | 0 | dpu-support-react-style | 17576 | 5304 | 4449 | 822 |
| one | 1 | baseline | 18791 | 5864 | 4950 | 1946 |
| one | 1 | dpu-support | 18706 | 5892 | 4991 | 1857 |
| one | 1 | dpu-support-react-style | 18604 | 5865 | 4972 | 1719 |
| popcorn | 16 | baseline | 21172 | 6141 | 5151 | 1943 |
| popcorn | 16 | dpu-support | 21105 | 6222 | 5221 | 1854 |
| popcorn | 16 | dpu-support-react-style | 21468 | 6253 | 5219 | 2181 |
| many | 60 | baseline | 26486 | 6839 | 5471 | 1948 |
| many | 60 | dpu-support | 26507 | 7062 | 5508 | 1859 |
| many | 60 | dpu-support-react-style | 28234 | 7260 | 5572 | 3550 |
| grid | 100 | baseline | 30142 | 7367 | 5632 | 1941 |
| grid | 100 | dpu-support | 30214 | 7680 | 5797 | 1852 |
| grid | 100 | dpu-support-react-style | 32716 | 7966 | 5936 | 4318 |
| big | 1 | baseline | 34736 | 9306 | 5998 | 1945 |
| big | 1 | dpu-support | 34651 | 9333 | 6036 | 1856 |
| big | 1 | dpu-support-react-style | 34549 | 9310 | 6030 | 1718 |

### Projection: end stamp as a single newline instead of `<!--$p:id-->` (variants that emit stamps only; string substitution on the real output, NOT a working implementation, no behavior/timing measured)

| page | boundaries | variant | stamps | raw | raw if newline | gzip | gzip if newline | brotli | brotli if newline |
|---|---|---|---|---|---|---|---|---|---|

### Overhead model (raw bytes)

Fixed = bytes added once a page has ≥1 boundary (init script/CE) = `one − zero` minus that boundary's own content. Per-boundary = slope between 16, 60 and 100 boundaries.

| variant | one boundary − zero | per boundary (16→100) | per boundary gzip (16→100) |
|---|---|---|---|
| baseline | 1319 | 106.8 | 14.6 |
| dpu-support | 1190 | 108.4 | 17.4 |
| dpu-support-react-style | 1028 | 133.9 | 20.4 |

## Correctness, hydrate=off (stream + polyfill/native only, no client JS) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 23/26 | 23/26 | 23/26 | ok / ok / ok |
| dpu-support | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| dpu-support-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **table-rows** (baseline/chromium, baseline/firefox, baseline/webkit); **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)

## Correctness, hydrate=late (after client hydration; hydration can mask a failed patch) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 24/26 | 24/26 | 24/26 | ok / ok / ok |
| dpu-support | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| dpu-support-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)
