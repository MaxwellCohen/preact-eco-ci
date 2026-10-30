# preact-eco-ci

Test bed for Preact streaming / Declarative Partial Updates (DPU).

- `versions.json` pins each variant (repo + ref) of `preact` and `preact-render-to-string`.
- `node scripts/build-variant.mjs <variant>` shallow-clones them read-only, packs, and builds the demo into `.build/<variant>`.
- Each variant deploys as its own Cloudflare Worker, `preact-eco-<variant>`, giving each a stable shareable URL.
- Add a variant = add an entry to `versions.json`.

CI needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets; without them the deploy step is skipped.
