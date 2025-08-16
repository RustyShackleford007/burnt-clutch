// src/Physics.ts
import * as RAPIER from '@dimforge/rapier3d-compat';

let world: RAPIER.World | null = null;

export async function initPhysics(): Promise<RAPIER.World> {
  await RAPIER.init();

  // Gravity pointing down Y
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  world = new RAPIER.World(gravity);

  return world;
}

export function stepPhysics(deltaTime: number = 1 / 60): void {
  if (!world) return;
  world.step();
}

export function getWorld(): RAPIER.World {
  if (!world) {
    throw new Error('Physics world not initialized! Call initPhysics() first.');
  }
  return world;
}

export function createDynamicBody(
  world: RAPIER.World,
  position: { x: number; y: number; z: number },
  colliderDesc: RAPIER.ColliderDesc
): RAPIER.RigidBody {
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    position.x,
    position.y,
    position.z
  );
  const body = world.createRigidBody(bodyDesc);
  world.createCollider(colliderDesc, body);
  return body;
}

export function createStaticBody(
  world: RAPIER.World,
  position: { x: number; y: number; z: number },
  colliderDesc: RAPIER.ColliderDesc
): RAPIER.RigidBody {
  const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    position.x,
    position.y,
    position.z
  );
  const body = world.createRigidBody(bodyDesc);
  world.createCollider(colliderDesc, body);
  return body;
}