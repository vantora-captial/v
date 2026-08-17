const SELLER_SECTION = `<section class="section seller-sourcing" id="ja-seller-sourcing">
  <div class="wrap seller-sourcing__layout">
    <div class="seller-sourcing__copy">
      <p class="kicker">日本企業・案件オーナーの皆様へ</p>
      <h2>海外の買い手・投資家との取引をご検討ですか。</h2>
      <p>会社・事業の譲渡、資本受入れ、海外企業との事業提携、プロジェクト・資産の売却など、クロスボーダー案件についてご相談ください。</p>
      <div class="seller-sourcing__actions">
        <a class="button button-gold" href="/ja/contact/?path=sell-business-asset">案件について相談する</a>
        <a class="button button-dark" href="/ja/contact/?path=acquire-invest">海外投資家との取引について相談する</a>
      </div>
    </div>
    <div class="seller-sourcing__execution">
      <p class="eyebrow">Japan-side Execution</p>
      <p>Vantoraは、日本側で案件内容を整理し、案件に応じて海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との初期対話、NDA、情報開示、条件協議、デューデリジェンス、取引実行まで支援します。</p>
    </div>
  </div>
</section>`;

const COUNTERPARTY_SECTION = `<section class="section overseas-counterparties" id="ja-overseas-counterparties">
  <div class="wrap overseas-counterparties__layout">
    <div>
      <p class="kicker">Cross-Border Counterparties</p>
      <h2>海外投資家・事業会社との接点</h2>
    </div>
    <p>案件の内容・規模・業種・取引目的に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との協議を支援します。単なる案件紹介ではなく、日本側で案件内容を整理し、相手候補との初期対話から取引条件の調整・実行まで一貫して対応します。</p>
  </div>
</section>`;

const CONTACT_REPLACEMENTS = new Map([
  ["日本で買収・投資を検討", "海外からの資本受入れを相談する"],
  ["事業・資産の売却を検討", "会社・事業の譲渡について相談する"],
  ["日本の戦略パートナーを探索", "海外企業との提携先を探す"],
  ["案件を相談・紹介", "投資・事業案件を持ち込む"],
  ["日本企業・資産・プロジェクトを検討する買手、投資家、ファンド、ファミリーオフィス、事業会社向け。", "戦略投資・資本提携・成長資金・共同投資など、海外からの資本受入れをご検討の方へ。"],
  ["秘密保持に配慮しながら事業、株式、資産の取引を検討するオーナー・企業向け。", "会社売却・事業承継・カーブアウト・株式譲渡など、会社・事業の譲渡をご検討の方へ。"],
  ["日本でのパートナー、JV、販路、事業提携を検討する海外企業向け。", "JV・業務提携・販路・技術・事業パートナーなど、海外企業との提携をご検討の方へ。"],
  ["案件オーナー、紹介者、パートナーからの非公開案件のご相談向け。", "BESS、データセンター、商業・産業用不動産、船舶・航空、その他実物資産などの案件持込み・ご相談へ。"]
]);

function replaceAllKnown(html, replacements) {
  let output = html;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

function injectStylesheet(html) {
  if (html.includes("/assets/ja-sourcing.css")) return html;
  return html.replace(
    '<link rel="stylesheet" href="/assets/site.css">',
    '<link rel="stylesheet" href="/assets/site.css">\n  <link rel="stylesheet" href="/assets/ja-sourcing.css">'
  );
}

function enhanceHome(html) {
  let output = html.replace(
    '<section id="home-capabilities"',
    `${SELLER_SECTION}<section id="home-capabilities"`
  );
  output = output.replace(
    '<section id="home-process"',
    `${COUNTERPARTY_SECTION}<section id="home-process"`
  );
  output = output.replace(
    '海外投資家・企業による日本でのM&A、戦略投資、事業提携を案件探索から取引実行まで支援します。',
    '海外投資家による日本でのM&A・戦略投資に加え、日本企業・案件オーナーによる売却、資本受入れ、海外企業との提携についても、案件整理から取引実行まで支援します。'
  );
  return output;
}

function enhanceAbout(html) {
  const note = `<div class="ja-about-sourcing-note editorial-section">
    <p class="eyebrow">For Japanese Owners & Sponsors</p>
    <h2>日本側で案件を整理し、海外との協議を前に進めます。</h2>
    <p>会社・事業・資産・プロジェクトの売却や資本受入れを検討する日本企業・オーナー・アドバイザーに対し、初期的な案件整理、守秘を前提とした相手候補との対話、条件協議、デューデリジェンス調整、取引実行まで支援します。</p>
  </div>`;
  let output = html.replace('</main>', `${note}</main>`);
  output = output.replace(
    'クロスボーダーの視点と日本国内の実行基盤を組み合わせ、取引・提携の推進を支援します。',
    'クロスボーダーの視点と日本国内の実行基盤を組み合わせ、海外投資家による日本投資と、日本企業・案件オーナーによる売却・資本受入れ・海外提携の双方を支援します。'
  );
  return output;
}

function enhanceContact(html) {
  let output = replaceAllKnown(html, CONTACT_REPLACEMENTS);
  output = output.replace(
    '日本で、何を実現したいですか。',
    '会社・事業・資産・プロジェクトについてご相談ください。'
  );
  output = output.replace(
    '目的に近い相談項目をお選びください。必要な情報から確認し、守秘に配慮した協議を開始します。',
    '日本企業・株主・案件オーナー・アドバイザーからのご相談も受け付けています。目的に近い項目をお選びください。必要な情報から確認し、守秘に配慮した協議を開始します。'
  );
  const confidentiality = `<div class="ja-confidentiality-note">
    <strong>初期相談について</strong>
    <p>初期相談では、案件名や相手先を特定できる情報を最初から開示いただく必要はありません。必要な範囲から確認し、守秘に配慮して協議を進めます。</p>
  </div>`;
  output = output.replace('</main>', `${confidentiality}</main>`);
  output = output.replace(
    '日本での買収、投資、売却、事業提携、案件紹介について個別にご相談いただけます。',
    '日本企業・事業・資産・プロジェクトの売却、海外からの資本受入れ、事業提携、クロスボーダーM&Aについて個別にご相談いただけます。'
  );
  return output;
}

export function enhanceJapanesePage(pageKey, html) {
  let output = injectStylesheet(html);
  if (pageKey === "home") output = enhanceHome(output);
  if (pageKey === "about") output = enhanceAbout(output);
  if (pageKey === "contact") output = enhanceContact(output);
  return output;
}
