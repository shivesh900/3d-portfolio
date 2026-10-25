/* =====================================================================
   PORTFOLIO DATA: the single file to edit.
   Everything on the site and everything the holographic assistant says
   comes from this object. Fields marked TODO are unknown and stay
   hidden on the page until filled in.
   ===================================================================== */
window.PORTFOLIO = {
  name: "Shivesh Haran P",
  shortName: "Shivesh",
  title: "AI/ML Developer · Full-Stack · UI/UX",
  tagline: "Final-year CSE student building AI systems that people can actually use.",
  location: "Chennai, India",
  openTo: {
    banner: "Open to roles · Campus hiring 2027",
    roles: ["AI/ML Engineer", "Software Development Engineer", "UI/UX Designer"],
    gradYear: 2027,
    note: "Final-year B.Tech CSE student at SRM, available through campus placements for the 2027 batch."
  },
  summary:
    "Enthusiastic and hardworking Computer Science student with a passion for software development, web technologies, and AI-based solutions. Experienced in building academic and personal projects using modern tools and technologies, with strong problem-solving, analytical, and teamwork skills. Eager to contribute to innovative projects while continuously learning and growing in the tech field.",

  contact: {
    email: "shiveshharan900@gmail.com",
    phone: "+91 93447 71020",            // as printed on his circulated resume
    github: "https://github.com/shivesh900",
    linkedin: "https://www.linkedin.com/in/shiveshharan/",
    oldPortfolio: "https://shivesh900.github.io/portfolio/",
    resumePdf: "assets/Shivesh_Haran_P_Resume.pdf"
  },

  education: [
    {
      main: true,
      school: "SRM Institute of Science and Technology, Kattankulathur (KTR), Chennai",
      degree: "B.Tech, Computer Science and Engineering",
      score: "CGPA 8.45",
      period: "Graduating 2027",
      startYear: "TODO"                  // not on resume
    }
  ],
  // Shown as small plain text under the B.Tech entry (his call: marks shown, not highlighted).
  school: { name: "St. Marks Matriculation Higher Secondary School, Chennai", classXII: "75%", classX: "100%" },

  experience: [
    {
      role: "UI/UX Intern",
      company: "TODO",                   // company is not named on the resume
      period: "May 2025 – Jul 2025",
      points: [
        "Wireframing and prototyping with a user-centred design focus.",
        "Designed clean, engaging interfaces.",
        "Picked things up quickly, with creativity and attention to detail."
      ]
    }
  ],

  skills: {
    "Languages": ["Python", "C++", "SQL", "JavaScript", "TypeScript", "C#"],
    "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Classification", "Regression", "Clustering", "NLP", "RAG"],
    "Libraries & Frameworks": ["PyTorch", "Scikit-learn", "Pandas", "NumPy", "FastAPI", "Flask", "React", "Express", "Streamlit", "Tailwind CSS"],
    "Tools & Platforms": ["Git", "GitHub", "Docker", "FFmpeg", "Unity", "Firebase", "AWS", "Power BI", "Vercel"],
    "Databases": ["MySQL", "MongoDB"]
  },
  // Where each skill shows up in real work (used by the assistant as evidence).
  // Resume-listed skills come first; the rest are seen in his public repos.
  resumeSkills: ["Python", "C++", "SQL", "Supervised Learning", "Unsupervised Learning", "Classification", "Regression", "Clustering", "Pandas", "NumPy", "Scikit-learn", "PyTorch", "Git", "GitHub", "AWS", "Power BI", "MySQL", "MongoDB"],
  // Self-rated focus areas for the skills radar (relative emphasis, not a test score).
  radar: [
    { label: "AI / ML", value: 0.9 },
    { label: "Python", value: 0.9 },
    { label: "Web / Full-stack", value: 0.75 },
    { label: "UI / UX", value: 0.8 },
    { label: "Data & SQL", value: 0.75 },
    { label: "DSA / C++", value: 0.7 }
  ],

  coursework: [
    "Data Structures & Algorithms", "Object-Oriented Programming", "Operating Systems",
    "Database Management Systems", "Computer Networks", "Compiler Design",
    "Artificial Intelligence", "Machine Learning"
  ],
  interests: ["Retrieval-augmented generation (RAG)", "Neuro-symbolic AI", "NLP", "Applied ML for healthcare", "UI/UX & interaction design", "3D on the web"],

  certifications: [
    { name: "Machine Learning", issuer: "NPTEL" },
    { name: "UI/UX", issuer: "TODO" },
    { name: "Networking Basics", issuer: "Cisco" },
    { name: "Python 300+ Exercises (Simple, Intermediate & Complex)", issuer: "Udemy" }
  ],

  // One floating holographic panel per project.
  // To update a link, change github/live here. null hides the button.
  projects: [
    {
      id: "neurosy-rag",
      name: "NeuroSy-RAG",
      subtitle: "Hybrid Neuro-Symbolic Healthcare Platform",
      period: "Jan 2026 – Mar 2026",
      category: "AI / ML",
      featured: true,
      color: "#22e3ff",
      summary: "A diagnostic pipeline that pairs ML predictions with a deterministic rule engine and RAG, so answers stay grounded instead of hallucinated.",
      points: [
        "Engineered a hybrid neuro-symbolic diagnostic pipeline using RAG.",
        "Built a deterministic rule-based validation engine on top of Random Forest and Decision Tree classifiers to curb hallucinations and keep results clinically reliable.",
        "NLP entity extraction turns free-text patient input into structured symptoms, mapped against verified medical knowledge bases.",
        "Integrated geospatial APIs with weighted scoring to rank nearby healthcare providers, connecting a digital diagnosis to real clinical care."
      ],
      stack: ["Python", "RAG", "Random Forest", "Decision Tree", "NLP", "Scikit-learn", "Geospatial APIs"],
      facts: [],
      github: "https://github.com/shivesh900/neurosy-rag",
      live: "https://shivesh900.github.io/neurosy-rag/"
    },
    {
      id: "lecturemind",
      name: "LectureMind AI",
      subtitle: "AI lecture transcription & knowledge extraction",
      period: "Oct 2026",
      category: "AI / ML · Full-stack",
      featured: true,
      color: "#8b7bff",
      summary: "Upload a lecture recording and get a timestamped transcript, summaries, notes, quizzes, flashcards, a knowledge map and a chat that answers only from the lecture.",
      points: [
        "Full-stack platform: React + Vite + TypeScript + Tailwind frontend, FastAPI + MongoDB backend.",
        "Pipeline: FFmpeg audio extraction, faster-whisper speech recognition, then chunked map-reduce summaries with schema-validated JSON outputs and per-step status with retries.",
        "Study tools: timestamped transcript with click-to-seek audio, smart notes, quiz with scoring, flashcards, an interactive knowledge-map graph and grounded chat with timestamp citations.",
        "Harsh / threatening language detection: flags profanity, insults and threats (English, Hinglish, Tamil-English) with severity and timestamps.",
        "JWT httpOnly-cookie auth with bcrypt and ownership checks, covered by 82 automated tests. The live demo runs in demo mode (real Whisper transcription, keyword-based study material) until an OpenAI key is added."
      ],
      stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "FastAPI", "MongoDB", "faster-whisper", "FFmpeg", "OpenAI API"],
      facts: ["82 automated tests (pytest)", "Live demo runs without an OpenAI key in a clearly labelled demo mode"],
      github: "https://github.com/shivesh900/lecturemind-ai",
      live: "https://lecturemind.sites.tab.bot/"
    },
    {
      id: "smart-city",
      name: "Smart City Digital Twin",
      subtitle: "AI-powered city simulation in Unity 6",
      period: "Oct 2026",
      category: "Simulation · Unity",
      featured: true,
      color: "#4fa3ff",
      summary: "A procedurally generated 3D city with live traffic, adaptive signals, incidents, emergency dispatch, pollution and energy layers, and a control-room dashboard.",
      points: [
        "Procedurally generated city in Unity 6 (URP) with a live traffic simulation; the same seed always rebuilds the same city.",
        "A* route planning reroutes vehicles around incidents and congestion.",
        "Adaptive queue-based traffic-signal optimizer with an A/B comparison against fixed timing.",
        "Incident simulation and emergency-vehicle dispatch, plus pollution and energy monitoring with trend forecasting.",
        "Transparent decision support (rules, A* search and trend forecasting, no trained ML model), with 28 NUnit tests."
      ],
      stack: ["Unity 6", "C#", "URP", "A* Search", "NUnit"],
      facts: ["28 NUnit tests", "All data on screen is simulated and labelled that way"],
      github: "https://github.com/shivesh900/smart-city-digital-twin",
      live: null
    },
    {
      id: "resume-scanner",
      name: "Resume Scanner Segregator",
      subtitle: "AI recruitment screening system",
      period: "Jun 2025 – Aug 2025",
      category: "AI / ML",
      featured: true,
      color: "#a974ff",
      summary: "Parses resumes, scores them against a role, and sorts candidates into High, Medium and Low priority for recruiters.",
      points: [
        "Automated resume parsing and candidate shortlisting with an AI-based recruitment system.",
        "Extracted candidate details and skills from PDF and DOCX resumes using NLP techniques.",
        "Segregated applicants into High, Medium and Low priority by match score.",
        "Built REST APIs with Flask and an interactive React dashboard for recruiters.",
        "Cut down manual resume screening and sped up hiring decisions."
      ],
      stack: ["Python", "NLP", "TF-IDF", "Flask", "REST API", "React"],
      facts: ["Scores candidates on skills match, TF-IDF similarity to the job description and experience", "Flask API, React dashboard and a CLI, covered by 29 automated tests"],
      github: "https://github.com/shivesh900/resume-scanner-segregator",
      live: "https://shivesh900.github.io/resume-scanner-segregator/"
    },
    {
      id: "sh-planner",
      name: "SH PLANNER",
      subtitle: "Schedule planner + notebook, web + Android app",
      period: "Oct 2026",
      category: "Productivity · Web + Android",
      color: "#ffd166",
      summary: "A planner and notebook in one: day/week/month planning, reminders, notes linked to tasks, habits and quick capture. Works offline and syncs with Google sign-in.",
      points: [
        "Day, week and month planning with reminders, notes linked to tasks, a notebook with folders and images, habits and quick capture.",
        "Offline-first PWA on IndexedDB with JSON backup and .ics export.",
        "Google sign-in with Firebase Auth and Firestore cloud sync (per-user security rules, tombstone deletes and merge).",
        "Android app built with Capacitor, with real local-notification alarms."
      ],
      stack: ["JavaScript", "PWA", "IndexedDB", "Firebase Auth", "Firestore", "Capacitor", "Android"],
      facts: [],
      github: "https://github.com/shivesh900/sh-planner",
      live: "https://shivesh900.github.io/sh-planner/"
    },
    {
      id: "lang-intel",
      name: "Language Intelligence",
      subtitle: "Language detection & text analysis (NLP)",
      period: null,
      category: "NLP",
      color: "#3cffb0",
      summary: "Detects 11 languages, including Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali and Marathi, and runs fully in the browser.",
      points: [
        "Character n-gram TF-IDF + Logistic Regression (scikit-learn), detecting 11 languages.",
        "98.9% accuracy on held-out sentences from Wikipedia articles it never saw.",
        "Model exported to JSON and run in the browser, matching Python's predictions exactly.",
        "Word-by-word breakdown for mixed text; also ships as a Flask API and a Streamlit dashboard."
      ],
      stack: ["Python", "Scikit-learn", "TF-IDF", "Logistic Regression", "JavaScript", "Flask", "Streamlit", "GitHub Pages"],
      facts: [],
      github: "https://github.com/shivesh900/nlp-project",
      live: "https://shivesh900.github.io/nlp-project/"
    },
    {
      id: "trip-planner",
      name: "AI Trip Planner",
      subtitle: "Day-by-day itinerary planner",
      period: null,
      category: "Full-stack",
      color: "#ffb347",
      summary: "Builds day-by-day itineraries from real data with no API key: real sights, live weather, a budget split and a route for each day.",
      points: [
        "Finds sights near the destination from Wikipedia, ranks them for your interests and groups each day by distance.",
        "Reorders rainy days using live weather.",
        "Splits the budget by tier and per person per day, makes a packing list and gives a Maps route for each day.",
        "Optional AI write-up that uses only the planned stops, on a free model or your own Gemini/OpenAI key.",
        "Optional Express + MongoDB backend."
      ],
      stack: ["React", "Vite", "Wikipedia API", "Open-Meteo", "Node.js", "Express", "MongoDB", "GitHub Pages"],
      facts: [],
      github: "https://github.com/shivesh900/genaitripplanner",
      live: "https://shivesh900.github.io/genaitripplanner/"
    },
    {
      id: "minifier",
      name: "CleanCode Minifier",
      subtitle: "JS / CSS minifier with compiler tooling",
      period: null,
      category: "Dev tools",
      color: "#ff5fa2",
      summary: "Paste JavaScript or CSS and minify it instantly, with a symbol table and a syntax check. Compiler-design ideas in a web tool.",
      points: [
        "Minifies JavaScript and CSS and shows original vs minified size.",
        "Builds a symbol table of variables, functions and classes with line numbers.",
        "Syntax-check endpoint for quick error feedback.",
        "Express backend, deployed on Vercel."
      ],
      stack: ["JavaScript", "Node.js", "Express", "HTML/CSS", "Vercel"],
      facts: [],
      github: "https://github.com/shivesh900/clean-code-minifiier",
      live: "https://clean-code-minifiier.vercel.app"
    },
    {
      id: "luxe-salon",
      name: "Luxe Salon",
      subtitle: "Premium landing page (UI/UX)",
      period: null,
      category: "UI / UX",
      color: "#e8c27a",
      summary: "A client-style landing page for a Chennai salon, with an editorial serif look, a jasmine-garland motif and smooth motion.",
      points: [
        "Custom design system: pine ink, ivory, brass gold and wine palette; Fraunces + Manrope type.",
        "Signature hand-drawn jasmine garland (malli poo) divider, a nod to real Chennai salons.",
        "Sections for services, pricing, gallery, testimonials, location map and a WhatsApp button."
      ],
      stack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      facts: [],
      github: "https://github.com/shivesh900/salon-demo-website",
      live: "https://salon-demo-website-nu.vercel.app"
    },
    {
      id: "clash-hub",
      name: "Clash Royale Hub",
      subtitle: "Deck builder + live player stats",
      period: "Oct 2026",
      category: "Web + Automation",
      color: "#5aa9ff",
      summary: "A deck builder for all current cards plus a personal stats page that refreshes itself every 3 hours through a GitHub Actions data pipeline.",
      points: [
        "Deck builder: average elixir, 4-card cycle, role balance, filters, shareable deck links and one-tap copy into the game.",
        "Stats page: trophies, arena, wins/losses, current deck and recent battles.",
        "Scheduled GitHub Action calls the official game API and commits fresh JSON, so a static site has live data."
      ],
      stack: ["JavaScript", "HTML/CSS", "GitHub Actions", "REST API", "GitHub Pages"],
      facts: [],
      github: "https://github.com/shivesh900/clash-royale-hub",
      live: "https://shivesh900.github.io/clash-royale-hub/"
    },
    {
      id: "sh-valo-tracker",
      name: "SH VALO TRACKER",
      subtitle: "Valorant player tracker, web + Android app",
      period: "Oct 2026",
      category: "Gaming · Web + PWA + Android",
      color: "#ff4655",
      summary: "A Valorant player tracker: anyone enters a Riot ID and region and sees rank and RR, peak rank, act K/D, HS%, win rate, ACS, top agents and the last 10 matches. Installs as an offline PWA and as a signed Android app.",
      points: [
        "Player lookup by Riot ID + region: rank and RR, peak rank, act K/D, HS%, win rate, ACS, top agents and the last 10 matches, from a live stats API.",
        "Game tools built on valorant-api.com data: agents browser, maps with callouts, a weapons damage table, a team comp builder with shareable links, and a crosshair code library with live canvas previews.",
        "Installable PWA with an offline service worker, plus a signed Android APK built as a Trusted Web Activity with Bubblewrap."
      ],
      stack: ["JavaScript", "PWA", "Service Worker", "Android (TWA)", "REST API", "GitHub Pages"],
      facts: [],
      github: "https://github.com/shivesh900/sh-valo-tracker",
      live: "https://shivesh900.github.io/sh-valo-tracker/"
    }
  ],

  github: {
    user: "shivesh900",
    // Snapshot used when the live GitHub API can't be reached (Oct 9, 2026).
    snapshot: { publicRepos: 8, languages: { "JavaScript": 4, "TypeScript": 1, "Python": 1, "CSS": 1, "HTML": 1 } }
  },

  assistant: {
    name: "NOVA",
    intro: "Hi! I'm NOVA, Shivesh's holographic assistant. Ask me about his projects, skills, education or how to reach him."
  }
};
