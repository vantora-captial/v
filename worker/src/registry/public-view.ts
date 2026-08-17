import type { ProjectRecord, PublicPrice, PublicProject } from "./model";

function sanitizePrice(project: ProjectRecord): PublicPrice {
  if (project.priceDisplayMode === "Exact" && project.indicativeValue !== null) {
    return { mode: "Exact", currency: project.currency, value: project.indicativeValue };
  }
  if (project.priceDisplayMode === "Range" && project.priceMin !== null && project.priceMax !== null) {
    return { mode: "Range", currency: project.currency, min: project.priceMin, max: project.priceMax };
  }
  return { mode: "Hidden" };
}

export function toPublicProject(project: ProjectRecord): PublicProject | null {
  if (project.status !== "Approved" || !project.publicVisible) return null;
  return {
    id: project.id,
    publicTitle: project.publicTitle,
    category: project.primaryCategory,
    region: project.publicLocation,
    transactionType: project.transactionType,
    price: sanitizePrice(project),
    teaser: project.publicTeaser,
    highlights: project.publicHighlights,
    imageKeys: project.files.filter((file) => file.publicApproved && file.kind === "image").map((file) => file.objectKey)
  };
}
