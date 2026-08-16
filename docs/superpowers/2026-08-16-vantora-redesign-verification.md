# Vantora Public Site Redesign Verification

Date: 2026-08-16
Branch: `ai-sales-redesign`

## Scope verified

- Vantora is the primary visible brand.
- `Powered by UPEX Tokyo` is retained as a restrained endorsement.
- English is the default language; Chinese and Japanese client-facing copy are included.
- Homepage order follows the approved design: Hero → Who We Work With → What We Do → Selected Opportunities → Why Vantora → Selected Experience → Insights → Private Discussion / Contact.
- Mobile hero typography is capped at 2.9rem in English and 2.7rem in Chinese/Japanese.
- Mobile section titles are capped at 2.35rem and body baseline is 15px.
- Hero uses Tokyo business-district imagery rather than the prior substation image.
- Selected opportunity imagery is separated by LNG, BESS, digital infrastructure, and Tokyo corporate/M&A themes.
- Hero project-metric advertising tags and `Tell Us Your Mandate` have been removed.
- Public opportunity language is qualitative and includes confidentiality / verification / no-guarantee framing.
- AI Worker meta hook and AI frontend assets remain connected, but standard contact remains the primary conversion path.

## Automated verification

GitHub Actions workflow: `AI Sales CI`
Run ID: `31938327915`
Head: `58eb03bc637ea7c652b69add29c38c57166a67c4`

Results:

- `frontend-tests`: PASS
- `worker-tests`: PASS
- Worker type generation: PASS
- Worker unit tests: PASS
- Wrangler deploy dry run: PASS

The frontend test suite verifies:

- production Worker endpoint is retained;
- Vantora redesign structure and section IDs are present;
- old hero project tags and `Tell Us Your Mandate` are absent;
- English / Chinese / Japanese external-facing CTAs are present;
- the document `lang` attribute updates with language switching;
- mobile typography limits are present;
- Tokyo-first / sector-specific image references are present;
- public frontend assets contain no OpenAI or Resend secret identifiers;
- AI state remains session-scoped and the frontend cannot choose the email recipient;
- AI-rendered visitor/model content continues to use `textContent` rather than `innerHTML`;
- the AI widget retains mobile, reduced-motion, and focus-visible safeguards.

## Branch isolation

`top` remains at commit `3ad8c181fbe34c5d7e44afb015c2d1eecb81941a`.
The redesign branch is separate and has not been merged into production.

## Image sourcing

Current prototype/review imagery references Wikimedia Commons media with source/license attribution in the footer:

- Marunouchi skyline — Joe Jones — CC BY 2.0
- LNG Carrier — FeZn — CC BY-SA 3.0 / GFDL
- BESS diagram — Droompny — CC BY-SA 4.0
- TSUBAME 3.0 computing racks — Kestrel — CC BY-SA 4.0

Before production release, image licensing/attribution presentation should receive a final human review, especially if images are replaced with company-owned or commercially licensed photography.

## Known independent blocker

The OpenAI API key is valid, but the OpenAI API project currently has insufficient quota. This does not block the static website redesign or standard contact paths. It does block live AI-chat acceptance and final AI lead-email verification until API billing/quota is enabled.
