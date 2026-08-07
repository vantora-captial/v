# Typography and Investment Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Japan Investment Hub typography to Manrope + Noto Sans SC/JP and turn the homepage Intelligence area into a publication-ready daily briefing surface.

**Architecture:** Keep the existing static GitHub Pages architecture. Typography remains CSS-only with resilient system fallbacks; the Intelligence section receives structured dated briefing cards and a clear separation between editorial content and investment opportunities. A later automation can replace the daily content without redesigning the page.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages.

## Global Constraints

- Primary Latin font: Manrope.
- CJK fallback fonts: Noto Sans SC and Noto Sans JP.
- Preserve English, Simplified Chinese and Japanese language switching.
- Preserve LNG, BESS, transaction-case and contact content already on the homepage.
- Daily intelligence must be concise, dated and clearly separated from confidential deal flow.
- No claim that website publishing is automated until a publishing workflow is actually deployed.

---

### Task 1: Typography system

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: site-wide CSS font stack and heading/body hierarchy.

- [ ] Replace Georgia heading usage with Manrope.
- [ ] Use `Manrope, "Noto Sans SC", "Noto Sans JP", system-ui, sans-serif` for the main UI.
- [ ] Increase heading weight and tighten letter spacing for an institutional investment style.
- [ ] Preserve legibility for Chinese and Japanese text.

### Task 2: Daily intelligence surface

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: dated daily briefing block with categories for BESS, LNG, AI/data centers, M&A/listed companies and policy/capital.

- [ ] Add a visible briefing date.
- [ ] Add concise actionable briefing cards.
- [ ] Add a `View Daily Briefing` action and editorial disclaimer.
- [ ] Preserve multilingual labels for the Intelligence section.

### Task 3: Verification

**Files:**
- Verify: `index.html`

- [ ] Confirm no Georgia font declarations remain.
- [ ] Confirm Manrope and Noto Sans fallback declarations are present.
- [ ] Confirm LNG, BESS, three selected transactions, Intelligence and UPEX contact sections remain present.
- [ ] Confirm mobile navigation, language selector and enquiry modal remain in the page.
