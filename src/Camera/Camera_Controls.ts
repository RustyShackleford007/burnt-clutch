import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';

let targetAz = 0;   // azimuth (rad)
let targetEl = 0;   // elevation (rad)
let az = 0;         // smoothed azimuth
let el = 0;         // smoothed elevation

let MAX_AZ = THREE.MathUtils.degToRad(15); // left/right limit
let MAX_EL = THREE.MathUtils.degToRad(15); // up/down limit (same amount)
let SENS = 0.002;                          // radians per pixel
let SMOOTH = 0.15;                         // 0..1, higher = snappier
let RADIUS = 12;                           // orbit radius behind car
let HEIGHT = 8;                            // orbit center height above car
let LOOK_AHEAD = 5;                        // how far ahead to look

export function enableChaseCameraMouse(
  domElement: HTMLElement,
  opts?: {
    maxDegrees?: number;
    sensitivity?: number;
    smooth?: number;
    radius?: number;
    height?: number;
    lookAhead?: number;
  }
) {
  if (opts?.maxDegrees !== undefined) {
    MAX_AZ = THREE.MathUtils.degToRad(opts.maxDegrees);
    MAX_EL = THREE.MathUtils.degToRad(opts.maxDegrees);
  }
  if (opts?.sensitivity !== undefined) SENS = opts.sensitivity;
  if (opts?.smooth !== undefined) SMOOTH = opts.smooth;
  if (opts?.radius !== undefined) RADIUS = opts.radius;
  if (opts?.height !== undefined) HEIGHT = opts.height;
  if (opts?.lookAhead !== undefined) LOOK_AHEAD = opts.lookAhead;

  const onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== domElement) return;
    targetAz = THREE.MathUtils.clamp(targetAz - e.movementX * SENS, -MAX_AZ, MAX_AZ);
    targetEl = THREE.MathUtils.clamp(targetEl - e.movementY * SENS, -MAX_EL, MAX_EL);
  };

  domElement.addEventListener('click', () => domElement.requestPointerLock());

  const onLockChange = () => {
    if (document.pointerLockElement === domElement) {
      document.addEventListener('mousemove', onMouseMove);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
    }
  };

  document.addEventListener('pointerlockchange', onLockChange);
}

export function updateChaseCamera(
  camera: THREE.PerspectiveCamera,
  targetBody: RAPIER.RigidBody
) {
  const p = targetBody.translation();
  const r = targetBody.rotation();
  const carQ = new THREE.Quaternion(r.x, r.y, r.z, r.w);

  az += (targetAz - az) * SMOOTH;
  el += (targetEl - el) * SMOOTH;

  const yawOnly = new THREE.Euler().setFromQuaternion(carQ, 'YXZ').y;
  const yawQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawOnly, 0, 'YXZ'));

  const carPos = new THREE.Vector3(p.x, p.y, p.z);
  const centerLocal = new THREE.Vector3(0, HEIGHT, 0);
  const centerWorld = centerLocal.clone().applyQuaternion(yawQ).add(carPos);

  const base = new THREE.Vector3(0, 0, -RADIUS);

  const pitchQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), el);
  const spinQ  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), az);

  const offsetLocal = base.clone().applyQuaternion(pitchQ).applyQuaternion(spinQ);

  const offsetWorld = offsetLocal.applyQuaternion(yawQ);
  const desiredPos = centerWorld.clone().add(offsetWorld);

  camera.position.lerp(desiredPos, 0.2);

  const lookLocal = new THREE.Vector3(0, 0, LOOK_AHEAD).applyQuaternion(yawQ);
  camera.lookAt(carPos.clone().add(lookLocal));
  camera.up.set(0, 1, 0);
}

