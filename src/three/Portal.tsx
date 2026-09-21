import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll01, damp, smoothstep, zones } from "@/lib/pointer";

/**
 * The journey's destination — a glowing portal ring that the camera slowly
 * approaches through the contact section. Subtly brightens and widens with
 * scroll proximity.
 */
export function Portal({ position = [0, -0.4, -14.5] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const disc = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    const vis = smoothstep(zones.contact[0] - 0.05, zones.contact[0] + 0.2, scroll01.v);
    g.visible = vis > 0.01;
    g.scale.setScalar(damp(g.scale.x, 0.5 + vis * 0.6, 2.5, d));
    if (ringA.current) ringA.current.rotation.z = t * 0.3;
    if (ringB.current) ringB.current.rotation.z = -t * 0.18;
    if (disc.current) {
      const m = disc.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.1 + vis * 0.22 + Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group ref={group} position={position} visible={false}>
      {/* Main halo */}
      <mesh ref={ringA}>
        <torusGeometry args={[2.6, 0.02, 12, 128]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.85} />
      </mesh>
      {/* Counter-rotating violet halo */}
      <mesh ref={ringB} rotation={[0.25, 0.15, 0]}>
        <torusGeometry args={[2.2, 0.012, 12, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} />
      </mesh>
      {/* Luminous center disc */}
      <mesh ref={disc}>
        <circleGeometry args={[1.9, 48]} />
        <meshBasicMaterial color="#0ea5b7" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Radial spokes */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} rotation={[0, 0, a]} position={[Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0]}>
            <planeGeometry args={[0.55, 0.006]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}
