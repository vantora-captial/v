# Vantora Public Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Vantora public homepage into a premium Tokyo-based cross-border investment and M&A advisory site with restrained opportunity marketing, native client-facing English/Chinese/Japanese copy, and materially improved mobile typography.

**Architecture:** Keep the existing static GitHub Pages architecture and the current AI-sales integration hooks, but refactor the homepage into a smaller number of clearly ranked sections. Preserve the existing language-switch mechanism and AI assets while replacing the public-facing structure, copy, and visual system on `ai-sales-redesign` only.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript, GitHub Pages, existing `assets/ai-sales.css`, `assets/ai-sales.js`, Node-based frontend tests.

## Global Constraints

- Vantora is the primary visible brand; `Powered by UPEX Tokyo` is a restrained endorsement.
- English is the default public language with `EN / 中文 / 日本語` switching.
- Homepage order: Hero → Who We Work With → What We Do → Selected Opportunities → Why Vantora / Powered by UPEX Tokyo → Selected Experience → Insights → Private Discussion / Contact.
- Hero uses Tokyo-oriented brand imagery; sector imagery appears only in relevant sections.
- Mobile hero headline target is approximately 2.55–2.9rem, with Chinese/Japanese allowed to be slightly smaller.
- Body copy should generally sit around 15–16px on mobile.
- The hero has only two primary actions: `Discuss Your Strategy` and `Explore Selected Opportunities`.
- Do not publish guaranteed returns, live counterparties, confidential exact locations, unverified AUM/account counts/certifications/licensing/transaction volumes, or unsupported project facts.
- The site must remain fully usable without the AI assistant.
- Keep AI integration on the feature branch, but do not make AI the primary conversion path until live verification passes.
- Do not merge to `top` without explicit user review and approval.

---

### Task 1: Lock the New Homepage Contract in Tests

**Files:**
- Modify: `tests/frontend/ai-sales-integration.test.mjs`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: current feature-branch `index.html` and existing AI asset hooks.
- Produces: assertions for the new public information architecture, primary brand, CTA labels, production Worker hook, and removal of the old hero project-tag pattern.

- [ ] **Step 1: Add failing assertions for the approved redesign**

Add checks that `index.html` contains all of the following strings/anchors:

```js
assert.match(html, /Vantora/);
assert.match(html, /Powered by UPEX Tokyo/);
assert.match(html, /Japan Opportunities\. Local Execution\. Global Perspective\./);
assert.match(html, /Discuss Your Strategy/);
assert.match(html, /Explore Selected Opportunities/);
assert.match(html, /id="who-we-work-with"/);
assert.match(html, /id="what-we-do"/);
assert.match(html, /id="opportunities"/);
assert.match(html, /id="why-vantora"/);
assert.match(html, /id="experience"/);
assert.match(html, /id="insights"/);
assert.match(html, /id="contact"/);
assert.match(html, /https:\/\/vantora-ai-sales\.vantora-captial-tech\.workers\.dev/);
assert.doesNotMatch(html, /174K LNG Carriers/);
assert.doesNotMatch(html, /Tell Us Your Mandate/);
```

Also assert that the language selector still includes `EN`, `中文`, and `日本語`.

- [ ] **Step 2: Run the frontend integration test and verify it fails**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL because the old homepage still contains `Tell Us Your Mandate` / hero project tags and lacks the new section IDs/copy.

- [ ] **Step 3: Commit the failing test contract**

```bash
git add tests/frontend/ai-sales-integration.test.mjs
git commit -m "test: define Vantora redesign contract"
```

---

### Task 2: Rebuild the Homepage Structure and Visual System

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: Task 1 homepage contract, existing logo assets, current production Worker meta hook, existing AI CSS/JS includes.
- Produces: the approved Institutional Editorial homepage with Vantora-first branding and responsive layout.

- [ ] **Step 1: Replace the current monolithic homepage content with the approved section order**

Implement these exact public section IDs and semantic roles:

