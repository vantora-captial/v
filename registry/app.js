const CATEGORIES = ["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"];
const FIELD_SCHEMAS = {
  MA: [["industry","Industry","text"],["subIndustry","Sub-industry","text"],["revenueRange","Revenue range","text"],["ebitdaRange","EBITDA / operating profit","text"],["employeeRange","Employees","text"],["saleType","Sale type","text"],["sellerMotivation","Seller motivation","text"],["valuationExpectation","Valuation expectation","text"],["desiredBuyerProfile","Desired buyer profile","text"],["ddReadiness","DD readiness","text"],["pmiSupportRequired","PMI support required","text"]],
  BESS: [["ratedPowerMw","Rated power (MW)","number"],["storageCapacityMwh","Storage capacity (MWh)","number"],["durationHours","Duration (hours)","number"],["gridConnectionStatus","Grid connection status","text"],["landStatus","Land status","text"],["epcStatus","EPC status","text"],["batterySupplier","Battery supplier","text"],["targetCod","COD / target COD","text"],["revenueModel","Revenue model","text"],["financingStatus","Financing status","text"],["technicalDdStatus","Technical DD status","text"],["commercialDdStatus","Commercial DD status","text"]],
  SOLAR: [["capacityMw","Capacity (MW / MWp)","number"],["supportStructure","FIT / FIP / Merchant","text"],["supportPrice","FIT / FIP price","text"],["remainingSupportPeriod","Remaining support period","text"],["targetCod","COD / target COD","text"],["landStatus","Land ownership / lease","text"],["gridConnectionStatus","Grid connection status","text"],["epcOmProvider","EPC / O&M provider","text"],["annualGeneration","Annual generation estimate","text"],["financingStatus","Debt / financing status","text"],["permitsStatus","Permits / environmental status","text"]],
  SHIP: [["vesselType","Vessel type","text"],["vesselName","Vessel name (internal)","text"],["imoNumber","IMO number (internal)","text"],["flag","Flag","text"],["buildYear","Build year","number"],["shipyard","Shipyard","text"],["classificationSociety","Classification society","text"],["capacity","DWT / GT / capacity","text"],["mainEngine","Main engine / propulsion","text"],["currentLocation","Current location","text"],["charterStatus","Trading / charter status","text"],["surveyStatus","Inspection / survey status","text"],["deliveryWindow","Delivery window","text"]],
  AIR: [["aircraftModel","Aircraft model","text"],["manufacturer","Manufacturer","text"],["serialNumber","Serial number (internal)","text"],["registration","Registration (internal)","text"],["buildYear","Build year","number"],["configuration","Configuration","text"],["engineModel","Engine model","text"],["engineStatus","Engine status","text"],["flightHours","Flight hours","number"],["flightCycles","Flight cycles","number"],["maintenanceStatus","Maintenance status","text"],["airworthinessStatus","Airworthiness / records","text"],["currentLocation","Current location","text"],["leaseStatus","Lease status","text"],["deliveryAvailability","Delivery availability","text"]],
  DC: [["projectType","Project type","text"],["siteArea","Site area","text"],["itLoadMw","IT load target (MW)","number"],["powerSecuredMw","Power secured / requested (MW)","number"],["gridUtilityStatus","Grid / utility status","text"],["voltageSubstation","Voltage / substation","text"],["fiberConnectivity","Fiber / connectivity","text"],["waterCooling","Water / cooling","text"],["zoningStatus","Zoning / land-use","text"],["landStatus","Land ownership / lease","text"],["developmentPermits","Development permits","text"],["targetCod","Target COD","text"],["operatorTenantStatus","Operator / tenant status","text"]],
  CRE: [["propertyType","Property type","text"],["address","Address / location (internal)","text"],["landArea","Land area","text"],["buildingArea","Building area","text"],["zoning","Zoning","text"],["buildingCoverageRatio","Building coverage ratio","text"],["floorAreaRatio","Floor area ratio","text"],["currentUse","Current use","text"],["occupancy","Occupancy / tenancy","text"],["noiRentRoll","NOI / rent roll","text"],["yield","Yield","text"],["roadAccess","Road access","text"],["utilities","Utilities","text"],["industrialSuitability","Industrial / logistics suitability","text"],["developmentPotential","Development potential","text"],["environmentalStatus","Environmental / contamination","text"],["brokerageMandateStatus","Brokerage / seller mandate","text"]],
  STRAT: [["partnershipObjective","Partnership objective","text"],["companyProfile","Company / project profile","text"],["targetMarket","Target market","text"],["desiredPartnerType","Desired partner type","text"],["cooperationStructure","Cooperation structure","text"],["capitalParticipation","Capital participation","text"],["distributionObjective","Distribution / sales objective","text"],["jvObjective","JV objective","text"],["technologyLicensingObjective","Technology / licensing objective","text"],["geographicScope","Geographic scope","text"],["commercialRequirements","Commercial requirements","text"],["currentStage","Current stage","text"]]
};

