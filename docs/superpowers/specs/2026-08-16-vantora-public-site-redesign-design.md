# Vantora Public Site Redesign — Design Specification

Date: 2026-08-16
Branch: `ai-sales-redesign`
Status: Approved design direction; implementation not started

## 1. Goal

Redesign the public-facing Vantora site so it reads and feels like a premium Tokyo-based cross-border investment and M&A advisory firm, with selected investment opportunities as a secondary proof point rather than the primary identity.

The redesign must improve five things together:

1. visual hierarchy and institutional credibility,
2. mobile typography and spacing,
3. external/client-facing English, Chinese, and Japanese copy,
4. image selection and visual storytelling,
5. reduction of project-advertising tone.

The site must remain credible even while the AI sales assistant is not yet fully live due to API quota constraints.

## 2. Positioning

### Primary brand

**Vantora** is the sole visual master brand.

### Endorsement

Use **Powered by UPEX Tokyo** as restrained supporting credibility, not as a co-equal logo. Appropriate placements include the brand lockup subtitle, About/Why Vantora section, and footer.

### Primary positioning statement

Vantora should be understood first as a **Tokyo-based cross-border investment and M&A advisory platform** helping international investors and companies access, evaluate, structure, and execute opportunities in Japan.

### Audience priority

All three customer groups remain in scope, but the site prioritizes:

1. overseas investors, funds, asset managers, sovereign capital, and family offices;
2. overseas companies seeking Japan market entry, partnerships, investment, or M&A;
3. Japanese companies and project owners seeking international capital, buyers, or strategic partners.

## 3. Visual Direction

Use the approved first concept: **Institutional Editorial**.

### Palette

- Deep navy foundation
- Warm ivory / off-white content areas
- Restrained muted gold accents
- Neutral gray-blue secondary copy

Gold is an accent, not a dominant fill. Avoid overusing glowing gradients, badges, pills, and excessive border effects.

### Typography

The design should feel editorial and institutional rather than startup-like.

- Headlines: elegant, high-contrast editorial feel; large on desktop but restrained.
- Body/UI: clean sans-serif with excellent multilingual support.
- English, Simplified Chinese, and Japanese must each have visually balanced line heights and weights.

Mobile typography must be materially smaller than the current site. Target guidance:

- mobile hero headline: approximately 2.55–2.9rem depending on language and line length;
- Chinese/Japanese hero may be slightly smaller than English if needed to avoid awkward wrapping;
- mobile section headings should not inherit oversized desktop `clamp()` behavior;
- body copy should generally sit around 15–16px with comfortable line height;
- card titles must remain subordinate to section headings.

No mobile screen should be dominated by a headline at the expense of context or CTA visibility.

### Layout character

- Generous whitespace
- Strong grid alignment
- Fewer simultaneous visual signals
- Fewer cards per viewport
- Clear hierarchy between brand, advisory capability, proof, opportunities, and conversion

The website should look closer to a boutique investment advisory / corporate finance firm than an investment project marketplace.

## 4. Image Strategy

The visual story follows the approved mixed approach:

### Hero

Use a premium Tokyo business-city image: skyline, Marunouchi / Otemachi / Toranomon-style business district, waterfront business view, or similarly credible urban context.

Avoid tourist-postcard imagery and avoid opening with a power substation or other sector-specific infrastructure image.

### Secondary imagery

Use professional, realistic sector imagery where relevant:

- LNG: vessel, terminal, port, or energy logistics;
- BESS: modern battery storage / grid infrastructure;
- AI Data Center: real data-center / digital infrastructure photography;
- M&A / corporate advisory: Japanese enterprise, office, boardroom, industrial or corporate context;
- Vantora / UPEX credibility: Tokyo business environment and professional meeting / execution context.

Avoid generic handshakes, fake AI holograms, cliché stock-business portraits, and visually misleading project imagery.

The homepage should use a small number of strong images rather than giving every block a stock photo.

## 5. Homepage Information Architecture

The final homepage order is:

1. Hero
2. Who We Work With
3. What We Do
4. Selected Opportunities
5. Why Vantora / Powered by UPEX Tokyo
6. Selected Experience
7. Insights
8. Private Discussion / Contact

### 5.1 Hero

Purpose: explain the brand in one screen before presenting projects.

Recommended headline direction:

**Japan Opportunities. Local Execution. Global Perspective.**

Supporting copy should position Vantora as a Tokyo-based cross-border advisory firm for investors and companies, emphasizing local execution and international standards.

Use only two primary actions:

- **Discuss Your Strategy**
- **Explore Selected Opportunities**

Do not show a row of project metrics/tags in the hero. LNG, BESS, 200MW+, etc. must not compete with the positioning statement.

### 5.2 Who We Work With

Present the audiences clearly and without requiring technical finance terminology before trust is established.

Recommended groups:

- Overseas Investors
- Family Offices / Institutional Capital
- Overseas Companies
- Japanese Companies & Project Owners

Descriptions should be brief and client-facing.

### 5.3 What We Do

Core advisory capability should become more prominent than individual project inventory.

Recommended capability set:

- Cross-Border M&A
- Investment & Capital Advisory
- Japan Market Entry & Strategic Partnerships
- Infrastructure / Sector Advisory

Where supported by actual service capability, references to due diligence coordination, transaction structuring, negotiation, execution, and post-deal support may appear deeper in the section.

Do not state legal, securities, regulated advisory, or licensing capabilities beyond what can be accurately substantiated.

### 5.4 Selected Opportunities

Show opportunities as curated examples of access, not as public investment solicitations.

Themes can include:

- LNG
- Japan BESS
- AI Data Center
- Japanese Companies & M&A

