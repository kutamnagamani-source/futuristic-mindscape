/** Global pointer + scroll store.
 * A single window listener updates plain mutable objects; consumers read them
 * inside RAF / useFrame loops and lerp toward targets — zero React re-renders.
 */
export const pointer = { x: 0, y: 0 }; // normalized -1..1
export const scroll01 = { v: 0 }; // page scroll progress 0..1

/** Measured section zones as scroll-progress windows [start, end]. */
export const zones = {
  about: [0.15, 0.4] as [number, number],
  skills: [0.4, 0.7] as [number, number],
  contact: [0.7, 1] as [number, number],
};

/** Measure real section offsets so 3D zones align with actual layout. */
export function measureZones() {
  if (typeof document === "undefined") return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return;
  const vh = window.innerHeight;
  const zone = (id: string): [number, number] => {
    const el = document.getElementById(id);
    if (!el) return [0.4, 0.6];
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    const start = Math.min(1, Math.max(0, (top - vh * 0.75) / max));
    const end = Math.min(1, Math.max(0, (bottom - vh * 0.3) / max));
    return [start, Math.max(end, start + 0.05)];
  };
  zones.about = zone("about");
  zones.skills = zone("skills");
  zones.contact = zone("contact");
}

let bound = false;
export function bindGlobalListeners() {
  if (bound || typeof window === "undefined") return () => {};
  bound = true;
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1); // +y is up
  };
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll01.v = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measureZones, { passive: true });
  onScroll();
  measureZones();
  // Re-measure once webfonts/layout have settled
  const t = setTimeout(measureZones, 800);
  return () => {
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", measureZones);
    clearTimeout(t);
    bound = false;
  };
}

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 before `a`, 1 after `b`, smooth in between. */
export function smoothstep(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}
