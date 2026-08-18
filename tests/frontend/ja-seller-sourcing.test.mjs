import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repo = new URL("../../", import.meta.url).pathname;

async function build() {
  const dir = await mkdtemp(join(tmpdir(), "vantora-ja-consultation-"));
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

test("Japanese homepage follows a consultation-first hierarchy", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/index.html");
    const ordered = [
      "会社や事業のこれからを、",
      "こんなお悩みはありませんか",
      "Vantoraができること",
      "海外との選択肢を広げる",
      "案件をどう進めるか",
      "まずはご相談ください"
    ];
    let cursor = -1;
    for (const phrase of ordered) {
      const next = ja.indexOf(phrase);
      assert.ok(next > cursor, `${phrase} should appear after the prior Japanese consultation section`);
      cursor = next;
    }
    assert.match(ja, /初期相談可/);
    assert.match(ja, /秘密保持に配慮/);
    assert.match(ja, /案件名の開示不要/);
    assert.match(ja, /\/assets\/ja-consultation\.css/);
    assert.doesNotMatch(ja, /ja-sourcing\.css/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese homepage starts from owner concerns rather than service categories", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/index.html");
    for (const label of [
      "後継者について悩んでいる",
      "会社・事業の譲渡を検討している",
      "海外から資本を受け入れたい",
      "海外企業との事業提携を検討している",
      "不動産・エネルギー・事業案件について相談したい"
    ]) assert.match(ja, new RegExp(label));
    for (const label of ["整理する", "つなぐ", "進める"]) assert.match(ja, new RegExp(label));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese homepage uses the six-stage Japanese consultation process", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/index.html");
    for (const label of [
      "初期相談",
      "案件整理",
      "候補先の検討",
      "守秘・初期協議",
      "条件協議・DD",
      "取引実行"
    ]) assert.match(ja, new RegExp(label));
    for (const legacy of ["Identify｜探索", "Evaluate｜評価", "Engage｜協議", "Structure｜設計", "Execute｜実行"]) {
      assert.doesNotMatch(ja, new RegExp(legacy));
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese contact page behaves like an initial consultation desk", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/contact/index.html");
    assert.match(ja, /どのようなことをご検討ですか/);
    assert.match(ja, /まだ方針が決まっていない段階でも構いません/);
    for (const label of [
      "会社・事業の譲渡",
      "海外からの資本受入れ",
      "海外企業との事業提携",
      "投資・事業案件の相談"
    ]) assert.match(ja, new RegExp(label));
    for (const key of ["sell-business-asset", "acquire-invest", "find-partner", "submit-opportunity"]) assert.match(ja, new RegExp(key));
    assert.match(ja, /data-contact-form/);
    assert.match(ja, /\/assets\/contact\.mjs/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese About page explains how Vantora works", async () => {
  const dir = await build();
  try {
    const ja = await read(dir, "ja/about/index.html");
    for (const label of ["Vantoraの役割", "日本側で行うこと", "海外との接点", "対象となる案件", "進め方と守秘"]) {
      assert.match(ja, new RegExp(label));
    }
    assert.match(ja, /Vantora × UPEX/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Japanese public output uses qualified overseas-resource language without unsupported claims", async () => {
  const dir = await build();
  try {
    const home = await read(dir, "ja/index.html");
    assert.match(home, /海外の投資ファンド/);
    assert.match(home, /ファミリーオフィス/);
    assert.match(home, /上場企業を含む事業会社/);
    assert.match(home, /戦略投資家/);
    assert.match(home, /案件の内容・規模・業種・取引目的に応じて/);

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

test("English and Traditional Chinese keep the international composition", async () => {
  const dir = await build();
  try {
    for (const lang of ["en", "zh"]) {
      const html = await read(dir, `${lang}/index.html`);
      assert.doesNotMatch(html, /こんなお悩みはありませんか/);
      assert.doesNotMatch(html, /ja-consultation\.css/);
      assert.doesNotMatch(html, /ja-sourcing\.css/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
