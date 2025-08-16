// src/Car.ts
import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getWorld, createDynamicBody } from './Physics';

export class Car {
  public body: RAPIER.RigidBody;
  public mesh?: THREE.Object3D;

  private speed = 10;        // forward speed
  private turnSpeed = 1.5;   // radians per second

  private input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  constructor(scene: THREE.Scene) {
    const world = getWorld();

    // Physics body (rough cuboid shape for car)
    const collider = RAPIER.ColliderDesc.cuboid(1, 0.5, 2);
    this.body = createDynamicBody(world, { x: 0, y: 5, z: 0 }, collider);

    // Lock car from tipping over
    this.body.lockRotations(true, true);

    // --- Load car model (GLB) ---
    const loader = new GLTFLoader();
    loader.load('./../public/models/cars/truck.glb', (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.scale.set(1, 1, 1); // tweak scaling if too big/small
      scene.add(this.mesh);
    });

    // Input listeners
    window.addEventListener('keydown', (e) => this.onKey(e.code, true));
    window.addEventListener('keyup', (e) => this.onKey(e.code, false));
  }

  private onKey(code: string, isDown: boolean) {
    switch (code) {
      case 'KeyW': this.input.forward = isDown; break;
      case 'KeyS': this.input.backward = isDown; break;
      case 'KeyA': this.input.left = isDown; break;
      case 'KeyD': this.input.right = isDown; break;
    }
  }

  public update(deltaTime: number) {
    const linvel = this.body.linvel();
    let forwardSpeed = 0;
    let turnDir = 0;

    if (this.input.forward) forwardSpeed += this.speed;
    if (this.input.backward) forwardSpeed -= this.speed;
    if (this.input.left) turnDir += 1;
    if (this.input.right) turnDir -= 1;

    // Car’s facing direction
    const rot = this.body.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);

    // Apply velocity
    const newVel = {
      x: forward.x * forwardSpeed,
      y: linvel.y,
      z: forward.z * forwardSpeed,
    };
    this.body.setLinvel(newVel, true);

    // Steering
    if (turnDir !== 0 && (this.input.forward || this.input.backward)) {
      const angle = turnDir * this.turnSpeed * deltaTime;
      const euler = new THREE.Euler(0, angle, 0, 'YXZ');
      const turnQuat = new THREE.Quaternion().setFromEuler(euler);
      quat.multiply(turnQuat);
      this.body.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
    }

    // --- Sync GLB mesh to physics body ---
    if (this.mesh) {
      const pos = this.body.translation();
      this.mesh.position.set(pos.x, pos.y, pos.z);
      this.mesh.quaternion.copy(quat);
    }
  }
}