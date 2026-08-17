import { afterEach, describe, expect, it, vi } from "vitest";
import { AiServiceError, generateSalesReply } from "../src/chat";
import type { ChatRequest } from "../src/types";

const request: ChatRequest = {
  sessionId: "session-12345678",
  language: "en",
  messages: [{ role: "user", content: "We want to acquire a Japanese company." }],
  lead: { countryRegion: "China" }
};

const env = {
  OPENAI_API_KEY: "test-openai-secret",
  OPENAI_MODEL: "gpt-5.6"
} as Env & { OPENAI_API_KEY: string };

const structuredReply = {
  assistantMessage: "Understood. Which stage best describes the acquisition process?",
  language: "en",
  lead: {
    name: null,
    company: null,
    email: null,
    phone: null,
    countryRegion: "China",
    userType: "buyer",
    opportunityType: "Japanese company / M&A",
    stage: null,
    sizeBudget: null,
    timeline: null
  },
  status: "collecting",
  needsConfirmation: false
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("generateSalesReply", () => {
  it("calls the Responses API with server-side auth, store false, and strict JSON schema", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) =>
      new Response(JSON.stringify({
        output: [{
          type: "message",
          content: [{ type: "output_text", text: JSON.stringify(structuredReply) }]
        }]
      }), { status: 200, headers: { "content-type": "application/json" } })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateSalesReply(env, request);

    expect(result).toEqual(structuredReply);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/responses");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("authorization")).toBe("Bearer test-openai-secret");

    const body = JSON.parse(String(init?.body));
    expect(body.model).toBe("gpt-5.6");
    expect(body.store).toBe(false);
    expect(body.tools).toBeUndefined();
    expect(body.text.format.type).toBe("json_schema");
    expect(body.text.format.name).toBe("vantora_sales_reply");
    expect(body.text.format.strict).toBe(true);
    expect(body.text.format.schema.required).toEqual([
      "assistantMessage",
      "language",
      "lead",
      "status",
      "needsConfirmation"
    ]);
    expect(body.text.format.schema.properties.lead.required).toEqual([
      "name",
      "company",
      "email",
      "phone",
      "countryRegion",
      "userType",
      "opportunityType",
      "stage",
      "sizeBudget",
      "timeline"
    ]);
  });

  it("parses output_text even when it is not the first output item", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({
        output: [
          { type: "reasoning", summary: [] },
          { type: "message", content: [{ type: "output_text", text: JSON.stringify(structuredReply) }] }
        ]
      }), { status: 200 })
    ));

    await expect(generateSalesReply(env, request)).resolves.toEqual(structuredReply);
  });

  it("maps an upstream failure to AiServiceError without exposing the upstream body", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response("SECRET upstream diagnostics that must not escape", { status: 429 })
    ));

    let caught: unknown;
    try {
      await generateSalesReply(env, request);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AiServiceError);
    expect((caught as Error).message).toBe("AI service unavailable");
    expect((caught as Error).message).not.toContain("SECRET upstream diagnostics");
  });

  it("rejects model output that violates the ChatResponse contract", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({
        output: [{
          type: "message",
          content: [{ type: "output_text", text: JSON.stringify({ ...structuredReply, language: "fr" }) }]
        }]
      }), { status: 200 })
    ));

    await expect(generateSalesReply(env, request)).rejects.toBeInstanceOf(AiServiceError);
  });
});
