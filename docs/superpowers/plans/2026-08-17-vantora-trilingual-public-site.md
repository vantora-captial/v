# Vantora Trilingual Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-page, client-side-translated Vantora V2 site with a review-ready, standalone English / Traditional Chinese / Japanese boutique advisory website, preserving the existing AI concierge as a secondary layer and consuming only sanitized Project Registry opportunity data when a public Registry endpoint is explicitly configured.

**Architecture:** Keep the site static and framework-free. Add a small Node-based static-site generator using only built-in modules: localized source content lives in `site/content.mjs`, HTML templates in `site/templates.mjs`, and `scripts/build-site.mjs` emits committed static pages under `en/`, `zh/`, and `ja/`. Shared CSS/JS lives under `assets/`. Root `index.html` becomes a language router only. Public opportunities are rendered by a narrow browser module that consumes only the sanitized `/v1/public/projects` contract; when no Registry API is configured or available, the site renders a truthful private-discussion fallback rather than embedded live inventory. Preview-only sample opportunities are generated from a clearly labelled fixture and never presented as live mandates.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript; Node.js 22 built-in test runner and filesystem APIs; existing Cloudflare Pages preview workflow; existing Cloudflare Worker AI concierge; optional sanitized Registry Public API; GitHub Actions.

## Global Constraints

- Work on a new branch `trilingual-public-site` forked from the approved `ai-sales-redesign` spec commit. Do not update `top`.
- Keep existing PR #2 as Draft and do not create a duplicate PR during implementation.
- Vantora is the primary public brand; UPEX is secondary Japan-side operating foundation.
- Primary positioning is `Cross-Border M&A & Strategic Investment in Japan`; M&A must be visually and narratively strongest.
- Supported public languages are English (`en`), Traditional Chinese (`zh`), and Japanese (`ja`). Do not ship Simplified Chinese copy as the new `/zh/` experience.
- Root `/` is routing-only. Standalone public content lives under `/en/`, `/zh/`, `/ja/`.
- First-visit browser routing: Japanese → `ja`; explicitly Traditional Chinese preferences (`zh-TW`, `zh-HK`, `zh-MO`, or `Hant`) → `zh`; otherwise / ambiguous → `en`.
- Manual language choice persists under `localStorage` key `vantora-language` and is used on later visits.
- The public website must function if the Registry API is absent or unavailable.
- The public website must never receive or render raw internal Registry objects.
- Public opportunity rendering is whitelist-only. Unknown fields are ignored by design.
- Do not fabricate live opportunities for production. Preview samples must be clearly labelled `Presentation sample — not a live mandate` or natural localized equivalent.
- Preserve direct email and telephone contact independently of AI.
- Preserve the existing AI concierge assets and Worker hook unless a test proves an integration change is necessary.
- Do not claim guaranteed returns, guaranteed completion, AUM, transaction volume, exclusivity, unverified licenses, live counterparties, exact confidential locations, or unsupported deal facts.
- Avoid default public use of `broker`, `brokerage`, `仲介`, `investment management`, `securities placement`, or `capital raising agent`.
- No production release or merge to `top` without explicit user approval of the rendered preview.

---

## File Structure

### New source / build files

- Create `site/content.mjs` — localized EN / Traditional Chinese / JA copy, navigation, capabilities, experience, process, contact pathways, SEO metadata and presentation-only opportunity fixture.
- Create `site/templates.mjs` — pure HTML render functions for shared shell, header/footer, home, capabilities, experience, opportunities, opportunity detail, about and contact pages.
- Create `scripts/build-site.mjs` — emits root router plus all localized static pages and validates no required page is missing.
- Create `assets/site.css` — shared institutional/editorial website CSS and responsive behavior.
- Create `assets/site-language.mjs` — pure language normalization, stored preference and equivalent-route helpers.
- Create `assets/site.js` — mobile menu, manual language persistence, route-equivalent language links and small progressive enhancements.
- Create `assets/opportunities.mjs` — sanitized Registry fetch, whitelist projection, filtering, list/detail rendering and safe fallback states.

### Generated public pages

- Replace `index.html` — root routing-only document.
- Create `en/index.html`, `zh/index.html`, `ja/index.html`.
- Create `en/capabilities/index.html`, `zh/capabilities/index.html`, `ja/capabilities/index.html`.
- Create `en/experience/index.html`, `zh/experience/index.html`, `ja/experience/index.html`.
- Create `en/opportunities/index.html`, `zh/opportunities/index.html`, `ja/opportunities/index.html`.
- Create `en/opportunities/detail/index.html`, `zh/opportunities/detail/index.html`, `ja/opportunities/detail/index.html`.
- Create `en/about/index.html`, `zh/about/index.html`, `ja/about/index.html`.
- Create `en/contact/index.html`, `zh/contact/index.html`, `ja/contact/index.html`.

