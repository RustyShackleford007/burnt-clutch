import { createCamera } from './Camera';
import { createRenderer } from './Renderer';
import { createScene } from './Scene';
import { initPhysics } from './Physics';
import { createGround, createFallingCube } from './Cube';
import { createCameraControls, updateCameraControls } from './Camera_Controls';

async function main() {
  const camera = createCamera();
  const renderer = createRenderer();
  const scene = createScene();
  const world = await initPhysics();

  let lastTime = performance.now();

  createCameraControls(camera, renderer.domElement);

  createGround(scene, world);
  const { cubeBody, cubeMesh } = createFallingCube(scene, world);

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // seconds
    lastTime = currentTime;

    world.step();

    const pos = cubeBody.translation();
    const rot = cubeBody.rotation();
    cubeMesh.position.set(pos.x, pos.y, pos.z);
    cubeMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

    updateCameraControls(camera, deltaTime); // update orbit controls
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
