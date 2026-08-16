import { describe, expect, it } from "vitest";
import { APPROVED_KNOWLEDGE, SYSTEM_INSTRUCTIONS, buildKnowledgeContext } from "../src/knowledge";

describe("approved knowledge", () => {
  it("contains only the approved Vantora opportunity themes and paths", () => {
    const context = buildKnowledgeContext();
    expect(context).toContain("LNG");
    expect(context).toContain("BESS");
    expect(context).toContain("AI data center");
    expect(context).toContain("M&A");
    expect(context.toLowerCase()).toContain("investment mandate");
    expect(context.toLowerCase()).toContain("submit an opportunity");
    expect(APPROVED_KNOWLEDGE.languages).toEqual(["English", "Chinese", "Japanese"]);
  });

  it("encodes the integrity and regulated-sales boundaries", () => {
    const text = `${SYSTEM_INSTRUCTIONS}\n${buildKnowledgeContext()}`.toLowerCase();
    for (const phrase of [
      "returns",
      "live deal status",
      "counterparties",
      "unverified locations",
      "credentials",
      "accept money",
      "personalized investment recommendations"
    ]) {
      expect(text).toContain(phrase);
    }
  });

  it("requires same-language replies and forbids guessing lead fields", () => {
    const text = SYSTEM_INSTRUCTIONS.toLowerCase();
    expect(text).toContain("visitor's language");
    expect(text).toContain("not provided");
    expect(text).toContain("do not guess");
    expect(text).toContain("one or two qualification questions");
  });
});
