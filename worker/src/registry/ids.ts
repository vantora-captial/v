import type { ProjectCategory } from "./model";

export async function allocateProjectId(db: D1Database, category: ProjectCategory, year: number): Promise<string> {
  const row = await db.prepare(`
    INSERT INTO project_sequences (category, year, last_value)
    VALUES (?, ?, 1)
    ON CONFLICT(category, year) DO UPDATE SET last_value = last_value + 1
    RETURNING last_value
  `).bind(category, year).first<{ last_value: number }>();

  if (!row) throw new Error("failed to allocate project id");
  return `VAN-${category}-${year}-${String(row.last_value).padStart(3, "0")}`;
}
