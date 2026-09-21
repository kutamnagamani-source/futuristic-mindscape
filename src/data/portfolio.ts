/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — K. Vijay Phanindra
 *  Edit this file to update the site. UI components never hard-code content.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "K. Vijay Phanindra",
  // Shown in the loading screen + identity card
  initials: "KV",
  // First-screen role — the core identity of this site
  role: "AI / ML STUDENT",
  title: "Creative Technologist",
  tagline: "Building the future, one model at a time.",
  description:
    "I'm an AI/ML student building the foundations of intelligent, immersive and high-performance digital experiences — combining machine learning, design and code.",
  location: "Greater Vijayawada District, India",
  email: "kutamnagamani@gmail.com",
  availability: "Open to internships & collaborations",
} as const;

export const about = {
  // Headline rendered word-by-word with scroll reveal
  headline: "I turn data into intelligence and ideas into living interfaces.",
  paragraphs: [
    "I'm K. Vijay Phanindra, a Computer Science student at the NxtWave Institute of Advanced Technologies (NIAT), exploring the world of artificial intelligence and machine learning — one concept, one project at a time.",
    "My philosophy is simple: learn relentlessly, build constantly, and let curiosity choose the next problem. Right now that means deepening my foundations in programming, mathematics and AI — and finding elegant ways to put them to work.",
  ],
  interests: [
    "Deep Learning",
    "Computer Vision",
    "LLM Agents",
    "Generative Art",
    "Real-time 3D",
    "Problem Solving",
  ],
  facts: [
    { label: "Based in", value: "Greater Vijayawada District, India" },
    { label: "Education", value: "B.Tech CSE · NIAT (2025–2029)" },
    { label: "Focus", value: "AI · ML · Creative Tech" },
    { label: "Currently learning", value: "Foundations of AI/ML" },
  ],
} as const;

export type SkillGroup = {
  id: string;
  label: string;
  accent: string; // hex color used in the 3D scene + UI
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "ai-ml",
    label: "AI / ML",
    accent: "#f5b944", // amber
    skills: ["Python", "PyTorch", "Scikit-learn", "Hugging Face", "Prompting", "ML Basics"],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#e0c388", // champagne
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind"],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "#d98e5f", // copper
    skills: ["Node.js", "Express", "REST APIs", "FastAPI", "WebSockets", "Git"],
  },
  {
    id: "data",
    label: "Data",
    accent: "#a8bd7a", // olive
    skills: ["SQL", "Pandas", "NumPy", "MongoDB", "PostgreSQL", "Data Viz"],
  },
  {
    id: "tools",
    label: "Tools",
    accent: "#c98a9e", // muted rose
    skills: ["VS Code", "GitHub", "Linux", "Figma", "Jupyter", "Docker"],
  },
];

export const journey = [
  {
    year: "2025 — 2029",
    title: "B.Tech, Computer Science",
    org: "NxtWave Institute of Advanced Technologies (NIAT)",
    detail:
      "Bachelor of Technology in Computer Science — building strong foundations in programming, mathematics and AI/ML.",
    kind: "education" as const,
  },
] as const;

export const socials = [
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/k-vijay-phanindra-6a8423372",
  },
  { id: "email", label: "Email", url: "mailto:kutamnagamani@gmail.com" },
] as const;

export type SocialId = (typeof socials)[number]["id"];
