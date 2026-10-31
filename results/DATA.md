## Timing (median of 5 runs per cell, deployed Workers, ms)

Patch lag = time a boundary became visible − (responseStart + its server delay). Lower is better; it isolates the cost of getting a resolved boundary onto the screen. Scenario `popcorning` = 16 boundaries, `many-boundaries` = 60, `grid-100` = 100.

### popcorning (16)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 231 | 268 | 268 | -3 | 11 | 11 | 2491 | 9 | 0 | 0 |
| chromium | dpu-end-stamp | 140 | 164 | 164 | -1 | 10 | 10 | 2395 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 121 | 156 | 156 | -1 | 20 | 20 | 2391 | 9 | 0 | 0 |
| firefox | baseline | 181 | 252 | 252 | 20 | 34 | 34 | 2452 | 7 | n/a | 0 |
| firefox | dpu-end-stamp | 126 | 158 | 158 | 15 | 46 | 46 | 2383 | 4 | n/a | 0 |
| firefox | dpu-support-react-style | 141 | 180 | 180 | -4 | 3 | 3 | 2399 | 8 | n/a | 0 |
| webkit | baseline | 245 | 314 | 322 | -4 | 43 | 43 | 2470 | 4 | n/a | 0 |
| webkit | dpu-end-stamp | 109 | 132 | 144 | -3 | 20 | 20 | 2373 | 3 | n/a | 0 |
| webkit | dpu-support-react-style | 110 | 134 | 161 | -4 | 8 | 8 | 2367 | 6 | n/a | 0 |

### many-boundaries (60)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 144 | 172 | 172 | 2 | 10 | 14 | 1667 | 9 | 0 | 0 |
| chromium | dpu-end-stamp | 128 | 152 | 152 | -0 | 6 | 11 | 1643 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 140 | 164 | 164 | 1 | 7 | 15 | 1662 | 9 | 0 | 0 |
| firefox | baseline | 149 | 181 | 181 | 24 | 45 | 60 | 1670 | 19 | n/a | 0 |
| firefox | dpu-end-stamp | 105 | 134 | 134 | 11 | 24 | 24 | 1622 | 10 | n/a | 0 |
| firefox | dpu-support-react-style | 126 | 168 | 168 | -6 | 8 | 20 | 1648 | 6 | n/a | 0 |
| webkit | baseline | 169 | 192 | 260 | 3 | 14 | 21 | 1704 | 7 | n/a | 0 |
| webkit | dpu-end-stamp | 140 | 173 | 185 | -5 | 0 | 1 | 1656 | 5 | n/a | 0 |
| webkit | dpu-support-react-style | 120 | 143 | 165 | -7 | 3 | 8 | 1633 | 9 | n/a | 0 |

### grid-100 (100)

| browser | variant | TTFB | FCP | LCP | patch lag median | patch lag p95 | patch lag max | last visible | longest stall | long-task total | boundaries never shown |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chromium | baseline | 147 | 176 | 176 | 3 | 13 | 23 | 770 | 9 | 0 | 0 |
| chromium | dpu-end-stamp | 152 | 176 | 176 | 0 | 6 | 6 | 740 | 9 | 0 | 0 |
| chromium | dpu-support-react-style | 152 | 172 | 172 | 1 | 8 | 8 | 758 | 9 | 0 | 0 |
| firefox | baseline | 158 | 201 | 201 | 29 | 51 | 53 | 782 | 3 | n/a | 0 |
| firefox | dpu-end-stamp | 146 | 185 | 185 | 12 | 16 | 16 | 750 | 4 | n/a | 0 |
| firefox | dpu-support-react-style | 122 | 161 | 161 | 3 | 14 | 16 | 730 | 5 | n/a | 0 |
| webkit | baseline | 166 | 192 | 218 | 10 | 25 | 26 | 797 | 13 | n/a | 0 |
| webkit | dpu-end-stamp | 113 | 135 | 149 | 3 | 11 | 12 | 722 | 4 | n/a | 0 |
| webkit | dpu-support-react-style | 156 | 194 | 211 | 9 | 28 | 36 | 764 | 11 | n/a | 0 |

## Patched content → interactive (`/s/patch-interactive`)

Gap between the patched counter becoming visible and the first click registering (ms). Includes hydration start mode: `late` = client script runs after the stream ends, `early` = async script mid-stream.

