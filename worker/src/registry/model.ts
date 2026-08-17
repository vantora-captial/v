export const PROJECT_CATEGORIES = ["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["Draft", "Submitted", "Approved", "Archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const CONFIDENTIALITY_LEVELS = ["Internal Only", "Teaser", "NDA Access"] as const;
export type ConfidentialityLevel = (typeof CONFIDENTIALITY_LEVELS)[number];

export const PRICE_DISPLAY_MODES = ["Hidden", "Range", "Exact"] as const;
export type PriceDisplayMode = (typeof PRICE_DISPLAY_MODES)[number];

export const SECONDARY_TAGS = [
  "LAND", "LOGISTICS", "FACTORY", "HOTEL", "RENEWABLE", "AVIATION", "MARITIME", "ENERGY", "BESS", "SOLAR", "DATA_CENTER"
] as const;
export type SecondaryTag = (typeof SECONDARY_TAGS)[number];

export type ProjectFileRecord = {
  id: string;
  projectId: string;
  kind: string;
  objectKey: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  publicApproved: boolean;
  createdAt: string;
};

export type ProjectInput = {
  internalName: string;
  publicTitle: string | null;
  primaryCategory: ProjectCategory;
  secondaryTags: string[];
  country: string;
  region: string | null;
  transactionType: string;
  indicativeValue: number | null;
  currency: string | null;
  priceDisplayMode: PriceDisplayMode;
  priceMin: number | null;
  priceMax: number | null;
  sellerOwner: string | null;
  sourceIntroducer: string | null;
  authorizationStatus: string | null;
  confidentialityLevel: ConfidentialityLevel;
  publicVisible: boolean;
  publicTeaser: string | null;
  publicHighlights: string[];
  publicLocation: string | null;
  details: Record<string, unknown>;
  internalNotes: string | null;
  internalOwner: string | null;
};

export type ProjectRecord = ProjectInput & {
  id: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  files: ProjectFileRecord[];
};

export type PublicPrice =
  | { mode: "Hidden" }
  | { mode: "Range"; currency: string | null; min: number; max: number }
  | { mode: "Exact"; currency: string | null; value: number };

export type PublicProject = {
  id: string;
  publicTitle: string | null;
  category: ProjectCategory;
  region: string | null;
  transactionType: string;
  price: PublicPrice;
  teaser: string | null;
  highlights: string[];
  imageKeys: string[];
};

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return typeof value === "string" && PROJECT_CATEGORIES.includes(value as ProjectCategory);
}

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && PROJECT_STATUSES.includes(value as ProjectStatus);
}

export function isConfidentialityLevel(value: unknown): value is ConfidentialityLevel {
  return typeof value === "string" && CONFIDENTIALITY_LEVELS.includes(value as ConfidentialityLevel);
}

export function isPriceDisplayMode(value: unknown): value is PriceDisplayMode {
  return typeof value === "string" && PRICE_DISPLAY_MODES.includes(value as PriceDisplayMode);
}
