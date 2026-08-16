import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLeadEmailText, buildLeadSubject, submitLead } from "../src/leads";
import type { LeadFields, LeadSubmissionRequest } from "../src/types";

const lead: LeadFields = {
  name: "Aya Test",
  company: "Example Holdings",
  email: "buyer@example.com",
  phone: null,
  countryRegion: "China → Japan",
  userType: "buyer",
  opportunityType: "M&A",
  stage: "Initial screening",
  sizeBudget: "¥500M–1B",
  timeline: "Within 6 months"
};

const request: LeadSubmissionRequest = {
  confirmed: true,
  sessionId: "session-12345678",
  language: "en",
  lead,
  conversationSummary: "Buyer is seeking a Japanese logistics company and wants a human follow-up."
};

const env = {
  RESEND_API_KEY: "test-resend-secret",
  LEAD_RECIPIENT: "aya@u-pex.com",
  LEAD_FROM_EMAIL: "Vantora AI <leads@u-pex.com>"
} as Env & { RESEND_API_KEY: string };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("lead email formatting", () => {
  it("uses the required concise subject format and strips CR/LF header injection", () => {
    expect(buildLeadSubject(lead)).toBe("New AI Lead | M&A | China → Japan | ¥500M–1B");
    expect(buildLeadSubject({ ...lead, opportunityType: "M&A\r\nBcc: attacker@example.com" }))
      .toBe("New AI Lead | M&A Bcc: attacker@example.com | China → Japan | ¥500M–1B");
  });

  it("renders missing values as Not provided and keeps the required field order", () => {
    const text = buildLeadEmailText({
      ...request,
      lead: { ...lead, phone: null, sizeBudget: null }
    }, "2026-08-16T02:00:00.000Z");

    expect(text).toContain("Phone: Not provided");
    expect(text).toContain("Size / budget: Not provided");
    const labels = [
      "Submission timestamp:", "User language:", "Name:", "Company:", "Email:", "Phone:",
      "Country / region:", "User type:", "Opportunity / service type:", "Stage:", "Size / budget:",
      "Timeline:", "Requirement summary:", "Recommended next action:", "Conversation summary:"
    ];
    let previous = -1;
    for (const label of labels) {
      const index = text.indexOf(label);
      expect(index).toBeGreaterThan(previous);
      previous = index;
    }
    expect(text).toContain("Recommended next action: Human advisor follow-up");
  });
});

describe("submitLead", () => {
  it("sends only to the server-configured recipient through Resend", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ id: "resend-test-id" }), { status: 200, headers: { "content-type": "application/json" } })
    );
    vi.stubGlobal("fetch", fetchMock);

    const maliciousBrowserRequest = {
      ...request,
      recipient: "attacker@example.com",
      to: "attacker@example.com"
    } as LeadSubmissionRequest & { recipient: string; to: string };

    const result = await submitLead(env, maliciousBrowserRequest);

    expect(result.ok).toBe(true);
    expect(result.submissionId).toMatch(/^[0-9a-f-]{36}$/i);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init?.headers).get("authorization")).toBe("Bearer test-resend-secret");
    const body = JSON.parse(String(init?.body));
    expect(body.to).toEqual(["aya@u-pex.com"]);
    expect(body.from).toBe("Vantora AI <leads@u-pex.com>");
    expect(body.reply_to).toBe("buyer@example.com");
    expect(JSON.stringify(body)).not.toContain("attacker@example.com");
    expect(JSON.stringify(result)).not.toContain("test-resend-secret");
  });

  it("returns email_failed when Resend rejects delivery", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response("private provider diagnostic", { status: 500 })
    ));

    await expect(submitLead(env, request)).resolves.toEqual({ ok: false, error: "email_failed" });
  });
});
