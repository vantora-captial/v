# Vantora Mobile UI V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Vantora mobile experience as a purpose-built interface with a minimal header, language-specific hero wrapping, reduced card repetition, editorial opportunity storytelling, and stronger mobile conversion hierarchy.

**Architecture:** Keep the existing static single-page architecture and multilingual data binding in `index.html`, but add mobile-specific structural classes and responsive behavior rather than merely shrinking desktop CSS. Use the existing Node frontend contract tests as the regression layer, preserve AI assets untouched unless a real collision is found, and deploy only from `ai-sales-redesign` to the existing isolated Cloudflare Pages preview.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript; Node.js built-in test runner; GitHub Actions; Cloudflare Pages preview; existing `assets/ai-sales.js` and `assets/ai-sales.css`.

## Global Constraints

- Primary mobile principle: **One screen, one message, one clear action.**
- Mobile header shows VANTORA logo only on the left, compact language selector + menu on the right.
- Duplicate `Vantora / Powered by UPEX` text is absent from the mobile header.
- Header target height is approximately `64–68px`.
- English hero headline maximum: 3 lines.
- Chinese hero structure: `进入日本市场` + `获取投资、并购与战略合作机会`.
- Japanese hero structure: `日本市場への` + `投資・M&A・事業機会にアクセス` with natural manual line breaking.
- Who We Help is a 3-item lightweight vertical list on mobile.
- What We Unlock is a 4-item numbered vertical sequence on mobile.
- Selected Opportunities uses one large editorial story per opportunity on mobile.
- Why Vantora is reduced to four core reasons on mobile.
- Selected Experience must avoid repetitive equal-height card treatment on mobile.
- Contact ends with a visually distinct conversion section.
- Mobile body text remains approximately `15px` with readable line-height.
- Review at approximately 360px, 390px, and 430px widths.
- Direct contact remains usable without AI.
- No unsupported financial, regulatory, or project claims.
- `top` remains untouched until explicit approval.

---

## File Structure

- Modify `index.html` — mobile header markup behavior, hero line-break hooks, section classes, responsive CSS, mobile-only editorial layout rules.
- Modify `tests/frontend/ai-sales-integration.test.mjs` — mobile header, hero line-break, numbered sequence, opportunity editorial layout, CTA, direct contact, and safety assertions.
- Preserve `assets/ai-sales.js` — AI behavior remains separate.
- Preserve `assets/ai-sales.css` — change only if a real mobile overlap is verified.
- Preserve `.github/workflows/preview-pages.yml` — existing preview workflow should deploy changes automatically.
- Update `docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md` — record mobile-specific verification evidence.

---

### Task 1: Define the mobile UI contract in tests

**Files:**
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: current V2 homepage HTML/CSS.
- Produces: failing assertions for the approved mobile design before implementation.

- [ ] **Step 1: Add a minimal-header test**

```js
test("mobile header uses the approved minimal brand treatment", () => {
  assert.match(html, /class="brand-mark"|class="brand"/);
  assert.match(html, /class="mobile-brand-copy"/);
  assert.match(html, /@media\(max-width:760px\)/);
  assert.match(html, /\.mobile-brand-copy\{display:none/);
  assert.match(html, /\.nav\{height:6[4-8]px/);
});
```

- [ ] **Step 2: Add language-specific hero structure assertions**

```js
test("mobile hero has language-specific editorial line break hooks", () => {
  assert.match(html, /Access Japan/);
  assert.match(html, /Through Trusted Local Execution/);
  assert.match(html, /进入日本市场/);
  assert.match(html, /获取投资、并购与战略合作机会/);
  assert.match(html, /日本市場への/);
  assert.match(html, /投資・M&A・事業機会にアクセス/);
  assert.match(html, /hero-line/);
});
```

- [ ] **Step 3: Add mobile section-pattern assertions**

```js
test("mobile sections use list and editorial patterns instead of repeated card grids", () => {
  assert.match(html, /audience-list/);
  assert.match(html, /unlock-list/);
  assert.match(html, /unlock-index/);
  assert.match(html, /opportunity-feature/);
  assert.match(html, /why-mobile-list/);
  assert.match(html, /experience-list/);
});
```

