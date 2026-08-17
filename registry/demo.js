if (new URLSearchParams(location.search).get("demo") === "1") {
  const sampleProjects = [
    {
      id: "VAN-SHIP-2026-001", internalName: "LNG Carrier — Internal Sample", publicTitle: "LNG Carrier — Asia", primaryCategory: "SHIP",
      secondaryTags: ["MARITIME", "ENERGY"], country: "Japan", region: "Kanto", transactionType: "Asset Acquisition", status: "Approved",
      indicativeValue: 35000000, currency: "USD", priceDisplayMode: "Range", priceMin: 30000000, priceMax: 40000000,
      sellerOwner: "Confidential seller", sourceIntroducer: "Direct relationship", authorizationStatus: "Under review", confidentialityLevel: "NDA Access",
      publicVisible: true, publicTeaser: "Selected maritime asset opportunity for qualified cross-border buyers.",
      publicHighlights: ["Maritime", "Asia", "Qualified buyers"], publicLocation: "Asia",
      details: { vesselType: "LNG Carrier", vesselName: "Internal only", imoNumber: "Internal only", buildYear: 2018, classificationSociety: "Class details on request", currentLocation: "Asia", deliveryWindow: "Subject to discussion" },
      internalNotes: "Demo content only — not a live mandate.", internalOwner: "Vantora Advisory", files: []
    },
    {
      id: "VAN-SOLAR-2026-001", internalName: "Japan Solar Portfolio — Sample", publicTitle: "Operating Solar Asset — Japan", primaryCategory: "SOLAR",
      secondaryTags: ["RENEWABLE", "ENERGY"], country: "Japan", region: "Japan", transactionType: "Project Investment", status: "Draft",
      indicativeValue: null, currency: "JPY", priceDisplayMode: "Hidden", priceMin: null, priceMax: null,
      sellerOwner: "Confidential", sourceIntroducer: "Partner", authorizationStatus: "Pending", confidentialityLevel: "Internal Only", publicVisible: false,
      publicTeaser: "Renewable-energy asset screening and transaction coordination.", publicHighlights: ["Solar", "Japan"], publicLocation: "Japan",
      details: { capacityMw: 24, supportStructure: "FIT / FIP review", gridConnectionStatus: "Connected", landStatus: "Documentation review" },
      internalNotes: "Demo content only — not a live mandate.", internalOwner: "Vantora Advisory", files: []
    },
    {
      id: "VAN-AIR-2026-001", internalName: "Wide-body Aircraft — Sample", publicTitle: "Wide-body Aircraft Opportunity", primaryCategory: "AIR",
      secondaryTags: ["AVIATION"], country: "Japan", region: "Asia", transactionType: "Asset Acquisition", status: "Submitted",
      indicativeValue: null, currency: "USD", priceDisplayMode: "Hidden", priceMin: null, priceMax: null,
      sellerOwner: "Confidential owner", sourceIntroducer: "Aviation partner", authorizationStatus: "Pending", confidentialityLevel: "NDA Access", publicVisible: false,
      publicTeaser: "Selected aviation asset opportunity subject to qualification and records review.", publicHighlights: ["Aviation", "Wide-body"], publicLocation: "Asia",
      details: { aircraftModel: "Wide-body aircraft", manufacturer: "Manufacturer on request", serialNumber: "Internal only", registration: "Internal only", maintenanceStatus: "Records review" },
      internalNotes: "Demo content only — not a live mandate.", internalOwner: "Vantora Advisory", files: []
    },
    {
      id: "VAN-CRE-2026-001", internalName: "Industrial Land — Sample", publicTitle: "Industrial Development Site — Japan", primaryCategory: "CRE",
      secondaryTags: ["LAND", "FACTORY", "LOGISTICS"], country: "Japan", region: "Chubu", transactionType: "Asset Acquisition", status: "Approved",
      indicativeValue: null, currency: "JPY", priceDisplayMode: "Hidden", priceMin: null, priceMax: null,
      sellerOwner: "Confidential landowner", sourceIntroducer: "Local partner", authorizationStatus: "Verified", confidentialityLevel: "Teaser", publicVisible: true,
      publicTeaser: "Industrial land opportunity suitable for selected logistics or industrial uses, subject to planning review.",
      publicHighlights: ["Industrial land", "Japan", "Development potential"], publicLocation: "Chubu, Japan",
      details: { propertyType: "Industrial Land", address: "Internal only", landArea: "Approx. area on request", zoning: "Under review", roadAccess: "Available", industrialSuitability: "Preliminary review" },
      internalNotes: "Demo content only — not a live mandate.", internalOwner: "Vantora Advisory", files: []
    }
  ];

  queueMicrotask(() => {
    projects = sampleProjects;
    currentProject = null;
    document.querySelector("#accessState").textContent = "DEMO / NON-PERSISTENT";
    notice("Presentation mode — sample data only. Nothing on this page is a live mandate and changes are not saved.");
    renderProjects();
    fillForm(sampleProjects[0]);
    document.querySelectorAll("#projectForm button, #fileForm button, #fileForm input, #fileForm select, #newProjectButton").forEach((el) => { el.disabled = true; });
  });
}
