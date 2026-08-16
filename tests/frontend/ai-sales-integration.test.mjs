import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, js, css] = await Promise.all([
  readFile(new URL("../../index.html", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.js", import.meta.url), "utf8"),
  readFile(new URL("../../assets/ai-sales.css", import.meta.url), "utf8")
]);

test("homepage loads the AI sales assets with the feature-branch local API hook", () => {
  assert.match(html, /<meta name="vantora-ai-api" content="http:\/\/127\.0\.0\.1:8787">/);
  assert.match(html, /<link rel="stylesheet" href="assets\/ai-sales\.css">/);
  assert.match(html, /<script type="module" src="assets\/ai-sales\.js"><\/script>/);
});

test("public frontend source contains no server secret identifiers or API keys", () => {
  const publicSource = `${html}\n${js}\n${css}`;
  for (const forbidden of ["OPENAI_API_KEY", "RESEND_API_KEY", "Bearer sk-", "sk-proj-"]) {
    assert.equal(publicSource.includes(forbidden), false, `public source must not contain ${forbidden}`);
  }
});

test("AI state is tab-scoped and the frontend cannot choose the server email recipient", () => {
  assert.match(js, /sessionStorage/);
  assert.equal(js.includes("localStorage"), false);
  assert.match(js, /\/v1\/chat/);
  assert.match(js, /\/v1\/leads/);
  assert.match(js, /needsConfirmation/);
  assert.match(js, /ai-sales-confirm/);
  assert.doesNotMatch(js, /\brecipient\s*:/);
  assert.doesNotMatch(js, /(^|[,{]\s*)to\s*:/m);
});

test("visitor and model content is rendered as text rather than injected HTML", () => {
  assert.match(js, /textContent/);
  assert.equal(js.includes("innerHTML"), false);
});

test("widget styling is mobile-safe, accessible, and reduced-motion aware", () => {
  assert.match(css, /@media\(max-width:650px\)/);
  assert.match(css, /\.ai-sales-launcher\{right:12px;bottom:82px/);
  assert.match(css, /\.ai-sales-panel\{inset:auto 8px 74px 8px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height:48px/);
});
