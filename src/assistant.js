// Local, key-free Q&A engine over window.PORTFOLIO.
// Intent scoring (weighted keyword + phrase match) + entity detection
// (projects, skills) + short conversational memory for follow-ups.

const STOP = new Set("a an the is are was were be been of to in on for and or with about me tell show give what whats which who whom how does do did can could would will his he him her its it this that these those please pls i you your u ur my any some much many there here have has had get got know knows knowing".split(" "));

const SYN = {
  cv: "resume", biodata: "resume", "curriculum": "resume",
  gpa: "cgpa", grade: "cgpa", grades: "cgpa", marks: "cgpa", score: "cgpa", percentage: "cgpa", academics: "education", academic: "education",
  college: "education", university: "education", degree: "education", studying: "education", study: "education", studies: "education", btech: "education", srm: "education", school: "school",
  mail: "email", gmail: "email", "e-mail": "email", reach: "contact", phone: "phone", mobile: "phone", number: "phone", call: "phone",
  linkedin: "linkedin", github: "github", git: "github", repo: "github", repos: "github", repository: "github", code: "github", source: "github",
  internship: "experience", intern: "experience", internships: "experience", work: "experience", worked: "experience", job: "experience", jobs: "experience",
  certificate: "certification", certificates: "certification", certifications: "certification", certified: "certification", courses: "certification", nptel: "certification", udemy: "certification", cisco: "certification",
  project: "projects", built: "projects", build: "projects", made: "projects", portfolio: "projects", apps: "projects", app: "projects",
  skill: "skills", stack: "skills", technologies: "skills", tech: "skills", tools: "skills", languages: "skills", proficient: "skills", expertise: "skills",
  hire: "hire", hiring: "hire", recruit: "hire", why: "why", strengths: "strength", strength: "strength", best: "best", favourite: "best", favorite: "best", proud: "best", top: "best",
  available: "availability", availability: "availability", graduate: "availability", graduating: "availability", graduation: "availability", joining: "availability", join: "availability", open: "availability", roles: "availability", role: "availability", position: "availability", fresher: "availability", placement: "availability", placements: "availability",
  ml: "ai", ai: "ai", "machine": "ai", learning: "ai", deep: "ai", artificial: "ai", intelligence: "ai", llm: "ai", rag: "ai",
  ui: "design", ux: "design", design: "design", designer: "design", figma: "design", wireframe: "design", prototype: "design", prototyping: "design",
  hello: "hi", hey: "hi", hii: "hi", hola: "hi", yo: "hi", namaste: "hi", vanakkam: "hi",
  thanks: "thanks", thank: "thanks", thx: "thanks", cool: "thanks", great: "thanks", awesome: "thanks", nice: "thanks",
  subjects: "coursework", subject: "coursework", coursework: "coursework", course: "coursework", fundamentals: "coursework", cs: "coursework", dsa: "coursework", os: "coursework", dbms: "coursework", networks: "coursework",
  interest: "interests", interests: "interests", hobby: "interests", hobbies: "interests", exploring: "interests", passion: "interests", passionate: "interests",
  live: "demo", demo: "demo", link: "demo", links: "demo", url: "demo", website: "demo", deployed: "demo",
  located: "location", location: "location", city: "location", based: "location", live_in: "location", where: "where", relocate: "relocate", relocation: "relocate", remote: "relocate",
  yourself: "self", nova: "self", bot: "self", robot: "self", assistant: "self",
  summary: "about", about: "about", introduce: "about", intro: "about", overview: "about", profile: "about", background: "about", who: "about",
  download: "resume", pdf: "resume", resume: "resume",
  salary: "salary", ctc: "salary", package: "salary", lpa: "salary", expect: "salary", expectation: "salary"
};

