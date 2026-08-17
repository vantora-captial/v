import { applyD1Migrations, env } from "cloudflare:test";

await applyD1Migrations(
  env.REGISTRY_DB,
  (env as typeof env & { TEST_MIGRATIONS: D1Migration[] }).TEST_MIGRATIONS
);
