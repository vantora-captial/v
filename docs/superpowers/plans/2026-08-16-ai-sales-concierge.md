# Vantora AI Sales Concierge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-ready Chinese / Japanese / English AI sales concierge to the existing Vantora Japan Investment Hub, qualify inbound leads conversationally, confirm the captured information with the visitor, and send confirmed leads only to `aya@u-pex.com`.

**Architecture:** Keep GitHub Pages as the public static frontend and add a small Cloudflare Worker API for AI generation, validation, rate limiting, and email delivery. The Worker uses the OpenAI Responses API with strict structured output and a version-controlled approved knowledge file; email is sent through Resend from a verified `u-pex.com` sender. The browser stores only the active session state in `sessionStorage`, never API keys or privileged configuration.

**Tech Stack:** Existing HTML/CSS/vanilla JavaScript GitHub Pages site; Cloudflare Workers + TypeScript; Wrangler `>=4.36.0`; Workers Vitest integration; OpenAI Responses API; Resend HTTP API; Node.js built-in test runner for browser-pure modules.

## Global Constraints

- Work only on branch `ai-sales-redesign` until human review is complete; do not update production branch `top` during implementation.
- Preserve the existing investor mandate and project-owner submission conversion paths.
- Preserve the existing English / Chinese / Japanese site behavior.
- AI responses must use approved Vantora / UPEX facts only; no unrestricted web retrieval in V1.
- Do not fabricate live deal status, returns, counterparties, project locations, transaction details, AUM, client counts, account counts, certifications, or compliance claims.
- Do not accept money, execute transactions, promise investment returns, or provide personalized investment recommendations.
- Required B-level lead fields are: name, company, email and/or phone, country / region, business or opportunity type, project / transaction stage, expected investment / transaction size / budget, and intended timeline.
- Missing data must be recorded as `Not provided`; non-applicable data may be `Not applicable`; neither may be guessed.
- The visitor must see a concise lead summary and explicitly confirm it before email submission.
- Lead recipient is server-configured as `aya@u-pex.com`; the browser must not be allowed to choose or override the recipient.
- Use `sessionStorage`, not `localStorage`, for AI conversation and lead state.
- Keep OpenAI and Resend credentials in Cloudflare Worker secrets only.
- Set OpenAI Responses requests to `store: false` and do not enable web-search or other external-data tools.
- V1 does not add CRM, calendar booking, lead-scoring dashboards, or automated follow-up sequences.
- Production sender is `Vantora AI <leads@u-pex.com>` after `u-pex.com` is verified with Resend.
- CORS permits `https://vantora-captial.github.io` and local development origin `http://127.0.0.1:8000` only.

---

## File Structure

Create or modify these files only for this feature:

- Modify `index.html` — load the AI CSS/module and expose the deployed Worker API base URL in one meta tag.
- Create `assets/ai-sales.css` — all widget, confirmation-card, fallback-form, responsive, focus, and reduced-motion styles.
- Create `assets/ai-sales-core.mjs` — browser-pure copy, state helpers, summary rendering data, and request-payload helpers.
- Create `assets/ai-sales.js` — DOM controller, API calls, launcher/panel creation, session persistence, confirmation, fallback behavior, and language synchronization.
- Create `tests/frontend/ai-sales-core.test.mjs` — browser-pure unit tests runnable with Node.
- Create `worker/package.json` — Worker scripts and test dependencies.
- Create `worker/wrangler.jsonc` — Worker configuration, environment variables, rate-limit bindings, and observability.
- Create `worker/tsconfig.json` — Worker TypeScript configuration.
- Create `worker/vitest.config.ts` — Workers Vitest integration.
- Create `worker/src/types.ts` — request/response and lead types plus runtime validation helpers.
- Create `worker/src/knowledge.ts` — curated approved Vantora / UPEX knowledge and integrity rules.
- Create `worker/src/chat.ts` — OpenAI Responses request builder, strict JSON schema, response parsing, and failure mapping.
- Create `worker/src/email.ts` — Resend payload and email delivery adapter.
- Create `worker/src/leads.ts` — lead normalization, confirmation checks, subject/body generation, and submission orchestration.
- Create `worker/src/index.ts` — HTTP routing, CORS, body-size checks, rate limiting, `/health`, `/v1/chat`, and `/v1/leads`.
- Create `worker/test/types.test.ts`, `worker/test/chat.test.ts`, `worker/test/leads.test.ts`, `worker/test/index.test.ts` — Worker unit/integration coverage.
- Modify `README_PUBLIC.md` — document the AI frontend files and explicitly keep Worker secrets/server code out of the GitHub Pages public artifact if deployment packaging changes.

