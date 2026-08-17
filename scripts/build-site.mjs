import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  renderRootRouter,
  renderHome,
  renderCapabilities,
  renderExperience,
  renderOpportunities,
  renderOpportunityDetail,
  renderAbout,
  renderContact
} from "../site/templates.mjs";

const outputRoot = resolve(process.env.VANTORA_BUILD_DIR || ".");
const mode = process.env.VANTORA_OPPORTUNITY_MODE === "presentation" ? "presentation" : "live";
const registryApi = String(process.env.VANTORA_REGISTRY_API || "").replace(/\/$/, "");
const langs = ["en", "zh", "ja"];

async function emit(path, content) {
  const target = join(outputRoot, path);
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(target, content, "utf8");
  console.log(`built ${path}`);
}

await emit("index.html", renderRootRouter());

for (const lang of langs) {
  const options = { mode, registryApi };
  await emit(`${lang}/index.html`, renderHome(lang, options));
  await emit(`${lang}/capabilities/index.html`, renderCapabilities(lang, options));
  await emit(`${lang}/experience/index.html`, renderExperience(lang, options));
  await emit(`${lang}/opportunities/index.html`, renderOpportunities(lang, options));
  await emit(`${lang}/opportunities/detail/index.html`, renderOpportunityDetail(lang, options));
  await emit(`${lang}/about/index.html`, renderAbout(lang, options));
  await emit(`${lang}/contact/index.html`, renderContact(lang, options));
}
