# Vantora Japan Seller-Sourcing Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Japanese public site clearly invite Japanese companies, shareholders, asset owners, project sponsors and advisers to bring M&A, capital, partnership and real-asset opportunities to Vantora for cross-border discussion with overseas funds, family offices, listed companies and strategic buyers.

**Architecture:** Keep the current static trilingual site architecture. Implement the change as Japanese-only content and conversion-hierarchy updates in `site/content.mjs` and targeted Japanese-only template hooks in `site/templates.mjs`; preserve English, Traditional Chinese, routing, Registry projection, AI Concierge and Worker behavior. Add explicit tests that lock the Japanese seller/sponsor message and prohibit unsupported investor-network claims.

**Tech Stack:** Node.js 22; static HTML generator; vanilla JavaScript/CSS; existing frontend Node test suite; existing Cloudflare Pages preview workflow.

## Global Constraints

- Implement on `trilingual-public-site`; do not merge to `top`.
- Japanese-only content change in V1; English and Traditional Chinese remain unchanged.
- Vantora remains M&A-led and Vantora-first; UPEX remains secondary Japan-side operating foundation.
- Japanese visitors must understand that Vantora accepts Japanese M&A, investment, partnership and project opportunities for discussion.
- Public wording may refer to overseas investment funds, family offices, listed companies, operating companies and strategic investors as relevant counterparty categories.
- Do not imply contractual access, guaranteed introductions, exclusivity, quantified investor counts, AUM, transaction volume or named counterparties without approved evidence.
- Prefer `案件に応じて`, `候補先との協議を支援`, `案件整理`, `守秘`, `条件協議`, `実行支援`.
- Avoid `独自のグローバルネットワーク`, `多数の契約ファンド`, `世界中のファミリーオフィスと直接提携`, `必ず海外買い手を紹介できる` and equivalent unsupported claims.
- Do not describe Vantora as a licensed securities placement agent, investment manager, real-estate broker or other regulated intermediary unless separately verified.
- Preserve `/en/`, `/zh/`, `/ja/`, browser-language routing, persisted language choice, canonical/hreflang SEO, Registry sanitizer, hidden-price behavior, non-live preview labels, AI Concierge, direct email and phone.
- Deploy only to the isolated Cloudflare Pages preview. Production stays unchanged until explicit approval.

---

### Task 1: Add failing Japanese seller-sourcing content contracts

**Files:**
- Modify: `tests/frontend/site-content.test.mjs`
- Modify: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- Consumes generated Japanese HTML and exported Japanese content structures.
- Produces the content contract all later tasks must satisfy.

- [ ] **Step 1: Add a failing homepage content test.**

Require `/ja/` output to include all of:

```text
日本企業・案件オーナーの皆様へ
海外の買い手・投資家との取引をご検討ですか
案件について相談する
海外投資家との取引について相談する
```

- [ ] **Step 2: Add a failing overseas-counterparty wording test.**

Require Japanese output to mention:

```text
海外の投資ファンド
ファミリーオフィス
上場企業を含む事業会社
戦略投資家
```

and to include the qualifying phrase `案件の内容` or `案件に応じて`.

- [ ] **Step 3: Add prohibited-claim assertions.**

Assert generated Japanese pages do not contain:

```text
独自のグローバルネットワーク
多数の契約ファンド
世界中のファミリーオフィスと直接提携
必ず海外買い手を紹介できる
AUM
```

- [ ] **Step 4: Add failing Japanese contact-path assertions.**

Require exactly these four Japanese conversion labels:

```text
会社・事業の譲渡について相談する
海外からの資本受入れを相談する
海外企業との提携先を探す
投資・事業案件を持ち込む
```

