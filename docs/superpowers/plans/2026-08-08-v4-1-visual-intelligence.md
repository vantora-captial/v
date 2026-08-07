# V4.1 Visual + Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing production Japan Investment Hub in place with asset-specific visual identities and a more institutional investor-intelligence experience without changing its core V4 conversion architecture.

**Architecture:** Keep the current static single-page `index.html`, multilingual dictionary, and GitHub Pages deployment model. Add CSS-driven asset visual treatments and structured briefing cards so the upgrade does not depend on unverified project photography or a new backend.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GitHub Pages.

## Global Constraints
- Update the existing website; do not create a second site.
- Preserve Investor Mandate and Submit Opportunity as the two core conversion paths.
- Preserve LNG, BESS, AI Data Center and M&A as the four primary themes.
- Preserve current supported project figures and disclaimers.
- Preserve UPEX transaction cases, Tokyo contact details and BATONZ external profile.
- Do not imply illustrative visuals are actual project photography.
- Do not claim daily automated publishing is live.
- Preserve English, Chinese and Japanese language switching.
- Preserve Manrope + Noto Sans SC / Noto Sans JP typography.

---

### Task 1: Create asset-specific visual system

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `.hero`, `.op`, `.visual`, `.ai`, `.status` classes.
- Produces: `.asset-visual`, `.visual-lng`, `.visual-bess`, `.visual-ai`, `.visual-ma`, `.market-strip` styles and markup.

- [ ] Replace the repeated generic feature-panel treatment with four clearly differentiated CSS visual identities.
- [ ] Add an institutional market strip below the hero proposition: `Energy Infrastructure`, `Digital Infrastructure`, `Japanese Companies`, `Cross-border Capital`.
- [ ] Ensure visual treatments use abstract gradients/patterns and labels rather than claiming to show actual projects.
- [ ] Verify mobile layouts remain single-column below 650px.
- [ ] Commit with message `feat: add asset-specific investment visuals`.

### Task 2: Upgrade opportunity cards for investor scanning

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing four opportunity cards and project anchors `#lng`, `#bess`, `#ai`, `#transactions`.
- Produces: concise metadata rows for asset type, scale and action.

- [ ] Keep the existing supported metrics: `174,000 CBM`, `2MW -> 100MW`, `200MW+`, and `Japan` M&A.
- [ ] Add compact visual headers that map each card to LNG / BESS / AI / M&A.
- [ ] Keep `View Opportunity` actions and route them to the existing sections.
- [ ] Add Chinese and Japanese strings for any new labels.
- [ ] Commit with message `feat: improve opportunity card scannability`.

### Task 3: Upgrade featured LNG, BESS and AI sections

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: current LNG facts, BESS portfolio scale, AI stats and existing disclaimers.
- Produces: dedicated visual panels and clearer project-specific CTAs.

- [ ] LNG: preserve `174,000 CBM`, five-vessel program and all existing indicative financing/charter assumptions; keep the disclaimer directly adjacent.
- [ ] BESS: preserve the `2MW -> 10MW -> 30MW -> 50MW -> 100MW` aggregation story and distinguish portfolio aggregation from strategic extra-high-voltage projects.
- [ ] AI: preserve `200MW+` and emphasize land, power and local execution needs without adding unverified location/counterparty details.
- [ ] Add `Request Teaser` / `Discuss Investment` actions that route to Investor Mandate.
- [ ] Commit with message `feat: refine strategic asset sections`.

### Task 4: Rebuild Japan Investment Intelligence as investor briefing cards

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `#intelligence` section and six topic categories.
- Produces: six briefing cards with `What to watch` and `Why it matters` structure.

- [ ] Keep six categories: Energy & BESS, LNG & Maritime, AI & Data Centers, Japanese Companies, Cross-border M&A, Policy & Capital.
- [ ] Replace generic one-line summaries with concise investor-oriented `What to watch` / `Why it matters` copy.
- [ ] Keep a visible note that automated daily publishing is not yet live.
- [ ] Add Chinese and Japanese translations for new labels/copy.
- [ ] Commit with message `feat: turn intelligence into investor briefings`.

### Task 5: Tighten trust and conversion flow

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Selected Transactions, Why UPEX, BATONZ credential, mandate form, submission form, mobile sticky actions.
- Produces: a clearer trust-to-conversion transition.

- [ ] Preserve the three anonymized transaction examples and their existing figures.
- [ ] Keep BATONZ URL `https://batonz.jp/partner_adviser/upex/pg2888641.html` with `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] Keep wording that BATONZ is an external professional reference, not an endorsement.
- [ ] Add a concise final conversion bridge before forms: investor -> mandate; Japanese project owner -> submit opportunity.
- [ ] Keep the mobile sticky two-action bar.
- [ ] Commit with message `feat: strengthen trust to conversion path`.

### Task 6: Integrity and production verification

**Files:**
- Verify: `index.html`

**Interfaces:**
- Consumes: completed V4.1 homepage.
- Produces: verified production-ready branch state.

- [ ] Fetch the final `index.html` and confirm the four asset themes are present.
- [ ] Confirm `grid-substation.jpg` is no longer reused as the LNG/project feature visual.
- [ ] Confirm LNG disclaimer remains present next to indicative figures.
- [ ] Confirm `BATONZ`, UPEX Tokyo address, `+81 3-6717-4565`, and `info@u-pex.com` remain present.
- [ ] Confirm Investor Mandate, Submit Opportunity and mobile actions remain present.
- [ ] Confirm the intelligence section states that automatic daily publishing is not yet live.
- [ ] Confirm English, Chinese and Japanese dictionaries contain all new translation keys.
- [ ] Fetch the committed file from the target branch and inspect the relevant sections before claiming completion.
