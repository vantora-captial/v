import { beforeEach, describe, expect, it } from "vitest";
import { env } from "cloudflare:test";
import { createProject, getProject, setProjectStatus, updateProject } from "../../src/registry/repository";
import { parseProjectInput } from "../../src/registry/validation";

const actor = "advisor@example.com";

function ship(name = "LNG Carrier") {
  return parseProjectInput({
    internalName: name,
    publicTitle: "LNG Carrier — Asia",
    primaryCategory: "SHIP",
    secondaryTags: ["MARITIME"],
    country: "Japan",
    transactionType: "Asset Acquisition",
    details: { vesselType: "LNG Carrier", vesselName: "Internal Vessel" }
  });
}

beforeEach(async () => {
  for (const table of ["project_audit", "project_files", "project_tags", "projects", "project_sequences"]) {
    await env.REGISTRY_DB.prepare(`DELETE FROM ${table}`).run();
  }
});

describe("registry repository", () => {
  it("allocates sequential category-year project IDs", async () => {
    const first = await createProject(env.REGISTRY_DB, ship("A"), actor, 2026);
    const second = await createProject(env.REGISTRY_DB, ship("B"), actor, 2026);
    expect(first.id).toBe("VAN-SHIP-2026-001");
    expect(second.id).toBe("VAN-SHIP-2026-002");
  });

  it("persists tags, updates and audit history", async () => {
    const created = await createProject(env.REGISTRY_DB, ship(), actor, 2026);
    const updatedInput = parseProjectInput({
      ...created,
      secondaryTags: ["MARITIME", "ENERGY"],
      publicTeaser: "Qualified maritime opportunity.",
      details: created.details
    });
    const updated = await updateProject(env.REGISTRY_DB, created.id, updatedInput, actor);
    expect(updated?.secondaryTags).toEqual(["ENERGY", "MARITIME"]);
    expect(updated?.publicTeaser).toBe("Qualified maritime opportunity.");
    const audit = await env.REGISTRY_DB.prepare("SELECT action FROM project_audit WHERE project_id = ? ORDER BY created_at").bind(created.id).all<{ action: string }>();
    expect(audit.results.map((row) => row.action)).toContain("updated");
  });

  it("tracks lifecycle changes without deleting history", async () => {
    const created = await createProject(env.REGISTRY_DB, ship(), actor, 2026);
    await setProjectStatus(env.REGISTRY_DB, created.id, "Approved", "admin@example.com");
    const loaded = await getProject(env.REGISTRY_DB, created.id);
    expect(loaded?.status).toBe("Approved");
    const audit = await env.REGISTRY_DB.prepare("SELECT action FROM project_audit WHERE project_id = ?").bind(created.id).all<{ action: string }>();
    expect(audit.results.map((row) => row.action)).toContain("status_changed");
  });
});
