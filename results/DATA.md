## Timing (median of 5 runs per cell, deployed Workers, ms)

Patch lag = time a boundary became visible − (responseStart + its server delay). Lower is better; it isolates the cost of getting a resolved boundary onto the screen. Scenario `popcorning` = 16 boundaries, `many-boundaries` = 60, `grid-100` = 100.

### popcorning (16)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 133 | 156 | 156 | -0 | 32 | 32 | 2394 | 10 | 0 | 0 |
| chromium | pr474 | 137 | 160 | 160 | -7 | 2 | 2 | 2389 | 9 | 0 | 0 |
| chromium | local-end-stamp | 152 | 172 | 172 | -2 | 4 | 4 | 2398 | 9 | 0 | 0 |
| chromium | local-react-style | 126 | 148 | 148 | -4 | 6 | 6 | 2376 | 9 | 0 | 0 |
| firefox | baseline | 127 | 158 | 158 | 21 | 49 | 49 | 2390 | 6 | n/a | 0 |
| firefox | pr474 | 126 | 152 | 152 | 134 | 235 | 235 | 2383 | 5 | n/a | 5 |
| firefox | local-end-stamp | 127 | 158 | 158 | 14 | 40 | 40 | 2378 | 8 | n/a | 0 |
| firefox | local-react-style | 102 | 138 | 138 | -7 | 22 | 22 | 2359 | 6 | n/a | 0 |
| webkit | baseline | 132 | 158 | 168 | -1 | 14 | 14 | 2392 | 6 | n/a | 0 |
| webkit | pr474 | 138 | 160 | 172 | 114 | 209 | 209 | 2386 | 6 | n/a | 5 |
| webkit | local-end-stamp | 127 | 144 | 152 | -5 | 14 | 14 | 2376 | 6 | n/a | 0 |
| webkit | local-react-style | 110 | 131 | 141 | -3 | 29 | 29 | 2374 | 6 | n/a | 0 |

### many-boundaries (60)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 132 | 156 | 156 | -2 | 15 | 22 | 1650 | 9 | 0 | 0 |
| chromium | pr474 | 135 | 160 | 160 | -2 | 4 | 22 | 1665 | 9 | 0 | 0 |
| chromium | local-end-stamp | 145 | 168 | 168 | 0 | 6 | 11 | 1668 | 9 | 0 | 0 |
| chromium | local-react-style | 135 | 156 | 156 | 0 | 6 | 14 | 1659 | 9 | 0 | 0 |
| firefox | baseline | 138 | 164 | 164 | 28 | 41 | 45 | 1655 | 5 | n/a | 0 |
| firefox | pr474 | 111 | 144 | 144 | 19 | 81 | 84 | 1633 | 6 | n/a | 5 |
| firefox | local-end-stamp | 117 | 157 | 157 | 11 | 20 | 22 | 1632 | 12 | n/a | 0 |
| firefox | local-react-style | 110 | 141 | 141 | -4 | 2 | 13 | 1633 | 5 | n/a | 0 |
| webkit | baseline | 99 | 118 | 132 | 4 | 14 | 25 | 1625 | 7 | n/a | 0 |
| webkit | pr474 | 104 | 149 | 157 | 3 | 63 | 70 | 1622 | 6 | n/a | 5 |
| webkit | local-end-stamp | 132 | 154 | 166 | 0 | 10 | 25 | 1653 | 5 | n/a | 0 |
| webkit | local-react-style | 149 | 169 | 176 | 2 | 8 | 12 | 1660 | 6 | n/a | 0 |

