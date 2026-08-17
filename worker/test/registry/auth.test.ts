import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearRegistryAuthCacheForTests, RegistryAuthError, requireRegistryUser } from "../../src/registry/auth";
import type { RuntimeEnv } from "../../src/env";

function b64url(input: string | ArrayBuffer): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function fixture() {
  const keys = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const publicJwk = await crypto.subtle.exportKey("jwk", keys.publicKey) as JsonWebKey & { kid?: string };
  publicJwk.kid = "test-key";
  async function token(email: string, aud = "registry-aud", exp = Math.floor(Date.now() / 1000) + 3600) {
    const header = b64url(JSON.stringify({ alg: "RS256", kid: "test-key", typ: "JWT" }));
    const payload = b64url(JSON.stringify({ email, aud, exp }));
    const input = `${header}.${payload}`;
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keys.privateKey, new TextEncoder().encode(input));
    return `${input}.${b64url(signature)}`;
  }
  return { publicJwk, token };
}

function envFixture(overrides = {}): RuntimeEnv {
  return {
    CF_ACCESS_TEAM_DOMAIN: "https://team.cloudflareaccess.com",
    CF_ACCESS_AUD: "registry-aud",
    REGISTRY_ADMIN_EMAILS: "admin@example.com",
    REGISTRY_ADVISOR_EMAILS: "advisor@example.com",
    ...overrides
  } as RuntimeEnv;
}

beforeEach(() => clearRegistryAuthCacheForTests());
afterEach(() => vi.unstubAllGlobals());

describe("registry Access auth", () => {
  it("rejects missing access assertions", async () => {
    await expect(requireRegistryUser(new Request("https://worker.example/v1/admin/projects"), envFixture())).rejects.toMatchObject({ status: 401 });
  });

  it("verifies signed assertions and maps roles", async () => {
    const { publicJwk, token } = await fixture();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ keys: [publicJwk] })));
    const request = new Request("https://worker.example/v1/admin/projects", { headers: { "Cf-Access-Jwt-Assertion": await token("Admin@Example.com") } });
    await expect(requireRegistryUser(request, envFixture())).resolves.toEqual({ email: "admin@example.com", role: "admin" });
  });

  it("rejects wrong audience and unlisted users", async () => {
    const { publicJwk, token } = await fixture();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ keys: [publicJwk] })));
    const wrongAudience = new Request("https://worker.example/v1/admin/projects", { headers: { "Cf-Access-Jwt-Assertion": await token("admin@example.com", "other-aud") } });
    await expect(requireRegistryUser(wrongAudience, envFixture())).rejects.toBeInstanceOf(RegistryAuthError);
    clearRegistryAuthCacheForTests();
    const unlisted = new Request("https://worker.example/v1/admin/projects", { headers: { "Cf-Access-Jwt-Assertion": await token("unknown@example.com") } });
    await expect(requireRegistryUser(unlisted, envFixture())).rejects.toMatchObject({ status: 403 });
  });
});
