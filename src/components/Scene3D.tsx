import { Component, useEffect, lazy, Suspense, useState, type ReactNode } from "react";

/** Lazy-loaded 3D world — code-split so three.js never blocks first paint. */
const Experience = lazy(() => import("@/three/Experience"));

/** CSS-only stand-in shown while 3D loads, or if WebGL is unavailable/crashed. */
export function SceneFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(34,211,238,0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(139,92,246,0.06), transparent 70%), #050507",
      }}
    />
  );
}

/** Catches any crash inside the 3D world and degrades to the CSS fallback. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[Scene3D] 3D world crashed, falling back to CSS scene:", err.message);
  }
  render() {
    if (this.state.hasError) return <SceneFallback />;
    return this.props.children;
  }
}

function useWebGLAvailable() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") ?? c.getContext("webgl");
      setOk(!!gl);
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/**
 * Mounts the 3D Experience only when WebGL is actually available; any load
 * failure or runtime crash degrades to a static CSS scene instead of a
 * blank page or an error boundary covering the whole app.
 */
export function Scene3D() {
  const webgl = useWebGLAvailable();

  if (webgl === false) return <SceneFallback />;
  if (webgl === null) return null; // still probing — loader covers this window

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<SceneFallback />}>
        <Experience />
      </Suspense>
    </SceneErrorBoundary>
  );
}