### grid-100 (100)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 148 | 180 | 180 | 6 | 15 | 16 | 748 | 9 | 0 | 0 |
| chromium | pr474 | 112 | 136 | 136 | 4 | 15 | 15 | 717 | 9 | 0 | 0 |
| chromium | local-end-stamp | 144 | 180 | 180 | 3 | 13 | 13 | 753 | 9 | 0 | 0 |
| chromium | local-react-style | 167 | 192 | 192 | 3 | 9 | 10 | 772 | 9 | 0 | 0 |
| firefox | baseline | 118 | 148 | 148 | 34 | 42 | 46 | 732 | 10 | n/a | 0 |
| firefox | pr474 | 148 | 191 | 191 | 13 | 102 | 117 | 755 | 5 | n/a | 5 |
| firefox | local-end-stamp | 143 | 203 | 203 | 9 | 17 | 17 | 741 | 5 | n/a | 0 |
| firefox | local-react-style | 129 | 169 | 169 | 4 | 17 | 21 | 739 | 13 | n/a | 0 |
| webkit | baseline | 127 | 147 | 159 | 9 | 28 | 32 | 749 | 12 | n/a | 0 |
| webkit | pr474 | 151 | 185 | 200 | 2 | 95 | 107 | 752 | 6 | n/a | 5 |
| webkit | local-end-stamp | 153 | 181 | 191 | 3 | 14 | 14 | 755 | 6 | n/a | 0 |
| webkit | local-react-style | 125 | 147 | 157 | 11 | 21 | 26 | 750 | 10 | n/a | 0 |

## Patched content → interactive (`/s/patch-interactive`)

Gap between the patched counter becoming visible and the first click registering (ms). Includes hydration start mode: `late` = client script runs after the stream ends, `early` = async script mid-stream.

| browser | variant | hydrate | visible at | interactive at | gap (median) | runs never interactive |
|---|---|---|---|---|---|---|
| chromium | baseline | late | 559 | 648 | 91 | 0/5 |
| chromium | baseline | early | 245 | 257 | 12 | 0/5 |
| chromium | pr474 | late | 560 | 640 | 81 | 0/5 |
| chromium | pr474 | early | 272 | 282 | 11 | 0/5 |
| chromium | local-end-stamp | late | 520 | 630 | 102 | 0/5 |
| chromium | local-end-stamp | early | 217 | 231 | 11 | 0/5 |
| chromium | local-react-style | late | 536 | 667 | 124 | 0/5 |
| chromium | local-react-style | early | 228 | 238 | 17 | 0/5 |
| firefox | baseline | late | 511 | 645 | 119 | 0/5 |
| firefox | baseline | early | 209 | 227 | 19 | 0/5 |
| firefox | pr474 | late | 673 | 686 | 13 | 0/5 |
| firefox | pr474 | early | 216 | 238 | 13 | 0/5 |
| firefox | local-end-stamp | late | 546 | 626 | 112 | 0/5 |
| firefox | local-end-stamp | early | 218 | 234 | 16 | 0/5 |
| firefox | local-react-style | late | 546 | 691 | 143 | 0/5 |
| firefox | local-react-style | early | 195 | 209 | 16 | 0/5 |
| webkit | baseline | late | 537 | 620 | 107 | 0/5 |
| webkit | baseline | early | 209 | 223 | 14 | 0/5 |
| webkit | pr474 | late | 580 | 597 | 15 | 0/5 |
| webkit | pr474 | early | 201 | 216 | 15 | 0/5 |
| webkit | local-end-stamp | late | 517 | 627 | 99 | 0/5 |
| webkit | local-end-stamp | early | 245 | 265 | 18 | 0/5 |
| webkit | local-react-style | late | 525 | 638 | 96 | 0/5 |
| webkit | local-react-style | early | 260 | 281 | 20 | 0/5 |

## Strict CSP (`script-src 'self' 'nonce-…'`, stream's inline scripts have no nonce)

