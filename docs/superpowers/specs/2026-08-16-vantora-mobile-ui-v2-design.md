# Vantora V2 Mobile UI Redesign Specification

Date: 2026-08-16
Branch: `ai-sales-redesign`
Status: User-confirmed design; implementation pending

## 1. Goal

Redesign the mobile experience as a purpose-built interface rather than a compressed desktop layout.

The mobile version must preserve the approved A+C brand direction — premium Japan investment / M&A advisory plus selected Japan opportunity access — while making each screen simpler, more readable, and more visually intentional.

Primary mobile principle:

> **One screen, one message, one clear action.**

## 2. Problems Identified in Current Mobile Preview

The current mobile header and content hierarchy feel crowded because desktop structures are being stacked rather than redesigned for mobile.

Specific issues:

- Brand identity appears twice in the header: logo plus a second `Vantora / Powered by UPEX` text group.
- Language selector, menu, logo, and duplicate brand text compete for the same horizontal space.
- Headline and supporting text wrap mechanically rather than according to language-specific editorial rules.
- Too many boxed cards create repetitive vertical rhythm.
- Multiple sections use similar “grid → card → card → card” patterns, making the page feel dense and undifferentiated.
- Selected Opportunities do not yet feel like premium, high-value editorial stories on a small screen.
- Mobile conversion hierarchy is not strong enough; the first screen should surface a meaningful CTA earlier.

## 3. Mobile Header

Approved option: **A — Minimal Header**.

### Layout

Left:

- VANTORA logo only.

Right:

- compact language selector
- menu button

Remove from mobile header:

- repeated `Vantora` wordmark text next to the logo
- `Powered by UPEX` text

`Powered by UPEX` remains available in `Why Vantora` and/or Footer, where it supports credibility without consuming first-screen navigation space.

### Header dimensions

- target height: approximately `64–68px`
- logo remains visually dominant
- language selector and menu have lower visual weight
- menu and language controls remain at least 44px tappable where practical

### Mobile language label

Prefer compact display:

- EN
- 中文
- JA

Full language names may appear inside the menu or selector options.

## 4. Mobile Hero

The mobile hero must not simply shrink desktop typography.

### English

- headline maximum: 3 lines
- avoid single-word orphan lines
- keep the primary value proposition visible before excessive scrolling

Recommended structure:

**Access Japan**
**Through Trusted Local Execution**

or equivalent two-to-three-line editorial wrapping.

### Simplified Chinese

Target: 2–3 lines.

Approved headline structure:

**进入日本市场**
**获取投资、并购与战略合作机会**

The second line may wrap naturally once on smaller screens, but avoid breaking the core phrase into many short fragments.

### Japanese

Maximum: 3 lines.

Preferred structure:

**日本市場への**
**投資・M&A・事業機会にアクセス**

Line breaks should be reviewed manually so particles and punctuation are not stranded.

### Supporting copy

- target: 3–4 lines
- shorten wording on mobile if necessary
- do not repeat the headline in different words

### CTA hierarchy

Two stacked CTAs:

1. primary: Explore Opportunities / language equivalent
2. secondary: Book a Private Discussion / language equivalent

At least one primary CTA should be visible on the initial phone viewport whenever device height reasonably allows.

## 5. Mobile Section Rhythm

The mobile page should move away from repeated card grids.

Approved rhythm:

**short heading → concise copy → generous whitespace → strong image or numbered item → clear CTA**

Avoid:

- four boxed cards in a row converted into four identical stacked cards
- repeated border-heavy panels
- dense subtitles above every item
- excessive labels / tags / metrics

## 6. Who We Help

Use a lightweight vertical editorial list, not large standalone cards.

Three groups only:

1. Investors, Funds & Family Offices
2. Overseas Companies Entering Japan
3. Japanese Companies & Project Owners

Each item contains:

- concise audience heading
- one outcome-focused sentence

Visual treatment:

- subtle divider lines
- optional small index number
- no large rounded containers

## 7. What We Unlock in Japan

Use a vertical numbered sequence rather than a four-card grid.

Structure:

- `01 Investment Access`
- `02 M&A & Strategic Acquisitions`
- `03 Market Entry & Partnerships`
- `04 Capital & Strategic Matching`

Each item should have:

- number
- title
- maximum 2–3 lines of explanation

This section should resemble a premium advisory capability index, not a services catalogue.

## 8. Selected Opportunities

This is the main mobile storytelling section.

Approved approach: **one opportunity per near-full-screen editorial block**.

Each opportunity follows this sequence:

1. large image
2. small category label
3. strong title
4. concise 2–3 line description
5. one CTA

Opportunity themes:

- LNG & Energy Logistics
- Japan BESS & Grid Infrastructure
- AI Data Centers & Digital Infrastructure
- Japanese Companies & Cross-Border M&A

### Visual proportions

