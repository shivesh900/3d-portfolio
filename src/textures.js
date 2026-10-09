import * as THREE from "three";

function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }
function tex(c, renderer) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer ? Math.min(4, renderer.capabilities.getMaxAnisotropy()) : 1;
  return t;
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function wrap(g, text, x, y, maxW, lh, maxLines = 3) {
  const words = text.split(" "); let line = "", n = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (g.measureText(test).width > maxW && line) {
      if (n === maxLines - 1) { g.fillText(line.trim().replace(/[,.]?$/, "…"), x, y); return y + lh; }
      g.fillText(line, x, y); line = words[i] + " "; y += lh; n++;
    } else line = test;
  }
  g.fillText(line, x, y); return y + lh;
}
const FONT = "'Segoe UI', system-ui, -apple-system, Roboto, sans-serif";
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";

export function panelTexture(p, renderer) {
  const W = 768, H = 480; const [c, g] = canvas(W, H);
  const col = p.color || "#22e3ff";
  const grad = g.createLinearGradient(0, 0, W, H); grad.addColorStop(0, "rgba(8,20,40,0.92)"); grad.addColorStop(1, "rgba(18,10,40,0.92)");
  rr(g, 6, 6, W - 12, H - 12, 28); g.fillStyle = grad; g.fill();
  g.lineWidth = 5; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 18; g.stroke(); g.shadowBlur = 0;
  // scanlines
  g.globalAlpha = 0.06; g.fillStyle = "#fff"; for (let y = 10; y < H; y += 6) g.fillRect(10, y, W - 20, 1); g.globalAlpha = 1;
  // category chip
  g.font = `600 26px ${FONT}`; const cat = p.category.toUpperCase(); const cw = g.measureText(cat).width + 36;
  rr(g, 40, 38, cw, 46, 23); g.fillStyle = col + "33"; g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke();
  g.fillStyle = col; g.fillText(cat, 58, 70);
  if (p.featured) { g.font = `700 24px ${FONT}`; g.fillStyle = "#ffe27a"; g.fillText("★ FEATURED", W - 210, 70); }
  g.fillStyle = "#ffffff"; let fs = 58; g.font = `800 ${fs}px ${FONT}`; while (g.measureText(p.name).width > W - 80 && fs > 34) { fs -= 2; g.font = `800 ${fs}px ${FONT}`; } g.fillText(p.name, 40, 156);
  g.fillStyle = "#b9c6e6"; g.font = `500 30px ${FONT}`; let y = wrap(g, p.subtitle, 40, 206, W - 80, 38, 2);
  // stack chips
  g.font = `600 24px ${MONO}`; let x = 40; y = Math.max(y + 22, 290);
  for (const s of p.stack.slice(0, 6)) {
    const w = g.measureText(s).width + 28;
    if (x + w > W - 40) { x = 40; y += 50; if (y > 360) break; }
    rr(g, x, y - 30, w, 40, 10); g.fillStyle = "rgba(255,255,255,0.08)"; g.fill();
    g.fillStyle = "#dfe8ff"; g.fillText(s, x + 14, y - 2); x += w + 10;
  }
  g.fillStyle = col; g.font = `700 26px ${FONT}`; g.fillText("TAP TO OPEN  ›", 40, H - 40);
  const links = [p.github ? "GITHUB" : null, p.live ? "LIVE" : null].filter(Boolean).join(" · ");
  g.fillStyle = "#8fa3c9"; g.font = `600 22px ${MONO}`; g.textAlign = "right"; g.fillText(links, W - 40, H - 40); g.textAlign = "left";
  return tex(c, renderer);
}

