import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { skillGroups } from "@/data/portfolio";

/** Skills: glass category cards that complement the orbiting 3D skill rings behind. */
export function Skills() {
  return (
    <section id="skills" className="pointer-events-none relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <SectionHeading
        index="02"
        eyebrow="What I work with"
        title="A toolkit for intelligent experiences."
        description="Hover a category to inspect the stack. The orbiting rings behind are the same universe — pointer and scroll included."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <motion.article
            key={g.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            data-cursor="view"
            className="pf-glass pointer-events-auto group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5"
            style={{ ["--accent" as string]: g.accent }}
          >
            {/* hover glow tinted by the category accent */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
              style={{ background: g.accent }}
            />

            <header className="flex items-center justify-between">
              <p className="font-mono-ui text-[10px] tracking-[0.28em] uppercase" style={{ color: g.accent }}>
                {g.label}
              </p>
              <p className="font-mono-ui text-[10px] text-white/25">0{i + 1}</p>
            </header>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/75 transition-all duration-300 group-hover:border-white/20 group-hover:text-white/90"
                >
                  {s}
                </li>
              ))}
            </ul>

            <div className="pf-hairline mt-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
