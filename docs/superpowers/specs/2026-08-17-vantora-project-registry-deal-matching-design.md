# Vantora Project Registry & Deal Matching Design Specification

Date: 2026-08-17
Branch: `ai-sales-redesign`
Status: User-confirmed design; implementation planning pending

## 1. Goal

Build a controlled Vantora deal platform around a **single source of truth** for projects and investors, with two clearly separated experiences:

1. **Internal / partner workspace** for project intake, review, investor mandates, matching and deal progress.
2. **Public Vantora website** that only exposes approved, sanitized teaser data.

The product must support real cross-border advisory work without turning the public site into an open marketplace.

## 2. Approved Product Direction

Approved architecture: **one database, separate front-end and back-office experiences**.

The public website and internal registry use the same underlying project records, but public visibility is controlled field-by-field and project-by-project.

External partners may submit projects, but cannot publish them directly. Every external submission enters a review queue and requires internal approval.

## 3. Business Positioning

Vantora remains primarily positioned around:

- Cross-Border M&A
- Strategic Investment in Japan
- Energy & Infrastructure
- AI Data Center & Digital Infrastructure
- Special & Real Assets
- Commercial & Industrial Real Estate
- Japan Market Entry & Strategic Partnerships

M&A remains the primary advisory identity. Special assets and real assets expand the opportunity set without replacing the core positioning.

## 4. Project Categories and IDs

Each project has exactly one **Primary Category** plus zero or more **Secondary Tags**.

Primary categories and project ID prefixes:

- `MA` — Cross-Border M&A
- `BESS` — Battery Energy Storage System
- `SOLAR` — Solar Power Plant
- `SHIP` — Maritime / Vessel
- `AIR` — Aircraft
- `DC` — Data Center
- `CRE` — Commercial & Industrial Real Estate
- `STRAT` — Strategic Partnership / Market Entry

Optional secondary tags may include `LAND`, `LOGISTICS`, `FACTORY`, `HOTEL`, `RENEWABLE`, `AVIATION`, `MARITIME`, `ENERGY`, and other controlled tags.

ID format:

`VAN-{CATEGORY}-{YYYY}-{SEQUENCE}`

Examples:

- `VAN-MA-2026-001`
- `VAN-SHIP-2026-001`
- `VAN-AIR-2026-001`
- `VAN-SOLAR-2026-001`
- `VAN-DC-2026-001`

Sequence is generated automatically and is unique within category and year.

## 5. Project Registry — Common Fields

All projects share these fields:

### Identity

- Project ID
- Internal project name
- Public / teaser title
- Primary category
- Secondary tags
- Country
- Region / prefecture / market
- Internal owner
- Source / introducer
- Date created
- Date updated

### Transaction

- Transaction type
- Current project stage
- Indicative value / asking price
- Currency
- Price display mode: `Hidden`, `Range`, `Exact`
- Price range minimum / maximum when applicable
- Seller / project owner
- Authorization status
- Authorization evidence / document reference

### Visibility and Confidentiality

- Confidentiality level: `Internal Only`, `Teaser`, `NDA Access`
- Public visibility toggle
- Public teaser summary
- Public highlights
- Public location granularity
- Public price treatment
- Internal notes

### Files

- Teaser
- IM / project memorandum
- Financial material
- Technical material
- Legal / ownership material
- Authorization material
- Images
- Other supporting documents

Files are internal by default. No file becomes public merely because a project is publicly visible.

## 6. Project Workflow

Project lifecycle states:

- `Draft`
- `Submitted`
- `Approved`
- `Archived`

External partner submissions always enter `Submitted`.

Only internal authorized users may change a project to `Approved`, change public visibility, or select public fields.

`Archived` preserves history and matching records but removes the project from active workflows.

## 7. Category-Specific Fields

### 7.1 M&A

- Industry / sub-industry
- Revenue range
- EBITDA / operating profit range
- Employee range
- Ownership / shareholder summary
- Sale type: full sale / partial sale / business transfer / capital alliance
- Seller motivation
- Valuation expectation
- Desired buyer profile
- Financial years available
- NDA status / availability
- IM availability
- DD readiness
- Key risks / issues
- PMI support required

### 7.2 BESS

- Site location
- Rated power (MW)
- Storage capacity (MWh)
- Duration
- Grid connection status
- Interconnection capacity
- Land status
- EPC status
- Equipment / battery supplier
- COD / target COD
- Revenue model
- Aggregator / market participation status
- Capex estimate
- Financing status
- Permits / approvals
- Technical DD status
- Commercial DD status

### 7.3 Solar

- Site location
- Capacity (MW / MWp)
- FIT / FIP / merchant structure
- FIT / FIP price when applicable
- Remaining support period
- COD / target COD
- Land ownership / lease status
- Grid connection status
- EPC / O&M provider
- Annual generation estimate
- Historical generation when operating
- Capex / asking price
- Debt / financing status
- Permits and environmental status
- Co-located BESS tag / configuration

### 7.4 Ship

