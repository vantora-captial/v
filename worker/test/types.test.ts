import { describe, expect, it } from "vitest";
import { parseChatRequest, parseLeadSubmission } from "../src/types";

describe("parseChatRequest", () => {
  it("accepts a bounded chat request", () => {
    const result = parseChatRequest({
      sessionId: "session-12345678",
      language: "zh",
      messages: [{ role: "user", content: "我们想收购日本企业" }],
      lead: {}
    });
    expect(result.sessionId).toBe("session-12345678");
  });

  it("rejects more than 12 messages", () => {
    expect(() => parseChatRequest({
      sessionId: "session-12345678",
      language: "en",
      messages: Array.from({ length: 13 }, () => ({ role: "user", content: "x" })),
      lead: {}
    })).toThrow();
  });
});

describe("parseLeadSubmission", () => {
  it("rejects a submission that is not explicitly confirmed", () => {
    expect(() => parseLeadSubmission({
      confirmed: false,
      sessionId: "session-12345678",
      language: "en",
      lead: {},
      conversationSummary: "x"
    })).toThrow();
  });

  it("requires at least one contact channel", () => {
    expect(() => parseLeadSubmission({
      confirmed: true,
      sessionId: "session-12345678",
      language: "en",
      lead: {},
      conversationSummary: "x"
    })).toThrow();
  });
});