- [ ] **Step 5: Run targeted tests and verify RED.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-content.test.mjs tests/frontend/site-build.test.mjs
```

Expected: new Japanese seller/sponsor assertions fail.

- [ ] **Step 6: Commit the red tests.**

```bash
git add tests/frontend/site-content.test.mjs tests/frontend/site-build.test.mjs
git commit -m "test: define Japanese seller sourcing contract"
```

---

### Task 2: Add Japanese seller/sponsor and overseas-counterparty content model

**Files:**
- Modify: `site/content.mjs`
- Test: `tests/frontend/site-content.test.mjs`

**Interfaces:**
- Adds Japanese-only structured content under existing `HOME.ja`, `CONTACT_PATHS.ja`, and relevant Japanese page content objects.
- Templates consume content objects; no Japanese business copy should be embedded directly into CSS or unrelated JavaScript.

- [ ] **Step 1: Update `HOME.ja` with the seller/sponsor section.**

Add a Japanese-only object with this exact semantic content:

```js
sellerSourcing: {
  kicker: "日本企業・案件オーナーの皆様へ",
  title: "海外の買い手・投資家との取引をご検討ですか。",
  body: "会社・事業の譲渡、資本受入れ、海外企業との事業提携、プロジェクト・資産の売却など、クロスボーダー案件についてご相談ください。",
  execution: "Vantoraは、日本側で案件内容を整理し、案件に応じて海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との初期対話、NDA、情報開示、条件協議、デューデリジェンス、取引実行まで支援します。",
  primaryCta: "案件について相談する",
  secondaryCta: "海外投資家との取引について相談する"
}
```

- [ ] **Step 2: Add the Japanese overseas-counterparty trust block.**

Use:

```js
overseasCounterparties: {
  kicker: "Cross-Border Counterparties",
  title: "海外投資家・事業会社との接点",
  body: "案件の内容・規模・業種・取引目的に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との協議を支援します。単なる案件紹介ではなく、日本側で案件内容を整理し、相手候補との初期対話から取引条件の調整・実行まで一貫して対応します。"
}
```

- [ ] **Step 3: Replace the four Japanese `CONTACT_PATHS` titles and descriptions.**

Use the exact four titles from Task 1. Descriptions should cover:

```text
会社売却・事業承継・カーブアウト・株式譲渡
戦略投資・資本提携・成長資金・共同投資
JV・業務提携・販路・技術・事業パートナー
BESS・データセンター・商業/産業不動産・船舶/航空・その他実物資産
```

- [ ] **Step 4: Adjust Japanese page metadata and contact intro.**

`PAGES.ja.home`, `PAGES.ja.about`, and `PAGES.ja.contact` should mention both inbound overseas investment and Japanese-side sale/capital/partnership consultation without introducing regulated-service claims.

- [ ] **Step 5: Run content tests.**

```bash
node --test tests/frontend/site-content.test.mjs
```

Expected: content-object assertions pass; homepage HTML assertions may remain red until Task 3.

- [ ] **Step 6: Commit.**

```bash
git add site/content.mjs tests/frontend/site-content.test.mjs
git commit -m "feat: add Japanese seller sourcing content"
```

---

### Task 3: Render the Japanese seller/sponsor section and counterparty trust block

**Files:**
- Modify: `site/templates.mjs`
- Modify: `assets/site.css`
- Test: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- `renderHome("ja")` emits Japanese-only seller-sourcing and overseas-counterparty sections.
- `renderHome("en")` and `renderHome("zh")` remain byte-semantically equivalent in structure except for unrelated generated timestamp-free formatting.

- [ ] **Step 1: Add a Japanese-only seller-sourcing renderer.**

Create a focused helper such as:

```js
function sellerSourcingHome(lang) {
  if (lang !== "ja") return "";
  const content = HOME.ja.sellerSourcing;
  return `...`;
}
```

Required structural classes:

```text
seller-sourcing
seller-sourcing__copy
seller-sourcing__execution
seller-sourcing__actions
```

- [ ] **Step 2: Add a Japanese-only overseas-counterparty renderer.**

Create:

```js
function overseasCounterpartiesHome(lang) {
  if (lang !== "ja") return "";
  const content = HOME.ja.overseasCounterparties;
  return `...`;
}
```

Use a restrained trust-band or editorial row, not investor-logo tiles or numeric network claims.

- [ ] **Step 3: Insert the Japanese seller-sourcing section early enough in the homepage journey.**

Recommended Japanese order:

```text
Hero
Seller/Sponsor Invitation
Capabilities
Experience
Selected Opportunities
Overseas Counterparty Trust Block
How We Execute
Why Vantora
Private Discussion
```

English and Traditional Chinese keep their existing order.

- [ ] **Step 4: Style the two Japanese-only modules.**

Use the existing navy/ivory/gold editorial system. The seller invitation should feel like a primary conversion surface, with one gold CTA and one restrained secondary action. The counterparty block should remain text-led and discreet.

- [ ] **Step 5: Add mobile layout rules.**

At <=760px, stack the seller copy/actions and keep both CTAs >=44px high. Avoid hiding the overseas-counterparty explanation on mobile.

- [ ] **Step 6: Run targeted build tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-build.test.mjs tests/frontend/site-content.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit.**

```bash
git add site/templates.mjs assets/site.css site/content.mjs tests/frontend
git commit -m "feat: add Japanese seller and sponsor conversion path"
```

---

### Task 4: Reframe Japanese About and Contact pages for opportunity submission

**Files:**
- Modify: `site/templates.mjs`
- Modify: `site/content.mjs`
- Modify: `assets/site.css` only if shared layout hooks require it
- Test: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- Existing form/mail-draft behavior and query parameter selection remain unchanged.
- Only Japanese labels, section introductions and trust framing change.

- [ ] **Step 1: Update Japanese About framing.**

Add a Japanese paragraph that explains Vantora's role as the Japan-side organizer of cross-border discussions, covering seller/sponsor preparation, initial counterparty dialogue, confidentiality, conditions, diligence coordination and execution support.

- [ ] **Step 2: Update Japanese Contact hero.**

Use a clear invitation equivalent to:

```text
会社・事業・資産・プロジェクトについてご相談ください。
```

and explain that Japanese owners/advisers can bring opportunities for confidential initial review.

- [ ] **Step 3: Keep the four pathways as the first decision point.**

Do not add a fifth generic path. Preserve existing query-string keys where possible so contact behavior does not regress; map new Japanese display labels to existing semantic keys.

- [ ] **Step 4: Add a confidentiality note in Japanese.**

Use cautious wording such as:

```text
初期相談では、案件名や相手先を特定できる情報を最初から開示いただく必要はありません。必要な範囲から確認し、守秘に配慮して協議を進めます。
```

- [ ] **Step 5: Run contact and build tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-build.test.mjs tests/frontend/contact.test.mjs
```

