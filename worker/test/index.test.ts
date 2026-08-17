import { afterEach, describe, expect, it, vi } from "vitest";
import { handleRequest } from "../src/index";

class FakeRateLimit {
  calls: string[] = [];
  private counts = new Map<string, number>();
  constructor(private readonly allowed: number) {}
  async limit({ key }: { key: string }) {
    this.calls.push(key);
    const next = (this.counts.get(key) || 0) + 1;
    this.counts.set(key, next);
    return { success: next <= this.allowed };
  }
}

function makeEnv(chatAllowed = 20, leadAllowed = 5) {
  return {
    OPENAI_MODEL: "gpt-5.6",
    OPENAI_API_KEY: "test-openai-secret",
    RESEND_API_KEY: "test-resend-secret",
    LEAD_RECIPIENT: "aya@u-pex.com",
    LEAD_FROM_EMAIL: "Vantora AI <leads@u-pex.com>",
    ALLOWED_ORIGINS: "https://vantora-captial.github.io,http://127.0.0.1:8000",
    CHAT_RATE_LIMITER: new FakeRateLimit(chatAllowed),
    LEAD_RATE_LIMITER: new FakeRateLimit(leadAllowed)
  };
}

const allowedOrigin = "https://vantora-captial.github.io";
const chatBody = {
  sessionId: "session-12345678",
  language: "en",
  messages: [{ role: "user", content: "We are evaluating Japan M&A." }],
  lead: {}
};

const structuredReply = {
  assistantMessage: "Understood. What stage are you at?",
  language: "en",
  lead: {
    name: null, company: null, email: null, phone: null, countryRegion: null,
    userType: null, opportunityType: "M&A", stage: null, sizeBudget: null, timeline: null
  },
  status: "collecting",
  needsConfirmation: false
};

afterEach(() => vi.unstubAllGlobals());

describe("AI sales Worker router", () => {
  it("serves health without calling external services", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(new Request("https://worker.example/health"), makeEnv() as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reflects only an allowed CORS origin and handles preflight", async () => {
    const response = await handleRequest(new Request("https://worker.example/v1/chat", {
      method: "OPTIONS",
      headers: { Origin: allowedOrigin }
    }), makeEnv() as never);
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(allowedOrigin);
    expect(response.headers.get("vary")).toContain("Origin");
  });

  it("rejects a POST from an unapproved origin without permissive CORS", async () => {
    const response = await handleRequest(new Request("https://worker.example/v1/chat", {
      method: "POST",
      headers: { Origin: "https://evil.example", "Content-Type": "application/json" },
      body: JSON.stringify(chatBody)
    }), makeEnv() as never);
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("rejects request bodies larger than 32 KB", async () => {
    const oversized = JSON.stringify({ ...chatBody, padding: "x".repeat(33 * 1024) });
    const response = await handleRequest(new Request("https://worker.example/v1/chat", {
      method: "POST",
      headers: { Origin: allowedOrigin, "Content-Type": "application/json" },
      body: oversized
    }), makeEnv() as never);
    expect(response.status).toBe(413);
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await handleRequest(new Request("https://worker.example/v1/chat", {
      method: "POST",
      headers: { Origin: allowedOrigin, "Content-Type": "application/json" },
      body: "{not-json"
    }), makeEnv() as never);
    expect(response.status).toBe(400);
  });

  it("validates chat input before calling OpenAI", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(new Request("https://worker.example/v1/chat", {
      method: "POST",
      headers: { Origin: allowedOrigin, "Content-Type": "application/json" },
      body: JSON.stringify({ ...chatBody, messages: Array.from({ length: 13 }, () => ({ role: "user", content: "x" })) })
    }), makeEnv() as never);
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an unconfirmed lead before calling Resend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(new Request("https://worker.example/v1/leads", {
      method: "POST",
      headers: { Origin: allowedOrigin, "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmed: false,
        sessionId: "session-12345678",
        language: "en",
        lead: { email: "buyer@example.com" },
        conversationSummary: "test"
      })
    }), makeEnv() as never);
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses chat:<sessionId> as the rate-limit key and returns 429 when denied", async () => {
    const env = makeEnv(1, 5);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(structuredReply) }] }]
    }), { status: 200 })));

    const makeRequest = () => new Request("https://worker.example/v1/chat", {
      method: "POST",
      headers: { Origin: allowedOrigin, "Content-Type": "application/json" },
      body: JSON.stringify(chatBody)
    });

    expect((await handleRequest(makeRequest(), env as never)).status).toBe(200);
    expect((await handleRequest(makeRequest(), env as never)).status).toBe(429);
    expect(env.CHAT_RATE_LIMITER.calls).toEqual(["chat:session-12345678", "chat:session-12345678"]);
    expect(env.LEAD_RATE_LIMITER.calls).toEqual([]);
  });
});
