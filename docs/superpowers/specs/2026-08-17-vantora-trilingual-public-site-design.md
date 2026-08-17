# Vantora Trilingual Public Site Design

Date: 2026-08-17
Branch: `ai-sales-redesign`
Status: Design approved in conversation; written-spec review pending

## 1. Goal

Rebuild the Vantora public website as a trilingual boutique cross-border advisory site for international investors, companies, buyers, sellers and strategic partners engaging with Japan.

The public website must position Vantora around one primary message:

> Cross-border M&A at the core, with strategic investment and Japan-side execution around it.

The site must not feel like a generic investment marketplace or a broad consulting brochure. It should communicate that Vantora can help identify opportunities, engage counterparties in Japan, coordinate commercial and diligence work, and move transactions toward execution.

The public site remains separate from the internal Registry experience. The Registry is a controlled source of approved opportunity data; it is not the public website itself.

## 2. Confirmed Product Decisions

### 2.1 Site model

Use **Option B: Trilingual boutique advisory website with a dedicated Opportunities section/page**.

The public site has its own information architecture and brand narrative. The Project Registry supplies only approved, sanitized teaser records to public-facing opportunity surfaces.

### 2.2 Languages

The website supports:

- English: `/en/`
- Traditional Chinese: `/zh/`
- Japanese: `/ja/`

Language behavior:

1. On first visit to the root URL, infer an initial language from browser preferences.
2. Traditional Chinese browser preferences should prefer `/zh/`.
3. Japanese browser preferences should prefer `/ja/`.
4. All other or ambiguous language preferences default to `/en/`.
5. The header always exposes manual `EN / 中文 / 日本語` switching.
6. After a visitor manually chooses a language, persist that choice locally and honor it on subsequent visits.
7. Every language version must have its own crawlable URL for sharing and SEO.
8. Do not rely on client-side string replacement as the only source of localized page content; each language page must have valid standalone content.

### 2.3 Brand hierarchy

- **Vantora** is the public-facing cross-border advisory and transaction brand.
- **UPEX** is presented selectively as the Japan-side operating foundation.
- Do not treat Vantora and UPEX as equal co-brands in the primary navigation or hero.
- `Powered by UPEX` may appear sparingly where it strengthens trust, but Vantora remains dominant.

### 2.4 Geographic positioning

Position the business as Japan-wide, not Tokyo-only.

Tokyo may appear as a corporate or execution base and contact location, but site copy must not imply that capabilities or project sourcing are limited to Tokyo.

## 3. Positioning and Language Tone

### 3.1 English

Tone: boutique advisory / investment banking / execution-led.

Primary hero:

**Cross-Border M&A & Strategic Investment in Japan**

Body:

> We advise international investors and companies on acquisitions, strategic investments and partnerships in Japan — from target identification and local dialogue to transaction coordination and execution.

Primary CTA:

`Discuss a Japan M&A or Investment Plan`

Secondary CTA:

`Explore Our Focus Areas`

### 3.2 Traditional Chinese

Tone: direct, commercially practical, resource- and execution-oriented.

Primary hero:

**專注日本的跨境併購與戰略投資**

Body:

> 協助海外投資者與企業在日本尋找收購標的、投資機會及戰略合作方，並從前期判斷、日本側溝通到談判與交易執行，全程推進項目落地。

Primary CTA:

**討論日本併購或投資計畫**

Secondary CTA:

**了解我們的重點領域**

### 3.3 Japanese

Tone: restrained, specific, trust-oriented and execution-focused.

Primary hero:

**日本におけるクロスボーダーM&A・戦略投資**

Body:

> 海外投資家・企業による日本企業の買収、戦略投資、資本・業務提携について、候補先の探索から日本側との協議、取引調整、実行まで支援します。

Primary CTA:

**日本でのM&A・投資について相談する**

Secondary CTA:

**注力領域を見る**

### 3.4 Translation rule

The three language versions must not be literal translations.

Each version should preserve the same factual scope and brand positioning while using language natural to its audience:

- English: concise advisory terminology.
- Traditional Chinese: clearer commercial access, resources and execution language.
- Japanese: restrained wording such as `支援`, `案件探索`, `取引調整`, `実行`.

## 4. Information Architecture

Primary navigation:

1. Home
2. Capabilities
3. Experience
4. Opportunities
5. About
6. Private Discussion
7. Language switcher

Recommended route structure:

