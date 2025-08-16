import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export function createGround(scene: THREE.Scene, world: RAPIER.World) {
  const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const groundCollider = RAPIER.ColliderDesc.cuboid(30, 0.1, 30).setFriction(1.0);
  world.createCollider(groundCollider, groundBody);

  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(60, 0.2, 60),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  groundMesh.position.y = -0.1;
  scene.add(groundMesh);
}
