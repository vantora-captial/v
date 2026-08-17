import { describe, expect, it } from "vitest";
import { parseProjectInput } from "../../src/registry/validation";

const base = {
  internalName: "Test Project",
  country: "Japan",
  transactionType: "Asset Acquisition",
  primaryCategory: "SHIP",
  details: { vesselType: "LNG Carrier" }
};

describe("project validation", () => {
  it("defaults confidential fields to private", () => {
    const parsed = parseProjectInput(base);
    expect(parsed.publicVisible).toBe(false);
    expect(parsed.confidentialityLevel).toBe("Internal Only");
    expect(parsed.priceDisplayMode).toBe("Hidden");
  });

  it("rejects unapproved categories", () => {
    expect(() => parseProjectInput({ ...base, primaryCategory: "LAND" })).toThrow(/primaryCategory/);
  });

  it("requires exact price amount", () => {
    expect(() => parseProjectInput({ ...base, priceDisplayMode: "Exact" })).toThrow(/indicativeValue/);
  });

  it("requires category discriminator", () => {
    expect(() => parseProjectInput({ ...base, details: {} })).toThrow(/vesselType/);
  });
});
