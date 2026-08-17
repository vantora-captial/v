# Vantora Public Site Redesign Verification

Date: 2026-08-16
Branch: `ai-sales-redesign`
Production branch: `top` (unchanged)

## V2 verification

### Scope verified

- Japan-focused A+C positioning: premium investment / M&A advisory plus selected Japan opportunity access.
- Homepage order: Hero → Who We Help → What We Unlock in Japan → Selected Opportunities → Why Vantora → Selected Experience → Private Discussion / Contact.
- English, Simplified Chinese and Japanese conversion copy included in the public homepage dictionary.
- Hero and CTA language use Japan as the business scope; Tokyo remains only a factual corporate-base reference.
- Selected Opportunities are presented as curated editorial themes rather than a public marketplace.
- Direct email and telephone contact remain available without the AI assistant.
- Existing AI Worker meta hook, AI frontend assets and safety boundaries remain preserved.
- Unsupported financial / regulatory claims remain guarded by frontend tests.

### Core V2 implementation commits

- V2 contract tests: `b2b2613532e8cbebcc5fd87c69e4d3911c5ce8c1`
- V2 homepage implementation: `85d926f35b93406700c3190ad431e7ea959455fc`
- V2 preview health-check update: `f8a3bceb458f21561f1b6c88edf641fa6a0e5930`

## Mobile UI V2 verification

### Mobile scope implemented

- Mobile header is reduced to the VANTORA logo on the left and compact language + menu controls on the right.
- Duplicate `Vantora / Powered by UPEX` brand copy is hidden from the mobile header.
- Mobile header height is set to `66px`.
- Hero uses language-specific editorial line structures instead of relying on uncontrolled wrapping.
- English hero is structured as `Access Japan` + `Through Trusted Local Execution`.
- Simplified Chinese hero is structured as `进入日本市场` + `获取投资、并购与战略合作机会`.
- Japanese hero is structured as `日本市場への` + `投資・M&A・事業機会にアクセス`.
- Hero trustline is removed on mobile to reduce first-screen density.
- Hero CTA actions are vertically stacked and full-width on mobile.
- Who We Help is a lightweight vertical list on mobile.
- What We Unlock is a numbered `01–04` vertical sequence on mobile.
- Selected Opportunities use large vertical editorial modules with larger imagery and one CTA per theme.
- Why Vantora is presented as four reduced text-led reasons on mobile.
- Selected Experience becomes a text-led vertical list instead of equal-height cards.
- Contact becomes a dark closing conversion section with direct email and phone still visible.
- Dedicated small-phone tuning exists at `max-width:390px`.
- Horizontal overflow protection and fixed-header anchor offset are present.

### Mobile implementation evidence

Mobile homepage implementation commit:

- `b31c3f25f02d0b2c6c6f2c0ee9810fb5878b1376` — `feat: rebuild Vantora mobile UI v2`

Current branch head after mobile contract alignment:

- `30def8a03478f0a2a9fdb530873f82e80a3033c7`

AI Sales CI run `31946365375` on current branch head `30def8a03478f0a2a9fdb530873f82e80a3033c7`:

- workflow conclusion: success
- frontend test job: success
- worker test job: success
- Worker dependency install: success
- Worker type generation: success
- Worker tests: success
- Wrangler dry run: success

Cloudflare Pages mobile preview workflow run `31946319299` on mobile homepage commit `b31c3f25f02d0b2c6c6f2c0ee9810fb5878b1376`:

- public-only preview build: success
- Cloudflare Pages deployment: success
- live homepage marker verification: success
- preview URL: `https://c7cf9d73.vantora-site-preview.pages.dev`

The subsequent branch-head change affects the frontend contract test only, not the published page HTML/assets, so the preview corresponds to the current mobile page implementation.

### Image system

Current V2 uses editorial remote Wikimedia Commons references already used by the branch:

- business / corporate environment: `Marunouchi.jpg`
- LNG: `LNG_Carrier.jpg`
- BESS: `BESS_(battery_energy_storage_system).svg`
- data center / computing: `TSUBAME_3.0_PA075096.jpg`

Footer attribution identifies creator/license names. Images are explicitly framed as sector references and not as the exact marketed asset or counterparty.

### Mobile visual review boundary

Automated checks validate source structure, breakpoints, responsive rules, contact availability, AI regression safety and the live deployed HTML marker.

This environment does not provide a visual-browser screenshot facility for arbitrary deployed webpages at simulated 360px / 390px / 430px widths. Therefore the final visual judgement for exact line wrapping, image crop and perceived spacing at those widths remains a user-review item on the live preview. This is not treated as an automated pass.

The user should review the preview specifically for:

1. Header density
2. Chinese line breaks
3. Japanese line breaks
4. Hero first-screen balance
5. Opportunity storytelling
6. Overall mobile spacing and premium feel

### Known AI limitation

The public site can convert through direct contact without AI. The AI assistant remains a secondary layer and is not considered fully production-verified while OpenAI API quota and end-to-end lead-email verification remain separate pending items.

### Release status

- `ai-sales-redesign`: V2 preview branch
- PR #2: Draft review branch
- `top`: not merged / not changed by this V2 mobile implementation
- No production release should occur until explicit user approval of the rendered mobile preview.
