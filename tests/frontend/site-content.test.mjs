import test from "node:test";
import assert from "node:assert/strict";
import {
  LANGUAGES,
  HOME,
  CAPABILITIES,
  EXPERIENCE,
  CONTACT_PATHS,
  PRESENTATION_OPPORTUNITIES
} from "../../site/content.mjs";

const flattenStrings = value => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
};

test("publishes native EN, Traditional Chinese and Japanese hero contracts", () => {
  assert.deepEqual(LANGUAGES, ["en", "zh", "ja"]);
  assert.equal(HOME.en.hero.title, "Cross-Border M&A & Strategic Investment in Japan");
  assert.equal(HOME.zh.hero.title, "專注日本的跨境併購與戰略投資");
  assert.equal(HOME.ja.hero.title, "日本におけるクロスボーダーM&A・戦略投資");
  assert.match(HOME.zh.hero.body, /項目/);
  assert.match(HOME.zh.hero.body, /執行/);
});

test("keeps M&A first and primary across all languages", () => {
  for (const lang of LANGUAGES) {
    assert.equal(CAPABILITIES[lang].items.length, 6);
    assert.deepEqual(CAPABILITIES[lang].items.map(item => item.key), ["ma", "energy", "digital", "cre", "special", "partnerships"]);
    assert.equal(CAPABILITIES[lang].items[0].primary, true);
    assert.equal(CAPABILITIES[lang].items.filter(item => item.primary).length, 1);
  }
});

test("defines structured anonymized experience and four contact pathways", () => {
  for (const lang of LANGUAGES) {
    assert.equal(EXPERIENCE[lang].items.length, 4);
    for (const item of EXPERIENCE[lang].items) {
      assert.ok(item.sector && item.title && item.situation && item.role && item.scope && item.status);
    }
    assert.deepEqual(CONTACT_PATHS[lang].map(item => item.key), ["acquire-invest", "sell-business-asset", "find-partner", "submit-opportunity"]);
  }
});

test("does not reuse key Simplified Chinese V2 phrases", () => {
  const zh = flattenStrings({ home: HOME.zh, capabilities: CAPABILITIES.zh, experience: EXPERIENCE.zh, contact: CONTACT_PATHS.zh }).join("\n");
  assert.doesNotMatch(zh, /进入日本市场/);
  assert.doesNotMatch(zh, /查看日本精选机会/);
  assert.match(zh, /併購/);
});

test("public content avoids unsupported or regulated marketing claims", () => {
  const publicText = flattenStrings({ HOME, CAPABILITIES, EXPERIENCE, CONTACT_PATHS }).join("\n");
  for (const pattern of [/guaranteed return/i, /exclusive opportunity/i, /\bAUM\b/i, /licensed investment adviser/i, /brokerage/i, /仲介/]) {
    assert.doesNotMatch(publicText, pattern);
  }
});

test("presentation opportunities are explicitly non-live", () => {
  assert.ok(PRESENTATION_OPPORTUNITIES.length >= 3);
  for (const item of PRESENTATION_OPPORTUNITIES) {
    assert.equal(item.presentationOnly, true);
    assert.ok(item.id && item.publicTitle && item.category && item.teaser);
  }
});