- [ ] **Step 4: Run frontend tests to confirm the new mobile contract fails**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL on the newly required mobile classes/line-break hooks.

- [ ] **Step 5: Commit the red mobile contract**

```bash
git add tests/frontend/ai-sales-integration.test.mjs
git commit -m "test: define Vantora mobile UI v2 contract"
```

---

### Task 2: Simplify the mobile header

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: existing desktop header and language selector.
- Produces: mobile header with logo left, language + menu right, no duplicate brand copy.

- [ ] **Step 1: Wrap the secondary brand text in a mobile-hide hook**

Use markup equivalent to:

```html
<a class="brand" href="#home">
  <img class="brand-mark" src="assets/vantora-logo-white.svg" alt="Vantora">
  <span class="mobile-brand-copy">
    <span class="brand-name">Vantora</span>
    <small data-t="brandEndorsement">Powered by UPEX</small>
  </span>
</a>
```

- [ ] **Step 2: Make the mobile controls compact**

At `max-width:760px`, apply:

```css
.nav{height:66px;gap:10px}
.mobile-brand-copy{display:none}
.brand-mark{height:27px;width:auto}
.tools{gap:6px;margin-left:auto}
.lang{min-height:44px;padding:0 10px;border-radius:12px;font-size:.76rem}
.menu{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px}
```

- [ ] **Step 3: Ensure mobile menu opens below the shorter fixed header**

Use:

```css
@media(max-width:760px){
  .links{top:66px;left:15px;right:15px}
}
```

- [ ] **Step 4: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: minimal-header test passes.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: simplify Vantora mobile header"
```

---

### Task 3: Add language-specific hero wrapping and mobile CTA hierarchy

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: existing `copy = { en, zh, ja }` dictionary and `data-t` binding.
- Produces: controlled mobile hero wrapping without breaking desktop copy semantics.

- [ ] **Step 1: Add line-break-aware hero markup**

Use a structure that can render separate mobile lines while preserving accessible text, for example:

```html
<h1 class="hero-title" data-t-html="heroTitleHtml">...</h1>
```

with dictionary values:

```js
en: { heroTitleHtml: '<span class="hero-line">Access Japan</span><span class="hero-line">Through Trusted Local Execution</span>' },
zh: { heroTitleHtml: '<span class="hero-line">进入日本市场</span><span class="hero-line">获取投资、并购与战略合作机会</span>' },
ja: { heroTitleHtml: '<span class="hero-line">日本市場への</span><span class="hero-line">投資・M&A・事業機会にアクセス</span>' }
```

Because the existing translation system currently favors `textContent`, implement a safe dedicated hero renderer that only consumes trusted static dictionary strings. Do not use visitor input in this path.

- [ ] **Step 2: Add mobile hero typography**

```css
@media(max-width:760px){
  .hero{min-height:calc(100svh - 66px);padding:112px 0 48px}
  .hero-title{font-size:clamp(2.2rem,9.5vw,2.7rem);line-height:1.04;margin-bottom:1rem}
  html[lang="zh"] .hero-title,
  html[lang="ja"] .hero-title{font-size:clamp(2.05rem,8.8vw,2.55rem)}
  .hero-line{display:block}
  .hero-copy-text{max-width:34em;font-size:.96rem;line-height:1.65}
}
```

- [ ] **Step 3: Make mobile CTAs full width and primary-first**

```css
@media(max-width:760px){
  .hero-actions{display:flex;flex-direction:column;align-items:stretch;gap:.7rem;margin-top:22px}
  .hero-actions .btn{width:100%;min-height:48px}
}
```

- [ ] **Step 4: Keep support text concise in each language**

Mobile copy should not repeat the headline. Keep each hero support paragraph short enough to target roughly 3–4 lines around 390px width.

- [ ] **Step 5: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: hero line-break and CTA tests pass; public-source safety tests remain green.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: add language-aware mobile hero layout"
```

---

### Task 4: Convert Who We Help and What We Unlock into mobile editorial lists

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: existing section content.
- Produces: lightweight mobile audience list and numbered capabilities sequence.

- [ ] **Step 1: Add stable structural classes**

Who We Help:

