import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, damp } from "@/lib/pointer";

/**
 * The hero centerpiece: a neural-core made of a wireframe icosahedron shell,
 * an inner glowing nucleus, orbiting nodes connected by faint links and a
 * rotating data ring. The nucleus breathes; the whole core leans toward the
 * cursor. Hovering glows the shell; clicking fires a pulse through the nodes.
 */
export function NeuralCore({ position = [0, 0.2, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null);
  const nucleusMat = useRef<THREE.MeshBasicMaterial>(null);
  const pulse = useRef(0);
  const [hovered, setHovered] = useState(false);

  const nodes = useMemo(() => {
    // Fibonacci sphere for even node distribution
    const pts: THREE.Vector3[] = [];
    const N = 14;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(1.85));
    }
    return pts;
  }, []);

  const links = useMemo(() => {
    // Connect nearby nodes with faint line segments
    const linePositions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i]!.distanceTo(nodes[j]!) < 2.1) {
          linePositions.push(nodes[i]!.x, nodes[i]!.y, nodes[i]!.z, nodes[j]!.x, nodes[j]!.y, nodes[j]!.z);
        }
      }
    }
    return new Float32Array(linePositions);
  }, [nodes]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // Lean toward cursor + slow idle sway
    g.rotation.y = damp(g.rotation.y, pointer.x * 0.35 + Math.sin(t * 0.12) * 0.08, 2.5, d);
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.2 + Math.cos(t * 0.1) * 0.05, 2.5, d);
    g.position.y = position[1] + Math.sin(t * 0.6) * 0.12;

    // Breathing nucleus; pulse expands it briefly on click
    if (nucleus.current && nucleusMat.current) {
      const breathe = 1 + Math.sin(t * 1.4) * 0.06;
      const s = breathe + pulse.current * 0.5;
      nucleus.current.scale.setScalar(s);
      nucleusMat.current.opacity = 0.75 + Math.sin(t * 1.4) * 0.1 + pulse.current * 0.25;
    }
    pulse.current = Math.max(0, pulse.current - d * 1.6);

    if (ring.current) ring.current.rotation.z = t * 0.35;
    if (ring2.current) ring2.current.rotation.z = -t * 0.22;
    if (shellMat.current) {
      shellMat.current.opacity = hovered ? 0.5 : 0.22;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Outer wireframe shell */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={() => (pulse.current = 1)}
      >
        <icosahedronGeometry args={[2.35, 1]} />
        <meshBasicMaterial
          ref={shellMat}
          color="#67e8f9"
          wireframe
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      {/* Inner nucleus */}
      <mesh ref={nucleus}>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial ref={nucleusMat} color="#a5f3fc" transparent opacity={0.75} />
      </mesh>

      {/* Orbiting nodes */}
      {nodes.map((p, i) => (
        <Node key={i} base={p} index={i} pulse={pulse} />
      ))}

      {/* Faint synapse links */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>

      {/* Data rings */}
      <mesh ref={ring} rotation={[Math.PI / 2.15, 0.3, 0]}>
        <torusGeometry args={[3.05, 0.012, 8, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[3.45, 0.008, 8, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/** A single orbiting node with a trailing point light feel (cheap: emissive color only). */
function Node({
  base,
  index,
  pulse,
}: {
  base: THREE.Vector3;
  index: number;
  pulse: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // Nodes orbit slowly around their base position
    const speed = 0.25 + (index % 5) * 0.06;
    const angle = t * speed + index;
    m.position.set(
      base.x + Math.sin(angle) * 0.22,
      base.y + Math.cos(angle * 0.8) * 0.18,
      base.z + Math.cos(angle) * 0.22,
    );
    // React to click pulses
    const s = 1 + pulse.current * (0.6 + Math.sin(index * 1.7) * 0.4);
    m.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={base}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshBasicMaterial color={index % 3 === 0 ? "#a78bfa" : "#67e8f9"} />
    </mesh>
  );
}
