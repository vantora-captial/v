# Vantora Trilingual Public Site Verification

Date: 2026-08-17
Branch: `trilingual-public-site`
Base: `ai-sales-redesign`
Production branch: `top`
Status: Review-ready isolated preview; not merged or released to production

## Scope verified

This verification covers the approved trilingual public-site implementation:

- standalone English `/en/`, Traditional Chinese `/zh/`, and Japanese `/ja/` routes
- routing-only root entry
- browser-language routing and persisted manual language selection
- M&A-led homepage positioning
- six capability pillars
- anonymized Experience presentation
- sanitized Opportunities surface and non-live presentation mode
- About / Vantora-UPEX brand hierarchy
- four-path Private Discussion contact experience
- existing AI concierge regression compatibility, including Traditional Chinese UI copy
- responsive/accessibility contracts
- SEO metadata, canonical and hreflang generation
- public-output safety audit
- public-only preview / production artifact packaging

## Implementation branch evidence

Final implementation commit before this documentation refresh:

`78bfb8061f83a98207367815adea740192547d15`

The branch remains isolated from `top`. No production merge or GitHub Pages production deployment was performed by this work.

## Fresh CI evidence

GitHub Actions workflow: `AI Sales CI`

Run: `31999991713`
Head: `78bfb8061f83a98207367815adea740192547d15`
Conclusion: `success`

Frontend job passed:

- deterministic trilingual static-site build
- complete `tests/frontend/*.test.mjs` suite
- Traditional Chinese AI concierge contract
- generated public-output audit for secrets and unsupported claims

Worker job passed:

- dependency install
- `wrangler types`
- `npx tsc --noEmit`
- Worker test suite
- `wrangler deploy --dry-run --outdir dist`

The Worker was not deployed by this verification.

## Preview deployment evidence

GitHub Actions workflow: `Deploy Vantora Preview`

Run: `31999991717`
Head: `78bfb8061f83a98207367815adea740192547d15`
Conclusion: `success`

The workflow built the site in `presentation` mode, staged only the public router, language trees, and assets, deployed them to the isolated Cloudflare Pages preview, and verified the English, Traditional Chinese, and Japanese hero content over HTTP.

Stable review base:

`https://trilingual-public-site.vantora-site-preview.pages.dev`

Direct review routes:

- `https://trilingual-public-site.vantora-site-preview.pages.dev/en/`
- `https://trilingual-public-site.vantora-site-preview.pages.dev/zh/`
- `https://trilingual-public-site.vantora-site-preview.pages.dev/ja/`
- `https://trilingual-public-site.vantora-site-preview.pages.dev/en/capabilities/`
- `https://trilingual-public-site.vantora-site-preview.pages.dev/en/opportunities/`
- `https://trilingual-public-site.vantora-site-preview.pages.dev/en/contact/`

## Opportunity / Registry state

The isolated preview intentionally uses presentation-only opportunity samples. These samples are labelled as non-live and must not be interpreted as active mandates or verified inventory.

No live Project Registry public endpoint is configured in the default public build. When the Registry API is absent, the website presents a truthful private-discussion fallback instead of embedding or leaking internal project data.

The public opportunity projector is whitelist-only and the frontend tests cover exclusion of private fields and hidden-price behavior.

## Production packaging

The feature branch updates the production Pages workflow so that, if the change is later approved and merged, it will:

1. run the deterministic trilingual build,
2. stage only `index.html`, `en/`, `zh/`, `ja/`, and `assets/`,
3. exclude internal directories such as Registry source, Worker source, docs, site-source, and build scripts from the Pages artifact.

The production workflow trigger remains restricted to its existing production branches. This implementation did not trigger a production release.

## Manual visual-review boundary

Automated structure, content, language, responsive-hook, accessibility, safety, build, Worker-regression and HTTP preview checks have passed.

This environment does not provide a full interactive browser visual-inspection workflow for the deployed HTML pages, so this document does not claim a human visual pass. The remaining review gate is the user's visual/product judgment of:

- overall premium / boutique-advisory feel
- English positioning
- Traditional Chinese wording and line breaks
- Japanese wording and line breaks
- mobile first viewport
- M&A visual priority and capability hierarchy
- Opportunities presentation
- Private Discussion clarity

## Release gate

Do not merge `trilingual-public-site`, `ai-sales-redesign`, `registry-phase1`, or PR #2 into `top` until the user explicitly approves production integration after reviewing the isolated preview.