- image occupies approximately 45–55% of the module’s visual height
- image should feel immersive but not hide the text or CTA below the fold excessively
- each opportunity should have substantial vertical breathing room before the next one

### CTA examples

- Request Details
- Discuss This Sector
- View Opportunity Theme

Language equivalents must remain concise.

### Guardrail

Do not show project price, return, availability count, confidential counterparty, or unsupported transaction detail.

## 9. Why Vantora

Reduce the current many-box layout to **four core reasons**.

Recommended pillars:

1. Japan-wide local execution
2. Cross-border M&A and investment perspective
3. Senior, hands-on involvement
4. Confidential private process

Presentation:

- vertical list or paired text blocks
- no six-tile mini-grid
- use stronger headings and shorter descriptions

`Powered by UPEX` may appear as a restrained supporting credibility line here.

## 10. Selected Experience

Each item should communicate:

- type of situation
- what Vantora supports

Avoid numeric proof unless publicly verified.

Recommended mobile pattern:

- category label
- one concise headline
- one short explanation

No equal-height card requirement on mobile.

## 11. Contact / Private Discussion

End with a distinct dark conversion section.

Recommended structure:

- strong heading
- 2–3 line support copy
- full-width primary CTA
- email and phone below as alternative direct contact

CTA should visually dominate the contact details.

AI should remain secondary and must not be required to contact Vantora.

## 12. Typography

### Mobile body

- approximately `15px`
- line-height approximately `1.6–1.7`

### Hero title

English target:

- `clamp(2.2rem, 9.5vw, 2.7rem)`

Chinese / Japanese target:

- `clamp(2.05rem, 8.8vw, 2.55rem)`

Exact values may be adjusted after visual inspection, but the title must not dominate the entire initial viewport.

### Section titles

- visibly smaller than hero title
- generally 2 lines maximum
- use editorial hierarchy rather than oversized display typography

## 13. Spacing

Use whitespace as a primary design tool.

Target mobile values:

- major section vertical padding: `64–76px`
- heading to intro: `12–18px`
- intro to first item: `28–36px`
- between major opportunity stories: `48–64px`

Do not compress spacing simply to fit more content above the fold.

## 14. Images

Mobile images should be cropped independently from desktop where needed.

Requirements:

- preserve focal subject
- avoid landscape crops that become unreadable on narrow screens
- opportunity imagery should remain sector-specific
- hero image should reinforce Japan business/investment context, not a single project
- avoid decorative duplicate images inside adjacent sections

## 15. Language-Specific Layout Review

Each language must be reviewed independently at mobile widths.

### English

Check:

- orphan words
- excessive three-to-four-word line fragments
- long CTA labels

### Chinese

Check:

- headline line length
- punctuation at line starts
- unnecessary repetition such as repeated “日本” or “机会” in adjacent lines

### Japanese

Check:

- isolated particles
- awkward line breaks after `・`, `/`, or punctuation
- overly long katakana or compound noun runs

Do not assume a layout that works in English is valid in Chinese or Japanese.

## 16. Breakpoints

Primary mobile design breakpoint:

- `max-width: 760px`

Small-phone review breakpoint:

- approximately `390px` viewport width

Also inspect around:

- 430px
- 360px

The mobile header must remain stable at all three widths.

## 17. Interaction Rules

- header menu tap target must be comfortable
- language selector must not overlap menu
- hero CTAs full-width or near-full-width on mobile
- no horizontal scrolling
- no text clipped by fixed header
- anchor navigation must account for fixed header offset where necessary

## 18. Mobile Acceptance Criteria

The mobile revision is ready for implementation review when all conditions are met:

1. Header shows only VANTORA logo on left, compact language selector + menu on right.
2. Duplicate `Vantora / Powered by UPEX` header text is absent on mobile.
3. Header height is approximately 64–68px and visually uncluttered.
4. English hero headline stays within 3 lines at standard phone widths.
5. Chinese hero uses the approved two-part structure: `进入日本市场` + `获取投资、并购与战略合作机会`.
6. Japanese hero uses manually controlled natural line breaking and no isolated particles.
7. Hero CTA hierarchy is clear and at least one CTA appears in the first screen where practical.
8. Who We Help is a three-item lightweight vertical list.
9. What We Unlock is a four-item numbered vertical sequence.
10. Selected Opportunities uses one large editorial story per opportunity rather than compact cards.
11. Why Vantora is reduced to four core reasons.
12. Selected Experience is text-led and avoids equal-height boxed-card repetition.
13. Contact ends the page with a visually distinct conversion section.
14. Body text remains approximately 15px and readable.
15. Mobile content uses substantially less repetitive card chrome and more whitespace.
16. EN / 中文 / JA layouts are manually reviewed at 360px, 390px, and 430px widths.
17. Direct email / phone contact remains usable without AI.
18. No unsupported financial, regulatory, or project claims are introduced.
19. Changes stay on `ai-sales-redesign`; `top` remains unchanged until explicit approval.
