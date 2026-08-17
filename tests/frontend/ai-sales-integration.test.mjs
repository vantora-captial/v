import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, js, css] = await Promise.all([
  readFile(new URL("../../index.html", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.js", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.css", import.meta.url), "utf8")
]);

const has = (phrase) => new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

test("homepage loads the AI sales assets with the deployed production Worker hook", () => {
  assert.match(html, /<meta name="vantora-ai-api" content="https:\/\/vantora-ai-sales\.vantora-captial-tech\.workers\.dev">/);
  assert.doesNotMatch(html, /<meta name="vantora-ai-api" content="http:\/\/127\.0\.0\.1:8787">/);
  assert.match(html, /<link rel="stylesheet" href="assets\/ai-sales\.css">/);
  assert.match(html, /<script type="module" src="assets\/ai-sales\.js"><\/script>/);
});

test("homepage matches the approved Vantora V2 Japan-focused contract", () => {
  assert.match(html, /Vantora/);
  assert.match(html, /Access Japan Through Trusted Local Execution/);
  assert.match(html, /Explore Opportunities/);
  assert.match(html, /Book a Private Discussion/);
  assert.match(html, /id="who-we-help"/);
  assert.match(html, /id="what-we-unlock"/);
  assert.match(html, /id="opportunities"/);
  assert.match(html, /id="why-vantora"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="contact"/);
  assert.doesNotMatch(html, /id="insights"/);
  assert.match(html, /<option value="en">EN<\/option>/);
  assert.match(html, /<option value="zh">中文<\/option>/);
  assert.match(html, /<option value="ja">JA<\/option>/);
  assert.doesNotMatch(html, /Japan Opportunities\. Local Execution\. Global Perspective\./);
  assert.doesNotMatch(html, /Discuss Your Strategy/);
  assert.doesNotMatch(html, /Tokyo-based cross-border advisory/);
});

test("brand scope is Japan-focused rather than Tokyo-only", () => {
  assert.match(html, /Japan-focused|across Japan|in Japan/);
  assert.doesNotMatch(html, /Start a Private Discussion in Tokyo/);
  assert.doesNotMatch(html, /Tokyo-based local execution/);
  assert.match(html, /Powered by UPEX/);
});

test("English copy frames outcomes and access rather than generic consulting services", () => {
  for (const phrase of [
    "Access selected Japan investment and acquisition opportunities",
    "What We Unlock in Japan",
    "Investment Access",
    "M&A & Strategic Acquisitions",
    "Market Entry & Partnerships",
    "Capital & Strategic Matching",
    "Selected Opportunities",
    "Start a Private Discussion About Japan"
  ]) {
    assert.match(html, has(phrase));
  }
  assert.doesNotMatch(html, /Tell Us Your Mandate/);
  assert.doesNotMatch(html, /ticket size/i);
});

test("Chinese and Japanese use native V2 commercial conversion copy", () => {
  for (const phrase of [
    "进入日本市场，获取投资、并购与战略合作机会",
    "查看日本精选机会",
    "预约一对一私密沟通",
    "日本市場への投資・M&A・事業機会にアクセス",
    "日本の投資・M&A機会を見る",
    "個別相談を予約する"
  ]) {
    assert.match(html, has(phrase));
  }
  assert.match(html, /document\.documentElement\.lang=lang/);
});

test("selected opportunities are curated themes rather than marketplace listings", () => {
  for (const phrase of [
    "LNG & Energy Logistics",
    "Japan BESS & Grid Infrastructure",
    "AI Data Centers & Digital Infrastructure",
    "Japanese Companies & Cross-Border M&A"
  ]) {
    assert.match(html, has(phrase));
  }
  assert.match(html, /selected themes|selected opportunities/i);
  assert.match(html, /Request Details|Discuss This Sector|View Opportunity Theme/);
  for (const forbidden of [
    /guaranteed return/i,
    /exclusive opportunity/i,
    /invest now/i,
    /174K LNG Carriers/,
    /\$847M AUM/,
    /700k\+/
  ]) {
    assert.doesNotMatch(html, forbidden);
  }
});

test("image strategy supports Japan-wide positioning and sector-specific opportunity imagery", () => {
  assert.doesNotMatch(html, /assets\/photos\/grid-substation\.jpg/);
  assert.match(html, /LNG_Carrier\.jpg|lng/i);
  assert.match(html, /BESS_%28battery_energy_storage_system%29\.svg|battery|storage/i);
  assert.match(html, /TSUBAME_3\.0_PA075096\.jpg|data.center/i);
  assert.match(html, /Media credits|Image credits|Photo credits/i);
});

test("mobile header uses the approved minimal brand treatment", () => {
  assert.match(html, /class="brand-mark"/);
  assert.match(html, /class="mobile-brand-copy"/);
  assert.match(html, /@media\(max-width:760px\)/);
  assert.match(html, /\.mobile-brand-copy\{display:none/);
  assert.match(html, /\.nav\{height:66px/);
  assert.match(html, /\.menu\{display:inline-grid/);
});

test("mobile hero has language-specific editorial line break hooks", () => {
  assert.match(html, /Access Japan/);
  assert.match(html, /Through Trusted Local Execution/);
  assert.match(html, /进入日本市场/);
  assert.match(html, /获取投资、并购与战略合作机会/);
  assert.match(html, /日本市場への/);
  assert.match(html, /投資・M&A・事業機会にアクセス/);
  assert.match(html, /hero-line/);
  assert.match(html, /heroTitleLines/);
});

test("mobile sections use editorial lists instead of repeated card grids", () => {
  assert.match(html, /audience-list/);
  assert.match(html, /unlock-list/);
  assert.match(html, /unlock-index/);
  assert.match(html, /opportunity-feature/);
  assert.match(html, /why-mobile-list/);
  assert.match(html, /experience-list/);
});

test("mobile opportunities use immersive vertical storytelling", () => {
  assert.match(html, /\.opportunity-feature\{display:block;margin:0 0 56px/);
  assert.match(html, /\.opportunity-media\{height:clamp\(300px,72vw,390px\)/);
  assert.match(html, /opportunity-description/);
  assert.match(html, /opportunity-cta/);
});

test("mobile spacing and small-phone rules cover 760px and 390px", () => {
  assert.match(html, /@media\(max-width:760px\)/);
  assert.match(html, /@media\(max-width:390px\)/);
  assert.match(html, /section\[id\]\{scroll-margin-top:80px\}/);
  assert.match(html, /overflow-x:hidden/);
  assert.match(html, /font-size:15px/);
});

test("direct contact remains available without using the AI assistant", () => {
  assert.match(html, /info@u-pex\.com/);
  assert.match(html, /\+81 3-6717-4565/);
  assert.match(html, /Book a Private Discussion/);
  assert.match(html, /href="mailto:info@u-pex\.com"/);
});

test("public homepage avoids unsupported financial and regulatory claims", () => {
  for (const forbidden of [
    /guaranteed/i,
    /AUM/i,
    /account holders/i,
    /SOC ?2/i,
    /licensed investment adviser/i,
    /certified return/i,
    /exclusive opportunity/i
  ]) {
    assert.doesNotMatch(html, forbidden);
  }
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
