# Vantora LNG Investor Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing static homepage with a responsive multilingual institutional website that presents Vantora Capital, the five-vessel 174,000 CBM dual-fuel LNG carrier opportunity, and a gated investor-portal demonstration.

**Architecture:** Keep the current zero-build GitHub Pages architecture. Deliver the first production-ready version as one self-contained `index.html` with semantic HTML, CSS design tokens, and vanilla JavaScript for language switching, navigation, modal forms, and portal demonstration states. Reuse repository logo assets and ensure every path works under `/v/`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages.

## Global Constraints

- Public URL base path is `/v/`.
- Languages are Simplified Chinese, English, and Japanese.
- Default language is English, with user preference persisted in `localStorage`.
- Visual direction is institutional maritime finance: deep navy, near-black, warm gold, white, restrained motion.
- All financing, charter-rate, and valuation figures must be presented as indicative and subject to approval, contract, regulation, and market conditions.
- The investor portal in this static release is a front-end demonstration only; production NDA, KYC, authentication, and VDR access require a secure backend.
- The site must be responsive and keyboard accessible.

---

### Task 1: Replace the public website shell

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: semantic sections with IDs `home`, `about`, `services`, `project`, `structure`, `portal`, and `contact`.

- [ ] Create a sticky responsive header using the existing Vantora logo assets.
- [ ] Add an institutional hero with LNG project positioning, three primary calls to action, and key project metrics.
- [ ] Add company, capabilities, featured project, transaction structure, investor audience, and contact sections.
- [ ] Add a complete footer with project disclaimer and navigation.
- [ ] Verify all internal links work under `/v/`.

### Task 2: Add multilingual content and interactions

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: elements marked with `data-i18n`.
- Produces: `setLanguage(languageCode)` supporting `en`, `zh`, and `ja`.

- [ ] Define a translation dictionary for all visible navigation, section copy, buttons, form labels, project metrics, disclaimers, and portal content.
- [ ] Bind the language selector to `setLanguage`.
- [ ] Persist the chosen language in `localStorage`.
- [ ] Update the document language and title after every language change.

### Task 3: Add LNG project and investor portal flows

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: `openModal(type)`, `closeModal()`, `showPortalDemo()`, and form-success states.

- [ ] Add project-detail presentation for five 174,000 CBM next-generation dual-fuel LNG carriers.
- [ ] Present indicative values: approximately USD 250 million per vessel, 60–70% potential bank financing, 30–40% equity, 10–15-year charter potential, and USD 80,000–110,000 indicative daily charter rate.
- [ ] Add a gated-access journey covering enquiry, NDA, KYC, review, approval, and VDR access.
- [ ] Add investor login and request-information modals.
- [ ] Clearly label the portal as a demonstration without production authentication.

### Task 4: Responsive, accessibility, and release verification

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: mobile navigation, keyboard-close behavior, reduced-motion support, and accessible form controls.

- [ ] Add mobile navigation and responsive grids for 1180px, 900px, and 640px breakpoints.
- [ ] Add focus-visible styles, ARIA labels, modal roles, and Escape-key dismissal.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Verify no absolute root asset paths are used; assets must resolve relative to `/v/`.
- [ ] Fetch the committed file from GitHub and verify key strings and structure are present.
