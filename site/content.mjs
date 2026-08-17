export const LANGUAGES = Object.freeze(["en", "zh", "ja"]);

export const SITE = {
  en: { langAttr: "en", label: "EN", brand: "Vantora", endorsement: "Powered by UPEX", baseUrl: "https://vantora.jp" },
  zh: { langAttr: "zh-Hant", label: "中文", brand: "Vantora", endorsement: "Powered by UPEX", baseUrl: "https://vantora.jp" },
  ja: { langAttr: "ja", label: "日本語", brand: "Vantora", endorsement: "Powered by UPEX", baseUrl: "https://vantora.jp" }
};

export const NAV = {
  en: { home: "Home", capabilities: "Capabilities", experience: "Experience", opportunities: "Opportunities", about: "About", contact: "Private Discussion" },
  zh: { home: "首頁", capabilities: "核心能力", experience: "項目經驗", opportunities: "精選機會", about: "關於我們", contact: "私密洽談" },
  ja: { home: "ホーム", capabilities: "支援領域", experience: "案件経験", opportunities: "案件情報", about: "Vantoraについて", contact: "個別相談" }
};

export const PAGES = {
  en: {
    home: { title: "Vantora | Cross-Border M&A & Strategic Investment in Japan", description: "Japan-focused cross-border M&A, strategic investment and transaction execution support for international investors and companies." },
    capabilities: { title: "Capabilities | Vantora", description: "Cross-border M&A, energy, digital infrastructure, real assets and Japan market execution support." },
    experience: { title: "Selected Experience | Vantora", description: "Selected anonymized engagement experience across Japan M&A, energy, digital infrastructure and real assets." },
    opportunities: { title: "Selected Opportunities | Vantora", description: "Curated Japan and cross-border opportunities available for qualified counterparties." },
    about: { title: "About Vantora | Japan-side Execution", description: "Vantora combines cross-border transaction perspective with Japan-side execution support." },
    contact: { title: "Private Discussion | Vantora", description: "Start a private discussion about an acquisition, investment, sale, strategic partnership or opportunity in Japan." }
  },
  zh: {
    home: { title: "Vantora｜日本跨境併購與戰略投資", description: "協助海外投資者與企業推進日本企業收購、戰略投資、項目合作與日本側交易執行。" },
    capabilities: { title: "核心能力｜Vantora", description: "涵蓋跨境併購、能源、AI資料中心、商業與工業不動產、特殊實物資產及日本市場合作。" },
    experience: { title: "項目經驗｜Vantora", description: "以匿名方式呈現日本併購、儲能、AI資料中心與跨境實物資產等項目的執行經驗。" },
    opportunities: { title: "精選機會｜Vantora", description: "面向合格交易對手展示經審核的日本及跨境投資與交易機會。" },
    about: { title: "關於 Vantora｜日本側執行", description: "Vantora 結合跨境交易視角與日本本地執行能力，協助交易與合作向前推進。" },
    contact: { title: "私密洽談｜Vantora", description: "就日本收購、投資、出售、戰略合作或項目提交與 Vantora 展開私密洽談。" }
  },
  ja: {
    home: { title: "Vantora｜日本におけるクロスボーダーM&A・戦略投資", description: "海外投資家・企業による日本でのM&A、戦略投資、事業提携を案件探索から取引実行まで支援します。" },
    capabilities: { title: "支援領域｜Vantora", description: "クロスボーダーM&A、エネルギー、デジタルインフラ、実物資産、日本市場での事業提携を支援します。" },
    experience: { title: "案件経験｜Vantora", description: "日本企業M&A、蓄電、AIデータセンター、実物資産等における匿名化した支援経験をご紹介します。" },
    opportunities: { title: "案件情報｜Vantora", description: "適格な取引候補先に向け、審査済みの日本およびクロスボーダー案件情報を掲載します。" },
    about: { title: "Vantoraについて｜日本側の実行支援", description: "クロスボーダーの視点と日本国内の実行基盤を組み合わせ、取引・提携の推進を支援します。" },
    contact: { title: "個別相談｜Vantora", description: "日本での買収、投資、売却、事業提携、案件紹介について個別にご相談いただけます。" }
  }
};

