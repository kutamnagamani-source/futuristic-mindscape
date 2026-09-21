import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Word-by-word reveal: each word rises from a blur into focus, staggered,
 * triggered once when scrolled into view. Respect reduced motion by rendering
 * plain text.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "p" | "h2" | "h3" | "blockquote";
}) {
  const words = text.split(" ");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
