import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_COPY,
  getUiCopy,
  createEmptyLead,
  normalizeLead,
  buildChatPayload,
  buildLeadPayload,
  buildSummaryRows,
  safeSessionId
} from "../../assets/ai-sales-core.mjs";

test("provides complete EN/ZH/JA concierge copy", () => {
  for (const language of ["en", "zh", "ja"]) {
    const copy = getUiCopy(language);
    assert.equal(copy.title, "Vantora AI Concierge");
    assert.ok(copy.intro.length > 10);
    assert.ok(copy.privacy.length > 10);
    assert.ok(copy.confirm.length > 0);
    assert.ok(copy.edit.length > 0);
    assert.ok(copy.retry.length > 0);
    assert.ok(copy.emailDirect.length > 0);
    assert.ok(copy.fallbackLabels.name.length > 0);
    assert.ok(copy.fallbackLabels.sizeBudget.length > 0);
  }
  assert.equal(AI_COPY.zh.confirm, "确认并发送");
  assert.equal(AI_COPY.ja.confirm, "確認して送信");
});

test("normalizes lead state without inventing missing values", () => {
  const empty = createEmptyLead();
  assert.equal(Object.values(empty).every((value) => value === null), true);

  const normalized = normalizeLead({
    company: "Example Holdings",
    countryRegion: "China",
    sizeBudget: "Not provided"
  });
  assert.equal(normalized.company, "Example Holdings");
  assert.equal(normalized.countryRegion, "China");
  assert.equal(normalized.sizeBudget, "Not provided");
  assert.equal(normalized.stage, null);
  assert.equal(normalized.email, null);
});

test("summary rows localize labels while preserving supplied lead values", () => {
  const rows = buildSummaryRows(normalizeLead({
    name: "Aya Test",
    company: "Example Holdings",
    countryRegion: "中国",
    opportunityType: "M&A"
  }), "zh");

  assert.equal(rows.find((row) => row.key === "countryRegion").label, "国家／地区");
  assert.equal(rows.find((row) => row.key === "countryRegion").value, "中国");
  assert.equal(rows.find((row) => row.key === "stage").value, "未提供");
});

test("chat payload sends at most the latest 12 messages including the new visitor message", () => {
  const state = {
    sessionId: "session-12345678",
    language: "en",
    messages: Array.from({ length: 14 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      content: `message-${index}`
    })),
    lead: createEmptyLead()
  };

  const payload = buildChatPayload(state, "latest-question");
  assert.equal(payload.messages.length, 12);
  assert.deepEqual(payload.messages.at(-1), { role: "user", content: "latest-question" });
  assert.equal(payload.messages[0].content, "message-4");
  assert.equal(payload.sessionId, "session-12345678");
});

test("lead payload requires explicit UI confirmation", () => {
  const base = {
    sessionId: "session-12345678",
    language: "ja",
    lead: normalizeLead({ email: "buyer@example.com" }),
    conversationSummary: "M&A enquiry"
  };

  assert.throws(() => buildLeadPayload({ ...base, confirmed: false }), /confirmation/i);
  assert.deepEqual(buildLeadPayload({ ...base, confirmed: true }), {
    confirmed: true,
    sessionId: "session-12345678",
    language: "ja",
    lead: base.lead,
    conversationSummary: "M&A enquiry"
  });
});

test("safeSessionId reuses a valid existing ID and creates a UUID otherwise", () => {
  assert.equal(safeSessionId("session-existing-123"), "session-existing-123");
  assert.match(safeSessionId(""), /^[0-9a-f-]{36}$/i);
});