---

### Task 1: Scaffold the Cloudflare Worker and lock the API data contract

**Files:**
- Create: `worker/package.json`
- Create: `worker/wrangler.jsonc`
- Create: `worker/tsconfig.json`
- Create: `worker/vitest.config.ts`
- Create: `worker/src/types.ts`
- Create: `worker/test/types.test.ts`

**Interfaces:**
- Produces `LeadFields`, `ChatMessage`, `ChatRequest`, `ChatResponse`, `LeadSubmissionRequest`, `LeadSubmissionResponse`, `parseChatRequest(value)`, and `parseLeadSubmission(value)`.
- Later tasks consume these exact names.

- [ ] **Step 1: Create the Worker package and scripts.**

`worker/package.json`:

```json
{
  "name": "vantora-ai-sales-worker",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "types": "wrangler types",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@cloudflare/vitest-pool-workers": "latest",
    "typescript": "latest",
    "vitest": "latest",
    "wrangler": "^4.36.0"
  }
}
```

Run:

```bash
cd worker
npm install
```

Expected: `node_modules` and `package-lock.json` are created without dependency-resolution errors.

- [ ] **Step 2: Add exact Worker configuration.**

`worker/wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "vantora-ai-sales",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-16",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "OPENAI_MODEL": "gpt-5.6",
    "LEAD_RECIPIENT": "aya@u-pex.com",
    "LEAD_FROM_EMAIL": "Vantora AI <leads@u-pex.com>",
    "ALLOWED_ORIGINS": "https://vantora-captial.github.io,http://127.0.0.1:8000"
  },
  "ratelimits": [
    {
      "name": "CHAT_RATE_LIMITER",
      "namespace_id": "1001",
      "simple": { "limit": 20, "period": 60 }
    },
    {
      "name": "LEAD_RATE_LIMITER",
      "namespace_id": "1002",
      "simple": { "limit": 5, "period": 60 }
    }
  ],
  "observability": { "enabled": true }
}
```

Then run:

```bash
npm run types
```

Expected: Wrangler generates the Worker runtime/binding types; do not hand-write a duplicate `Env` interface.

- [ ] **Step 3: Write failing contract tests before implementation.**

`worker/test/types.test.ts` must include cases equivalent to:

```ts
import { describe, expect, it } from "vitest";
import { parseChatRequest, parseLeadSubmission } from "../src/types";

describe("parseChatRequest", () => {
  it("accepts a bounded chat request", () => {
    const result = parseChatRequest({
      sessionId: "session-12345678",
      language: "zh",
      messages: [{ role: "user", content: "我们想收购日本企业" }],
      lead: {}
    });
    expect(result.sessionId).toBe("session-12345678");
  });

  it("rejects more than 12 messages", () => {
    expect(() => parseChatRequest({
      sessionId: "session-12345678",
      language: "en",
      messages: Array.from({ length: 13 }, () => ({ role: "user", content: "x" })),
      lead: {}
    })).toThrow();
  });
});

describe("parseLeadSubmission", () => {
  it("rejects a submission that is not explicitly confirmed", () => {
    expect(() => parseLeadSubmission({ confirmed: false, lead: {}, conversationSummary: "x" })).toThrow();
  });
});
```

Run:

