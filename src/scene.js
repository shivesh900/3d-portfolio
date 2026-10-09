import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as TX from "./textures.js";

export function createRoom(container, P, opts) {
  const isMobile = matchMedia("(pointer: coarse)").matches || Math.min(innerWidth, innerHeight) < 600;
  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile || devicePixelRatio < 2, powerPreference: "high-performance" });
  let pr = Math.min(devicePixelRatio, isMobile ? 1.6 : 1.75);
  renderer.setPixelRatio(pr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#060818");
  scene.fog = new THREE.Fog("#060818", 12, 26);

  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 60);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
  controls.minDistance = 3.2; controls.maxDistance = 11;
  controls.minPolarAngle = 0.55; controls.maxPolarAngle = 1.62;
  controls.minAzimuthAngle = -0.95; controls.maxAzimuthAngle = 0.95;
  controls.rotateSpeed = isMobile ? 0.55 : 0.7; controls.zoomSpeed = 0.8;
  controls.target.set(0, 1.7, -1.2);

  const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.1, flatShading: true, ...o });
  const E = (color, intensity = 2) => new THREE.MeshStandardMaterial({ color: "#000", emissive: color, emissiveIntensity: intensity, roughness: 1 });
  const box = (w, h, d, mat, x, y, z, parent = scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m; };
  const interactive = [];
  const anchors = [];
  const updaters = [];

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight("#5a6cff", "#1a0b2e", 0.9));
  const key = new THREE.PointLight("#22e3ff", 30, 14, 2); key.position.set(-2.5, 4.2, 1.5); scene.add(key);
  const fill = new THREE.PointLight("#ff4fd8", 22, 12, 2); fill.position.set(3.5, 3.5, -1); scene.add(fill);
  const deskLight = new THREE.PointLight("#ffd9a0", 8, 4, 2); deskLight.position.set(-1.3, 1.8, -3.4); scene.add(deskLight);
  const monitorGlow = new THREE.PointLight("#5ab4ff", 10, 4, 2); monitorGlow.position.set(0, 1.5, -3.0); scene.add(monitorGlow);

  // ---------- room shell ----------
  const floorMat = M("#0d1030", { roughness: 0.55, metalness: 0.3 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 13), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 1.5); scene.add(floor);
  const grid = new THREE.GridHelper(12, 24, "#2b3cff", "#1b2260"); grid.position.set(0, 0.003, 1.5); grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid);
  const wallMat = M("#111536");
  const back = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat); back.position.set(0, 3, -5); scene.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(13, 6), wallMat); left.rotation.y = Math.PI / 2; left.position.set(-6, 3, 1.5); scene.add(left);
  const right = new THREE.Mesh(new THREE.PlaneGeometry(13, 6), wallMat); right.rotation.y = -Math.PI / 2; right.position.set(6, 3, 1.5); scene.add(right);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(12, 13), M("#0b0e2a")); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 6, 1.5); scene.add(ceil);
  for (const x of [-3, 0, 3]) box(0.06, 0.03, 9, E("#8a5cff", 1.6), x, 5.97, 0);
  // neon trims
  const cyan = E("#22e3ff", 3), pink = E("#ff4fd8", 3), violet = E("#8a5cff", 2.5);
  box(12, 0.04, 0.04, cyan, 0, 0.03, -4.97); box(0.04, 0.04, 13, pink, -5.97, 0.03, 1.5); box(0.04, 0.04, 13, pink, 5.97, 0.03, 1.5);
  box(12, 0.05, 0.05, violet, 0, 5.5, -4.95);

  // ---------- desk ----------
  const deskMat = M("#232a52"), legMat = M("#151a38", { metalness: 0.6, roughness: 0.4 });
  box(3.6, 0.08, 1.15, deskMat, 0, 0.95, -3.85);
  box(3.6, 0.03, 0.02, cyan, 0, 0.95, -3.27);
  for (const x of [-1.7, 1.7]) box(0.08, 0.95, 1.05, legMat, x, 0.475, -3.85);
  // monitors
  const screens = [];
  const monitor = (w, h, x, y, z, ry, texture, kind) => {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g);
    box(w + 0.08, h + 0.08, 0.05, M("#0a0c1c", { metalness: 0.5 }), 0, 0, -0.03, g);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
    s.position.z = 0.002; g.add(s); s.userData = { kind }; interactive.push(s); screens.push(s);
    box(0.06, y - 1.0, 0.06, legMat, 0, -(y - 1.0) / 2 - h / 2 + 0.05, -0.08, g);
    return g;
  };
  monitor(1.5, 0.86, 0, 1.62, -4.12, 0, TX.codeScreen(renderer), "about");
  monitor(1.05, 0.82, -1.38, 1.58, -3.95, 0.42, TX.terminalScreen(P, renderer), "about");
  monitor(1.05, 0.82, 1.38, 1.58, -3.95, -0.42, TX.statsScreen(P, renderer), "skills");
  const aboutAnchor = { pos: new THREE.Vector3(-1.38, 2.12, -3.9), label: "About me", kind: "about" }; anchors.push(aboutAnchor);
  // keyboard, mouse, mug
  box(0.9, 0.03, 0.28, M("#1a1f40"), 0, 1.005, -3.55);
  box(0.86, 0.005, 0.24, E("#8a5cff", 0.6), 0, 1.022, -3.55);
  box(0.09, 0.03, 0.14, M("#1a1f40"), 0.62, 1.005, -3.55);
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.15, 10), M("#ff4fd8")); mug.position.set(1.05, 1.07, -3.5); scene.add(mug);
  // lamp
  const lamp = new THREE.Group(); lamp.position.set(-1.45, 0.99, -3.6); scene.add(lamp);
  box(0.22, 0.03, 0.22, legMat, 0, 0.015, 0, lamp); box(0.03, 0.55, 0.03, legMat, 0, 0.3, 0, lamp);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.16, 8, 1, true), M("#ffcf7a", { side: THREE.DoubleSide, emissive: "#ffb347", emissiveIntensity: 0.6 })); shade.position.set(0.08, 0.6, 0); shade.rotation.z = -0.5; lamp.add(shade);
  // books on desk
  ["#22e3ff", "#ff4fd8", "#ffe27a"].forEach((c, i) => box(0.06, 0.26, 0.2, M(c), -1.05 + i * 0.07, 1.12, -4.1));
  // chair
  const chair = new THREE.Group(); chair.position.set(0.1, 0, -2.55); chair.rotation.y = 0.25; scene.add(chair);
  const chairMat = M("#2b1d52");
  box(0.62, 0.08, 0.58, chairMat, 0, 0.55, 0, chair); box(0.62, 0.72, 0.08, chairMat, 0, 0.98, 0.28, chair);
  box(0.04, 0.5, 0.04, legMat, 0, 0.27, 0, chair);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; box(0.3, 0.03, 0.04, legMat, Math.cos(a) * 0.15, 0.04, Math.sin(a) * 0.15, chair).rotation.y = -a; }
  box(0.62, 0.02, 0.02, cyan, 0, 1.34, 0.32, chair);

  // ---------- neon sign + window ----------
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: TX.neonText("SHIVESH.dev", "#22e3ff", renderer, 1024, 256, 124), transparent: true, toneMapped: false, depthWrite: false }));
  sign.position.set(0, 4.2, -4.96); scene.add(sign);
  const sub = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.35), new THREE.MeshBasicMaterial({ map: TX.neonText(`OPEN TO ROLES · ${P.openTo.gradYear}`, "#ff4fd8", renderer, 1024, 128, 72), transparent: true, toneMapped: false, depthWrite: false }));
  sub.position.set(0, 4.85, -4.96); scene.add(sub);
  const win = new THREE.Group(); win.position.set(-3.6, 2.6, -4.97); scene.add(win);
  const wpane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.5), new THREE.MeshBasicMaterial({ map: TX.skylineTexture(renderer), toneMapped: false })); wpane.position.z = 0.01; win.add(wpane);
  box(2.1, 0.06, 0.06, M("#2a3166"), 0, 0.78, 0.03, win); box(2.1, 0.06, 0.06, M("#2a3166"), 0, -0.78, 0.03, win);
  box(0.06, 1.6, 0.06, M("#2a3166"), -1.03, 0, 0.03, win); box(0.06, 1.6, 0.06, M("#2a3166"), 1.03, 0, 0.03, win); box(0.04, 1.5, 0.04, M("#2a3166"), 0, 0, 0.03, win);

  // ---------- tech stack wall (back wall right) ----------
  const stack = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.58), new THREE.MeshBasicMaterial({ map: TX.stackWallTexture(P, renderer), transparent: true, toneMapped: false }));
  stack.position.set(5.96, 2.2, -3.75); stack.rotation.y = -Math.PI / 2; stack.userData = { kind: "skills" }; scene.add(stack); interactive.push(stack);
  anchors.push({ pos: new THREE.Vector3(5.85, 3.15, -3.75), label: "Skills", kind: "skills" });

  // ---------- shelf + certifications (left wall) ----------
  const shelf = new THREE.Group(); shelf.position.set(-5.75, 0, -1.2); shelf.rotation.y = Math.PI / 2; scene.add(shelf);
  const woodMat = M("#2a2f5e");
  for (const y of [0.9, 1.6, 2.3]) { box(2.6, 0.06, 0.42, woodMat, 0, y, 0, shelf); box(2.6, 0.015, 0.015, violet, 0, y + 0.035, 0.21, shelf); }
  box(0.06, 1.6, 0.42, woodMat, -1.3, 1.62, 0, shelf); box(0.06, 1.6, 0.42, woodMat, 1.3, 1.62, 0, shelf);
  const bookCols = ["#22e3ff", "#ff4fd8", "#8a5cff", "#3cffb0", "#ffe27a", "#5aa9ff", "#ff7a59"];
  let bx = -1.15; for (let i = 0; i < 12; i++) { const h = 0.32 + (i * 37 % 10) / 50; const b = box(0.08, h, 0.28, M(bookCols[i % 7]), bx, 0.93 + h / 2, 0, shelf); if (i === 11) b.rotation.z = 0.3; bx += 0.1; }
  box(0.5, 0.36, 0.3, M("#1b2050"), 0.85, 1.11, 0, shelf);
  const certColors = ["#22e3ff", "#ff4fd8", "#3cffb0", "#ffe27a"];
  P.certifications.slice(0, 4).forEach((cert, i) => {
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshBasicMaterial({ map: TX.plaqueTexture(cert, certColors[i], renderer), toneMapped: false }));
    pl.position.set(-0.9 + i * 0.6, 1.92, 0.05); pl.rotation.x = -0.1; pl.userData = { kind: "certs" }; shelf.add(pl); interactive.push(pl);
  });
  // trophy-ish ornament + plant on top shelf
  const orn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), M("#ffe27a", { metalness: 0.8, roughness: 0.25 })); orn.position.set(-0.8, 2.52, 0); shelf.add(orn); updaters.push(t => orn.rotation.y = t * 0.6);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 8), M("#3a2a66")); pot.position.set(0.7, 2.44, 0); shelf.add(pot);
  for (let i = 0; i < 6; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.4, 4), M("#2fd38a")); leaf.position.set(0.7 + Math.cos(i) * 0.05, 2.7, Math.sin(i) * 0.05); leaf.rotation.set(Math.sin(i * 2) * 0.5, 0, Math.cos(i * 2) * 0.5); shelf.add(leaf); }
  anchors.push({ pos: new THREE.Vector3(-5.6, 2.55, -1.2), label: "Certifications", kind: "certs" });

  // ---------- education board (right wall) ----------
  const board = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.56), new THREE.MeshBasicMaterial({ map: TX.boardTexture(P, renderer), toneMapped: false }));
  board.position.set(5.95, 2.3, -1.15); board.rotation.y = -Math.PI / 2; board.userData = { kind: "education" }; scene.add(board); interactive.push(board);
  anchors.push({ pos: new THREE.Vector3(5.8, 3.25, -1.15), label: "Education", kind: "education" });

  // big floor plant
  const fpot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 8), M("#2b1d52")); fpot.position.set(-2.6, 0.25, -4.3); scene.add(fpot);
  for (let i = 0; i < 9; i++) { const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), M(i % 2 ? "#2fd38a" : "#1fae74")); leaf.position.set(-2.6 + Math.cos(i * 1.7) * 0.22, 0.75 + i * 0.09, -4.3 + Math.sin(i * 1.7) * 0.22); leaf.scale.set(1, 1.6, 0.6); leaf.rotation.y = i; scene.add(leaf); }

  // ---------- hologram assistant ----------
  const holo = new THREE.Group(); holo.position.set(3.2, 0, 0.6); scene.add(holo);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.16, 16), M("#1a1f40", { metalness: 0.7, roughness: 0.3 })); base.position.y = 0.08; holo.add(base);
  const ring0 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.02, 6, 40), E("#22e3ff", 4)); ring0.rotation.x = Math.PI / 2; ring0.position.y = 0.17; holo.add(ring0);
  const beamMat = new THREE.MeshBasicMaterial({ color: "#22e3ff", transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 1.6, 20, 1, true), beamMat); beam.position.y = 0.95; holo.add(beam);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), new THREE.MeshStandardMaterial({ color: "#0a2a3a", emissive: "#22e3ff", emissiveIntensity: 1.8, flatShading: true, roughness: 0.3 }));
  core.position.y = 1.75; holo.add(core);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 1), new THREE.MeshBasicMaterial({ color: "#7ff4ff", wireframe: true, transparent: true, opacity: 0.45, toneMapped: false })); shell.position.y = 1.75; holo.add(shell);
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 6, 60), E("#ff4fd8", 3)); r1.position.y = 1.75; holo.add(r1);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.01, 6, 60), E("#8a5cff", 3)); r2.position.y = 1.75; holo.add(r2);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: TX.glowSprite("#22e3ff"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 })); glow.scale.set(2.2, 2.2, 1); glow.position.y = 1.75; holo.add(glow);
  // eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false });
  const eyes = new THREE.Group(); eyes.position.set(0, 1.8, 0.27); holo.add(eyes);
  for (const x of [-0.08, 0.08]) { const e = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.05, 2, 6), eyeMat); e.position.x = x; eyes.add(e); }
  // particles
  const pc = 60, pg = new THREE.BufferGeometry(), pp = new Float32Array(pc * 3), seeds = [];
  for (let i = 0; i < pc; i++) { seeds.push([Math.random() * 6.28, 0.3 + Math.random() * 0.35, Math.random()]); }
  pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
  const parts = new THREE.Points(pg, new THREE.PointsMaterial({ color: "#7ff4ff", size: 0.035, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })); holo.add(parts);
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.5; hit.userData = { kind: "assistant" }; holo.add(hit); interactive.push(hit);
  const holoAnchor = { pos: new THREE.Vector3(3.2, 2.75, 0.6), label: `Ask ${P.assistant.name}`, kind: "assistant", accent: true }; anchors.push(holoAnchor);
  let speaking = 0;
  updaters.push((t, dt) => {
    const s = speaking > 0 ? 1 + Math.sin(t * 18) * 0.06 : 1 + Math.sin(t * 2) * 0.03;
    core.scale.setScalar(s); core.rotation.y += dt * 0.6; core.rotation.x += dt * 0.25;
    shell.rotation.y -= dt * 0.3; shell.rotation.z += dt * 0.15;
    const bob = Math.sin(t * 1.4) * 0.06; [core, shell, r1, r2, glow].forEach(o => o.position.y = 1.75 + bob); eyes.position.y = 1.8 + bob;
    r1.rotation.set(Math.PI / 2 + Math.sin(t * 0.8) * 0.35, Math.cos(t * 0.6) * 0.3, 0); r2.rotation.set(Math.PI / 2 + Math.cos(t * 0.7) * 0.45, 0, Math.sin(t * 0.5) * 0.4);
    core.material.emissiveIntensity = speaking > 0 ? 2.6 + Math.sin(t * 20) * 0.6 : 1.8;
    glow.material.opacity = speaking > 0 ? 1 : 0.75; beamMat.opacity = 0.08 + Math.sin(t * 3) * 0.03 + (speaking > 0 ? 0.06 : 0);
    // blink
    const blink = (t % 4) < 0.12 ? 0.15 : 1; eyes.scale.y = blink;
    for (let i = 0; i < pc; i++) { const [a, r, o] = seeds[i]; const ph = (t * 0.25 + o) % 1; pp[i * 3] = Math.cos(a + t * 0.5) * r * (1 - ph * 0.4); pp[i * 3 + 1] = 0.2 + ph * 2.2; pp[i * 3 + 2] = Math.sin(a + t * 0.5) * r * (1 - ph * 0.4); }
    pg.attributes.position.needsUpdate = true;
    if (speaking > 0) speaking -= dt;
  });

  // ---------- floating project panels ----------
  const panels = [];
  const panelGeo = new THREE.PlaneGeometry(1.22, 0.76);
  P.projects.forEach((p, i) => {
    const g = new THREE.Group(); scene.add(g);
    const mat = new THREE.MeshBasicMaterial({ map: TX.panelTexture(p, renderer), transparent: true, opacity: 0.95, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
    const mesh = new THREE.Mesh(panelGeo, mat); mesh.userData = { kind: "project", id: p.id }; g.add(mesh); interactive.push(mesh);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(panelGeo), new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.9, toneMapped: false })); edge.scale.setScalar(1.02); g.add(edge);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TX.glowSprite(p.color), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.22 })); halo.scale.set(2.0, 1.4, 1); halo.position.z = -0.05; g.add(halo);
    panels.push({ g, mesh, halo, p, i, hover: 0, focus: 0, base: new THREE.Vector3() });
  });
  anchors.push({ pos: new THREE.Vector3(0, 3.6, -1.0), label: "Projects · tap a panel", kind: "projects", ref: "projects" });

  function layoutPanels(aspect) {
    const n = panels.length;
    if (aspect < 0.9) {
      const rows = [panels.slice(0, 4), panels.slice(4)];
      rows.forEach((row, r) => row.forEach((pn, j) => {
        const x = (j - (row.length - 1) / 2) * 1.3;
        pn.base.set(x, r === 0 ? 3.42 : 2.6, -0.8);
      }));
      anchors.find(a => a.kind === "projects").pos.set(0, 4.08, -0.8);
    } else {
      panels.forEach((pn, j) => {
        const x = (j - (n - 1) / 2) * 1.42;
        pn.base.set(x, 2.95 + (j % 2 ? 0.2 : -0.06), -0.9 - 0.025 * x * x);
      });
      anchors.find(a => a.kind === "projects").pos.set(0, 3.72, -0.75);
    }
  }

  // ---------- camera framing ----------
  const camGoal = new THREE.Vector3();
  function frame() {
    const w = container.clientWidth, h = container.clientHeight, aspect = w / h;
    camera.aspect = aspect;
    if (aspect < 0.9) { camera.fov = 62; camGoal.set(0, 3.5, 8.7); controls.target.set(0, 2.55, -1.2); holo.position.set(1.45, 0, 1.3); sign.position.y = 4.62; sub.position.y = 5.12; aboutAnchor.pos.set(-0.75, 1.25, -3.2); }
    else { camera.fov = 48; camGoal.set(0, 2.45, 6.4); controls.target.set(0, 2.15, -1.4); holo.position.set(3.1, 0, 0.9); sign.position.y = 4.2; sub.position.y = 4.85; aboutAnchor.pos.set(-1.38, 2.12, -3.9); }
    holoAnchor.pos.set(holo.position.x, 2.75, holo.position.z);
    camera.updateProjectionMatrix();
    layoutPanels(aspect);
    renderer.setSize(w, h);
    if (composer) composer.setSize(w, h);
  }

  // ---------- picking ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null, downAt = null;
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(interactive, false);
    return hits.length ? hits[0].object : null;
  }
  renderer.domElement.addEventListener("pointerdown", e => { downAt = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  renderer.domElement.addEventListener("pointerup", e => {
    if (!downAt) return; const d = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y); downAt = null;
    if (d > 8) return;
    const o = pick(e); if (!o) return;
    const u = o.userData; if (u.kind === "project") focusPanel(u.id);
    opts.onSelect && opts.onSelect(u);
  });
  renderer.domElement.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const o = pick(e); hovered = o; renderer.domElement.style.cursor = o ? "pointer" : "grab";
  });

  let focused = null;
  function focusPanel(id) { focused = id; setTimeout(() => { if (focused === id) focused = null; }, 1600); }

  // ---------- labels (HTML) ----------
  const labelLayer = opts.labelLayer;
  anchors.forEach(a => {
    const el = document.createElement("button"); el.className = "hotspot" + (a.accent ? " accent" : ""); el.type = "button";
    el.innerHTML = `<span class="dot"></span><span class="txt">${a.label}</span>`;
    el.addEventListener("click", () => opts.onSelect && opts.onSelect({ kind: a.kind }));
    labelLayer.appendChild(el); a.el = el;
  });
  const v = new THREE.Vector3();
  function updateLabels() {
    const w = container.clientWidth, h = container.clientHeight;
    for (const a of anchors) {
      v.copy(a.pos).project(camera);
      const vis = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      a.el.style.opacity = vis ? "1" : "0"; a.el.style.pointerEvents = vis ? "auto" : "none";
      const half = (a.el.offsetWidth || 120) / 2 + 6;
      const sx = Math.min(w - half, Math.max(half, (v.x * 0.5 + 0.5) * w));
      a.el.style.transform = `translate(-50%,-50%) translate(${sx}px, ${(-v.y * 0.5 + 0.5) * h}px)`;
    }
  }

  // ---------- optional bloom (capable devices only) ----------
  let composer = null;
  async function enableBloom() {
    try {
      const { setupBloom } = await import("./bloom.js");
      composer = setupBloom(renderer, scene, camera, container.clientWidth, container.clientHeight);
    } catch (e) { console.warn("bloom unavailable", e); }
  }
  if (!isMobile && !opts.lowPower) enableBloom();

  // ---------- loop ----------
  const clock = new THREE.Clock(); let running = true, introT = 0, frames = 0, fpsT = 0, degraded = false;
  const introFrom = new THREE.Vector3(0, 6.5, 13);
  frame();
  camera.position.copy(introFrom);
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (introT < 1) { introT = Math.min(1, introT + dt / 2.2); const k = 1 - Math.pow(1 - introT, 3); camera.position.lerpVectors(introFrom, camGoal, k); }
    controls.update();
    for (const u of updaters) u(t, dt);
    for (const pn of panels) {
      const isH = hovered === pn.mesh, isF = focused === pn.p.id;
      pn.hover += ((isH || isF ? 1 : 0) - pn.hover) * Math.min(1, dt * 8);
      pn.g.position.set(pn.base.x, pn.base.y + Math.sin(t * 1.1 + pn.i * 0.9) * 0.06, pn.base.z + pn.hover * 0.25);
      pn.g.lookAt(camera.position.x * 0.35 + pn.base.x * 0.65, pn.g.position.y - 0.2, camera.position.z);
      pn.g.scale.setScalar(1 + pn.hover * 0.1);
      pn.halo.material.opacity = 0.18 + pn.hover * 0.35 + Math.sin(t * 2 + pn.i) * 0.04;
    }
    shell.material.opacity = 0.35 + (hovered === hit ? 0.35 : 0);
    if (composer) composer.render(); else renderer.render(scene, camera);
    updateLabels();
    // adaptive quality: if the first seconds run slow, drop resolution and bloom
    frames++; fpsT += dt;
    if (!degraded && t > 1.5 && fpsT > 2) {
      const fps = frames / fpsT; frames = 0; fpsT = 0;
      if (fps < 38) { degraded = true; composer = null; pr = Math.max(1, pr * 0.7); renderer.setPixelRatio(pr); frame(); }
    }
  }
  tick();
  addEventListener("resize", frame);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { running = false; } else if (!running && !paused) { running = true; clock.getDelta(); tick(); } });
  let paused = false;

  function screenOf(id) { const pn = panels.find(x => x.p.id === id); if (!pn) return null; v.copy(pn.g.position).project(camera); return { x: (v.x * 0.5 + 0.5) * container.clientWidth, y: (-v.y * 0.5 + 0.5) * container.clientHeight }; }
  return {
    renderer, screenOf,
    speak(seconds) { speaking = Math.max(speaking, seconds); },
    pause(p) { paused = p; if (p) running = false; else if (!running) { running = true; clock.getDelta(); tick(); } },
    focusPanel
  };
}
