import { Euler, Spherical, Vector3 } from 'three';

// Framing from the Blender camera (see studio01.png). Rotation + FOV kept
// exactly; position is dollied back 10% and panned left so the desk shifts
// right and the mug is the last element visible on the right edge.
const CAMERA_ROTATION: [number, number, number] = [-0.139, -0.078, -0.011];
const BASE_POSITION = new Vector3(0.109, 1.456, 3.441);
const DOLLY_BACK = 0.1;
const PAN_LEFT = 0.42;
// Extra nudge, as a fraction of the camera distance.
const NUDGE_LEFT = 0.01;
const NUDGE_UP = 0.005;

const CAMERA_EULER = new Euler(...CAMERA_ROTATION, 'XYZ');

export const CAMERA_FOV = 22.895;

export const CAMERA_POSITION: [number, number, number] = (() => {
  const dist = BASE_POSITION.length();
  const back = new Vector3(0, 0, 1).applyEuler(CAMERA_EULER);
  const right = new Vector3(1, 0, 0).applyEuler(CAMERA_EULER);
  const up = new Vector3(0, 1, 0).applyEuler(CAMERA_EULER);
  const pos = BASE_POSITION.clone()
    .addScaledVector(back, dist * DOLLY_BACK)
    .addScaledVector(right, -PAN_LEFT)
    .addScaledVector(right, -dist * NUDGE_LEFT)
    .addScaledVector(up, dist * NUDGE_UP);
  return [pos.x, pos.y, pos.z];
})();

// Horizontal orbit only: ±3% of a full turn (≈ ±11°) from the Blender framing.
const ORBIT_RANGE = 0.03 * Math.PI * 2;

export const ORBIT_TARGET: [number, number, number] = (() => {
  const pos = new Vector3(...CAMERA_POSITION);
  const forward = new Vector3(0, 0, -1).applyEuler(CAMERA_EULER);
  const target = pos.clone().addScaledVector(forward, 3);
  return [target.x, target.y, target.z];
})();

export const ORBIT_LIMITS = (() => {
  const pos = new Vector3(...CAMERA_POSITION);
  const target = new Vector3(...ORBIT_TARGET);
  const spherical = new Spherical().setFromVector3(pos.clone().sub(target));
  return {
    minAzimuth: spherical.theta - ORBIT_RANGE,
    maxAzimuth: spherical.theta + ORBIT_RANGE,
    polar: spherical.phi,
  };
})();
