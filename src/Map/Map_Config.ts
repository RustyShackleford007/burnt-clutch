import * as THREE from 'three';

export const MAPS = {
  blitzway: {
    name: 'blitzway',
    url: '/models/tracks/blitzway.glb',
    spawn: new THREE.Vector3(-35, 5, 140),
    scale: 1,
  },
  speedway: {
    name: 'speedway',
    url: '/models/tracks/speedway_edit.glb',
    spawn: new THREE.Vector3(770, 3, 435),
    scale: 0.8,
  },
  cherry_fields: {
    name: 'cherry_fields',
    url: '/models/tracks/cherry_fields.glb',
    spawn: new THREE.Vector3(22.6, 8, -78.6),
    scale: 70,
  }
}

export type MapKey = keyof typeof MAPS;