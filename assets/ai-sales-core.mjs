export const LEAD_KEYS = [
  "name",
  "company",
  "email",
  "phone",
  "countryRegion",
  "userType",
  "opportunityType",
  "stage",
  "sizeBudget",
  "timeline"
];

export const AI_COPY = {
  en: {
    title: "Vantora AI Concierge",
    launcher: "Ask AI",
    intro: "Ask about Vantora / UPEX services and Japan opportunities. I can also qualify your enquiry for human follow-up.",
    privacy: "Information you submit is used to respond to your enquiry and may be shared with the Vantora / UPEX advisory team.",
    placeholder: "Type your question…",
    send: "Send",
    sending: "Thinking…",
    close: "Close AI Concierge",
    confirm: "Confirm and send",
    edit: "Edit details",
    retry: "Try again",
    emailDirect: "Email us directly",
    success: "Thank you. Your enquiry was sent for human follow-up.",
    failure: "We could not complete delivery. Please try again or email us directly.",
    fallbackTitle: "Send an enquiry directly",
    fallbackIntro: "The AI service is temporarily unavailable. You can prepare your details here and email the advisory team directly.",
    notProvided: "Not provided",
    fallbackLabels: {
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      countryRegion: "Country / region",
      userType: "Your role",
      opportunityType: "Opportunity / service type",
      stage: "Project / transaction stage",
      sizeBudget: "Expected size / budget",
      timeline: "Timeline"
    }
  },
  zh: {
    title: "Vantora AI Concierge",
    launcher: "諮詢 AI",
    intro: "您可以諮詢 Vantora / UPEX 的服務與日本投資機會，我也可以先了解您的需求並轉交人工顧問跟進。",
    privacy: "您提交的資訊將用於回覆本次諮詢，並可能與 Vantora / UPEX 顧問團隊共享，以便後續聯絡。",
    placeholder: "請輸入您的問題…",
    send: "發送",
    sending: "正在思考…",
    close: "關閉 AI 顧問",
    confirm: "確認並發送",
    edit: "修改資訊",
    retry: "重試",
    emailDirect: "直接發送電子郵件",
    success: "謝謝，您的諮詢已提交給人工顧問跟進。",
    failure: "暫時未能完成發送。請重試或直接以電子郵件聯絡我們。",
    fallbackTitle: "直接提交諮詢",
    fallbackIntro: "AI 服務暫時不可用。您可以先整理以下資訊，再直接以電子郵件聯絡顧問團隊。",
    notProvided: "未提供",
    fallbackLabels: {
      name: "姓名",
      company: "公司",
      email: "電子郵件",
      phone: "電話",
      countryRegion: "國家／地區",
      userType: "您的身分",
      opportunityType: "業務／機會類型",
      stage: "項目／交易階段",
      sizeBudget: "預計規模／預算",
      timeline: "時間規劃"
    }
  },
  ja: {
    title: "Vantora AI Concierge",
    launcher: "AIに相談",
    intro: "Vantora / UPEX のサービスや日本の投資機会についてご案内し、必要に応じてお問い合わせ内容を整理して担当者へ引き継ぎます。",
    privacy: "ご入力いただいた情報はお問い合わせへの回答に利用し、フォローアップのため Vantora / UPEX のアドバイザリーチームと共有する場合があります。",
    placeholder: "ご質問を入力してください…",
    send: "送信",
    sending: "確認中…",
    close: "AIコンシェルジュを閉じる",
    confirm: "確認して送信",
    edit: "内容を修正",
    retry: "もう一度試す",
    emailDirect: "メールで直接問い合わせる",
    success: "ありがとうございます。担当者からのフォローアップ用にお問い合わせを送信しました。",
    failure: "送信を完了できませんでした。再試行するか、メールで直接お問い合わせください。",
    fallbackTitle: "直接お問い合わせ",
    fallbackIntro: "AIサービスが一時的に利用できません。以下に内容を整理し、担当チームへメールで直接お問い合わせいただけます。",
    notProvided: "未提供",
    fallbackLabels: {
      name: "お名前",
      company: "会社名",
      email: "メール",
      phone: "電話番号",
      countryRegion: "国／地域",
      userType: "お立場",
      opportunityType: "案件／サービス種別",
      stage: "案件／取引ステージ",
      sizeBudget: "想定規模／予算",
      timeline: "希望時期"
    }
  }
};

export function getUiCopy(language) {
  return AI_COPY[language] || AI_COPY.en;
}

export function createEmptyLead() {
  return Object.fromEntries(LEAD_KEYS.map((key) => [key, null]));
}

export function normalizeLead(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const lead = createEmptyLead();
  for (const key of LEAD_KEYS) {
    const incoming = source[key];
    if (typeof incoming === "string" && incoming.length > 0) lead[key] = incoming;
    else if (incoming === null) lead[key] = null;
  }
  return lead;
}

export function buildChatPayload(state, userText) {
  const content = typeof userText === "string" ? userText.trim() : "";
  if (!content) throw new Error("A message is required");
  const existing = Array.isArray(state.messages) ? state.messages : [];
  const messages = [...existing.slice(-11), { role: "user", content }];
  return {
    sessionId: safeSessionId(state.sessionId),
    language: state.language === "zh" || state.language === "ja" ? state.language : "en",
    messages,
    lead: normalizeLead(state.lead)
  };
}

export function buildLeadPayload(state) {
  if (state.confirmed !== true) throw new Error("Explicit confirmation is required before sending a lead");
  return {
    confirmed: true,
    sessionId: safeSessionId(state.sessionId),
    language: state.language === "zh" || state.language === "ja" ? state.language : "en",
    lead: normalizeLead(state.lead),
    conversationSummary: typeof state.conversationSummary === "string" && state.conversationSummary.trim()
      ? state.conversationSummary.trim()
      : "Not provided"
  };
}

export function buildSummaryRows(leadValue, language) {
  const lead = normalizeLead(leadValue);
  const copy = getUiCopy(language);
  return LEAD_KEYS.map((key) => ({
    key,
    label: copy.fallbackLabels[key],
    value: lead[key] === null ? copy.notProvided : lead[key]
  }));
}

export function safeSessionId(existing) {
  if (typeof existing === "string" && existing.length >= 8 && existing.length <= 128) return existing;
  return crypto.randomUUID();
}
