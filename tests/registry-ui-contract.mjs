import fs from "node:fs";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../registry/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../registry/app.js", import.meta.url), "utf8");

for (const token of ["Project Registry", "primaryCategory", "confidentialityLevel", "priceDisplayMode", "projectStatus", "publicVisible", "projectList"]) {
  assert.ok(html.includes(token), `missing UI token: ${token}`);
}
for (const category of ["MA", "BESS", "SOLAR", "SHIP", "AIR", "DC", "CRE", "STRAT"]) {
  assert.ok(app.includes(`\"${category}\"`), `missing category: ${category}`);
}
for (const forbidden of ["OPENAI_API_KEY", "RESEND_API_KEY", "CF_ACCESS_AUD", "REGISTRY_ADMIN_EMAILS"]) {
  assert.ok(!html.includes(forbidden) && !app.includes(forbidden), `embedded secret/config key: ${forbidden}`);
}

console.log("registry UI contract: PASS");
