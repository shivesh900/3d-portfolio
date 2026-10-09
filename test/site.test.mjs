import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const site = fs.existsSync(path.join(root, "site/index.html")) ? path.join(root, "site") : path.join(root, "docs");
const html = fs.readFileSync(path.join(site, "index.html"), "utf8");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(site, "data.js"), "utf8"), ctx);
const P = ctx.window.PORTFOLIO;

test("page shell: title, viewport, landmarks, no inline scripts", () => {
  assert.match(html, /<title>Shivesh Haran P · 3D Developer Portfolio<\/title>/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1/);
  assert.match(html, /<main id="app">/);
  assert.match(html, /id="quick"/);
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>/g)];
  assert.equal(inline.length, 0, "no inline scripts");
  assert.doesNotMatch(html, /lorem|placeholder text|TODO/i);
});

test("every local asset referenced by the page exists", () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]).filter(u => !u.startsWith("mailto"));
  assert.ok(refs.length >= 5);
  for (const r of refs) assert.ok(fs.existsSync(path.join(site, r)), `missing ${r}`);
  assert.ok(fs.existsSync(path.join(site, P.contact.resumePdf)), "resume pdf present");
  const js = fs.readdirSync(path.join(site, "js"));
  assert.ok(js.includes("main.js") && js.some(f => f.startsWith("scene-")), "bundles built");
});

test("portfolio data is real and complete", () => {
  assert.equal(P.name, "Shivesh Haran P");
  assert.equal(P.education[0].score, "CGPA 8.45");
  assert.ok(P.projects.length >= 7);
  for (const p of P.projects) {
    assert.ok(p.name && p.summary && p.stack.length && p.points.length, p.id);
    for (const u of [p.github, p.live].filter(Boolean)) assert.match(u, /^https:\/\//);
  }
  assert.ok(P.projects.find(p => p.id === "neurosy-rag").featured);
});

test("assistant answers the core recruiter questions", async () => {
  globalThis.window = ctx.window;
  const { createAssistant } = await import(path.join(root, "src/assistant.js"));
  const a = createAssistant(P);
  const ask = q => a.answer(q).text;
  assert.match(ask("what's his cgpa?"), /8\.45/);
  assert.match(ask("does he know pytorch?"), /PyTorch: yes/);
  assert.match(ask("does he know java"), /not on his resume/);
  assert.match(ask("tell me about neurosy rag"), /NeuroSy-RAG/);
  assert.match(ask("what stack did it use?"), /Python/);
  assert.match(ask("how can I contact him"), /shiveshharan900@gmail\.com/);
  assert.match(ask("is he open to full time roles"), /2027/);
  assert.match(ask("who are you"), /NOVA/);
  assert.match(ask("what is the weather on mars"), /not sure/);
  assert.match(ask("best project"), /NeuroSy-RAG/);
});
