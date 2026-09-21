import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { WordReveal } from "@/components/WordReveal";
import { about, profile } from "@/data/portfolio";

/** About: identity card + philosophy, revealed with scroll-triggered word animation. */
export function About() {
  return (
    <section id="about" className="pointer-events-none relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <SectionHeading
        index="01"
        eyebrow="Who I am"
        title="Building the future, one model at a time."
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Narrative */}
        <div>
          <WordReveal
            as="blockquote"
            text={about.headline}
            className="font-display text-xl leading-snug font-medium text-white/90 sm:text-2xl"
          />

          <div className="mt-8 space-y-5">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-[15px]"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Interests */}
          <motion.div
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {about.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] tracking-wide text-white/70 transition-colors duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Digital identity card */}
        <motion.div
          initial={{ opacity: 0, y: 32, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pf-noise pf-glass pointer-events-auto relative self-start overflow-hidden rounded-3xl p-6 sm:p-7 [transform-style:preserve-3d]"
        >
          {/* holographic top edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="font-mono-ui flex items-center justify-between text-[10px] tracking-[0.25em] text-white/40 uppercase">
            <span>Identity // {profile.initials}-01</span>
            <span className="pf-pulse-soft text-emerald-300">● online</span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="relative grid size-16 place-items-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-violet-400/15">
              <span className="font-display pf-text-glow text-xl font-bold text-cyan-200">
                {profile.initials}
              </span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">{profile.name}</p>
              <p className="font-mono-ui mt-0.5 text-[10px] tracking-[0.2em] text-cyan-300/80 uppercase">
                {profile.role}
              </p>
            </div>
          </div>

          <dl className="mt-7 space-y-3.5">
            {about.facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <dt className="font-mono-ui text-[10px] tracking-[0.2em] text-white/40 uppercase">{f.label}</dt>
                <dd className="text-right text-xs font-medium text-white/85">{f.value}</dd>
              </motion.div>
            ))}
          </dl>

          {/* corner glow */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-violet-500/15 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
