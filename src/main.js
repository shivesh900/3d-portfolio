import { createAssistant } from "./assistant.js";

const P = window.PORTFOLIO;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ok = v => v && v !== "TODO";
const extLink = (url, label, cls = "btn") => url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : "";
const ICON = {
  gh: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  live: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  dl: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/></svg>'
};

/* ---------------- static bits ---------------- */
document.title = `${P.name} · 3D Developer Portfolio`;
$("#hud-name").textContent = P.name;
$("#hud-role").textContent = P.title;
$("#hud-badge").textContent = P.openTo.banner;
$("#resume-btn").href = P.contact.resumePdf;

/* ---------------- sheet (detail overlay) ---------------- */
const sheet = $("#sheet"), sheetBody = $("#sheet-body");
let lastFocus = null;
function openSheet(html, label) {
  lastFocus = document.activeElement;
  sheetBody.innerHTML = html; sheet.setAttribute("aria-label", label || "Details");
  sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add("open"));
  $("#sheet-close").focus({ preventScroll: true });
  sheetBody.scrollTop = 0;
}
function closeSheet() { sheet.classList.remove("open"); setTimeout(() => { sheet.hidden = true; }, 250); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
$("#sheet-close").addEventListener("click", closeSheet);
sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
addEventListener("keydown", e => { if (e.key === "Escape") { if (!sheet.hidden) closeSheet(); else if (chatOpen) toggleChat(false); else if (!quick.hidden) toggleQuick(false); } });

function projectHTML(p) {
  return `<p class="eyebrow" style="--c:${p.color}">${esc(p.category)}${p.featured ? " · Featured" : ""}${p.period ? " · " + esc(p.period) : ""}</p>
  <h2>${esc(p.name)}</h2><p class="sub">${esc(p.subtitle)}</p>
  <p>${esc(p.summary)}</p>
  <ul class="points">${p.points.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
  ${p.facts && p.facts.length ? `<ul class="facts">${p.facts.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
  <div class="chips">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div>
  <div class="actions">${extLink(p.github, ICON.gh + " View code")}${extLink(p.live, ICON.live + " Live demo", "btn primary")}${!p.github && !p.live ? `<span class="muted">Code walkthrough available on request: <a href="mailto:${esc(P.contact.email)}">${esc(P.contact.email)}</a></span>` : ""}</div>
  <div class="pager">${P.projects.map(q => `<button type="button" data-proj="${q.id}" class="${q.id === p.id ? "on" : ""}" aria-label="${esc(q.name)}" style="--c:${q.color}"></button>`).join("")}</div>`;
}
function radarSVG() {
  const R = P.radar, cx = 120, cy = 112, rad = 80, n = R.length;
  const pt = (i, k) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * rad * k, cy + Math.sin(a) * rad * k]; };
  const rings = [0.25, 0.5, 0.75, 1].map(k => `<polygon points="${R.map((_, i) => pt(i, k).join(",")).join(" ")}" />`).join("");
  const shape = R.map((r, i) => pt(i, r.value).join(",")).join(" ");
  const labels = R.map((r, i) => { const [x, y] = pt(i, 1.28); return `<text x="${x}" y="${y + 4}">${esc(r.label)}</text>`; }).join("");
  return `<svg class="radar" viewBox="0 0 240 230" role="img" aria-label="Skill focus areas"><g class="rings">${rings}</g><polygon class="shape" points="${shape}"/>${labels}</svg>`;
}
function skillsHTML() {
  return `<p class="eyebrow">Skills</p><h2>Tech stack</h2>
  <div class="skills-grid"><div>${radarSVG()}<p class="tiny">Relative focus areas</p></div>
  <div>${Object.entries(P.skills).map(([k, v]) => `<h3>${esc(k)}</h3><div class="chips">${v.map(s => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div></div>
  <h3>Core CS coursework</h3><div class="chips soft">${P.coursework.map(s => `<span>${esc(s)}</span>`).join("")}</div>
  <h3>Currently exploring</h3><div class="chips soft">${P.interests.map(s => `<span>${esc(s)}</span>`).join("")}</div>`;
}
function aboutHTML() {
  const x = P.experience[0];
  return `<p class="eyebrow">About</p><h2>${esc(P.name)}</h2><p class="sub">${esc(P.title)} · ${esc(P.location)}</p>
  <p>${esc(P.summary)}</p>
  <div class="open-box"><strong>${esc(P.openTo.banner)}</strong><span>${P.openTo.roles.map(esc).join(" · ")}</span></div>
  <h3>Experience</h3>
  <div class="tl"><div class="tl-item"><b>${esc(x.role)}${ok(x.company) ? " · " + esc(x.company) : ""}</b><span class="muted">${esc(x.period)}</span><ul>${x.points.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div>
  <div class="actions">${extLink(P.contact.resumePdf, ICON.dl + " Resume PDF", "btn primary")}${extLink(P.contact.github, ICON.gh + " GitHub")}${extLink(P.contact.linkedin, "LinkedIn")}</div>`;
}
function educationHTML() {
  const e = P.education[0];
  return `<p class="eyebrow">Education</p><h2>${esc(e.degree)}</h2>
  <div class="tl"><div class="tl-item main"><b>${esc(e.school)}</b><span class="score">${esc(e.score)}</span><span class="muted">${esc(e.period)}</span></div>
  <div class="tl-item small"><span class="muted">${esc(P.school.name)}: Class XII ${esc(P.school.classXII)}, Class X ${esc(P.school.classX)}</span></div></div>
  <h3>Core CS coursework</h3><div class="chips soft">${P.coursework.map(s => `<span>${esc(s)}</span>`).join("")}</div>`;
}
function certsHTML() {
  return `<p class="eyebrow">Certifications</p><h2>Certification shelf</h2>
  <ul class="certs">${P.certifications.map(c => `<li><span class="tick">✓</span><div><b>${esc(c.name)}</b>${ok(c.issuer) ? `<span class="muted">${esc(c.issuer)}</span>` : ""}</div></li>`).join("")}</ul>`;
}
function projectsListHTML() {
  return `<p class="eyebrow">Projects</p><h2>${P.projects.length} projects</h2>
  <div class="plist">${P.projects.map(p => `<button type="button" class="pcard" data-proj="${p.id}" style="--c:${p.color}"><span class="eyebrow">${esc(p.category)}</span><b>${esc(p.name)}</b><span class="muted">${esc(p.subtitle)}</span></button>`).join("")}</div>`;
}
sheetBody.addEventListener("click", e => { const b = e.target.closest("[data-proj]"); if (b) { showProject(b.dataset.proj); } });

function showProject(id) { const p = P.projects.find(x => x.id === id); if (!p) return; room && room.focusPanel(id); openSheet(projectHTML(p), p.name); }
function select(u) {
  if (!u) return;
  if (u.kind === "project") showProject(u.id);
  else if (u.kind === "assistant") toggleChat(true);
  else if (u.kind === "skills") openSheet(skillsHTML(), "Skills");
  else if (u.kind === "about") openSheet(aboutHTML(), "About");
  else if (u.kind === "education") openSheet(educationHTML(), "Education");
  else if (u.kind === "certs") openSheet(certsHTML(), "Certifications");
  else if (u.kind === "projects") openSheet(projectsListHTML(), "Projects");
}
$("#projects-btn").addEventListener("click", () => select({ kind: "projects" }));

/* ---------------- assistant chat ---------------- */
const bot = createAssistant(P);
const chat = $("#chat"), log = $("#chat-log"), input = $("#chat-input");
let chatOpen = false, typing = false;
function toggleChat(on) {
  chatOpen = on ?? !chatOpen; chat.classList.toggle("open", chatOpen); chat.setAttribute("aria-hidden", String(!chatOpen));
  document.body.classList.toggle("chat-on", chatOpen);
  if (chatOpen) { if (!log.children.length) say({ text: P.assistant.intro, chips: ["Quick summary", "Best project?", "Skills", "Education", "How to contact him"] }); if (!matchMedia("(pointer: coarse)").matches) input.focus({ preventScroll: true }); }
}
$("#ask-btn").addEventListener("click", () => toggleChat(true));
$("#chat-close").addEventListener("click", () => toggleChat(false));
function richText(s) {
  return esc(s).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, label, url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
}
function addMsg(cls, html) { const d = document.createElement("div"); d.className = "msg " + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
function say(r) {
  typing = true;
  const d = addMsg("bot", ""); const full = richText(r.text).replace(/\n/g, "<br>");
  // type out plain characters while keeping tags intact
  const parts = full.split(/(<[^>]+>)/); let i = 0, j = 0, out = "";
  const charsTotal = full.replace(/<[^>]+>/g, "").length;
  room && room.speak(Math.min(6, charsTotal / 70));
  const step = Math.max(1, Math.round(charsTotal / 140));
  const timer = setInterval(() => {
    for (let k = 0; k < step; k++) {
      while (i < parts.length && (parts[i].startsWith("<") || j >= parts[i].length)) { if (parts[i].startsWith("<")) out += parts[i]; i++; j = 0; }
      if (i >= parts.length) break;
      const ch = parts[i][j]; if (ch === "&") { const e = parts[i].indexOf(";", j); out += parts[i].slice(j, e + 1); j = e + 1; } else { out += ch; j++; }
    }
    d.innerHTML = out + '<span class="caret"></span>'; log.scrollTop = log.scrollHeight;
    if (i >= parts.length) {
      clearInterval(timer); d.innerHTML = out; typing = false;
      if (r.chips && r.chips.length) { const c = document.createElement("div"); c.className = "msg-chips"; r.chips.forEach(t => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.onclick = () => ask(t); c.appendChild(b); }); log.appendChild(c); log.scrollTop = log.scrollHeight; }
    }
  }, 16);
}
function ask(q) {
  if (!q.trim() || typing) return;
  log.querySelectorAll(".msg-chips").forEach(c => c.remove());
  addMsg("me", esc(q));
  const th = addMsg("bot thinking", "<span></span><span></span><span></span>");
  room && room.speak(0.6);
  setTimeout(() => { th.remove(); const r = bot.answer(q); say(r); if (r.open && r.open[0] !== "@" && room && !matchMedia("(max-width: 700px)").matches) room.focusPanel(r.open); }, 380 + Math.random() * 300);
}
$("#chat-form").addEventListener("submit", e => { e.preventDefault(); const q = input.value; input.value = ""; ask(q); });

/* ---------------- quick view (2D recruiter page) ---------------- */
const quick = $("#quick");
function buildQuick() {
  const e = P.education[0], x = P.experience[0];
  $("#quick-body").innerHTML = `
  <header class="q-hero"><div><p class="eyebrow">${esc(P.openTo.banner)}</p><h1>${esc(P.name)}</h1><p class="sub">${esc(P.title)} · ${esc(P.location)}</p>
  <div class="actions">${extLink(P.contact.resumePdf, ICON.dl + " Download resume", "btn primary")}<a class="btn" href="mailto:${esc(P.contact.email)}">Email</a>${extLink(P.contact.linkedin, "LinkedIn")}${extLink(P.contact.github, ICON.gh + " GitHub")}</div></div></header>
  <section><h2>Summary</h2><p>${esc(P.summary)}</p><div class="open-box"><strong>Looking for</strong><span>${P.openTo.roles.map(esc).join(" · ")}</span></div></section>
  <section><h2>Education</h2><div class="tl"><div class="tl-item main"><b>${esc(e.degree)}</b><span>${esc(e.school)}</span><span class="score">${esc(e.score)}</span><span class="muted">${esc(e.period)}</span></div><div class="tl-item small"><span class="muted">${esc(P.school.name)}: Class XII ${esc(P.school.classXII)}, Class X ${esc(P.school.classX)}</span></div></div></section>
  <section><h2>Experience</h2><div class="tl"><div class="tl-item"><b>${esc(x.role)}${ok(x.company) ? " · " + esc(x.company) : ""}</b><span class="muted">${esc(x.period)}</span><ul>${x.points.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div></section>
  <section><h2>Projects</h2><div class="qprojects">${P.projects.map(p => `<article style="--c:${p.color}"><p class="eyebrow">${esc(p.category)}${p.period ? " · " + esc(p.period) : ""}</p><h3>${esc(p.name)}</h3><p class="sub">${esc(p.subtitle)}</p><p>${esc(p.summary)}</p><div class="chips">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div><div class="actions">${extLink(p.github, ICON.gh + " Code")}${extLink(p.live, ICON.live + " Live", "btn primary")}</div></article>`).join("")}</div></section>
  <section><h2>Skills</h2><div class="skills-grid"><div>${radarSVG()}<p class="tiny">Relative focus areas</p></div><div>${Object.entries(P.skills).map(([k, v]) => `<h3>${esc(k)}</h3><div class="chips">${v.map(s => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div></div></section>
  <section><h2>Core CS coursework</h2><div class="chips soft">${P.coursework.map(s => `<span>${esc(s)}</span>`).join("")}</div><h2 class="mt">Currently exploring</h2><div class="chips soft">${P.interests.map(s => `<span>${esc(s)}</span>`).join("")}</div></section>
  <section><h2>Certifications</h2><ul class="certs">${P.certifications.map(c => `<li><span class="tick">✓</span><div><b>${esc(c.name)}</b>${ok(c.issuer) ? `<span class="muted">${esc(c.issuer)}</span>` : ""}</div></li>`).join("")}</ul></section>
  <section><h2>GitHub</h2><div id="gh-stats" class="gh"></div></section>
  <section><h2>Contact</h2><p><a href="mailto:${esc(P.contact.email)}">${esc(P.contact.email)}</a> · <a href="tel:${esc(P.contact.phone.replace(/\s/g, ""))}">${esc(P.contact.phone)}</a></p><div class="actions">${extLink(P.contact.linkedin, "LinkedIn")}${extLink(P.contact.github, ICON.gh + " GitHub")}${extLink(P.contact.resumePdf, ICON.dl + " Resume PDF", "btn primary")}</div></section>`;
  renderGH(P.github.snapshot, null);
  loadGH();
}
function renderGH(s, repos) {
  const langs = Object.entries(s.languages).sort((a, b) => b[1] - a[1]); const tot = langs.reduce((a, b) => a + b[1], 0) || 1;
  const cols = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", CSS: "#563d7c", HTML: "#e34c26" };
  $("#gh-stats").innerHTML = `<div class="gh-top"><div><b>${s.publicRepos}</b><span>public repos</span></div><div><b>${langs.length}</b><span>languages</span></div>${extLink(P.contact.github, ICON.gh + " @" + esc(P.github.user))}</div>
  <div class="langbar">${langs.map(([l, n]) => `<i style="flex:${n};background:${cols[l] || "#8fa3c9"}" title="${esc(l)}"></i>`).join("")}</div>
  <div class="langkey">${langs.map(([l, n]) => `<span><i style="background:${cols[l] || "#8fa3c9"}"></i>${esc(l)} ${Math.round(n / tot * 100)}%</span>`).join("")}</div>
  ${repos ? `<p class="tiny">Recently updated: ${repos.slice(0, 4).map(r => `<a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name)}</a>`).join(", ")}</p>` : `<p class="tiny">Snapshot · live numbers load from GitHub when available</p>`}`;
}
async function loadGH() {
  try {
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
    const r = await fetch(`https://api.github.com/users/${P.github.user}/repos?per_page=100&sort=pushed`, { signal: ctl.signal });
    if (!r.ok) return; const repos = (await r.json()).filter(x => !x.fork);
    const languages = {}; repos.forEach(x => { if (x.language) languages[x.language] = (languages[x.language] || 0) + 1; });
    renderGH({ publicRepos: repos.length, languages }, repos);
  } catch (e) { /* keep snapshot */ }
}
function toggleQuick(on) {
  quick.hidden = !on; document.body.classList.toggle("quick-on", on);
  if (on) { if (!$("#quick-body").children.length) buildQuick(); quick.scrollTop = 0; $("#quick-close").focus({ preventScroll: true }); history.replaceState(null, "", "#quick"); }
  else history.replaceState(null, "", location.pathname + location.search);
  room && room.pause(on);
}
$("#quick-btn").addEventListener("click", () => toggleQuick(true));
$("#quick-close").addEventListener("click", () => toggleQuick(false));

/* ---------------- boot ---------------- */
let room = null;
const bar = $("#load-bar"), loadTxt = $("#load-text");
function progress(p, t) { bar.style.width = p + "%"; if (t) loadTxt.textContent = t; }
function webglOK() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; } }
function finishLoading() { progress(100, "Ready"); setTimeout(() => document.body.classList.add("loaded"), 250); setTimeout(() => $("#loader").remove(), 1100); }

async function boot() {
  progress(25, "Loading engine…");
  const wantQuick = location.hash === "#quick" || new URLSearchParams(location.search).has("quick");
  if (!webglOK()) { document.body.classList.add("no-3d"); finishLoading(); toggleQuick(true); return; }
  try {
    const { createRoom } = await import("./scene.js");
    progress(60, "Building the dev room…");
    await new Promise(r => setTimeout(r, 30));
    room = createRoom($("#stage"), P, { labelLayer: $("#labels"), onSelect: select, lowPower: navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 });
    window.__room = { screenOf: room.screenOf };
    progress(90, "Powering up the hologram…");
    requestAnimationFrame(() => requestAnimationFrame(finishLoading));
    if (wantQuick) toggleQuick(true);
    setTimeout(() => document.body.classList.add("hint-off"), 9000);
  } catch (e) {
    console.error(e); document.body.classList.add("no-3d"); finishLoading(); toggleQuick(true);
  }
}
boot();
