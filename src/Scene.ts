import * as THREE from 'three';

export function addMountainRing(
  scene: THREE.Scene,
  {
    radius = 450,        // distance from center
    count = 120,         // how many peaks
    bandWidth = 120,     // random radial jitter so it’s not a perfect ring
    minH = 40,           // min height
    maxH = 110,          // max height
    inwardTiltDeg = 8    // small inward tilt for a nice silhouette
  } = {}
) {
  const baseHeight = 1;
  const geom = new THREE.ConeGeometry(1, baseHeight, 4); // 4 = low-poly “mountain”
  geom.rotateY(Math.PI / 4);
  geom.translate(0, baseHeight / 2, 0);
  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x556b2f,
    flatShading: true
  });

  const inst = new THREE.InstancedMesh(geom, mat, count);
  inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const up = new THREE.Vector3(0, 1, 0);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const axis = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const angJitter = (Math.random() - 0.5) * 0.06;
    const a = t + angJitter;

    const r = radius + (Math.random() - 0.5) * bandWidth;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    // random height & base width
    const h = THREE.MathUtils.lerp(minH, maxH, Math.random());
    const base = h * THREE.MathUtils.lerp(0.35, 0.7, Math.random());

    const inward = new THREE.Vector3(-x, 0, -z).normalize();
    const tilt = THREE.MathUtils.degToRad(inwardTiltDeg);
    axis.crossVectors(up, inward).normalize();
    q.setFromAxisAngle(axis, tilt);

    m.compose(
      new THREE.Vector3(x, 0, z),
      q,
      new THREE.Vector3(base, h, base)
    );
    inst.setMatrixAt(i, m);
  }

  inst.instanceMatrix.needsUpdate = true;
  scene.add(inst);

  if (!scene.fog) {
    scene.fog = new THREE.Fog(0x87ceeb, radius * 0.6, radius * 1.8);
  }
}

export function createScene(map_name: string): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const axesHelper = new THREE.AxesHelper(5);
  //scene.add(axesHelper);

  if (map_name == 'blitzway') {
    addMountainRing(scene, { radius: 600, count: 150, minH: 35, maxH: 120 });

    const floorGeom = new THREE.CircleGeometry(650, 128);
    floorGeom.rotateX(-Math.PI / 2);

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x224B1D,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.y = -1;
    floor.receiveShadow = true;
    floor.userData.noHitbox = true;
    scene.add(floor);
  }

  return scene;
}
