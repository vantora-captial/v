# BATONZ Credential Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a multilingual BATONZ external professional-profile credential to the Japan Investment Hub without implying third-party endorsement.

**Architecture:** Keep the single-page static GitHub Pages structure. Add one restrained credential component inside `Why UPEX`, reuse the current CSS design system, and extend the existing `data-t` translation dictionary for Chinese and Japanese.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages.

## Global Constraints

- Destination URL must be `https://batonz.jp/partner_adviser/upex/pg2888641.html`.
- External link must open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Do not imply BATONZ endorsement, certification or validation of UPEX investment projects.
- Preserve the primary `Tell Us Your Investment Mandate` conversion hierarchy.
- Preserve English, Chinese and Japanese language switching.

---

### Task 1: Add BATONZ credential card

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `.card`, `.btn`, `.eyebrow` styles and `data-t` localization behavior.
- Produces: one external BATONZ profile card inside `#about`.

- [ ] Add a compact credential card after the six UPEX capability blocks.
- [ ] Use the approved neutral copy: `View UPEX's public adviser profile on BATONZ, a Japanese M&A platform.`
- [ ] Add CTA `View UPEX on BATONZ →` linked to the exact supplied URL.
- [ ] Add `target="_blank" rel="noopener noreferrer"`.

### Task 2: Add multilingual credential copy

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `T.zh` and `T.ja` dictionaries.
- Produces: translation keys `credentialEye`, `credentialTitle`, `credentialCopy`, `credentialCta`.

- [ ] Add Simplified Chinese copy from the approved design spec.
- [ ] Add Japanese copy from the approved design spec.
- [ ] Confirm the English default remains visible before JavaScript localization.

### Task 3: Verify external-profile behavior

**Files:**
- Verify: `index.html`

- [ ] Fetch the updated file from branch `top`.
- [ ] Confirm the exact BATONZ URL is present.
- [ ] Confirm `_blank`, `noopener`, and `noreferrer` are present.
- [ ] Confirm no `endorsed`, `certified`, or equivalent endorsement language is present in the credential.
- [ ] Confirm `Tell Us Your Investment Mandate` remains the primary header and hero CTA.