```html
<section id="home" class="hero">...</section>
<section id="who-we-work-with" class="section light">...</section>
<section id="what-we-do" class="section">...</section>
<section id="opportunities" class="section light">...</section>
<section id="why-vantora" class="section">...</section>
<section id="experience" class="section light">...</section>
<section id="insights" class="section">...</section>
<section id="contact" class="section light">...</section>
```

Header navigation should map to these sections and show `Vantora` prominently with small `Powered by UPEX Tokyo` endorsement text.

- [ ] **Step 2: Replace hero content and reduce advertising signals**

Hero copy:

```text
Tokyo-based cross-border advisory
Japan Opportunities. Local Execution. Global Perspective.
Vantora helps international investors and companies navigate investment, M&A, market entry and strategic partnerships in Japan through local execution and cross-border perspective.
```

Hero actions:

```text
Discuss Your Strategy
Explore Selected Opportunities
```

Remove the old hero project-tag row and the third hero CTA.

- [ ] **Step 3: Implement the new visual hierarchy in CSS**

Use CSS variables based on:

```css
:root {
  --navy: #071321;
  --navy-2: #0d2234;
  --ivory: #f4f1e9;
  --paper: #fbfaf6;
  --gold: #b99655;
  --ink: #142235;
  --muted: #66727d;
  --line-dark: rgba(255,255,255,.12);
  --line-light: #ded7ca;
  --max: 1180px;
}
```

Use a desktop hero headline with a restrained upper bound and explicit mobile overrides:

```css
.hero h1 { font-size: clamp(3.4rem, 6.6vw, 6.2rem); line-height: .96; }
@media (max-width: 650px) {
  .hero h1 { font-size: clamp(2.55rem, 11.5vw, 2.9rem); line-height: 1.02; }
  .title { font-size: clamp(1.85rem, 8vw, 2.35rem); }
  body { font-size: 15px; }
}
html[lang="zh"] .hero h1,
html[lang="ja"] .hero h1 { letter-spacing: -.035em; }
@media (max-width: 650px) {
  html[lang="zh"] .hero h1,
  html[lang="ja"] .hero h1 { font-size: clamp(2.35rem, 10.5vw, 2.7rem); }
}
```

Keep card hierarchy quiet: fewer badge styles, smaller card headings, larger section spacing, and no repeated oversized metrics.

- [ ] **Step 4: Preserve the production AI hook without making it primary**

Keep:

```html
<meta name="vantora-ai-api" content="https://vantora-ai-sales.vantora-captial-tech.workers.dev">
<link rel="stylesheet" href="assets/ai-sales.css">
<script type="module" src="assets/ai-sales.js"></script>
```

Do not place AI as the hero CTA. Standard contact remains the primary conversion route.

- [ ] **Step 5: Run the homepage integration test**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the structural redesign**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: redesign Vantora public homepage"
```

---

### Task 3: Rewrite English, Chinese, and Japanese as Native Client-Facing Copy

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: new section structure from Task 2 and existing `data-t` translation mechanism.
- Produces: complete EN/ZH/JA dictionaries using the same translation keys and automatic `<html lang>` updates.

- [ ] **Step 1: Add test assertions for client-facing multilingual CTAs**

Require the translation source to contain:

```text
EN: Discuss Your Strategy
ZH: 与我们讨论您的日本投资计划
JA: 日本での投資・事業機会について相談する
```

Also require `document.documentElement.lang = lang` or equivalent language-attribute update when switching.

- [ ] **Step 2: Run the test and verify the new language assertions fail**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL until the translation dictionary and `<html lang>` update are implemented.

- [ ] **Step 3: Implement the language dictionaries**

Use native external-facing wording rather than literal translation. The dictionaries must cover at minimum:

```text
nav: Who We Work With / What We Do / Selected Opportunities / Why Vantora / Experience / Insights / Contact
hero eyebrow, headline, body, primary CTA, secondary CTA
all audience cards
all capability cards
selected opportunity titles and safe qualitative descriptions
Why Vantora claims
Selected Experience heading and qualitative case summaries
Insights headings
Private Discussion / Contact copy
footer endorsement and legal/disclaimer copy
```

Do not use `Tell Us Your Mandate`, `ticket size` or similarly internal-facing jargon as top-level customer CTA language.

- [ ] **Step 4: Update the language-switch behavior**

When language changes:

```js
document.documentElement.lang = lang;
```

Use `en`, `zh`, and `ja` exactly so the mobile typography rules can target language-specific layouts.

- [ ] **Step 5: Run the frontend integration test**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit multilingual public copy**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: rewrite Vantora public copy in three languages"
```

