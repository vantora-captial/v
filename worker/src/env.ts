export type RuntimeEnv = Env & {
  OPENAI_API_KEY: string;
  RESEND_API_KEY: string;
  OPENAI_MODEL: string;
  LEAD_RECIPIENT: string;
  LEAD_FROM_EMAIL: string;
  ALLOWED_ORIGINS: string;
  REGISTRY_DB: D1Database;
  REGISTRY_FILES: R2Bucket;
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  REGISTRY_ADMIN_EMAILS: string;
  REGISTRY_ADVISOR_EMAILS: string;
};