- Vessel type
- Vessel name (internal)
- IMO number (internal)
- Flag
- Build year
- Shipyard
- Classification society
- Deadweight / gross tonnage / capacity as relevant
- Main engine / propulsion summary
- Current location
- Trading / charter status
- Inspection / survey status
- Asking price
- Seller mandate status
- Delivery window
- Technical documents available

### 7.5 Aircraft

- Aircraft type / model
- Manufacturer
- Serial number / registration (internal)
- Build year
- Configuration
- Engine model
- Engine status
- Flight hours
- Flight cycles
- Maintenance status
- Airworthiness / records status
- Current location
- Ownership / lessor status
- Lease status when applicable
- Asking price
- Delivery availability
- Technical records available

### 7.6 Data Center

- Project location
- Project type: land / powered land / shell / operating DC / development
- Site area
- IT load target (MW)
- Power secured / requested (MW)
- Grid / utility status
- Voltage / substation information
- Fiber / connectivity status
- Water / cooling considerations
- Zoning / land-use status
- Land ownership / lease status
- Development permits
- Target COD
- Capex estimate
- Operator / tenant status
- Renewable / BESS integration tags

### 7.7 Commercial & Industrial Real Estate

This category covers business land, industrial land, logistics facilities, factories, income-producing commercial assets and similar transaction-oriented real estate.

Fields:

- Property type
- Address / location
- Land area
- Building area
- Zoning
- Building coverage ratio
- Floor area ratio
- Current use
- Occupancy / tenancy
- NOI / rent roll when income-producing
- Yield when applicable
- Asking price
- Ownership status
- Road access
- Utilities
- Industrial / logistics suitability
- Development potential
- Environmental / contamination information when available
- Brokerage / seller mandate status

### 7.8 Strategic Partnership / Market Entry

- Company / project profile
- Target market
- Partnership objective
- Desired partner type
- Transaction / cooperation structure
- Capital participation required or not
- Distribution / sales objective
- JV objective
- Technology / licensing objective
- Geographic scope
- Commercial requirements
- Current stage
- Internal relationship owner

## 8. Investor / Buyer Registry

The investor registry separates **Organization** from **Mandate**.

One organization may have multiple mandates representing different funds, teams, strategies or investment programs.

### Organization

- Organization name
- Organization type
- Headquarters country
- Website
- Relationship owner
- Relationship source
- Relationship status
- Internal notes

### Contacts

- Contact name
- Title
- Email
- Phone
- Location
- Preferred language
- Relationship notes
- Last contact date

### Mandate / Investment Profile

- Mandate name
- Linked organization
- Internal owner
- Active / inactive status
- Asset categories
- Secondary interest tags
- Geography preference
- Japan accepted: yes / no
- Minimum ticket size
- Maximum ticket size
- Currency
- Transaction type preference
- Equity / debt / JV / acquisition preference
- Control / minority preference where relevant
- Return / strategy notes only when explicitly supplied by the investor
- Exclusion criteria
- NDA status
- Source of mandate information
- Last verified date

## 9. Matching Engine — V1

Approved model: **system recommendation + human approval**.

The system must never automatically send a project to an investor.

V1 matching uses explicit deterministic criteria rather than opaque AI scoring.

Core criteria:

1. Primary asset category compatibility
2. Secondary tag compatibility
3. Geography compatibility
4. Ticket-size overlap
5. Transaction-type compatibility
6. Explicit mandate exclusions

Recommendation labels:

- `Strong Match`
- `Potential Match`
- `Weak Match`
- `Excluded`

Each recommendation must show a human-readable explanation, for example:

`Strong Match — Ship / Asia / USD 20–50M ticket range`

or

`Potential Match — BESS / Japan / project value above preferred ticket range`

No investor receives a project until an internal user confirms the match.

## 10. Match / Deal Record

A Project is not the same thing as a Deal.

One project may be matched to many mandates. Each project–mandate relationship creates its own match / deal record.

Required fields:

- Match ID
- Project ID
- Mandate ID
- Match score / label
- Match explanation
- Recommended date
- Approved by
- Approved date
- Current pipeline stage
- Last activity date
- Next action
- Internal notes

## 11. Deal Pipeline

Approved pipeline:

`Recommended → Approved → Introduced → Interested → NDA → Due Diligence / Review → Negotiation → Closed / Passed`

Rules:

- `Recommended` may be system-generated.
- `Approved` requires internal human action.
- `Introduced` means the opportunity has actually been presented to the investor / buyer.
- `Interested` means positive interest has been confirmed.
- `NDA` means confidentiality documentation is in process or completed.
- `Due Diligence / Review` covers financial, commercial, technical or asset review depending on category.
- `Negotiation` means material commercial / transaction terms are being discussed.
- `Closed` is successful completion.
- `Passed` records a declined or stopped opportunity without deleting history.

## 12. Public Website Integration

The public Vantora website must never query or display unrestricted internal project fields.

Public project cards / pages may only use a dedicated sanitized view containing approved fields such as:

