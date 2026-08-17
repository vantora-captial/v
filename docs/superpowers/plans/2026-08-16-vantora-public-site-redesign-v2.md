# Vantora Public Site Redesign V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public homepage into a Japan-focused A+C experience: premium cross-border investment/M&A advisory on the surface, with selected Japan opportunities and stronger commercial conversion underneath.

**Architecture:** Keep the public site as the existing static single-page application in `index.html`, preserving the current language-switch mechanism and AI widget integration. Update the homepage information architecture, three-language conversion copy, editorial image system, responsive CSS, and frontend contract tests in small test-first increments. Keep deployment isolated to `ai-sales-redesign` and the existing Cloudflare Pages preview until explicit approval to merge into `top`.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript; Node.js built-in test runner; GitHub Actions; Cloudflare Pages preview; existing AI sales assets in `assets/ai-sales.js` and `assets/ai-sales.css`.

## Global Constraints

- Primary positioning is **Japan-focused**, not Tokyo-only.
- Vantora combines **premium Japan investment / M&A advisory** with a **Japan opportunities & resource-access platform**.
- Primary homepage order is: Hero → Who We Help → What We Unlock in Japan → Selected Opportunities → Why Vantora → Selected Experience → Private Discussion / Contact.
- Insights / News must not interrupt the primary homepage conversion flow.
- Primary CTAs are **Explore Opportunities** and **Book a Private Discussion**, with natural Chinese and Japanese equivalents.
- Hero imagery must communicate premium Japan business/investment access and must not imply Tokyo-only coverage.
- Opportunity imagery must be sector-specific and editorial, not marketplace-like.
- English, Simplified Chinese, and Japanese must be written for commercial conversion, not literal translation.
- Do not publish unsupported metrics, guaranteed returns, live counterparties, confidential locations, AUM, client counts, certifications, licenses, transaction values, or regulatory claims.
- Standard contact must remain usable independently of AI.
- AI remains secondary and must preserve the current production Worker hook and safety boundaries.
- `top` remains untouched until explicit user approval.
- Preview remains isolated on the `ai-sales-redesign` branch.

---

## File Structure

- Modify `index.html` — homepage structure, visual system, responsive CSS, multilingual copy dictionary, editorial image references, contact conversion flow.
- Modify `tests/frontend/ai-sales-integration.test.mjs` — V2 homepage contract, language copy, structure, image strategy, truthfulness guards, mobile behavior.
- Preserve `assets/ai-sales.js` — no redesign behavior should move into the AI widget.
- Preserve `assets/ai-sales.css` — only change later if V2 reveals a genuine collision with the redesigned page; otherwise keep AI styling independent.
- Preserve `.github/workflows/preview-pages.yml` — the existing isolated preview deploy should automatically publish homepage changes.
- Update `docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md` — record V2 verification evidence after implementation.

### Interface boundaries

- `index.html` owns all public homepage layout, site-level language state, CTA behavior, and static presentation.
- `assets/ai-sales.js` owns AI interaction only and remains session-scoped.
- `tests/frontend/ai-sales-integration.test.mjs` acts as the public contract for homepage wording, section order, responsive design signals, asset safety, and AI integration preservation.
- Preview workflow consumes the branch contents and publishes only `index.html` plus `assets/**`.

---

### Task 1: Replace the V1 homepage contract with the approved V2 Japan-focused contract

**Files:**
- Modify: `tests/frontend/ai-sales-integration.test.mjs`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: current static homepage markup from `index.html`.
- Produces: a failing V2 contract that later homepage tasks must satisfy.

- [ ] **Step 1: Replace the V1 redesign assertions with V2 structure and positioning assertions**

Update the existing `homepage matches the approved Vantora public redesign contract` test so it requires the new positioning and section structure:

```js
test("homepage matches the approved Vantora V2 Japan-focused contract", () => {
  assert.match(html, /Vantora/);
  assert.match(html, /Access Japan Through Trusted Local Execution/);
  assert.match(html, /Explore Opportunities/);
  assert.match(html, /Book a Private Discussion/);
  assert.match(html, /id="who-we-help"/);
  assert.match(html, /id="what-we-unlock"/);
  assert.match(html, /id="opportunities"/);
  assert.match(html, /id="why-vantora"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="contact"/);
  assert.doesNotMatch(html, /id="insights"/);
  assert.doesNotMatch(html, /Japan Opportunities\. Local Execution\. Global Perspective\./);
  assert.doesNotMatch(html, /Discuss Your Strategy/);
  assert.doesNotMatch(html, /Tokyo-based cross-border advisory/);
});
```

