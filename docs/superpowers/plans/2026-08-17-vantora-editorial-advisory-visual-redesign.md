# Vantora Editorial Advisory Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing trilingual Vantora site into an image-led, boutique cross-border M&A / strategic investment advisory experience that matches the visual authority and density of the user-supplied reference while preserving current positioning, three-language routing, Registry safety, AI Concierge, and production isolation.

**Architecture:** Keep the existing static-site generator and vanilla frontend architecture. Concentrate the redesign in `site/templates.mjs`, `assets/site.css`, localized presentation metadata in `site/content.mjs`, and a small set of new public image assets. Existing data, routing, Registry projection, AI, and Worker interfaces remain unchanged unless a failing regression test proves a compatibility fix is required.

**Tech Stack:** Node.js 22; static HTML generator; vanilla JavaScript; CSS; existing Cloudflare Pages preview workflow; existing frontend Node test suite; existing Cloudflare Worker regression suite.

## Global Constraints

- Implement on `trilingual-public-site`; do not merge to `top`.
- Use the user-supplied desktop/mobile reference as a visual benchmark, not a literal copy.
- Keep the primary English hero `Cross-Border M&A & Strategic Investment in Japan` and the already-approved Traditional Chinese / Japanese positioning.
- Vantora remains the primary public brand. UPEX remains a secondary Japan-side operating foundation.
- M&A remains the strongest narrative and visual capability.
- Preserve `/en/`, `/zh/`, `/ja/`, browser-language routing, persisted language choice, canonical / hreflang output, AI Concierge, direct email / telephone, Registry sanitizer, hidden-price behavior, and non-live preview labelling.
- Do not introduce client logos, unverified transaction values, AUM, guarantees, exclusivity, regulatory claims, live counterparties, exact confidential locations, or unsupported project facts.
- Public opportunity imagery may be illustrative. Preview samples must remain visibly identified as non-live.
- Do not add a frontend framework or animation library.
- Respect `prefers-reduced-motion`.
- Do not trigger or modify production release behavior except where packaging tests require preserving existing exclusions.
- Final output must be deployed only to the isolated Cloudflare Pages preview and visually reviewed before any production integration.

---

## File Structure

### Primary files to modify

- `site/templates.mjs` — visual structure hooks for header, hero, editorial sections, opportunity media, numbered process, trust band and closing contact section.
- `site/content.mjs` — visual labels / image metadata only; do not weaken approved copy.
- `assets/site.css` — new institutional navy / ivory / gold visual system, desktop density, editorial typography, mobile compositions.
- `assets/site.js` — only if mobile navigation needs minimal class / state changes; no content logic.
- `assets/opportunities.mjs` — render approved / presentation opportunity images safely using existing whitelisted data plus controlled local fallback metadata.
- `scripts/build-site.mjs` — only if static asset manifest / preview mode requires explicit image emission checks.

### Public image assets to add

Use locally stored, optimized, rights-safe illustrative assets. Suggested paths:

- `assets/images/hero-japan-business.webp`
- `assets/images/opportunity-energy.webp`
- `assets/images/opportunity-data-center.webp`
- `assets/images/opportunity-real-estate.webp`
- `assets/images/opportunity-special-assets.webp`
- `assets/images/contact-japan-boardroom.webp`

If final source imagery differs, keep these semantic responsibilities and update tests consistently.

### Tests to modify / add

- Modify `tests/frontend/site-build.test.mjs`
- Modify `tests/frontend/site-content.test.mjs`
- Modify `tests/frontend/opportunities.test.mjs`
- Add `tests/frontend/site-visual-contract.test.mjs`
- Modify `.github/workflows/ai-sales-ci.yml` only if the new visual test file / image paths are not already covered.
- Reuse `.github/workflows/preview-pages.yml` for isolated preview deployment.

---

## Task 1: Lock the editorial visual contract before changing templates

**Files:**
- Create: `tests/frontend/site-visual-contract.test.mjs`
- Test existing generated pages: `en/index.html`, `zh/index.html`, `ja/index.html`

