import * as THREE from 'three';

let FOV = 75;

export function createCamera(): THREE.PerspectiveCamera {

  const camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // x, y, z
  camera.position.set(2, 5, 10);

  return camera;
}
