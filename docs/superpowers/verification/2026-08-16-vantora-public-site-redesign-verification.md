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

### Implementation commits

- V2 contract tests: `b2b2613532e8cbebcc5fd87c69e4d3911c5ce8c1`
- V2 homepage implementation: `85d926f35b93406700c3190ad431e7ea959455fc`
- V2 preview health-check update: `f8a3bceb458f21561f1b6c88edf641fa6a0e5930`

### Automated verification evidence

AI Sales CI run `31942651828` on homepage commit `85d926f35b93406700c3190ad431e7ea959455fc`:

- `frontend-tests`: success
- `worker-tests`: success
- Worker dependency install: success
- Worker type generation: success
- Worker tests: success
- Wrangler dry run: success

Preview workflow run `31942686584` on commit `f8a3bceb458f21561f1b6c88edf641fa6a0e5930`:

- public-only preview build: success
- Cloudflare Pages deployment: success
- V2 homepage marker verification (`Access Japan Through Trusted Local Execution`): success
- preview URL: `https://5b5f3091.vantora-site-preview.pages.dev`

### Image system

Current V2 uses editorial remote Wikimedia Commons references already used by the branch:

- business / corporate environment: `Marunouchi.jpg`
- LNG: `LNG_Carrier.jpg`
- BESS: `BESS_(battery_energy_storage_system).svg`
- data center / computing: `TSUBAME_3.0_PA075096.jpg`

Footer attribution identifies creator/license names. Images are explicitly framed as sector references and not as the exact marketed asset or counterparty.

### Mobile contract

Automated source tests verify:

- dedicated `@media(max-width:760px)` layout
- stacked hero CTA actions
- 48px minimum CTA height
- smaller Chinese/Japanese hero typography
- single-column opportunity storytelling on mobile
- existing AI widget mobile / reduced-motion safeguards remain intact

### Manual visual review

A true rendered desktop/mobile visual review is intentionally left for the user on the preview URL. This environment can verify deployed HTML and workflow checks but does not provide a visual browser screenshot of arbitrary webpages. The PR must remain Draft until the user reviews the rendered preview.

### Known AI limitation

The public site can convert through direct contact without AI. The AI assistant remains a secondary layer and is not considered fully production-verified while OpenAI API quota and end-to-end lead-email verification remain separate pending items.

### Release status

- `ai-sales-redesign`: V2 preview branch
- PR #2: review branch
- `top`: not merged / not changed by this V2 implementation
- No production release should occur until explicit user approval of the V2 preview.
