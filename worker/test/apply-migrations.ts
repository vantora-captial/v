import { env } from "cloudflare:test";

await env.REGISTRY_DB.exec(`
CREATE TABLE IF NOT EXISTS project_sequences (
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_value INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (category, year)
);
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS project_tags (
  project_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (project_id, tag),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS project_files (
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
CREATE TABLE IF NOT EXISTS project_audit (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_projects_category_status ON projects(primary_category, status);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(public_visible, status);
CREATE INDEX IF NOT EXISTS idx_project_audit_project ON project_audit(project_id, created_at);
`);
