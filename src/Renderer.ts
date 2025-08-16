import * as THREE from 'three';

export function createRenderer(): THREE.WebGLRenderer {

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.style.margin = '0';
  document.body.appendChild(renderer.domElement);
  return renderer;
  
}
