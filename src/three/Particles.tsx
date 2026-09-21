import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, scroll01, damp } from "@/lib/pointer";
import { mulberry32 } from "@/lib/rand";

/**
 * Floating particle field — a Points cloud with additive blending that drifts
 * slowly upward and sinks away as the journey progresses. Layout is generated
 * with a seeded PRNG so it's deterministic (pure render, stable visuals).
 * Count scales down on mobile / reduced motion for performance.
 */
export function Particles({ count, reduced = false }: { count: number; reduced?: boolean }) {
  const points = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const rng = mulberry32(20260921);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 30;
      positions[i * 3 + 1] = (rng() - 0.5) * 16;
      positions[i * 3 + 2] = 8 - rng() * 34; // z: +8 → -26
      speeds[i] = 0.15 + rng() * 0.4;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, dt) => {
    const p = points.current;
    if (!p) return;
    const d = Math.min(dt, 0.05);
    const attr = p.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;

    if (!reduced) {
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] = arr[i * 3 + 1]! + speeds[i]! * d * 0.35;
        if (arr[i * 3 + 1]! > 8) arr[i * 3 + 1] = -8;
      }
      attr.needsUpdate = true;
    }

    // Sink the field as the camera travels; gentle sway with pointer
    const targetY = -scroll01.v * 6 + (reduced ? 0 : Math.sin(t * 0.2) * 0.4);
    p.position.y = damp(p.position.y, targetY, 2, d);
    p.position.x = damp(p.position.x, reduced ? 0 : pointer.x * -0.6, 2, d);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#9bd8ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
