export type CarStats = {
  speed: number;
  accel: number;
  turnSpeed: number;
  r_speed: number;
  r_accel: number;
  longSpeed: number;
  coastDecel: number;
  brakeDecel: number;
  scale: number;
};

export const VEHICLES = {
  truck: {
    url: '/models/cars/truck.glb',
    stats: {
      speed: 20,
      accel: 5,
      turnSpeed: 1.5,
      r_speed: 8,
      r_accel: 2.5,
      longSpeed: 0,
      coastDecel: 3,
      brakeDecel: 10,
      scale: 1
    }
  },
  corvette: {
    url: '/models/cars/corvette.glb',
    stats: {
      speed: 30,
      accel: 6,
      turnSpeed: 2.2,
      r_speed: 8,
      r_accel: 2.5,
      longSpeed: 0,
      coastDecel: 3,
      brakeDecel: 13,
      scale: 1
    }
  },
  quattro: {
    url: '/models/cars/quattro.glb',
    stats: {
      speed: 25,
      accel: 7,
      turnSpeed: 2.2, 
      r_speed: 8,
      r_accel: 2.5,
      longSpeed: 0,
      coastDecel: 3,
      brakeDecel: 10,
      scale: 150
    }
  },
  e82: {
    url: '/models/cars/E82.glb',
    stats: {
      speed: 28,
      accel: 13,
      turnSpeed: 2.5, 
      r_speed: 8,
      r_accel: 2.5,
      longSpeed: 0,
      coastDecel: 3,
      brakeDecel: 15,
      scale: 1.2
    }
  },
  silvia: {
    url: '/models/cars/silvia.glb',
    stats: {
      speed: 25,
      accel: 5,
      turnSpeed: 3, 
      r_speed: 8,
      r_accel: 2.5,
      longSpeed: 0,
      coastDecel: 3,
      brakeDecel: 10,
      scale: 150
    }
  }
} satisfies Record<string, { url: string; stats: CarStats }>;

export type VehicleKey = keyof typeof VEHICLES;