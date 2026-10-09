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
    "Languages": ["Python", "C++", "SQL", "JavaScript", "TypeScript"],
    "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Classification", "Regression", "Clustering", "NLP", "RAG"],
    "Libraries & Frameworks": ["PyTorch", "Scikit-learn", "Pandas", "NumPy", "Flask", "React", "Express", "Streamlit", "Tailwind CSS"],
    "Tools & Platforms": ["Git", "GitHub", "AWS", "Power BI", "Vercel"],
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
      id: "lang-intel",
      name: "Language Intelligence",
      subtitle: "Language detection & text analysis (NLP)",
      period: null,
      category: "NLP",
      color: "#3cffb0",
      summary: "Detects whether text is English, Tamil or Hindi, with word-level breakdown, readability scoring and translation to English.",
      points: [
        "TF-IDF + Logistic Regression classifier trained on a mixed English / Tamil / Hindi dataset, with a rule-based fallback.",
        "Flask REST API (/predict, /health) returning language and confidence.",
        "Streamlit dashboard: real-time prediction, word-level language highlighting, Flesch reading-ease and automatic translation."
      ],
      stack: ["Python", "Scikit-learn", "TF-IDF", "Flask", "Streamlit", "React (Vite)"],
      facts: [],
      github: "https://github.com/shivesh900/nlp-project",
      live: "https://shivesh900.github.io/nlp-project/"
    },
    {
      id: "trip-planner",
      name: "AI Trip Planner",
      subtitle: "Full-stack travel planning app",
      period: null,
      category: "Full-stack",
      color: "#ffb347",
      summary: "Plan trips by destination, dates, budget and preferences, and get budget-aware suggestions. React front end, Express + MongoDB API, deployed on Vercel.",
      points: [
        "Create, view and manage trips with budget and preference details.",
        "Budget-aware travel suggestions for each trip.",
        "REST API with Express and Mongoose on MongoDB Atlas, deployed serverless on Vercel."
      ],
      stack: ["React", "Vite", "Node.js", "Express", "MongoDB Atlas", "Vercel"],
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