- [ ] **Step 2: Add explicit Japan-not-Tokyo positioning guards**

Add a new test:

```js
test("brand scope is Japan-focused rather than Tokyo-only", () => {
  assert.match(html, /Japan-focused|across Japan|in Japan/);
  assert.doesNotMatch(html, /Start a Private Discussion in Tokyo/);
  assert.doesNotMatch(html, /Tokyo-based local execution/);
  assert.match(html, /Powered by UPEX/);
});
```

This test should allow the postal address to contain Tokyo; it only forbids Tokyo as the public business-scope proposition.

- [ ] **Step 3: Run the frontend tests to verify the new contract fails against V1**

Run:

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL on the new headline, section IDs, CTA labels, and/or removed Insights requirement.

- [ ] **Step 4: Commit the red contract**

```bash
git add tests/frontend/ai-sales-integration.test.mjs
git commit -m "test: define Vantora V2 Japan conversion contract"
```

---

### Task 2: Rebuild the homepage information architecture around the A+C conversion journey

**Files:**
- Modify: `index.html`
- Test: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: section IDs required by Task 1.
- Produces: final homepage order and stable anchor IDs for navigation and CTAs.

- [ ] **Step 1: Replace the current homepage section order with the seven-stage V2 flow**

In `index.html`, implement sections in this exact DOM order:

```html
<section class="hero" id="home">...</section>
<section id="who-we-help">...</section>
<section id="what-we-unlock">...</section>
<section id="opportunities">...</section>
<section id="why-vantora">...</section>
<section id="experience">...</section>
<section id="contact">...</section>
```

Remove the primary `#insights` homepage section rather than leaving it hidden between conversion sections.

- [ ] **Step 2: Update navigation anchors to match the new structure**

Use concise public labels:

```html
<a href="#who-we-help">Who We Help</a>
<a href="#what-we-unlock">Japan Access</a>
<a href="#opportunities">Opportunities</a>
<a href="#why-vantora">Why Vantora</a>
<a href="#contact">Contact</a>
```

Language switching may later replace these labels, but anchors must remain stable.

- [ ] **Step 3: Implement the V2 hero skeleton and conversion actions**

The English default hero must contain:

```html
<p class="eyebrow">Japan-focused cross-border investment &amp; M&amp;A</p>
<h1>Access Japan Through Trusted Local Execution</h1>
<p class="hero-copy">Vantora helps international investors and companies identify, access, structure and execute investment, acquisition and strategic partnership opportunities across Japan.</p>
<a class="button button-primary" href="#opportunities">Explore Opportunities</a>
<a class="button button-secondary" href="#contact">Book a Private Discussion</a>
```

Do not add sector badges, project sizes, investment-return claims, or a third hero CTA.

- [ ] **Step 4: Run the frontend contract tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: the structure/headline/CTA assertions from Task 1 pass; multilingual and image tests may still fail until later tasks.