export function codeScreen(renderer) {
  const [c, g] = canvas(1024, 600);
  g.fillStyle = "#0b1020"; g.fillRect(0, 0, 1024, 600);
  g.fillStyle = "#141b33"; g.fillRect(0, 0, 1024, 44);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((cl, i) => { g.fillStyle = cl; g.beginPath(); g.arc(28 + i * 26, 22, 8, 0, 7); g.fill(); });
  g.fillStyle = "#8fa3c9"; g.font = `500 20px ${MONO}`; g.fillText("neurosy_rag/pipeline.py", 120, 29);
  const lines = [
    [["#c792ea", "from "], ["#e6edf3", "sklearn.ensemble "], ["#c792ea", "import "], ["#e6edf3", "RandomForestClassifier"]],
    [["#c792ea", "from "], ["#e6edf3", "rules "], ["#c792ea", "import "], ["#e6edf3", "validate"]],
    [],
    [["#c792ea", "def "], ["#82aaff", "diagnose"], ["#e6edf3", "(text: "], ["#ffcb6b", "str"], ["#e6edf3", "):"]],
    [["#e6edf3", "    symptoms = "], ["#82aaff", "extract_entities"], ["#e6edf3", "(text)"]],
    [["#e6edf3", "    preds = ensemble."], ["#82aaff", "predict_proba"], ["#e6edf3", "(symptoms)"]],
    [["#e6edf3", "    preds = "], ["#82aaff", "validate"], ["#e6edf3", "(symptoms, preds)  "], ["#5c6f91", "# no hallucinations"]],
    [["#e6edf3", "    context = rag."], ["#82aaff", "retrieve"], ["#e6edf3", "(preds.top)"]],
    [["#c792ea", "    return "], ["#e6edf3", "rank_providers(preds, context)"]],
    [],
    [["#5c6f91", "# shivesh@srm:~$ python -m pytest  ✓ all passed"]]
  ];
  g.font = `500 26px ${MONO}`;
  lines.forEach((ln, i) => { let x = 70; g.fillStyle = "#3a4766"; g.fillText(String(i + 1).padStart(2, " "), 16, 96 + i * 42); for (const [cl, t] of ln) { g.fillStyle = cl; g.fillText(t, x, 96 + i * 42); x += g.measureText(t).width; } });
  return tex(c, renderer);
}

export function terminalScreen(P, renderer) {
  const [c, g] = canvas(768, 600);
  g.fillStyle = "#06120d"; g.fillRect(0, 0, 768, 600);
  g.font = `600 26px ${MONO}`;
  const L = [["#3cffb0", "shivesh@devroom:~$ whoami"], ["#d8ffe9", P.name], ["#d8ffe9", "B.Tech CSE · SRM · " + P.education[0].score], [], ["#3cffb0", "shivesh@devroom:~$ cat focus.txt"], ["#d8ffe9", "AI/ML · Full-stack · UI/UX"], [], ["#3cffb0", "shivesh@devroom:~$ status"], ["#ffe27a", "OPEN TO ROLES · " + P.openTo.gradYear], [], ["#3cffb0", "shivesh@devroom:~$ ▌"]];
  L.forEach((l, i) => { if (!l.length) return; g.fillStyle = l[0]; g.fillText(l[1], 28, 60 + i * 46); });
  return tex(c, renderer);
}