const process = {
  en: [
    ["Identify", "Target and opportunity sourcing aligned with the mandate."],
    ["Evaluate", "Commercial and financial screening before deeper engagement."],
    ["Engage", "Japan-side dialogue and stakeholder coordination."],
    ["Structure", "Transaction framework and negotiation support."],
    ["Execute", "Diligence coordination and transaction execution support."]
  ],
  zh: [
    ["Identify｜尋找", "依照投資或交易需求尋找標的與項目機會。"],
    ["Evaluate｜判斷", "在深入接觸前進行商業與財務層面的初步篩選。"],
    ["Engage｜溝通", "推進日本側對話及利害關係人協調。"],
    ["Structure｜架構", "協助設計交易框架並支持談判推進。"],
    ["Execute｜執行", "協調盡調與交易流程，支持項目落地。"]
  ],
  ja: [
    ["Identify｜探索", "投資・取引方針に沿って候補先や案件を探索します。"],
    ["Evaluate｜評価", "本格協議の前に事業性・財務面を初期評価します。"],
    ["Engage｜協議", "日本側との対話および関係者調整を進めます。"],
    ["Structure｜設計", "取引スキームの整理と交渉を支援します。"],
    ["Execute｜実行", "デューデリジェンス調整から取引実行まで支援します。"]
  ]
};

const why = {
  en: [
    ["Japan-side access", "Practical local dialogue and coordination to move work forward in Japan."],
    ["Cross-border transaction perspective", "International investor requirements translated into workable Japan-side discussions."],
    ["Execution-led advisory", "Advice organized around advancing a transaction or strategic partnership, not simply producing information."]
  ],
  zh: [
    ["日本側資源與溝通", "在日本本地實際推進對話、協調與交易工作。"],
    ["跨境交易視角", "理解海外投資者的判斷方式，並轉化為可在日本側執行的溝通與交易安排。"],
    ["以執行為導向", "工作重點不是停留在提供資訊，而是推動交易或戰略合作向前。"]
  ],
  ja: [
    ["日本側でのアクセス", "日本国内で実際の対話・調整を行い、案件を前に進めます。"],
    ["クロスボーダー取引の視点", "海外投資家の判断軸を理解し、日本側との実務的な協議につなげます。"],
    ["実行を重視するアドバイザリー", "情報提供にとどまらず、取引・事業提携を前進させることを重視します。"]
  ]
};

