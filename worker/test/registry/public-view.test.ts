import { describe, expect, it } from "vitest";
import { toPublicProject } from "../../src/registry/public-view";
import type { ProjectRecord } from "../../src/registry/model";

function project(overrides: Partial<ProjectRecord> = {}): ProjectRecord {
  return {
    id: "VAN-SHIP-2026-001",
    internalName: "Confidential Vessel Name",
    publicTitle: "LNG Carrier — Asia",
    primaryCategory: "SHIP",
    secondaryTags: ["MARITIME"],
    country: "Japan",
    region: "Tokyo",
    transactionType: "Asset Acquisition",
    status: "Approved",
    indicativeValue: 35000000,
    currency: "USD",
    priceDisplayMode: "Range",
    priceMin: 30000000,
    priceMax: 40000000,
    sellerOwner: "Confidential Seller",
    sourceIntroducer: "Private Introducer",
    authorizationStatus: "Verified",
    confidentialityLevel: "Teaser",
    publicVisible: true,
    publicTeaser: "Selected maritime asset opportunity.",
    publicHighlights: ["Asia", "Qualified buyers"],
    publicLocation: "Asia",
    details: { vesselType: "LNG Carrier", vesselName: "SECRET", imoNumber: "1234567" },
    internalNotes: "Do not disclose",
    internalOwner: "advisor@example.com",
    createdAt: "2026-08-17T00:00:00.000Z",
    updatedAt: "2026-08-17T00:00:00.000Z",
    files: [
      { id: "f1", projectId: "VAN-SHIP-2026-001", kind: "image", objectKey: "public-image", originalName: "a.jpg", contentType: "image/jpeg", sizeBytes: 10, publicApproved: true, createdAt: "2026-08-17T00:00:00.000Z" },
      { id: "f2", projectId: "VAN-SHIP-2026-001", kind: "im", objectKey: "secret-im", originalName: "im.pdf", contentType: "application/pdf", sizeBytes: 10, publicApproved: false, createdAt: "2026-08-17T00:00:00.000Z" }
    ],
    ...overrides
  };
}

describe("public project projection", () => {
  it("returns only sanitized teaser fields", () => {
    const result = toPublicProject(project());
    expect(result).not.toBeNull();
    const json = JSON.stringify(result);
    expect(json).not.toContain("Confidential Seller");
    expect(json).not.toContain("Do not disclose");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("1234567");
    expect(json).not.toContain("secret-im");
    expect(json).toContain("public-image");
  });

  it("hides projects that are not approved and public", () => {
    expect(toPublicProject(project({ status: "Draft" }))).toBeNull();
    expect(toPublicProject(project({ publicVisible: false }))).toBeNull();
  });
});
