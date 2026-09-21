import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";
import { NeuralCore } from "./NeuralCore";
import { Particles } from "./Particles";
import { Shards } from "./Shards";
import { SkillRings } from "./SkillRings";
import { Portal } from "./Portal";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * The full 3D world. Rendered inside a fixed, pointer-events-none canvas
 * behind all page content. Quality tiers: mobile gets fewer particles, no
 * bloom-ish heavy effects, and simpler shard count; reduced motion gets a
 * calm, barely-animated scene.
 */
export default function Experience() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const particleCount = reduced ? 220 : isMobile ? 500 : 1100;
  const shardCount = reduced ? 14 : isMobile ? 18 : 42;

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0.4, 10], fov: 45, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          {/* Lighting for the metallic shards */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 8, 4]} intensity={1.4} color="#cfe9ff" />
          <directionalLight position={[-6, -4, -6]} intensity={0.5} color="#a78bfa" />

          <Particles count={particleCount} />
          <Shards count={shardCount} />
          {!reduced && <NeuralCore position={[0, 0.2, 0]} />}
          {!reduced && <SkillRings isMobile={isMobile} />}
          {!reduced && <Portal />}
        </Suspense>
      </Canvas>
    </div>
  );
}
