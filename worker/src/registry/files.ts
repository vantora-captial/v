import type { ProjectFileRecord } from "./model";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function safeFilename(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 180) throw new Error("invalid filename");
  return trimmed.replace(/[\\/]+/g, "_").replace(/[^\p{L}\p{N}._ -]/gu, "_");
}

function nowIso(): string { return new Date().toISOString(); }

export async function storeProjectFile(
  db: D1Database,
  bucket: R2Bucket,
  projectId: string,
  file: File,
  kind: string,
  actorEmail: string
): Promise<ProjectFileRecord> {
  if (file.size <= 0) throw new Error("file must not be empty");
  if (file.size > MAX_FILE_BYTES) throw new Error("file exceeds 25 MiB limit");
  const id = crypto.randomUUID();
  const originalName = file.name;
  const objectKey = `projects/${projectId}/${id}/${safeFilename(originalName)}`;
  const createdAt = nowIso();
  await bucket.put(objectKey, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
  try {
    await db.prepare(`INSERT INTO project_files
      (id, project_id, kind, object_key, original_name, content_type, size_bytes, public_approved, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`)
      .bind(id, projectId, kind, objectKey, originalName, file.type || "application/octet-stream", file.size, createdAt).run();
    await db.prepare("INSERT INTO project_audit (id, project_id, actor_email, action, metadata_json, created_at) VALUES (?, ?, ?, 'file_added', ?, ?)")
      .bind(crypto.randomUUID(), projectId, actorEmail, JSON.stringify({ fileId: id, kind }), createdAt).run();
  } catch (error) {
    await bucket.delete(objectKey);
    throw error;
  }
  return { id, projectId, kind, objectKey, originalName, contentType: file.type || "application/octet-stream", sizeBytes: file.size, publicApproved: false, createdAt };
}

export async function listProjectFiles(db: D1Database, projectId: string): Promise<ProjectFileRecord[]> {
  const result = await db.prepare("SELECT * FROM project_files WHERE project_id = ? ORDER BY created_at DESC").bind(projectId).all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({
    id: String(row.id), projectId: String(row.project_id), kind: String(row.kind), objectKey: String(row.object_key),
    originalName: String(row.original_name), contentType: String(row.content_type), sizeBytes: Number(row.size_bytes),
    publicApproved: Number(row.public_approved) === 1, createdAt: String(row.created_at)
  }));
}

export async function getProjectFile(db: D1Database, bucket: R2Bucket, fileId: string): Promise<{ meta: ProjectFileRecord; object: R2ObjectBody } | null> {
  const row = await db.prepare("SELECT * FROM project_files WHERE id = ?").bind(fileId).first<Record<string, unknown>>();
  if (!row) return null;
  const meta: ProjectFileRecord = {
    id: String(row.id), projectId: String(row.project_id), kind: String(row.kind), objectKey: String(row.object_key),
    originalName: String(row.original_name), contentType: String(row.content_type), sizeBytes: Number(row.size_bytes),
    publicApproved: Number(row.public_approved) === 1, createdAt: String(row.created_at)
  };
  const object = await bucket.get(meta.objectKey);
  return object ? { meta, object } : null;
}

export async function deleteProjectFile(db: D1Database, bucket: R2Bucket, fileId: string, actorEmail: string): Promise<boolean> {
  const row = await db.prepare("SELECT project_id, object_key FROM project_files WHERE id = ?").bind(fileId).first<{ project_id: string; object_key: string }>();
  if (!row) return false;
  await bucket.delete(row.object_key);
  await db.prepare("DELETE FROM project_files WHERE id = ?").bind(fileId).run();
  await db.prepare("INSERT INTO project_audit (id, project_id, actor_email, action, metadata_json, created_at) VALUES (?, ?, ?, 'file_deleted', ?, ?)")
    .bind(crypto.randomUUID(), row.project_id, actorEmail, JSON.stringify({ fileId }), nowIso()).run();
  return true;
}

export async function setFilePublicApproval(db: D1Database, fileId: string, approved: boolean, actorEmail: string): Promise<boolean> {
  const row = await db.prepare("SELECT project_id FROM project_files WHERE id = ?").bind(fileId).first<{ project_id: string }>();
  if (!row) return false;
  await db.prepare("UPDATE project_files SET public_approved = ? WHERE id = ?").bind(approved ? 1 : 0, fileId).run();
  await db.prepare("INSERT INTO project_audit (id, project_id, actor_email, action, metadata_json, created_at) VALUES (?, ?, ?, 'file_visibility_changed', ?, ?)")
    .bind(crypto.randomUUID(), row.project_id, actorEmail, JSON.stringify({ fileId, approved }), nowIso()).run();
  return true;
}
