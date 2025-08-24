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
    spawn: new THREE.Vector3(200, 20, 770),
    scale: 0.8,
  },
  cherry_fields: {
    name: 'cherry_fields',
    url: '/models/tracks/cherry_fields.glb',
    spawn: new THREE.Vector3(115, 5, -23),
    scale: 70,
  }
}

export type MapKey = keyof typeof MAPS;