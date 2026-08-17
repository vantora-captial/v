# UPEX Public Display Package

This folder is the public-facing website package.

Upload only this folder for external display.

Included:

- `index.html`
- `assets/vantora-logo.svg`
- `assets/vantora-logo-mark.svg`
- `assets/ai-sales.css`
- `assets/ai-sales-core.mjs`
- `assets/ai-sales.js`

AI sales architecture:

- The browser loads only the public AI sales UI assets above.
- The AI backend runs separately as a Cloudflare Worker named `vantora-ai-sales`.
- The deployed Worker endpoint is `https://vantora-ai-sales.vantora-captial-tech.workers.dev`.
- OpenAI and Resend credentials must remain server-side and must never be committed into this public GitHub Pages package.
- Production secrets are stored in GitHub Actions / Cloudflare Worker secret storage, not in `index.html` or browser JavaScript.

Do not upload the local management files:

- `admin.html`
- `server.mjs`
- `news-drafts.json`
- `scripts/news-fetcher.mjs`
- `start-admin.bat`

The admin console is for local or internal use only.
