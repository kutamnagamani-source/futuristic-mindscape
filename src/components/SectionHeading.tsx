import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WordReveal } from "./WordReveal";

/** Consistent section header: mono index, hairline, display title, blurb. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", align === "center" && "text-center")}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5 }}
        className={cn("flex items-center gap-3", align === "center" && "justify-center")}
      >
        <span className="font-mono-ui text-xs tracking-[0.3em] text-cyan-200">{index}</span>
        <span className="pf-hairline w-16" />
        <span className="font-mono-ui text-xs tracking-[0.3em] text-white/65 uppercase">{eyebrow}</span>
      </motion.div>

      <WordReveal
        as="h2"
        text={title}
        className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl"
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className={cn(
            "pf-muted mt-4 max-w-xl text-[15px] leading-relaxed sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