```html
<div class="audience-list">...</div>
```

What We Unlock:

```html
<div class="unlock-list">
  <article class="unlock-item"><span class="unlock-index">01</span>...</article>
  <article class="unlock-item"><span class="unlock-index">02</span>...</article>
  <article class="unlock-item"><span class="unlock-index">03</span>...</article>
  <article class="unlock-item"><span class="unlock-index">04</span>...</article>
</div>
```

- [ ] **Step 2: Remove mobile card chrome from Who We Help**

```css
@media(max-width:760px){
  .audience-list{display:block;border-top:1px solid var(--line-light)}
  .audience{padding:24px 0;border:0;border-bottom:1px solid var(--line-light);background:none;border-radius:0}
}
```

- [ ] **Step 3: Style What We Unlock as a numbered sequence**

```css
@media(max-width:760px){
  .unlock-list{display:block;border-top:1px solid var(--line-dark)}
  .unlock-item{display:grid;grid-template-columns:42px 1fr;gap:14px;padding:24px 0;border-bottom:1px solid var(--line-dark);background:none}
  .unlock-index{font-size:.72rem;letter-spacing:.12em;color:#d9bd82;font-weight:800}
}
```

- [ ] **Step 4: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: list-pattern assertions pass.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: simplify mobile audience and capability sections"
```

---

### Task 5: Rebuild Selected Opportunities for mobile storytelling

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: existing four opportunity themes and imagery.
- Produces: one near-full-screen editorial opportunity story per theme.

- [ ] **Step 1: Ensure each opportunity uses the editorial feature structure**

```html
<article class="opportunity-feature">
  <figure class="opportunity-media">...</figure>
  <div class="opportunity-body">
    <p class="opportunity-kicker">Selected Theme</p>
    <h3>...</h3>
    <p class="opportunity-description">...</p>
    <a class="opportunity-cta" href="#contact">Request Details</a>
  </div>
</article>
```

- [ ] **Step 2: Add mobile visual proportions**

```css
@media(max-width:760px){
  .opportunities-grid{display:block}
  .opportunity-feature{display:block;margin:0 0 56px;border:0;border-radius:0;background:transparent}
  .opportunity-media{height:clamp(300px,72vw,390px);margin:0 0 22px;border-radius:16px;overflow:hidden}
  .opportunity-body{padding:0}
  .opportunity-description{max-width:34em}
  .opportunity-cta{display:inline-flex;margin-top:18px;min-height:44px;align-items:center}
}
```

- [ ] **Step 3: Shorten mobile descriptions where needed**

Each opportunity description should target 2–3 lines at about 390px width while remaining accurate and qualitative.

- [ ] **Step 4: Preserve truthfulness guards**

Do not introduce price, return, ticket size, exact availability count, confidential counterparties, or unsupported claims.

- [ ] **Step 5: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: opportunity editorial assertions and truth-safety tests pass.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: make opportunities mobile editorial stories"
```

---

### Task 6: Simplify Why Vantora, Experience, and Contact on mobile

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: existing trust, experience, and contact content.
- Produces: four-reason trust list, text-led experience list, and stronger closing CTA.

- [ ] **Step 1: Reduce mobile Why Vantora to four core reasons**

Use these four headings:

```text
Japan-wide local execution
Cross-border M&A and investment perspective
Senior, hands-on involvement
Confidential private process
```

Wrap them in:

```html
<div class="why-mobile-list">...</div>
```

- [ ] **Step 2: Convert experience cards to a text-led list on mobile**

Add:

```html
<div class="experience-list">...</div>
```

and mobile CSS:

```css
@media(max-width:760px){
  .experience-list{display:block}
  .case{padding:24px 0;border:0;border-bottom:1px solid var(--line-light);border-radius:0;background:transparent;min-height:0}
}
```

- [ ] **Step 3: Strengthen the contact closing section**

At mobile width:

```css
@media(max-width:760px){
  #contact{background:var(--navy);color:#fff}
  .contact-grid{display:block}
  .contact-panel{background:transparent;border:0;border-radius:0;padding:0}
  .contact-panel .btn{width:100%;margin-top:18px}
  .contact-line{border-color:var(--line-dark)}
}
```

