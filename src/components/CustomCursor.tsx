import { useEffect, useRef } from "react";

/**
 * Custom cursor (desktop, fine pointers only). A dot follows the mouse 1:1
 * while a ring trails with easing. Elements marked `data-cursor="link"` or
 * `data-cursor="view"` expand/tint the ring. Hidden entirely on touch devices
 * and when (pointer: fine) is unsupported or reduced motion is requested.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const show = (el: HTMLDivElement | null) => {
      if (el) el.style.display = "block";
    };
    show(dotRef.current);
    show(ringRef.current);

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let hovering = "";
    let down = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, [role='button']",
      ) as HTMLElement | null;
      hovering = el?.dataset?.cursor ?? (el ? "link" : "");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${down ? 0.7 : 1})`;
      }
      if (ringRef.current) {
        const active = hovering === "view" ? 2.4 : hovering === "link" ? 1.7 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${down ? active * 0.85 : active})`;
        ringRef.current.style.borderColor =
          hovering === "view"
            ? "rgba(167,139,250,.9)"
            : hovering === "link"
              ? "rgba(103,232,249,.9)"
              : "rgba(255,255,255,.45)";
        ringRef.current.style.backgroundColor =
          hovering === "view" ? "rgba(167,139,250,.08)" : "transparent";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Divs are hidden by default (display:none via ref callback); the effect
  // unhides them only on fine-pointer devices without reduced motion.
  return (
    <>
      <style>{`@media (pointer: fine) { html, a, button, [role='button'], input, textarea { cursor: none; } }`}</style>
      <div
        ref={(el) => {
          dotRef.current = el;
          if (el) el.style.display = "none";
        }}
        aria-hidden="true"
        className="pf-glow-cyan pointer-events-none fixed top-0 left-0 z-[90] size-1.5 rounded-full bg-cyan-300"
      />
      <div
        ref={(el) => {
          ringRef.current = el;
          if (el) el.style.display = "none";
        }}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[90] size-9 rounded-full border border-white/45 transition-[border-color,background-color] duration-200"
      />
    </>
  );
}
