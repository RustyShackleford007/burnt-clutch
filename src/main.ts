import { createCamera } from './Camera/Camera';
import { createRenderer } from './Renderer';
import { createScene } from './Scene';
import { initPhysics, stepPhysics } from './Physics';
import { Car } from './Vehicle/Car';
import { updateChaseCamera, enableChaseCameraMouse } from './Camera/Camera_Controls';
import { loadTrack } from './Map/Track';
import * as THREE from 'three';
import * as VEHICILE from './Vehicle/Vehicle_Config';
import * as MAP from './Map/Map_Config'

THREE.DefaultLoadingManager.onStart   = () => { const t = document.getElementById('loadingText'); if (t) t.textContent = 'Loading…'; };
THREE.DefaultLoadingManager.onProgress= (_u,l,t) => { const x = document.getElementById('loadingText'); if (x && t) x.textContent = `Loading… ${Math.floor((l/t)*100)}%`; };
THREE.DefaultLoadingManager.onLoad    = () => { const t = document.getElementById('loadingText'); if (t) t.textContent = 'Ready!'; };

async function startGame(selectedVehicle: VEHICILE.VehicleKey, selectedMap: MAP.MapKey) {

  const camera = createCamera();
  const renderer = createRenderer();
  const scene = createScene(MAP.MAPS[selectedMap].name);
  const world = await initPhysics();

  const car = await Car.create(scene, VEHICILE.VEHICLES[selectedVehicle].url, MAP.MAPS[selectedMap].spawn, VEHICILE.VEHICLES[selectedVehicle].stats);

  renderer.domElement.tabIndex = 0;
  renderer.domElement.focus();
  enableChaseCameraMouse(renderer.domElement, { maxDegrees: 18, sensitivity: 0.0025 });
  renderer.domElement.requestPointerLock?.();

  let lastTime = performance.now();

  await loadTrack(scene, world, MAP.MAPS[selectedMap].url, MAP.MAPS[selectedMap].scale);

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
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

window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay')!;
  const readyBtn = document.getElementById('readyBtn') as HTMLButtonElement;

  let selectedVehicle: VEHICILE.VehicleKey | null = null;
  let selectedMap: MAP.MapKey | null = null;

  function updateReadyState() {
    readyBtn.disabled = !(selectedVehicle && selectedMap);
  }
  function makeSelectable(groupEl: HTMLElement, attr: 'vehicle' | 'map') {
    groupEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button') as HTMLButtonElement | null;
      if (!btn) return;
      groupEl.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
      if (attr === 'vehicle') selectedVehicle = btn.dataset.vehicle as VEHICILE.VehicleKey;
      else selectedMap = btn.dataset.map as MAP.MapKey;
      updateReadyState();
    });
  }

  makeSelectable(document.getElementById('vehicleChoices')!, 'vehicle');
  makeSelectable(document.getElementById('mapChoices')!, 'map');

  readyBtn.addEventListener('click', async () => {
    if (!selectedVehicle || !selectedMap) return;
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 360);
    await startGame(selectedVehicle, selectedMap);
  });
});