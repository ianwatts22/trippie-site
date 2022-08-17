// threejs.org/docs/index.html#manual/en/introduction/Libraries-and-Plugins

import * as THREE from 'three'

import {FontLoader} from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/FontLoader.js'
import {ParametricGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/ParametricGeometry.js'
import {TextGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/TextGeometry.js'
import {OrbitControls} from 'https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js'
//import { TWEEN } from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js'
import {createCamera} from "./camera.js"
//import {animate} from "./animate.js"
import "./three.interaction.js"


// lil-gui: https://github.com/georgealways/lil-gui

function main() {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true})

  const camera = createCamera()

  var cameraTween = new TWEEN.Tween(camera.position).to({
    x: 1,
    y: 1,
    z: 1
  }, 5000)
  // .onComplete(() => {
  //   object.userData.isTweening = false;
  // });
  //cameraTween.start();

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  //scene.add(new THREE.AxesHelper(5))


  // pointer box
  var box = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshNormalMaterial())
  box.geometry.translate(0, 0, 0.5)
  box.scale.set(1, 1, 3)
  //scene.add(box)

  //eyeball
  let eyeTexture = new THREE.TextureLoader().load("assets/eyeball.png")

  var eyeMaterial = new THREE.MeshBasicMaterial({ map: eyeTexture, side: THREE.FrontSide, toneMapped: false, })
  var eyeGeometry = new THREE.SphereBufferGeometry(20, 32, 32)
  var eyeball = new THREE.Mesh(eyeGeometry, eyeMaterial)
  eyeball.position.set(0, 0, 30)
  scene.add(eyeball)

  // circles
  let circlesDescriptions = [
  //["name",                 x,  y,  r, link]
    ["assets/spinning.mp4",  0 , 0 , 6, "https://www.youtube.com/watch?v=_q-_q-_q-_q"],
    ["assets/clock.mp4"   ,  10, 5 , 4, "none"                                       ],
    ["assets/fanArt.mp4"  ,  3 , 10, 3, "none"                                       ],
    ["assets/eyes.mp4"    , -4 , 15, 4, "none"                                       ],
    ["assets/qrCode.png"  , -8 , 7 , 4, "none"                                       ],
  ]
  let circleArr = []

  function addCircle([name, x, y, r]) {
    let texture
    if (name.includes("mp4")) {
      let video = document.getElementById(name) //loading video texture *from HTML*
      video.play()
      texture = new THREE.VideoTexture(video)
    } else {
      texture = new THREE.TextureLoader().load(name) //loading image texture *from assets*
    }
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, toneMapped: false, })
    let geometry = new THREE.CircleGeometry (r, 32)
    let circle = new THREE.Mesh( geometry, material )
    
    circle.name = name
    circle.userData.isTweening = false
    circle.position.set(x, y, 0)

    scene.add(circle)
    circleArr.push(circle)
  }

  circlesDescriptions.forEach(element => {
    addCircle(element)
  });

  const raycaster = new THREE.Raycaster()
  var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -camera.position.z * .5)  // last number (optional) ("signed distance from the origin to the plane")
  var pointOfIntersection = new THREE.Vector3()
  var mouse = new THREE.Vector2()

  renderer.domElement.addEventListener('mousemove', onMouseMove, false)
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    eyeball.lookAt(pointOfIntersection)
    
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, pointOfIntersection)

    var intersects = raycaster.intersectObjects(scene.children)//, true )
    // if (intersects.length > 0) {
    //   let object = intersects[0].object
    //   if (object.userData.isTweening) return;
    //   var tweenInflate = new TWEEN.Tween(object.scale).to({
    //     x: 1.2,
    //     y: 1.2,
    //     z: 1.2
    //   }, 1500).easing(TWEEN.Easing.Elastic.Out).onStart(() => {
    //     object.userData.isTweening = true;
    //   });
    //   var tweenDeflate = new TWEEN.Tween(object.scale).to({
    //     x: 1,
    //     y: 1,
    //     z: 1
    //   }, 1000).onComplete(() => {
    //     object.userData.isTweening = false;
    //   });
    //   tweenInflate.chain(tweenDeflate);
    //   tweenInflate.start();
    // } else {
    //   circleArr.forEach(element => {
    //     var targetPosition = new THREE.Vector3(1, 1, 1);
    //     new TWEEN.Tween( element.scale )
    //     .to( targetPosition )
    //     .easing( TWEEN.Easing.Cubic.InOut )
    //     .start();

    //     //element.scale.set(1, 1, 1)
    //   });
    // }
  }

  renderer.domElement.addEventListener("click", onclick, true);
  function onclick(event) {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children)//, true )
    if (intersects.length > 0) {
      circlesDescriptions.forEach(element => {
        if (element[4] != "none"  && intersects[0].object.name === element[0]) {
          window.open(element[4], "_blank") //open link in new tab
        }
      });
    }
  }
  
  // orbit controls: threejs.org/docs/#examples/en/controls/OrbitControls
  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enableDamping = true
  controls.update()

  //resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  const clock = new THREE.Clock()
  var delta = Math.min(clock.getDelta(), 0.1)

  function animate() {  
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    requestAnimationFrame(animate)
  
  
    circleArr.forEach(element => {
      element.quaternion.copy(camera.quaternion)
    });
    //videoTexture.needsUpdate = true
    TWEEN.update()
    render()
      
    //const elapsedTime = clock.getElapsedTime()
    //particlesMesh.rotation.x = -mouseY * (elapsedTime *0.000008)
    //particlesMesh.rotation.y = mouseX * (elapsedTime *0.000008)
  }

  function render() { renderer.render(scene, camera) }
  
  animate()
  requestAnimationFrame(render) // needed?


  // animate((time) => {
  //   renderer.render(scene, camera)
  //   TWEEN.update(time)
  // })
}
main()