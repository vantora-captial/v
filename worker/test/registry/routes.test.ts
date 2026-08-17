import { beforeEach, describe, expect, it } from "vitest";
import { env } from "cloudflare:test";
import { handleRegistryRequest } from "../../src/registry/routes";
import { createProject, setProjectStatus } from "../../src/registry/repository";
import { parseProjectInput } from "../../src/registry/validation";
import type { RuntimeEnv } from "../../src/env";

beforeEach(async () => {
  for (const table of ["project_audit", "project_files", "project_tags", "projects", "project_sequences"]) {
    await env.REGISTRY_DB.prepare(`DELETE FROM ${table}`).run();
  }
});

function runtimeEnv(): RuntimeEnv {
  return {
    ...(env as unknown as RuntimeEnv),
    ALLOWED_ORIGINS: "https://vantora-captial.github.io",
    CF_ACCESS_TEAM_DOMAIN: "https://team.cloudflareaccess.com",
    CF_ACCESS_AUD: "registry-aud",
    REGISTRY_ADMIN_EMAILS: "admin@example.com",
    REGISTRY_ADVISOR_EMAILS: "advisor@example.com"
  };
}

describe("registry routes", () => {
  it("requires Access for admin routes", async () => {
    const response = await handleRegistryRequest(new Request("https://worker.example/v1/admin/projects"), runtimeEnv());
    expect(response?.status).toBe(401);
  });

  it("serves only sanitized approved public projects", async () => {
    const project = await createProject(env.REGISTRY_DB, parseProjectInput({
      internalName: "Secret Vessel",
      publicTitle: "Selected LNG Carrier",
      primaryCategory: "SHIP",
      country: "Japan",
      transactionType: "Asset Acquisition",
      publicVisible: true,
      publicLocation: "Asia",
      publicTeaser: "Available for qualified buyer discussion.",
      sellerOwner: "Secret Seller Ltd",
      internalNotes: "Never publish this note",
      details: { vesselType: "LNG Carrier", vesselName: "SECRET NAME", imoNumber: "9999999" }
    }), "admin@example.com", 2026);
    await setProjectStatus(env.REGISTRY_DB, project.id, "Approved", "admin@example.com");

    const response = await handleRegistryRequest(new Request("https://worker.example/v1/public/projects"), runtimeEnv());
    expect(response?.status).toBe(200);
    const json = await response?.json() as { projects: unknown[] };
    expect(json.projects).toHaveLength(1);
    const serialized = JSON.stringify(json);
    expect(serialized).toContain("Selected LNG Carrier");
    expect(serialized).not.toContain("Secret Seller Ltd");
    expect(serialized).not.toContain("Never publish this note");
    expect(serialized).not.toContain("SECRET NAME");
    expect(serialized).not.toContain("9999999");
  });

  it("does not list Draft projects even when publicVisible is set", async () => {
    await createProject(env.REGISTRY_DB, parseProjectInput({
      internalName: "Draft Project",
      publicTitle: "Should Not Appear",
      primaryCategory: "CRE",
      country: "Japan",
      transactionType: "Asset Acquisition",
      publicVisible: true,
      details: { propertyType: "Industrial Land" }
    }), "admin@example.com", 2026);
    const response = await handleRegistryRequest(new Request("https://worker.example/v1/public/projects"), runtimeEnv());
    const json = await response?.json() as { projects: unknown[] };
    expect(json.projects).toEqual([]);
  });
});