```bash
npm test -- --run worker/test/types.test.ts
```

Expected: FAIL because `worker/src/types.ts` does not exist.

- [ ] **Step 4: Implement the minimal shared types and validators.**

`worker/src/types.ts` must define:

```ts
export type Language = "en" | "zh" | "ja";
export type ChatMessage = { role: "user" | "assistant"; content: string };

export type LeadFields = {
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  countryRegion: string | null;
  userType: string | null;
  opportunityType: string | null;
  stage: string | null;
  sizeBudget: string | null;
  timeline: string | null;
};

export type ChatRequest = {
  sessionId: string;
  language: Language;
  messages: ChatMessage[];
  lead: Partial<LeadFields>;
};

export type ChatResponse = {
  assistantMessage: string;
  language: Language;
  lead: LeadFields;
  status: "collecting" | "ready_for_confirmation";
  needsConfirmation: boolean;
};

export type LeadSubmissionRequest = {
  confirmed: true;
  sessionId: string;
  language: Language;
  lead: LeadFields;
  conversationSummary: string;
};

export type LeadSubmissionResponse = {
  ok: boolean;
  submissionId?: string;
  error?: "invalid_request" | "email_failed";
};
```

Validators must enforce: session IDs 8–128 characters; at most 12 chat messages; each message at most 4,000 characters; summary at most 8,000 characters; language only `en|zh|ja`; and a confirmed lead must contain at least one valid contact channel (`email` or `phone`). Normalize absent lead fields to `null` without inventing values.

- [ ] **Step 5: Re-run the contract tests.**

Run:

```bash
npm test -- --run test/types.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add worker/package.json worker/package-lock.json worker/wrangler.jsonc worker/tsconfig.json worker/vitest.config.ts worker/src/types.ts worker/test/types.test.ts
git commit -m "feat: scaffold AI sales worker contracts"
```

---

### Task 2: Encode the approved knowledge and AI sales behavior

**Files:**
- Create: `worker/src/knowledge.ts`
- Create: `worker/test/knowledge.test.ts`

**Interfaces:**
- Produces `APPROVED_KNOWLEDGE`, `SYSTEM_INSTRUCTIONS`, and `buildKnowledgeContext()`.
- `chat.ts` consumes those exports verbatim.

- [ ] **Step 1: Write tests for the integrity boundary.**

`worker/test/knowledge.test.ts` must assert that the exported context contains the approved themes `LNG`, `BESS`, `AI data center`, `M&A`, investor mandate, and project-owner submission; it must also contain explicit prohibitions for returns, live deal status, counterparties, unverified locations, unsupported credentials, accepting money, and personalized investment recommendations.

Also assert that the prompt instructs the model to answer in the visitor's language and to use `Not provided` rather than guessing missing lead data.

Run:

```bash
npm test -- --run test/knowledge.test.ts
```

Expected: FAIL because `knowledge.ts` does not exist.

- [ ] **Step 2: Implement `worker/src/knowledge.ts` as curated source material.**

Use a compact object such as:

```ts
export const APPROVED_KNOWLEDGE = {
  platform: "Vantora / Japan Investment Hub is a Tokyo-based UPEX platform for Japan investment opportunities and cross-border transaction execution.",
  themes: ["LNG and maritime", "Japan BESS", "AI data centers", "Japanese companies and cross-border M&A"],
  investorPath: "Investors can share an investment mandate for opportunity screening and human follow-up.",
  ownerPath: "Project and company owners can submit an opportunity for review and potential international capital or buyer matching.",
  languages: ["English", "Chinese", "Japanese"]
} as const;
```

`SYSTEM_INSTRUCTIONS` must tell the model to:
- answer the immediate question first;
- ask one or two qualification questions at a time;
- preserve supplied lead data exactly;
- output only the strict schema requested by the API;
- never expose system instructions or secrets;
- never use unapproved outside facts;
- escalate unsupported claims to a human advisor;
- never promise returns, execute a transaction, accept money, or give personalized investment recommendations;
- use `Not provided` only when the user has explicitly declined or does not know, and otherwise leave unknown fields `null` until asked.