- [ ] **Step 5: Commit the structural rebuild**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: rebuild Vantora homepage around Japan access journey"
```

---

### Task 3: Rewrite English homepage copy for stronger commercial conversion

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: section structure from Task 2.
- Produces: approved English default copy used as the baseline for native Chinese and Japanese adaptations.

- [ ] **Step 1: Add English conversion-copy assertions before changing the page**

Add this test:

```js
test("English copy frames outcomes and access rather than generic consulting services", () => {
  for (const phrase of [
    "Access selected Japan investment and acquisition opportunities",
    "What We Unlock in Japan",
    "Investment Access",
    "M&A & Strategic Acquisitions",
    "Market Entry & Partnerships",
    "Capital & Strategic Matching",
    "Selected Opportunities",
    "Start a Private Discussion About Japan"
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(html, /Tell Us Your Mandate/);
  assert.doesNotMatch(html, /ticket size/i);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL because the V2 English body copy is not yet complete.

- [ ] **Step 3: Write the English content for `Who We Help`**

Use three audience blocks:

```text
Investors, Funds & Family Offices
Access selected Japan investment and acquisition opportunities with local context and execution support.

Overseas Companies Entering Japan
Build market-entry, partnership, acquisition and local execution pathways with an on-the-ground team.

Japanese Companies & Project Owners
Connect with international capital, strategic buyers and business partners through a structured cross-border process.
```

- [ ] **Step 4: Write the English content for `What We Unlock in Japan`**

Use exactly four pillars:

```text
Investment Access
Selected Japan investment, infrastructure and strategic opportunities.

M&A & Strategic Acquisitions
Target sourcing, transaction coordination, negotiation support and local execution.

Market Entry & Partnerships
Local partners, distribution, joint ventures and commercial alliances.

Capital & Strategic Matching
International investors, buyers and strategic counterparties for Japanese companies and projects.
```

- [ ] **Step 5: Write the English trust and closing conversion copy**

`Why Vantora` should communicate:

```text
Japan-wide local execution
Cross-border investment & M&A perspective
Senior, hands-on support
Local business access and counterparty coordination
Multilingual communication
Confidential, private process
```

Contact section:

```text
Start a Private Discussion About Japan
Discuss your Japan investment, acquisition, market-entry or strategic partnership objectives with our team.
Book a Private Discussion
```

Keep the existing UPEX company address, phone, and email factual contact details.

- [ ] **Step 6: Run the frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: English conversion-copy test passes.

- [ ] **Step 7: Commit the English conversion layer**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: strengthen Vantora English conversion copy"
```

---

### Task 4: Rewrite Simplified Chinese and Japanese as native commercial copy

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: English content structure from Task 3 and existing `copy = { en, zh, ja }` language mechanism.
- Produces: complete native client-facing `zh` and `ja` dictionaries with matching semantic sections and CTA intent.

- [ ] **Step 1: Replace the existing multilingual CTA test with V2-native copy requirements**

Use:

```js
test("Chinese and Japanese use native V2 commercial conversion copy", () => {
  for (const phrase of [
    "进入日本市场，获取投资、并购与战略合作机会",
    "查看日本精选机会",
    "预约一对一私密沟通",
    "日本市場への投資・M&A・事業機会にアクセス",
    "日本の投資・M&A機会を見る",
    "個別相談を予約する"
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /document\.documentElement\.lang=lang/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL on old Chinese/Japanese CTA wording.

- [ ] **Step 3: Rewrite the Chinese hero and primary CTAs**

Use:

```text
Eyebrow: 专注日本的跨境投资与并购
Headline: 进入日本市场，获取投资、并购与战略合作机会
Support: Vantora 面向国际投资者与企业，提供日本投资机会筛选、企业并购、市场进入、本地合作方对接及项目执行支持。
Primary CTA: 查看日本精选机会
Secondary CTA: 预约一对一私密沟通
```

- [ ] **Step 4: Rewrite Chinese section language around client outcomes**

Required phrases/ideas:

```text
我们服务的客户
我们帮助您在日本实现什么
投资机会获取
企业并购与战略收购
日本市场进入与合作伙伴
资本与战略资源对接
为什么选择 Vantora
讨论您的日本投资与业务计划
```

Avoid translated phrases such as “委托规模”, “Mandate”, “赋能生态”, and aggressive investment-return language.

- [ ] **Step 5: Rewrite the Japanese hero and primary CTAs**

Use:

```text
Eyebrow: 日本に特化したクロスボーダー投資・M&A
Headline: 日本市場への投資・M&A・事業機会にアクセス
Support: Vantoraは、海外投資家・企業に対し、日本での投資機会の探索、M&A、市場参入、現地パートナー開拓、実行支援を提供します。
Primary CTA: 日本の投資・M&A機会を見る
Secondary CTA: 個別相談を予約する
```

- [ ] **Step 6: Rewrite Japanese section language around trust and execution**

Required concepts:

```text
投資家・ファンド・ファミリーオフィス
日本進出を検討する海外企業
日本企業・プロジェクトオーナー
日本で実現できること
投資機会へのアクセス
M&A・戦略買収
市場参入・パートナーシップ
資本・戦略パートナーとのマッチング
日本での事業・投資戦略を相談する
```

- [ ] **Step 7: Run all frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: multilingual V2 test passes and document language switching remains intact.

- [ ] **Step 8: Commit the multilingual rewrite**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: rewrite Vantora Chinese and Japanese conversion copy"
```

---

### Task 5: Redesign Selected Opportunities as editorial evidence of access

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: `#opportunities` anchor and language dictionaries.
- Produces: four opportunity themes presented as curated editorial access rather than a public listing marketplace.

- [ ] **Step 1: Add opportunity framing and truth-safety tests**

Add:

```js
test("selected opportunities are curated themes rather than marketplace listings", () => {
  for (const phrase of [
    "LNG & Energy Logistics",
    "Japan BESS & Grid Infrastructure",
    "AI Data Centers & Digital Infrastructure",
    "Japanese Companies & Cross-Border M&A"
  ]) {
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /selected themes|selected opportunities/i);
  assert.match(html, /Request Details|Discuss This Sector|View Opportunity Theme/);
  for (const forbidden of [
    /guaranteed return/i,
    /exclusive opportunity/i,
    /invest now/i,
    /174K LNG Carriers/,
    /\$847M AUM/,
    /700k\+/
  ]) {
    assert.doesNotMatch(html, forbidden);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL if V1 grid wording or CTA language remains.

- [ ] **Step 3: Rebuild the opportunity layout as fewer, larger editorial modules**

Use a two-column desktop composition, one column on mobile. Each opportunity module should contain:

```html
<article class="opportunity-feature">
  <figure class="opportunity-media">...</figure>
  <div class="opportunity-body">
    <p class="opportunity-kicker">Selected Theme</p>
    <h3>...</h3>
    <p>...</p>
    <a href="#contact">Request Details</a>
  </div>
</article>
```

Do not include public price, return, ticket-size, availability-count, or confidential counterparty fields.

- [ ] **Step 4: Add a short framing statement above the opportunity set**

Use English meaning equivalent to:

```text
Selected themes and opportunities sourced through Vantora's advisory network and local market activity. Availability and details are discussed privately and are subject to verification and suitability.
```

Write equivalent native Chinese and Japanese in the language dictionary.

- [ ] **Step 5: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: opportunity framing and truth-safety tests pass.

- [ ] **Step 6: Commit the opportunity redesign**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: turn selected opportunities into curated editorial access"
```

---

### Task 6: Replace the image system with Japan-wide premium editorial imagery

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: hero and opportunity media slots from Tasks 2 and 5.
- Produces: a Japan-focused editorial image hierarchy with clear licensing/source attribution.

- [ ] **Step 1: Replace the current Tokyo-specific image test with a Japan-scope image test**

Remove the hard requirement that `Marunouchi.jpg` must be the hero image. Add:

```js
test("image strategy supports Japan-wide positioning and sector-specific opportunity imagery", () => {
  assert.doesNotMatch(html, /assets\/photos\/grid-substation\.jpg/);
  assert.match(html, /LNG_Carrier\.jpg|lng/i);
  assert.match(html, /BESS_%28battery_energy_storage_system%29\.svg|battery|storage/i);
  assert.match(html, /TSUBAME_3\.0_PA075096\.jpg|data.center/i);
  assert.match(html, /Media credits|Image credits|Photo credits/i);
});
```

- [ ] **Step 2: Run the test before changing image references**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: FAIL if attribution label or new strategy requirements are not yet present.

- [ ] **Step 3: Choose a hero visual that communicates Japan-wide business access**

Implementation rule:

- The hero may use Tokyo business imagery as one symbol of Japan, but the surrounding copy must say Japan, not Tokyo.
- Prefer an image with national/international business context rather than a landmark-only skyline.
- If no better rights-safe asset is available immediately, retain a high-quality existing Commons city/business image temporarily but remove Tokyo-specific framing from text and alt text.

Hero alt text should be generic and accurate, for example:

```html
alt="Japan business and investment environment"
```

Do not label a generic image as a specific project or counterparty.

- [ ] **Step 4: Keep sector imagery semantically aligned**

Use one image per opportunity theme:

```text
LNG → vessel / terminal / port logistics
BESS → battery storage / grid infrastructure
AI Data Center → real computing / data-center infrastructure
M&A → Japanese corporate / industrial / executive business environment
```

- [ ] **Step 5: Preserve or improve public media attribution**

Add a concise footer-level `Media credits` line with source/creator/license names for every external image actually used. Do not claim ownership.

- [ ] **Step 6: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: image strategy test passes.

- [ ] **Step 7: Commit the image-system correction**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: align Vantora imagery with Japan-wide positioning"
```

---

### Task 7: Refine visual hierarchy and mobile conversion behavior

**Files:**
- Modify: `index.html`
- Modify: `tests/frontend/ai-sales-integration.test.mjs`

**Interfaces:**
- Consumes: final content hierarchy and image layout.
- Produces: restrained institutional-editorial CSS with clear mobile CTA flow.

- [ ] **Step 1: Update the mobile visual contract test before CSS changes**

Replace the V1 exact hero-size requirement with V2 behavior assertions:

```js
test("V2 mobile hierarchy keeps hero and conversion actions compact", () => {
  assert.match(html, /@media\(max-width:760px\)/);
  assert.match(html, /\.hero-actions/);
  assert.match(html, /flex-direction:column/);
  assert.match(html, /html\[lang="zh"\].*hero|html\[lang="ja"\].*hero/s);
  assert.match(html, /opportunity-feature/);
});
```

Keep the existing AI-widget mobile safety test unchanged.

- [ ] **Step 2: Run tests and confirm the new V2 mobile test fails if needed**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

- [ ] **Step 3: Reduce repetitive card-box styling**

In the main page CSS:

- use larger image-led editorial blocks for Opportunities;
- keep Who We Help to three restrained blocks;
- use text-led pillars for What We Unlock;
- remove unnecessary borders/backgrounds from every section;
- preserve deep navy, warm ivory, and restrained gold;
- increase whitespace between major sections.

Do not change `assets/ai-sales.css` unless there is a real overlap.

- [ ] **Step 4: Make hero CTA behavior explicit on mobile**

At `max-width:760px`:

```css
.hero-actions{
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:.7rem;
}
.hero-actions .button{
  width:100%;
  min-height:48px;
}
```

Hero headline target:

```css
.hero h1{font-size:clamp(2.25rem,10vw,2.8rem)}
html[lang="zh"] .hero h1,
html[lang="ja"] .hero h1{font-size:clamp(2.1rem,9.2vw,2.6rem)}
```

Body should remain approximately `15px` on small mobile screens.

- [ ] **Step 5: Make opportunities stack as image-led editorial stories**

At mobile width:

```css
.opportunities-grid{grid-template-columns:1fr}
.opportunity-feature{grid-template-columns:1fr}
.opportunity-media{min-height:220px}
```

- [ ] **Step 6: Run frontend tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: V2 mobile hierarchy test and existing AI mobile safety test both pass.

- [ ] **Step 7: Commit the responsive visual hierarchy**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "feat: refine Vantora V2 editorial hierarchy and mobile conversion"
```

---

### Task 8: Preserve AI separation, direct contact, and truthfulness safeguards

**Files:**
- Modify: `tests/frontend/ai-sales-integration.test.mjs`
- Modify: `index.html` only if the tests expose a regression

**Interfaces:**
- Consumes: existing AI Worker hook, direct contact details, and V2 homepage content.
- Produces: regression safeguards ensuring redesign work does not make AI mandatory or introduce unsupported claims.

- [ ] **Step 1: Add a direct-contact independence test**

```js
test("direct contact remains available without using the AI assistant", () => {
  assert.match(html, /info@u-pex\.com/);
  assert.match(html, /\+81 3-6717-4565/);
  assert.match(html, /Book a Private Discussion/);
  assert.match(html, /href="mailto:info@u-pex\.com"/);
});
```

- [ ] **Step 2: Expand unsupported-claim guards**

Add:

```js
test("public homepage avoids unsupported financial and regulatory claims", () => {
  for (const forbidden of [
    /guaranteed/i,
    /AUM/i,
    /account holders/i,
    /SOC ?2/i,
    /licensed investment adviser/i,
    /certified return/i,
    /exclusive opportunity/i
  ]) {
    assert.doesNotMatch(html, forbidden);
  }
});
```

- [ ] **Step 3: Run tests**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: PASS without editing AI assets. If direct email is not currently an anchor, minimally change `index.html` to use `mailto:info@u-pex.com`.

- [ ] **Step 4: Confirm existing AI integration safety tests still pass**

The following existing behaviors must remain unchanged:

```text
production Worker meta hook exists
assets/ai-sales.css loads
assets/ai-sales.js loads as module
AI state uses sessionStorage
frontend cannot choose email recipient
visitor/model content uses textContent, not innerHTML
widget has mobile and reduced-motion safeguards
```

- [ ] **Step 5: Commit regression safeguards**

```bash
git add index.html tests/frontend/ai-sales-integration.test.mjs
git commit -m "test: preserve direct contact and public claim safeguards"
```

---

### Task 9: Run full verification and refresh the isolated preview

**Files:**
- Modify: `docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md`
- Verify: `.github/workflows/ai-sales-ci.yml`
- Verify: `.github/workflows/preview-pages.yml`

**Interfaces:**
- Consumes: completed V2 branch.
- Produces: fresh CI evidence, a fresh preview URL, and a written verification record.

- [ ] **Step 1: Run the frontend suite locally/in CI context**

```bash
node --test tests/frontend/ai-sales-integration.test.mjs
```

Expected: all frontend tests PASS.

- [ ] **Step 2: Run Worker tests without changing Worker behavior**

```bash
cd worker
npm test
```

Expected: PASS.

- [ ] **Step 3: Run Wrangler dry-run**

```bash
cd worker
npx wrangler deploy --dry-run --outdir dist
```

Expected: successful dry-run output with no deployment.

- [ ] **Step 4: Confirm CI is green at the final branch HEAD**

Verify the `AI Sales CI` workflow on `ai-sales-redesign` reports success for:

```text
frontend-tests
worker-tests
type generation
Worker tests
Wrangler dry run
```

Do not reuse a pre-V2 successful run as final evidence.

- [ ] **Step 5: Confirm the isolated preview deploy completes**

The `Deploy Vantora Preview` workflow must publish `index.html` + `assets/**` to the existing Cloudflare Pages preview project and verify the V2 headline is present.

Expected homepage marker:

```text
Access Japan Through Trusted Local Execution
```

- [ ] **Step 6: Review the preview manually on desktop and mobile**

Check these exact items:

```text
English default copy reads commercially, not like a brochure
Chinese reads naturally and is not literal English
Japanese reads naturally and is not literal English
Hero says Japan, not Tokyo as scope
Hero image does not imply a single project or Tokyo-only scope
Primary CTA goes to Selected Opportunities
Secondary CTA goes to Private Discussion
Opportunities feel curated/editorial, not like a public marketplace
Contact works without AI
No unsupported numerical claims appear
Mobile hero title does not dominate the first screen
Mobile CTAs stack and remain at least 48px high
```

- [ ] **Step 7: Update the verification note with fresh V2 evidence**

Add a V2 section to `docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md` recording:

```text
final branch commit SHA
frontend test result
Worker test result
Wrangler dry-run result
CI workflow run ID/status
preview workflow run ID/status
preview URL
manual desktop/mobile review result
known AI limitation: production chat remains separately dependent on OpenAI quota and email verification
release status: not merged to top
```

- [ ] **Step 8: Commit verification documentation**

```bash
git add docs/superpowers/verification/2026-08-16-vantora-public-site-redesign-verification.md
git commit -m "docs: verify Vantora public site redesign v2"
```

---

### Task 10: Prepare the V2 PR for user review without merging

**Files:**
- Modify PR #2 body only; no production code changes.

**Interfaces:**
- Consumes: final verified V2 branch and preview URL.
- Produces: an accurate review package for the user.

- [ ] **Step 1: Update PR #2 summary to describe V2 rather than V1**

PR body should state:

```text
Japan-focused A+C positioning
new seven-stage homepage conversion journey
new EN/ZH/JA conversion copy
Japan-wide editorial image strategy
curated opportunity presentation
mobile redesign
truthfulness guards
direct contact preserved
AI kept secondary
```

- [ ] **Step 2: Add fresh test and preview evidence to the PR body**

Include:

```text
frontend test result
Worker test result
Wrangler dry-run result
fresh preview URL
explicit statement that top is unchanged
```

- [ ] **Step 3: Keep the PR as Draft until the user explicitly approves the V2 preview**

Do not mark ready for review, auto-merge, or merge to `top` without explicit instruction.

- [ ] **Step 4: Final user handoff**

Provide the preview URL first and ask the user to review:

```text
1. Overall premium feel
2. Japan positioning
3. Chinese language
4. Japanese language
5. Opportunity attraction / conversion
6. Mobile first screen
```

Only after approval should the integration/merge workflow begin.