export const HOME = {
  en: {
    hero: { eyebrow: "Japan-focused cross-border advisory", title: "Cross-Border M&A & Strategic Investment in Japan", body: "We advise international investors and companies on acquisitions, strategic investments and partnerships in Japan — from target identification and local dialogue to transaction coordination and execution.", primaryCta: "Discuss a Japan M&A or Investment Plan", secondaryCta: "Explore Our Focus Areas" },
    sections: ["capabilities", "experience", "opportunities", "process", "why", "contact"],
    capabilities: { kicker: "Capabilities", title: "Japan-side execution across transactions and strategic investment.", body: "Cross-border M&A is our core. Around it, we support selected infrastructure, real-asset and market-entry opportunities where local execution matters." },
    experience: { kicker: "Selected Experience", title: "Experience defined by the work performed.", body: "Selected engagement experience is presented on an anonymized basis, with emphasis on role and execution scope rather than unsupported deal statistics." },
    opportunities: { kicker: "Selected Opportunities", title: "Curated opportunities for qualified counterparties.", body: "Only approved public teasers are shown. Detailed information is shared through a controlled qualification and confidentiality process.", cta: "View Selected Opportunities", fallback: "Selected opportunities are available through private discussion." },
    process: { kicker: "How We Execute", title: "From opportunity identification to Japan-side execution.", items: process.en },
    why: { kicker: "Why Vantora", title: "Cross-border perspective, grounded in Japan.", items: why.en },
    contact: { kicker: "Private Discussion", title: "What are you looking to do in Japan?", body: "Choose the route that best matches your objective. We will start with the information needed for a focused, confidential discussion." }
  },
  zh: {
    hero: { eyebrow: "專注日本的跨境交易顧問", title: "專注日本的跨境併購與戰略投資", body: "協助海外投資者與企業在日本尋找收購標的、投資機會及戰略合作方，並從前期判斷、日本側溝通到談判與交易執行，全程推進項目落地。", primaryCta: "討論日本併購或投資計畫", secondaryCta: "了解我們的重點領域" },
    sections: ["capabilities", "experience", "opportunities", "process", "why", "contact"],
    capabilities: { kicker: "核心能力", title: "以跨境併購為主軸，延伸至日本側戰略投資與交易執行。", body: "我們把跨境併購放在最核心的位置，並在能源、AI資料中心、實物資產、不動產與市場合作等需要日本本地執行的領域提供支持。" },
    experience: { kicker: "項目經驗", title: "用實際執行範圍說明能力。", body: "案例以匿名方式呈現，重點放在我們參與的工作、判斷與交易推進範圍，不使用缺乏依據的交易數字。" },
    opportunities: { kicker: "精選機會", title: "面向合格交易對手的精選項目。", body: "網站只展示經批准的公開 Teaser。更完整資訊需經資格確認與保密流程後提供。", cta: "查看精選機會", fallback: "目前精選項目可透過私密洽談了解。" },
    process: { kicker: "執行方式", title: "從項目尋找到日本側執行。", items: process.zh },
    why: { kicker: "Why Vantora", title: "跨境視角，落地於日本。", items: why.zh },
    contact: { kicker: "私密洽談", title: "您希望在日本推進什麼？", body: "選擇最符合您目標的入口，我們會先從必要資訊開始，進行聚焦且重視保密的溝通。" }
  },
  ja: {
    hero: { eyebrow: "日本にフォーカスしたクロスボーダー支援", title: "日本におけるクロスボーダーM&A・戦略投資", body: "海外投資家・企業による日本企業の買収、戦略投資、資本・業務提携について、候補先の探索から日本側との協議、取引調整、実行まで支援します。", primaryCta: "日本でのM&A・投資について相談する", secondaryCta: "注力領域を見る" },
    sections: ["capabilities", "experience", "opportunities", "process", "why", "contact"],
    capabilities: { kicker: "支援領域", title: "クロスボーダーM&Aを軸に、日本側での戦略投資・取引実行を支援。", body: "M&Aを中核に、エネルギー、AIデータセンター、実物資産、不動産、事業提携など、日本国内での実行が重要となる領域を支援します。" },
    experience: { kicker: "案件経験", title: "実際の支援内容から、実行力をお伝えします。", body: "案件経験は匿名化し、取引金額等の誇張ではなく、当社が担った役割と実行範囲を中心にご紹介します。" },
    opportunities: { kicker: "案件情報", title: "適格な取引候補先に向けた選定案件。", body: "公開承認されたティーザー情報のみ掲載します。詳細情報は適格性確認および守秘手続きの後に共有します。", cta: "案件情報を見る", fallback: "現在の案件情報は個別相談にてご案内します。" },
    process: { kicker: "実行プロセス", title: "案件探索から日本側での実行まで。", items: process.ja },
    why: { kicker: "Why Vantora", title: "クロスボーダーの視点を、日本での実行へ。", items: why.ja },
    contact: { kicker: "個別相談", title: "日本で、何を実現したいですか。", body: "目的に近い相談項目をお選びください。必要な情報から確認し、守秘に配慮した協議を開始します。" }
  }
};

