import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, scroll01, damp, smoothstep } from "@/lib/pointer";

/** Scroll-driven camera path waypoints (position, lookAt, fov). */
const WAYPOINTS: { pos: [number, number, number]; look: [number, number, number]; fov: number }[] = [
  { pos: [0, 0.4, 10], look: [0, 0.2, 0], fov: 45 }, // Hero — facing the core
  { pos: [5.2, 1.2, 5.2], look: [1.5, 0.6, -1], fov: 48 }, // About — sweeping right, past shards
  { pos: [-4.6, 2.6, -1.8], look: [-2.2, 1.2, -3.4], fov: 50 }, // Skills — behind-left, looking at rings
  { pos: [1.2, -1.6, -9.5], look: [0, -0.4, -14.5], fov: 55 }, // Contact — toward the portal
];

export function CameraRig() {
  const desired = useRef(new THREE.Vector3(...WAYPOINTS[0]!.pos));
  const desiredLook = useRef(new THREE.Vector3(...WAYPOINTS[0]!.look));
  const pos = useRef(new THREE.Vector3(...WAYPOINTS[0]!.pos));
  const look = useRef(new THREE.Vector3(...WAYPOINTS[0]!.look));
  const fov = useRef(WAYPOINTS[0]!.fov);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const t = Math.min(1, Math.max(0, scroll01.v));
    const { current: posV } = pos;
    const { current: lookV } = look;

    // Map global scroll progress onto the waypoint path
    const seg = t * (WAYPOINTS.length - 1);
    const i = Math.min(Math.floor(seg), WAYPOINTS.length - 2);
    const f = seg - i;
    const a = WAYPOINTS[i]!;
    const b = WAYPOINTS[i + 1]!;
    const s = smoothstep(0, 1, f); // ease within each segment

    desired.current.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * s,
      a.pos[1] + (b.pos[1] - a.pos[1]) * s,
      a.pos[2] + (b.pos[2] - a.pos[2]) * s,
    );
    desiredLook.current.set(
      a.look[0] + (b.look[0] - a.look[0]) * s,
      a.look[1] + (b.look[1] - a.look[1]) * s,
      a.look[2] + (b.look[2] - a.look[2]) * s,
    );

    // Mouse parallax — small, lerped offsets for a filmic feel
    posV.x = damp(posV.x, desired.current.x + pointer.x * 0.45, 3, d);
    posV.y = damp(posV.y, desired.current.y + pointer.y * 0.3, 3, d);
    posV.z = damp(posV.z, desired.current.z, 3, d);
    lookV.x = damp(lookV.x, desiredLook.current.x + pointer.x * 0.35, 4, d);
    lookV.y = damp(lookV.y, desiredLook.current.y + pointer.y * 0.25, 4, d);
    lookV.z = damp(lookV.z, desiredLook.current.z, 4, d);

    state.camera.position.copy(posV);
    state.camera.lookAt(lookV);

    const cam = state.camera as THREE.PerspectiveCamera;
    fov.current = damp(fov.current, a.fov + (b.fov - a.fov) * s, 3, d);
    cam.fov = fov.current;
    cam.updateProjectionMatrix();
  });

  return null;
}
