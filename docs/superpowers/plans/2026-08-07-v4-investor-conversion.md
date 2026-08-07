# V4 Investor Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing UPEX Japan Investment Hub homepage into a clearer two-sided investor/project-origination product with stronger trust and conversion UX.

**Architecture:** Preserve the existing single-file static site and its multilingual dictionary to minimize deployment risk. Add a dual-audience gateway, opportunity status metadata, project-owner conversion path, mobile sticky actions, and a stronger final conversion section while retaining all supported project facts and external BATONZ reference.

**Tech Stack:** Static HTML, CSS and vanilla JavaScript on GitHub Pages.

## Global Constraints
- Main CTA remains `Tell Us Your Investment Mandate`.
- Secondary project-owner CTA is `Submit an Opportunity`.
- Preserve LNG, BESS, AI Data Center, M&A cases, UPEX Tokyo contact and BATONZ URL.
- Preserve English, Chinese and Japanese language switching.
- Do not imply BATONZ endorsement.
- Do not claim daily news automation is live.
- Use Manrope + Noto Sans SC/JP typography.

---

### Task 1: Add dual-audience gateway and conversion hierarchy
**Files:** Modify `index.html`
- [ ] Add investor and project-owner entry cards directly after the hero.
- [ ] Keep Investor Mandate visually primary.
- [ ] Add `Submit an Opportunity` anchors to the project-owner flow.
- [ ] Add multilingual strings.
- [ ] Verify anchors and responsive layout.

### Task 2: Improve opportunity cards and project scannability
**Files:** Modify `index.html`
- [ ] Add restrained status/type chips.
- [ ] Make metrics, opportunity type and next action visually distinct.
- [ ] Preserve all supported figures and disclaimers.
- [ ] Verify mobile card stacking.

### Task 3: Strengthen trust architecture
**Files:** Modify `index.html`
- [ ] Keep Selected Transactions prominent.
- [ ] Add a concise credibility bridge into Why UPEX.
- [ ] Preserve BATONZ external profile with safe wording and new-tab security attributes.
- [ ] Verify no endorsement language appears.

### Task 4: Add project-owner submission path
**Files:** Modify `index.html`
- [ ] Add a compact project-owner form or mail-based submission block.
- [ ] Include project type, location, scale and message fields.
- [ ] Clearly state the static form limitation and provide `info@u-pex.com` as official submission route.
- [ ] Add multilingual strings.

### Task 5: Improve mobile conversion UX
**Files:** Modify `index.html`
- [ ] Add a mobile-only sticky bottom action bar.
- [ ] Provide Investor Mandate and Submit Opportunity actions.
- [ ] Ensure it does not cover footer/form controls.
- [ ] Verify breakpoint behavior.

### Task 6: Final content and integrity verification
**Files:** Verify `index.html`
- [ ] Confirm BATONZ URL, UPEX address, phone and email.
- [ ] Confirm LNG, BESS, AI and transaction figures remain present.
- [ ] Confirm all three languages contain new keys.
- [ ] Confirm no automated-news-live claim.
- [ ] Fetch committed file from `top` and inspect the updated sections.