`/LANG/opportunities/detail/?id=<public-project-id>` is the V1 dynamic detail route. The design spec's slug route remains the preferred future route once stable localized public slugs exist in Registry; do not invent public slugs in the frontend.

### Tests and workflows

- Create `tests/frontend/site-language.test.mjs` — routing and language preference contract.
- Create `tests/frontend/site-content.test.mjs` — localized content, section order, M&A priority, safety wording and Traditional Chinese contract.
- Create `tests/frontend/site-build.test.mjs` — generator output, SEO, canonical / hreflang, generated-route and asset contract.
- Create `tests/frontend/opportunities.test.mjs` — whitelist projection, hidden-price behavior, private-field non-rendering, fallback and filtering.
- Modify `tests/frontend/ai-sales-integration.test.mjs` — target generated English homepage instead of the old root SPA while preserving AI safety assertions.
- Modify `.github/workflows/ai-sales-ci.yml` — build site before frontend contract tests and watch all new site/build files.
- Modify `.github/workflows/preview-pages.yml` — build and deploy root router + three language trees + shared assets; set preview mode and verify the new English hero.
- Create / update `docs/superpowers/verification/2026-08-17-vantora-trilingual-public-site-verification.md` — fresh final evidence.

### Existing files to preserve unless tests require edits

- `assets/ai-sales.css`
- `assets/ai-sales-core.mjs`
- `assets/ai-sales.js`
- `worker/**`
- `.github/workflows/pages.yml`

---

## Task 1: Create the isolated implementation branch and lock the language-routing contract

**Files:**
- Create: `assets/site-language.mjs`
- Create: `tests/frontend/site-language.test.mjs`
- Later modify: `index.html`

**Interfaces:**
- `site-language.mjs` exports `SUPPORTED_LANGUAGES`, `normalizeBrowserLanguage(value)`, `chooseInitialLanguage({ stored, languages })`, `languageHome(lang)`, and `equivalentLanguagePath(pathname, nextLang)`.
- Root router and manual language switch consume these exact functions / semantics.

- [ ] **Step 1: Create branch `trilingual-public-site` from `ai-sales-redesign`.**

Expected base commit is the approved spec head `04b5f2e2338108529b8fefd9a5e7a9be8bc6f934` or its fast-forward descendant containing only planning documentation.

- [ ] **Step 2: Write routing tests before implementation.**

`tests/frontend/site-language.test.mjs` must include:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseInitialLanguage,
  equivalentLanguagePath,
  normalizeBrowserLanguage
} from "../../assets/site-language.mjs";

test("recognizes Japanese and explicit Traditional Chinese browser preferences", () => {
  assert.equal(normalizeBrowserLanguage("ja-JP"), "ja");
  assert.equal(normalizeBrowserLanguage("zh-TW"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-Hant-HK"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-CN"), null);
  assert.equal(normalizeBrowserLanguage("zh"), null);
});

test("saved valid language wins over browser preferences", () => {
  assert.equal(chooseInitialLanguage({ stored: "zh", languages: ["ja-JP"] }), "zh");
  assert.equal(chooseInitialLanguage({ stored: "invalid", languages: ["ja-JP"] }), "ja");
  assert.equal(chooseInitialLanguage({ stored: null, languages: ["fr-FR"] }), "en");
});

test("language switch preserves the equivalent page", () => {
  assert.equal(equivalentLanguagePath("/en/capabilities/", "ja"), "/ja/capabilities/");
  assert.equal(equivalentLanguagePath("/zh/opportunities/detail/", "en"), "/en/opportunities/detail/");
});
```

- [ ] **Step 3: Run the test and confirm RED.**

```bash
node --test tests/frontend/site-language.test.mjs
```

Expected: FAIL because `assets/site-language.mjs` does not exist.

- [ ] **Step 4: Implement the minimal pure language module.**

Required normalization logic:

```js
export const SUPPORTED_LANGUAGES = Object.freeze(["en", "zh", "ja"]);

