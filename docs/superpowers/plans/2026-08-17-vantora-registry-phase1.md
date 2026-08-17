# Vantora Project Registry Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a secure internal Project Registry that can create, edit, approve, archive and sanitize Vantora projects across the eight approved categories without exposing confidential fields publicly.

**Architecture:** Extend the existing Cloudflare Worker rather than introducing a second backend. Add a D1 registry database for structured project data, an R2 bucket for private project documents, and dedicated `/v1/admin/projects` plus `/v1/public/projects` routes. The admin UI is a separate static workspace under `/registry/`; public website integration is limited to a sanitized read model so confidential fields never reach public responses.

**Tech Stack:** Existing static HTML/CSS/JavaScript site, Cloudflare Workers, TypeScript, D1, R2, Vitest, Wrangler 4.x, Cloudflare Access JWT validation using Web Crypto and Access JWKS.

## Global Constraints

- Work only on branch `registry-phase1`; do not merge or deploy to production without explicit user approval.
- Primary project categories are exactly `MA`, `BESS`, `SOLAR`, `SHIP`, `AIR`, `DC`, `CRE`, `STRAT`.
- Every project has exactly one primary category and zero or more controlled secondary tags.
- Project IDs use `VAN-{CATEGORY}-{YYYY}-{SEQUENCE}` and are generated server-side.
- Project lifecycle states are exactly `Draft`, `Submitted`, `Approved`, `Archived`.
- Confidentiality levels are exactly `Internal Only`, `Teaser`, `NDA Access`.
- Price display modes are exactly `Hidden`, `Range`, `Exact`.
- Internal fields are private by default; public publishing requires explicit approval.
- Public APIs may return only the deliberately sanitized public-project shape.
- External submission, investor registry, matching and deal pipeline are not implemented in Phase 1.
- Existing `/v1/chat`, `/v1/leads`, `/health` behavior must remain backward compatible.

---

## File Structure

Create or modify these focused units:

- `worker/migrations/0001_project_registry.sql` — D1 schema and indexes.
- `worker/src/registry/model.ts` — domain types and enums for projects.
- `worker/src/registry/validation.ts` — request parsing and category-specific validation.
- `worker/src/registry/ids.ts` — atomic project-ID allocation.
- `worker/src/registry/repository.ts` — D1 CRUD and audit persistence.
- `worker/src/registry/public-view.ts` — sanitized public projection only.
- `worker/src/registry/auth.ts` — Cloudflare Access JWT verification and role mapping.
- `worker/src/registry/routes.ts` — admin/public registry HTTP routing.
- `worker/src/index.ts` — delegate registry routes while preserving existing routes.
- `worker/src/env.ts` — shared runtime bindings and registry-specific environment types.
- `worker/wrangler.jsonc` — D1/R2 bindings and Access configuration variables.
- `worker/test/registry/*.test.ts` — unit and Worker-route tests.
- `registry/index.html` — internal project list/editor shell.
- `registry/app.js` — admin UI state, API calls and category-specific forms.
- `registry/styles.css` — registry-only layout and responsive styles.
- `.github/workflows/ai-sales-ci.yml` — include registry tests/typecheck without changing production deploy behavior.

---

### Task 1: Add the D1 registry schema and domain model

**Files:**
- Create: `worker/migrations/0001_project_registry.sql`
- Create: `worker/src/registry/model.ts`
- Test: `worker/test/registry/model.test.ts`

**Interfaces:**
- Produces: `ProjectCategory`, `ProjectStatus`, `ConfidentialityLevel`, `PriceDisplayMode`, `ProjectRecord`, `ProjectInput`, `PublicProject`.
- Produces D1 tables: `project_sequences`, `projects`, `project_tags`, `project_files`, `project_audit`.

- [ ] **Step 1: Write the failing model test**

