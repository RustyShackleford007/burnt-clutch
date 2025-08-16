import { createCamera } from './Camera';
import { createRenderer } from './Renderer';
import { createScene } from './Scene';
import { initPhysics, stepPhysics } from './Physics';
import { createGround } from './Cube';
import { Car } from './Car';
import { updateChaseCamera } from './Camera_Controls';

async function main() {
  const camera = createCamera();
  const renderer = createRenderer();
  const scene = createScene();
  const world = await initPhysics();
  const car = new Car(scene);

  let lastTime = performance.now();

  createGround(scene, world);

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // seconds
    lastTime = currentTime;

    stepPhysics();
    car.update(deltaTime);

    updateChaseCamera(camera, car.body);
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
