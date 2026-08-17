import type { LeadFields } from "./types";

export type LeadMail = {
  subject: string;
  text: string;
  lead: LeadFields;
};

type EmailEnv = Env & {
  RESEND_API_KEY: string;
  LEAD_RECIPIENT: string;
  LEAD_FROM_EMAIL: string;
};

export class EmailServiceError extends Error {
  constructor() {
    super("Email delivery failed");
    this.name = "EmailServiceError";
  }
}

export async function sendLeadEmail(env: EmailEnv, mail: LeadMail): Promise<void> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.LEAD_FROM_EMAIL,
        to: [env.LEAD_RECIPIENT],
        subject: mail.subject,
        text: mail.text,
        reply_to: mail.lead.email || undefined
      })
    });

    if (!response.ok) throw new EmailServiceError();
  } catch (error) {
    if (error instanceof EmailServiceError) throw error;
    throw new EmailServiceError();
  }
}