**Interfaces:**
- Consumes generated HTML from `node scripts/build-site.mjs`.
- Produces a structural contract used by later template and CSS tasks.

- [ ] **Step 1: Write a failing test for required homepage visual hooks.**

Require all three localized homepages to include:

```text
site-header--institutional
hero--image-led
hero__media
hero__overlay
capabilities--editorial
experience--editorial
opportunities--visual
process--numbered
why--trust-band
private-discussion--split
```

Example assertion pattern:

```js
for (const lang of ["en", "zh", "ja"]) {
  const html = readFileSync(`${lang}/index.html`, "utf8");
  for (const token of requiredTokens) assert.match(html, new RegExp(token));
}
```

- [ ] **Step 2: Add a contract for M&A visual priority.**

Require exactly one `capability-primary` element and require it to also include `data-capability="ma"`.

- [ ] **Step 3: Add a contract for image-led opportunity modules.**

Require the homepage and Opportunities listing page to expose `data-opportunity-media` and a stable image container class without requiring actual live image URLs.

- [ ] **Step 4: Add mobile / motion CSS contract assertions.**

Read `assets/site.css` and require:

```text
@media (max-width: 760px)
@media (max-width: 390px)
@media (prefers-reduced-motion: reduce)
overflow-x: clip
```

Also require mobile language navigation selector and a minimum 44px interactive target rule.

