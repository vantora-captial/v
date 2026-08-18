import { PRESENTATION_OPPORTUNITIES, PUBLIC_CATEGORY_LABELS } from "./content.mjs";

const e = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const META = {
  home: {
    title: "Vantora｜会社・事業のこれからを海外という選択肢から",
    description: "事業承継、会社・事業の譲渡、海外からの資本受入れ、海外企業との提携、投資・事業案件について、日本側で整理しクロスボーダーの選択肢を検討します。"
  },
  about: {
    title: "Vantoraについて｜日本側から海外との選択肢を支援",
    description: "Vantoraの役割、日本側で行う案件整理、海外投資家・事業会社との協議、対象案件、進め方と守秘についてご案内します。"
  },
  contact: {
    title: "ご相談｜Vantora",
    description: "会社・事業の譲渡、海外からの資本受入れ、海外企業との事業提携、投資・事業案件について、方針が決まっていない初期段階からご相談いただけます。"
  }
};

const CONCERNS = [
  ["後継者について悩んでいる", "会社や事業を次の世代へつなぐ方法を検討したい。", "sell-business-asset"],
  ["会社・事業の譲渡を検討している", "国内だけでなく、海外の買い手も選択肢として検討したい。", "sell-business-asset"],
  ["海外から資本を受け入れたい", "成長投資や新規事業のため、海外の資本・事業会社との提携を考えたい。", "acquire-invest"],
  ["海外企業との事業提携を検討している", "販路、技術、JV等、海外企業との新しい可能性を探したい。", "find-partner"],
  ["不動産・エネルギー・事業案件について相談したい", "BESS、データセンター、不動産、船舶等の案件を海外投資家に提案したい。", "submit-opportunity"]
];

const ACTIONS = [
  ["整理する", "案件の状況、目的、条件を日本側で整理します。"],
  ["つなぐ", "案件に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との対話を支援します。"],
  ["進める", "NDA、情報開示、条件協議、デューデリジェンス、取引実行まで支援します。"]
];

const JOURNEY = [
  ["初期相談", "まずは匿名・概要レベルから。"],
  ["案件整理", "目的、条件、資料、取引スキームを整理。"],
  ["候補先の検討", "案件に合う海外投資家・事業会社候補を検討。"],
  ["守秘・初期協議", "NDA締結後、必要な範囲で情報共有。"],
  ["条件協議・DD", "条件整理、デューデリジェンス、関係者調整。"],
  ["取引実行", "クロージングまで日本側で支援。"]
];

const EXPERIENCE = [
  ["クロスボーダーM&A", "日本企業の買収・譲渡検討", "候補先の整理、情報共有、デューデリジェンス、条件協議等の取引推進を支援。"],
  ["エネルギー・インフラ", "BESS投資案件", "案件条件、事業性、財務面、日本側関係者との調整を支援。"],
  ["デジタルインフラ", "AIデータセンター関連案件", "用地、電力、開発条件、パートナーとの協議を日本側で支援。"],
  ["実物資産", "クロスボーダー資産取引", "資料整理、相手候補との対話、条件調整、取引実行を支援。"]
];

const CONTACT_PATHS = [
  ["sell-business-asset", "会社・事業の譲渡", "事業承継、会社売却、株式譲渡、カーブアウト等について。"],
  ["acquire-invest", "海外からの資本受入れ", "戦略投資、資本提携、成長資金、共同投資等について。"],
  ["find-partner", "海外企業との事業提携", "JV、販路、技術、業務提携、事業パートナー等について。"],
  ["submit-opportunity", "投資・事業案件の相談", "BESS、データセンター、不動産、船舶・航空、その他実物資産等について。"]
];

function alternates(path) {
  const suffix = path ? `${path}/` : "";
  return `<link rel="alternate" hreflang="en" href="https://vantora.jp/en/${suffix}">
<link rel="alternate" hreflang="zh-Hant" href="https://vantora.jp/zh/${suffix}">
<link rel="alternate" hreflang="ja" href="https://vantora.jp/ja/${suffix}">
<link rel="alternate" hreflang="x-default" href="https://vantora.jp/en/${suffix}">`;
}