const API_BASE = window.VANTORA_REGISTRY_API || "";
const $ = (selector) => document.querySelector(selector);
let projects = [];
let currentProject = null;

function api(path, options = {}) {
  return fetch(`${API_BASE}${path}`, { credentials: "include", ...options, headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) } }).then(async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;
    if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
    return payload;
  });
}

function notice(message, error = false) {
  const el = $("#notice"); el.hidden = !message; el.textContent = message || ""; el.classList.toggle("error", error);
}

function renderCategoryOptions() {
  for (const select of [$("#primaryCategory"), $("#categoryFilter")]) {
    if (select.id === "categoryFilter") select.innerHTML = '<option value="">All categories</option>';
    else select.innerHTML = "";
    CATEGORIES.forEach((category) => select.insertAdjacentHTML("beforeend", `<option value="${category}">${category}</option>`));
  }
}

function renderCategoryFields(category, values = {}) {
  const holder = $("#categoryFields"); holder.innerHTML = "";
  for (const [key, label, type] of FIELD_SCHEMAS[category] || []) {
    const node = document.createElement("label");
    node.textContent = label;
    const input = document.createElement("input"); input.name = `detail:${key}`; input.type = type; input.value = values[key] ?? "";
    if (["industry","ratedPowerMw","capacityMw","vesselType","aircraftModel","projectType","propertyType","partnershipObjective"].includes(key)) input.required = true;
    node.appendChild(input); holder.appendChild(node);
  }
}

function numeric(value) { return value === "" || value == null ? null : Number(value); }
function formPayload() {
  const form = new FormData($("#projectForm"));
  const details = {};
  document.querySelectorAll('[name^="detail:"]').forEach((input) => {
    const key = input.name.slice(7); if (input.value !== "") details[key] = input.type === "number" ? Number(input.value) : input.value;
  });
  return {
    internalName: form.get("internalName"), publicTitle: form.get("publicTitle") || null, primaryCategory: form.get("primaryCategory"),
    secondaryTags: String(form.get("secondaryTags") || "").split(",").map((x) => x.trim()).filter(Boolean), country: form.get("country"),
    region: form.get("region") || null, transactionType: form.get("transactionType"), indicativeValue: numeric(form.get("indicativeValue")),
    currency: form.get("currency") || null, priceDisplayMode: form.get("priceDisplayMode"), priceMin: numeric(form.get("priceMin")),
    priceMax: numeric(form.get("priceMax")), sellerOwner: form.get("sellerOwner") || null, sourceIntroducer: form.get("sourceIntroducer") || null,
    authorizationStatus: form.get("authorizationStatus") || null, confidentialityLevel: form.get("confidentialityLevel"),
    publicVisible: form.get("publicVisible") === "on", publicTeaser: form.get("publicTeaser") || null,
    publicHighlights: String(form.get("publicHighlights") || "").split("\n").map((x) => x.trim()).filter(Boolean), publicLocation: form.get("publicLocation") || null,
    details, internalNotes: form.get("internalNotes") || null, internalOwner: form.get("internalOwner") || null
  };
}

function fillForm(project) {
  currentProject = project;
  const form = $("#projectForm"); form.reset();
  const map = { internalName: project?.internalName || "", publicTitle: project?.publicTitle || "", primaryCategory: project?.primaryCategory || "MA", transactionType: project?.transactionType || "", country: project?.country || "Japan", region: project?.region || "", secondaryTags: (project?.secondaryTags || []).join(", "), internalOwner: project?.internalOwner || "", currency: project?.currency || "", indicativeValue: project?.indicativeValue ?? "", priceDisplayMode: project?.priceDisplayMode || "Hidden", priceMin: project?.priceMin ?? "", priceMax: project?.priceMax ?? "", authorizationStatus: project?.authorizationStatus || "", sellerOwner: project?.sellerOwner || "", sourceIntroducer: project?.sourceIntroducer || "", confidentialityLevel: project?.confidentialityLevel || "Internal Only", publicLocation: project?.publicLocation || "", internalNotes: project?.internalNotes || "", publicTeaser: project?.publicTeaser || "", publicHighlights: (project?.publicHighlights || []).join("\n") };
  Object.entries(map).forEach(([name, value]) => { const el = form.elements[name]; if (el) el.value = value; });
  $("#publicVisible").checked = Boolean(project?.publicVisible);
  $("#projectStatus").value = project?.status || "Draft";
  $("#editorTitle").textContent = project?.internalName || "New Project";
  $("#projectIdBadge").textContent = project?.id || "Not saved";
  renderCategoryFields(map.primaryCategory, project?.details || {});
  updatePublishingState(); renderTeaserPreview(); renderFiles(project?.files || []);
}