If the repository uses a differently named contact test, run the existing file that covers contact path selection and mail-draft behavior.

- [ ] **Step 6: Commit.**

```bash
git add site/content.mjs site/templates.mjs assets/site.css tests/frontend
git commit -m "feat: reframe Japanese contact for opportunity sourcing"
```

---

### Task 5: Full safety, regression and preview verification

**Files:**
- Modify: `docs/superpowers/verification/2026-08-17-vantora-trilingual-public-site-verification.md`
- No production files unless a regression is discovered.

**Interfaces:**
- Final HEAD must pass frontend and Worker CI and isolated Pages preview.

- [ ] **Step 1: Run full frontend suite.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 2: Audit Japanese generated claims.**

Run checks equivalent to:

```bash
grep -R -n -E "独自のグローバルネットワーク|多数の契約ファンド|世界中のファミリーオフィスと直接提携|必ず海外買い手を紹介できる|AUM" ja
```

Expected: no matches.

- [ ] **Step 3: Confirm English and Traditional Chinese are unaffected.**

Use generated-page tests and a branch diff review to verify no unintended copy change in `/en/` or `/zh/`.

- [ ] **Step 4: Run Worker regression.**

```bash
cd worker
npm install
npm run types
npx tsc --noEmit
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: all pass; dry-run only.

- [ ] **Step 5: Require green `AI Sales CI` on final HEAD.**

Verify frontend build/tests/audit and Worker typecheck/tests/dry-run all succeed.

- [ ] **Step 6: Require green `Deploy Vantora Preview` on final HEAD.**

Review:

```text
https://trilingual-public-site.vantora-site-preview.pages.dev/ja/
https://trilingual-public-site.vantora-site-preview.pages.dev/ja/about/
https://trilingual-public-site.vantora-site-preview.pages.dev/ja/contact/
```

- [ ] **Step 7: Update verification evidence.**

Record final SHA, CI run, preview run, Japanese seller/sponsor scope, evidence-boundary wording and production status `not merged`.

- [ ] **Step 8: Stop at user review gate.**

Ask the user to judge whether a Japanese company owner or adviser can immediately understand:

```text
案件をVantoraに持ち込める
海外投資家・ファンド・ファミリーオフィス・上場企業等との協議支援が可能
M&A・資本受入れ・提携・実物資産案件が対象
Vantoraが日本側で案件整理から実行まで支援する
```

Do not merge to `top` without explicit approval.

---

## Plan Self-Review

- [x] Japanese seller/sponsor conversion goal is explicit.
- [x] Overseas funds, family offices, listed companies and strategic investors are presented as counterparty categories, not guaranteed network assets.
- [x] Unsupported network, exclusivity, AUM and guaranteed-introduction claims are explicitly prohibited and tested.
- [x] Four Japanese Private Discussion pathways are preserved with seller/sponsor language.
- [x] English and Traditional Chinese are explicitly out of scope.
- [x] Existing Registry, AI, SEO, contact behavior and Worker interfaces remain protected.
- [x] Full frontend, Worker, public-claim audit and isolated preview verification are required.
- [x] Production remains unchanged until explicit user approval.