---

### Task 4: Curate the Image System and Truth-Safe Opportunity Presentation

**Files:**
- Modify: `index.html`
- Reuse or add only verified/local image assets under: `assets/photos/`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: new homepage section markup.
- Produces: Tokyo-first hero imagery and sector-specific image usage without unsupported public deal claims.

- [ ] **Step 1: Add test assertions that the hero is not the existing grid-substation image**

Add an assertion that the hero background/reference does not use:

```text
assets/photos/grid-substation.jpg
```

as the hero image.

- [ ] **Step 2: Run the test and verify it fails if the old hero image remains**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL while the old hero image is still used.

- [ ] **Step 3: Use a Tokyo-oriented hero asset and separate sector images**

Use existing repository assets if suitable. If suitable local assets do not exist, add clearly licensed/project-owned assets before referencing them. Sector imagery should map one-to-one to the relevant theme: LNG, BESS, data center, and Japanese corporate/M&A.

No image may imply a specific live asset, counterparty, site, or transaction unless it is verified and intended for public use.

- [ ] **Step 4: Replace hard-sell numerical opportunity cards with qualitative selected-opportunity cards**

Keep public themes:

```text
LNG & Energy Logistics
Japan BESS & Grid Infrastructure
AI Data Centers & Digital Infrastructure
Japanese Companies & Cross-Border M&A
```

Descriptions should explain capability/access themes without presenting unverified returns, availability, counterparties, exact locations, or transaction certainty.

- [ ] **Step 5: Run the frontend integration test**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit image and opportunity refinements**

```bash
git add index.html assets/photos tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: refine Vantora imagery and opportunity framing"
```

---

### Task 5: Final Responsive, Regression, and Release-Readiness Verification

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `tests/frontend/ai-sales-integration.test.mjs`
- Verification only: `assets/ai-sales.css`, `assets/ai-sales-core.mjs`, `assets/ai-sales.js`

**Interfaces:**
- Consumes: completed redesign and existing AI integration.
- Produces: review-ready feature branch with no production merge.

- [ ] **Step 1: Run all frontend tests**

Run:

```bash
node --test tests/frontend/*.test.mjs
```

Expected: all frontend tests PASS.

- [ ] **Step 2: Run Worker tests and Wrangler dry run**

Run from `worker/`:

```bash
npm test
npx wrangler deploy --dry-run
```

Expected: Worker tests PASS and Wrangler dry run succeeds. This confirms the redesign did not break the independent Worker code path.

- [ ] **Step 3: Verify no production branch merge occurred**

Check that `top` still contains the current production page and that the redesign commits are only on `ai-sales-redesign`.

Expected: no redesign commit on `top`.

- [ ] **Step 4: Review mobile-specific source rules**

Confirm source contains:

```text
mobile hero <= 2.9rem
mobile title <= 2.35rem
15px body baseline
language-specific zh/ja hero override
stacked mobile CTA behavior
```

Also confirm no fixed control obscures the contact section.

- [ ] **Step 5: Scan for unsupported public claims and secrets**

Search source for patterns including:

```text
AUM
account holders
guaranteed return
guarantee
SOC2
API_KEY
RESEND_API_KEY
CLOUDFLARE_API_TOKEN
```

Expected: no secret values and no unsupported claims in public HTML.

- [ ] **Step 6: Record verification evidence and stop for user review**

Update the existing verification record or create a concise redesign verification note under `docs/superpowers/` with the test commands and outcomes. Do not merge or deploy the full redesign to `top` until the user explicitly approves the preview/review state.

- [ ] **Step 7: Commit verification-only fixes/record if any**

```bash
git add index.html tests/frontend docs/superpowers
git commit -m "test: verify Vantora public site redesign"
```
