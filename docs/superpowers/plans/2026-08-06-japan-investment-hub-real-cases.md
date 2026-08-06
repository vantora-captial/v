# Japan Investment Hub Real Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the homepage as a Japan investment gateway and add source-backed UPEX transaction examples without exposing client identities.

**Architecture:** Keep the existing static GitHub Pages deployment and replace `index.html` with a focused multilingual single-page experience. The page will prioritize investment opportunities, a featured LNG project, anonymized selected transactions, UPEX execution capabilities, and direct Tokyo-team contact.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages.

## Global Constraints

- Default language is English; Simplified Chinese and Japanese remain available.
- Case-study figures and roles must match the UPEX 2025 case document.
- Client identities remain anonymized.
- LNG figures are explicitly labelled indicative and subject to approval, market conditions, regulation and definitive agreements.
- Contact forms remain front-end demonstrations only.

---

### Task 1: Reposition the homepage

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: navigation anchors `opportunities`, `lng`, `transactions`, `capabilities`, `about`, and `contact`.

- [ ] Replace the hero copy with the direct `Invest in Japan` positioning.
- [ ] Add six investment opportunity categories.
- [ ] Preserve the featured 174,000 CBM LNG carrier program with clear indicative disclaimers.

### Task 2: Add real transaction examples

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: three anonymized case cards and transaction metrics.

- [ ] Add the JPY 500 million Japanese consumer-finance acquisition case.
- [ ] Add the JPY 800 million Japanese precision-manufacturing acquisition case.
- [ ] Add the JPY 1.2 billion Japanese listed-company carve-out case.
- [ ] Present UPEX role and outcome without naming clients.

### Task 3: Add actual UPEX capabilities and contact details

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: capability cards and contact section.

- [ ] Add cross-border M&A, financing, PMI, market entry, real assets and technology cooperation capabilities.
- [ ] Add Tokyo address, telephone and official email details.
- [ ] Keep the enquiry modal and multilingual language persistence.

### Task 4: Verify release

**Files:**
- Verify: `index.html`

- [ ] Confirm the committed page includes all three case values, LNG disclaimers and UPEX contact details.
- [ ] Confirm navigation, language switching, mobile navigation and modal interactions remain present.
