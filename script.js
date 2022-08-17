// threejs.org/docs/index.html#manual/en/introduction/Libraries-and-Plugins

import * as THREE from 'three'
//import * as CANNON from 'cannon-js'

import {FontLoader} from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/FontLoader.js'
import {ParametricGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/ParametricGeometry.js'
import {TextGeometry} from 'https://unpkg.com/three@0.143.0/examples/jsm/geometries/TextGeometry.js'
import {OrbitControls} from 'https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js'
// import * as CANNON from 'cannon-es'

//import {Project, Scene3D, PhysicsLoader} from 'enable3d'



// lil-gui: https://github.com/georgealways/lil-gui


function main() {

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  // document.body.appendChild( renderer.domElement )

  const fov = 40
  const aspect = 2  // the canvas default
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  const cameraDist = 100
  camera.position.z = cameraDist

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.add(new THREE.AxesHelper(5))

  //point light threejs.org/docs/#api/en/lights/PointLight
  /* const light = new THREE.PointLight( 0xffffff, 1, 0 )
  light.position.set( 0, 0, 0 )
  scene.add(light) */
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
  scene.add(box)

  
  // circles
  let circles = [
  //["name",                 x,  y,  r]
    ["eye",                  0,  0,  10],
    ["Big 14 Music Video",   0,  0,  9],
    ["BTS",                  0,  0,  8],
    ["merch",                0,  0,  7],
    ["tracklist",            0,  0,  6],
    ["presave",              0,  0,  5],
    ["random photos",        0,  0,  4],
    ["tour life",            0,  0,  4],
    ["fan letters",          0,  0,  3],
    ["QR code",              0,  0,  3],
    ["Twitch",               0,  0,  3],
    ["fan art",              0,  0,  3]
  ]
  const circleScale = 1
  
  function addCircle([name, x, z, r]) {
    let texture = new THREE.TextureLoader().load( name );
   var qrMaterial = new THREE.MeshBasicMaterial({
      map: qrTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    })
    
    let circleGeometry = new THREE.SphereGeometry(r, 32, 32, 0, Math.PI * 2, 0, 1)
    let circleMaterial = new THREE.MeshBasicMaterial( { map: qrTexture, toneMapped: false,} )
    let circle = new THREE.Mesh( circleGeometry, circleMaterial )
    circle.scale.set(circleScale, circleScale, circleScale)

    circle.position.x = x
    circle.position.y = 0
    circle.position.z = z

    //scene.add(circle)
    // circles.push(circle)
  }

  // addCircle("test", 0, 0, 5)
  
  //making circles 
  {
    // circles.foreach(addCircle())
  }
  

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

    video.play()
    spinVideo.play()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, pointOfIntersection)
    box.lookAt(pointOfIntersection)
    var intersects = raycaster.intersectObjects(scene.children)//, true )
    console.log(intersects[0].object.scale.x)
    if (intersects[0].object) {
      console.log("true")
      intersects[0].object.scale.x = 1.1
      intersects[0].object.scale.y = 1.1
      intersects[0].object.scale.z = 1.1
    }
    intersects.scale.x = 2
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
  //orld.addBody(planeBody)


  let video = document.getElementById('video')
  let videoTexture = new THREE.VideoTexture(video)

  var movieMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  })

  let spinVideo = document.getElementById('spinVideo')
  let spinVideoTexture = new THREE.VideoTexture(spinVideo)

  var spinMaterial = new THREE.MeshBasicMaterial({
    map: spinVideoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  })

  let qrTexture = new THREE.TextureLoader().load( "assets/circleQR.png" );
  var qrMaterial = new THREE.MeshBasicMaterial({
      map: qrTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    })
  //let movieGeometry = new THREE.BoxGeometry(100, 100, 100)
  //let movieGeometry = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, 1.2)
  let movieGeometry = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI, 0, Math.PI)
  let movieCubeScreen = new THREE.Mesh(movieGeometry, spinMaterial)
  movieCubeScreen.position.set(0, 10, 0)
  scene.add(movieCubeScreen)

  let movieGeometry2 = new THREE.CircleGeometry( 3, 32 );
  let movieCubeScreen2 = new THREE.Mesh(movieGeometry2, qrMaterial)
  movieCubeScreen2.position.set(-9, 14, 0)
  scene.add(movieCubeScreen2)

  let movieGeometry3 = new THREE.CircleGeometry( 3, 32 );//THREE.SphereGeometry(2, 32, 32, 0, Math.PI, 0, Math.PI)
  let movieCubeScreen3 = new THREE.Mesh(movieGeometry3, movieMaterial)
  movieCubeScreen3.position.set(7, 3, 0)
  scene.add(movieCubeScreen3)

  
  //sphere // eyeball    threejs.org/docs/?q=materi#api/en/geometries/SphereGeometry
  var sphereGeometry = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, 1.2)
  var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide} )
  var sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial )
  sphereMesh.geometry.translate(0,0,0)
  sphereMesh.geometry.rotateZ(Math.PI)
  sphereMesh.scale.set(1, 1, 1)
  //scene.add(sphereMesh)

  // const sphereShape = new CANNON.Sphere(30)
  // const sphereBody = new CANNON.Body({ mass: 0 })
  // sphereBody.addShape(sphereShape)
  // sphereBody.position.x = sphereMesh.position.x
  // sphereBody.position.y = sphereMesh.position.y
  // sphereBody.position.z = sphereMesh.position.z
  // world.addBody(sphereBody)

  //   renderer.domElement.addEventListener("keydown", function (e) {
  //     console.log("hello")
  //     if (e.code === "Enter") {
  //         console.log("hello")//checks whether the pressed key is "Enter"
  //         validate(e)
  //     }
  // })

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
    movieCubeScreen.quaternion.copy(camera.quaternion)
    movieCubeScreen2.quaternion.copy(camera.quaternion)
    movieCubeScreen3.quaternion.copy(camera.quaternion)

    videoTexture.needsUpdate = true
    spinVideoTexture.needsUpdate = true
    render()
      
    //const elapsedTime = clock.getElapsedTime()
    //particlesMesh.rotation.x = -mouseY * (elapsedTime *0.000008)
    //particlesMesh.rotation.y = mouseX * (elapsedTime *0.000008)
  }
  
  function render() {
      renderer.render(scene, camera)
  }
  
  animate()

  requestAnimationFrame(render) // needed?
}
main()