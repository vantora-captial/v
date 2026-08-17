import { SYSTEM_INSTRUCTIONS, buildKnowledgeContext } from "./knowledge";
import type { ChatRequest, ChatResponse, LeadFields, Language } from "./types";

export class AiServiceError extends Error {
  constructor() {
    super("AI service unavailable");
    this.name = "AiServiceError";
  }
}

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

const NULLABLE_STRING = { type: ["string", "null"] } as const;

export const SALES_REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["assistantMessage", "language", "lead", "status", "needsConfirmation"],
  properties: {
    assistantMessage: { type: "string", minLength: 1, maxLength: 4000 },
    language: { type: "string", enum: ["en", "zh", "ja"] },
    lead: {
      type: "object",
      additionalProperties: false,
      required: [...LEAD_KEYS],
      properties: Object.fromEntries(LEAD_KEYS.map((key) => [key, NULLABLE_STRING]))
    },
    status: { type: "string", enum: ["collecting", "ready_for_confirmation"] },
    needsConfirmation: { type: "boolean" }
  }
} as const;

type ChatEnv = Env & { OPENAI_API_KEY: string; OPENAI_MODEL: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLanguage(value: unknown): Language {
  if (value === "en" || value === "zh" || value === "ja") return value;
  throw new AiServiceError();
}

function parseNullableString(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value === "string" && value.length <= 4000) return value;
  throw new AiServiceError();
}

function parseLead(value: unknown): LeadFields {
  if (!isRecord(value)) throw new AiServiceError();
  return Object.fromEntries(
    LEAD_KEYS.map((key) => [key, parseNullableString(value[key])])
  ) as LeadFields;
}

function parseChatResponse(value: unknown): ChatResponse {
  if (!isRecord(value)) throw new AiServiceError();
  if (typeof value.assistantMessage !== "string" || value.assistantMessage.length < 1 || value.assistantMessage.length > 4000) {
    throw new AiServiceError();
  }
  if (value.status !== "collecting" && value.status !== "ready_for_confirmation") {
    throw new AiServiceError();
  }
  if (typeof value.needsConfirmation !== "boolean") throw new AiServiceError();

  return {
    assistantMessage: value.assistantMessage,
    language: parseLanguage(value.language),
    lead: parseLead(value.lead),
    status: value.status,
    needsConfirmation: value.needsConfirmation
  };
}

function findOutputText(value: unknown): string {
  if (!isRecord(value) || !Array.isArray(value.output)) throw new AiServiceError();
  for (const outputItem of value.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) continue;
    for (const contentItem of outputItem.content) {
      if (isRecord(contentItem) && contentItem.type === "output_text" && typeof contentItem.text === "string") {
        return contentItem.text;
      }
    }
  }
  throw new AiServiceError();
}

function preserveKnownLead(modelLead: LeadFields, knownLead: Partial<LeadFields>): LeadFields {
  const result = { ...modelLead };
  for (const key of LEAD_KEYS) {
    const supplied = knownLead[key];
    if (typeof supplied === "string") result[key] = supplied;
  }
  return result;
}

function buildInstructions(request: ChatRequest): string {
  return [
    SYSTEM_INSTRUCTIONS.trim(),
    "",
    "APPROVED KNOWLEDGE:",
    buildKnowledgeContext(),
    "",
    `Current interface language: ${request.language}`,
    `Already known lead fields (preserve exact supplied values): ${JSON.stringify(request.lead)}`
  ].join("\n");
}

export async function generateSalesReply(env: ChatEnv, request: ChatRequest): Promise<ChatResponse> {
  const body = {
    model: env.OPENAI_MODEL,
    store: false,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: buildInstructions(request) }]
      },
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

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new AiServiceError();

    const upstream = await response.json();
    const parsed = parseChatResponse(JSON.parse(findOutputText(upstream)));
    return {
      ...parsed,
      lead: preserveKnownLead(parsed.lead, request.lead)
    };
  } catch (error) {
    if (error instanceof AiServiceError) throw error;
    throw new AiServiceError();
  }
}
