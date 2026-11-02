## Timing (median of 5 runs per cell, deployed Workers, ms)

Patch lag = time a boundary became visible − (responseStart + its server delay). Lower is better; it isolates the cost of getting a resolved boundary onto the screen. Scenario `popcorning` = 16 boundaries, `many-boundaries` = 60, `grid-100` = 100.

### popcorning (16)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 155 | 188 | 188 | -8 | 27 | 27 | 2406 | 8 | 0 | 0 |
| chromium | pr474 | 133 | 164 | 164 | -3 | 11 | 11 | 2396 | 8 | 0 | 0 |
| chromium | local-end-stamp | 144 | 188 | 188 | -5 | 8 | 8 | 2397 | 9 | 0 | 0 |
| chromium | local-react-style | 134 | 168 | 168 | -2 | 8 | 8 | 2390 | 9 | 0 | 0 |
| chromium | dpu-support | 172 | 208 | 208 | -4 | 11 | 11 | 2426 | 9 | 0 | 0 |
| firefox | baseline | 122 | 216 | 216 | 31 | 111 | 111 | 2411 | 68 | n/a | 0 |
| firefox | pr474 | 143 | 171 | 171 | 133 | 239 | 239 | 2397 | 34 | n/a | 5 |
| firefox | local-end-stamp | 137 | 220 | 220 | 16 | 48 | 48 | 2394 | 10 | n/a | 0 |
| firefox | local-react-style | 98 | 141 | 141 | 1 | 55 | 55 | 2370 | 57 | n/a | 0 |
| firefox | dpu-support | 123 | 185 | 185 | 10 | 71 | 71 | 2401 | 23 | n/a | 0 |
| webkit | baseline | 139 | 175 | 203 | -3 | 13 | 13 | 2400 | 5 | n/a | 0 |
| webkit | pr474 | 161 | 184 | 195 | 111 | 214 | 214 | 2410 | 4 | n/a | 5 |
| webkit | local-end-stamp | 152 | 171 | 179 | -3 | 29 | 29 | 2403 | 5 | n/a | 0 |
| webkit | local-react-style | 138 | 172 | 199 | -1 | 27 | 27 | 2391 | 4 | n/a | 0 |
| webkit | dpu-support | 130 | 153 | 164 | -2 | 4 | 4 | 2387 | 4 | n/a | 0 |

### many-boundaries (60)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 137 | 184 | 184 | -3 | 9 | 14 | 1658 | 8 | 0 | 0 |
| chromium | pr474 | 156 | 188 | 188 | -1 | 12 | 25 | 1683 | 9 | 0 | 0 |
| chromium | local-end-stamp | 147 | 172 | 172 | -2 | 8 | 17 | 1654 | 9 | 0 | 0 |
| chromium | local-react-style | 162 | 196 | 196 | -2 | 9 | 24 | 1683 | 9 | 0 | 0 |
| chromium | dpu-support | 138 | 160 | 160 | -1 | 9 | 12 | 1656 | 9 | 0 | 0 |
| firefox | baseline | 133 | 187 | 187 | 30 | 54 | 114 | 1662 | 41 | n/a | 0 |
| firefox | pr474 | 134 | 173 | 173 | 23 | 87 | 104 | 1655 | 25 | n/a | 5 |
| firefox | local-end-stamp | 130 | 170 | 170 | 17 | 44 | 47 | 1667 | 30 | n/a | 0 |
| firefox | local-react-style | 118 | 178 | 178 | 1 | 122 | 180 | 1650 | 164 | n/a | 0 |
| firefox | dpu-support | 120 | 170 | 170 | 15 | 24 | 32 | 1639 | 6 | n/a | 0 |
| webkit | baseline | 119 | 146 | 157 | 1 | 23 | 35 | 1655 | 7 | n/a | 0 |
| webkit | pr474 | 142 | 193 | 202 | 7 | 86 | 97 | 1682 | 6 | n/a | 5 |
| webkit | local-end-stamp | 123 | 150 | 159 | 1 | 26 | 42 | 1644 | 3 | n/a | 0 |
| webkit | local-react-style | 129 | 155 | 171 | -2 | 19 | 58 | 1624 | 9 | n/a | 0 |
| webkit | dpu-support | 129 | 175 | 182 | -1 | 11 | 20 | 1671 | 6 | n/a | 0 |

