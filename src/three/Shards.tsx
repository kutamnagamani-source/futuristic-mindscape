import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, scroll01, damp } from "@/lib/pointer";
import { mulberry32 } from "@/lib/rand";

/**
 * Shard field — floating glassy monoliths / crystals scattered along the
 * journey corridor. Each shard drifts and slowly rotates; the group recedes
 * on scroll so new shards come into frame as the camera advances.
 */
export function Shards({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);

  const shards = useMemo(() => {
    const rng = mulberry32(1337); // deterministic layout
    const items: {
      pos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
      speed: number;
      color: string;
      kind: "mono" | "crystal";
    }[] = [];
    for (let i = 0; i < count; i++) {
      const kind = rng() > 0.55 ? "crystal" : "mono";
      const z = 6 - rng() * 30; // corridor z: +6 → -24
      // Keep a clear channel near the camera path center
      const x = (rng() - 0.5) * 22;
      const y = (rng() - 0.5) * 10;
      const isNear = Math.abs(x) < 4 && Math.abs(y) < 2.5 && z > -8 && z < 6;
      if (isNear) continue;
      items.push({
        pos: [x, y, z],
        scale:
          kind === "mono"
            ? [0.35 + rng() * 0.5, 1.6 + rng() * 2.6, 0.35 + rng() * 0.5]
            : [0.45 + rng() * 0.7, 0.45 + rng() * 0.7, 0.9 + rng() * 1.6],
        rot: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
        speed: 0.05 + rng() * 0.12,
        color: rng() > 0.72 ? "#a78bfa" : rng() > 0.4 ? "#22d3ee" : "#334155",
        kind,
      });
    }
    return items;
  }, [count]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.rotation.y += shards[i]!.speed * d;
      child.rotation.x += shards[i]!.speed * d * 0.4;
      child.position.y = shards[i]!.pos[1] + Math.sin(t * 0.4 + i) * 0.35;
    });
    // Whole field recedes with scroll for depth parallax
    g.position.z = damp(g.position.z, scroll01.v * 8, 2, d);
    g.position.x = damp(g.position.x, pointer.x * -0.5, 2, d);
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          {s.kind === "mono" ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : (
            <octahedronGeometry args={[1, 0]} />
          )}
          <meshStandardMaterial
            color={s.color}
            roughness={0.25}
            metalness={0.85}
            transparent
            opacity={s.color === "#334155" ? 0.5 : 0.85}
            emissive={s.color}
            emissiveIntensity={s.color === "#334155" ? 0.02 : 0.08}
          />
        </mesh>
      ))}
    </group>
  );
}


