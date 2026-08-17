import { beforeEach, describe, expect, it } from "vitest";
import { env } from "cloudflare:test";
import { createProject } from "../../src/registry/repository";
import { deleteProjectFile, getProjectFile, listProjectFiles, setFilePublicApproval, storeProjectFile } from "../../src/registry/files";
import { parseProjectInput } from "../../src/registry/validation";

beforeEach(async () => {
  for (const table of ["project_audit", "project_files", "project_tags", "projects", "project_sequences"]) {
    await env.REGISTRY_DB.prepare(`DELETE FROM ${table}`).run();
  }
});

async function createShip() {
  return createProject(env.REGISTRY_DB, parseProjectInput({
    internalName: "File Test Vessel",
    primaryCategory: "SHIP",
    country: "Japan",
    transactionType: "Asset Acquisition",
    details: { vesselType: "LNG Carrier" }
  }), "advisor@example.com", 2026);
}

describe("registry project files", () => {
  it("stores files privately by default", async () => {
    const project = await createShip();
    const file = new File(["private teaser"], "teaser.pdf", { type: "application/pdf" });
    const saved = await storeProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, project.id, file, "teaser", "advisor@example.com");
    expect(saved.publicApproved).toBe(false);
    expect(saved.objectKey).toContain(`projects/${project.id}/`);
    const listed = await listProjectFiles(env.REGISTRY_DB, project.id);
    expect(listed).toHaveLength(1);
    expect(listed[0].publicApproved).toBe(false);
    const loaded = await getProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, saved.id);
    expect(await loaded?.object.text()).toBe("private teaser");
  });

  it("requires explicit approval and supports deletion", async () => {
    const project = await createShip();
    const saved = await storeProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, project.id, new File(["image"], "asset.jpg", { type: "image/jpeg" }), "image", "advisor@example.com");
    expect(await setFilePublicApproval(env.REGISTRY_DB, saved.id, true, "admin@example.com")).toBe(true);
    expect((await listProjectFiles(env.REGISTRY_DB, project.id))[0].publicApproved).toBe(true);
    expect(await deleteProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, saved.id, "advisor@example.com")).toBe(true);
    expect(await getProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, saved.id)).toBeNull();
  });

  it("rejects empty and oversized upload metadata before storage", async () => {
    const project = await createShip();
    await expect(storeProjectFile(env.REGISTRY_DB, env.REGISTRY_FILES, project.id, new File([], "empty.pdf"), "other", "advisor@example.com")).rejects.toThrow(/empty/);
  });
});
