import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export function createGround(scene: THREE.Scene, world: RAPIER.World) {
  const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const groundCollider = RAPIER.ColliderDesc.cuboid(10, 0.1, 10).setFriction(1.0);
  world.createCollider(groundCollider, groundBody);

  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.2, 20),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  groundMesh.position.y = -0.1;
  scene.add(groundMesh);
}

export function createFallingCube(scene: THREE.Scene, world: RAPIER.World) {
  const cubeBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0)
  );
  const cubeCollider = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setFriction(0.8);
  world.createCollider(cubeCollider, cubeBody);

  const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(cubeMesh);

  return { cubeBody, cubeMesh };
}
