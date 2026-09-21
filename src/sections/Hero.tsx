import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { profile } from "@/data/portfolio";

/** Full-screen hero: the first screen is the AI/ML STUDENT identity, floating over the neural core. */
export function Hero() {
  return (
    <section
      id="home"
      className="pointer-events-none relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono-ui flex items-center gap-3 text-xs tracking-[0.4em] text-cyan-200 uppercase"
      >
        <span className="inline-block h-px w-8 bg-cyan-300/50" />
        Hello, I'm
        <span className="inline-block h-px w-8 bg-cyan-300/50" />
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-5 bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(103,232,249,0.25)] sm:text-7xl lg:text-8xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.72, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-4 text-xl font-semibold tracking-[0.08em] sm:text-3xl"
      >
        <span className="pf-gradient-text">{profile.role}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pf-muted mt-5 max-w-md text-[15px] leading-relaxed sm:max-w-lg sm:text-lg"
      >
        {profile.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
      >
        <MagneticButton href="#about">
          Explore my world
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </MagneticButton>
        <MagneticButton href="#contact" variant="ghost">
          Contact me
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="font-mono-ui pointer-events-auto absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.35em] text-white/70 uppercase transition-colors hover:text-cyan-200"
        aria-label="Scroll to about section"
      >
        Scroll to explore
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="size-3.5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
