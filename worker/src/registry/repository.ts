import type { ProjectInput, ProjectRecord, ProjectStatus, ProjectFileRecord } from "./model";
import { allocateProjectId } from "./ids";

function nowIso(): string {
  return new Date().toISOString();
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function rowToProject(row: Record<string, unknown>, tags: string[] = [], files: ProjectFileRecord[] = []): ProjectRecord {
  return {
    id: String(row.id),
    internalName: String(row.internal_name),
    publicTitle: row.public_title == null ? null : String(row.public_title),
    primaryCategory: String(row.primary_category) as ProjectRecord["primaryCategory"],
    secondaryTags: tags,
    country: String(row.country),
    region: row.region == null ? null : String(row.region),
    transactionType: String(row.transaction_type),
    status: String(row.status) as ProjectStatus,
    indicativeValue: row.indicative_value == null ? null : Number(row.indicative_value),
    currency: row.currency == null ? null : String(row.currency),
    priceDisplayMode: String(row.price_display_mode) as ProjectRecord["priceDisplayMode"],
    priceMin: row.price_min == null ? null : Number(row.price_min),
    priceMax: row.price_max == null ? null : Number(row.price_max),
    sellerOwner: row.seller_owner == null ? null : String(row.seller_owner),
    sourceIntroducer: row.source_introducer == null ? null : String(row.source_introducer),
    authorizationStatus: row.authorization_status == null ? null : String(row.authorization_status),
    confidentialityLevel: String(row.confidentiality_level) as ProjectRecord["confidentialityLevel"],
    publicVisible: Number(row.public_visible) === 1,
    publicTeaser: row.public_teaser == null ? null : String(row.public_teaser),
    publicHighlights: parseJson<string[]>(row.public_highlights_json as string | null, []),
    publicLocation: row.public_location == null ? null : String(row.public_location),
    details: parseJson<Record<string, unknown>>(row.details_json as string | null, {}),
    internalNotes: row.internal_notes == null ? null : String(row.internal_notes),
    internalOwner: row.internal_owner == null ? null : String(row.internal_owner),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    files
  };
}

async function tagsFor(db: D1Database, id: string): Promise<string[]> {
  const result = await db.prepare("SELECT tag FROM project_tags WHERE project_id = ? ORDER BY tag").bind(id).all<{ tag: string }>();
  return (result.results || []).map((r) => r.tag);
}

export async function filesFor(db: D1Database, id: string): Promise<ProjectFileRecord[]> {
  const result = await db.prepare("SELECT * FROM project_files WHERE project_id = ? ORDER BY created_at DESC").bind(id).all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({
    id: String(row.id), projectId: String(row.project_id), kind: String(row.kind), objectKey: String(row.object_key),
    originalName: String(row.original_name), contentType: String(row.content_type), sizeBytes: Number(row.size_bytes),
    publicApproved: Number(row.public_approved) === 1, createdAt: String(row.created_at)
  }));
}

async function audit(db: D1Database, projectId: string, actorEmail: string, action: string, metadata: Record<string, unknown> = {}): Promise<void> {
  await db.prepare("INSERT INTO project_audit (id, project_id, actor_email, action, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), projectId, actorEmail, action, JSON.stringify(metadata), nowIso()).run();
}

async function replaceTags(db: D1Database, id: string, tags: string[]): Promise<void> {
  await db.prepare("DELETE FROM project_tags WHERE project_id = ?").bind(id).run();
  for (const tag of [...new Set(tags)]) await db.prepare("INSERT INTO project_tags (project_id, tag) VALUES (?, ?)").bind(id, tag).run();
}

export async function createProject(db: D1Database, input: ProjectInput, actorEmail: string, year = new Date().getUTCFullYear()): Promise<ProjectRecord> {
  const id = await allocateProjectId(db, input.primaryCategory, year);
  const now = nowIso();
  await db.prepare(`INSERT INTO projects (
    id, internal_name, public_title, primary_category, country, region, transaction_type, status,
    indicative_value, currency, price_display_mode, price_min, price_max, seller_owner, source_introducer,
    authorization_status, confidentiality_level, public_visible, public_teaser, public_highlights_json,
    public_location, details_json, internal_notes, internal_owner, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, input.internalName, input.publicTitle, input.primaryCategory, input.country, input.region, input.transactionType,
      input.indicativeValue, input.currency, input.priceDisplayMode, input.priceMin, input.priceMax, input.sellerOwner,
      input.sourceIntroducer, input.authorizationStatus, input.confidentialityLevel, input.publicVisible ? 1 : 0,
      input.publicTeaser, JSON.stringify(input.publicHighlights), input.publicLocation, JSON.stringify(input.details),
      input.internalNotes, input.internalOwner, now, now).run();
  await replaceTags(db, id, input.secondaryTags);
  await audit(db, id, actorEmail, "created");
  const created = await getProject(db, id);
  if (!created) throw new Error("created project could not be loaded");
  return created;
}

export async function getProject(db: D1Database, id: string): Promise<ProjectRecord | null> {
  const row = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!row) return null;
  return rowToProject(row, await tagsFor(db, id), await filesFor(db, id));
}

export async function listProjects(db: D1Database): Promise<ProjectRecord[]> {
  const result = await db.prepare("SELECT * FROM projects ORDER BY updated_at DESC").all<Record<string, unknown>>();
  const out: ProjectRecord[] = [];
  for (const row of result.results || []) out.push(rowToProject(row, await tagsFor(db, String(row.id)), await filesFor(db, String(row.id))));
  return out;
}

export async function updateProject(db: D1Database, id: string, input: ProjectInput, actorEmail: string): Promise<ProjectRecord | null> {
  const before = await getProject(db, id);
  if (!before) return null;
  const now = nowIso();
  await db.prepare(`UPDATE projects SET internal_name=?, public_title=?, primary_category=?, country=?, region=?, transaction_type=?,
    indicative_value=?, currency=?, price_display_mode=?, price_min=?, price_max=?, seller_owner=?, source_introducer=?, authorization_status=?,
    confidentiality_level=?, public_visible=?, public_teaser=?, public_highlights_json=?, public_location=?, details_json=?, internal_notes=?, internal_owner=?, updated_at=?
    WHERE id=?`)
    .bind(input.internalName, input.publicTitle, input.primaryCategory, input.country, input.region, input.transactionType,
      input.indicativeValue, input.currency, input.priceDisplayMode, input.priceMin, input.priceMax, input.sellerOwner,
      input.sourceIntroducer, input.authorizationStatus, input.confidentialityLevel, input.publicVisible ? 1 : 0,
      input.publicTeaser, JSON.stringify(input.publicHighlights), input.publicLocation, JSON.stringify(input.details), input.internalNotes,
      input.internalOwner, now, id).run();
  await replaceTags(db, id, input.secondaryTags);
  await audit(db, id, actorEmail, before.publicVisible !== input.publicVisible ? "visibility_changed" : "updated", { publicVisible: input.publicVisible });
  return getProject(db, id);
}

export async function setProjectStatus(db: D1Database, id: string, status: ProjectStatus, actorEmail: string): Promise<ProjectRecord | null> {
  const existing = await getProject(db, id);
  if (!existing) return null;
  await db.prepare("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?").bind(status, nowIso(), id).run();
  await audit(db, id, actorEmail, status === "Archived" ? "archived" : "status_changed", { from: existing.status, to: status });
  return getProject(db, id);
}

export async function archiveProject(db: D1Database, id: string, actorEmail: string): Promise<ProjectRecord | null> {
  return setProjectStatus(db, id, "Archived", actorEmail);
}
