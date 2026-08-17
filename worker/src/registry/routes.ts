import type { RuntimeEnv } from "../env";
import { RegistryAuthError, requireRegistryUser } from "./auth";
import { deleteProjectFile, getProjectFile, listProjectFiles, setFilePublicApproval, storeProjectFile } from "./files";
import { getProject, listProjects, createProject, setProjectStatus, updateProject } from "./repository";
import { toPublicProject } from "./public-view";
import { parseProjectInput } from "./validation";
import { isProjectStatus } from "./model";

function cors(origin: string | null, env: RuntimeEnv): Headers {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  const allowed = new Set(env.ALLOWED_ORIGINS.split(",").map((x) => x.trim()).filter(Boolean));
  if (origin && allowed.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Cf-Access-Jwt-Assertion");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    headers.set("Vary", "Origin");
  }
  return headers;
}

function json(data: unknown, status: number, origin: string | null, env: RuntimeEnv): Response {
  return new Response(JSON.stringify(data), { status, headers: cors(origin, env) });
}

async function bodyJson(request: Request): Promise<unknown> {
  try { return await request.json(); } catch { throw new Error("invalid_json"); }
}

function idFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/v1\/admin\/projects\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function handleRegistryRequest(request: Request, env: RuntimeEnv): Promise<Response | null> {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const path = url.pathname;
  if (!path.startsWith("/v1/admin/projects") && !path.startsWith("/v1/public/projects")) return null;

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin, env) });

  if (path === "/v1/public/projects" && request.method === "GET") {
    const projects = await listProjects(env.REGISTRY_DB);
    return json({ projects: projects.map(toPublicProject).filter(Boolean) }, 200, origin, env);
  }

  const publicMatch = path.match(/^\/v1\/public\/projects\/([^/]+)$/);
  if (publicMatch && request.method === "GET") {
    const project = await getProject(env.REGISTRY_DB, decodeURIComponent(publicMatch[1]));
    const publicProject = project ? toPublicProject(project) : null;
    return publicProject ? json(publicProject, 200, origin, env) : json({ error: "not_found" }, 404, origin, env);
  }

  let user;
  try {
    user = await requireRegistryUser(request, env);
  } catch (error) {
    if (error instanceof RegistryAuthError) return json({ error: error.message }, error.status, origin, env);
    throw error;
  }

  if (path === "/v1/admin/projects" && request.method === "GET") {
    return json({ projects: await listProjects(env.REGISTRY_DB) }, 200, origin, env);
  }

  if (path === "/v1/admin/projects" && request.method === "POST") {
    try {
      const parsed = parseProjectInput(await bodyJson(request));
      if (user.role !== "admin") parsed.publicVisible = false;
      const project = await createProject(env.REGISTRY_DB, parsed, user.email);
      return json(project, 201, origin, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "invalid_request" }, 400, origin, env);
    }
  }

  const statusMatch = path.match(/^\/v1\/admin\/projects\/([^/]+)\/status$/);
  if (statusMatch && request.method === "POST") {
    if (user.role !== "admin") return json({ error: "admin_required" }, 403, origin, env);
    const raw = await bodyJson(request) as { status?: unknown };
    if (!raw || !isProjectStatus(raw.status)) return json({ error: "invalid_status" }, 400, origin, env);
    const updated = await setProjectStatus(env.REGISTRY_DB, decodeURIComponent(statusMatch[1]), raw.status, user.email);
    return updated ? json(updated, 200, origin, env) : json({ error: "not_found" }, 404, origin, env);
  }

  const fileListMatch = path.match(/^\/v1\/admin\/projects\/([^/]+)\/files$/);
  if (fileListMatch && request.method === "GET") {
    return json({ files: await listProjectFiles(env.REGISTRY_DB, decodeURIComponent(fileListMatch[1])) }, 200, origin, env);
  }
  if (fileListMatch && request.method === "POST") {
    const projectId = decodeURIComponent(fileListMatch[1]);
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "other");
    if (!(file instanceof File)) return json({ error: "file_required" }, 400, origin, env);
    try {
      const stored = await storeProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, projectId, file, kind, user.email);
      return json(stored, 201, origin, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "upload_failed" }, 400, origin, env);
    }
  }

  const fileMatch = path.match(/^\/v1\/admin\/projects\/([^/]+)\/files\/([^/]+)$/);
  if (fileMatch && request.method === "GET") {
    const result = await getProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, decodeURIComponent(fileMatch[2]));
    if (!result) return json({ error: "not_found" }, 404, origin, env);
    const headers = new Headers({ "Content-Type": result.meta.contentType, "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(result.meta.originalName)}` });
    return new Response(result.object.body, { status: 200, headers });
  }
  if (fileMatch && request.method === "DELETE") {
    const ok = await deleteProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, decodeURIComponent(fileMatch[2]), user.email);
    return ok ? json({ ok: true }, 200, origin, env) : json({ error: "not_found" }, 404, origin, env);
  }

  const fileApprovalMatch = path.match(/^\/v1\/admin\/projects\/([^/]+)\/files\/([^/]+)\/public$/);
  if (fileApprovalMatch && request.method === "POST") {
    if (user.role !== "admin") return json({ error: "admin_required" }, 403, origin, env);
    const raw = await bodyJson(request) as { approved?: unknown };
    if (typeof raw?.approved !== "boolean") return json({ error: "invalid_request" }, 400, origin, env);
    const ok = await setFilePublicApproval(env.REGISTRY_DB, decodeURIComponent(fileApprovalMatch[2]), raw.approved, user.email);
    return ok ? json({ ok: true }, 200, origin, env) : json({ error: "not_found" }, 404, origin, env);
  }

  const id = idFromPath(path);
  if (id && request.method === "GET") {
    const project = await getProject(env.REGISTRY_DB, id);
    return project ? json(project, 200, origin, env) : json({ error: "not_found" }, 404, origin, env);
  }
  if (id && request.method === "PATCH") {
    const existing = await getProject(env.REGISTRY_DB, id);
    if (!existing) return json({ error: "not_found" }, 404, origin, env);
    try {
      const patch = await bodyJson(request) as Record<string, unknown>;
      const merged = parseProjectInput({ ...existing, ...patch, details: patch.details ?? existing.details });
      if (user.role !== "admin" && merged.publicVisible !== existing.publicVisible) return json({ error: "admin_required_for_visibility" }, 403, origin, env);
      const updated = await updateProject(env.REGISTRY_DB, id, merged, user.email);
      return json(updated, 200, origin, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "invalid_request" }, 400, origin, env);
    }
  }

  return json({ error: "not_found" }, 404, origin, env);
}
