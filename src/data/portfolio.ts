/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit this file to make the site yours.
 *  All `PLACEHOLDER` values are clearly marked — replace them with real info.
 *  UI components never hard-code this content.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  // PLACEHOLDER: your name
  name: "Alex Doe",
  // PLACEHOLDER: your initials (shown in the loading screen)
  initials: "AD",
  // First-screen role — the core identity of this site
  role: "AI / ML STUDENT",
  title: "Creative Technologist",
  tagline: "Building the future, one model at a time.",
  // Short description shown under the hero role
  description:
    "I build intelligent, immersive and high-performance digital experiences that combine machine learning, design and code.",
  // PLACEHOLDER: city / country
  location: "Berlin, Germany",
  // PLACEHOLDER: email address
  email: "hello@alexdoe.dev",
  availability: "Open to internships & collaborations",
} as const;

export const about = {
  // Headline rendered word-by-word with scroll reveal
  headline: "I turn data into intelligence and ideas into living interfaces.",
  paragraphs: [
    "I'm an AI/ML student and self-taught developer fascinated by the space where neural networks meet human experience. My days move between training models, prototyping interfaces, and asking how technology should feel — not just what it should do.",
    // PLACEHOLDER: replace with your own philosophy / background
    "My philosophy is simple: learn in public, build relentlessly, and let curiosity choose the next problem. Right now that means deep learning, computer vision and generative systems — and finding elegant ways to put them in front of people.",
  ],
  interests: [
    "Deep Learning",
    "Computer Vision",
    "LLM Agents",
    "Generative Art",
    "Real-time 3D",
    "MLOps",
  ],
  // PLACEHOLDER: quick facts (label / value)
  facts: [
    { label: "Based in", value: "Berlin, Germany" },
    { label: "Focus", value: "AI · ML · Creative Tech" },
    { label: "Status", value: "Open to internships" },
    { label: "Currently learning", value: "Transformer architectures" },
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
    accent: "#22d3ee",
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face", "LangChain", "OpenAI API"],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#a78bfa",
    skills: ["React", "TypeScript", "Next.js", "Tailwind", "Three.js", "Framer Motion"],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "#6ee7b7",
    skills: ["Python", "FastAPI", "Node.js", "Express", "REST APIs", "WebSockets"],
  },
  {
    id: "data",
    label: "Data",
    accent: "#7dd3fc",
    skills: ["Pandas", "NumPy", "SQL", "MongoDB", "PostgreSQL", "Pinecone"],
  },
  {
    id: "tools",
    label: "Tools",
    accent: "#fbbf24",
    skills: ["Git", "GitHub", "Docker", "Linux", "Figma", "Jupyter"],
  },
];

export const journey = [
  // PLACEHOLDER: replace with your real education / experience
  {
    year: "2024 — Now",
    title: "B.Sc. Computer Science, AI/ML track",
    org: "Technical University (PLACEHOLDER)",
    detail:
      "Deep learning, mathematics for ML, and systems programming. Course projects in vision and NLP.",
    kind: "education" as const,
  },
  {
    year: "2024",
    title: "Machine Learning Intern",
    org: "AI Startup (PLACEHOLDER)",
    detail:
      "Built evaluation pipelines for LLM products and shipped an internal retrieval-augmented assistant.",
    kind: "experience" as const,
  },
  {
    year: "2023",
    title: "Deep Learning Specialization",
    org: "DeepLearning.AI (PLACEHOLDER)",
    detail: "Five-course specialization covering CNNs, sequence models and structuring ML projects.",
    kind: "certification" as const,
  },
  {
    year: "2022 — Now",
    title: "Independent builder",
    org: "Open source & personal projects",
    detail:
      "Shipping experiments that mix models with interfaces — from vision demos to agentic tools and generative visuals.",
    kind: "project" as const,
  },
] as const;

export const achievements = [
  // PLACEHOLDER: keep honest — only numbers you can stand behind
  { value: 12, suffix: "+", label: "Projects built" },
  { value: 15, suffix: "+", label: "Technologies used" },
  { value: 1200, suffix: "+", label: "Hours of code" },
  { value: 3, suffix: "", label: "Certifications" },
] as const;

export const socials = [
  // PLACEHOLDER: replace URLs with your real profiles
  { id: "github", label: "GitHub", url: "https://github.com/alexdoe" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/alexdoe" },
  { id: "x", label: "X / Twitter", url: "https://x.com/alexdoe" },
  { id: "email", label: "Email", url: "mailto:hello@alexdoe.dev" },
] as const;

export type SocialId = (typeof socials)[number]["id"];