export function statsScreen(P, renderer) {
  const [c, g] = canvas(768, 600);
  g.fillStyle = "#0d0b1f"; g.fillRect(0, 0, 768, 600);
  g.fillStyle = "#c9b8ff"; g.font = `700 30px ${FONT}`; g.fillText("SKILLS", 32, 56);
  const R = P.radar; const cx = 384, cy = 330, rad = 190;
  g.strokeStyle = "rgba(169,116,255,0.35)"; g.lineWidth = 2;
  for (let k = 1; k <= 4; k++) { g.beginPath(); R.forEach((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / R.length; const px = cx + Math.cos(a) * rad * k / 4, py = cy + Math.sin(a) * rad * k / 4; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath(); g.stroke(); }
  g.beginPath(); R.forEach((r, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / R.length; const px = cx + Math.cos(a) * rad * r.value, py = cy + Math.sin(a) * rad * r.value; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath();
  g.fillStyle = "rgba(34,227,255,0.28)"; g.fill(); g.strokeStyle = "#22e3ff"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "#e6e0ff"; g.font = `600 22px ${FONT}`; g.textAlign = "center";
  R.forEach((r, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / R.length; g.fillText(r.label, cx + Math.cos(a) * (rad + 44), cy + Math.sin(a) * (rad + 34) + 8); });
  return tex(c, renderer);
}

export function neonText(text, color, renderer, w = 1024, h = 256, size = 150) {
  const [c, g] = canvas(w, h);
  g.font = `800 ${size}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  for (const blur of [40, 20, 8]) { g.shadowColor = color; g.shadowBlur = blur; g.fillStyle = color; g.fillText(text, w / 2, h / 2); }
  g.shadowBlur = 0; g.fillStyle = "#ffffff"; g.globalAlpha = 0.75; g.fillText(text, w / 2, h / 2);
  return tex(c, renderer);
}

export function skylineTexture(renderer) {
  const [c, g] = canvas(512, 384);
  const sky = g.createLinearGradient(0, 0, 0, 384); sky.addColorStop(0, "#050816"); sky.addColorStop(1, "#2a1050");
  g.fillStyle = sky; g.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`; g.fillRect(Math.random() * 512, Math.random() * 200, 2, 2); }
  g.fillStyle = "#ffe9b0"; g.beginPath(); g.arc(400, 80, 26, 0, 7); g.fill();
  let x = 0; while (x < 512) { const w = 24 + Math.random() * 46, h = 80 + Math.random() * 200; g.fillStyle = "#0a0d22"; g.fillRect(x, 384 - h, w, h);
    for (let wy = 384 - h + 10; wy < 380; wy += 14) for (let wx = x + 5; wx < x + w - 6; wx += 10) if (Math.random() < 0.3) { g.fillStyle = Math.random() < 0.5 ? "#ffd27a" : "#5ad8ff"; g.fillRect(wx, wy, 4, 6); }
    x += w + 3; }
  return tex(c, renderer);
}

export function boardTexture(P, renderer) {
  const [c, g] = canvas(1024, 640);
  g.fillStyle = "#0b1226"; g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = "#22e3ff"; g.lineWidth = 6; g.strokeRect(8, 8, 1008, 624);
  g.fillStyle = "#22e3ff"; g.font = `800 52px ${FONT}`; g.fillText("EDUCATION", 56, 92);
  const e = P.education[0];
  g.strokeStyle = "rgba(34,227,255,0.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(84, 150); g.lineTo(84, 560); g.stroke();
  g.fillStyle = "#22e3ff"; g.beginPath(); g.arc(84, 180, 16, 0, 7); g.fill();
  g.fillStyle = "#fff"; g.font = `800 44px ${FONT}`; g.fillText("B.Tech CSE · SRM KTR", 128, 194);
  g.fillStyle = "#ffe27a"; g.font = `800 64px ${FONT}`; g.fillText(e.score, 128, 278);
  g.fillStyle = "#b9c6e6"; g.font = `500 32px ${FONT}`; g.fillText(e.period, 128, 330);
  g.fillStyle = "rgba(185,198,230,0.6)"; g.beginPath(); g.arc(84, 470, 9, 0, 7); g.fill();
  g.fillStyle = "#8fa3c9"; g.font = `500 28px ${FONT}`; g.fillText(`Class XII · ${P.school.classXII}    Class X · ${P.school.classX}`, 128, 480);
  return tex(c, renderer);
}

export function plaqueTexture(cert, color, renderer) {
  const [c, g] = canvas(256, 320);
  g.fillStyle = "#11162e"; g.fillRect(0, 0, 256, 320);
  g.strokeStyle = color; g.lineWidth = 8; g.strokeRect(10, 10, 236, 300);
  g.fillStyle = color; g.beginPath(); g.arc(128, 86, 34, 0, 7); g.fill();
  g.fillStyle = "#11162e"; g.font = `800 34px ${FONT}`; g.textAlign = "center"; g.fillText("✓", 128, 98);
  g.fillStyle = "#fff"; g.font = `700 26px ${FONT}`; wrap(g, cert.name.replace(/\(.*\)/, "").trim(), 128, 166, 210, 30, 3);
  if (cert.issuer && cert.issuer !== "TODO") { g.fillStyle = color; g.font = `600 22px ${FONT}`; g.fillText(cert.issuer, 128, 286); }
  return tex(c, renderer);
}

export function stackWallTexture(P, renderer) {
  const [c, g] = canvas(1024, 768);
  g.clearRect(0, 0, 1024, 768);
  const items = ["Python", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "C++", "SQL", "React", "Flask", "MongoDB", "MySQL", "AWS", "Git", "Power BI", "JavaScript", "NLP"];
  const cols = 4, w = 220, h = 140, gap = 24;
  g.font = `700 32px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  items.forEach((s, i) => {
    const x = 40 + (i % cols) * (w + gap), y = 40 + Math.floor(i / cols) * (h + gap) + 10;
    const col = ["#22e3ff", "#a974ff", "#3cffb0", "#ff5fa2"][(i + Math.floor(i / cols)) % 4];
    rr(g, x, y, w, h, 22); g.fillStyle = "rgba(10,16,36,0.85)"; g.fill(); g.lineWidth = 4; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 14; g.stroke(); g.shadowBlur = 0;
    g.fillStyle = "#fff"; g.fillText(s, x + w / 2, y + h / 2);
  });
  return tex(c, renderer);
}

export function glowSprite(color) {
  const [c, g] = canvas(128, 128);
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, color); gr.addColorStop(0.35, color + "66"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