The section must be visually quieter than the advisory capability sections.

Avoid hard-selling language, guarantees, returns, implied availability, false scarcity, or unverified claims.

Any numerical project details should be used only when they are verified and appropriate for public disclosure. Otherwise use qualitative descriptions or clearly qualified indicative language.

### 5.5 Why Vantora / UPEX

Purpose: establish why a foreign client should trust the platform to operate in Japan.

Core themes:

- Tokyo-based execution
- local market insight
- cross-border transaction experience
- senior, hands-on support
- international client communication
- confidentiality and disciplined process

Use **Powered by UPEX Tokyo** here as substantiation, not as competing branding.

### 5.6 Selected Experience

Only publish experience, transaction examples, client facts, credentials, volumes, values, logos, or statistics that can be supported.

Do not import unverified claims such as assets under management, customer/account counts, certifications, transaction values, or live counterparties from unrelated sites or prior drafts.

If evidence is insufficient, use anonymized qualitative case summaries rather than invented or embellished numbers.

### 5.7 Insights

Use a small number of high-quality Japan investment / M&A / infrastructure insights.

The homepage should not resemble a news portal. Show 2–3 strong items and link to more if an insights archive exists.

### 5.8 Private Discussion / Contact

Conversion language should be private, consultative, and senior-level.

Recommended framing:

**Private Discussion**

“Discuss your investment, market-entry, M&A, or strategic partnership objectives in Japan with our Tokyo-based team.”

Use clear email/contact actions. AI sales may be layered in later once the production service passes live verification.

## 6. Language Strategy

### Default

English is the default public language.

Header language switcher:

**EN / 中文 / 日本語**

### Principle

The three languages are not literal translations of one master copy. Each version must sound native and client-facing.

### English

- concise institutional language;
- short sentences;
- limited adjectives;
- avoid startup jargon and overclaiming;
- favor “advisory,” “execution,” “opportunities,” “strategy,” “market entry,” and “M&A” where accurate.

### Simplified Chinese

- clear explanation of Japan investment, M&A, project cooperation, and local execution;
- avoid vague marketing phrases such as “赋能、生态、全球资本链接” unless specifically necessary;
- use natural business-development language rather than direct translations of institutional English jargon.

Example CTA direction:

**与我们讨论您的日本投资计划**

### Japanese

- prioritize trust, confidentiality, execution support, and consultation;
- avoid aggressive investment-marketing language;
- avoid unnatural direct translation of terms such as “mandate” in customer-facing CTAs.

Example CTA direction:

**日本での投資・事業機会について相談する**

## 7. CTA and Advertising Tone

The existing site feels too promotional when multiple badges, project metrics, and buttons appear together.

The redesign must:

- reduce CTA count per section;
- remove the project-tag cluster from the hero;
- use one primary and one secondary hero CTA;
- avoid “limited opportunity,” guaranteed return, implied urgency, or solicitation-like language;
- avoid making project size numbers the main brand identity;
- frame opportunities as selectively shared / subject to verification where appropriate.

The goal is institutional confidence, not advertising intensity.

## 8. Mobile Design Requirements

Mobile is a first-class design target.

Requirements:

- smaller hero and section typography than current production;
- no excessive multi-line 3–5 line giant headings;
- consistent 16–24px horizontal gutters depending on viewport;
- cards stack cleanly and remain visually compact;
- hero CTA buttons may stack, but must remain visible without excessive scroll;
- navigation collapses cleanly;
- language switch remains obvious and tappable;
- no fixed mobile control should obscure contact/AI elements;
- Chinese and Japanese layouts must be visually reviewed independently from English.

## 9. Truthfulness and Compliance Guardrails

The redesign must not invent or imply:

- guaranteed investment returns;
- live counterparties or exact confidential locations;
- transaction availability that has not been confirmed;
- AUM, account numbers, certifications, regulatory status, licenses, or transaction volumes without evidence;
- client logos or mandates without permission;
- precise project facts that have not been verified for public disclosure.

Any disclaimer language should be concise and institutional, not alarmist.

## 10. AI Sales Relationship to the Redesign

The visual redesign must work perfectly without the AI assistant.

Current production AI status is treated as an independent integration dependency. The redesigned site can preserve compatible hooks/components, but AI must not be the primary conversion path until:

- OpenAI API quota is available;
- live Chinese/Japanese/English chat passes;
- compliance-boundary prompts pass;
- lead email delivery is verified.

Until then, primary conversion remains standard contact / private discussion actions.

## 11. Implementation Boundaries

The redesign will be developed on `ai-sales-redesign` and reviewed before any merge to `top`.

The existing production site remains unchanged until explicit approval to release.

Out of scope for this redesign phase:

- CRM implementation;
- investor portal/login;
- payments or investment execution;
- automated financial recommendations;
- complex CMS migration;
- new regulatory claims;
- unverified public deal database.

## 12. Acceptance Criteria

The redesign is ready for review when:

1. desktop and mobile layouts implement the approved institutional editorial direction;
2. Vantora is the primary visible brand and UPEX Tokyo is a restrained endorsement;
3. English is default with Chinese and Japanese switching;
4. all three language versions read as external/native business copy rather than literal/internal wording;
5. mobile headline and section typography is visibly smaller and better balanced than production;
6. hero no longer leads with sector/project metrics;
7. advisory positioning precedes selected opportunities;
8. Hero uses Tokyo-oriented brand imagery; sector imagery is used only in relevant sections;
9. unverified public claims are removed, qualified, or omitted;
10. contact flow remains usable without AI;
11. automated frontend checks continue to pass or are updated to match intentional behavior;
12. no merge to `top` occurs before explicit user review and approval.
