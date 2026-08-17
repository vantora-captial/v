import { describe, expect, it } from "vitest";
import { PROJECT_CATEGORIES, PROJECT_STATUSES, CONFIDENTIALITY_LEVELS, PRICE_DISPLAY_MODES, isProjectCategory } from "../../src/registry/model";

describe("project registry model", () => {
  it("uses the approved categories and states", () => {
    expect(PROJECT_CATEGORIES).toEqual(["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"]);
    expect(PROJECT_STATUSES).toEqual(["Draft", "Submitted", "Approved", "Archived"]);
    expect(CONFIDENTIALITY_LEVELS).toEqual(["Internal Only", "Teaser", "NDA Access"]);
    expect(PRICE_DISPLAY_MODES).toEqual(["Hidden", "Range", "Exact"]);
    expect(isProjectCategory("SHIP")).toBe(true);
    expect(isProjectCategory("LAND")).toBe(false);
  });
});