- Public title
- Category
- Broad region
- Transaction type
- Price according to selected display mode
- Public teaser summary
- Approved highlights
- Approved image(s)
- CTA

Sensitive examples that stay internal by default:

- Seller identity
- Exact M&A target identity
- Exact vessel identity / IMO
- Aircraft serial / registration
- Confidential land address
- Counterparty identity
- Internal valuation notes
- Authorization documents
- DD files
- Investor matching information

Public CTA:

`Request Details` / localized equivalent.

Public inquiry does not automatically grant access to NDA material.

## 13. External Partner Submission

Approved access model: internal users plus controlled external project submission.

External submitters may provide:

- Submitter identity and company
- Relationship to seller / project owner
- Project category
- Core project information
- Indicative price / value
- Authorization status
- Supporting files
- Confidentiality preference

Submission rules:

- Submission creates a `Submitted` project only.
- External users cannot assign final project IDs manually.
- External users cannot mark projects public.
- External users cannot see investor / buyer records.
- External users cannot see matching recommendations.
- Internal review is required before project approval.

## 14. Permissions

V1 roles:

### Admin

- Full project, investor, mandate, matching and visibility control
- Approves external submissions
- Controls public publishing
- Manages users / permissions

### Internal Advisor

- Creates and edits projects
- Creates organizations, contacts and mandates
- Reviews recommendations
- Advances pipeline
- Cannot change system-level permissions unless separately granted

### External Partner

- Submits projects
- Sees only own submission status and permitted feedback
- Cannot access internal registry, investors, mandates or matches

### Public Visitor

- Sees approved public site content only
- May submit an inquiry / request details

## 15. Security and Confidentiality Requirements

- Internal fields are private by default.
- Public publishing requires explicit approval.
- External submissions never become public automatically.
- Document access is permission-controlled.
- Sensitive deal data must not be exposed in client-side source or public APIs.
- Public teaser data must come from a deliberately sanitized data object / view.
- Audit-relevant actions should record actor and timestamp: approval, publishing, pipeline changes and visibility changes.
- No automatic investor outreach in V1.

## 16. Homepage / Market Language Impact

The new homepage structure should reflect real capability rather than an open opportunity marketplace.

Recommended capability architecture:

1. Cross-Border M&A
2. Energy & Infrastructure — including BESS and Solar
3. AI Data Center & Digital Infrastructure
4. Special & Real Assets — including Ship and Aircraft
5. Commercial & Industrial Real Estate
6. Japan Market Entry & Strategic Partnerships

Public project examples are labeled as selected / current focus opportunities rather than implying unrestricted inventory or guaranteed availability.

## 17. V1 Scope Boundary

V1 includes:

- Internal project registry
- Controlled external project submission
- Project approval workflow
- Eight project categories with category-specific fields
- Organization and contact registry
- Multiple mandates per organization
- Minimum / maximum investment ticket size
- Deterministic matching recommendation
- Human match approval
- Deal pipeline tracking
- Public sanitized teaser integration
- Role-based access

V1 explicitly excludes:

- Automatic email distribution
- Automatic investor outreach
- Investor self-service login portal
- Online transaction execution
- E-signature workflow
- Full virtual data room
- Automated NDA execution
- Automated valuation
- AI-generated investment recommendations
- Payments / billing

These may be evaluated in later phases only after the registry and matching workflow are stable.

## 18. Implementation Decomposition

Because the approved concept spans multiple subsystems, implementation should be split into independently testable phases rather than one large release:

### Phase 1 — Data Foundation and Internal Project Registry

Project schema, IDs, category-specific fields, visibility model and internal project CRUD.

### Phase 2 — Investor / Buyer Registry and Mandates

Organizations, contacts, multiple mandates and ticket-size / preference data.

### Phase 3 — Matching and Deal Pipeline

Deterministic recommendation, human approval and per-project/per-mandate pipeline tracking.

### Phase 4 — External Partner Submission

Controlled intake and review queue.

### Phase 5 — Public Website Integration

Sanitized selected-opportunity output and revised homepage capability language.

Each phase must produce usable, testable software without exposing unfinished internal functionality publicly.

## 19. Success Criteria

The first usable release is successful when an internal advisor can:

1. Register a real project in the correct category.
2. Store sensitive data without exposing it publicly.
3. Create an investor organization with multiple mandates.
4. Record minimum and maximum investment amounts.
5. Generate explainable candidate matches.
6. Approve selected matches manually.
7. Track each project–mandate relationship independently through the approved pipeline.
8. Publish only deliberately sanitized project teaser information to the website.
9. Accept an external partner submission without giving that partner access to internal investor or deal data.

## 20. Design Principles

- **Confidential by default.**
- **One source of truth; multiple controlled views.**
- **Project is not Deal.**
- **Organization is not Mandate.**
- **Recommendations do not equal outreach.**
- **Human approval remains in the transaction loop.**
- **Structured data first; automation second.**
- **Do not build a public marketplace in V1.**