function renderProjects() {
  const query = $("#projectSearch").value.trim().toLowerCase(); const category = $("#categoryFilter").value;
  const filtered = projects.filter((p) => (!category || p.primaryCategory === category) && (!query || `${p.id} ${p.internalName}`.toLowerCase().includes(query)));
  $("#projectList").innerHTML = filtered.length ? filtered.map((p) => `<button class="project-card ${currentProject?.id === p.id ? "active" : ""}" data-id="${p.id}"><strong>${escapeHtml(p.internalName)}</strong><small>${p.id} · ${p.primaryCategory} · ${p.status}</small></button>`).join("") : '<div class="empty">No projects found.</div>';
}

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function renderTeaserPreview() { const p = formPayload(); $("#teaserPreview").innerHTML = `<p class="eyebrow">${escapeHtml(p.primaryCategory)} · ${escapeHtml(p.publicLocation || p.country)}</p><h3>${escapeHtml(p.publicTitle || "Public teaser title")}</h3><p>${escapeHtml(p.publicTeaser || "No public summary yet.")}</p>`; }
function updatePublishingState() { const approved = $("#projectStatus").value === "Approved"; $("#publicVisible").disabled = !approved; if (!approved) $("#publicVisible").checked = false; }
function renderFiles(files) { $("#fileList").innerHTML = files.length ? files.map((f) => `<div class="file-item"><strong>${escapeHtml(f.originalName)}</strong><span>${escapeHtml(f.kind)} · ${Math.round(f.sizeBytes/1024)} KB${f.publicApproved ? " · Public image approved" : ""}</span></div>`).join("") : '<div class="empty">No files uploaded.</div>'; }

async function loadProjects() {
  try { const result = await api("/v1/admin/projects"); projects = result.projects || []; $("#accessState").textContent = "Access granted"; renderProjects(); if (!currentProject && projects[0]) fillForm(projects[0]); }
  catch (error) { $("#accessState").textContent = "Access required"; notice(`Registry API unavailable or Cloudflare Access sign-in required: ${error.message}`, true); renderProjects(); }
}

$("#primaryCategory").addEventListener("change", (e) => { renderCategoryFields(e.target.value, {}); renderTeaserPreview(); });
$("#projectForm").addEventListener("input", renderTeaserPreview);
$("#projectSearch").addEventListener("input", renderProjects); $("#categoryFilter").addEventListener("change", renderProjects);
$("#projectList").addEventListener("click", (e) => { const button = e.target.closest("[data-id]"); if (!button) return; fillForm(projects.find((p) => p.id === button.dataset.id)); renderProjects(); });
$("#newProjectButton").addEventListener("click", () => fillForm(null));
$("#projectStatus").addEventListener("change", updatePublishingState);
$("#projectForm").addEventListener("submit", async (e) => { e.preventDefault(); notice(""); try { const payload = formPayload(); const saved = currentProject ? await api(`/v1/admin/projects/${encodeURIComponent(currentProject.id)}`, { method: "PATCH", body: JSON.stringify(payload) }) : await api("/v1/admin/projects", { method: "POST", body: JSON.stringify(payload) }); notice(`Saved ${saved.id}`); currentProject = saved; await loadProjects(); fillForm(projects.find((p) => p.id === saved.id) || saved); } catch (error) { notice(error.message, true); } });
$("#applyStatusButton").addEventListener("click", async () => { if (!currentProject) return notice("Save the project before changing status.", true); try { const updated = await api(`/v1/admin/projects/${encodeURIComponent(currentProject.id)}/status`, { method: "POST", body: JSON.stringify({ status: $("#projectStatus").value }) }); notice(`Status updated to ${updated.status}`); currentProject = updated; await loadProjects(); fillForm(projects.find((p) => p.id === updated.id) || updated); } catch (error) { notice(error.message, true); } });
$("#fileForm").addEventListener("submit", async (e) => { e.preventDefault(); if (!currentProject) return notice("Save the project before uploading files.", true); const data = new FormData(e.currentTarget); try { await api(`/v1/admin/projects/${encodeURIComponent(currentProject.id)}/files`, { method: "POST", body: data }); notice("File uploaded privately."); e.currentTarget.reset(); const result = await api(`/v1/admin/projects/${encodeURIComponent(currentProject.id)}/files`); renderFiles(result.files || []); } catch (error) { notice(error.message, true); } });

renderCategoryOptions(); fillForm(null); loadProjects();
