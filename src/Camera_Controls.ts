import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';

export function updateChaseCamera(
  camera: THREE.PerspectiveCamera,
  targetBody: RAPIER.RigidBody
) {
  const pos = targetBody.translation();

  // Offset camera (above and behind car)
  const offset = new THREE.Vector3(0, 8, 12); 

  // Convert Rapier position into THREE vector
  const targetPos = new THREE.Vector3(pos.x, pos.y, pos.z);

  // Place camera at offset from car
  camera.position.copy(targetPos).add(offset);

  // Look at car
  camera.lookAt(targetPos);
}