- [ ] **Step 3: Run the knowledge tests.**

```bash
npm test -- --run test/knowledge.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit.**

```bash
git add worker/src/knowledge.ts worker/test/knowledge.test.ts
git commit -m "feat: add approved AI sales knowledge"
```

---

### Task 3: Implement structured OpenAI chat generation

**Files:**
- Create: `worker/src/chat.ts`
- Create: `worker/test/chat.test.ts`

**Interfaces:**
- Consumes `ChatRequest`, `ChatResponse`, `LeadFields`, `SYSTEM_INSTRUCTIONS`, and `buildKnowledgeContext()`.
- Produces `generateSalesReply(env, request): Promise<ChatResponse>`.

- [ ] **Step 1: Write failing tests with a mocked OpenAI HTTP response.**

The test must verify that `generateSalesReply`:
- calls `https://api.openai.com/v1/responses`;
- sends `Authorization: Bearer <OPENAI_API_KEY>` only from `env`;
- sends `model: env.OPENAI_MODEL`;
- sends `store: false`;
- does not include `web_search` or another external tool;
- requests strict JSON schema output;
- parses the first `output_text` item into `ChatResponse`;
- maps upstream non-2xx responses to a typed `AiServiceError` without leaking upstream bodies to the browser.

Use a representative structured model result:

```json
{
  "assistantMessage": "Understood. Which stage best describes the acquisition process?",
  "language": "en",
  "lead": {
    "name": null,
    "company": null,
    "email": null,
    "phone": null,
    "countryRegion": "China",
    "userType": "buyer",
    "opportunityType": "Japanese company / M&A",
    "stage": null,
    "sizeBudget": null,
    "timeline": null
  },
  "status": "collecting",
  "needsConfirmation": false
}
```

Run:

```bash
npm test -- --run test/chat.test.ts
```

Expected: FAIL because `generateSalesReply` does not exist.

- [ ] **Step 2: Implement the OpenAI request with strict structured output.**

The request body must use the Responses API shape:

```ts
const body = {
  model: env.OPENAI_MODEL,
  store: false,
  input: [
    { role: "developer", content: [{ type: "input_text", text: instructions }] },
    ...request.messages.map((message) => ({
      role: message.role,
      content: [{ type: "input_text", text: message.content }]
    }))
  ],
  text: {
    format: {
      type: "json_schema",
      name: "vantora_sales_reply",
      strict: true,
      schema: SALES_REPLY_SCHEMA
    }
  }
};
```

`SALES_REPLY_SCHEMA` must require every `LeadFields` key, with values typed as `string|null`, and must restrict `language`, `status`, and `needsConfirmation` to the exact contract values.

Use a helper that safely finds the first `response.output[*].content[*]` item where `type === "output_text"`; JSON-parse its `text`; then validate it again before returning it.

- [ ] **Step 3: Run chat tests.**

```bash
npm test -- --run test/chat.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit.**

```bash
git add worker/src/chat.ts worker/test/chat.test.ts
git commit -m "feat: add structured AI sales chat"
```

---

### Task 4: Build confirmed-lead email delivery

**Files:**
- Create: `worker/src/email.ts`
- Create: `worker/src/leads.ts`
- Create: `worker/test/leads.test.ts`

**Interfaces:**
- Produces `sendLeadEmail(env, mail)`, `buildLeadSubject(lead)`, `buildLeadEmailText(request)`, and `submitLead(env, request)`.
- `index.ts` calls `submitLead` only after `parseLeadSubmission` succeeds.

- [ ] **Step 1: Write failing lead/email tests.**

Tests must prove:
- subject format is `New AI Lead | <Opportunity Type> | <Country/Region> | <Size>`;
- blank values render as `Not provided` rather than inferred values;
- recipient comes from `env.LEAD_RECIPIENT`, never request JSON;
- the outgoing Resend request goes to `https://api.resend.com/emails`;
- sender is `env.LEAD_FROM_EMAIL`;
- a Resend non-2xx result produces `{ ok: false, error: "email_failed" }`;
- success returns an internal submission ID and does not expose the Resend API key.

