import type { RuntimeEnv } from "../env";

export class RegistryAuthError extends Error {
  constructor(public readonly status: 401 | 403, message: string) {
    super(message);
    this.name = "RegistryAuthError";
  }
}

export type RegistryUser = { email: string; role: "admin" | "advisor" };

type JwtHeader = { alg?: string; kid?: string };
type JwtPayload = { aud?: string | string[]; exp?: number; email?: string };
type AccessJwk = JsonWebKey & { kid?: string };
type Jwks = { keys: AccessJwk[] };

let cachedJwks: { value: Jwks; expiresAt: number } | null = null;

function decodeBase64UrlJson<T>(value: string): T {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

function decodeBase64UrlBuffer(value: string): ArrayBuffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function normalizeTeamDomain(domain: string): string {
  const trimmed = domain.trim().replace(/\/$/, "");
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

async function getJwks(env: RuntimeEnv): Promise<Jwks> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) return cachedJwks.value;
  const response = await fetch(`${normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN)}/cdn-cgi/access/certs`);
  if (!response.ok) throw new RegistryAuthError(401, "access key set unavailable");
  const value = await response.json() as Jwks;
  if (!value || !Array.isArray(value.keys)) throw new RegistryAuthError(401, "invalid access key set");
  cachedJwks = { value, expiresAt: now + 5 * 60_000 };
  return value;
}

function audienceMatches(aud: string | string[] | undefined, expected: string): boolean {
  if (typeof aud === "string") return aud === expected;
  return Array.isArray(aud) && aud.includes(expected);
}

function emailSet(value: string): Set<string> {
  return new Set(value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
}

export async function requireRegistryUser(request: Request, env: RuntimeEnv): Promise<RegistryUser> {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) throw new RegistryAuthError(401, "missing access token");
  const parts = token.split(".");
  if (parts.length !== 3) throw new RegistryAuthError(401, "invalid access token");

  let header: JwtHeader;
  let payload: JwtPayload;
  try {
    header = decodeBase64UrlJson<JwtHeader>(parts[0]);
    payload = decodeBase64UrlJson<JwtPayload>(parts[1]);
  } catch {
    throw new RegistryAuthError(401, "invalid access token");
  }
  if (header.alg !== "RS256" || !header.kid) throw new RegistryAuthError(401, "unsupported access token");
  if (!audienceMatches(payload.aud, env.CF_ACCESS_AUD)) throw new RegistryAuthError(401, "wrong access audience");
  if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new RegistryAuthError(401, "expired access token");
  if (!payload.email) throw new RegistryAuthError(401, "missing access email");

  const jwks = await getJwks(env);
  const jwk = jwks.keys.find((candidate) => candidate.kid === header.kid);
  if (!jwk) throw new RegistryAuthError(401, "unknown access signing key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeBase64UrlBuffer(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!valid) throw new RegistryAuthError(401, "invalid access signature");

  const email = payload.email.trim().toLowerCase();
  const admins = emailSet(env.REGISTRY_ADMIN_EMAILS);
  const advisors = emailSet(env.REGISTRY_ADVISOR_EMAILS);
  if (admins.has(email)) return { email, role: "admin" };
  if (advisors.has(email)) return { email, role: "advisor" };
  throw new RegistryAuthError(403, "registry access denied");
}

export function clearRegistryAuthCacheForTests(): void {
  cachedJwks = null;
}