### grid-100 (100)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 137 | 180 | 180 | 6 | 9 | 9 | 747 | 9 | 0 | 0 |
| chromium | pr474 | 135 | 164 | 164 | 2 | 12 | 13 | 742 | 9 | 0 | 0 |
| chromium | local-end-stamp | 129 | 168 | 168 | 3 | 13 | 13 | 728 | 9 | 0 | 0 |
| chromium | local-react-style | 144 | 180 | 180 | 1 | 12 | 12 | 749 | 9 | 0 | 0 |
| chromium | dpu-support | 171 | 208 | 208 | 4 | 11 | 11 | 779 | 9 | 0 | 0 |
| firefox | baseline | 100 | 154 | 154 | 23 | 43 | 47 | 730 | 34 | n/a | 0 |
| firefox | pr474 | 162 | 206 | 206 | 16 | 112 | 125 | 770 | 5 | n/a | 5 |
| firefox | local-end-stamp | 130 | 193 | 193 | 16 | 21 | 21 | 730 | 5 | n/a | 0 |
| firefox | local-react-style | 124 | 187 | 187 | 6 | 12 | 13 | 737 | 18 | n/a | 0 |
| firefox | dpu-support | 159 | 203 | 203 | 15 | 24 | 24 | 747 | 35 | n/a | 0 |
| webkit | baseline | 145 | 166 | 179 | 19 | 30 | 36 | 764 | 22 | n/a | 0 |
| webkit | pr474 | 160 | 184 | 199 | 2 | 94 | 119 | 773 | 5 | n/a | 5 |
| webkit | local-end-stamp | 156 | 183 | 200 | 4 | 13 | 13 | 763 | 3 | n/a | 0 |
| webkit | local-react-style | 149 | 202 | 216 | 10 | 35 | 44 | 776 | 24 | n/a | 0 |
| webkit | dpu-support | 134 | 178 | 194 | 1 | 24 | 24 | 738 | 4 | n/a | 0 |

## Patched content → interactive (`/s/patch-interactive`)

Gap between the patched counter becoming visible and the first click registering (ms). Includes hydration start mode: `late` = client script runs after the stream ends, `early` = async script mid-stream.

| browser | variant | hydrate | visible at | interactive at | gap (median) | runs never interactive |
|---|---|---|---|---|---|---|
| chromium | baseline | late | 537 | 653 | 124 | 0/5 |
| chromium | baseline | early | 257 | 268 | 11 | 0/5 |
| chromium | pr474 | late | 556 | 648 | 114 | 0/5 |
| chromium | pr474 | early | 251 | 264 | 11 | 0/5 |
| chromium | local-end-stamp | late | 571 | 682 | 111 | 0/5 |
| chromium | local-end-stamp | early | 228 | 238 | 13 | 0/5 |
| chromium | local-react-style | late | 528 | 620 | 107 | 0/5 |
| chromium | local-react-style | early | 296 | 304 | 9 | 0/5 |
| chromium | dpu-support | late | 526 | 618 | 102 | 0/5 |
| chromium | dpu-support | early | 279 | 290 | 10 | 0/5 |
| firefox | baseline | late | 543 | 610 | 97 | 0/5 |
| firefox | baseline | early | 236 | 252 | 15 | 0/5 |
| firefox | pr474 | late | 636 | 647 | 13 | 0/5 |
| firefox | pr474 | early | 262 | 273 | 12 | 0/5 |
| firefox | local-end-stamp | late | 553 | 666 | 122 | 0/5 |
| firefox | local-end-stamp | early | 236 | 248 | 13 | 0/5 |
| firefox | local-react-style | late | 534 | 660 | 137 | 0/5 |
| firefox | local-react-style | early | 347 | 441 | 19 | 0/5 |
| firefox | dpu-support | late | 518 | 643 | 125 | 0/5 |
| firefox | dpu-support | early | 245 | 263 | 15 | 0/5 |
| webkit | baseline | late | 543 | 638 | 97 | 0/5 |
| webkit | baseline | early | 249 | 265 | 13 | 0/5 |
| webkit | pr474 | late | 631 | 645 | 15 | 0/5 |
| webkit | pr474 | early | 280 | 292 | 13 | 0/5 |
| webkit | local-end-stamp | late | 548 | 653 | 122 | 0/5 |
| webkit | local-end-stamp | early | 260 | 276 | 16 | 0/5 |
| webkit | local-react-style | late | 533 | 658 | 114 | 0/5 |
| webkit | local-react-style | early | 203 | 217 | 14 | 0/5 |
| webkit | dpu-support | late | 534 | 660 | 137 | 0/5 |
| webkit | dpu-support | early | 229 | 244 | 15 | 0/5 |

## Strict CSP (`script-src 'self' 'nonce-…'`, stream's inline scripts have no nonce)

| browser | variant | template[for] left unapplied | fallbacks left on screen |
|---|---|---|---|
| chromium | baseline | 0 | 16 |
| chromium | pr474 | 0 | 0 |
| chromium | local-end-stamp | 0 | 0 |
| chromium | local-react-style | 0 | 0 |
| chromium | dpu-support | 0 | 0 |
| firefox | baseline | 0 | 16 |
| firefox | pr474 | 112 | 10 |
| firefox | local-end-stamp | 112 | 10 |
| firefox | local-react-style | 112 | 10 |
| firefox | dpu-support | 112 | 10 |
| webkit | baseline | 0 | 16 |
| webkit | pr474 | 112 | 10 |
| webkit | local-end-stamp | 112 | 10 |
| webkit | local-react-style | 112 | 10 |
| webkit | dpu-support | 112 | 10 |

