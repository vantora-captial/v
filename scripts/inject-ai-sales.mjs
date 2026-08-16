import { readFile, writeFile } from "node:fs/promises";

const path = new URL("../index.html", import.meta.url);
let html = await readFile(path, "utf8");
const original = html;

if (!html.includes('name="vantora-ai-api"')) {
  const hooks = '<meta name="vantora-ai-api" content="http://127.0.0.1:8787"><link rel="stylesheet" href="assets/ai-sales.css">';
  if (!html.includes("</head>")) throw new Error("index.html has no </head> hook");
  html = html.replace("</head>", `${hooks}</head>`);
}

if (!html.includes('src="assets/ai-sales.js"')) {
  if (!html.includes("</body>")) throw new Error("index.html has no </body> hook");
  html = html.replace("</body>", '<script type="module" src="assets/ai-sales.js"></script></body>');
}

if (html === original) {
  console.log("AI sales hooks already present; no changes required.");
} else {
  await writeFile(path, html, "utf8");
  console.log("Injected Vantora AI sales hooks into index.html.");
}