export function normalizeBrowserLanguage(value) {
  const tag = String(value || "").toLowerCase();
  if (tag === "ja" || tag.startsWith("ja-")) return "ja";
  if (tag.includes("hant") || tag === "zh-tw" || tag.startsWith("zh-tw-") || tag === "zh-hk" || tag.startsWith("zh-hk-") || tag === "zh-mo" || tag.startsWith("zh-mo-")) return "zh";
  return null;
}
```

`chooseInitialLanguage` checks a valid stored choice first, then browser language array in order, then returns `en`.

`equivalentLanguagePath` replaces a leading `/en/`, `/zh/`, or `/ja/`; unknown paths return `/${nextLang}/`.

- [ ] **Step 5: Re-run the routing test.**

```bash
node --test tests/frontend/site-language.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add assets/site-language.mjs tests/frontend/site-language.test.mjs
git commit -m "test: lock trilingual routing contract"
```

---

## Task 2: Create one structured source of truth for native EN / Traditional Chinese / Japanese content

**Files:**
- Create: `site/content.mjs`
- Create: `tests/frontend/site-content.test.mjs`

**Interfaces:**
- Exports `LANGUAGES`, `SITE`, `NAV`, `PAGES`, `HOME`, `CAPABILITIES`, `EXPERIENCE`, `CONTACT_PATHS`, `PUBLIC_CATEGORY_LABELS`, and `PRESENTATION_OPPORTUNITIES`.
- Templates must consume content through these structures rather than duplicate prose inside HTML render functions.

- [ ] **Step 1: Add failing content-contract tests.**

Tests must verify:

```js
for (const lang of ["en", "zh", "ja"]) {
  assert.ok(HOME[lang].hero.title);
  assert.equal(CAPABILITIES[lang].items[0].key, "ma");
  assert.equal(CONTACT_PATHS[lang].length, 4);
}
assert.equal(HOME.en.hero.title, "Cross-Border M&A & Strategic Investment in Japan");
assert.equal(HOME.zh.hero.title, "專注日本的跨境併購與戰略投資");
assert.equal(HOME.ja.hero.title, "日本におけるクロスボーダーM&A・戦略投資");
```

Also require Traditional Chinese characters / wording, including `併購`, `項目`, `執行`, and assert the new `zh` source does not use key Simplified-only public phrases from V2 such as `进入日本市场` or `查看日本精选机会`.

Safety assertions scan all public source strings and reject case-insensitive patterns:

```text
guaranteed return
exclusive opportunity
AUM
licensed investment adviser
brokerage
仲介
```

except where a compliance note explicitly discusses a prohibited term in code comments; public content objects themselves must not contain them.

- [ ] **Step 2: Run the content test and confirm RED.**

```bash
node --test tests/frontend/site-content.test.mjs
```

Expected: FAIL because `site/content.mjs` does not exist.

- [ ] **Step 3: Implement English source content using the approved spec.**

Home exact hero:

```js
hero: {
  eyebrow: "Japan-focused cross-border advisory",
  title: "Cross-Border M&A & Strategic Investment in Japan",
  body: "We advise international investors and companies on acquisitions, strategic investments and partnerships in Japan — from target identification and local dialogue to transaction coordination and execution.",
  primaryCta: "Discuss a Japan M&A or Investment Plan",
  secondaryCta: "Explore Our Focus Areas"
}
```

Home section sequence source keys must be:

```js
["capabilities", "experience", "opportunities", "process", "why", "contact"]
```

- [ ] **Step 4: Implement native Traditional Chinese source content.**

Hero exact approved text:

```text
專注日本的跨境併購與戰略投資
協助海外投資者與企業在日本尋找收購標的、投資機會及戰略合作方，並從前期判斷、日本側溝通到談判與交易執行，全程推進項目落地。
討論日本併購或投資計畫
了解我們的重點領域
```

Write all other `zh` content as Traditional Chinese, not automated conversion from the old Simplified dictionary.

- [ ] **Step 5: Implement native Japanese source content.**

Use exact approved hero and restrained `支援 / 案件探索 / 取引調整 / 実行` phrasing. Avoid aggressive solicitation language.

- [ ] **Step 6: Add the six capability records in this exact order for every language.**

```text
ma
energy
igital (use key: digital)
cre
special
partnerships
```

Correct key list in code:

```js
["ma", "energy", "digital", "cre", "special", "partnerships"]
```

Each record has `key`, `title`, `summary`, and `bullets`. M&A receives `primary: true`; all others `primary: false`.

- [ ] **Step 7: Add Experience records without invented outcomes.**

Primary record keys:

```text
japan-corporate-acquisition
utility-scale-bess
ai-data-center-development
cross-border-real-asset
```

Each record has `sector`, `title`, `situation`, `role`, `scope`, `status`. Status values are qualitative (`Confidential`, `Ongoing / selected engagement experience`, localized equivalent) and do not claim closure.

- [ ] **Step 8: Add four contact pathways and presentation-only samples.**

Contact keys:

```text
acquire-invest
sell-business-asset
find-partner
submit-opportunity
```

`PRESENTATION_OPPORTUNITIES` contains only fictional/generalized sample values and every record has `presentationOnly: true`. Do not use real counterparty names, exact addresses, registration numbers or unsupported values.

- [ ] **Step 9: Run content tests.**

```bash
node --test tests/frontend/site-content.test.mjs
```

Expected: PASS.

- [ ] **Step 10: Commit.**

```bash
git add site/content.mjs tests/frontend/site-content.test.mjs
git commit -m "feat: add native trilingual site content"
```

---

## Task 3: Build the static-site generator, standalone language routes, and SEO contract

**Files:**
- Create: `site/templates.mjs`
- Create: `scripts/build-site.mjs`
- Create: `tests/frontend/site-build.test.mjs`
- Replace: `index.html`
- Generate: all `en/**`, `zh/**`, `ja/**` pages listed above

**Interfaces:**
- `renderPage({ lang, pageKey, content, path, body })` owns doctype, `<html lang>`, meta, canonical, hreflang, OG, header, footer and shared assets.
- `build-site.mjs` is deterministic and may safely overwrite only generated public pages and root `index.html`.
- Build command: `node scripts/build-site.mjs`.

- [ ] **Step 1: Write build tests before generator implementation.**

Test executes the build in a temporary workspace or imports deterministic renderer functions. Required assertions after `node scripts/build-site.mjs`:

```text
index.html
en/index.html
zh/index.html
ja/index.html
en/capabilities/index.html
zh/capabilities/index.html
ja/capabilities/index.html
en/experience/index.html
zh/experience/index.html
ja/experience/index.html
en/opportunities/index.html
zh/opportunities/index.html
ja/opportunities/index.html
en/opportunities/detail/index.html
zh/opportunities/detail/index.html
ja/opportunities/detail/index.html
en/about/index.html
zh/about/index.html
ja/about/index.html
en/contact/index.html
zh/contact/index.html
ja/contact/index.html
```

For each localized page verify:

- `lang="en"`, `lang="zh-Hant"`, or `lang="ja"` as appropriate.
- one canonical link.
- three alternate hreflang links: `en`, `zh-Hant`, `ja`, plus optional `x-default` to English.
- localized title and meta description.
- Open Graph title / description.
- shared `/assets/site.css` and module `/assets/site.js`.
- existing `/assets/ai-sales.css` and `/assets/ai-sales.js` remain integrated on content pages.

- [ ] **Step 2: Confirm RED.**

```bash
node --test tests/frontend/site-build.test.mjs
```

Expected: FAIL because templates/build script and routes do not exist.

- [ ] **Step 3: Implement HTML escaping and URL helpers first.**

`site/templates.mjs` must use an escaping function for all text values:

```js
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}
```

Only trusted template fragments created by template functions may be concatenated as HTML; never interpolate future API data without escaping / DOM text rendering.

- [ ] **Step 4: Implement shared shell and navigation.**

Primary nav keys:

```text
Home
Capabilities
Experience
Opportunities
About
Private Discussion
```

Language links must use route-equivalent paths and include `data-language-choice` for persistence handling.

- [ ] **Step 5: Implement root router only.**

Root `index.html` must contain:

- `meta name="robots" content="noindex,follow"`
- visible fallback links to `/en/`, `/zh/`, `/ja/`
- module script that imports `chooseInitialLanguage` from `/assets/site-language.mjs`
- redirects with `location.replace('/' + lang + '/')`

It must not duplicate homepage marketing content.

- [ ] **Step 6: Implement deterministic generator for all page types.**

Use Node built-ins only:

```js
import { mkdir, writeFile } from "node:fs/promises";
```

Generator must log each emitted route and exit non-zero if a required content block is missing.

- [ ] **Step 7: Generate pages and run tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-build.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit source + generated routes.**

```bash
git add site scripts index.html en zh ja tests/frontend/site-build.test.mjs
git commit -m "feat: add standalone trilingual site routes"
```

---

## Task 4: Implement the shared institutional editorial visual system and accessible navigation

**Files:**
- Create: `assets/site.css`
- Create: `assets/site.js`
- Modify generated templates as required: `site/templates.mjs`
- Test: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- `site.css` owns all public-site layout and responsive styling.
- `site.js` owns only progressive behavior: mobile nav, persisted language selection, focus management and equivalent-route language navigation. It must not contain translated content.

- [ ] **Step 1: Extend build tests for accessibility / responsive hooks before styling.**

Require:

```text
skip link
header nav aria-label
mobile menu button with aria-expanded
main id="main-content"
visible language navigation
prefers-reduced-motion
focus-visible
@media(max-width:760px)
no horizontal overflow
```

- [ ] **Step 2: Run test and confirm RED on missing hooks.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-build.test.mjs
```

- [ ] **Step 3: Implement the visual tokens in `assets/site.css`.**

Foundation:

```css
:root {
  --navy:#071321;
  --navy-2:#0d2234;
  --ivory:#f3efe6;
  --paper:#faf8f2;
  --gold:#b99655;
  --ink:#132236;
  --muted:#64707a;
  --line:#dcd4c6;
  --line-dark:rgba(255,255,255,.13);
  --max:1180px;
}
```

Use editorial typography, disciplined whitespace, restrained borders, asymmetric desktop compositions where useful, and no decorative card grid for every section.

- [ ] **Step 4: Implement mobile rules.**

At `max-width:760px`:

- header approximately 66px.
- language switch remains visible.
- menu target >=44px.
- hero heading EN around `clamp(2.2rem,9vw,2.8rem)` and ZH/JA slightly smaller if required.
- hero CTA stack vertically.
- section padding approximately 68–76px.
- forms single column.
- opportunity modules stacked.
- no horizontal scrolling.

At `max-width:390px`, refine gutters and headline size without hiding content.

- [ ] **Step 5: Implement `site.js` behavior safely.**

Rules:

- no `innerHTML` with visitor/API data.
- mobile menu toggles `aria-expanded` and closes after nav selection.
- language links persist chosen language before navigation.
- pressing Escape closes open mobile nav.
- do not add another fixed bottom control that collides with the AI launcher.

- [ ] **Step 6: Rebuild and run tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-build.test.mjs tests/frontend/site-language.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit.**

```bash
git add assets/site.css assets/site.js site/templates.mjs en zh ja tests/frontend/site-build.test.mjs
git commit -m "feat: add Vantora trilingual visual system"
```

---

## Task 5: Build the approved homepage journey in all three standalone languages

**Files:**
- Modify: `site/templates.mjs`
- Modify: `site/content.mjs` only for copy corrections
- Generate: `en/index.html`, `zh/index.html`, `ja/index.html`
- Modify: `tests/frontend/site-content.test.mjs`
- Modify: `tests/frontend/site-build.test.mjs`

**Interfaces:**
- `renderHome(lang)` produces sections in exact order: Hero → Core Capabilities → Selected Experience → Selected Opportunities → How We Execute → Why Vantora → Private Discussion.

- [ ] **Step 1: Add exact section-order test.**

Parse generated homepage string positions and assert:

```js
const ids = ["home-capabilities", "home-experience", "home-opportunities", "home-process", "home-why", "home-contact"];
```

Every later ID index must be greater than previous.

- [ ] **Step 2: Add M&A visual-priority contract.**

Require first capability block to include `data-capability="ma"` and class `capability-primary`; no other capability receives that class.

- [ ] **Step 3: Confirm RED before home template changes.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-content.test.mjs tests/frontend/site-build.test.mjs
```

- [ ] **Step 4: Implement hero and capability composition.**

Hero uses approved copy exactly from `site/content.mjs`. Primary CTA goes to localized `/LANG/contact/`; secondary CTA goes to `/LANG/capabilities/`.

Capabilities shows M&A as a larger lead module and five secondary capabilities as restrained editorial rows / modules.

- [ ] **Step 5: Implement Selected Experience.**

Show 3–4 anonymized engagement cards/rows from the structured Experience source. Never display a fabricated transaction value or client logo.

- [ ] **Step 6: Implement Selected Opportunities container as an API-driven slot.**

Markup contains:

```html
<section id="home-opportunities" data-opportunity-surface="home">
  <div data-opportunities-list data-limit="4"></div>
  <div data-opportunities-fallback hidden>...</div>
</section>
```

Do not hardcode real/live opportunity claims in generated production HTML.

- [ ] **Step 7: Implement five-stage process.**

Exact keys/order:

```text
Identify
Evaluate
Engage
Structure
Execute
```

with natural localized titles and descriptions.

- [ ] **Step 8: Implement Why Vantora with exactly three reasons.**

```text
Japan-side access
Cross-border transaction perspective
Execution-led advisory
```

Then a restrained UPEX endorsement line / block.

- [ ] **Step 9: Implement four-path closing conversion section.**

Each path links to localized contact page with query parameter:

```text
?path=acquire-invest
?path=sell-business-asset
?path=find-partner
?path=submit-opportunity
```

- [ ] **Step 10: Rebuild and test.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/site-content.test.mjs tests/frontend/site-build.test.mjs
```

Expected: PASS.

- [ ] **Step 11: Commit.**

```bash
git add site/content.mjs site/templates.mjs en/index.html zh/index.html ja/index.html tests/frontend
git commit -m "feat: build trilingual M&A-led homepages"
```

---

## Task 6: Build Capabilities, Experience, About and Private Discussion pages

**Files:**
- Modify: `site/templates.mjs`
- Generate: localized `capabilities`, `experience`, `about`, `contact` pages
- Create: `assets/contact.mjs`
- Create: `tests/frontend/contact.test.mjs`

**Interfaces:**
- `renderCapabilities(lang)`, `renderExperience(lang)`, `renderAbout(lang)`, `renderContact(lang)`.
- `contact.mjs` reads `?path=` and activates exactly one of four forms; all forms submit through existing `/v1/leads` only if the payload maps safely to that narrow endpoint, otherwise use a truthful `mailto:` handoff. Do not pretend submission succeeded without backend acceptance.

- [ ] **Step 1: Add page-specific contract tests.**

Require:

Capabilities:
- six capability sections.
- M&A first and marked primary.
- CRE page/source avoids `brokerage`, `broker`, `仲介`.

Experience:
- structured labels equivalent to `Situation`, `Our Role`, `Execution Scope`, `Current Stage`.
- no unsupported deal values or client logos.

About:
- Vantora dominant.
- UPEX secondary `Japan-side Operating Foundation` concept.
- no unverified regulatory claims.

Contact:
- exactly four path selectors.
- direct `mailto:info@u-pex.com` and `tel:+81367174565` always available.

- [ ] **Step 2: Implement page templates.**

Capabilities page uses detailed bullet scopes from content source. Do not repeat six equal generic cards; use M&A lead section + editorial capability index.

Experience page renders four primary anonymized records and optional secondary areas without fake outcomes.

About page renders brand relationship and three operating principles.

- [ ] **Step 3: Write contact behavior tests first.**

Pure helpers in `assets/contact.mjs` should export:

```js
export const CONTACT_PATH_KEYS = [...];
export function normalizeContactPath(value) { ... }
export function buildMailtoDraft({ lang, path, fields }) { ... }
```

Test unknown path defaults to `acquire-invest`, values are URL-encoded, and no recipient can be supplied by visitor fields.

- [ ] **Step 4: Implement contact forms and truthful delivery behavior.**

For this public-site release, use direct email drafting as the guaranteed path unless a dedicated general-contact API exists. Existing AI `/v1/leads` contract is AI-specific and requires its own structured lead summary; do not silently repurpose it for file or external project submissions.

Each form provides a submit button that creates a localized mail draft to the fixed `info@u-pex.com` recipient and a visible privacy / confidentiality note. `Submit an Opportunity` does not upload files in this phase.

- [ ] **Step 5: Rebuild and test.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/contact.test.mjs tests/frontend/site-build.test.mjs tests/frontend/site-content.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add assets/contact.mjs site/templates.mjs en zh ja tests/frontend/contact.test.mjs
git commit -m "feat: add trilingual advisory detail pages"
```

---

## Task 7: Implement sanitized Project Registry opportunity consumption and presentation-only preview mode

**Files:**
- Create: `assets/opportunities.mjs`
- Create: `tests/frontend/opportunities.test.mjs`
- Modify: `site/templates.mjs`
- Modify: `site/content.mjs`
- Generate: localized Opportunities listing and detail pages

**Interfaces:**
- Public endpoint when configured: `${apiBase}/v1/public/projects`.
- `opportunities.mjs` exports pure helpers `projectPublicProject(value)`, `formatPublicPrice(project, lang)`, `filterProjects(projects, filter)`, and browser initializer `initOpportunities()`.
- Raw server data is projected into a new object before rendering.

- [ ] **Step 1: Write hostile-fixture tests before implementation.**

Use fixture with allowed and forbidden fields:

```js
const raw = {
  id: "VAN-MA-2026-001",
  publicTitle: "Japan corporate acquisition",
  category: "MA",
  region: "Kanto",
  transactionType: "Share Acquisition",
  price: { mode: "Hidden" },
  teaser: "Public teaser",
  highlights: ["Established operating business"],
  imageKeys: [],
  sellerOwner: "SECRET SELLER",
  internalNotes: "SECRET NOTE",
  imoNumber: "SECRET IMO",
  registration: "SECRET AIRCRAFT"
};
```

Assert projected JSON contains none of the secret values / field names.

- [ ] **Step 2: Test hidden / range / exact price behavior.**

Expected:

```text
Hidden → Price on Request / 價格洽詢 / 価格は個別相談
Range → approved min/max only
Exact → approved value only
```

No fallback to any `indicativeValue` field.

- [ ] **Step 3: Test public filters and inactive/failure behavior.**

`filterProjects` only operates on projected public records. Browser fetch failure produces a state code `unavailable`; empty list produces `empty`.

- [ ] **Step 4: Confirm RED.**

```bash
node --test tests/frontend/opportunities.test.mjs
```

- [ ] **Step 5: Implement strict public projector.**

Whitelist only:

```js
return {
  id,
  publicTitle,
  category,
  region,
  transactionType,
  price,
  teaser,
  highlights,
  imageKeys
};
```

Validate types and drop malformed records. Never spread `...raw`.

- [ ] **Step 6: Add API configuration to page shell.**

Use:

```html
<meta name="vantora-registry-api" content="">
<meta name="vantora-opportunity-mode" content="live">
```

Production/default source leaves Registry API empty until the protected Registry environment deliberately exposes the sanitized public endpoint.

When empty, render localized fallback:

```text
Selected opportunities are available through private discussion.
```

Do not treat missing API as an error banner across the whole site.

- [ ] **Step 7: Implement preview-only sample mode.**

Cloudflare preview build may set `vantora-opportunity-mode=presentation` by a build environment variable. In this mode, use `PRESENTATION_OPPORTUNITIES`, and every rendered sample must visibly display localized `Presentation sample — not a live mandate` labeling.

The source generator's normal/default mode remains `live` and never emits samples as live records.

- [ ] **Step 8: Implement list and detail rendering with DOM text APIs.**

For API / sample data, use `textContent`, `createElement`, and attribute setters. Do not concatenate fetched values into `innerHTML`.

Detail page reads `?id=` and finds only within the projected public array. Missing ID or missing project renders a localized unavailable/private-discussion state.

- [ ] **Step 9: Rebuild and run opportunity tests.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/opportunities.test.mjs tests/frontend/site-build.test.mjs
```

Expected: PASS.

- [ ] **Step 10: Commit.**

```bash
git add assets/opportunities.mjs site scripts en zh ja tests/frontend/opportunities.test.mjs
git commit -m "feat: add sanitized public opportunities surface"
```

---

## Task 8: Preserve and adapt the AI concierge integration without making it primary

**Files:**
- Modify: `tests/frontend/ai-sales-integration.test.mjs`
- Modify: `assets/ai-sales.js` only if generated-page selectors require it
- Preserve: `assets/ai-sales.css`, `assets/ai-sales-core.mjs`
- Generate: localized pages with existing AI includes

**Interfaces:**
- All content pages include the existing `vantora-ai-api` meta and AI assets.
- AI language detection must work from `<html lang="en|zh-Hant|ja">` or a new `data-site-language` value.

- [ ] **Step 1: Rewrite the integration fixture target.**

Instead of reading root `index.html`, test generated `en/index.html`, `zh/index.html`, and `ja/index.html` after build.

Require each content page includes:

```html
<meta name="vantora-ai-api" content="https://vantora-ai-sales.vantora-captial-tech.workers.dev">
<link rel="stylesheet" href="/assets/ai-sales.css">
<script type="module" src="/assets/ai-sales.js"></script>
```

Root router must not need AI.

- [ ] **Step 2: Add test for Traditional Chinese language mapping.**

Existing AI helper recognizes values beginning `zh`; `zh-Hant` must map to AI language `zh`. Japanese and English remain unchanged.

- [ ] **Step 3: Run AI frontend tests before edits.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/ai-sales-core.test.mjs tests/frontend/ai-sales-integration.test.mjs
```

If PASS, do not edit AI runtime files. If FAIL only because the old `#lang` selector is absent, update `currentSiteLanguage()` to prefer `document.documentElement.lang` and keep all safety behavior unchanged.

- [ ] **Step 4: Preserve AI security assertions.**

Must remain true:

- session state uses `sessionStorage`.
- no OpenAI/Resend secret identifiers in public source.
- browser cannot set recipient.
- visitor/model content uses `textContent`, not `innerHTML`.
- AI stays secondary to direct Contact / Private Discussion actions.

- [ ] **Step 5: Run all related tests.**

```bash
node --test tests/frontend/ai-sales-core.test.mjs tests/frontend/ai-sales-integration.test.mjs
cd worker
npm install
npm run types
npx tsc --noEmit
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: PASS; no production Worker deployment.

- [ ] **Step 6: Commit only if changes were needed.**

```bash
git add assets/ai-sales.js tests/frontend/ai-sales-integration.test.mjs en zh ja
git commit -m "test: preserve AI concierge on trilingual pages"
```

If runtime files require no changes, commit only test/generated-page alignment.

---

## Task 9: Update CI and isolated Cloudflare Pages preview packaging

**Files:**
- Modify: `.github/workflows/ai-sales-ci.yml`
- Modify: `.github/workflows/preview-pages.yml`
- Verify: `.github/workflows/pages.yml`

**Interfaces:**
- CI builds before tests.
- Preview includes root router, `en/`, `zh/`, `ja/`, and `assets/` only; it excludes Registry internal UI, worker source, docs and private material.

- [ ] **Step 1: Extend CI path triggers.**

Include:

```text
index.html
en/**
zh/**
ja/**
site/**
scripts/**
assets/site*
assets/opportunities.mjs
assets/contact.mjs
tests/frontend/**
worker/**
docs/superpowers/**
```

- [ ] **Step 2: Add deterministic build before frontend tests.**

Frontend job sequence:

```bash
node scripts/build-site.mjs
node --test tests/frontend/*.test.mjs
```

- [ ] **Step 3: Update preview packaging.**

Use a build environment variable:

```yaml
env:
  VANTORA_OPPORTUNITY_MODE: presentation
```

Build:

```bash
VANTORA_OPPORTUNITY_MODE=presentation node scripts/build-site.mjs
rm -rf preview-dist
mkdir -p preview-dist
cp index.html preview-dist/index.html
cp -R en zh ja assets preview-dist/
```

Explicitly assert absent:

```text
preview-dist/registry
preview-dist/worker
preview-dist/docs
preview-dist/site
preview-dist/scripts
```

- [ ] **Step 4: Change live preview verification marker.**

Verify stable preview URL and check English page:

```bash
url="https://${PREVIEW_PROJECT}.pages.dev/en/"
```

Marker:

```text
Cross-Border M&amp;A &amp; Strategic Investment in Japan
```

If HTML escaping differs, use a stable text marker such as `Japan-focused cross-border advisory` plus `Private Discussion`.

- [ ] **Step 5: Verify production workflow scope remains untouched.**

Read `.github/workflows/pages.yml`; confirm `trilingual-public-site` is not a production trigger. Do not edit production release conditions as part of this implementation.

- [ ] **Step 6: Commit workflows.**

```bash
git add .github/workflows/ai-sales-ci.yml .github/workflows/preview-pages.yml
git commit -m "ci: build and preview trilingual public site"
```

---

## Task 10: Full verification, content-safety audit and preview handoff

**Files:**
- Create: `docs/superpowers/verification/2026-08-17-vantora-trilingual-public-site-verification.md`
- Verify all public/build/test/workflow files

**Interfaces:**
- Produces fresh automated evidence and one isolated review URL.
- Does not merge to `top`.

- [ ] **Step 1: Run the full static build and frontend test suite.**

```bash
node scripts/build-site.mjs
node --test tests/frontend/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 2: Run full Worker regression verification.**

```bash
cd worker
npm install
npm run types
npx tsc --noEmit
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: all pass; dry-run only.

- [ ] **Step 3: Scan public generated source for prohibited leakage.**

Run searches equivalent to:

```bash
grep -R -n -Ei "seller_owner|source_introducer|internal_notes|imo_number|serial_number|registration|OPENAI_API_KEY|RESEND_API_KEY|sk-proj-|guaranteed return|exclusive opportunity" index.html en zh ja assets --exclude='*.svg'
```

Expected: no confidential Registry field identifiers, secrets, or prohibited claims in generated public content. If a source code test fixture intentionally includes secret field names, keep it under `tests/`, never public output.

- [ ] **Step 4: Verify root / and all three language homes.**

Check root is routing-only and `/en/`, `/zh/`, `/ja/` each contain the correct hero, navigation, canonical and hreflang.

- [ ] **Step 5: Verify contact and opportunity failure states.**

- Registry API absent: page remains usable and shows private-discussion fallback.
- Presentation preview: sample items visibly labelled non-live.
- Unknown opportunity ID: no private/raw data; show unavailable state.
- Contact pathway unknown: safe default + direct contact.

- [ ] **Step 6: Require fresh green GitHub Actions on final HEAD.**

Confirm `AI Sales CI` success for:

```text
site build
all frontend tests
worker types
typecheck
worker tests
Wrangler dry run
```

Do not reuse a prior green run from the single-page site.

- [ ] **Step 7: Require fresh isolated preview deployment on final HEAD.**

`Deploy Vantora Preview` must succeed and verify `/en/`. Record stable preview URL:

```text
https://vantora-site-preview.pages.dev/en/
```

Also provide direct review links:

```text
/en/
/zh/
/ja/
/en/capabilities/
/en/opportunities/
/en/contact/
```

- [ ] **Step 8: Record manual visual-review boundary accurately.**

If the environment cannot visually inspect simulated browsers, do not claim manual visual pass. Record that automated structure/responsive contracts passed and ask the user to judge only:

```text
overall premium feel
English positioning
Traditional Chinese naturalness / line breaks
Japanese naturalness / line breaks
mobile first screen
Capabilities hierarchy
Opportunities presentation
Contact clarity
```

- [ ] **Step 9: Create the verification document with exact evidence.**

Record:

```text
final commit SHA
base branch / production branch status
frontend command + result
worker command + result
CI run ID/status
preview run ID/status
preview URL
Registry integration state (live endpoint configured or fallback only)
production status: not merged
```

- [ ] **Step 10: Commit verification.**

```bash
git add docs/superpowers/verification/2026-08-17-vantora-trilingual-public-site-verification.md
git commit -m "docs: verify Vantora trilingual public site"
```

- [ ] **Step 11: Stop at the user visual-review gate.**

Present the preview first. Do not merge `trilingual-public-site`, `ai-sales-redesign`, `registry-phase1`, or PR #2 into `top` until the user explicitly approves production integration.

---

## Plan Self-Review Checklist

Before execution begins, verify:

- [ ] Every approved Design Spec section is covered by at least one implementation task.
- [ ] No `TODO`, `TBD`, placeholder architecture choice, or invented live data remains.
- [ ] Traditional Chinese is explicit and old Simplified Chinese is not silently reused for `/zh/`.
- [ ] The dynamic opportunity-detail route deviation is explicit: V1 uses `/LANG/opportunities/detail/?id=` because Registry does not yet provide stable localized public slugs; no slug is fabricated.
- [ ] Registry API is optional/configurable because the Registry Worker is not yet provisioned as a live public environment.
- [ ] Preview samples are clearly non-live and never used as production live inventory.
- [ ] Existing AI / Worker interfaces remain compatible and are regression-tested.
- [ ] Production branch `top` remains outside implementation and preview deployment.
