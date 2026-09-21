import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { WordReveal } from "@/components/WordReveal";
import { about, profile } from "@/data/portfolio";

/** About: identity card + philosophy, revealed with scroll-triggered word animation. */
export function About() {
  return (
    <section id="about" className="pointer-events-auto relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
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
            className="font-display text-2xl leading-snug font-semibold text-white sm:text-3xl"
          />

          <div className="mt-8 space-y-5">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="pf-muted max-w-xl text-[15px] leading-relaxed sm:text-base"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {about.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs tracking-wide text-white/90 transition-colors duration-300 hover:border-amber-300/50 hover:text-amber-100 hover:bg-amber-400/10"
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
          className="pf-noise pf-card relative self-start overflow-hidden rounded-3xl p-6 sm:p-7 [transform-style:preserve-3d]"
        >
          {/* luminous top edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
          <div className="font-mono-ui flex items-center justify-between text-[10px] tracking-[0.25em] text-white/55 uppercase">
            <span>Identity // {profile.initials}-01</span>
            <span className="pf-pulse-soft text-[#b8cf8a]">● online</span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="relative grid size-16 place-items-center rounded-2xl border border-amber-300/35 bg-gradient-to-br from-amber-400/15 to-orange-400/10">
              <span className="font-display pf-text-glow text-xl font-bold text-amber-200">
                {profile.initials}
              </span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">{profile.name}</p>
              <p className="font-mono-ui mt-0.5 text-[10px] tracking-[0.2em] text-amber-200/90 uppercase">
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
                className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
              >
                <dt className="font-mono-ui text-[10px] tracking-[0.2em] text-white/55 uppercase">{f.label}</dt>
                <dd className="text-right text-[13px] font-medium text-white">{f.value}</dd>
              </motion.div>
            ))}
          </dl>

          {/* corner glow */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-orange-500/15 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
