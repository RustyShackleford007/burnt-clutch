import RAPIER from '@dimforge/rapier3d-compat';

export async function initPhysics(): Promise<RAPIER.World> {
  await RAPIER.init();
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const world = new RAPIER.World(gravity);
  return world;
}