| browser | variant | template[for] left unapplied | fallbacks left on screen |
|---|---|---|---|
| chromium | baseline | 0 | 16 |
| chromium | pr474 | 0 | 0 |
| chromium | local-end-stamp | 0 | 0 |
| chromium | local-react-style | 0 | 0 |
| firefox | baseline | 0 | 16 |
| firefox | pr474 | 112 | 10 |
| firefox | local-end-stamp | 112 | 10 |
| firefox | local-react-style | 112 | 10 |
| webkit | baseline | 0 | 16 |
| webkit | pr474 | 112 | 10 |
| webkit | local-end-stamp | 112 | 10 |
| webkit | local-react-style | 112 | 10 |

## Payload (bytes; gzip/brotli are estimated by compressing the decoded stream locally, not measured on the wire)

| page | boundaries | variant | raw | gzip | brotli | inline script bytes |
|---|---|---|---|---|---|---|
| zero | 0 | baseline | 17472 | 5273 | 4415 | 775 |
| zero | 0 | pr474 | 17528 | 5306 | 4445 | 807 |
| zero | 0 | local-end-stamp | 17566 | 5327 | 4467 | 821 |
| zero | 0 | local-react-style | 17592 | 5328 | 4450 | 833 |
| one | 1 | baseline | 18791 | 5864 | 4950 | 1946 |
| one | 1 | pr474 | 18802 | 5961 | 5043 | 1951 |
| one | 1 | local-end-stamp | 18951 | 6073 | 5165 | 2063 |
| one | 1 | local-react-style | 18472 | 5793 | 4897 | 1582 |
| popcorn | 16 | baseline | 21172 | 6141 | 5151 | 1943 |
| popcorn | 16 | pr474 | 21186 | 6290 | 5272 | 1948 |
| popcorn | 16 | local-end-stamp | 21533 | 6457 | 5409 | 2060 |
| popcorn | 16 | local-react-style | 21279 | 6178 | 5184 | 1987 |
| many | 60 | baseline | 26486 | 6839 | 5471 | 1948 |
| many | 60 | pr474 | 26544 | 7132 | 5599 | 1953 |
| many | 60 | local-end-stamp | 27507 | 7445 | 5763 | 2065 |
| many | 60 | local-react-style | 27913 | 7155 | 5519 | 3224 |
| grid | 100 | baseline | 30142 | 7367 | 5632 | 1941 |
| grid | 100 | pr474 | 30226 | 7747 | 5843 | 1946 |
| grid | 100 | local-end-stamp | 31540 | 8134 | 6068 | 2058 |
| grid | 100 | local-react-style | 32321 | 7831 | 5828 | 3918 |
| big | 1 | baseline | 34736 | 9306 | 5998 | 1945 |
| big | 1 | pr474 | 34747 | 9396 | 6094 | 1950 |
| big | 1 | local-end-stamp | 34896 | 9528 | 6201 | 2062 |
| big | 1 | local-react-style | 34417 | 9232 | 5945 | 1581 |

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

## Correctness, hydrate=off (stream + polyfill/native only, no client JS) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 23/26 | 23/26 | 23/26 | ok / ok / ok |
| pr474 | 26/26 | 26/26 | 26/26 | HUNG / HUNG / HUNG |
| local-end-stamp | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| local-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **table-rows** (baseline/chromium, baseline/firefox, baseline/webkit); **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)

## Correctness, hydrate=late (after client hydration; hydration can mask a failed patch) — `/dpu`, 26 checks + isolated foreignObject page

| variant | chromium | firefox | webkit | foreignObject page (C/F/W) |
|---|---|---|---|---|
| baseline | 24/26 | 24/26 | 24/26 | ok / ok / ok |
| pr474 | 26/26 | 26/26 | 26/26 | HUNG / HUNG / HUNG |
| local-end-stamp | 26/26 | 26/26 | 26/26 | ok / ok / ok |
| local-react-style | 26/26 | 26/26 | 26/26 | ok / ok / ok |

Failing checks: **svg-namespace** (baseline/chromium, baseline/firefox, baseline/webkit); **mathml-namespace** (baseline/chromium, baseline/firefox, baseline/webkit)
