export const SUPPORTED_LANGUAGES = Object.freeze(["en", "zh", "ja"]);

export function normalizeBrowserLanguage(value) {
  const tag = String(value || "").trim().toLowerCase();
  if (tag === "ja" || tag.startsWith("ja-")) return "ja";
  if (
    tag.includes("hant") ||
    tag === "zh-tw" || tag.startsWith("zh-tw-") ||
    tag === "zh-hk" || tag.startsWith("zh-hk-") ||
    tag === "zh-mo" || tag.startsWith("zh-mo-")
  ) return "zh";
  return null;
}

export function chooseInitialLanguage({ stored, languages } = {}) {
  if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
  for (const value of Array.isArray(languages) ? languages : []) {
    const normalized = normalizeBrowserLanguage(value);
    if (normalized) return normalized;
  }
  return "en";
}

export function languageHome(lang) {
  const safe = SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
  return `/${safe}/`;
}

export function equivalentLanguagePath(pathname, nextLang) {
  const safe = SUPPORTED_LANGUAGES.includes(nextLang) ? nextLang : "en";
  const path = String(pathname || "/");
  if (/^\/(en|zh|ja)(?:\/|$)/.test(path)) {
    return path.replace(/^\/(en|zh|ja)(?=\/|$)/, `/${safe}`);
  }
  return languageHome(safe);
}