const capabilitySets = {
  en: [
    ["ma", "Cross-Border M&A", "From target identification to transaction execution in Japan.", ["Buy-side and sell-side transaction support", "Target sourcing and initial screening", "Commercial and financial evaluation", "NDA, information process and LOI coordination", "Diligence, negotiation and execution support"]],
    ["energy", "Energy & Infrastructure", "Selected BESS, solar and related infrastructure opportunities where commercial discipline and Japan-side coordination matter.", ["Project and asset screening", "Commercial and financial diligence support", "Financial model review", "Local stakeholder coordination", "Transaction support"]],
    ["digital", "AI Data Center & Digital Infrastructure", "Japan-side project access and execution coordination across sites, power, development conditions and partners.", ["Site and land assessment coordination", "Power and grid-related coordination", "Development-condition review", "Partner and investor coordination", "Transaction support"]],
    ["cre", "Commercial & Industrial Real Estate", "Sourcing and transaction coordination for selected commercial and industrial assets.", ["Land and industrial sites", "Logistics and warehouse facilities", "Factories and industrial properties", "Income-producing commercial assets", "Buyer-seller coordination and local execution support"]],
    ["special", "Special & Real Assets", "Cross-border sourcing and transaction coordination for selected maritime, aviation and other real assets.", ["Opportunity sourcing", "Commercial review", "Document coordination", "Buyer-seller dialogue", "Transaction execution support"]],
    ["partnerships", "Japan Market Entry & Strategic Partnerships", "Japan-side partner access and commercial execution for companies entering or expanding in the market.", ["Strategic partner sourcing", "JV and business-alliance opportunities", "Distribution and channel development", "Commercial negotiation support", "Japan-side business coordination"]]
  ],
  zh: [
    ["ma", "跨境併購", "從收購標的尋找到日本側交易執行。", ["買方與賣方交易支持", "標的尋找與初步篩選", "商業及財務判斷", "NDA、資訊流程與 LOI 協調", "盡調、談判與交易執行支持"]],
    ["energy", "能源與基礎設施", "聚焦 BESS、Solar 與相關能源項目，支持商業判斷、財務分析及日本側協調。", ["項目與資產篩選", "商業與財務盡調支持", "財務模型審閱", "本地利害關係人協調", "交易支持"]],
    ["digital", "AI 資料中心與數位基礎設施", "圍繞土地、電力、開發條件、合作方與投資方推進日本側項目執行。", ["場址與土地條件協調", "電力與電網相關協調", "開發條件判斷", "合作方及投資方協調", "交易支持"]],
    ["cre", "商業與工業不動產", "為精選商業與工業資產提供項目尋找、交易協調與本地執行支持。", ["土地與工業用地", "物流與倉儲設施", "工廠及工業物業", "收益型商業資產", "買賣雙方協調與本地執行支持"]],
    ["special", "特殊與實物資產", "面向船舶、航空器及其他精選非標準化實物資產提供跨境項目與交易支持。", ["項目尋找", "商業判斷", "資料與文件協調", "買賣雙方溝通", "交易執行支持"]],
    ["partnerships", "日本市場進入與戰略合作", "協助海外企業在日本尋找合作方並推進市場進入、JV、渠道與商務合作。", ["戰略合作方尋找", "JV 與業務合作機會", "渠道與分銷拓展", "商務談判支持", "日本側業務協調"]]
  ],
  ja: [
    ["ma", "クロスボーダーM&A", "候補先の探索から日本側での取引実行まで支援します。", ["買手・売手側の取引支援", "候補先探索・初期スクリーニング", "事業性・財務面の初期評価", "NDA・情報開示・LOIプロセスの調整", "デューデリジェンス・交渉・実行支援"]],
    ["energy", "エネルギー・インフラ", "BESS、太陽光等の選定案件について、事業性評価と日本側調整を支援します。", ["案件・資産のスクリーニング", "事業・財務デューデリジェンス支援", "財務モデルレビュー", "国内関係者との調整", "取引支援"]],
    ["digital", "AIデータセンター・デジタルインフラ", "用地、電力、開発条件、パートナー等を含む日本側での案件推進を支援します。", ["用地・サイト条件の調整", "電力・系統関連の調整", "開発条件の確認", "パートナー・投資家との調整", "取引支援"]],
    ["cre", "商業・産業用不動産", "選定した商業・産業用資産について、案件探索、取引調整、国内実行支援を行います。", ["土地・産業用地", "物流・倉庫施設", "工場・産業用物件", "収益型商業資産", "売買当事者間の調整・国内実行支援"]],
    ["special", "特殊・実物資産", "船舶、航空機その他の選定実物資産について、クロスボーダーでの案件探索・取引調整を支援します。", ["案件探索", "事業性の確認", "資料・文書調整", "売買当事者間の協議", "取引実行支援"]],
    ["partnerships", "日本市場参入・戦略提携", "日本でのパートナー探索、JV、販路、事業提携等の実務推進を支援します。", ["戦略パートナー探索", "JV・業務提携機会", "流通・チャネル開拓", "商談・交渉支援", "日本側での事業調整"]]
  ]
};

export const CAPABILITIES = Object.fromEntries(LANGUAGES.map(lang => [lang, {
  title: lang === "en" ? "Capabilities" : lang === "zh" ? "核心能力" : "支援領域",
  intro: lang === "en" ? "Cross-border M&A is the core, supported by selected sectors where Japan-side execution creates value." : lang === "zh" ? "以跨境併購為核心，延伸至需要日本本地執行能力的精選投資與合作領域。" : "クロスボーダーM&Aを中核に、日本側での実行が重要となる選定領域を支援します。",
  items: capabilitySets[lang].map((item, index) => ({ key: item[0], title: item[1], summary: item[2], bullets: item[3], primary: index === 0 }))
}]));

