import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repo = new URL("../../", import.meta.url).pathname;
const expectedRoutes = [
  "index.html",
  "en/index.html", "zh/index.html", "ja/index.html",
  "en/capabilities/index.html", "zh/capabilities/index.html", "ja/capabilities/index.html",
  "en/experience/index.html", "zh/experience/index.html", "ja/experience/index.html",
  "en/opportunities/index.html", "zh/opportunities/index.html", "ja/opportunities/index.html",
  "en/opportunities/detail/index.html", "zh/opportunities/detail/index.html", "ja/opportunities/detail/index.html",
  "en/about/index.html", "zh/about/index.html", "ja/about/index.html",
  "en/contact/index.html", "zh/contact/index.html", "ja/contact/index.html"
];

async function build(mode = "live") {
  const dir = await mkdtemp(join(tmpdir(), "vantora-site-"));
  const result = spawnSync(process.execPath, [join(repo, "scripts/build-site.mjs")], {
    cwd: repo,
    env: { ...process.env, VANTORA_BUILD_DIR: dir, VANTORA_OPPORTUNITY_MODE: mode },
    encoding: "utf8"
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return dir;
}

async function read(dir, file) {
  return readFile(join(dir, file), "utf8");
}

test("build emits routing-only root and all standalone localized routes", async () => {
  const dir = await build();
  try {
    for (const route of expectedRoutes) await stat(join(dir, route));
    const root = await read(dir, "index.html");
    assert.match(root, /noindex,follow/);
    assert.match(root, /vantora-language/);
    assert.doesNotMatch(root, /Cross-Border M&A & Strategic Investment in Japan/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("localized pages include native metadata, canonical, hreflang and shared assets", async () => {
  const dir = await build();
  try {
    const cases = [
      ["en/index.html", "en", "Cross-Border M&amp;A &amp; Strategic Investment in Japan"],
      ["zh/index.html", "zh-Hant", "專注日本的跨境併購與戰略投資"],
      ["ja/index.html", "ja", "日本におけるクロスボーダーM&amp;A・戦略投資"]
    ];
    for (const [file, lang, hero] of cases) {
      const html = await read(dir, file);
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.match(html, /rel="canonical"/);
      assert.match(html, /hreflang="en"/);
      assert.match(html, /hreflang="zh-Hant"/);
      assert.match(html, /hreflang="ja"/);
      assert.match(html, /property="og:title"/);
      assert.match(html, /\/assets\/site\.css/);
      assert.match(html, /\/assets\/site\.js/);
      assert.match(html, /\/assets\/ai-sales\.css/);
      assert.match(html, /\/assets\/ai-sales\.js/);
      assert.match(html, new RegExp(hero));
      assert.match(html, /id="main-content"/);
      assert.match(html, /class="skip-link"/);
      assert.match(html, /aria-label=/);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("homepage section order and M&A priority match approved journey", async () => {
  const dir = await build();
  try {
    for (const lang of ["en", "zh", "ja"]) {
      const html = await read(dir, `${lang}/index.html`);
      const ids = ["home-capabilities", "home-experience", "home-opportunities", "home-process", "home-why", "home-contact"];
      let prior = -1;
      for (const id of ids) {
        const next = html.indexOf(`id="${id}"`);
        assert.ok(next > prior, `${lang}: ${id} must follow previous section`);
        prior = next;
      }
      assert.match(html, /data-capability="ma"[^>]*class="[^"]*capability-primary/);
      assert.equal((html.match(/capability-primary/g) || []).length, 1);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("presentation build labels samples as non-live", async () => {
  const dir = await build("presentation");
  try {
    const en = await read(dir, "en/opportunities/index.html");
    assert.match(en, /Presentation sample — not a live mandate/);
    const zh = await read(dir, "zh/opportunities/index.html");
    assert.match(zh, /展示樣本 — 非即時委託案件/);
    const ja = await read(dir, "ja/opportunities/index.html");
    assert.match(ja, /表示サンプル — 実案件ではありません/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
