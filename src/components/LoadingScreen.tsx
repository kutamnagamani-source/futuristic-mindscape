import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/portfolio";

/**
 * Minimal cinematic loader: initials monogram, scan-line progress, then a
 * panel-wipe reveal. Doesn't block on real asset loading — a fixed short
 * duration keeps first paint fast.
 */
export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 250 : 1400;
    const start = performance.now();
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(1);
      doneTimer = setTimeout(() => {
        setGone(true);
        onDone?.();
      }, 250);
    };

    const tick = (now: number) => {
      if (finished) return;
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    // Hard fallback: if RAF is throttled/blocked (background tab, sandboxed
    // iframe), still reveal the site after the expected duration.
    const fallbackTimer = setTimeout(finish, duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallbackTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="pf-noise fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507]"
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
          role="status"
          aria-label="Loading portfolio"
        >
          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="pf-text-glow font-display text-6xl font-bold tracking-[0.12em] text-white sm:text-7xl">
              {profile.initials}
            </div>
            {/* Scan line sweeping the monogram */}
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Progress bar */}
          <div className="mt-10 h-px w-44 overflow-hidden bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-orange-400 transition-[width] duration-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="font-mono-ui mt-4 text-[10px] tracking-[0.35em] text-white/40 uppercase">
            Initializing neural interface
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
