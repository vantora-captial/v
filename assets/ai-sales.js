import {
  getUiCopy,
  createEmptyLead,
  normalizeLead,
  buildChatPayload,
  buildLeadPayload,
  buildSummaryRows,
  safeSessionId
} from "./ai-sales-core.mjs";

const STORAGE_KEY = "vantoraAiSalesStateV1";
const EMAIL_RECIPIENT = "aya@u-pex.com";
const MAX_STORED_MESSAGES = 40;
const apiBase = (document.querySelector('meta[name="vantora-ai-api"]')?.content || "").replace(/\/$/, "");

const QUICK_PROMPTS = {
  en: ["I want to discuss Japan M&A", "I am evaluating BESS investment in Japan", "I have an AI data-center opportunity"],
  zh: ["我想咨询日本企业并购", "我正在评估日本 BESS 储能投资", "我有一个 AI 数据中心项目"],
  ja: ["日本企業のM&Aについて相談したい", "日本のBESS投資を検討している", "AIデータセンター案件について相談したい"]
};

const BANNER_COPY = {
  en: "Not sure which path fits your enquiry? Let the AI Concierge clarify your needs first.",
  zh: "不确定应该选择哪条咨询路径？可以先让 AI 顾问帮您梳理需求。",
  ja: "どの窓口が適切か迷う場合は、まずAIコンシェルジュがご要望を整理します。"
};

function normalizeLanguage(value) {
  if (value === "zh" || String(value).toLowerCase().startsWith("zh")) return "zh";
  if (value === "ja" || String(value).toLowerCase().startsWith("ja")) return "ja";
  return "en";
}

function currentSiteLanguage() {
  const selector = document.querySelector("#lang");
  return normalizeLanguage(selector?.value || document.documentElement.lang || "en");
}

function cleanMessages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .slice(-MAX_STORED_MESSAGES)
    .map(({ role, content }) => ({ role, content: content.slice(0, 4000) }));
}

function loadState() {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  return {
    sessionId: safeSessionId(stored.sessionId),
    language: currentSiteLanguage(),
    messages: cleanMessages(stored.messages),
    lead: normalizeLead(stored.lead || createEmptyLead()),
    confirmed: false,
    conversationSummary: typeof stored.conversationSummary === "string" ? stored.conversationSummary.slice(0, 8000) : ""
  };
}

const state = loadState();
let consecutiveFailures = 0;
let lastTrigger = null;

