# DRAFT — not opened anywhere

**Title:** feat: stream Suspense completions as Declarative Partial Updates

## Summary
Emit `<template for>` completions so browsers with DPU apply Suspense results natively, with a small inline
polyfill elsewhere. Fixes boundaries inside `<svg>` / `<math>` being inserted in the wrong namespace.

## Evidence
See the comparison report: <link to eco-ci REPORT.md>. In short (Chromium, Firefox, WebKit; 27 scenarios):
- Correctness: 27/27 vs 25/27 on `main` (SVG and MathML namespace).
- Timing: no measurable penalty up to 100 boundaries (patch lag within ~±15 ms; resolution-limited).
- Payload: ≈ +5 B gzip per boundary.
- Not solved: strict-CSP pages in browsers without native DPU (inline scripts carry no nonce).

## Open questions for maintainers
1. Completion format: comment stamp + MutationObserver (`dpu-end-stamp`) vs per-chunk `$RC(id)` script
   (`dpu-support-react-style`)?
2. Is a nonce option / non-inline fallback required before shipping?
3. Is a `window.$RC` global acceptable (possible collision with React's runtime — unverified)?

## Notes
Test pages, scripts and this description were prepared with Claude (Anthropic) via Claude Code.
