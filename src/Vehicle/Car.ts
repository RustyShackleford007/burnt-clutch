import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getWorld, createDynamicBody } from './../Physics';
import { CarStats } from './Vehicle_Config';

export class Car {
  public body!: RAPIER.RigidBody;
  public mesh!: THREE.Object3D;

  private speed = 20;
  private accel = 5;
  private turnSpeed = 1.5;

  private r_speed = 8;
  private r_accel = 2.5;

  private longSpeed = 0;        // signed forward vel
  private coastDecel = 3;       // deceleration when no key held

  private brakeDecel = 10;

  private input = { forward: false, backward: false, left: false, right: false };

  private constructor() {}

  private static readonly DEFAULT_STATS: CarStats = {
    speed: 20,
    accel: 5,
    turnSpeed: 1.5,
    r_speed: 8,
    r_accel: 2.5,
    longSpeed: 0,
    coastDecel: 3,
    brakeDecel: 10,
    scale: 1
  };

  static async create(scene: THREE.Scene, modelUrl: string, spawn: THREE.Vector3, stats?: Partial<CarStats>): Promise<Car> {

    const car = new Car();
    const merged: CarStats = { ...Car.DEFAULT_STATS, ...(stats ?? {}) };
    car.speed = merged.speed;
    car.accel = merged.accel;
    car.turnSpeed = merged.turnSpeed;
    car.r_speed = merged.r_speed;
    car.r_accel = merged.r_accel;
    car.longSpeed = merged.longSpeed;
    car.coastDecel = merged.coastDecel;
    car.brakeDecel = merged.brakeDecel;

    const world = getWorld();

    const loader = new GLTFLoader();
    const mesh = await new Promise<THREE.Object3D>((resolve, reject) => {
      loader.load(modelUrl, (g) => resolve(g.scene), undefined, reject);
    });
    car.mesh = mesh;
    car.mesh.scale.set(merged.scale, merged.scale, merged.scale);   // scale
    scene.add(car.mesh);

    car.mesh.updateWorldMatrix(true, true);
    const bbox = new THREE.Box3().setFromObject(car.mesh);
    const size = new THREE.Vector3(); bbox.getSize(size);

    const collider = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
    car.body = createDynamicBody(getWorld(), spawn, collider);       // spawn location

    car.body.lockRotations(true, true);

    window.addEventListener('keydown', (e) => car.onKey(e.code, true));
    window.addEventListener('keyup', (e) => car.onKey(e.code, false));

    return car;
  }

  private onKey(code: string, isDown: boolean) {
    switch (code) {
      case 'KeyW': this.input.forward = isDown; break;
      case 'KeyS': this.input.backward = isDown; break;
      case 'KeyA': this.input.left = isDown; break;
      case 'KeyD': this.input.right = isDown; break;
    }
    this.body.wakeUp();
  }

  update(deltaTime: number) {
    const linvel = this.body.linvel();
  
    const moveToward = (value: number, target: number, maxDelta: number) => {
      const delta = target - value;
      if (Math.abs(delta) <= maxDelta) return target;
      return value + Math.sign(delta) * maxDelta;
    };
  
    const wantFwd = this.input.forward && !this.input.backward;
    const wantRev = this.input.backward && !this.input.forward;
  
    let targetSpeed = 0;
    if (wantFwd) targetSpeed = this.speed;
    else if (wantRev) targetSpeed = -this.r_speed;
  
    let rampRate = this.coastDecel;
    if (wantFwd) {
      rampRate = (this.longSpeed < 0) ? this.brakeDecel : this.accel;
    } else if (wantRev) {
      rampRate = (this.longSpeed > 0) ? this.brakeDecel : this.r_accel;
    }
  
    this.longSpeed = moveToward(this.longSpeed, targetSpeed, rampRate * deltaTime);
    if (Math.abs(this.longSpeed) < 1e-3) this.longSpeed = 0;

    let turnDir = 0;
    if (this.input.left)  turnDir += 1;
    if (this.input.right) turnDir -= 1;

    const rot = this.body.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
  
    this.body.wakeUp();
  
    this.body.setLinvel(
      { x: forward.x * this.longSpeed, y: linvel.y, z: forward.z * this.longSpeed },
      true
    );
  
    if (turnDir !== 0 && this.longSpeed !== 0) {
      const speedSign = Math.sign(this.longSpeed);
      const speedAbs  = Math.abs(this.longSpeed);
      const maxForDir = speedSign > 0 ? this.speed : this.r_speed;
  
      const minTurnFactor = 0.2;
      const steerScale = THREE.MathUtils.clamp(speedAbs / maxForDir, minTurnFactor, 1);
  
      const angle = turnDir * this.turnSpeed * deltaTime * speedSign * steerScale;
      const turnQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0, 'YXZ'));
      quat.multiply(turnQ);
      this.body.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
    }
  
    const pos = this.body.translation();
    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.quaternion.copy(quat);
  }  
}