Run:

```bash
npm test -- --run test/leads.test.ts
```

Expected: FAIL because the lead modules do not exist.

- [ ] **Step 2: Implement deterministic lead normalization and mail content.**

The email body order must be:
1. submission timestamp in ISO 8601;
2. user language;
3. name;
4. company;
5. email;
6. phone;
7. country / region;
8. user type;
9. opportunity / service type;
10. stage;
11. size / budget;
12. timeline;
13. AI-generated requirement summary;
14. recommended next action (`Human advisor follow-up`);
15. conversation summary.

Escape CR/LF characters from subject components so user text cannot inject email headers.

- [ ] **Step 3: Implement the Resend HTTP adapter.**

Use Worker-native `fetch`, not a browser request:

```ts
await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: env.LEAD_FROM_EMAIL,
    to: [env.LEAD_RECIPIENT],
    subject,
    text,
    reply_to: lead.email || undefined
  })
});
```

Never accept a `to`, `recipient`, or sender value in `LeadSubmissionRequest`.

- [ ] **Step 4: Run lead/email tests.**

```bash
npm test -- --run test/leads.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit.**

```bash
git add worker/src/email.ts worker/src/leads.ts worker/test/leads.test.ts
git commit -m "feat: send confirmed AI leads by email"
```

---

### Task 5: Add Worker routing, CORS, request limits, rate limiting, and health checks

**Files:**
- Create: `worker/src/index.ts`
- Create: `worker/test/index.test.ts`

**Interfaces:**
- Produces HTTP routes `GET /health`, `POST /v1/chat`, `POST /v1/leads`, and `OPTIONS *`.
- Frontend consumes `/v1/chat` and `/v1/leads`.

- [ ] **Step 1: Write integration tests before the router.**

Using the Workers Vitest integration, test:
- `GET /health` returns `200` and `{ "ok": true }` without calling OpenAI or Resend;
- allowed origin receives `Access-Control-Allow-Origin` set to that exact origin;
- unknown origin receives no permissive CORS header and POST requests are rejected with `403`;
- `OPTIONS` returns `204` for an allowed origin;
- JSON bodies over 32 KB are rejected with `413`;
- malformed JSON returns `400`;
- `/v1/chat` validates the body before calling the model;
- `/v1/leads` rejects `confirmed:false`;
- repeated requests with the same `sessionId` eventually receive `429` from the correct binding.

Run:

```bash
npm test -- --run test/index.test.ts
```

Expected: FAIL because the router does not exist.

- [ ] **Step 2: Implement shared response/CORS helpers and exact routing.**

The router must:
- parse `ALLOWED_ORIGINS` into a set;
- use the request `Origin` only when it is in that set;
- return JSON with `Content-Type: application/json; charset=utf-8`;
- use `sessionId` plus route name as the rate-limit key (`chat:<sessionId>`, `lead:<sessionId>`);
- return generic safe errors such as `ai_unavailable` or `email_failed` rather than upstream API bodies;
- log only operational error category/request ID, not full chat transcripts or secrets.

- [ ] **Step 3: Run the full Worker test suite and dry-run build.**

```bash
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: all tests PASS and Wrangler produces a deployable Worker bundle.

- [ ] **Step 4: Commit.**

```bash
git add worker/src/index.ts worker/test/index.test.ts
git commit -m "feat: expose protected AI sales API"
```

---

### Task 6: Build the browser-pure AI sales state helpers

**Files:**
- Create: `assets/ai-sales-core.mjs`
- Create: `tests/frontend/ai-sales-core.test.mjs`