```text
/en/
/en/capabilities/
/en/experience/
/en/opportunities/
/en/opportunities/<public-slug>/
/en/about/
/en/contact/

/zh/
/zh/capabilities/
/zh/experience/
/zh/opportunities/
/zh/opportunities/<public-slug>/
/zh/about/
/zh/contact/

/ja/
/ja/capabilities/
/ja/experience/
/ja/opportunities/
/ja/opportunities/<public-slug>/
/ja/about/
/ja/contact/
```

Root `/` performs language routing only and does not become the canonical content URL.

## 5. Home Page Design

The homepage sequence is fixed as:

1. Positioning / Hero
2. Core Capabilities
3. Selected Experience
4. Selected Opportunities
5. How We Execute
6. Why Vantora
7. Private Discussion

### 5.1 Hero

Purpose: explain who Vantora is, who it serves and what it can execute within the first viewport.

The hero must not lead with generic phrases such as `Unlock Japan`, `Japan Access Platform`, or unsupported scale metrics.

Visual direction:

- Editorial, institutional, boutique-advisory feel.
- Strong typography and disciplined whitespace.
- Japan context may be suggested through place, infrastructure, industry or business imagery, but avoid a generic tourism aesthetic.
- Mobile hero must remain concise and readable without oversized headline wrapping.

### 5.2 Core Capabilities

Do not use `Who We Help` as the main second section.

Show six business pillars:

1. Cross-Border M&A
2. Energy & Infrastructure
3. AI Data Center & Digital Infrastructure
4. Commercial & Industrial Real Estate
5. Special & Real Assets
6. Japan Market Entry & Strategic Partnerships

Cross-Border M&A is visually and narratively primary.

### 5.3 Selected Experience

Show three to four anonymized engagement examples on the homepage.

Recommended examples:

- Japan Corporate Acquisition
- Utility-Scale BESS Investment
- AI Data Center Development
- Cross-Border Real Asset Transaction

Each teaser shows:

- Sector / engagement type
- Situation or mandate context
- Vantora role
- Execution scope

Do not show client names, transaction values, exclusivity statements or success claims unless verified and approved for publication.

### 5.4 Selected Opportunities

Homepage shows up to four curated opportunities from the sanitized public Project Registry feed.

Examples of category labels:

- Cross-Border M&A
- Energy Infrastructure
- Digital Infrastructure
- Commercial & Industrial Real Estate
- Special & Real Assets

The section CTA is `View Selected Opportunities` or the appropriate localized equivalent.

### 5.5 How We Execute

Use a five-stage execution model:

1. **Identify** — target / opportunity sourcing
2. **Evaluate** — commercial and financial screening
3. **Engage** — Japan-side dialogue and stakeholder coordination
4. **Structure** — transaction framework and negotiation support
5. **Execute** — diligence coordination and transaction execution

Primary message:

> From opportunity identification to Japan-side execution.

The section should reinforce an execution-led advisory model rather than pure information provision.

### 5.6 Why Vantora

Limit the section to three concrete reasons:

1. **Japan-side access** — practical local dialogue and transaction progress.
2. **Cross-border transaction perspective** — ability to understand international investor requirements and Japanese-side communication.
3. **Execution-led advisory** — work oriented toward moving a transaction or partnership forward.

Do not use unsupported claims such as `exclusive network`, `unmatched access`, `guaranteed outcomes` or invented track-record metrics.

### 5.7 Private Discussion

Headline direction:

**What are you looking to do in Japan?**

Four pathways:

- Acquire or Invest
- Sell a Business or Asset
- Find a Strategic Partner
- Submit an Opportunity

The contact experience should branch based on user intent rather than show one generic form.

## 6. Capabilities Page

The Capabilities page uses six pillars.

### 6.1 Cross-Border M&A

Core scope:

- Buy-side advisory support
- Sell-side support
- Acquisition target sourcing and screening
- Business succession opportunities
- Strategic investment
- Initial financial and commercial evaluation
- NDA / information-sharing coordination
- LOI process support
- Diligence coordination
- Negotiation and transaction execution support
- PMI support may be referenced only when relevant and supported

Message direction:

> From target identification to transaction execution in Japan.

### 6.2 Energy & Infrastructure

Scope:

- BESS
- Solar / renewable assets
- Power and related infrastructure projects
- Project screening
- Commercial and financial diligence support
- Financial model review
- Local stakeholder coordination
- Transaction support

### 6.3 AI Data Center & Digital Infrastructure

Scope:

- AI data center projects and sites
- Land and site assessment coordination
- Power availability / grid-related coordination
- Development condition review
- Partner, operator and investor coordination
- Japan-side project access and execution coordination