function stem(w) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function normalize(text) {
  return text.toLowerCase().replace(/[’']/g, "").replace(/c\+\+/g, "cplusplus").replace(/node\.js/g, "nodejs").replace(/next\.js/g, "nextjs").replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(text) {
  const raw = normalize(text).split(" ").filter(Boolean);
  const out = [];
  for (const w of raw) {
    const s = SYN[w] || SYN[stem(w)];
    if (s) out.push(s);
    if (!STOP.has(w)) out.push(stem(w));
  }
  return out;
}

const SKILL_ALIASES = {
  "Python": ["python", "py"], "C++": ["cplusplus", "cpp"], "SQL": ["sql"], "JavaScript": ["javascript", "js"], "TypeScript": ["typescript", "ts"],
  "PyTorch": ["pytorch", "torch"], "Scikit-learn": ["scikit-learn", "scikit", "sklearn", "scikitlearn"], "Pandas": ["pandas"], "NumPy": ["numpy"],
  "Flask": ["flask"], "React": ["react", "reactjs"], "Express": ["express", "expressjs"], "Streamlit": ["streamlit"], "Tailwind CSS": ["tailwind"],
  "Git": ["git"], "GitHub": ["github"], "AWS": ["aws", "amazon web services"], "Power BI": ["power bi", "powerbi"], "Vercel": ["vercel"],
  "MySQL": ["mysql"], "MongoDB": ["mongodb", "mongo"], "NLP": ["nlp", "natural language"], "RAG": ["rag", "retrieval"],
  "Machine Learning": ["machine learning", "ml"], "Deep Learning": ["deep learning"], "Classification": ["classification"], "Regression": ["regression"], "Clustering": ["clustering"],
  "Supervised Learning": ["supervised"], "Unsupervised Learning": ["unsupervised"], "Node.js": ["nodejs", "node"], "Next.js": ["nextjs"], "Figma": ["figma"],
  "Java": ["java"], "Kotlin": ["kotlin"], "Go": ["golang"], "Rust": ["rust"], "TensorFlow": ["tensorflow", "keras"], "Docker": ["docker"], "Kubernetes": ["kubernetes", "k8s"],
  "Azure": ["azure"], "GCP": ["gcp", "google cloud"], "Angular": ["angular"], "Vue": ["vue"], "Django": ["django"], "Spring": ["spring boot", "spring"], "PHP": ["php"], "Tableau": ["tableau"], "Excel": ["excel"],
  "GitHub Actions": ["github actions", "ci/cd", "cicd"], "Three.js": ["three.js", "threejs", "webgl"], "LLMs": ["llm", "llms", "genai", "generative ai", "gpt"], "Computer Vision": ["computer vision", "opencv", "cv model"]
};

export function createAssistant(P) {
  const ctx = { lastProject: null, lastTopic: null };
  const projById = Object.fromEntries(P.projects.map(p => [p.id, p]));
  const PROJ_ALIASES = {
    "neurosy-rag": ["neurosy", "neuro", "neuro-symbolic", "neurosymbolic", "healthcare", "medical", "disease", "diagnos", "clinical", "health"],
    "resume-scanner": ["resume scanner", "scanner", "segregator", "recruitment", "shortlist", "ats", "parser", "resume pars"],
    "lang-intel": ["language intelligence", "language detect", "nlp project", "tamil", "hindi", "translation", "detector"],
    "trip-planner": ["trip", "travel", "planner", "itinerar"],
    "minifier": ["minif", "cleancode", "clean code", "symbol table", "compiler"],
    "luxe-salon": ["salon", "luxe", "landing page"],
    "clash-hub": ["clash", "royale", "deck", "game stats"]
  };

  const allSkills = new Set();
  Object.values(P.skills).forEach(a => a.forEach(s => allSkills.add(s)));

  const link = (url, label) => url ? `[[${label}|${url}]]` : "";
  const list = (arr) => arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  const edu = P.education.find(e => e.main) || P.education[0];
  const first = P.shortName;

  function findProject(q) {
    const n = normalize(q);
    for (const p of P.projects) {
      if (n.includes(normalize(p.name))) return p;
      for (const a of (PROJ_ALIASES[p.id] || [])) if (new RegExp("(^|[^a-z0-9])" + a).test(n)) return p;
    }
    return null;
  }
  function findSkills(q) {
    const n = " " + normalize(q) + " ";
    const hits = [];
    for (const [skill, al] of Object.entries(SKILL_ALIASES)) {
      for (const a of al) {
        const re = new RegExp("(^|[^a-z0-9])" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)");
        if (re.test(n)) { hits.push(skill); break; }
      }
    }
    return hits;
  }
  function skillEvidence(skill) {
    const k = skill.toLowerCase();
    const re = new RegExp("(^|[^a-z0-9])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9.]|$|\\.(\\s|$))");
    const used = P.projects.filter(p => p.stack.some(s => re.test(s.toLowerCase())) || (p.points || []).some(t => re.test(t.toLowerCase())));
    const onResume = (P.resumeSkills || []).some(s => s.toLowerCase() === k);
    const known = allSkills.has(skill) || onResume || used.length > 0;
    return { known, onResume, used };
  }

  function projectAnswer(p, focus) {
    ctx.lastProject = p; ctx.lastTopic = "project";
    const links = [p.github && link(p.github, "GitHub"), p.live && link(p.live, "Live demo")].filter(Boolean).join("  ");
    if (focus === "stack") return { text: `${p.name} is built with ${list(p.stack)}.${links ? "\n" + links : ""}`, open: p.id };
    if (focus === "link") {
      if (!p.github && !p.live) return { text: `The code for ${p.name} isn't public yet. Ask ${first} for a walkthrough: ${P.contact.email}`, open: p.id };
      return { text: `Here you go: ${links}`, open: p.id };
    }
    return {
      text: `${p.name}: ${p.subtitle}.\n${p.summary}\n\nStack: ${p.stack.join(" · ")}${links ? "\n" + links : ""}`,
      open: p.id,
      chips: [p.github ? "Show me the code" : null, "What was hard about it?", "Another project"].filter(Boolean)
    };
  }

  const INTENTS = [
    { id: "hi", kw: { hi: 3 }, solo: true, a: () => ({ text: `Hey! I'm ${P.assistant.name}. I know ${first}'s projects, skills and background. What would you like to know?`, chips: ["Quick summary", "Best project?", "Skills", "How to contact him"] }) },
    { id: "thanks", kw: { thanks: 3 }, solo: true, a: () => ({ text: `Anytime! If you'd like to talk to ${first} directly: ${P.contact.email}`, chips: ["Download resume", "Projects"] }) },
    { id: "self", kw: { self: 3, "you": 0 }, a: () => ({ text: `I'm ${P.assistant.name}, a holographic assistant ${first} built into this room. I run entirely in your browser with a local knowledge base of his resume and projects. No server, no API key. Ask away.`, chips: ["About Shivesh", "Projects"] }) },
    { id: "about", kw: { about: 3, shivesh: 1, haran: 1 }, a: () => ({ text: `${P.name} is a final-year B.Tech CSE student at SRM (${edu.score}), based in ${P.location}. He works across AI/ML, full-stack web and UI/UX. His highlight project is NeuroSy-RAG, a neuro-symbolic healthcare diagnosis platform, and he interned as a UI/UX designer in 2025.\n\nOpen to: ${list(P.openTo.roles)} (${P.openTo.gradYear} batch).`, chips: ["Best project?", "Skills", "Education", "Download resume"] }) },
    { id: "skills", kw: { skills: 3 }, a: () => ({ text: Object.entries(P.skills).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n"), open: "@skills", chips: ["AI/ML experience?", "Does he know React?", "Projects"] }) },
    { id: "ai", kw: { ai: 3, model: 1, data: 1, nlp: 2 }, a: () => ({ text: `AI/ML is ${first}'s main focus. On his resume: supervised and unsupervised learning, classification, regression and clustering with PyTorch, scikit-learn, Pandas and NumPy, plus an NPTEL Machine Learning certification.\n\nIn practice: NeuroSy-RAG (RAG + Random Forest/Decision Tree with a rule engine), Resume Scanner Segregator (NLP resume parsing + match scoring), and a TF-IDF language detector for 11 languages (English, Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, French, Spanish and German) that scored 98.9% on held-out Wikipedia sentences and runs fully in the browser.`, open: "neurosy-rag", chips: ["Tell me about NeuroSy-RAG", "Resume Scanner", "Language detector"] }) },
    { id: "design", kw: { design: 3 }, a: () => { const x = P.experience[0]; return { text: `Yes. ${first} was a UI/UX intern (${x.period}), doing wireframing and prototyping with a user-centred approach, and holds a UI/UX certification. You can see the design side in Luxe Salon, a landing page with its own palette, type pairing and a hand-drawn jasmine motif. This room is part of it too.`, open: "luxe-salon", chips: ["Show Luxe Salon", "Experience"] }; } },
    { id: "projects", kw: { projects: 3, work: 1 }, a: () => ({ text: `${first} has ${P.projects.length} projects floating in this room:\n` + P.projects.map(p => `• ${p.name}: ${p.subtitle}`).join("\n") + `\n\nTap any panel, or ask me about one.`, chips: P.projects.slice(0, 3).map(p => p.name) }) },
    { id: "best", kw: { best: 3, projects: 1, impressive: 2, flagship: 3, featured: 2 }, a: () => { const p = P.projects.find(x => x.featured) || P.projects[0]; const r = projectAnswer(p); r.text = `His flagship is ${p.name}.\n` + r.text.split("\n").slice(1).join("\n"); return r; } },
    { id: "education", kw: { education: 3, cgpa: 2 }, a: () => ({ text: `${edu.degree} at ${edu.school}. ${edu.score}, ${edu.period.toLowerCase()}.`, open: "@education", chips: ["Coursework", "Certifications"] }) },
    { id: "cgpa", kw: { cgpa: 3 }, a: () => ({ text: `${first}'s CGPA at SRM (B.Tech CSE) is ${edu.score.replace("CGPA ", "")}.`, chips: ["Education", "Skills"] }) },
    { id: "school", kw: { school: 3, "10th": 3, "12th": 3, class: 1, x: 0, xii: 2, hsc: 3, sslc: 3, board: 2 }, a: () => ({ text: `School: ${P.school.name}. Class XII ${P.school.classXII}, Class X ${P.school.classX}.`, chips: ["Education", "Projects"] }) },
    { id: "experience", kw: { experience: 3 }, a: () => { const x = P.experience[0]; const co = x.company && x.company !== "TODO" ? ` at ${x.company}` : ""; return { text: `${x.role}${co}, ${x.period}.\n` + x.points.map(t => "• " + t).join("\n") + `\n\nOutside the internship he's shipped ${P.projects.length} projects, from ML pipelines to deployed full-stack apps.`, chips: ["Projects", "UI/UX work"] }; } },
    { id: "cert", kw: { certification: 3 }, a: () => ({ text: "Certifications:\n" + P.certifications.map(c => `• ${c.name}${c.issuer && c.issuer !== "TODO" ? " (" + c.issuer + ")" : ""}`).join("\n"), open: "@certs", chips: ["Skills", "Education"] }) },
    { id: "coursework", kw: { coursework: 3 }, a: () => ({ text: `Core CS in his B.Tech: ${list(P.coursework)}.`, chips: ["Skills", "Projects"] }) },
    { id: "interests", kw: { interests: 3 }, a: () => ({ text: `Right now ${first} is exploring ${list(P.interests)}.`, chips: ["Projects", "AI/ML experience?"] }) },
    { id: "contact", kw: { contact: 3, email: 3, phone: 3, linkedin: 3, github: 1, connect: 2, touch: 2 }, a: () => ({ text: `Email: ${P.contact.email}\nPhone: ${P.contact.phone}\n${link(P.contact.linkedin, "LinkedIn")}  ${link(P.contact.github, "GitHub")}`, chips: ["Download resume", "Availability"] }) },
    { id: "githubacct", kw: { github: 3 }, a: () => ({ text: `His GitHub is ${link(P.contact.github, "github.com/" + P.github.user)}. Every project panel here links straight to its repo.`, chips: ["Projects"] }) },
    { id: "resume", kw: { resume: 3 }, a: () => ({ text: `Here's his resume: ${link(P.contact.resumePdf, "Download PDF")}. Or tap "Quick view" for a one-page summary.`, chips: ["Quick summary", "Contact"] }) },
    { id: "availability", kw: { availability: 3, hire: 1 }, a: () => ({ text: `${P.openTo.note}\nRoles he's looking for: ${list(P.openTo.roles)}.\nBest way to reach him: ${P.contact.email}`, chips: ["Why hire him?", "Download resume"] }) },
    { id: "hire", kw: { hire: 2, why: 2, strength: 3, should: 1, stand: 1 }, a: () => ({ text: `A few reasons:\n• He ships real systems. NeuroSy-RAG combines ML, rules and retrieval to keep a healthcare AI grounded.\n• He covers the stack: models in Python, APIs in Flask/Express, front ends in React, deployed on Vercel and GitHub Pages.\n• He has design sense from his UI/UX internship and certification, so what he builds is usable.\n• Strong academics: ${edu.score} in B.Tech CSE at SRM.`, chips: ["Best project?", "Contact"] }) },
    { id: "location", kw: { location: 3, where: 1 }, a: () => ({ text: `${first} is based in ${P.location}.`, chips: ["Availability", "Contact"] }) },
    { id: "relocate", kw: { relocate: 3 }, a: () => ({ text: `I don't have his relocation or remote preferences on record. Ask him directly at ${P.contact.email} and he'll answer quickly.`, chips: ["Availability"] }) },
    { id: "salary", kw: { salary: 3 }, a: () => ({ text: `That's one for ${first} to discuss directly: ${P.contact.email}.`, chips: ["Availability"] }) },
    { id: "demo", kw: { demo: 2 }, a: () => { if (ctx.lastProject) return projectAnswer(ctx.lastProject, "link"); const live = P.projects.filter(p => p.live); return { text: "Live demos:\n" + live.map(p => `• ${p.name}: ${link(p.live, p.live.replace(/^https?:\/\//, "").replace(/\/$/, ""))}`).join("\n") }; } },
    { id: "hard", kw: { hard: 3, challenge: 3, challenging: 3, difficult: 3, learn: 2, learned: 2, problem: 1 }, a: () => { const p = ctx.lastProject || P.projects[0]; ctx.lastProject = p; return { text: `For ${p.name}, the core idea was: ${p.points[1] || p.points[0]}\nFor the full story of the hardest parts, ${first} is the best person to ask. It makes a great interview conversation.`, open: p.id, chips: ["Show me the code", "Another project"] }; } },
    { id: "another", kw: { another: 3, other: 2, next: 2, more: 1, else: 2 }, a: () => { const i = ctx.lastProject ? P.projects.indexOf(ctx.lastProject) : -1; return projectAnswer(P.projects[(i + 1) % P.projects.length]); } }
  ];

  const df = {};
  INTENTS.forEach(it => Object.keys(it.kw).forEach(k => df[k] = (df[k] || 0) + 1));

  function score(toks) {
    let best = null, bestS = 0;
    for (const it of INTENTS) {
      let s = 0;
      for (const t of toks) if (it.kw[t]) s += it.kw[t] * (1 + 1 / (df[t] || 1));
      if (it.solo && toks.length > 3) s *= 0.4;
      if (s > bestS) { bestS = s; best = it; }
    }
    return { best, bestS };
  }

  function answer(q) {
    const raw = q.trim();
    if (!raw) return { text: "Ask me anything about " + first + "." };
    const n = normalize(raw);
    const toks = tokens(raw);
    const proj = findProject(raw);
    const skills = findSkills(raw);
    const { best, bestS } = score(toks);

    const I = id => INTENTS.find(i => i.id === id).a();
    if (/\b(who are you|what are you|are you (a |an )?(bot|ai|real|human|robot)|your name)\b/.test(n)) return I("self");
    if (/\b(quick summary|summary|summarize|tldr|tl dr)\b/.test(n)) return I("about");
    if (/\b(hard|challeng|difficult|learn|learned|toughest)/.test(n) && (ctx.lastProject || findProject(raw))) { if (findProject(raw)) ctx.lastProject = findProject(raw); return I("hard"); }
    if (/\b(demos|all (the )?links|live (projects|sites|links)|deployed)\b/.test(n)) { ctx.lastProject = null; return I("demo"); }
    if (/\b(10th|12th|class x|class xii|sslc|hsc|school)\b/.test(n)) return I("school");

    if (proj && !/\b(all|list)\b/.test(n)) {
      const focus = /\b(stack|tech|built with|technolog|framework|language)\b/.test(n) ? "stack" : /\b(github|code|repo|link|live|demo|url|source)\b/.test(n) ? "link" : null;
      if (best && best.id === "hard") return best.a();
      return projectAnswer(proj, focus);
    }

    const askingSkill = skills.length && (/\b(know|knows|use|used|experience|familiar|work with|worked with|skilled|good at|proficient|can he|does he|has he|any)\b/.test(n) || toks.length <= 3);
    if (askingSkill && !(best && ["ai", "design"].includes(best.id) && skills.every(s => ["Machine Learning", "Deep Learning", "NLP", "RAG", "Figma"].includes(s)))) {
      const parts = skills.map(s => {
        const ev = skillEvidence(s);
        if (!ev.known) return `${s}: not on his resume or in his public projects. He's quick to pick up new tools, so ask him directly.`;
        const where = ev.used.map(p => p.name);
        return `${s}: yes${ev.onResume ? ", listed on his resume" : ""}${where.length ? (ev.onResume ? ", and" : ",") + " used in " + list(where.slice(0, 3)) : ""}.`;
      });
      const firstUsed = skills.map(skillEvidence).find(e => e.used.length);
      if (firstUsed) ctx.lastProject = firstUsed.used[0];
      return { text: parts.join("\n"), open: firstUsed ? firstUsed.used[0].id : null, chips: ["All skills", "Projects"] };
    }

    // follow-ups that refer to the last project
    if (ctx.lastProject && /\b(it|that|this|the project)\b/.test(n)) {
      if (/\b(stack|tech|built|technolog)\b/.test(n)) return projectAnswer(ctx.lastProject, "stack");
      if (/\b(github|code|repo|link|live|demo|source)\b/.test(n)) return projectAnswer(ctx.lastProject, "link");
    }
    if (/\b(show me the code|the code|source code)\b/.test(n) && ctx.lastProject) return projectAnswer(ctx.lastProject, "link");

    if (best && bestS >= 2.5) return best.a();
    if (skills.length) {
      const ev = skillEvidence(skills[0]);
      return { text: ev.known ? `${skills[0]} is part of ${first}'s toolkit${ev.used.length ? ", used in " + list(ev.used.map(p => p.name).slice(0, 3)) : ""}.` : `${skills[0]} isn't on his resume. His core stack is Python, ML (PyTorch, scikit-learn), React and SQL.`, chips: ["All skills"] };
    }
    if (best && bestS >= 1.5) return best.a();
    return {
      text: `I'm not sure about that one. I only know what's on ${first}'s resume and in his projects. Try one of these:`,
      chips: ["Quick summary", "Best project?", "Skills", "Education", "How to contact him"]
    };
  }

  return { answer, ctx };
}
