import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repo = new URL("../../", import.meta.url).pathname;

async function build() {
  const dir = await mkdtemp(join(tmpdir(), "vantora-ja-sourcing-"));
  const result = spawnSync(process.execPath, [join(repo, "scripts/build-site.mjs")], {
    cwd: repo,
    env: { ...process.env, VANTORA_BUILD_DIR: dir, VANTORA_OPPORTUNITY_MODE: "presentation" },
    encoding: "utf8"
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return dir;
}

async function read(dir, path) {
  return readFile(join(dir, path), "utf8");
}

test("Japanese homepage invites sellers and project owners into cross-border discussions", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/index.html");
    assert.match(ja, /日本企業・案件オーナーの皆様へ/);
    assert.match(ja, /海外の買い手・投資家との取引をご検討ですか/);
    assert.match(ja, /案件について相談する/);
    assert.match(ja, /海外投資家との取引について相談する/);
    assert.match(ja, /海外の投資ファンド/);
    assert.match(ja, /ファミリーオフィス/);
    assert.match(ja, /上場企業を含む事業会社/);
    assert.match(ja, /戦略投資家/);
    assert.match(ja, /案件に応じて/);
    assert.match(ja, /id="ja-seller-sourcing"/);
    assert.match(ja, /id="ja-overseas-counterparties"/);
    assert.match(ja, /\/assets\/ja-sourcing\.css/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese contact page uses four seller and sponsor conversion paths", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/contact/index.html");
    for (const label of [
      "会社・事業の譲渡について相談する",
      "海外からの資本受入れを相談する",
      "海外企業との提携先を探す",
      "投資・事業案件を持ち込む"
    ]) assert.match(ja, new RegExp(label));
    assert.match(ja, /会社・事業・資産・プロジェクトについてご相談ください/);
    assert.match(ja, /初期相談では、案件名や相手先を特定できる情報を最初から開示いただく必要はありません/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese public output avoids unsupported investor-network claims", async () => {
  const dir = await build();
  try {
    const pages = ["ja/index.html", "ja/about/index.html", "ja/contact/index.html"];
    const prohibited = [
      "独自のグローバルネットワーク",
      "多数の契約ファンド",
      "世界中のファミリーオフィスと直接提携",
      "必ず海外買い手を紹介できる",
      "AUM"
    ];
    for (const page of pages) {
      const html = await read(dir, page);
      for (const phrase of prohibited) assert.doesNotMatch(html, new RegExp(phrase));
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("English and Traditional Chinese pages do not receive Japanese-only sourcing modules", async () => {
  const dir = await build();
  try {
    for (const lang of ["en", "zh"]) {
      const html = await read(dir, `${lang}/index.html`);
      assert.doesNotMatch(html, /ja-seller-sourcing/);
      assert.doesNotMatch(html, /ja-overseas-counterparties/);
      assert.doesNotMatch(html, /ja-sourcing\.css/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