Keep `mailto:info@u-pex.com` and phone visible below the main CTA.

- [ ] **Step 4: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: section-pattern, direct contact, and safety tests pass.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: streamline Vantora mobile trust experience and contact"
```

---

### Task 7: Tune mobile spacing, overflow, and small-phone behavior

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: completed mobile structural changes.
- Produces: stable 360px / 390px / 430px behavior without horizontal overflow.

- [ ] **Step 1: Add mobile spacing tokens through direct CSS values**

```css
@media(max-width:760px){
  .section{padding:70px 0}
  .section-head{gap:14px;margin-bottom:32px}
  .section-head .intro{margin-top:0}
  .title{font-size:clamp(1.8rem,7.7vw,2.25rem);line-height:1.08}
}
```

- [ ] **Step 2: Add a small-phone refinement at 390px**

```css
@media(max-width:390px){
  .wrap{width:calc(100% - 28px)}
  .hero-title{font-size:2.16rem}
  html[lang="zh"] .hero-title,
  html[lang="ja"] .hero-title{font-size:2.02rem}
  .lang{padding:0 8px}
}
```

- [ ] **Step 3: Prevent horizontal scrolling**

Use:

```css
html,body{max-width:100%;overflow-x:hidden}
img,svg{max-width:100%}
```

Do not hide genuine layout bugs with arbitrary negative margins.

- [ ] **Step 4: Ensure fixed-header anchors are not hidden**

```css
section[id]{scroll-margin-top:80px}
```

- [ ] **Step 5: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: all frontend tests pass.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: tune Vantora mobile spacing and small-screen stability"
```

---

### Task 8: Verify mobile layout and refresh preview

**Files:**
- Modify: `docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md`

**Interfaces:**
- Consumes: final mobile branch state.
- Produces: fresh CI + preview evidence and a review-ready mobile build.

- [ ] **Step 1: Run the full frontend suite**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 2: Verify Worker regression checks still pass**

```bash
cd worker
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: tests PASS; dry run succeeds without production deployment.

- [ ] **Step 3: Confirm fresh `AI Sales CI` is green on the final mobile HEAD**

Require success for:

```text
frontend-tests
worker-tests
type generation
Wrangler dry run
```

- [ ] **Step 4: Confirm fresh isolated preview deployment**

`Deploy Vantora Preview` must succeed on the final mobile HEAD and publish only `index.html` + `assets/**`.

- [ ] **Step 5: Review the rendered site at 360px, 390px, and 430px**

For each width, inspect EN / 中文 / JA and record:

```text
header does not repeat Vantora brand text
language + menu do not overlap
hero headline wraps naturally
at least one CTA is visible early in the viewport where practical
Who We Help reads as a lightweight list
What We Unlock reads as 01–04 numbered sequence
opportunities feel like large editorial stories
Why Vantora is visually reduced
experience no longer looks like repeated cards
contact CTA dominates direct contact details
no horizontal scrolling
no clipped text
```

- [ ] **Step 6: Update verification documentation**

Record:

```text
final mobile commit SHA
frontend test result
worker test result
Wrangler dry-run result
CI workflow run ID/status
preview workflow run ID/status
preview URL
manual EN/ZH/JA review at 360/390/430px
release status: not merged to top
```

- [ ] **Step 7: Commit verification note**

```bash
git add docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md
git commit -m "docs: verify Vantora mobile UI v2"
```

---

### Task 9: Hand off the mobile preview for approval

**Files:**
- No production file changes.

**Interfaces:**
- Consumes: fresh verified preview.
- Produces: a user review checkpoint before any merge to `top`.

- [ ] **Step 1: Keep PR #2 as Draft**

Do not merge, mark ready, or update `top`.

- [ ] **Step 2: Present the preview URL and ask for review of exactly these areas**

```text
1. Header density
2. Chinese line breaks
3. Japanese line breaks
4. Hero first-screen balance
5. Opportunity storytelling
6. Overall mobile spacing and premium feel
```

- [ ] **Step 3: Make follow-up changes only on `ai-sales-redesign`**

Any revisions from user review repeat the relevant test → implement → verify → preview cycle before production integration.
