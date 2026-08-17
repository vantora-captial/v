# Vantora Project Registry Phase 1 Verification

Date: 2026-08-17
Branch: `registry-phase1`
Base: `ai-sales-redesign`

## Scope verified

Phase 1 implements the approved project-registry foundation only:

- D1-backed project schema and migration
- Automatic `VAN-{CATEGORY}-{YYYY}-{SEQUENCE}` project IDs
- Eight primary categories: `MA`, `BESS`, `SOLAR`, `SHIP`, `AIR`, `DC`, `CRE`, `STRAT`
- One primary category with multiple secondary tags
- Project lifecycle: `Draft`, `Submitted`, `Approved`, `Archived`
- Confidentiality: `Internal Only`, `Teaser`, `NDA Access`
- Price modes: `Hidden`, `Range`, `Exact`
- Category-specific validation and fields
- Internal project CRUD and audit trail
- Cloudflare Access JWT verification with admin/advisor allowlists
- Private R2 project-file storage
- Explicit public-image approval flag
- Sanitized public project projection that excludes seller identity, internal notes, confidential identifiers, private files, and internal category details
- Internal registry UI with project list, filters, category-specific fields, confidentiality controls, publishing controls, file intake, and public-teaser preview
- Non-persistent presentation mode with clearly labeled sample data

Phase 1 does not implement investor organizations, mandates, matching, deal pipeline, external partner submission, or automated distribution. Those remain later phases by design.

## Automated verification evidence

GitHub Actions run `31994839628` on commit `a672fa6435852f795cb21d72e6049fe5ff3bb9cf` completed with:

- Worker type generation: PASS
- TypeScript source typecheck: PASS
- Worker/Vitest suite: PASS
- Wrangler deploy dry run: PASS
- Registry UI contract: PASS
- Existing frontend tests: PASS

Registry presentation preview workflow run `31994816959` completed successfully and verified the stable Cloudflare Pages presentation URL.

## Presentation preview

Stable presentation URL:

`https://vantora-registry-preview.pages.dev/?demo=1`

This preview is intentionally non-persistent and uses sample data only. It does not contain or represent live mandates.

## Production safety

No production branch was merged or released as part of Phase 1 work.

The presentation preview is isolated in the Cloudflare Pages project `vantora-registry-preview` and deploys only static files from `registry/`.

The live registry Worker has not been deployed because the branch configuration intentionally retains a placeholder D1 database ID and blank Cloudflare Access values. This prevents accidental activation before environment provisioning is deliberately performed.

## Deployment prerequisites for a real internal environment

Before enabling persistence for actual project data:

1. Create the real Cloudflare D1 database and replace the placeholder database ID.
2. Create/confirm the private R2 bucket.
3. Apply `worker/migrations/0001_project_registry.sql` to the target D1 database.
4. Create the Cloudflare Access application for the registry/admin route.
5. Configure `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD`.
6. Configure `REGISTRY_ADMIN_EMAILS` and `REGISTRY_ADVISOR_EMAILS`.
7. Add the intended registry UI origin to `ALLOWED_ORIGINS` when the UI and API are on different origins.
8. Set the registry UI API base if the Worker is hosted separately.
9. Verify create/edit/status/file/public-teaser flows in the protected environment before entering live confidential projects.

## Review gate

The next user review is visual/product confirmation of the presentation preview. Production activation and later phases remain gated after that review.
