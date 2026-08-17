import { SITE, NAV, PAGES, HOME, CAPABILITIES, EXPERIENCE, CONTACT_PATHS, PUBLIC_CATEGORY_LABELS, PRESENTATION_OPPORTUNITIES } from "./content.mjs";

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

const e = escapeHtml;
const routeFor = (lang, key) => key === "home" ? `/${lang}/` : `/${lang}/${key}/`;
const langHref = lang => lang === "zh" ? "zh-Hant" : lang;
const publicBase = lang => `${SITE[lang].baseUrl}/${lang}/`;

function alternates(pageKey) {
  return ["en", "zh", "ja"].map(lang => `<link rel="alternate" hreflang="${langHref(lang)}" href="${SITE[lang].baseUrl}${routeFor(lang, pageKey)}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${SITE.en.baseUrl}${routeFor("en", pageKey)}">`;
}

function languageNav(lang, pageKey) {
  return `<div class="language-nav" aria-label="Language">
    ${["en", "zh", "ja"].map(code => `<a href="${routeFor(code, pageKey)}" data-language-choice="${code}"${code === lang ? ' aria-current="true"' : ""}>${e(SITE[code].label)}</a>`).join("")}
  </div>`;
}

function header(lang, pageKey) {
  const nav = NAV[lang];
  return `<header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="/${lang}/" aria-label="Vantora ${e(nav.home)}"><img src="/assets/vantora-logo-white.svg" alt="Vantora" class="brand-logo"><span class="brand-endorsement">${e(SITE[lang].endorsement)}</span></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span><span class="sr-only">Menu</span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        <a href="/${lang}/"${pageKey === "home" ? ' aria-current="page"' : ""}>${e(nav.home)}</a>
        <a href="/${lang}/capabilities/"${pageKey === "capabilities" ? ' aria-current="page"' : ""}>${e(nav.capabilities)}</a>
        <a href="/${lang}/experience/"${pageKey === "experience" ? ' aria-current="page"' : ""}>${e(nav.experience)}</a>
        <a href="/${lang}/opportunities/"${pageKey === "opportunities" ? ' aria-current="page"' : ""}>${e(nav.opportunities)}</a>
        <a href="/${lang}/about/"${pageKey === "about" ? ' aria-current="page"' : ""}>${e(nav.about)}</a>
        <a class="nav-contact" href="/${lang}/contact/"${pageKey === "contact" ? ' aria-current="page"' : ""}>${e(nav.contact)}</a>
      </nav>
      ${languageNav(lang, pageKey)}
    </div>
  </header>`;
}

function footer(lang) {
  const copy = lang === "en" ? { line: "Cross-border M&A and strategic investment in Japan.", private: "Private discussions are handled with discretion." } : lang === "zh" ? { line: "專注日本的跨境併購與戰略投資。", private: "私密洽談重視資訊保密與必要範圍內的溝通。" } : { line: "日本におけるクロスボーダーM&A・戦略投資。", private: "個別相談では守秘に配慮し、必要な範囲で情報を取り扱います。" };
  return `<footer class="site-footer"><div class="wrap footer-grid"><div><img src="/assets/vantora-logo-white.svg" alt="Vantora" class="footer-logo"><p>${e(copy.line)}</p><small>${e(copy.private)}</small></div><div class="footer-contact"><a href="mailto:info@u-pex.com">info@u-pex.com</a><a href="tel:+81367174565">+81 3 6717 4565</a><span>Tokyo, Japan · Japan-wide execution</span></div></div></footer>`;
}

function pageShell({ lang, pageKey, body, metaName = "vantora-registry-api", metaContent = "", mode = "live" }) {
  const site = SITE[lang];
  const page = PAGES[lang][pageKey];
  const canonical = `${site.baseUrl}${routeFor(lang, pageKey)}`;
  return `<!doctype html>
<html lang="${site.langAttr}" data-site-language="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#071321">
  <title>${e(page.title)}</title>
  <meta name="description" content="${e(page.description)}">
  <link rel="canonical" href="${e(canonical)}">
  ${alternates(pageKey)}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${e(page.title)}">
  <meta property="og:description" content="${e(page.description)}">
  <meta property="og:url" content="${e(canonical)}">
  <link rel="icon" href="/assets/vantora-logo-mark.svg">
  <meta name="vantora-ai-api" content="https://vantora-ai-sales.vantora-captial-tech.workers.dev">
  <meta name="${e(metaName)}" content="${e(metaContent)}">
  <meta name="vantora-opportunity-mode" content="${e(mode)}">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/ai-sales.css">
  <script type="module" src="/assets/site.js"></script>
  <script type="module" src="/assets/ai-sales.js"></script>
</head>
<body>
<a class="skip-link" href="#main-content">Skip to content</a>
${header(lang, pageKey)}
<main id="main-content">${body}</main>
${footer(lang)}
</body>
</html>`;
}

const sectionHead = (kicker, title, body = "") => `<div class="section-head"><div><p class="kicker">${e(kicker)}</p><h2>${e(title)}</h2></div>${body ? `<p class="section-intro">${e(body)}</p>` : ""}</div>`;
const arrow = "<span aria-hidden=\"true\">↗</span>";

function capabilityHome(lang) {
  const content = HOME[lang].capabilities;
  const items = CAPABILITIES[lang].items;
  return `<section id="home-capabilities" class="section light"><div class="wrap">${sectionHead(content.kicker, content.title, content.body)}<div class="capability-lead" data-capability="${items[0].key}" class="capability-primary"><div class="cap-index">01</div><div><h3>${e(items[0].title)}</h3><p>${e(items[0].summary)}</p><a href="/${lang}/capabilities/#${items[0].key}">${e(NAV[lang].capabilities)} ${arrow}</a></div></div><div class="capability-list">${items.slice(1).map((item, index) => `<article data-capability="${item.key}"><span>${String(index + 2).padStart(2, "0")}</span><h3>${e(item.title)}</h3><p>${e(item.summary)}</p></article>`).join("")}</div></div></section>`;
}

function experienceHome(lang) {
  const content = HOME[lang].experience;
  return `<section id="home-experience" class="section paper"><div class="wrap">${sectionHead(content.kicker, content.title, content.body)}<div class="experience-grid">${EXPERIENCE[lang].items.map(item => `<article class="experience-card"><p class="eyebrow">${e(item.sector)}</p><h3>${e(item.title)}</h3><p>${e(item.role)}</p><small>${e(item.status)}</small></article>`).join("")}</div><a class="text-link" href="/${lang}/experience/">${e(NAV[lang].experience)} ${arrow}</a></div></section>`;
}

const presentationLabel = lang => lang === "en" ? "Presentation sample — not a live mandate" : lang === "zh" ? "展示樣本 — 非即時委託案件" : "表示サンプル — 実案件ではありません";
const priceRequest = lang => lang === "en" ? "Price on Request" : lang === "zh" ? "價格洽詢" : "価格は個別相談";

function staticOpportunityCards(lang, mode, limit = null) {
  if (mode !== "presentation") return "";
  const items = limit ? PRESENTATION_OPPORTUNITIES.slice(0, limit) : PRESENTATION_OPPORTUNITIES;
  return items.map(item => `<article class="opportunity-card presentation-sample"><p class="sample-label">${e(presentationLabel(lang))}</p><p class="eyebrow">${e(PUBLIC_CATEGORY_LABELS[lang][item.category] || item.category)}</p><h3>${e(item.publicTitle)}</h3><p>${e(item.teaser)}</p><dl><div><dt>Region</dt><dd>${e(item.region)}</dd></div><div><dt>Transaction</dt><dd>${e(item.transactionType)}</dd></div><div><dt>Value</dt><dd>${e(priceRequest(lang))}</dd></div></dl><a href="/${lang}/opportunities/detail/?id=${encodeURIComponent(item.id)}">${lang === "en" ? "View teaser" : lang === "zh" ? "查看 Teaser" : "概要を見る"} ${arrow}</a></article>`).join("");
}

function opportunitiesHome(lang, mode) {
  const content = HOME[lang].opportunities;
  const samples = staticOpportunityCards(lang, mode, 4);
  return `<section id="home-opportunities" class="section dark-section" data-opportunity-surface="home"><div class="wrap">${sectionHead(content.kicker, content.title, content.body)}<div class="opportunity-grid" data-opportunities-list data-limit="4">${samples}</div><div class="opportunity-fallback" data-opportunities-fallback${samples ? " hidden" : ""}><p>${e(content.fallback)}</p><a class="button button-light" href="/${lang}/contact/?path=acquire-invest">${e(NAV[lang].contact)}</a></div><a class="text-link light-link" href="/${lang}/opportunities/">${e(content.cta)} ${arrow}</a></div></section>`;
}

function processHome(lang) {
  const content = HOME[lang].process;
  return `<section id="home-process" class="section light"><div class="wrap">${sectionHead(content.kicker, content.title)}<ol class="process-list">${content.items.map((item, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><div><h3>${e(item[0])}</h3><p>${e(item[1])}</p></div></li>`).join("")}</ol></div></section>`;
}

function whyHome(lang) {
  const content = HOME[lang].why;
  return `<section id="home-why" class="section dark-section"><div class="wrap">${sectionHead(content.kicker, content.title)}<div class="why-grid">${content.items.map((item, i) => `<article><span>0${i + 1}</span><h3>${e(item[0])}</h3><p>${e(item[1])}</p></article>`).join("")}</div><div class="upexfoundation"><p class="eyebrow">Japan-side Operating Foundation</p><strong>Vantora × UPEX</strong><p>${lang === "en" ? "Vantora is developed on UPEX’s Japan-side business foundation, combining international transaction perspective with local execution." : lang === "zh" ? "Vantora 基於 UPEX 的日本本地業務與執行基礎，將跨境交易視角與日本側實務推進結合。" : "VantoraはUPEXの日本国内における事業基盤を活用し、クロスボーダーの視点と国内実行をつなぎます。"}</p></div></div></section>`;
}

function contactHome(lang) {
  const content = HOME[lang].contact;
  return `<section id="home-contact" class="section contact-section"><div class="wrap">${sectionHead(content.kicker, content.title, content.body)}<div class="path-grid">${CONTACT_PATHS[lang].map(path => `<a href="/${lang}/contact/?path=${path.key}"><h3>${e(path.title)}</h3><p>${e(path.description)}</p>${arrow}</a>`).join("")}</div></div></section>`;
}

export function renderHome(lang, { mode = "live", registryApi = "" } = {}) {
  const hero = HOME[lang].hero;
  const body = `<section class="hero"><div class="wrap hero-layout"><div class="hero-copy"><p class="kicker hero-kicker">${e(hero.eyebrow)}</p><h1>${e(hero.title)}</h1><p class="hero-body">${e(hero.body)}</p><div class="hero-actions"><a class="button button-gold" href="/${lang}/contact/?path=acquire-invest">${e(hero.primaryCta)}</a><a class="button button-ghost" href="/${lang}/capabilities/">${e(hero.secondaryCta)}</a></div></div><aside class="hero-note"><span>VANTORA / JAPAN</span><p>${lang === "en" ? "Advisory · Sourcing · Japan-side Coordination · Execution" : lang === "zh" ? "顧問 · 項目尋找 · 日本側協調 · 交易執行" : "アドバイザリー · 案件探索 · 国内調整 · 実行支援"}</p></aside></div></section>${capabilityHome(lang)}${experienceHome(lang)}${opportunitiesHome(lang, mode)}${processHome(lang)}${whyHome(lang)}${contactHome(lang)}`;
  return pageShell({ lang, pageKey: "home", body, metaContent: registryApi, mode });
}

export function renderCapabilities(lang, options = {}) {
  const cap = CAPABILITIES[lang];
  const labels = lang === "en" ? { kicker: "Capabilities", scope: "Execution Scope", cta: "Discuss your mandate" } : lang === "zh" ? { kicker: "核心能力", scope: "執行範圍", cta: "討論您的交易或投資需求" } : { kicker: "支援領域", scope: "主な支援内容", cta: "案件・投資方針について相談する" };
  const body = `<section class="page-hero"><div class="wrap"><p class="kicker">${e(labels.kicker)}</p><h1>${e(cap.title)}</h1><p>${e(cap.intro)}</p></div></section><section class="section light"><div class="wrap capability-page">${cap.items.map((item, i) => `<article id="${item.key}" data-capability="${item.key}" class="capability-detail${item.primary ? " capability-primary" : ""}"><div class="capability-number">${String(i + 1).padStart(2, "0")}</div><div><p class="eyebrow">${item.primary ? "CORE" : labels.scope}</p><h2>${e(item.title)}</h2><p class="lead">${e(item.summary)}</p><ul>${item.bullets.map(b => `<li>${e(b)}</li>`).join("")}</ul></div></article>`).join("")}<a class="button button-dark" href="/${lang}/contact/">${e(labels.cta)}</a></div></section>`;
  return pageShell({ lang, pageKey: "capabilities", body, metaContent: options.registryApi || "", mode: options.mode || "live" });
}

export function renderExperience(lang, options = {}) {
  const exp = EXPERIENCE[lang];
  const labels = lang === "en" ? { kicker: "Selected Experience", situation: "Situation", role: "Our Role", scope: "Execution Scope", status: "Current Stage" } : lang === "zh" ? { kicker: "項目經驗", situation: "項目情況", role: "我們的角色", scope: "執行範圍", status: "當前狀態" } : { kicker: "案件経験", situation: "案件概要", role: "当社の役割", scope: "実行範囲", status: "現状" };
  const body = `<section class="page-hero"><div class="wrap"><p class="kicker">${e(labels.kicker)}</p><h1>${e(exp.title)}</h1><p>${e(exp.intro)}</p></div></section><section class="section paper"><div class="wrap experience-page">${exp.items.map((item, i) => `<article><div class="case-index">${String(i + 1).padStart(2, "0")}</div><div class="case-main"><p class="eyebrow">${e(item.sector)}</p><h2>${e(item.title)}</h2></div><dl><div><dt>${e(labels.situation)}</dt><dd>${e(item.situation)}</dd></div><div><dt>${e(labels.role)}</dt><dd>${e(item.role)}</dd></div><div><dt>${e(labels.scope)}</dt><dd>${e(item.scope)}</dd></div><div><dt>${e(labels.status)}</dt><dd>${e(item.status)}</dd></div></dl></article>`).join("")}</div></section>`;
  return pageShell({ lang, pageKey: "experience", body, metaContent: options.registryApi || "", mode: options.mode || "live" });
}

export function renderOpportunities(lang, { mode = "live", registryApi = "" } = {}) {
  const copy = HOME[lang].opportunities;
  const samples = staticOpportunityCards(lang, mode);
  const filters = ["ALL", "MA", "BESS", "DC", "CRE", "SHIP", "AIR", "STRAT"];
  const filterLabels = { ALL: lang === "en" ? "All" : lang === "zh" ? "全部" : "すべて", ...PUBLIC_CATEGORY_LABELS[lang] };
  const body = `<section class="page-hero"><div class="wrap"><p class="kicker">${e(copy.kicker)}</p><h1>${e(copy.title)}</h1><p>${e(copy.body)}</p></div></section><section class="section opportunities-page dark-section" data-opportunity-surface="listing"><div class="wrap"><div class="filter-row" aria-label="Opportunity filters">${filters.map(filter => `<button type="button" data-opportunity-filter="${filter}">${e(filterLabels[filter] || filter)}</button>`).join("")}</div><div class="opportunity-grid" data-opportunities-list>${samples}</div><div class="opportunity-fallback" data-opportunities-fallback${samples ? " hidden" : ""}><p>${e(copy.fallback)}</p><a class="button button-light" href="/${lang}/contact/?path=acquire-invest">${e(NAV[lang].contact)}</a></div></div></section><script type="module" src="/assets/opportunities.mjs"></script>`;
  return pageShell({ lang, pageKey: "opportunities", body, metaContent: registryApi, mode });
}

export function renderOpportunityDetail(lang, { mode = "live", registryApi = "" } = {}) {
  const unavailable = lang === "en" ? "This public teaser is not available. Please contact us for current opportunities." : lang === "zh" ? "此公開 Teaser 目前無法顯示。歡迎透過私密洽談了解當前項目。" : "この公開ティーザーは現在表示できません。最新案件については個別にお問い合わせください。";
  const body = `<section class="page-hero compact"><div class="wrap"><p class="kicker">${e(HOME[lang].opportunities.kicker)}</p><h1 data-opportunity-detail-title>${lang === "en" ? "Opportunity Teaser" : lang === "zh" ? "項目 Teaser" : "案件概要"}</h1></div></section><section class="section light"><div class="wrap detail-shell" data-opportunity-detail><div class="opportunity-detail-content" data-opportunity-detail-content></div><div class="opportunity-fallback" data-opportunity-detail-fallback><p>${e(unavailable)}</p><a class="button button-dark" href="/${lang}/contact/?path=acquire-invest">${e(NAV[lang].contact)}</a></div></div></section><script type="module" src="/assets/opportunities.mjs"></script>`;
  return pageShell({ lang, pageKey: "opportunities", body, metaContent: registryApi, mode });
}

export function renderAbout(lang, options = {}) {
  const copy = lang === "en" ? {
    kicker: "About Vantora", title: "International perspective. Japan-side execution.", intro: "Vantora is the cross-border advisory and transaction brand developed on UPEX’s Japan-side business foundation.", principles: [["Cross-border perspective", "We frame Japan opportunities through the decision requirements of international investors and companies."], ["Japan-side execution", "We support local dialogue, stakeholder coordination and transaction work inside Japan."], ["Transaction-led approach", "Our work is organized around moving an acquisition, investment or strategic partnership toward its next executable step."]], foundation: "UPEX provides the Japan-side business foundation behind Vantora, with experience in international business development, transaction support and local coordination." } : lang === "zh" ? {
    kicker: "關於 Vantora", title: "國際視角，日本側執行。", intro: "Vantora 是基於 UPEX 日本本地業務與執行能力建立的跨境併購及戰略投資品牌。", principles: [["跨境交易視角", "以海外投資者與企業的決策方式理解日本項目，並轉化為可執行的交易工作。"], ["日本側執行", "在日本本地推進溝通、利害關係人協調與交易流程。"], ["以交易推進為導向", "工作圍繞收購、投資或戰略合作的下一個可執行步驟展開。"]], foundation: "UPEX 為 Vantora 提供日本側業務基礎，涵蓋國際商務開發、交易支持與本地協調經驗。" } : {
    kicker: "Vantoraについて", title: "国際的な視点を、日本側での実行へ。", intro: "Vantoraは、UPEXの日本国内における事業基盤を活用し、クロスボーダーM&A・戦略投資・事業提携を支援するアドバイザリーブランドです。", principles: [["クロスボーダーの視点", "海外投資家・企業の判断軸から日本案件を捉え、実行可能な取引対応につなげます。"], ["日本側での実行", "国内での対話、関係者調整、取引プロセスを実務面から支援します。"], ["取引推進を重視", "買収、投資、事業提携を次の実行段階へ進めることを軸に支援します。"]], foundation: "UPEXはVantoraの日本側事業基盤として、国際事業開発、取引支援、国内調整の経験を提供します。" };
  const body = `<section class="page-hero"><div class="wrap"><p class="kicker">${e(copy.kicker)}</p><h1>${e(copy.title)}</h1><p>${e(copy.intro)}</p></div></section><section class="section light"><div class="wrap about-principles">${copy.principles.map((item, i) => `<article><span>0${i + 1}</span><h2>${e(item[0])}</h2><p>${e(item[1])}</p></article>`).join("")}</div></section><section class="section dark-section"><div class="wrap foundation"><p class="kicker">Japan-side Operating Foundation</p><h2>UPEX</h2><p>${e(copy.foundation)}</p></div></section>`;
  return pageShell({ lang, pageKey: "about", body, metaContent: options.registryApi || "", mode: options.mode || "live" });
}

export function renderContact(lang, options = {}) {
  const copy = HOME[lang].contact;
  const labels = lang === "en" ? { direct: "Direct contact", note: "Please avoid sending highly sensitive documents until an appropriate confidential channel has been agreed.", start: "Start this discussion", email: "Email", phone: "Telephone" } : lang === "zh" ? { direct: "直接聯絡", note: "在雙方確認適合的保密資料傳輸方式前，請不要直接傳送高度敏感文件。", start: "開始洽談", email: "電子郵件", phone: "電話" } : { direct: "直接のお問い合わせ", note: "適切な秘密情報の共有方法を確認する前に、機密性の高い資料を直接送付しないようお願いいたします。", start: "相談を開始", email: "メール", phone: "電話" };
  const body = `<section class="page-hero"><div class="wrap"><p class="kicker">${e(copy.kicker)}</p><h1>${e(copy.title)}</h1><p>${e(copy.body)}</p></div></section><section class="section light"><div class="wrap contact-layout"><div class="contact-paths" role="tablist" aria-label="Discussion type">${CONTACT_PATHS[lang].map((path, i) => `<button type="button" role="tab" data-contact-path="${path.key}" aria-selected="${i === 0 ? "true" : "false"}"><strong>${e(path.title)}</strong><span>${e(path.description)}</span></button>`).join("")}</div><div class="contact-form-shell"><div data-contact-form></div><p class="privacy-note">${e(labels.note)}</p><div class="direct-contact"><p class="eyebrow">${e(labels.direct)}</p><a href="mailto:info@u-pex.com">${e(labels.email)} · info@u-pex.com</a><a href="tel:+81367174565">${e(labels.phone)} · +81 3 6717 4565</a></div></div></div></section><script type="module" src="/assets/contact.mjs"></script>`;
  return pageShell({ lang, pageKey: "contact", body, metaContent: options.registryApi || "", mode: options.mode || "live" });
}

export function renderRootRouter() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Vantora</title><link rel="icon" href="/assets/vantora-logo-mark.svg"></head><body><main><p>Choose your language:</p><p><a href="/en/">English</a> · <a href="/zh/">中文</a> · <a href="/ja/">日本語</a></p></main><script type="module">import { chooseInitialLanguage, languageHome } from "/assets/site-language.mjs"; let stored=null; try{stored=localStorage.getItem("vantora-language")}catch{} const lang=chooseInitialLanguage({stored,languages:navigator.languages||[navigator.language]}); location.replace(languageHome(lang));</script></body></html>`;
}
