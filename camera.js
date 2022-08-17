import * as THREE from 'three'
import { TWEEN } from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js'

export function createCamera() {
  let fov = 40
  let aspect = 2  // the canvas default
  let near = 0.1
  let far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  let cameraDist = 100
  camera.position.set(0, 0, cameraDist)
  return camera
}

export function cameraMovements(camera) {
  let cameraDist = 100
  camera.position.z = cameraDist
  
  var cameraTween = new TWEEN.Tween(camera.position).to({
    x: 1,
    y: 1,
    z: 1
  }, 5000)
}