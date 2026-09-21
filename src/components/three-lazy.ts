import { lazy } from "react";

/** Lazy-loaded 3D world — code-split so three.js never blocks first paint. */
export const LazyExperience = lazy(() => import("@/three/Experience"));
