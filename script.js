// threejs.org/docs/index.html#manual/en/introduction/Libraries-and-Plugins

import * as THREE from 'three'

import {FontLoader} from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/FontLoader.js'
import {ParametricGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/ParametricGeometry.js'
import {TextGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/TextGeometry.js'
import {OrbitControls} from 'https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js'

// lil-gui: https://github.com/georgealways/lil-gui

function main() {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true})

  let fov = 40
  let aspect = 2  // the canvas default
  let near = 0.1
  let far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  let cameraDist = 100
  camera.position.z = cameraDist

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  //scene.add(new THREE.AxesHelper(5))

  const light2 = new THREE.PointLight( 0xffffff, 1, 100 )
  light2.position.set( 0, -100, 0 )
  scene.add(light2)
    {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(1, -2, -4)
    scene.add(light)
  }

  // box
  var box = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshNormalMaterial())
  box.geometry.translate(0, 0, 0.5)
  box.scale.set(1, 1, 3)
  //scene.add(box)

  // circles
  let circlesDescriptions = [
  //["name",                 x,  y,  r]
    ["assets/spinning.mp4",              0,  0,  6],
    ["assets/clock.mp4",                  10,  5,  4],
    ["assets/fanArt.mp4",                  3,  10,  3],
    ["assets/eyes.mp4",                  -4,  15,  4],
    ["assets/qrCode.png",                  -8,  7,  4],
  ]
  let circleArr = []

  function addCircle([name, x, z, r]) {
    let texture
    if (name.includes("mp4")) {
      console.log("to")
      //loading video texture *from HTML*
      let video = document.getElementById(name)
      video.play()
      texture = new THREE.VideoTexture(video)
    } else {
      //loading image texture *from assets*
      texture = new THREE.TextureLoader().load(name);
    }
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, toneMapped: false, })
    let geometry = new THREE.CircleGeometry (r, 32)
    let circle = new THREE.Mesh( geometry, material )
    circle.name = name

    circle.position.x = x
    circle.position.y = z
    circle.position.z = 0

    scene.add(circle)
    circleArr.push(circle)
  }

  circlesDescriptions.forEach(element => {
    addCircle(element)
  });
  

  //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
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

  
  const raycaster = new THREE.Raycaster()
  var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -cameraDist * .5)  // last number (optional) ("signed distance from the origin to the plane")
  var pointOfIntersection = new THREE.Vector3()
  var mouse = new THREE.Vector2()


  renderer.domElement.addEventListener('mousemove', onMouseMove, false)
  function onMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, pointOfIntersection)
    box.lookAt(pointOfIntersection)
    var intersects = raycaster.intersectObjects(scene.children)//, true )
    if (intersects.length > 0) {
      circleArr.forEach(element => {
        element.scale.x = 1
        element.scale.y = 1
        element.scale.z = 1
      });
      //console.log("intersects object")
      intersects[0].object.scale.x = 1.1
      intersects[0].object.scale.y = 1.1
      intersects[0].object.scale.z = 1.1
      console.log(intersects[0].object.name)
    }
  }

  renderer.domElement.addEventListener("click", onclick, true);
  var selectedObject;
  function onclick(event) {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children)//, true )
    if (intersects.length > 0) {
      //selectedObject = intersects[0];
      console.log(intersects[0].object.name)
      if (intersects[0].object.name === "assets/spinning.mp4") {
        console.log("spinning")
        window.open(
          "https://www.geeksforgeeks.org", "_blank");
      }
    }
  }
  
  
  
  // orbit controls: threejs.org/docs/#examples/en/controls/OrbitControls
  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enableDamping = true
  controls.update()

  //gravity
  const world = new CANNON.World()
  //world.gravity.set(0, -9.82, 0)

  const phongMaterial = new THREE.MeshPhongMaterial()
  const normalMaterial = new THREE.MeshNormalMaterial()

  //cube
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
  cubeMesh.position.x = -3
  cubeMesh.position.y = 3
  cubeMesh.castShadow = true
  //scene.add(cubeMesh)
  
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const cubeBody = new CANNON.Body({ mass: 1 })
  cubeBody.addShape(cubeShape)
  cubeBody.position.x = cubeMesh.position.x
  cubeBody.position.y = cubeMesh.position.y
  cubeBody.position.z = cubeMesh.position.z
  //world.addBody(cubeBody)

  //plane
  const planeGeometry = new THREE.PlaneGeometry(25, 25)
  const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.receiveShadow = true
  //scene.add(planeMesh)

  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0 })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  //world.addBody(planeBody)


  const clock = new THREE.Clock()
  let delta

  function animate() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    requestAnimationFrame(animate)

    // controls.update()
    //const time = clock.getDelta()
    delta = Math.min(clock.getDelta(), 0.1)

    world.step(delta)
    cubeMesh.position.set(
        cubeBody.position.x,
        cubeBody.position.y,
        cubeBody.position.z
    )

    circleArr.forEach(element => {
      element.quaternion.copy(camera.quaternion)
    });
    
    //videoTexture.needsUpdate = true
    //spinVideoTexture.needsUpdate = true
    render()
      
    //const elapsedTime = clock.getElapsedTime()
    //particlesMesh.rotation.x = -mouseY * (elapsedTime *0.000008)
    //particlesMesh.rotation.y = mouseX * (elapsedTime *0.000008)
  }
  
  function render() { renderer.render(scene, camera) }
  
  animate()
  requestAnimationFrame(render) // needed?
}
main()