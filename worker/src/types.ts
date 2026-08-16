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

const LEAD_KEYS = [
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
] as const satisfies readonly (keyof LeadFields)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, name: string, min: number, max: number): string {
  if (typeof value !== "string" || value.length < min || value.length > max) {
    throw new Error(`${name} must be a string between ${min} and ${max} characters`);
  }
  return value;
}

function parseLanguage(value: unknown): Language {
  if (value !== "en" && value !== "zh" && value !== "ja") {
    throw new Error("language must be en, zh, or ja");
  }
  return value;
}

function parseSessionId(value: unknown): string {
  return requireString(value, "sessionId", 8, 128);
}

function parseLeadValue(value: unknown, name: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new Error(`${name} must be a string or null`);
  if (value.length > 4000) throw new Error(`${name} must be at most 4000 characters`);
  return value;
}

export function normalizeLead(value: unknown): LeadFields {
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(
    LEAD_KEYS.map((key) => [key, parseLeadValue(source[key], key)])
  ) as LeadFields;
}

function parsePartialLead(value: unknown): Partial<LeadFields> {
  if (value === undefined) return {};
  if (!isRecord(value)) throw new Error("lead must be an object");
  const result: Partial<LeadFields> = {};
  for (const key of LEAD_KEYS) {
    if (key in value) result[key] = parseLeadValue(value[key], key);
  }
  return result;
}

function parseMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) throw new Error("messages must be an array");
  if (value.length > 12) throw new Error("messages must contain at most 12 items");
  return value.map((entry, index) => {
    if (!isRecord(entry)) throw new Error(`messages[${index}] must be an object`);
    if (entry.role !== "user" && entry.role !== "assistant") {
      throw new Error(`messages[${index}].role must be user or assistant`);
    }
    return {
      role: entry.role,
      content: requireString(entry.content, `messages[${index}].content`, 1, 4000)
    };
  });
}

function isValidEmail(value: string | null): boolean {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

function isValidPhone(value: string | null): boolean {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 20;
}

export function parseChatRequest(value: unknown): ChatRequest {
  if (!isRecord(value)) throw new Error("request must be an object");
  return {
    sessionId: parseSessionId(value.sessionId),
    language: parseLanguage(value.language),
    messages: parseMessages(value.messages),
    lead: parsePartialLead(value.lead)
  };
}

export function parseLeadSubmission(value: unknown): LeadSubmissionRequest {
  if (!isRecord(value)) throw new Error("request must be an object");
  if (value.confirmed !== true) throw new Error("lead must be explicitly confirmed");

  const lead = normalizeLead(value.lead);
  if (!isValidEmail(lead.email) && !isValidPhone(lead.phone)) {
    throw new Error("lead requires a valid email or phone");
  }

  return {
    confirmed: true,
    sessionId: parseSessionId(value.sessionId),
    language: parseLanguage(value.language),
    lead,
    conversationSummary: requireString(value.conversationSummary, "conversationSummary", 1, 8000)
  };
}
