# Vantora Japan Seller-Sourcing Positioning Design

Date: 2026-08-17
Branch: `trilingual-public-site`
Status: Direction approved in conversation; written-spec review pending

## 1. Goal

Reframe the Japanese-language public site so Japanese companies, shareholders, asset owners, project sponsors and advisers understand that Vantora is not only a gateway for overseas buyers entering Japan, but also a place to bring Japanese M&A, capital, partnership and real-asset opportunities for cross-border discussion.

Primary conversion objective for Japanese visitors:

> 「海外の買い手・投資家・事業会社との取引を検討する案件があれば、Vantoraに相談できる」

This is a Japanese-market acquisition/sourcing layer, not a change to the overall Vantora positioning.

## 2. Recommended Approach

Use a trust-led Japanese advisory approach rather than aggressive investor-network marketing.

### Recommended wording principle

Prefer:

- 海外投資家・投資ファンド・ファミリーオフィス・上場企業を含む事業会社等との協議を支援
- 案件内容に応じて、適切な買い手・投資家候補との初期対話・情報整理・取引調整を支援
- クロスボーダーM&A、資本提携、事業提携、事業・資産売却について相談可能

Avoid public claims such as:

- 独自のグローバルネットワーク
- 多数の契約ファンド
- 世界中のファミリーオフィスと直接提携
- 必ず海外買い手を紹介できる
- 独占案件・独占投資家ネットワーク

unless later substantiated by approved company evidence.

## 3. Evidence Boundary

Existing internal material supports that UPEX/Vantora is developing cross-border investment proposals involving domestic and overseas operating companies and transaction counterparties, including project structuring and execution support. The current Drive evidence does not sufficiently substantiate a public claim about a fixed or quantified family-office network.

Therefore the public site may describe relevant investor / buyer categories as counterparties Vantora can engage or coordinate with, but should not imply contractual access, guaranteed introductions, exclusivity, or a quantified network.

## 4. Japanese Homepage Logic

The Japanese homepage remains M&A-led but adds a clear inbound seller / sponsor path.

Recommended section:

### 日本企業・案件オーナーの皆様へ

**海外の買い手・投資家との取引をご検討ですか。**

会社・事業の譲渡、資本受入れ、海外企業との事業提携、プロジェクト・資産の売却など、クロスボーダー案件についてご相談ください。

Vantoraは、日本側で案件内容を整理し、案件に応じて海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社等との初期対話、NDA、情報開示、条件協議、デューデリジェンス、取引実行まで支援します。

Primary CTA:

**案件について相談する**

Secondary CTA:

**海外投資家との取引について相談する**

## 5. Japanese Private Discussion Paths

Replace generic Japanese pathways with seller / sponsor language that maps directly to real needs:

1. **会社・事業の譲渡について相談する**
   - 会社売却
   - 事業承継
   - カーブアウト
   - 株式譲渡

2. **海外からの資本受入れを相談する**
   - 戦略投資
   - 資本提携
   - 成長資金
   - 共同投資

3. **海外企業との提携先を探す**
   - JV
   - 業務提携
   - 販路・技術・事業パートナー

4. **投資・事業案件を持ち込む**
   - BESS
   - Data Center
   - Commercial / Industrial Real Estate
   - Maritime / Aviation
   - Other real assets

## 6. Buyer / Capital Resource Presentation

A compact Japanese trust block should explain the types of overseas counterparties Vantora can work with.

Recommended heading:

**海外投資家・事業会社との接点**

Recommended copy:

> 案件の内容・規模・業種・取引目的に応じて、海外の投資ファンド、ファミリーオフィス、上場企業を含む事業会社、戦略投資家等との協議を支援します。単なる案件紹介ではなく、日本側で案件内容を整理し、相手候補との初期対話から取引条件の調整・実行まで一貫して対応します。

This must not display logos, investor counts, AUM, transaction volume or named counterparties without approval.

## 7. Japanese Tone

The Japanese site should feel:

- restrained
- transaction-specific
- discreet
- practical
- relationship-led

Avoid literal Chinese-style resource language such as `豊富な海外資源`, `強力な海外ネットワーク`, or `世界トップクラスの投資家`. These reduce credibility in a Japanese corporate context.

Use terms such as:

- 相談
- 案件整理
- 候補先との協議
- 取引調整
- 守秘
- 条件協議
- 実行支援

## 8. Information Architecture Impact

No new top-level route is required in V1.

Changes are limited to Japanese-language content and conversion hierarchy on:

- `/ja/`
- `/ja/about/`
- `/ja/contact/`
- optionally `/ja/capabilities/` for the M&A / partnership sections

English and Traditional Chinese remain unchanged unless a later separate localization decision is made.

## 9. Safety / Compliance

Do not imply that Vantora is acting as a licensed securities placement agent, investment manager or real-estate broker unless separately verified.

Preferred wording remains:

- M&A・戦略投資支援
- 取引支援
- 案件探索
- 投資家・買い手候補との協議支援
- 日本側での調整・実行支援

## 10. Testing

Tests should verify that the Japanese pages:

- clearly include seller / sponsor consultation language
- mention overseas funds, family offices and listed / operating companies only as relevant counterparty categories
- do not claim fixed investor counts, exclusivity, AUM or guaranteed introductions
- preserve the four Japanese Private Discussion paths
- retain M&A as the primary capability
- preserve existing trilingual routing, Registry safety and AI Concierge behavior

## 11. Acceptance Criteria

The Japanese site is successful when a Japanese business owner, adviser or project sponsor can understand within one or two sections that:

1. Vantora accepts Japanese M&A / investment / project opportunities for discussion.
2. Vantora can support cross-border dialogue with overseas funds, family offices, listed companies and strategic buyers depending on the opportunity.
3. Vantora supports the Japan-side process from initial project structuring through NDA, information sharing, negotiation and execution.
4. The wording feels credible to Japanese corporate decision-makers and does not read like aggressive lead generation or unverified investor-network marketing.
5. No production deployment occurs before visual/content review.
