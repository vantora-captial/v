import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
execFileSync(process.execPath, ["scripts/build-site.mjs"], { cwd: root });

const [router, en, zh, ja, js, css] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"),
  readFile(resolve(root, "en/index.html"), "utf8"),
  readFile(resolve(root, "zh/index.html"), "utf8"),
  readFile(resolve(root, "ja/index.html"), "utf8"),
  readFile(resolve(root, "assets/ai-sales.js"), "utf8"),
  readFile(resolve(root, "assets/ai-sales.css"), "utf8")
]);

const homes = [en, zh, ja];

test("root remains a routing-only language entry point", () => {
  assert.match(router, /noindex,follow/);
  assert.match(router, /href="\/en\/"/);
  assert.match(router, /href="\/zh\/"/);
  assert.match(router, /href="\/ja\/"/);
  assert.match(router, /chooseInitialLanguage/);
  assert.doesNotMatch(router, /vantora-ai-api/);
  assert.doesNotMatch(router, /Cross-Border M&A & Strategic Investment in Japan/);
});

test("all localized homes load the deployed AI concierge hook", () => {
  for (const html of homes) {
    assert.match(html, /<meta name="vantora-ai-api" content="https:\/\/vantora-ai-sales\.vantora-captial-tech\.workers\.dev">/);
    assert.doesNotMatch(html, /<meta name="vantora-ai-api" content="http:\/\/127\.0\.0\.1:8787">/);
    assert.match(html, /<link rel="stylesheet" href="\/assets\/ai-sales\.css">/);
    assert.match(html, /<script type="module" src="\/assets\/ai-sales\.js"><\/script>/);
  }
});

test("localized homes use the approved M&A-led trilingual positioning", () => {
  assert.match(en, /Cross-Border M&amp;A &amp; Strategic Investment in Japan/);
  assert.match(zh, /專注日本的跨境併購與戰略投資/);
  assert.match(ja, /日本におけるクロスボーダーM&amp;A・戦略投資/);
  for (const html of homes) {
    assert.doesNotMatch(html, /Access Japan Through Trusted Local Execution/);
    assert.match(html, /id="home-capabilities"/);
    assert.match(html, /id="home-experience"/);
    assert.match(html, /id="home-opportunities"/);
    assert.match(html, /id="home-process"/);
    assert.match(html, /id="home-why"/);
    assert.match(html, /id="home-contact"/);
    assert.match(html, /data-capability="ma"/);
  }
});

test("Traditional Chinese and Japanese are standalone native pages", () => {
  assert.match(zh, /<html lang="zh-Hant"/);
  assert.match(zh, /討論日本併購或投資計畫/);
  assert.doesNotMatch(zh, /进入日本市场|查看日本精选机会/);
  assert.match(ja, /<html lang="ja"/);
  assert.match(ja, /日本でのM&amp;A・投資について相談する/);
});

test("brand scope stays Japan-wide with UPEX as secondary foundation", () => {
  assert.match(en, /Japan-focused|Japan-side|in Japan/);
  assert.doesNotMatch(en, /Tokyo-based cross-border advisory|Start a Private Discussion in Tokyo/);
  assert.match(en, /Vantora × UPEX|UPEX/);
});

test("direct contact remains available independently of AI", () => {
  for (const html of homes) {
    assert.match(html, /href="mailto:info@u-pex\.com"/);
    assert.match(html, /href="tel:\+81367174565"/);
    assert.match(html, /\+81 3 6717 4565/);
  }
});

test("public localized homes avoid unsupported financial and regulatory claims", () => {
  const source = homes.join("\n");
  for (const forbidden of [
    /guaranteed return/i,
    /\bAUM\b/i,
    /account holders/i,
    /SOC ?2/i,
    /licensed investment adviser/i,
    /certified return/i,
    /exclusive opportunity/i,
    /\$847M/
  ]) assert.doesNotMatch(source, forbidden);
});

test("public frontend source contains no server secret identifiers or API keys", () => {
  const publicSource = `${homes.join("\n")}\n${js}\n${css}`;
  for (const forbidden of ["OPENAI_API_KEY", "RESEND_API_KEY", "Bearer sk-", "sk-proj-"]) {
    assert.equal(publicSource.includes(forbidden), false, `public source must not contain ${forbidden}`);
  }
});

test("AI state remains tab-scoped and browser cannot choose server recipient", () => {
  assert.match(js, /sessionStorage/);
  assert.equal(js.includes("localStorage"), false);
  assert.match(js, /\/v1\/chat/);
  assert.match(js, /\/v1\/leads/);
  assert.match(js, /needsConfirmation/);
  assert.match(js, /ai-sales-confirm/);
  assert.doesNotMatch(js, /\brecipient\s*:/);
  assert.doesNotMatch(js, /(^|[,{]\s*)to\s*:/m);
});

test("AI language detection accepts zh-Hant through document language", () => {
  assert.match(js, /document\.documentElement\.lang/);
  assert.match(js, /startsWith\("zh"\)/);
  assert.match(js, /startsWith\("ja"\)/);
});

test("visitor and model content is rendered as text rather than injected HTML", () => {
  assert.match(js, /textContent/);
  assert.equal(js.includes("innerHTML"), false);
});

test("AI widget styling remains mobile-safe and reduced-motion aware", () => {
  assert.match(css, /@media\(max-width:650px\)/);
  assert.match(css, /\.ai-sales-launcher\{right:12px;bottom:82px/);
  assert.match(css, /\.ai-sales-panel\{inset:auto 8px 74px 8px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height:48px/);
});