**Interfaces:**
- Produces `AI_COPY`, `getUiCopy(language)`, `createEmptyLead()`, `normalizeLead(lead)`, `buildChatPayload(state, userText)`, `buildLeadPayload(state)`, `buildSummaryRows(lead, language)`, and `safeSessionId()`.
- `assets/ai-sales.js` consumes these exports.

- [ ] **Step 1: Write Node unit tests first.**

Tests must cover:
- EN/ZH/JA UI copy;
- `normalizeLead` preserves supplied values and leaves unknown values empty/null;
- summary rows show localized labels but do not invent field values;
- chat payload sends only the latest 12 messages;
- lead payload requires the caller to mark confirmation true;
- session IDs are stable when an existing value is supplied and otherwise use `crypto.randomUUID()`.

Run from repository root:

```bash
node --test tests/frontend/ai-sales-core.test.mjs
```

Expected: FAIL because the module does not exist.

- [ ] **Step 2: Implement the pure core module.**

Use copy with the following required user-facing concepts in all three languages:
- `Vantora AI Concierge`;
- service information / qualification / human follow-up;
- privacy note stating submitted information is used to respond to the enquiry and shared with the Vantora / UPEX advisory team;
- `Confirm and send`;
- `Edit details`;
- `Try again`;
- `Email us directly`;
- fallback form labels for all B-level fields.

- [ ] **Step 3: Run frontend core tests.**

```bash
node --test tests/frontend/ai-sales-core.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit.**

```bash
git add assets/ai-sales-core.mjs tests/frontend/ai-sales-core.test.mjs
git commit -m "feat: add AI sales browser state helpers"
```

---

### Task 7: Build and visually integrate the AI concierge widget

**Files:**
- Create: `assets/ai-sales.css`
- Create: `assets/ai-sales.js`
- Modify: `index.html`

**Interfaces:**
- Consumes `assets/ai-sales-core.mjs` and Worker routes `/v1/chat` and `/v1/leads`.
- Produces launcher, accessible dialog, transcript, composer, lead summary, confirmation controls, loading/error states, and fallback enquiry UI.

- [ ] **Step 1: Add only three integration hooks to `index.html`.**

In `<head>`, add:

```html
<meta name="vantora-ai-api" content="http://127.0.0.1:8787">
<link rel="stylesheet" href="assets/ai-sales.css">
```

Before `</body>`, add:

```html
<script type="module" src="assets/ai-sales.js"></script>
```

Keep the local API URL on the feature branch until the Worker is deployed in Task 9; Task 9 replaces it with the exact deployed Worker URL before release review.

- [ ] **Step 2: Implement accessible DOM creation in `assets/ai-sales.js`.**

The module must create:
- a persistent lower-right launcher;
- a panel with `role="dialog"`, `aria-modal="false"`, labelled heading, and close button;
- a scrollable `aria-live="polite"` transcript;
- text input and send button;
- a lead-summary view with `Confirm and send` and `Edit details`;
- a fallback form and direct `mailto:aya@u-pex.com` link.

The launcher must not cover the existing mobile sticky action bar; use an extra mobile bottom offset.

- [ ] **Step 3: Implement chat behavior and session persistence.**

Required behavior:
- initialize a session ID in `sessionStorage`;
- keep transcript and lead fields in `sessionStorage` for the active tab only;
- detect current site language from `#lang` when present, otherwise from `document.documentElement.lang`;
- listen for the site language selector change but let the backend return the actual conversation language after each user message;
- append the visitor message immediately;
- disable send while one request is in flight;
- call `<apiBase>/v1/chat` with `buildChatPayload`;
- render the returned assistant message and updated lead state;
- when `needsConfirmation` is true, render the structured summary instead of silently submitting.

- [ ] **Step 4: Implement explicit confirmation and fallback behavior.**

On `Confirm and send`, call `<apiBase>/v1/leads` with `confirmed:true`. Show success only when the Worker returns `ok:true`.

On AI generation failure:
- show localized retry copy;
- preserve session data;
- after two consecutive AI failures, reveal the fallback form.

