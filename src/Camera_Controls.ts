import * as THREE from 'three';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const speed = 5; // units per second

let yaw = 0;   // horizontal rotation
let pitch = 0; // vertical rotation

// Call this to initialize camera controls
export function createCameraControls(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
  // Request pointer lock on click
  domElement.addEventListener('click', () => {
    domElement.requestPointerLock();
  });

  // Keyboard input
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW': moveForward = true; break;
      case 'KeyS': moveBackward = true; break;
      case 'KeyA': moveLeft = true; break;
      case 'KeyD': moveRight = true; break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW': moveForward = false; break;
      case 'KeyS': moveBackward = false; break;
      case 'KeyA': moveLeft = false; break;
      case 'KeyD': moveRight = false; break;
    }
  });

  // Pointer lock mouse movement
  const onMouseMove = (event: MouseEvent) => {
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    yaw -= movementX * 0.002;   // sensitivity
    pitch -= movementY * 0.002;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // clamp vertical
  };

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === domElement) {
      document.addEventListener('mousemove', onMouseMove);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
    }
  });

  return camera;
}

// Call each frame with deltaTime in seconds
export function updateCameraControls(camera: THREE.PerspectiveCamera, deltaTime: number) {
  // Apply rotation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
  camera.quaternion.copy(quaternion);

  // Apply movement
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const moveDistance = speed * deltaTime;

  if (moveForward) camera.position.add(forward.clone().multiplyScalar(moveDistance));
  if (moveBackward) camera.position.add(forward.clone().multiplyScalar(-moveDistance));
  if (moveLeft) camera.position.add(right.clone().multiplyScalar(-moveDistance));
  if (moveRight) camera.position.add(right.clone().multiplyScalar(moveDistance));
}