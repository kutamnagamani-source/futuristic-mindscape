import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/** Floating glass navbar with scroll-spy active state and mobile fullscreen menu. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled
              ? "pf-glass-strong border-white/10 shadow-[0_8px_40px_rgba(0,0,0,.45)]"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#home" className="font-display flex items-center gap-2.5" data-cursor="link">
            <span className="relative flex size-2.5">
              <span className="pf-pulse-soft absolute inline-flex size-full rounded-full bg-amber-400/60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-amber-300" />
            </span>
            <span className="text-sm font-semibold tracking-[0.18em] text-white uppercase drop-shadow-[0_0_10px_rgba(245,185,68,0.35)]">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  data-cursor="link"
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[0.14em] uppercase transition-colors duration-300",
                    active === l.id ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-amber-300/35 bg-amber-400/10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col justify-center bg-[#050507]/95 px-8 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="font-display flex items-baseline gap-4 py-2 text-4xl font-semibold text-white/90 transition-colors hover:text-amber-300"
                  >
                    <span className="font-mono-ui text-xs text-amber-300/80">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono-ui mt-12 text-[11px] tracking-[0.3em] text-white/60 uppercase"
            >
              {profile.availability}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
