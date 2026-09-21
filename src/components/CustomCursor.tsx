import { useEffect, useRef } from "react";

/**
 * Custom cursor (desktop, fine pointers only) — event-driven, no RAF loop,
 * so it keeps working even in environments that throttle requestAnimationFrame
 * (e.g. sandboxed preview iframes). The dot tracks 1:1 on pointermove; the
 * ring trails via a CSS transform transition. The native cursor is hidden
 * only after the custom one is actually active (html.pf-cursor-on).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("pf-cursor-on");
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let hovering = "";
    let down = false;

    const apply = (x: number, y: number) => {
      const dotScale = down ? 0.7 : 1;
      const ringScale = (hovering === "view" ? 2.3 : hovering === "link" ? 1.6 : 1) * (down ? 0.85 : 1);
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.borderColor =
        hovering === "view"
          ? "rgba(217,142,95,.95)"
          : hovering === "link"
            ? "rgba(245,185,68,.95)"
            : "rgba(255,246,228,.7)";
      ring.style.backgroundColor = hovering === "view" ? "rgba(217,142,95,.12)" : "transparent";
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, [role='button']",
      ) as HTMLElement | null;
      hovering = el?.dataset?.cursor ?? (el ? "link" : "");
      apply(e.clientX, e.clientY);
    };
    const onDown = () => {
      down = true;
    };
    const onUp = () => {
      down = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("pf-cursor-on");
    };
  }, []);

  // Hidden (opacity 0) until the effect activates — touch devices never see it.
  return (
    <>
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        aria-hidden="true"
        className="pf-glow-amber pointer-events-none fixed top-0 left-0 z-[90] size-2 rounded-full bg-amber-200 transition-[transform] duration-75 ease-out"
      />
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[90] size-10 rounded-full border-2 border-white/65 transition-[transform,border-color,background-color] duration-200 ease-out"
      />
    </>
  );
}
