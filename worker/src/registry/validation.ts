import {
  CONFIDENTIALITY_LEVELS,
  PRICE_DISPLAY_MODES,
  PROJECT_CATEGORIES,
  isConfidentialityLevel,
  isPriceDisplayMode,
  isProjectCategory,
  type ProjectInput
} from "./model";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, name: string, max = 4000): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) throw new Error(`${name} must be a string up to ${max} characters`);
  return value.trim();
}

function requiredString(value: unknown, name: string, max = 4000): string {
  const result = optionalString(value, name, max);
  if (!result) throw new Error(`${name} is required`);
  return result;
}

function optionalNumber(value: unknown, name: string): number | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${name} must be a finite number`);
  return value;
}

function optionalBoolean(value: unknown, name: string, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new Error(`${name} must be a boolean`);
  return value;
}

function stringArray(value: unknown, name: string, maxItems = 20): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > maxItems) throw new Error(`${name} must be an array with at most ${maxItems} items`);
  return value.map((entry, index) => requiredString(entry, `${name}[${index}]`, 200));
}

function requireDetailString(details: Record<string, unknown>, key: string): void {
  requiredString(details[key], `details.${key}`, 1000);
}

function requireDetailNumber(details: Record<string, unknown>, key: string): void {
  const value = details[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`details.${key} must be a finite number`);
}

function validateDetails(category: ProjectInput["primaryCategory"], details: Record<string, unknown>): void {
  switch (category) {
    case "MA": requireDetailString(details, "industry"); break;
    case "BESS": requireDetailNumber(details, "ratedPowerMw"); break;
    case "SOLAR": requireDetailNumber(details, "capacityMw"); break;
    case "SHIP": requireDetailString(details, "vesselType"); break;
    case "AIR": requireDetailString(details, "aircraftModel"); break;
    case "DC": requireDetailString(details, "projectType"); break;
    case "CRE": requireDetailString(details, "propertyType"); break;
    case "STRAT": requireDetailString(details, "partnershipObjective"); break;
  }
}

export function parseProjectInput(value: unknown): ProjectInput {
  if (!isRecord(value)) throw new Error("project must be an object");
  if (!isProjectCategory(value.primaryCategory)) {
    throw new Error(`primaryCategory must be one of ${PROJECT_CATEGORIES.join(", ")}`);
  }

  const details = isRecord(value.details) ? value.details : {};
  const priceDisplayMode = value.priceDisplayMode === undefined ? "Hidden" : value.priceDisplayMode;
  if (!isPriceDisplayMode(priceDisplayMode)) throw new Error(`priceDisplayMode must be one of ${PRICE_DISPLAY_MODES.join(", ")}`);
  const confidentialityLevel = value.confidentialityLevel === undefined ? "Internal Only" : value.confidentialityLevel;
  if (!isConfidentialityLevel(confidentialityLevel)) throw new Error(`confidentialityLevel must be one of ${CONFIDENTIALITY_LEVELS.join(", ")}`);

  const indicativeValue = optionalNumber(value.indicativeValue, "indicativeValue");
  const priceMin = optionalNumber(value.priceMin, "priceMin");
  const priceMax = optionalNumber(value.priceMax, "priceMax");
  if (priceDisplayMode === "Exact" && indicativeValue === null) throw new Error("indicativeValue is required when priceDisplayMode is Exact");
  if (priceDisplayMode === "Range") {
    if (priceMin === null || priceMax === null) throw new Error("priceMin and priceMax are required when priceDisplayMode is Range");
    if (priceMin > priceMax) throw new Error("priceMin must be less than or equal to priceMax");
  }

  validateDetails(value.primaryCategory, details);

  return {
    internalName: requiredString(value.internalName, "internalName", 300),
    publicTitle: optionalString(value.publicTitle, "publicTitle", 300),
    primaryCategory: value.primaryCategory,
    secondaryTags: stringArray(value.secondaryTags, "secondaryTags"),
    country: requiredString(value.country, "country", 120),
    region: optionalString(value.region, "region", 200),
    transactionType: requiredString(value.transactionType, "transactionType", 200),
    indicativeValue,
    currency: optionalString(value.currency, "currency", 20),
    priceDisplayMode,
    priceMin,
    priceMax,
    sellerOwner: optionalString(value.sellerOwner, "sellerOwner", 500),
    sourceIntroducer: optionalString(value.sourceIntroducer, "sourceIntroducer", 500),
    authorizationStatus: optionalString(value.authorizationStatus, "authorizationStatus", 500),
    confidentialityLevel,
    publicVisible: optionalBoolean(value.publicVisible, "publicVisible", false),
    publicTeaser: optionalString(value.publicTeaser, "publicTeaser", 4000),
    publicHighlights: stringArray(value.publicHighlights, "publicHighlights", 12),
    publicLocation: optionalString(value.publicLocation, "publicLocation", 300),
    details,
    internalNotes: optionalString(value.internalNotes, "internalNotes", 12000),
    internalOwner: optionalString(value.internalOwner, "internalOwner", 300)
  };
}

export function parseProjectPatch(value: unknown): Partial<ProjectInput> {
  if (!isRecord(value)) throw new Error("project patch must be an object");
  const merged = parseProjectInput({
    internalName: value.internalName ?? "__patch__",
    primaryCategory: value.primaryCategory ?? "MA",
    country: value.country ?? "__patch__",
    transactionType: value.transactionType ?? "__patch__",
    details: value.details ?? { industry: "__patch__" },
    ...value
  });
  const result: Partial<ProjectInput> = {};
  for (const key of Object.keys(value) as (keyof ProjectInput)[]) {
    if (key in merged) result[key] = merged[key] as never;
  }
  return result;
}
