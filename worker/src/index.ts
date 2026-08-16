import { AiServiceError, generateSalesReply } from "./chat";
import { submitLead } from "./leads";
import { parseChatRequest, parseLeadSubmission } from "./types";

const MAX_BODY_BYTES = 32 * 1024;

type RuntimeEnv = Env & {
  OPENAI_API_KEY: string;
  RESEND_API_KEY: string;
  OPENAI_MODEL: string;
  LEAD_RECIPIENT: string;
  LEAD_FROM_EMAIL: string;
  ALLOWED_ORIGINS: string;
};

function allowedOrigins(env: RuntimeEnv): Set<string> {
  return new Set(env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean));
}

function corsHeaders(origin: string | null, env: RuntimeEnv): Headers {
  const headers = new Headers();
  if (origin && allowedOrigins(env).has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
    headers.set("Vary", "Origin");
  }
  return headers;
}

function jsonResponse(data: unknown, status: number, origin: string | null, env: RuntimeEnv): Response {
  const headers = corsHeaders(origin, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { status, headers });
}

function emptyResponse(status: number, origin: string | null, env: RuntimeEnv): Response {
  return new Response(null, { status, headers: corsHeaders(origin, env) });
}

function originAllowed(request: Request, env: RuntimeEnv): boolean {
  const origin = request.headers.get("Origin");
  return Boolean(origin && allowedOrigins(env).has(origin));
}

async function readJsonBody(request: Request): Promise<unknown> {
  const lengthHeader = request.headers.get("Content-Length");
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      throw new BodyTooLargeError();
    }
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new BodyTooLargeError();
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidRequestError();
  }
}

class InvalidRequestError extends Error {}
class BodyTooLargeError extends Error {}

async function rateLimit(binding: RateLimit, key: string): Promise<boolean> {
  const result = await binding.limit({ key });
  return result.success;
}

export async function handleRequest(request: Request, env: RuntimeEnv): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const requestId = crypto.randomUUID();

  if (request.method === "GET" && url.pathname === "/health") {
    return jsonResponse({ ok: true }, 200, origin, env);
  }

  if (request.method === "OPTIONS") {
    if (!originAllowed(request, env)) return emptyResponse(403, origin, env);
    return emptyResponse(204, origin, env);
  }

  if (request.method !== "POST" || (url.pathname !== "/v1/chat" && url.pathname !== "/v1/leads")) {
    return jsonResponse({ error: "not_found" }, 404, origin, env);
  }

  if (!originAllowed(request, env)) {
    return jsonResponse({ error: "origin_not_allowed" }, 403, origin, env);
  }

  try {
    const raw = await readJsonBody(request);

    if (url.pathname === "/v1/chat") {
      let chatRequest;
      try {
        chatRequest = parseChatRequest(raw);
      } catch {
        throw new InvalidRequestError();
      }

      if (!(await rateLimit(env.CHAT_RATE_LIMITER, `chat:${chatRequest.sessionId}`))) {
        return jsonResponse({ error: "rate_limited" }, 429, origin, env);
      }

      try {
        const result = await generateSalesReply(env, chatRequest);
        return jsonResponse(result, 200, origin, env);
      } catch (error) {
        if (error instanceof AiServiceError) {
          return jsonResponse({ error: "ai_unavailable", requestId }, 503, origin, env);
        }
        throw error;
      }
    }

    let leadRequest;
    try {
      leadRequest = parseLeadSubmission(raw);
    } catch {
      throw new InvalidRequestError();
    }

    if (!(await rateLimit(env.LEAD_RATE_LIMITER, `lead:${leadRequest.sessionId}`))) {
      return jsonResponse({ error: "rate_limited" }, 429, origin, env);
    }

    const result = await submitLead(env, leadRequest);
    if (!result.ok) return jsonResponse(result, 502, origin, env);
    return jsonResponse(result, 200, origin, env);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return jsonResponse({ error: "payload_too_large" }, 413, origin, env);
    }
    if (error instanceof InvalidRequestError) {
      return jsonResponse({ error: "invalid_request" }, 400, origin, env);
    }
    console.error("ai_sales_error", { requestId, category: "unhandled" });
    return jsonResponse({ error: "service_unavailable", requestId }, 503, origin, env);
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env as RuntimeEnv);
  }
};
