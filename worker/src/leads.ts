import { EmailServiceError, sendLeadEmail } from "./email";
import type { LeadFields, LeadSubmissionRequest, LeadSubmissionResponse } from "./types";

type LeadEnv = Env & {
  RESEND_API_KEY: string;
  LEAD_RECIPIENT: string;
  LEAD_FROM_EMAIL: string;
};

function display(value: string | null): string {
  return value && value.trim() ? value : "Not provided";
}

function subjectPart(value: string | null): string {
  return display(value).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

export function buildLeadSubject(lead: LeadFields): string {
  return `New AI Lead | ${subjectPart(lead.opportunityType)} | ${subjectPart(lead.countryRegion)} | ${subjectPart(lead.sizeBudget)}`;
}

function buildRequirementSummary(lead: LeadFields): string {
  return [
    `User type: ${display(lead.userType)}`,
    `Opportunity: ${display(lead.opportunityType)}`,
    `Country / region: ${display(lead.countryRegion)}`,
    `Stage: ${display(lead.stage)}`,
    `Size / budget: ${display(lead.sizeBudget)}`,
    `Timeline: ${display(lead.timeline)}`
  ].join("; ");
}

export function buildLeadEmailText(request: LeadSubmissionRequest, timestamp = new Date().toISOString()): string {
  const { lead } = request;
  return [
    `Submission timestamp: ${timestamp}`,
    `User language: ${request.language}`,
    `Name: ${display(lead.name)}`,
    `Company: ${display(lead.company)}`,
    `Email: ${display(lead.email)}`,
    `Phone: ${display(lead.phone)}`,
    `Country / region: ${display(lead.countryRegion)}`,
    `User type: ${display(lead.userType)}`,
    `Opportunity / service type: ${display(lead.opportunityType)}`,
    `Stage: ${display(lead.stage)}`,
    `Size / budget: ${display(lead.sizeBudget)}`,
    `Timeline: ${display(lead.timeline)}`,
    `Requirement summary: ${buildRequirementSummary(lead)}`,
    "Recommended next action: Human advisor follow-up",
    `Conversation summary: ${request.conversationSummary}`
  ].join("\n");
}

export async function submitLead(env: LeadEnv, request: LeadSubmissionRequest): Promise<LeadSubmissionResponse> {
  try {
    await sendLeadEmail(env, {
      subject: buildLeadSubject(request.lead),
      text: buildLeadEmailText(request),
      lead: request.lead
    });
    return { ok: true, submissionId: crypto.randomUUID() };
  } catch (error) {
    if (error instanceof EmailServiceError) return { ok: false, error: "email_failed" };
    return { ok: false, error: "email_failed" };
  }
}