Do not imply Vantora itself is a utility, operator, developer or licensed engineering provider unless separately verified.

### 6.4 Commercial & Industrial Real Estate

Scope:

- Land
- Industrial land
- Logistics / warehouse facilities
- Factories / industrial properties
- Commercial / income-producing real estate

Safe public terminology:

- sourcing
- opportunity screening
- buyer / seller coordination
- transaction coordination
- local execution support

Do not use `brokerage`, `broker`, or Japanese `仲介` as a default public claim until the relevant operating and licensing arrangement is confirmed.

### 6.5 Special & Real Assets

Scope:

- Maritime / vessel opportunities
- Aviation / aircraft opportunities
- Other selected non-standard real assets
- Cross-border sourcing
- Commercial review
- Document coordination
- Buyer / seller dialogue
- Transaction coordination

Do not expose ship names, IMO numbers, aircraft registrations, serial numbers or other confidential identifiers without explicit approval.

### 6.6 Japan Market Entry & Strategic Partnerships

Scope:

- Japan market entry
- Strategic partner sourcing
- JV opportunities
- Capital / business alliances
- Distribution and channel development
- Commercial negotiation support
- Japan-side business coordination

## 7. Experience Page

Purpose: prove execution capability without overclaiming.

Use a structured engagement format rather than a logo wall.

Recommended record format:

```text
Sector
Situation
Our Role
Execution Scope
Outcome / Current Stage
```

Primary examples:

1. Japan Corporate Acquisition
2. Utility-Scale BESS Investment
3. AI Data Center Development
4. Cross-Border Real Asset Transaction

Secondary examples may include:

- Solar / renewable asset transaction
- Industrial land / logistics / factory opportunity
- Japan strategic partnership / JV
- Maritime / aviation asset transaction

Publication rules:

- Client name only with permission.
- Transaction value only with verified source and approval.
- Never convert `advisory participation` into `completed acquisition` unless the transaction was actually completed and Vantora's role is documented.
- For live work, use `Ongoing`, `Under Review`, `Confidential`, or another accurate status.
- Do not invent outcomes to make a case appear finished.

## 8. Opportunities Page

### 8.1 Product role

The page is a curated advisory opportunity surface, not an open marketplace.

Recommended headline direction:

**Selected Opportunities**

Supporting line:

> Curated Japan and cross-border opportunities available for qualified counterparties.

### 8.2 Category filters

Public filters may include:

- M&A
- Energy
- Data Center
- Real Estate
- Maritime
- Aviation
- Strategic Partnership

The exact public label can be broader than the internal Registry code, but mappings must be deterministic.

### 8.3 Public data source

Only Registry records meeting all public eligibility conditions are returned:

- Project workflow status is `Approved`
- `publicVisible = true`
- Public teaser content exists
- Record passes sanitizer rules

The website must never directly query or expose raw internal project records.

### 8.4 Public project card fields

Allowed card fields:

- Public title
- Public category label
- Public region / generalized location
- Transaction type
- Price mode / sanitized value display
- Public teaser summary
- Approved public highlights
- Explicitly approved public image(s)

### 8.5 Price display

Respect Registry price display mode:

- `Hidden` → display `Price on Request` or localized equivalent
- `Range` → display approved range and currency
- `Exact` → display approved exact value and currency

Never derive a public price from internal notes or private indicative values when display mode is Hidden.

### 8.6 Public project detail page

The detail page may show expanded teaser information but remains sanitized.

It must never include, unless specifically approved by an internal workflow:

- Seller / owner identity
- Source / introducer
- Internal project name
- Internal owner
- Internal notes
- Exact private address
- Seller mandate or authorization documents
- Private financial / technical / legal files
- Ship name or IMO number
- Aircraft registration or serial / MSN
- Other confidential identifiers stored in category detail JSON

### 8.7 Request flow

CTA:

`Request Project Details` / `Request Private Information` and localized equivalents.

Intended future sequence:

```text
Inquiry
→ Qualification
→ Internal Review
→ NDA
→ Private Information Access
```

Phase-1 public-site implementation may submit the inquiry into the existing lead intake infrastructure. Investor Registry / Match records are introduced only when their later phase is implemented.

## 9. About Page

Brand relationship direction:

English:

> Vantora is the cross-border advisory and transaction brand developed on UPEX’s Japan-side business foundation.

Traditional Chinese:

> Vantora 是基於 UPEX 日本本地業務與執行能力建立的跨境併購及戰略投資品牌。

Japanese:

> Vantoraは、UPEXの日本国内における事業基盤を活用し、クロスボーダーM&A・戦略投資・事業提携を支援するアドバイザリーブランドです。

The page focuses on:

1. Cross-border perspective
2. Japan-side execution
3. Transaction-led approach

UPEX is introduced in a secondary section such as `Japan-side Operating Foundation`, not as a competing main brand.

Do not publish unsupported regulatory, licensing, certification, AUM, transaction-volume or mandate claims.

## 10. Contact / Private Discussion Page

Purpose: convert visitor intent into qualified conversations.

Four entry paths:

### 10.1 Acquire or Invest in Japan

Fields:

- Organization
- Contact name
- Email
- Country / region
- Target sector / asset category
- Target investment size
- Preferred geography
- Transaction preference
- Message

### 10.2 Sell a Business or Asset

Fields:

- Organization / owner
- Contact name
- Email
- Asset / company type
- Japan region
- Indicative size / value optional
- Desired transaction type
- Confidential message

### 10.3 Find a Strategic Partner in Japan

Fields:

- Organization
- Contact name
- Email
- Sector
- Partnership objective
- Desired partner profile
- Japan market objective
- Message

### 10.4 Submit an Opportunity

Fields should align with future controlled Project Registry submission intake:

- Submitter / organization
- Contact
- Primary opportunity category
- Region
- Transaction type
- Short description
- Indicative value optional
- Relationship to owner / seller
- Authorization status
- File upload only when a secure submission path exists

Until external partner submission is implemented, this path may route to a secure lead form rather than writing directly to the Registry.

## 11. Project Registry Integration

### 11.1 Separation principle

Maintain one core data source with separate trust boundaries:

- Internal Registry: confidential source of truth
- Public API / projection: sanitized approved records
- Public website: read-only consumer of sanitized records

The public website never receives raw Registry objects.

### 11.2 Public API contract

The current Registry public projection should remain limited to fields intentionally designed for public use.

The public-site implementation may add:

- deterministic localized category labels
- public slugs
- localized teaser fields, if later stored explicitly
- pagination / filtering parameters

Any API extension must preserve a whitelist model: new internal fields are private by default until explicitly mapped into the public projection.

### 11.3 Localization of opportunities

V1 approach:

- Store source public teaser fields in one approved language if only one version exists.
- Public site may initially use curated static translations for selected opportunities during editorial review.
- Do not auto-publish machine translations of confidential or newly approved projects without review.

Preferred long-term Registry extension:

- `public_title_en`, `public_title_zh`, `public_title_ja`
- `public_teaser_en`, `public_teaser_zh`, `public_teaser_ja`
- localized approved highlights

Those fields belong in a later Registry schema change rather than being silently invented in the public frontend.

## 12. Visual Design Direction

### 12.1 Character

Target impression:

> Boutique cross-border advisory with privileged Japan access and the ability to execute locally.

The visual language should feel:

- institutional
- discreet
- editorial
- high-trust
- transaction-oriented
- Japan-connected without tourism clichés

### 12.2 Existing visual system

The current navy / ivory / restrained gold direction may be retained as a foundation if it supports readability and sophistication.

The redesign should reduce repeated generic card grids and create stronger editorial hierarchy through:

- asymmetric layouts where useful
- clear type scale
- strong section rhythm
- fewer but more meaningful visual modules
- large, disciplined imagery
- restrained motion

### 12.3 Mobile

Mobile is a first-class requirement.

Rules:

- No horizontal scrolling.
- Header language switch remains accessible.
- Primary CTA visible without excessive scrolling.
- Hero headline must not become a wall of text.
- Opportunity cards become stacked and touch-friendly.
- Forms use a single-column layout.
- Core navigation remains usable with one-handed interaction.

## 13. SEO and Metadata

Each language route needs:

- unique page title
- localized meta description
- canonical URL
- `hreflang` for English, Traditional Chinese and Japanese counterparts
- Open Graph title / description
- meaningful page heading hierarchy

Root routing should not create duplicate canonical content.

Opportunity detail pages should only be indexable if the underlying opportunity is intended for public discovery. A future `noindex` control may be added for semi-private teaser links.

## 14. Safety, Compliance and Truthfulness

Public copy must not claim or imply:

- guaranteed returns
- guaranteed deal completion
- AUM or transaction volume without verification
- exclusive mandates unless documented and approved
- regulatory status or licenses that are not confirmed
- current live availability without Registry approval
- confidential counterparty identities
- exact live project details beyond approved teaser scope

Use cautious terminology around regulated activities in Japan.

Prefer:

- strategic advisory
- transaction support
- sourcing
- opportunity screening
- market access
- Japan-side coordination
- execution support

Avoid default use of:

- investment management
- securities placement
- capital raising agent
- broker / brokerage
- real-estate 仲介

unless the relevant legal / operating structure is verified.

## 15. Error and Empty States

### 15.1 Language routing

If browser-language detection fails, route to English.

If persisted language value is invalid, discard it and route to English.

### 15.2 Opportunities feed unavailable

If the sanitized opportunities API is unavailable:

- The rest of the site must continue to render.
- The homepage opportunity section shows a restrained fallback such as `Selected opportunities are available through private discussion.`
- The Opportunities page shows a non-technical service-unavailable state and a Private Discussion CTA.
- Never fall back to embedded raw internal project data.

### 15.3 No public opportunities

Show an intentional empty state rather than fake or stale inventory.

Do not keep old opportunities visible after `publicVisible` is revoked or the project is archived.

### 15.4 Contact submission failure

Preserve the visitor's entered values where feasible, show a clear retry message and provide a direct contact alternative already approved for public use.

## 16. Analytics and Privacy

If analytics are present, measure only business-relevant events such as:

- language selection
- capability-page visit
- opportunity view
- opportunity-detail request
- contact pathway selection
- form submission success

Do not send confidential form contents, project identifiers beyond public IDs/slugs, NDA content or private document metadata into analytics tools.

## 17. Testing Requirements

### 17.1 Routing and localization

Tests must cover:

- root browser-language routing
- persisted manual language choice
- manual language switching
- valid `/en/`, `/zh/`, `/ja/` content
- invalid language fallback
- canonical and `hreflang` output

### 17.2 Content integrity

Automated contract tests should confirm:

- all three language versions expose the required navigation and CTA structure
- required home sections exist in the approved order
- M&A remains the primary capability
- prohibited generic or unsupported claims are not introduced in critical hero / trust sections

### 17.3 Opportunity safety

Tests must verify:

- only sanitized public API fields are rendered
- hidden prices do not leak internal values
- archived or non-public projects disappear from public views
- private identifiers never render even if present in raw test fixtures
- approved public images only

### 17.4 Responsive UI

Verify at minimum:

- 375px mobile
- 768px tablet
- 1024px desktop
- 1440px desktop

Check navigation, hero wrapping, opportunity cards, forms, footer and language selector.

### 17.5 Existing behavior

Existing lead / AI functionality must not regress unless explicitly redesigned in the implementation plan.

## 18. Implementation Boundaries

This public-site project includes:

- trilingual route architecture
- home redesign
- Capabilities page
- Experience page
- Opportunities listing and sanitized detail surface
- About page
- Private Discussion / contact routing
- browser-language detection and remembered language preference
- SEO metadata and `hreflang`
- integration with the sanitized Registry public feed
- mobile and accessibility work
- tests and preview deployment

This project does **not** include:

- real Investor / Buyer Registry implementation
- mandate management
- project-investor matching
- deal pipeline
- automated NDA execution
- private Deal Room
- automatic external-partner Registry submission
- production release / merge without explicit approval

## 19. Delivery Sequence

Recommended implementation sequence:

1. Trilingual routing and shared layout foundation
2. Localized content system and language persistence
3. Home page redesign
4. Capabilities page
5. Experience page
6. Opportunities listing + Registry sanitized API integration
7. Opportunity detail / request flow
8. About page
9. Private Discussion pathways
10. SEO / accessibility / analytics-safe events
11. Responsive verification and content-safety tests
12. Isolated preview deployment
13. User visual review
14. Production integration only after explicit approval

## 20. Acceptance Criteria

The design is successful when:

1. A first-time visitor can understand within the hero that Vantora focuses on cross-border M&A and strategic investment in Japan.
2. The public site clearly distinguishes advisory/execution services from an open marketplace.
3. English, Traditional Chinese and Japanese versions feel native to their audiences rather than mechanically translated.
4. M&A is the strongest positioning axis, with infrastructure, real assets, real estate and strategic partnerships presented as extensions.
5. The public Opportunities experience displays only approved sanitized Registry data.
6. No confidential Registry fields can be exposed through the public UI or frontend data objects.
7. Mobile navigation, language switching and primary CTAs are usable on small screens.
8. No unsupported transaction metrics, client claims, licensing claims or live-project facts are introduced.
9. The site can continue rendering gracefully if the Opportunities API is unavailable.
10. Production remains untouched until a separate explicit approval to integrate / release.