- [ ] **Step 5: Run the new test and confirm RED.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-visual-contract.test.mjs
```

Expected: FAIL because the new structural classes are not yet emitted.

- [ ] **Step 6: Commit the red test.**

```bash
git add tests/frontend/site-visual-contract.test.mjs
git commit -m "test: define editorial advisory visual contract"
```

---

## Task 2: Add a controlled image asset system and semantic image metadata

**Files:**
- Add: `assets/images/*.webp`
- Modify: `site/content.mjs`
- Modify: `tests/frontend/site-content.test.mjs`

**Interfaces:**
- `site/content.mjs` adds a `VISUALS` export with language-independent asset metadata.
- Templates consume semantic asset keys; no image path is duplicated in page-specific code.

- [ ] **Step 1: Add failing content tests for visual metadata.**

Require:

```js
assert.equal(VISUALS.hero.src, "/assets/images/hero-japan-business.webp");
assert.equal(VISUALS.hero.kind, "illustrative");
assert.equal(VISUALS.contact.src, "/assets/images/contact-japan-boardroom.webp");
```

Require opportunity visual keys:

```text
energy
digital
cre
special
ma
```

Each must include `src`, `alt.en`, `alt.zh`, `alt.ja`, and `illustrative: true` unless explicitly approved public project imagery is used.

- [ ] **Step 2: Confirm RED.**

```bash
node --test tests/frontend/site-content.test.mjs
```

- [ ] **Step 3: Add optimized local image assets.**

Use WebP at practical web resolutions:

```text
hero: about 1920px wide
opportunity images: about 900–1200px wide
contact image: about 1400px wide
```

Do not commit confidential Registry images. Do not embed external hotlinked URLs.

- [ ] **Step 4: Add `VISUALS` metadata to `site/content.mjs`.**

Example shape:

```js
export const VISUALS = {
  hero: {
    src: "/assets/images/hero-japan-business.webp",
    kind: "illustrative",
    alt: {
      en: "Tokyo business district at dusk",
      zh: "東京商務區黃昏景觀",
      ja: "夕景の東京ビジネスエリア"
    }
  },
  opportunities: {
    energy: { ... },
    digital: { ... },
    cre: { ... },
    special: { ... },
    ma: { ... }
  },
  contact: { ... }
};
```

- [ ] **Step 5: Run content tests.**

```bash
node --test tests/frontend/site-content.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit assets and metadata.**

```bash
git add assets/images site/content.mjs tests/frontend/site-content.test.mjs
git commit -m "feat: add institutional visual asset system"
```

---

## Task 3: Rebuild the shared header and image-led hero

**Files:**
- Modify: `site/templates.mjs`
- Modify: `assets/site.css`
- Modify: `assets/site.js` only if mobile nav needs class alignment
- Test: `tests/frontend/site-visual-contract.test.mjs`
- Test: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- Header emits compact institutional classes without changing route / language semantics.
- Hero consumes `VISUALS.hero` and current localized `HOME[lang].hero` copy.

- [ ] **Step 1: Implement header structural classes only.**

Required structure:

```html
<header class="site-header site-header--institutional">
  <a class="brand">...</a>
  <nav class="site-nav">...</nav>
  <nav class="language-nav">...</nav>
  <button class="menu-toggle">...</button>
</header>
```

Do not remove current accessibility labels, skip-link, route-equivalent language links, or stored-language behavior.

- [ ] **Step 2: Implement image-led hero markup.**

Required composition:

```html
<section class="hero hero--image-led">
  <div class="hero__media">
    <img ... fetchpriority="high" decoding="async">
  </div>
  <div class="hero__overlay"></div>
  <div class="hero__content">...</div>
</section>
```

Hero copy must continue to come from localized content objects.

- [ ] **Step 3: Restyle header and hero in `assets/site.css`.**

Use:

```css
--navy:#061423;
--navy-2:#0a2135;
--paper:#f7f4ed;
--ivory:#eee8dc;
--gold:#b69453;
--gold-soft:#c7aa72;
```

Desktop hero target: approximately 560–680px tall depending viewport, with left content constrained to roughly 560–650px.

Use a directional navy gradient overlay strong enough to meet text contrast.

- [ ] **Step 4: Curate language-specific hero rhythm in CSS.**

Use `[lang="zh-Hant"]` and `[lang="ja"]` rules for slightly smaller display sizing / different line-height where necessary. Do not hardcode translated strings into CSS.

- [ ] **Step 5: Implement mobile header / hero.**

At <=760px:

- header 64–70px
- Vantora brand visible
- compact language links visible
- menu button >=44x44
- hero image remains first-viewport dominant
- CTAs stack
- no text overlaps image focal point

- [ ] **Step 6: Run visual and build tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-visual-contract.test.mjs tests/frontend/site-build.test.mjs
```

Expected: remaining contract failures relate only to later sections.

- [ ] **Step 7: Commit.**

```bash
git add site/templates.mjs assets/site.css assets/site.js en zh ja tests/frontend
git commit -m "feat: add institutional header and image-led hero"
```

---

## Task 4: Replace card-heavy homepage sections with editorial advisory modules

**Files:**
- Modify: `site/templates.mjs`
- Modify: `assets/site.css`
- Generate: `en/index.html`, `zh/index.html`, `ja/index.html`
- Test: `tests/frontend/site-visual-contract.test.mjs`
- Test: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- Preserve existing homepage section order and localized content.
- Change visual composition only.

- [ ] **Step 1: Implement Capabilities as an editorial index.**

M&A lead module:

```html
<article class="capability capability-primary" data-capability="ma">...</article>
```

Remaining five become compact ruled modules. Reduce border radius and vertical whitespace.

- [ ] **Step 2: Implement Experience as a ruled editorial list.**

Each engagement row should expose:

```text
sector
headline
scope
status
```

Use no decorative large card background unless needed for grouping.

- [ ] **Step 3: Implement numbered process.**

Desktop five-column / horizontal sequence:

```text
01 Identify
02 Evaluate
03 Engage
04 Structure
05 Execute
```

Mobile becomes vertical with a fine left or top rule.

- [ ] **Step 4: Implement Why Vantora as a dark trust band.**

Exactly three reasons. Use muted gold indices / icons or rules. Keep UPEX endorsement secondary.

- [ ] **Step 5: Implement split Private Discussion closing section.**

Use contact image on one side and four pathway actions / direct contact on the other. Mobile stacks image then contact content.

- [ ] **Step 6: Tighten desktop density.**

Target section paddings approximately 64–88px rather than oversized 120px+ gaps. Use 1px rules, rectangular modules, and editorial alignment.

- [ ] **Step 7: Run tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-visual-contract.test.mjs tests/frontend/site-build.test.mjs tests/frontend/site-content.test.mjs
```

Expected: PASS except any remaining opportunity-image contract to be addressed next.

- [ ] **Step 8: Commit.**

```bash
git add site/templates.mjs assets/site.css en zh ja tests/frontend
git commit -m "feat: convert homepage to editorial advisory layout"
```

---

## Task 5: Make Selected Opportunities image-led without weakening Registry safety

**Files:**
- Modify: `assets/opportunities.mjs`
- Modify: `site/templates.mjs`
- Modify: `assets/site.css`
- Modify: `tests/frontend/opportunities.test.mjs`
- Modify: `tests/frontend/site-visual-contract.test.mjs`

**Interfaces:**
- Existing public projector remains whitelist-only.
- Image rendering chooses only approved `imageKeys` or controlled local illustrative fallbacks by public category.
- No internal Registry fields are added to the projection.

- [ ] **Step 1: Extend hostile-fixture tests for image rendering.**

Require the projector still ignores:

```text
sellerOwner
internalNotes
sourceIntroducer
imoNumber
registration
serialNumber
```

Add tests that an unrecognized `imageKeys` value is not interpolated as arbitrary HTML.

- [ ] **Step 2: Add a safe visual resolver helper.**

Export:

```js
export function resolveOpportunityVisual(project, visuals) { ... }
```

Behavior:

1. If a future approved public image URL / key is mapped by a trusted site-controlled resolver, return it.
2. Otherwise choose local illustrative image by public category.
3. Return `{ src, alt, illustrative }`.
4. Never construct arbitrary filesystem / URL paths from raw Registry strings.

- [ ] **Step 3: Render media blocks with DOM APIs.**

Each opportunity module:

```html
<figure class="opportunity-card__media" data-opportunity-media>...</figure>
```

Set `img.src`, `img.alt`, and text labels with DOM setters / `textContent`.

- [ ] **Step 4: Keep presentation sample warning prominent.**

Every presentation-only sample retains localized `not a live mandate` wording adjacent to its title / metadata.

- [ ] **Step 5: Style desktop visual modules.**

Use 3–4 modules or one lead + secondary arrangement. Image crop should be consistent. Cards should be rectangular with fine border and minimal radius.

- [ ] **Step 6: Style mobile opportunity rows.**

Use a compact image + text layout inspired by the supplied mobile reference. Keep tap target >=44px and avoid truncated key metadata.

- [ ] **Step 7: Run safety + visual tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/opportunities.test.mjs tests/frontend/site-visual-contract.test.mjs tests/frontend/site-build.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit.**

```bash
git add assets/opportunities.mjs site/templates.mjs assets/site.css tests/frontend en zh ja
git commit -m "feat: add safe image-led opportunities presentation"
```

---

## Task 6: Extend the same institutional visual language across interior pages

**Files:**
- Modify: `site/templates.mjs`
- Modify: `assets/site.css`
- Generate all localized interior pages
- Modify: `tests/frontend/site-visual-contract.test.mjs`

**Interfaces:**
- Capabilities, Experience, Opportunities, About, and Contact keep existing data / route semantics.
- Shared `page-hero--editorial`, `editorial-index`, and `editorial-section` classes establish a consistent site-wide visual grammar.

- [ ] **Step 1: Add failing interior-page visual assertions.**

Require each primary interior page to contain `page-hero--editorial` and at least one `editorial-section`.

- [ ] **Step 2: Build Capabilities page visual hierarchy.**

Use a dark / image-accented intro, M&A lead section, and numbered / ruled supporting capabilities.

- [ ] **Step 3: Build Experience page as case-study rows.**

Emphasize engagement type, role, scope, and status with an institutional reading rhythm.

- [ ] **Step 4: Build Opportunities listing with compact filters and visual modules.**

Do not introduce marketplace-style counters, availability badges, or fake urgency.

- [ ] **Step 5: Build About page with a large editorial statement and secondary UPEX foundation block.**

Keep Vantora dominant.

- [ ] **Step 6: Build Contact page as split editorial layout.**

Four pathways remain primary; direct email / phone remain permanently visible.

- [ ] **Step 7: Run full frontend tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 8: Commit.**

```bash
git add site/templates.mjs assets/site.css en zh ja tests/frontend
git commit -m "feat: extend institutional design across trilingual site"
```

---

## Task 7: Responsive polish, CI regression, public-output audit, and isolated preview handoff

**Files:**
- Modify: `assets/site.css`
- Modify: `.github/workflows/ai-sales-ci.yml` only if necessary
- Update: `docs/superpowers/verification/2026-08-17-vantora-trilingual-public-site-verification.md`

**Interfaces:**
- Final branch must pass all frontend + Worker CI and preview workflow.
- Production remains untouched.

- [ ] **Step 1: Add 375px / 390px responsive assertions.**

Contract should require:

- no horizontal overflow utility / root rule
- language switch visible
- menu target >=44px
- stacked CTAs
- opportunity media row layout
- AI launcher clearance padding / safe-area consideration

- [ ] **Step 2: Refine mobile CSS.**

Check:

```text
375px mobile
390px mobile
768px tablet
1024px desktop
1440px desktop
```

No hidden content solely to mimic the reference image.

- [ ] **Step 3: Run complete frontend verification.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 4: Run Worker regression verification.**

```bash
cd worker
npm install
npm run types
npx tsc --noEmit
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: all pass; dry-run only.

- [ ] **Step 5: Audit generated public output.**

Run the existing CI audit plus checks equivalent to:

```bash
grep -R -n -Ei "seller_owner|source_introducer|internal_notes|imo_number|serial_number|OPENAI_API_KEY|RESEND_API_KEY|guaranteed return|exclusive opportunity" index.html en zh ja assets --exclude='*.svg'
```

Expected: no confidential Registry fields, secrets, or prohibited public claims.

- [ ] **Step 6: Require fresh green `AI Sales CI` on final HEAD.**

Verify frontend build/tests/audit and Worker types/tests/dry-run all succeed.

- [ ] **Step 7: Require fresh green `Deploy Vantora Preview` on final HEAD.**

Review URL remains the isolated branch preview:

```text
https://trilingual-public-site.vantora-site-preview.pages.dev/en/
https://trilingual-public-site.vantora-site-preview.pages.dev/zh/
https://trilingual-public-site.vantora-site-preview.pages.dev/ja/
```

- [ ] **Step 8: Update verification document with exact final evidence.**

Record:

```text
final commit SHA
frontend test result
Worker result
CI run ID
preview run ID
preview URL
visual redesign scope
Registry live-endpoint state
production status: not merged
```

- [ ] **Step 9: Stop at visual review gate.**

Ask the user to judge only:

```text
hero authority
nav/logo refinement
desktop information density
M&A visual priority
Selected Opportunities presentation
Traditional Chinese line breaks
Japanese line breaks
mobile first viewport
mobile opportunity scanability
overall boutique advisory feel
```

Do not merge to `top` until explicit production approval.

---

## Plan Self-Review

- [x] Visual benchmark is used as inspiration, not copied literally.
- [x] Approved M&A-led positioning remains unchanged.
- [x] Existing trilingual routing and SEO remain in scope and untouched functionally.
- [x] Registry safety and non-live sample labelling are explicit requirements.
- [x] Image sourcing is constrained to local, rights-safe illustrative assets or explicitly approved public project imagery.
- [x] Mobile behavior is designed deliberately rather than mechanically shrinking desktop.
- [x] No frontend framework or unnecessary animation dependency is introduced.
- [x] Full frontend and Worker regression checks are required before preview handoff.
- [x] Production integration remains outside the implementation scope until explicit approval.