const experienceSets = {
  en: [
    ["japan-corporate-acquisition", "Cross-Border M&A", "Japan Corporate Acquisition", "An international buyer evaluating a Japan-based acquisition opportunity.", "Support Japan-side target review and transaction dialogue.", "Target screening, financial review, information coordination, diligence and negotiation support.", "Selected engagement experience — confidential"],
    ["utility-scale-bess", "Energy & Infrastructure", "Utility-Scale BESS Investment", "Investment review of a grid-scale battery energy storage opportunity in Japan.", "Support commercial and investment-side evaluation.", "Commercial diligence, financial-model review, project-stage assessment and local stakeholder coordination.", "Selected engagement experience — confidential"],
    ["ai-data-center-development", "Digital Infrastructure", "AI Data Center Development", "Assessment of a Japan digital-infrastructure development opportunity.", "Coordinate Japan-side project conditions and counterpart discussions.", "Site, land, power, development-condition, partner and investment-side coordination.", "Selected engagement experience — confidential"],
    ["cross-border-real-asset", "Special & Real Assets", "Cross-Border Real Asset Transaction", "Review of a cross-border non-standard real-asset opportunity.", "Support commercial review and transaction coordination.", "Asset sourcing, document coordination, buyer-seller dialogue and execution support.", "Selected engagement experience — confidential"]
  ],
  zh: [
    ["japan-corporate-acquisition", "跨境併購", "日本企業收購", "海外買方評估日本企業收購機會。", "支持日本側標的判斷與交易溝通。", "標的篩選、財務審閱、資訊協調、盡調與談判支持。", "精選項目經驗｜保密"],
    ["utility-scale-bess", "能源與基礎設施", "大型 BESS 投資", "對日本大型電池儲能項目進行投資側評估。", "支持商業判斷與投資側分析。", "商業盡調、財務模型審閱、項目階段判斷與日本側利害關係人協調。", "精選項目經驗｜保密"],
    ["ai-data-center-development", "數位基礎設施", "AI 資料中心開發", "評估日本數位基礎設施開發機會。", "協調日本側項目條件及交易對手溝通。", "場址、土地、電力、開發條件、合作方與投資側協調。", "精選項目經驗｜保密"],
    ["cross-border-real-asset", "特殊與實物資產", "跨境實物資產交易", "評估跨境非標準化實物資產機會。", "支持商業審閱與交易協調。", "資產尋找、文件協調、買賣雙方溝通及交易執行支持。", "精選項目經驗｜保密"]
  ],
  ja: [
    ["japan-corporate-acquisition", "クロスボーダーM&A", "日本企業の買収検討", "海外買手による日本企業の買収機会を検討。", "日本側の候補先評価と取引協議を支援。", "候補先スクリーニング、財務確認、情報調整、デューデリジェンス、交渉支援。", "選定案件経験｜非公開"],
    ["utility-scale-bess", "エネルギー・インフラ", "大規模BESS投資", "日本の系統用蓄電案件について投資側で検討。", "事業性・投資面の評価を支援。", "事業デューデリジェンス、財務モデル確認、案件進捗評価、国内関係者調整。", "選定案件経験｜非公開"],
    ["ai-data-center-development", "デジタルインフラ", "AIデータセンター開発", "日本国内のデジタルインフラ開発機会を検討。", "国内プロジェクト条件と関係者協議を調整。", "サイト、土地、電力、開発条件、パートナー、投資側との調整。", "選定案件経験｜非公開"],
    ["cross-border-real-asset", "特殊・実物資産", "クロスボーダー実物資産取引", "非標準型の実物資産に関するクロスボーダー案件を検討。", "事業性確認と取引調整を支援。", "案件探索、文書調整、売買当事者間の協議、実行支援。", "選定案件経験｜非公開"]
  ]
};

export const EXPERIENCE = Object.fromEntries(LANGUAGES.map(lang => [lang, {
  title: lang === "en" ? "Selected Experience" : lang === "zh" ? "項目經驗" : "案件経験",
  intro: lang === "en" ? "Anonymized examples focus on the work performed and the execution scope." : lang === "zh" ? "以匿名方式呈現實際參與的工作與執行範圍。" : "匿名化した案件例を通じ、実際の支援内容と実行範囲をご紹介します。",
  items: experienceSets[lang].map(item => ({ key: item[0], sector: item[1], title: item[2], situation: item[3], role: item[4], scope: item[5], status: item[6] }))
}]));

