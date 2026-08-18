# Vantora Japan Consultation-First UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/ja/` as a Japan-native, consultation-first cross-border M&A experience that starts from Japanese business-owner concerns, explains Vantora through concrete actions and reassurance, and positions overseas investor access as a later-stage differentiator.

**Architecture:** Keep the static generator and shared shell, but give Japanese pages a dedicated native composition path in `site/content.mjs` and `site/templates.mjs`. English and Traditional Chinese keep the existing international boutique-advisory composition. Remove the transitional `site/ja-sourcing.mjs` / `assets/ja-sourcing.css` post-build injection after native rendering is in place.

**Tech Stack:** Node.js 22; static HTML generator; vanilla JS/CSS; Node test runner; Cloudflare Pages preview; existing Worker CI.

**Spec:** `docs/superpowers/specs/2026-08-18-vantora-japan-consultation-ux-design.md`

## Global Constraints

- Work only on `trilingual-public-site`; do not merge to `top`.
- Japanese becomes consultation-first; EN/ZH remain unchanged in visible content.
- Hero: `会社や事業のこれからを、海外という選択肢から考える。`
- `こんなお悩みはありませんか` appears before service/capability content.
- Explain Vantora through `整理する / つなぐ / 進める`.
- Overseas funds, family offices, listed companies and strategic investors are only qualified counterparty categories depending on the case.
- No guaranteed buyers/investors, exclusive network, quantified family-office network, AUM, transaction volume, named counterparties or unverified regulated status.
- Initial consultation language must reduce commitment and emphasize confidentiality-conscious handling.
- Replace Japanese home process with six Japanese stages: `初期相談 / 案件整理 / 候補先の検討 / 守秘・初期協議 / 条件協議・DD / 取引実行`.
- Preserve Registry safety, AI Concierge, canonical/hreflang, browser-language routing, contact behavior and preview-only deployment.

### Task 1: Japanese UX contract tests
- Update `tests/frontend/ja-seller-sourcing.test.mjs` to assert issue-first hierarchy, five concern items, three action verbs, six-stage process, reassurance, safe claims, EN/ZH isolation, and absence of international process labels on `/ja/`.
- Run via CI after commit.

### Task 2: Native Japanese content model
- Update `site/content.mjs` with new Japanese hero, concern items, action items, overseas-options copy, six-stage journey, reassurance, Japan-native contact labels and nav wording.

### Task 3: Dedicated Japanese homepage renderer
- Update `site/templates.mjs` so `renderHome('ja')` uses a dedicated Japanese composition while EN/ZH continue existing composition.
- Add Japanese-scoped visual system in `assets/site.css`: smaller headline scale, more ivory/white, finer rules, denser information, consultation-first CTAs.

### Task 4: Japanese Contact and About
- Reframe Contact as an initial consultation desk while preserving technical path keys.
- Recompose About around: `Vantoraの役割 / 日本側で行うこと / 海外との接点 / 対象となる案件 / 進め方と守秘`.

### Task 5: Remove transitional injection
- Remove `enhanceJapanesePage` from `scripts/build-site.mjs`.
- Delete `site/ja-sourcing.mjs` and `assets/ja-sourcing.css`.
- Assert generated Japanese pages no longer reference `ja-sourcing.css`.

### Task 6: Verification
- Require green frontend and Worker CI.
- Require green Cloudflare preview deploy.
- Review `/ja/`, `/ja/about/`, `/ja/contact/` preview.
- Stop before production merge/deploy.
