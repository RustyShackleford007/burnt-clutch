import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function loadTrack(
  scene: THREE.Scene,
  world: RAPIER.World,
  url: string,
  scale: number
): Promise<void> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene || new THREE.Group();
  root.scale.setScalar(scale);
  scene.add(root);

  const verts: number[] = [];
  const inds: number[] = [];

  root.updateWorldMatrix(true, true);
  root.traverse((obj) => {
    const isMesh = (obj as any).isMesh === true;
    const isSkinned = (obj as any).isSkinnedMesh === true;
    if (!isMesh || isSkinned) return;

    const mesh = obj as THREE.Mesh;
    const srcGeo = mesh.geometry as THREE.BufferGeometry;
    const hasPos = !!srcGeo && !!srcGeo.getAttribute('position');
    if (!hasPos) return;

    const g = srcGeo.clone();
    g.applyMatrix4(mesh.matrixWorld);

    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position') g.deleteAttribute(name as keyof typeof g.attributes);
    }
    g.morphAttributes = {};
    g.clearGroups();

    const pos = g.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!pos || pos.itemSize !== 3) { g.dispose(); return; }

    const base = verts.length / 3;
    for (let i = 0; i < pos.count; i++) {
      verts.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    }

    const index = g.getIndex() as THREE.BufferAttribute | null;
    if (index) {
      for (let i = 0; i < index.count; i++) inds.push(base + index.getX(i));
    } else {
      for (let i = 0; i < pos.count; i++) inds.push(base + i);
    }

    g.dispose();
  });

  if (verts.length === 0 || inds.length === 0) return;

  const vertices = new Float32Array(verts);
  const indices = new Uint32Array(inds);

  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const collider = RAPIER.ColliderDesc.trimesh(vertices, indices)
    .setFriction(1.0)
    .setRestitution(0.0);

  world.createCollider(collider, body);
}
