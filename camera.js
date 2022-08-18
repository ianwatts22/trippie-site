import * as THREE from 'three'
// import { TWEEN } from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js'

export function createCamera() {
  let fov = 40
  let aspect = 2  // the canvas default
  let near = 0.1
  let far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 0, 200)
  return camera
}

export function cameraMovements(camera) {
  const thisCamera = camera
  
  thisCamera.position.set(0, 0, 100)
  
  const time = 5000
  var cameraTween = new TWEEN.Tween(thisCamera.position).to({x: 1, y: 1, z: 40}, time)
  var cameraTween2 = new TWEEN.Tween(thisCamera.rotation).to({x: 0, y: 0, z: Math.PI * 2}, time)
  // .onComplete(() => {
  //   object.userData.isTweening = false;
  // });
  cameraTween.start();
  cameraTween2.start();
  
}