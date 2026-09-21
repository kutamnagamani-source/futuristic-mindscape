import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent) => void;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/**
 * Magnetic button — the label leans toward the cursor inside the button body
 * while the shell follows with softer spring physics. Renders an <a> when
 * `href` is given, otherwise a <button>.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  ariaLabel,
  type = "button",
  disabled,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    const el = shellRef.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const shell = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 font-mono-ui text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300",
    variant === "primary"
      ? "border border-cyan-300/60 bg-cyan-400/10 text-cyan-100 pf-glow-cyan hover:bg-cyan-400/20"
      : "border border-white/15 bg-white/[0.03] text-white/85 hover:border-white/35 hover:bg-white/[0.08]",
  );

  const inner = (
    <>
      {/* Border sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute inset-0 rounded-full border border-white/25" />
      </span>
      {/* Rippling glow */}
      <span className="pointer-events-none absolute inset-0 -z-0 scale-75 rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-400/20 opacity-0 blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
      <motion.span style={{ x: sx, y: sy }} className="relative z-10 inline-flex items-center gap-2">
        {children}
      </motion.span>
    </>
  );

  return (
    <motion.div
      ref={shellRef}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn("inline-block pointer-events-auto", disabled && "pointer-events-none opacity-50", className)}
      data-cursor="link"
    >
      {href ? (
        <a href={href} onClick={onClick} aria-label={ariaLabel} className={shell}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} aria-label={ariaLabel} disabled={disabled} className={shell}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
