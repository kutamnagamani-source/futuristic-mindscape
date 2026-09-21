import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { pointer, scroll01, damp, smoothstep, zones } from "@/lib/pointer";
import { skillGroups } from "@/data/portfolio";

/**
 * Skill universe — one glowing torus per skill category, orbiting satellites,
 * drei Html labels. Fades/scales in as the camera reaches the skills zone and
 * dissolves as it leaves (via scroll-driven opacity + visibility).
 */
export function SkillRings({ isMobile }: { isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const center = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // drei <Html> ignores Three's `visible`, so rings (and their DOM labels)
  // unmount entirely when outside the skills zone.
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  // Skills zone from measured layout: fade in as the section arrives, out as it leaves
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const t = scroll01.v;
    const vis = smoothstep(zones.skills[0] - 0.08, zones.skills[0] + 0.06, t) *
      (1 - smoothstep(zones.skills[1], zones.skills[1] + 0.1, t));
    g.visible = vis > 0.01;
    const nowActive = vis > 0.01;
    if (nowActive !== activeRef.current) {
      activeRef.current = nowActive;
      setActive(nowActive);
    }
    g.scale.setScalar(damp(g.scale.x, vis, 3, d));
    g.position.y = damp(g.position.y, 1.2 + (1 - vis) * 2.5, 3, d);
    g.rotation.y = damp(g.rotation.y, pointer.x * 0.22 + t * 1.2, 2, d);
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.12, 2, d);
    if (center.current) {
      const m = center.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + vis * 0.2;
      center.current.rotation.y = state.clock.elapsedTime * 0.4;
      center.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={group} position={[-2.2, 1.2, -3.4]} visible={false}>
      {/* Faint central nucleus the rings orbit */}
      <mesh ref={center}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.3} wireframe />
      </mesh>

      {active &&
        skillGroups.map((g, i) => (
          <SkillRing
            key={g.id}
            index={i}
            total={skillGroups.length}
            label={g.label}
            accent={g.accent}
            skills={g.skills}
            isMobile={isMobile}
            hovered={hovered === g.id}
            onHover={(h) => setHovered(h ? g.id : null)}
          />
        ))}
    </group>
  );
}

function SkillRing({
  index,
  total,
  label,
  accent,
  skills,
  isMobile,
  hovered,
  onHover,
}: {
  index: number;
  total: number;
  label: string;
  accent: string;
  skills: readonly string[];
  isMobile: boolean;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const orbit = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (orbit.current) {
      orbit.current.rotation.z = t * (0.12 + index * 0.03) * (index % 2 === 0 ? 1 : -1);
    }
    if (tilt.current) {
      tilt.current.rotation.x = damp(
        tilt.current.rotation.x,
        hovered ? Math.sin(t) * 0.25 : Math.sin(index * 2.1) * 0.5,
        3,
        Math.min(dt, 0.05),
      );
      const target = hovered ? 1.18 : 1;
      tilt.current.scale.setScalar(damp(tilt.current.scale.x, target, 4, Math.min(dt, 0.05)));
    }
  });

  // Distribute rings on different orbital planes
  const radius = 1.05 + index * 0.38;
  const initialTilt = (index / total) * Math.PI * 0.9;

  return (
    <group ref={tilt} rotation={[initialTilt, index * 0.6, 0]}>
      <group ref={orbit}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(true);
          }}
          onPointerOut={() => onHover(false)}
        >
          <torusGeometry args={[radius, 0.008 + (hovered ? 0.006 : 0), 8, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.95 : 0.55} />
        </mesh>
        {/* Satellite orbs riding the ring */}
        {Array.from({ length: isMobile ? 1 : 2 }).map((_, k) => (
          <mesh key={k} position={[radius, 0, 0]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        ))}
      </group>

      {/* Html label */}
      <Html
        position={[Math.cos(index * 2.4) * (radius + 0.25), 0, Math.sin(index * 2.4) * (radius + 0.25)]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`font-mono-ui whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase transition-colors ${
            hovered ? "border-white/40 bg-white/10 text-white" : "border-white/15 bg-black/40 text-white/70"
          }`}
          style={{ color: hovered ? accent : undefined }}
        >
          {label}
        </div>
      </Html>

      {/* Tooltip on hover — desktop only (pointer events available) */}
      {hovered && !isMobile && (
        <Html center distanceFactor={10} zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <div className="pf-glass-strong pointer-events-none w-56 rounded-2xl p-3 text-left">
            <p className="font-mono-ui text-[10px] tracking-[0.2em] uppercase" style={{ color: accent }}>
              {label}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/85"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
