import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, js, css] = await Promise.all([
  readFile(new URL("../../index.html", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.js", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.css", import.meta.url), "utf8")
]);

test("homepage loads the AI sales assets with the deployed production Worker hook", () => {
  assert.match(html, /<meta name="vantora-ai-api" content="https:\/\/vantora-ai-sales\.vantora-captial-tech\.workers\.dev">/);
  assert.doesNotMatch(html, /<meta name="vantora-ai-api" content="http:\/\/127\.0\.0\.1:8787">/);
  assert.match(html, /<link rel="stylesheet" href="assets\/ai-sales\.css">/);
  assert.match(html, /<script type="module" src="assets\/ai-sales\.js"><\/script>/);
});

test("homepage matches the approved Vantora public redesign contract", () => {
  assert.match(html, /Vantora/);
  assert.match(html, /Powered by UPEX Tokyo/);
  assert.match(html, /Japan Opportunities\. Local Execution\. Global Perspective\./);
  assert.match(html, /Discuss Your Strategy/);
  assert.match(html, /Explore Selected Opportunities/);
  assert.match(html, /id="who-we-work-with"/);
  assert.match(html, /id="what-we-do"/);
  assert.match(html, /id="opportunities"/);
  assert.match(html, /id="why-vantora"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="insights"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /<option value="en">EN<\/option>/);
  assert.match(html, /<option value="zh">中文<\/option>/);
  assert.match(html, /<option value="ja">日本語<\/option>/);
  assert.doesNotMatch(html, /174K LNG Carriers/);
  assert.doesNotMatch(html, /Tell Us Your Mandate/);
});

test("multilingual copy uses external client-facing CTAs and updates document language", () => {
  assert.match(html, /Discuss Your Strategy/);
  assert.match(html, /与我们讨论您的日本投资计划/);
  assert.match(html, /日本での投資・事業機会について相談する/);
  assert.match(html, /document\.documentElement\.lang=lang/);
});

test("mobile typography is restrained for English, Chinese, and Japanese", () => {
  assert.match(html, /font-size:clamp\(2\.55rem,11\.5vw,2\.9rem\)/);
  assert.match(html, /font-size:clamp\(1\.85rem,8vw,2\.35rem\)/);
  assert.match(html, /body\{font-size:15px\}/);
  assert.match(html, /html\[lang="zh"\] \.hero h1,html\[lang="ja"\] \.hero h1/);
});

test("hero and selected opportunities use the approved image strategy", () => {
  assert.doesNotMatch(html, /assets\/photos\/grid-substation\.jpg/);
  assert.match(html, /Marunouchi\.jpg/);
  assert.match(html, /LNG_Carrier\.jpg/);
  assert.match(html, /TSUBAME_3\.0_PA075096\.jpg/);
  assert.match(html, /BESS_%28battery_energy_storage_system%29\.svg/);
});

test("public frontend source contains no server secret identifiers or API keys", () => {
  const publicSource = `${html}\n${js}\n${css}`;
  for (const forbidden of ["OPENAI_API_KEY", "RESEND_API_KEY", "Bearer sk-", "sk-proj-"]) {
    assert.equal(publicSource.includes(forbidden), false, `public source must not contain ${forbidden}`);
  }
});

test("AI state is tab-scoped and the frontend cannot choose the server email recipient", () => {
  assert.match(js, /sessionStorage/);
  assert.equal(js.includes("localStorage"), false);
  assert.match(js, /\/v1\/chat/);
  assert.match(js, /\/v1\/leads/);
  assert.match(js, /needsConfirmation/);
  assert.match(js, /ai-sales-confirm/);
  assert.doesNotMatch(js, /\brecipient\s*:/);
  assert.doesNotMatch(js, /(^|[,{]\s*)to\s*:/m);
});

test("visitor and model content is rendered as text rather than injected HTML", () => {
  assert.match(js, /textContent/);
  assert.equal(js.includes("innerHTML"), false);
});

test("widget styling is mobile-safe, accessible, and reduced-motion aware", () => {
  assert.match(css, /@media\(max-width:650px\)/);
  assert.match(css, /\.ai-sales-launcher\{right:12px;bottom:82px/);
  assert.match(css, /\.ai-sales-panel\{inset:auto 8px 74px 8px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height:48px/);
});
