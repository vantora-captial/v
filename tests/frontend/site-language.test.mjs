import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseInitialLanguage,
  equivalentLanguagePath,
  languageHome,
  normalizeBrowserLanguage
} from "../../assets/site-language.mjs";

test("recognizes Japanese and explicit Traditional Chinese browser preferences", () => {
  assert.equal(normalizeBrowserLanguage("ja-JP"), "ja");
  assert.equal(normalizeBrowserLanguage("zh-TW"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-Hant-HK"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-HK"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-MO"), "zh");
  assert.equal(normalizeBrowserLanguage("zh-CN"), null);
  assert.equal(normalizeBrowserLanguage("zh"), null);
});

test("saved valid language wins over browser preferences", () => {
  assert.equal(chooseInitialLanguage({ stored: "zh", languages: ["ja-JP"] }), "zh");
  assert.equal(chooseInitialLanguage({ stored: "invalid", languages: ["ja-JP"] }), "ja");
  assert.equal(chooseInitialLanguage({ stored: null, languages: ["fr-FR"] }), "en");
  assert.equal(chooseInitialLanguage({ stored: null, languages: ["zh-CN", "ja-JP"] }), "ja");
});

test("language home returns only supported language roots", () => {
  assert.equal(languageHome("en"), "/en/");
  assert.equal(languageHome("zh"), "/zh/");
  assert.equal(languageHome("ja"), "/ja/");
  assert.equal(languageHome("fr"), "/en/");
});

test("language switch preserves the equivalent page", () => {
  assert.equal(equivalentLanguagePath("/en/capabilities/", "ja"), "/ja/capabilities/");
  assert.equal(equivalentLanguagePath("/zh/opportunities/detail/", "en"), "/en/opportunities/detail/");
  assert.equal(equivalentLanguagePath("/unknown/", "zh"), "/zh/");
  assert.equal(equivalentLanguagePath("/en/about/", "fr"), "/en/about/");
});