function persistState() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
    sessionId: state.sessionId,
    language: state.language,
    messages: state.messages.slice(-MAX_STORED_MESSAGES),
    lead: state.lead,
    conversationSummary: state.conversationSummary
  }));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildUi() {
  if (document.querySelector(".ai-sales-root")) return document.querySelector(".ai-sales-root");
  const copy = getUiCopy(state.language);
  const root = el("div", "ai-sales-root");

  const launcher = el("button", "ai-sales-launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "vantora-ai-sales-panel");
  launcher.append(el("span", "ai-sales-orb"), el("span", "ai-sales-launcher-label", copy.launcher));

  const panel = el("section", "ai-sales-panel");
  panel.id = "vantora-ai-sales-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "vantora-ai-sales-title");

  const head = el("header", "ai-sales-head");
  const headText = el("div");
  const kicker = el("div", "ai-sales-kicker");
  kicker.append(el("span", "ai-sales-orb"), document.createTextNode("AI SALES · HUMAN HANDOFF"));
  const title = el("h2", "", copy.title);
  title.id = "vantora-ai-sales-title";
  const sub = el("p", "ai-sales-head-sub", "EN · 中文 · 日本語");
  headText.append(kicker, title, sub);
  const close = el("button", "ai-sales-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", copy.close);
  head.append(headText, close);

  const body = el("div", "ai-sales-body");
  const intro = el("div", "ai-sales-intro");
  intro.append(el("strong", "", "VANTORA / UPEX"), el("span", "ai-sales-intro-copy", copy.intro));
  const quick = el("div", "ai-sales-quick");
  const transcript = el("div", "ai-sales-transcript");
  transcript.setAttribute("aria-live", "polite");
  transcript.setAttribute("aria-relevant", "additions text");
  const status = el("div", "ai-sales-status");
  status.setAttribute("role", "status");

  const summary = el("section", "ai-sales-summary");
  summary.hidden = true;
  summary.append(el("h3", "ai-sales-summary-title", "Enquiry summary"));
  const summaryList = el("dl", "ai-sales-summary-list");
  const summaryActions = el("div", "ai-sales-summary-actions");
  const confirm = el("button", "ai-sales-action primary ai-sales-confirm", copy.confirm);
  confirm.type = "button";
  const edit = el("button", "ai-sales-action ai-sales-edit", copy.edit);
  edit.type = "button";
  summaryActions.append(confirm, edit);
  summary.append(summaryList, summaryActions);

  const result = el("div", "ai-sales-result");
  result.hidden = true;
  result.setAttribute("role", "status");

  const fallback = el("section", "ai-sales-fallback");
  fallback.hidden = true;
  fallback.append(el("h3", "ai-sales-fallback-title", copy.fallbackTitle), el("p", "ai-sales-fallback-intro", copy.fallbackIntro));
  const fallbackGrid = el("div", "ai-sales-fallback-grid");
  for (const key of Object.keys(copy.fallbackLabels)) {
    const label = el("label", key === "opportunityType" || key === "stage" ? "wide" : "");
    const labelText = el("span", `ai-sales-fallback-label-${key}`, copy.fallbackLabels[key]);
    const input = el("input");
    input.name = key;
    input.autocomplete = key === "email" ? "email" : key === "phone" ? "tel" : "off";
    input.value = state.lead[key] && state.lead[key] !== "Not provided" ? state.lead[key] : "";
    label.append(labelText, input);
    fallbackGrid.append(label);
  }
  const directEmail = el("a", "ai-sales-direct", copy.emailDirect);
  directEmail.href = buildMailto();
  fallback.append(fallbackGrid, directEmail);

  body.append(intro, quick, transcript, status, summary, result, fallback);

  const compose = el("footer", "ai-sales-compose");
  const form = el("form", "ai-sales-form");
  const input = el("input", "ai-sales-input");
  input.type = "text";
  input.maxLength = 4000;
  input.placeholder = copy.placeholder;
  input.setAttribute("aria-label", copy.placeholder);
  const send = el("button", "ai-sales-send", copy.send);
  send.type = "submit";
  form.append(input, send);
  const privacy = el("p", "ai-sales-privacy", copy.privacy);
  compose.append(form, privacy);
  panel.append(head, body, compose);
  root.append(launcher, panel);
  document.body.append(root);

  root._refs = { launcher, panel, close, title, intro, quick, transcript, status, summary, summaryList, confirm, edit, result, fallback, fallbackGrid, directEmail, input, send, privacy };
  return root;
}

const root = buildUi();
const refs = root._refs;

function renderQuickPrompts() {
  refs.quick.replaceChildren();
  for (const prompt of QUICK_PROMPTS[state.language] || QUICK_PROMPTS.en) {
    const button = el("button", "", prompt);
    button.type = "button";
    button.addEventListener("click", () => sendMessage(prompt));
    refs.quick.append(button);
  }
}

function renderTranscript() {
  refs.transcript.replaceChildren();
  for (const message of state.messages) appendMessageNode(message);
}

function appendMessageNode(message) {
  const node = el("div", `ai-sales-message ${message.role}`, message.content);
  refs.transcript.append(node);
  requestAnimationFrame(() => { refs.transcript.parentElement.scrollTop = refs.transcript.parentElement.scrollHeight; });
}

function showStatus(text) {
  refs.status.textContent = text || "";
  refs.status.classList.toggle("visible", Boolean(text));
}

function showResult(kind, text) {
  refs.result.hidden = false;
  refs.result.className = `ai-sales-result ${kind}`;
  refs.result.textContent = text;
}

function hideResult() {
  refs.result.hidden = true;
  refs.result.textContent = "";
  refs.result.className = "ai-sales-result";
}

function renderSummary() {
  const copy = getUiCopy(state.language);
  refs.summaryList.replaceChildren();
  for (const row of buildSummaryRows(state.lead, state.language)) {
    refs.summaryList.append(el("dt", "", row.label), el("dd", "", row.value));
  }
  refs.confirm.textContent = copy.confirm;
  refs.edit.textContent = copy.edit;
  refs.summary.hidden = false;
}

function hideSummary() {
  refs.summary.hidden = true;
  state.confirmed = false;
}

function buildConversationSummary() {
  return state.messages
    .slice(-12)
    .map((message) => `${message.role === "user" ? "Visitor" : "AI"}: ${message.content}`)
    .join("\n")
    .slice(0, 7900) || "Not provided";
}

function buildMailto() {
  const copy = getUiCopy(state.language);
  const fields = Object.entries(state.lead)
    .filter(([, value]) => typeof value === "string" && value && value !== "Not provided")
    .map(([key, value]) => `${copy.fallbackLabels[key] || key}: ${value}`);
  const subject = "Vantora website enquiry";
  const body = fields.length ? fields.join("\n") : copy.fallbackIntro;
  return `mailto:${EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function showFallback() {
  const copy = getUiCopy(state.language);
  refs.fallback.hidden = false;
  for (const input of refs.fallbackGrid.querySelectorAll("input")) {
    const value = state.lead[input.name];
    if (!input.value && typeof value === "string" && value !== "Not provided") input.value = value;
  }
  refs.directEmail.textContent = copy.emailDirect;
  refs.directEmail.href = buildMailto();
}

function openPanel(trigger = refs.launcher) {
  lastTrigger = trigger;
  refs.panel.hidden = false;
  refs.launcher.setAttribute("aria-expanded", "true");
  refs.close.focus();
}

function closePanel() {
  refs.panel.hidden = true;
  refs.launcher.setAttribute("aria-expanded", "false");
  (lastTrigger || refs.launcher).focus?.();
}

async function fetchJson(path, payload) {
  if (!apiBase) throw new Error("AI API is not configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${apiBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function sendMessage(textOverride) {
  const text = typeof textOverride === "string" ? textOverride : refs.input.value;
  if (!text || !text.trim() || refs.send.disabled) return;
  const copy = getUiCopy(state.language);
  hideResult();
  hideSummary();

  let payload;
  try { payload = buildChatPayload(state, text); } catch { return; }
  const visitorMessage = payload.messages.at(-1);
  state.messages.push(visitorMessage);
  state.messages = state.messages.slice(-MAX_STORED_MESSAGES);
  appendMessageNode(visitorMessage);
  refs.input.value = "";
  refs.send.disabled = true;
  refs.send.textContent = copy.sending;
  showStatus(copy.sending);
  persistState();

  try {
    const response = await fetchJson("/v1/chat", payload);
    consecutiveFailures = 0;
    state.language = normalizeLanguage(response.language || state.language);
    state.lead = normalizeLead(response.lead);
    const assistantMessage = { role: "assistant", content: String(response.assistantMessage || "") };
    if (!assistantMessage.content) throw new Error("Empty AI response");
    state.messages.push(assistantMessage);
    state.messages = state.messages.slice(-MAX_STORED_MESSAGES);
    appendMessageNode(assistantMessage);
    state.conversationSummary = buildConversationSummary();
    persistState();
    applyCopy();
    if (response.needsConfirmation) renderSummary();
  } catch {
    consecutiveFailures += 1;
    const activeCopy = getUiCopy(state.language);
    showResult("error", activeCopy.failure);
    if (consecutiveFailures >= 2) showFallback();
  } finally {
    const activeCopy = getUiCopy(state.language);
    refs.send.disabled = false;
    refs.send.textContent = activeCopy.send;
    showStatus("");
  }
}

async function confirmLead() {
  const copy = getUiCopy(state.language);
  refs.confirm.disabled = true;
  hideResult();
  state.confirmed = true;
  state.conversationSummary = buildConversationSummary();
  try {
    const payload = buildLeadPayload(state);
    const response = await fetchJson("/v1/leads", payload);
    if (!response.ok) throw new Error("Lead delivery failed");
    showResult("success", copy.success);
    refs.summary.hidden = true;
    state.confirmed = false;
    persistState();
  } catch {
    state.confirmed = false;
    showResult("error", copy.failure);
    showFallback();
  } finally {
    refs.confirm.disabled = false;
  }
}

function applyCopy() {
  const copy = getUiCopy(state.language);
  refs.launcher.querySelector(".ai-sales-launcher-label").textContent = copy.launcher;
  refs.title.textContent = copy.title;
  refs.close.setAttribute("aria-label", copy.close);
  refs.intro.querySelector(".ai-sales-intro-copy").textContent = copy.intro;
  refs.input.placeholder = copy.placeholder;
  refs.input.setAttribute("aria-label", copy.placeholder);
  refs.send.textContent = copy.send;
  refs.privacy.textContent = copy.privacy;
  refs.confirm.textContent = copy.confirm;
  refs.edit.textContent = copy.edit;
  refs.fallback.querySelector(".ai-sales-fallback-title").textContent = copy.fallbackTitle;
  refs.fallback.querySelector(".ai-sales-fallback-intro").textContent = copy.fallbackIntro;
  for (const [key, labelText] of Object.entries(copy.fallbackLabels)) {
    const node = refs.fallback.querySelector(`.ai-sales-fallback-label-${key}`);
    if (node) node.textContent = labelText;
  }
  refs.directEmail.textContent = copy.emailDirect;
  refs.directEmail.href = buildMailto();
  renderQuickPrompts();
  document.querySelectorAll("[data-ai-sales-open]").forEach((button) => { button.textContent = copy.launcher; });
  const bannerText = document.querySelector(".ai-sales-inline-banner p");
  if (bannerText) bannerText.textContent = BANNER_COPY[state.language] || BANNER_COPY.en;
}

function injectContextCtas() {
  const copy = getUiCopy(state.language);
  const heroRow = document.querySelector(".hero .row");
  if (heroRow && !heroRow.querySelector("[data-ai-sales-open]")) {
    const button = el("button", "btn ai-sales-inline-cta", copy.launcher);
    button.type = "button";
    button.dataset.aiSalesOpen = "";
    heroRow.append(button);
  }

  const forms = document.querySelector(".forms");
  if (forms && !forms.parentElement.querySelector(".ai-sales-inline-banner")) {
    const banner = el("div", "ai-sales-inline-banner");
    const text = el("p", "", BANNER_COPY[state.language] || BANNER_COPY.en);
    const button = el("button", "btn ai-sales-inline-cta", copy.launcher);
    button.type = "button";
    button.dataset.aiSalesOpen = "";
    banner.append(text, button);
    forms.parentElement.insertBefore(banner, forms);
  }

  document.querySelectorAll("[data-ai-sales-open]").forEach((button) => {
    if (button.dataset.aiSalesBound) return;
    button.dataset.aiSalesBound = "true";
    button.addEventListener("click", () => openPanel(button));
  });
}

refs.launcher.addEventListener("click", () => refs.panel.hidden ? openPanel(refs.launcher) : closePanel());
refs.close.addEventListener("click", closePanel);
refs.input.closest("form").addEventListener("submit", (event) => { event.preventDefault(); sendMessage(); });
refs.confirm.addEventListener("click", confirmLead);
refs.edit.addEventListener("click", () => { hideSummary(); refs.input.focus(); });
refs.fallbackGrid.addEventListener("input", (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  state.lead[event.target.name] = event.target.value.trim() || null;
  state.lead = normalizeLead(state.lead);
  persistState();
  refs.directEmail.href = buildMailto();
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !refs.panel.hidden) closePanel(); });
const languageSelector = document.querySelector("#lang");
languageSelector?.addEventListener("change", () => {
  state.language = currentSiteLanguage();
  persistState();
  applyCopy();
  if (!refs.summary.hidden) renderSummary();
});

injectContextCtas();
renderTranscript();
applyCopy();
persistState();