function header(pageKey) {
  const nav = [
    ["home", "/ja/", "ホーム"],
    ["capabilities", "/ja/capabilities/", "支援内容"],
    ["experience", "/ja/experience/", "案件事例"],
    ["opportunities", "/ja/opportunities/", "案件情報"],
    ["about", "/ja/about/", "Vantoraについて"]
  ];
  return `<header class="site-header ja-site-header"><div class="wrap header-inner">
    <a class="brand" href="/ja/" aria-label="Vantora ホーム"><img src="/assets/vantora-logo-white.svg" alt="Vantora" class="brand-logo"><span class="brand-endorsement">Powered by UPEX</span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span><span class="sr-only">メニュー</span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="メインナビゲーション">
      ${nav.map(([key, href, label]) => `<a href="${href}"${key === pageKey ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      <a class="nav-contact" href="/ja/contact/"${pageKey === "contact" ? ' aria-current="page"' : ""}>ご相談</a>
    </nav>
    <div class="language-nav" aria-label="Language"><a href="/en/" data-language-choice="en">EN</a><a href="/zh/" data-language-choice="zh">中文</a><a href="/ja/" data-language-choice="ja" aria-current="true">日本語</a></div>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap footer-grid"><div><img src="/assets/vantora-logo-white.svg" alt="Vantora" class="footer-logo"><p>日本企業のクロスボーダーM&A・資本提携・事業提携を、日本側から支援します。</p><small>個別相談では、必要な範囲から情報を確認し、秘密保持に配慮して進めます。</small></div><div class="footer-contact"><a href="mailto:info@u-pex.com">info@u-pex.com</a><a href="tel:+81367174565">+81 3 6717 4565</a><span>Tokyo, Japan · Japan-wide execution</span></div></div></footer>`;
}

function shell(pageKey, body, { mode = "live", registryApi = "" } = {}) {
  const path = pageKey === "home" ? "" : pageKey;
  const meta = META[pageKey];
  const canonical = `https://vantora.jp/ja/${path ? `${path}/` : ""}`;
  return `<!doctype html>
<html lang="ja" data-site-language="ja" class="ja-consultation-site">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#071321">
  <title>${e(meta.title)}</title>
  <meta name="description" content="${e(meta.description)}">
  <link rel="canonical" href="${canonical}">
  ${alternates(path)}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${e(meta.title)}">
  <meta property="og:description" content="${e(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <link rel="icon" href="/assets/vantora-logo-mark.svg">
  <meta name="vantora-ai-api" content="https://vantora-ai-sales.vantora-captial-tech.workers.dev">
  <meta name="vantora-registry-api" content="${e(registryApi)}">
  <meta name="vantora-opportunity-mode" content="${e(mode)}">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/ja-consultation.css">
  <link rel="stylesheet" href="/assets/ai-sales.css">
  <script type="module" src="/assets/site.js"></script>
  <script type="module" src="/assets/ai-sales.js"></script>
</head>
<body class="ja-consultation-body">
<a class="skip-link" href="#main-content">本文へ移動</a>
${header(pageKey)}
<main id="main-content">${body}</main>
${footer()}
</body>
</html>`;
}

function sampleOpportunities(mode) {
  if (mode !== "presentation") return `<div class="ja-opportunity-empty"><p>現在公開できる案件情報は、個別相談にてご案内します。</p><a class="ja-text-link" href="/ja/contact/?path=acquire-invest">ご相談はこちら →</a></div>`;
  return PRESENTATION_OPPORTUNITIES.slice(0, 4).map(item => `<article class="ja-opportunity-card presentation-sample">
    <p class="sample-label">表示サンプル — 実案件ではありません</p>
    <p class="ja-meta">${e(PUBLIC_CATEGORY_LABELS.ja[item.category] || item.category)}</p>
    <h3>${e(item.publicTitle)}</h3>
    <p>${e(item.teaser)}</p>
    <dl><div><dt>地域</dt><dd>${e(item.region)}</dd></div><div><dt>取引</dt><dd>${e(item.transactionType)}</dd></div><div><dt>価格</dt><dd>個別相談</dd></div></dl>
  </article>`).join("");
}

export function renderJapaneseHome(options = {}) {
  const { mode = "live" } = options;
  const body = `<section class="ja-hero"><div class="wrap ja-hero-grid"><div>
    <p class="ja-label">日本におけるクロスボーダーM&A・戦略投資</p>
    <h1>会社や事業のこれからを、<br>海外という選択肢から考える。</h1>
    <p class="ja-hero-lead">事業承継、会社・事業の譲渡、資本受入れ、海外企業との提携。Vantoraは、日本企業の次の選択肢を、海外の投資家・事業会社との対話から支援します。</p>
    <div class="ja-actions"><a class="button button-gold" href="/ja/contact/">まずは相談する</a><a class="button ja-button-secondary" href="/ja/about/">Vantoraについて</a></div>
    <p class="ja-reassurance">初期相談可 <span>｜</span> 秘密保持に配慮 <span>｜</span> 案件名の開示不要</p>
  </div><aside class="ja-hero-note"><strong>まだ方針が決まっていなくても構いません。</strong><p>売却、資本提携、事業提携など、現在の状況を伺いながら考えられる選択肢を一緒に整理します。</p></aside></div></section>

<section class="ja-section ja-concerns"><div class="wrap"><div class="ja-section-head"><p>ご相談内容</p><h2>こんなお悩みはありませんか</h2><span>まずは状況をお聞かせください。具体的な方針が決まっていない段階でもご相談いただけます。</span></div><div class="ja-concern-list">${CONCERNS.map(([title, text, path], i) => `<a href="/ja/contact/?path=${path}" class="ja-concern-row"><span class="ja-index">0${i + 1}</span><div><h3>${e(title)}</h3><p>${e(text)}</p></div><b aria-hidden="true">→</b></a>`).join("")}</div></div></section>

<section class="ja-section ja-actions-section"><div class="wrap"><div class="ja-section-head"><p>Vantoraの役割</p><h2>Vantoraができること</h2><span>複雑なクロスボーダー取引を、日本側で分かりやすく整理しながら進めます。</span></div><div class="ja-three-actions">${ACTIONS.map(([title, text], i) => `<article><span>0${i + 1}</span><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join("")}</div></div></section>

<section class="ja-section ja-overseas"><div class="wrap ja-overseas-grid"><div><p class="ja-label">海外との接点</p><h2>海外との選択肢を広げる</h2></div><div><p>案件の内容・規模・業種・取引目的に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との協議を支援します。</p><p>単に相手候補を紹介するのではなく、案件整理、守秘、初期対話、条件協議、デューデリジェンス、取引実行まで日本側で支援します。</p></div></div></section>

<section class="ja-section ja-journey"><div class="wrap"><div class="ja-section-head"><p>進め方</p><h2>案件をどう進めるか</h2><span>必要な情報を一度に求めるのではなく、段階に応じて整理しながら進めます。</span></div><ol class="ja-journey-list">${JOURNEY.map(([title, text], i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><div><h3>${e(title)}</h3><p>${e(text)}</p></div></li>`).join("")}</ol></div></section>

<section class="ja-section ja-experience"><div class="wrap"><div class="ja-section-head"><p>案件事例</p><h2>支援内容から見る案件経験</h2><span>個別案件を特定しない形で、当社が担う実務の範囲をご紹介します。</span></div><div class="ja-experience-grid">${EXPERIENCE.map(([sector, title, text]) => `<article><p class="ja-meta">${e(sector)}</p><h3>${e(title)}</h3><p>${e(text)}</p><small>案件経験｜非公開情報は掲載していません</small></article>`).join("")}</div><a class="ja-text-link" href="/ja/experience/">案件事例を見る →</a></div></section>

<section class="ja-section ja-why"><div class="wrap"><div class="ja-section-head inverse"><p>Vantoraについて</p><h2>日本側で整理し、海外との対話を前に進める。</h2></div><div class="ja-why-grid"><article><h3>日本側での案件整理</h3><p>経営者・株主・案件オーナーの意向を踏まえ、目的、条件、情報開示の範囲を整理します。</p></article><article><h3>クロスボーダーの視点</h3><p>海外投資家や事業会社の検討軸を踏まえ、日本側との協議が進む形に整えます。</p></article><article><h3>実行までの支援</h3><p>初期対話だけでなく、NDA、条件協議、DD、関係者調整、取引実行まで支援します。</p></article></div><div class="ja-upex"><strong>Vantora × UPEX</strong><p>VantoraはUPEXの日本国内における事業基盤を活用し、クロスボーダーの視点と国内実行をつなぎます。</p></div></div></section>

<section class="ja-section ja-opportunities"><div class="wrap"><div class="ja-section-head"><p>案件情報</p><h2>検討可能なテーマ・案件</h2><span>公開承認された情報のみ掲載し、詳細は必要に応じて守秘手続きの後に共有します。</span></div><div class="ja-opportunity-grid">${sampleOpportunities(mode)}</div><a class="ja-text-link" href="/ja/opportunities/">案件情報を見る →</a></div></section>

<section class="ja-section ja-consultation-cta"><div class="wrap ja-consultation-grid"><div><p class="ja-label">初期相談</p><h2>まずはご相談ください</h2><p>会社・事業の譲渡、資本受入れ、海外企業との提携、投資・事業案件について、初期段階からご相談いただけます。案件名や詳細情報を最初から開示いただく必要はありません。</p><p class="ja-reassurance">初期相談可 <span>｜</span> 秘密保持に配慮 <span>｜</span> 案件名の開示不要</p></div><div class="ja-consultation-action"><a class="button button-gold" href="/ja/contact/">相談する</a><p>メール：info@u-pex.com<br>電話：+81 3 6717 4565</p></div></div></section>

<section class="ja-section ja-contact-paths"><div class="wrap"><div class="ja-section-head"><p>ご相談窓口</p><h2>ご相談内容をお選びください</h2></div><div class="ja-contact-grid">${CONTACT_PATHS.map(([key, title, text]) => `<a href="/ja/contact/?path=${key}"><h3>${e(title)}</h3><p>${e(text)}</p><span>相談する →</span></a>`).join("")}</div></div></section>`;
  return shell("home", body, options);
}

export function renderJapaneseAbout(options = {}) {
  const body = `<section class="ja-page-hero"><div class="wrap"><p class="ja-label">Vantoraについて</p><h1>海外との取引を、<br>日本側から整理して進める。</h1><p>Vantoraは、海外投資家による日本投資だけでなく、日本企業・株主・案件オーナーが海外という選択肢を検討する際の日本側実務を支援します。</p></div></section>
  <section class="ja-section"><div class="wrap ja-about-stack">
    <article><span>01</span><div><h2>Vantoraの役割</h2><p>会社・事業の譲渡、資本受入れ、海外企業との提携、投資・事業案件について、まず状況と目的を整理し、検討可能な選択肢を一緒に考えます。</p></div></article>
    <article><span>02</span><div><h2>日本側で行うこと</h2><p>案件の背景、希望条件、資料、開示範囲を整理し、NDA、情報共有、条件協議、デューデリジェンス、関係者調整、取引実行まで支援します。</p></div></article>
    <article><span>03</span><div><h2>海外との接点</h2><p>案件の内容に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との協議を支援します。</p></div></article>
    <article><span>04</span><div><h2>対象となる案件</h2><p>M&A、事業承継、資本提携、JV・業務提携に加え、BESS、データセンター、商業・産業用不動産、船舶・航空等の実物資産案件も対象としています。</p></div></article>
    <article><span>05</span><div><h2>進め方と守秘</h2><p>初期相談では、案件名や相手先を特定できる情報を最初から開示いただく必要はありません。必要な範囲から確認し、秘密保持に配慮して協議を進めます。</p></div></article>
  </div></section>
  <section class="ja-section ja-why"><div class="wrap ja-consultation-grid"><div><p class="ja-label">Japan-side Operating Foundation</p><h2>Vantora × UPEX</h2><p>VantoraはUPEXの日本国内における事業基盤を活用し、クロスボーダーの視点と国内実行をつなぎます。</p></div><div class="ja-consultation-action"><a class="button button-gold" href="/ja/contact/">まずは相談する</a></div></div></section>`;
  return shell("about", body, options);
}

export function renderJapaneseContact(options = {}) {
  const buttons = CONTACT_PATHS.map(([key, title, text], i) => `<button type="button" role="tab" data-contact-path="${key}" aria-selected="${i === 0 ? "true" : "false"}"><strong>${e(title)}</strong><span>${e(text)}</span></button>`).join("");
  const body = `<section class="ja-page-hero ja-contact-hero"><div class="wrap"><p class="ja-label">ご相談</p><h1>どのようなことをご検討ですか。</h1><p>まだ方針が決まっていない段階でも構いません。現在の状況やお考えを伺いながら、考えられる選択肢を一緒に整理します。</p><p class="ja-reassurance">初期相談可 <span>｜</span> 秘密保持に配慮 <span>｜</span> 案件名の開示不要</p></div></section>
  <section class="ja-section ja-contact-section"><div class="wrap ja-contact-layout"><div><h2>ご相談内容をお選びください</h2><div class="contact-paths ja-contact-tabs" role="tablist" aria-label="ご相談内容">${buttons}</div></div><div class="contact-form-shell"><div data-contact-form></div><p class="privacy-note">初期段階では、機密性の高い資料や案件名を最初から送付いただく必要はありません。情報共有の方法を確認しながら進めます。</p><div class="direct-contact"><p class="eyebrow">直接のお問い合わせ</p><a href="mailto:info@u-pex.com">メール · info@u-pex.com</a><a href="tel:+81367174565">電話 · +81 3 6717 4565</a></div></div></div></section>
  <section class="ja-section ja-contact-note"><div class="wrap"><h2>まずは概要だけでも構いません。</h2><p>会社・事業・資産・プロジェクトの状況、現在のお考え、検討している選択肢など、共有可能な範囲からお聞かせください。</p></div></section><script type="module" src="/assets/contact.mjs"></script>`;
  return shell("contact", body, options);
}