```ts
import { describe, expect, it } from "vitest";
import { PROJECT_CATEGORIES, isProjectCategory } from "../../src/registry/model";

describe("project registry model", () => {
  it("accepts exactly the eight approved primary categories", () => {
    expect(PROJECT_CATEGORIES).toEqual(["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"]);
    expect(isProjectCategory("SHIP")).toBe(true);
    expect(isProjectCategory("LAND")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `cd worker && npm test -- registry/model.test.ts`

Expected: FAIL because `src/registry/model.ts` does not exist.

- [ ] **Step 3: Implement the model constants and types**

```ts
export const PROJECT_CATEGORIES = ["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export const PROJECT_STATUSES = ["Draft", "Submitted", "Approved", "Archived"] as const;
export const CONFIDENTIALITY_LEVELS = ["Internal Only", "Teaser", "NDA Access"] as const;
export const PRICE_DISPLAY_MODES = ["Hidden", "Range", "Exact"] as const;

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return typeof value === "string" && PROJECT_CATEGORIES.includes(value as ProjectCategory);
}
```

Define `ProjectInput` with common fields plus `details: Record<string, unknown>`; define `ProjectRecord` by adding server-owned ID/status/audit timestamps; define `PublicProject` with public title, category, broad region, transaction type, approved price display, teaser, highlights and approved image keys only.

- [ ] **Step 4: Add the D1 schema**

Use normalized tables for server-owned identity/visibility/audit fields and JSON for category-specific `details_json` so categories can evolve without destructive migrations:

```sql
CREATE TABLE project_sequences (
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_value INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (category, year)
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  internal_name TEXT NOT NULL,
  public_title TEXT,
  primary_category TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  transaction_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  indicative_value REAL,
  currency TEXT,
  price_display_mode TEXT NOT NULL DEFAULT 'Hidden',
  price_min REAL,
  price_max REAL,
  seller_owner TEXT,
  source_introducer TEXT,
  authorization_status TEXT,
  confidentiality_level TEXT NOT NULL DEFAULT 'Internal Only',
  public_visible INTEGER NOT NULL DEFAULT 0,
  public_teaser TEXT,
  public_highlights_json TEXT NOT NULL DEFAULT '[]',
  public_location TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  internal_notes TEXT,
  internal_owner TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE project_tags (
  project_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (project_id, tag),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  public_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE project_audit (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_projects_category_status ON projects(primary_category, status);
CREATE INDEX idx_projects_public ON projects(public_visible, status);
CREATE INDEX idx_project_audit_project ON project_audit(project_id, created_at);
```

- [ ] **Step 5: Run tests**

Run: `cd worker && npm test -- registry/model.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add worker/migrations/0001_project_registry.sql worker/src/registry/model.ts worker/test/registry/model.test.ts
git commit -m "feat: add project registry data model"
```

---

### Task 2: Implement strict common and category-specific validation

**Files:**
- Create: `worker/src/registry/validation.ts`
- Test: `worker/test/registry/validation.test.ts`

**Interfaces:**
- Consumes: model constants from `model.ts`.
- Produces: `parseProjectInput(value: unknown): ProjectInput` and `parseProjectPatch(value: unknown): Partial<ProjectInput>`.

- [ ] **Step 1: Write failing validation tests** covering one valid common payload, invalid `LAND` primary category, `Exact` price without amount, and one required discriminator per category.

Example:

```ts
it("rejects SHIP details without vesselType", () => {
  expect(() => parseProjectInput({ ...base, primaryCategory: "SHIP", details: {} })).toThrow(/vesselType/);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `cd worker && npm test -- registry/validation.test.ts`

Expected: FAIL because parser is absent.

- [ ] **Step 3: Implement common validation**

Require `internalName`, `primaryCategory`, `country`, `transactionType`; constrain strings and arrays; reject unknown primary categories; require `priceMin <= priceMax` for `Range`; require `indicativeValue` for `Exact`; default private values to `Internal Only`, `Hidden`, `publicVisible=false`.

- [ ] **Step 4: Implement category validation**

Use a category switch and retain category details as JSON after validation. Minimum required discriminator fields for Phase 1:

```ts
switch (input.primaryCategory) {
  case "MA": requireDetailString(details, "industry"); break;
  case "BESS": requireDetailNumber(details, "ratedPowerMw"); break;
  case "SOLAR": requireDetailNumber(details, "capacityMw"); break;
  case "SHIP": requireDetailString(details, "vesselType"); break;
  case "AIR": requireDetailString(details, "aircraftModel"); break;
  case "DC": requireDetailString(details, "projectType"); break;
  case "CRE": requireDetailString(details, "propertyType"); break;
  case "STRAT": requireDetailString(details, "partnershipObjective"); break;
}
```

Accept all other approved category fields from the design spec when present, but do not invent values.

- [ ] **Step 5: Run tests**

Run: `cd worker && npm test -- registry/validation.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add worker/src/registry/validation.ts worker/test/registry/validation.test.ts
git commit -m "feat: validate project registry payloads"
```

---

### Task 3: Add atomic project IDs, repository CRUD and audit history

**Files:**
- Create: `worker/src/registry/ids.ts`
- Create: `worker/src/registry/repository.ts`
- Test: `worker/test/registry/repository.test.ts`

**Interfaces:**
- Produces: `allocateProjectId(db, category, year): Promise<string>`.
- Produces: `createProject`, `getProject`, `listProjects`, `updateProject`, `archiveProject`, `setProjectStatus`.
- All state-changing repository calls receive `actorEmail` and append `project_audit` rows.

- [ ] **Step 1: Write failing repository tests** using the Cloudflare Vitest D1 binding.

Test that consecutive 2026 SHIP records become `VAN-SHIP-2026-001` and `VAN-SHIP-2026-002`, and that an update writes an audit row.

- [ ] **Step 2: Run and confirm failure**

Run: `cd worker && npm test -- registry/repository.test.ts`

- [ ] **Step 3: Implement atomic ID allocation**

Use D1 `INSERT ... ON CONFLICT ... DO UPDATE SET last_value = last_value + 1 RETURNING last_value`, then format the sequence with `padStart(3, "0")`.

- [ ] **Step 4: Implement repository CRUD**

Persist common fields in columns, category details/highlights in JSON, and secondary tags in `project_tags`. Do not return file object bodies from CRUD calls.

- [ ] **Step 5: Implement immutable audit events**

Record `created`, `updated`, `status_changed`, `visibility_changed`, `archived` with actor, timestamp and minimal change metadata.

- [ ] **Step 6: Run tests**

Run: `cd worker && npm test -- registry/repository.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add worker/src/registry/ids.ts worker/src/registry/repository.ts worker/test/registry/repository.test.ts
git commit -m "feat: add project registry repository"
```

---

### Task 4: Enforce Cloudflare Access authentication and internal roles

**Files:**
- Create: `worker/src/registry/auth.ts`
- Create: `worker/src/env.ts`
- Modify: `worker/wrangler.jsonc`
- Test: `worker/test/registry/auth.test.ts`

**Interfaces:**
- Produces: `requireRegistryUser(request, env): Promise<{ email: string; role: "admin" | "advisor" }>`.
- Admin emails come from `REGISTRY_ADMIN_EMAILS`; advisor emails come from `REGISTRY_ADVISOR_EMAILS`.

- [ ] **Step 1: Write failing auth tests** for missing JWT, wrong audience, unauthorized email and authorized advisor/admin.

- [ ] **Step 2: Run and confirm failure**

Run: `cd worker && npm test -- registry/auth.test.ts`

- [ ] **Step 3: Implement Access JWT verification**

Read `Cf-Access-Jwt-Assertion`, validate signature against `${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`, require expected `aud`, `exp`, and email claim. Cache JWKS in-memory for the Worker isolate with a short TTL. Do not trust an unverified `Cf-Access-Authenticated-User-Email` header.

- [ ] **Step 4: Add role mapping**

Normalize configured comma-separated email lists to lowercase. Reject authenticated users not present in either list.

- [ ] **Step 5: Extend runtime bindings**

`RuntimeEnv` must include:

```ts
REGISTRY_DB: D1Database;
REGISTRY_FILES: R2Bucket;
CF_ACCESS_TEAM_DOMAIN: string;
CF_ACCESS_AUD: string;
REGISTRY_ADMIN_EMAILS: string;
REGISTRY_ADVISOR_EMAILS: string;
```

Update `wrangler.jsonc` with non-secret binding names and placeholder Access variable names only; actual audience/team values remain deployment configuration, not committed secrets.

- [ ] **Step 6: Run tests**

Run: `cd worker && npm test -- registry/auth.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add worker/src/registry/auth.ts worker/src/env.ts worker/wrangler.jsonc worker/test/registry/auth.test.ts
git commit -m "feat: protect registry with Cloudflare Access"
```

---

### Task 5: Add private file storage with R2 metadata only in D1

**Files:**
- Modify: `worker/src/registry/repository.ts`
- Create: `worker/src/registry/files.ts`
- Test: `worker/test/registry/files.test.ts`

**Interfaces:**
- Produces: `storeProjectFile`, `listProjectFiles`, `getProjectFile`, `deleteProjectFile`, `setFilePublicApproval`.
- R2 key format: `projects/{projectId}/{fileId}/{sanitizedFilename}`.

- [ ] **Step 1: Write failing tests** proving upload defaults to `publicApproved=false` and that public reads cannot retrieve unapproved objects.

- [ ] **Step 2: Run and confirm failure**

Run: `cd worker && npm test -- registry/files.test.ts`

- [ ] **Step 3: Implement filename/content checks**

Reject empty files, filenames over 180 characters, and payloads over 25 MiB in Phase 1. Sanitize path separators. Store original name only as metadata.

- [ ] **Step 4: Implement R2 storage and D1 metadata**

Write the object first; if metadata insert fails, delete the just-created object. On delete, remove R2 object then metadata and audit the action.

- [ ] **Step 5: Run tests**

Run: `cd worker && npm test -- registry/files.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add worker/src/registry/files.ts worker/src/registry/repository.ts worker/test/registry/files.test.ts
git commit -m "feat: add private project file storage"
```

---

### Task 6: Add admin and sanitized public registry APIs

**Files:**
- Create: `worker/src/registry/public-view.ts`
- Create: `worker/src/registry/routes.ts`
- Modify: `worker/src/index.ts`
- Test: `worker/test/registry/routes.test.ts`
- Modify: `worker/test/index.test.ts`

**Interfaces:**
- Admin routes: `GET/POST /v1/admin/projects`, `GET/PATCH /v1/admin/projects/:id`, `POST /v1/admin/projects/:id/status`, file endpoints under `/v1/admin/projects/:id/files`.
- Public routes: `GET /v1/public/projects`, `GET /v1/public/projects/:id`.

- [ ] **Step 1: Write failing route tests**

Cover: unauthenticated admin = 401/403; advisor can create/edit; only admin can set `publicVisible=true`; public route excludes seller, internal notes, exact vessel/aircraft identifiers and any unapproved file.

- [ ] **Step 2: Run and confirm failure**

Run: `cd worker && npm test -- registry/routes.test.ts`

- [ ] **Step 3: Implement the sanitized projection**

```ts
export function toPublicProject(project: ProjectRecord): PublicProject | null {
  if (project.status !== "Approved" || !project.publicVisible) return null;
  return {
    id: project.id,
    publicTitle: project.publicTitle,
    category: project.primaryCategory,
    region: project.publicLocation,
    transactionType: project.transactionType,
    price: sanitizePrice(project),
    teaser: project.publicTeaser,
    highlights: project.publicHighlights,
    imageKeys: project.files.filter((f) => f.publicApproved && f.kind === "image").map((f) => f.objectKey)
  };
}
```

Never spread the full project object into the public response.

- [ ] **Step 4: Implement admin routes**

Use `requireRegistryUser`; parse every body through validation; enforce admin-only publishing and approval; preserve advisor CRUD.

- [ ] **Step 5: Delegate registry paths from `index.ts`**

Route `/v1/admin/projects*` and `/v1/public/projects*` before the existing POST-only chat/lead guard. Do not change existing lead/chat parsing, rate limits or response schemas.

- [ ] **Step 6: Run full Worker tests**

Run: `cd worker && npm test`

Expected: all existing and registry tests PASS.

- [ ] **Step 7: Commit**

```bash
git add worker/src/registry/public-view.ts worker/src/registry/routes.ts worker/src/index.ts worker/test/registry/routes.test.ts worker/test/index.test.ts
git commit -m "feat: expose secure registry APIs"
```

---

### Task 7: Build the internal Project Registry workspace

**Files:**
- Create: `registry/index.html`
- Create: `registry/app.js`
- Create: `registry/styles.css`
- Test: `tests/registry-ui-contract.mjs`

**Interfaces:**
- Consumes admin API routes from Task 6.
- Produces a static internal workspace with list/filter, create/edit form, category-specific field groups, approval/publishing controls and file metadata/upload controls.

- [ ] **Step 1: Write a failing UI contract test**

The test reads `registry/index.html` and `registry/app.js` and asserts presence of project list, primary-category selector with eight values, confidentiality selector, price mode selector, project status, and no embedded secrets/API keys.

Run: `node tests/registry-ui-contract.mjs`

Expected: FAIL because registry UI files do not exist.

- [ ] **Step 2: Build the registry shell**

Use semantic HTML with three areas: project list/filter, project editor, activity/files. Keep the public site untouched.

- [ ] **Step 3: Implement data-driven category fields**

Define a JavaScript field schema keyed by `MA/BESS/SOLAR/SHIP/AIR/DC/CRE/STRAT`; render only the selected category's fields while retaining common fields.

- [ ] **Step 4: Implement API interactions**

Use `fetch` with `credentials: "include"`; handle 401/403 with a clear Access-login message; show save/publish errors without discarding unsaved form state.

- [ ] **Step 5: Enforce UI-level publishing guardrails**

Do not offer public visibility until status is `Approved`; show the exact sanitized teaser preview that will be sent by `/v1/public/projects/:id`.

- [ ] **Step 6: Run UI contract and Worker tests**

Run:

```bash
node tests/registry-ui-contract.mjs
cd worker && npm test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add registry/index.html registry/app.js registry/styles.css tests/registry-ui-contract.mjs
git commit -m "feat: add internal project registry workspace"
```

---

### Task 8: Wire CI, preview configuration and Phase 1 verification

**Files:**
- Modify: `.github/workflows/ai-sales-ci.yml`
- Create: `docs/superpowers/verification/2026-08-17-vantora-registry-phase1-verification.md`
- Modify: `README_PUBLIC.md` only if local verification commands are missing.

**Interfaces:**
- CI must verify existing AI Sales tests plus registry Worker/UI contract tests.
- No production deployment or migration is performed by CI in this task.

- [ ] **Step 1: Update CI to run registry checks**

Add `node tests/registry-ui-contract.mjs` and keep `cd worker && npm test`. Add a TypeScript check using `npx tsc --noEmit` if not already present.

- [ ] **Step 2: Run the complete local verification suite**

```bash
node tests/registry-ui-contract.mjs
cd worker
npm test
npx tsc --noEmit
```

Expected: all commands exit 0.

- [ ] **Step 3: Verify confidentiality invariants with tests**

Confirm automated coverage specifically proves:

```text
seller_owner absent from public JSON
internal_notes absent from public JSON
SHIP vessel_name/IMO absent from public JSON
AIR serial/registration absent from public JSON
unapproved files absent from public JSON
Draft/Submitted/Archived projects absent from public list
```

- [ ] **Step 4: Document deployment prerequisites without deploying**

Record that preview deployment requires: D1 database creation + migration, private R2 bucket, Cloudflare Access application/policy, Access audience/team domain vars, admin/advisor email vars. Do not commit secrets.

- [ ] **Step 5: Write the verification report**

Include tested commit SHA, commands/results, known deployment prerequisites, and explicit statement that production was not changed.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ai-sales-ci.yml docs/superpowers/verification/2026-08-17-vantora-registry-phase1-verification.md README_PUBLIC.md
git commit -m "test: verify project registry phase 1"
```

---

## Self-Review

- Spec coverage: Phase 1 covers project schema, IDs, eight category field sets, visibility model, project CRUD, private files, approval, audit records, roles and sanitized public output.
- Deliberate deferrals: external partner submission, organizations/contacts/mandates, matching and pipeline remain Phase 2–4 work and are not stubbed into Phase 1.
- Placeholder scan: implementation steps contain exact file names, commands, interfaces and security rules; deployment-specific IDs/secrets are intentionally runtime configuration rather than source placeholders.
- Type consistency: `ProjectInput` → validation → repository → `ProjectRecord` → `toPublicProject()` is the single data flow; public responses never reuse the internal record shape.
- Safety: no production deploy, production migration, or merge is part of this plan.