| browser | variant | hydrate | visible at | interactive at | gap (median) | runs never interactive |
|---|---|---|---|---|---|---|
| chromium | baseline | late | 555 | 679 | 130 | 0/5 |
| chromium | baseline | early | 224 | 236 | 11 | 0/5 |
| chromium | dpu-end-stamp | late | 541 | 627 | 93 | 0/5 |
| chromium | dpu-end-stamp | early | 219 | 228 | 11 | 0/5 |
| chromium | dpu-support-react-style | late | 531 | 635 | 95 | 0/5 |
| chromium | dpu-support-react-style | early | 235 | 245 | 11 | 0/5 |
| firefox | baseline | late | 610 | 747 | 124 | 0/5 |
| firefox | baseline | early | 252 | 265 | 15 | 0/5 |
| firefox | dpu-end-stamp | late | 534 | 627 | 137 | 0/5 |
| firefox | dpu-end-stamp | early | 197 | 213 | 16 | 0/5 |
| firefox | dpu-support-react-style | late | 530 | 653 | 114 | 0/5 |
| firefox | dpu-support-react-style | early | 250 | 260 | 12 | 0/5 |
| webkit | baseline | late | 536 | 650 | 110 | 0/5 |
| webkit | baseline | early | 258 | 275 | 17 | 0/5 |
| webkit | dpu-end-stamp | late | 537 | 658 | 122 | 0/5 |
| webkit | dpu-end-stamp | early | 189 | 200 | 14 | 0/5 |
| webkit | dpu-support-react-style | late | 527 | 662 | 121 | 0/5 |
| webkit | dpu-support-react-style | early | 192 | 210 | 21 | 0/5 |

## Strict CSP (`script-src 'self' 'nonce-…'`, stream's inline scripts have no nonce)

| browser | variant | template[for] left unapplied | fallbacks left on screen |
|---|---|---|---|
| chromium | baseline | 0 | 16 |
| chromium | dpu-end-stamp | 0 | 0 |
| chromium | dpu-support-react-style | 0 | 0 |
| firefox | baseline | 0 | 16 |
| firefox | dpu-end-stamp | 112 | 10 |
| firefox | dpu-support-react-style | 112 | 10 |
| webkit | baseline | 0 | 16 |
| webkit | dpu-end-stamp | 112 | 10 |
| webkit | dpu-support-react-style | 112 | 10 |

## Payload (bytes; gzip/brotli are estimated by compressing the decoded stream locally, not measured on the wire)

| page | boundaries | variant | raw | gzip | brotli | inline script bytes |
|---|---|---|---|---|---|---|
| zero | 0 | baseline | 17472 | 5273 | 4415 | 775 |
| zero | 0 | dpu-end-stamp | 17526 | 5303 | 4449 | 802 |
| zero | 0 | dpu-support-react-style | 17576 | 5304 | 4443 | 822 |
| one | 1 | baseline | 18794 | 5863 | 4948 | 1946 |
| one | 1 | dpu-end-stamp | 18776 | 5954 | 5070 | 1904 |
| one | 1 | dpu-support-react-style | 18461 | 5769 | 4886 | 1572 |
| popcorn | 16 | baseline | 21211 | 6142 | 5146 | 1943 |
| popcorn | 16 | dpu-end-stamp | 21418 | 6341 | 5295 | 1901 |
| popcorn | 16 | dpu-support-react-style | 21328 | 6155 | 5138 | 1989 |
| many | 60 | baseline | 26525 | 6851 | 5399 | 1948 |
| many | 60 | dpu-end-stamp | 27392 | 7340 | 5579 | 1906 |
| many | 60 | dpu-support-react-style | 27962 | 7152 | 5500 | 3226 |
| grid | 100 | baseline | 30199 | 7369 | 5685 | 1941 |
| grid | 100 | dpu-end-stamp | 31455 | 8031 | 5940 | 1899 |
| grid | 100 | dpu-support-react-style | 32400 | 7826 | 5801 | 3926 |
| big | 1 | baseline | 34742 | 9307 | 6005 | 1945 |
| big | 1 | dpu-end-stamp | 34726 | 9398 | 6102 | 1903 |
| big | 1 | dpu-support-react-style | 34411 | 9208 | 5956 | 1572 |

### Overhead model (raw bytes)

Fixed = bytes added once a page has ≥1 boundary (init script/CE) = `one − zero` minus that boundary's own content. Per-boundary = slope between 16, 60 and 100 boundaries.

| variant | one boundary − zero | per boundary (16→100) | per boundary gzip (16→100) |
|---|---|---|---|
| baseline | 1322 | 107.0 | 14.6 |
| dpu-end-stamp | 1250 | 119.5 | 20.1 |
| dpu-support-react-style | 885 | 131.8 | 19.9 |

## Correctness (final state after settle; `/dpu`, 27 scenarios)

| variant | chromium | firefox | webkit |
|---|---|---|---|
| baseline | 25/27 | 25/27 | 25/27 |
| main-fork-preact | 25/27 | 25/27 | 25/27 |
| dpu-end-stamp | 27/27 | 27/27 | 27/27 |
| dpu-support-react-style | 27/27 | 27/27 | 27/27 |

Failing scenarios: svg-namespace (baseline/chromium), mathml-namespace (baseline/chromium), svg-namespace (baseline/firefox), mathml-namespace (baseline/firefox), svg-namespace (baseline/webkit), mathml-namespace (baseline/webkit), svg-namespace (main-fork-preact/chromium), mathml-namespace (main-fork-preact/chromium), svg-namespace (main-fork-preact/firefox), mathml-namespace (main-fork-preact/firefox), svg-namespace (main-fork-preact/webkit), mathml-namespace (main-fork-preact/webkit)