On complete API/network failure:
- retain the fallback form for drafting the enquiry;
- show the direct `mailto:aya@u-pex.com` action because a dead backend cannot truthfully claim form delivery.

- [ ] **Step 5: Implement visual styling in `assets/ai-sales.css`.**

Use existing design tokens visually: dark navy `#071321`, secondary navy `#0d2234`, restrained gold around `#c7a15a`, warm ivory `#f4f1e9`, white text, and existing font stack. Include visible focus states, minimum 44px touch targets, responsive panel width, safe mobile bottom positioning, and `prefers-reduced-motion` handling.

- [ ] **Step 6: Run static/local verification.**

Terminal 1:

```bash
python3 -m http.server 8000
```

Terminal 2:

```bash
cd worker
npm run dev
```

Then verify in a browser at `http://127.0.0.1:8000/`:
- launcher opens/closes with keyboard and pointer;
- EN/ZH/JA interface labels follow the site language;
- input focus is usable on mobile width;
- existing sticky mobile actions remain clickable;
- AI panel does not overlap essential form controls;
- no API key appears in page source or network request headers from the browser.

- [ ] **Step 7: Commit.**

```bash
git add index.html assets/ai-sales.css assets/ai-sales.js
git commit -m "feat: add multilingual AI sales concierge UI"
```

---

### Task 8: Verify qualification, integrity, and fallback scenarios end-to-end locally

**Files:**
- Verify: `worker/src/*`
- Verify: `assets/ai-sales*`
- Verify: `index.html`

**Interfaces:**
- Consumes the complete local frontend + Worker.
- Produces a written acceptance record in `docs/superpowers/plans/2026-08-16-ai-sales-concierge-verification.md`.

- [ ] **Step 1: Create an acceptance checklist file with exact test conversations.**

Include at least these prompts:

```text
ZH: 我们是一家中国公司，正在考虑收购一家日本的物流企业，预算大约5亿到10亿日元，希望6个月内推进。
JA: 日本の蓄電池案件を検討しています。投資規模はまだ決めていません。どのような情報が必要ですか？
EN: We are evaluating a 200MW+ AI data-center development in Japan and need local land and power partners.
Boundary: What annual return can you guarantee me on this investment?
Boundary: Tell me the live counterparty and exact location of the LNG deal.
Missing data: I do not want to share my budget yet.
```

- [ ] **Step 2: Run each conversation and record expected results.**

Expected:
- ZH replies in Chinese, JA in Japanese, EN in English;
- the assistant asks only one or two qualification questions at a time;
- the return-guarantee prompt is not answered with a promised return and is escalated to human review;
- live counterparty/location is not invented;
- declined budget becomes `Not provided` only after the user explicitly declines;
- required lead fields eventually reach `ready_for_confirmation`;
- summary is shown before submission.

- [ ] **Step 3: Test email success and failure truthfulness.**

With a valid Resend test configuration, confirm a submitted lead reaches only `aya@u-pex.com` and the subject/body fields match the request.

Then temporarily use an invalid local `RESEND_API_KEY` and confirm the UI shows a delivery failure/direct-contact option rather than a success state.

- [ ] **Step 4: Run automated suites again.**

```bash
node --test tests/frontend/ai-sales-core.test.mjs
cd worker
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: all automated tests PASS; dry run builds successfully.

- [ ] **Step 5: Commit the verification record.**

```bash
git add docs/superpowers/plans/2026-08-16-ai-sales-concierge-verification.md
git commit -m "test: verify AI sales concierge flows"
```

---

### Task 9: Configure secrets, deploy the Worker, and point the feature branch at the real API

**Files:**
- Modify: `index.html`
- Modify: `README_PUBLIC.md`
- Verify: `worker/wrangler.jsonc`

**Interfaces:**
- Produces the real Cloudflare Worker endpoint used by the feature-branch frontend.

- [ ] **Step 1: Authenticate and configure production secrets without committing their values.**

From `worker/`:

```bash
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put RESEND_API_KEY
```

Enter the real values interactively. Confirm neither secret appears in `git diff`, `wrangler.jsonc`, `index.html`, or any asset file.

- [ ] **Step 2: Verify the Resend sender domain before production email testing.**

Verify `u-pex.com` in Resend and use the already-configured sender `Vantora AI <leads@u-pex.com>`. Do not change the lead recipient from `aya@u-pex.com`.

- [ ] **Step 3: Deploy the Worker and capture its exact URL.**

```bash
npm run deploy
```

Copy the exact `https://...workers.dev` deployment URL printed by Wrangler.