## Payload (bytes; gzip/brotli are estimated by compressing the decoded stream locally, not measured on the wire)

| page | boundaries | variant | raw | gzip | brotli | inline script bytes |
|---|---|---|---|---|---|---|
| zero | 0 | baseline | 17472 | 5273 | 4415 | 775 |
| zero | 0 | pr474 | 17528 | 5306 | 4445 | 807 |
| zero | 0 | local-end-stamp | 17566 | 5327 | 4467 | 821 |
| zero | 0 | local-react-style | 17592 | 5328 | 4450 | 833 |
| zero | 0 | dpu-support | 17516 | 5298 | 4433 | 798 |
| one | 1 | baseline | 18791 | 5864 | 4950 | 1946 |
| one | 1 | pr474 | 18802 | 5961 | 5043 | 1951 |
| one | 1 | local-end-stamp | 18951 | 6073 | 5165 | 2063 |
| one | 1 | local-react-style | 18472 | 5793 | 4897 | 1582 |
| one | 1 | dpu-support | 18706 | 5892 | 4991 | 1857 |
| popcorn | 16 | baseline | 21172 | 6141 | 5151 | 1943 |
| popcorn | 16 | pr474 | 21186 | 6290 | 5272 | 1948 |
| popcorn | 16 | local-end-stamp | 21533 | 6457 | 5409 | 2060 |
| popcorn | 16 | local-react-style | 21279 | 6178 | 5184 | 1987 |
| popcorn | 16 | dpu-support | 21105 | 6222 | 5221 | 1854 |
| many | 60 | baseline | 26486 | 6839 | 5471 | 1948 |
| many | 60 | pr474 | 26544 | 7132 | 5599 | 1953 |
| many | 60 | local-end-stamp | 27507 | 7445 | 5763 | 2065 |
| many | 60 | local-react-style | 27913 | 7155 | 5519 | 3224 |
| many | 60 | dpu-support | 26507 | 7062 | 5508 | 1859 |
| grid | 100 | baseline | 30142 | 7367 | 5632 | 1941 |
| grid | 100 | pr474 | 30226 | 7747 | 5843 | 1946 |
| grid | 100 | local-end-stamp | 31540 | 8134 | 6068 | 2058 |
| grid | 100 | local-react-style | 32321 | 7831 | 5828 | 3918 |
| grid | 100 | dpu-support | 30214 | 7680 | 5797 | 1852 |
| big | 1 | baseline | 34736 | 9306 | 5998 | 1945 |
| big | 1 | pr474 | 34747 | 9396 | 6094 | 1950 |
| big | 1 | local-end-stamp | 34896 | 9528 | 6201 | 2062 |
| big | 1 | local-react-style | 34417 | 9232 | 5945 | 1581 |
| big | 1 | dpu-support | 34651 | 9333 | 6036 | 1856 |

### Projection: end stamp as a single newline instead of `<!--$p:id-->` (variants that emit stamps only; string substitution on the real output, NOT a working implementation, no behavior/timing measured)

| page | boundaries | variant | stamps | raw | raw if newline | gzip | gzip if newline | brotli | brotli if newline |
|---|---|---|---|---|---|---|---|---|---|
| one | 1 | local-end-stamp | 1 | 18951 | 18939 | 6073 | 6070 | 5165 | 5172 |
| popcorn | 16 | local-end-stamp | 16 | 21533 | 21338 | 6457 | 6401 | 5409 | 5396 |
| many | 60 | local-end-stamp | 60 | 27507 | 26740 | 7445 | 7251 | 5763 | 5679 |
| grid | 100 | local-end-stamp | 85 | 31540 | 30447 | 8134 | 7867 | 6068 | 5957 |

### Overhead model (raw bytes)

Fixed = bytes added once a page has ≥1 boundary (init script/CE) = `one − zero` minus that boundary's own content. Per-boundary = slope between 16, 60 and 100 boundaries.

| variant | one boundary − zero | per boundary (16→100) | per boundary gzip (16→100) |
|---|---|---|---|
| baseline | 1319 | 106.8 | 14.6 |
| pr474 | 1274 | 107.6 | 17.3 |
| local-end-stamp | 1385 | 119.1 | 20.0 |
| local-react-style | 880 | 131.5 | 19.7 |
| dpu-support | 1190 | 108.4 | 17.4 |

## Correctness, hydrate=off (stream + polyfill/native only, no client JS) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 23/26 | 23/26 | 23/26 | ok / ok / ok |
| pr474 | 26/26 | 26/26 | 26/26 | HUNG / HUNG / HUNG |
| local-end-stamp | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| local-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| dpu-support | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **table-rows** (baseline/chromium, baseline/firefox, baseline/webkit); **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)

## Correctness, hydrate=late (after client hydration; hydration can mask a failed patch) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 24/26 | 24/26 | 24/26 | ok / ok / ok |
| pr474 | 26/26 | 26/26 | 26/26 | HUNG / HUNG / HUNG |
| local-end-stamp | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| local-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| dpu-support | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)