const contactSets = {
  en: [
    ["acquire-invest", "Acquire or Invest in Japan", "For buyers, investors, funds, family offices and corporates evaluating Japan opportunities."],
    ["sell-business-asset", "Sell a Business or Asset", "For owners and companies considering a confidential sale or strategic transaction."],
    ["find-partner", "Find a Strategic Partner in Japan", "For companies seeking a Japan partner, JV, channel or commercial alliance."],
    ["submit-opportunity", "Submit an Opportunity", "For project owners, introducers and partners who want to discuss an opportunity confidentially."]
  ],
  zh: [
    ["acquire-invest", "在日本收購或投資", "適合正在評估日本企業、資產或項目的買方、投資人、基金、家族辦公室及企業。"],
    ["sell-business-asset", "出售企業或資產", "適合考慮以保密方式推進企業、股權或資產交易的持有人與企業。"],
    ["find-partner", "尋找日本戰略合作方", "適合尋找日本合作夥伴、JV、渠道或商務合作的海外企業。"],
    ["submit-opportunity", "提交項目機會", "適合希望以保密方式介紹項目的項目方、資產持有人、介紹人與合作夥伴。"]
  ],
  ja: [
    ["acquire-invest", "日本で買収・投資を検討", "日本企業・資産・プロジェクトを検討する買手、投資家、ファンド、ファミリーオフィス、事業会社向け。"],
    ["sell-business-asset", "事業・資産の売却を検討", "秘密保持に配慮しながら事業、株式、資産の取引を検討するオーナー・企業向け。"],
    ["find-partner", "日本の戦略パートナーを探索", "日本でのパートナー、JV、販路、事業提携を検討する海外企業向け。"],
    ["submit-opportunity", "案件を相談・紹介", "案件オーナー、紹介者、パートナーからの非公開案件のご相談向け。"]
  ]
};

export const CONTACT_PATHS = Object.fromEntries(LANGUAGES.map(lang => [lang, contactSets[lang].map(item => ({ key: item[0], title: item[1], description: item[2] }))]));

export const PUBLIC_CATEGORY_LABELS = {
  en: { MA: "M&A", BESS: "Energy", SOLAR: "Energy", SHIP: "Maritime", AIR: "Aviation", DC: "Data Center", CRE: "Real Estate", STRAT: "Strategic Partnership" },
  zh: { MA: "併購", BESS: "能源", SOLAR: "能源", SHIP: "船舶", AIR: "航空", DC: "資料中心", CRE: "不動產", STRAT: "戰略合作" },
  ja: { MA: "M&A", BESS: "エネルギー", SOLAR: "エネルギー", SHIP: "船舶", AIR: "航空", DC: "データセンター", CRE: "不動産", STRAT: "戦略提携" }
};

export const PRESENTATION_OPPORTUNITIES = [
  { id: "DEMO-MA-001", publicTitle: "Japan corporate acquisition opportunity", category: "MA", region: "Japan", transactionType: "Share Acquisition", price: { mode: "Hidden" }, teaser: "Illustrative acquisition teaser used only to demonstrate the presentation experience.", highlights: ["Established operating business", "Qualified counterparties only"], imageKeys: [], presentationOnly: true },
  { id: "DEMO-BESS-001", publicTitle: "Grid-scale BESS opportunity", category: "BESS", region: "Japan", transactionType: "Project Investment", price: { mode: "Hidden" }, teaser: "Illustrative energy-infrastructure teaser used only for presentation review.", highlights: ["Japan energy infrastructure", "Presentation sample"], imageKeys: [], presentationOnly: true },
  { id: "DEMO-DC-001", publicTitle: "Digital infrastructure development opportunity", category: "DC", region: "Japan", transactionType: "Strategic Investment", price: { mode: "Hidden" }, teaser: "Illustrative digital-infrastructure teaser used only for presentation review.", highlights: ["Site and power coordination", "Presentation sample"], imageKeys: [], presentationOnly: true },
  { id: "DEMO-CRE-001", publicTitle: "Industrial development site", category: "CRE", region: "Japan", transactionType: "Asset Acquisition", price: { mode: "Hidden" }, teaser: "Illustrative industrial real-estate teaser used only for presentation review.", highlights: ["Industrial use case", "Presentation sample"], imageKeys: [], presentationOnly: true }
];