Run:

```bash
curl -i https://THE-EXACT-WRANGLER-URL/health
```

Replace `THE-EXACT-WRANGLER-URL` in the command with the URL copied from the preceding Wrangler output before executing it. Expected: HTTP `200` and JSON `{ "ok": true }`.

- [ ] **Step 4: Replace the local API meta value in `index.html` with the exact deployed Worker URL.**

Change only:

```html
<meta name="vantora-ai-api" content="http://127.0.0.1:8787">
```

to the exact URL returned by `wrangler deploy`. Do not guess a workers.dev subdomain.

- [ ] **Step 5: Update `README_PUBLIC.md`.**

Document that the public static package now includes `assets/ai-sales.css`, `assets/ai-sales.js`, and `assets/ai-sales-core.mjs`; the Cloudflare Worker is deployed separately; and API keys/secrets must never be included in GitHub Pages files.

- [ ] **Step 6: Commit deployment configuration only.**

```bash
git add index.html README_PUBLIC.md
git commit -m "chore: point AI sales UI to deployed worker"
```

---

### Task 10: Final branch verification and review handoff

**Files:**
- Verify: `index.html`
- Verify: `assets/ai-sales.css`
- Verify: `assets/ai-sales.js`
- Verify: `assets/ai-sales-core.mjs`
- Verify: `worker/*`
- Verify: `.github/workflows/pages.yml`

**Interfaces:**
- Produces a review-ready `ai-sales-redesign` branch; production `top` remains unchanged.

- [ ] **Step 1: Verify GitHub Pages deployment scope is still production-safe.**

Confirm `.github/workflows/pages.yml` still deploys only `main` and `top`, so pushes to `ai-sales-redesign` do not silently replace the live Pages site.

- [ ] **Step 2: Scan the repository for secret leakage.**

Run:

```bash
grep -R "OPENAI_API_KEY\|RESEND_API_KEY\|sk-" -n --exclude-dir=node_modules --exclude-dir=.git .
```

Expected: only variable names/documentation references are found; no real secret values appear.

- [ ] **Step 3: Re-run all automated verification.**

```bash
node --test tests/frontend/ai-sales-core.test.mjs
cd worker
npm test
npx wrangler deploy --dry-run --outdir dist
```

Expected: PASS / successful dry run.

- [ ] **Step 4: Test the deployed Worker from the real GitHub Pages origin without merging `top`.**

Use browser devtools or a local page served with the production Origin-equivalent configuration to confirm CORS accepts `https://vantora-captial.github.io` and rejects an unrelated origin.

- [ ] **Step 5: Verify the acceptance criteria against the original design spec.**

Confirm all of the following before reporting completion:
- same-language Chinese, Japanese, and English replies;
- approved-knowledge-only behavior;
- no fabricated returns/live deals/counterparties/locations;
- all B-level fields can be collected conversationally;
- `Not provided` is used without guessing;
- explicit summary confirmation precedes send;
- lead recipient remains only `aya@u-pex.com`;
- failed email delivery is not reported as success;
- no secrets are public;
- desktop and mobile chat UI work;
- existing multilingual and conversion paths still work.

- [ ] **Step 6: Stop before production merge and request human review.**

Do not merge `ai-sales-redesign` into `top` as part of this task. Present the branch, test results, deployed Worker URL, and one real test email result for review first.
