import * as THREE from 'three'

// circles
let circlesDescriptions = [
  //["name",                 x,  y,  r, link]
  ["assets/spinning.mp4", 0, 0, 6, "https://www.youtube.com/watch?v=_q-_q-_q-_q"],
  ["assets/clock.mp4", 10, 5, 4, "none"],
  ["assets/fanArt.mp4", 3, 10, 3, "none"],
  ["assets/eyes.mp4", -4, 15, 4, "none"],
  ["assets/qrCode.png", -8, 7, 4, "none"],
]
let circleArr = []

function addCircle([name, x, z, r]) {
  let texture
  if (name.includes("mp4")) {
    //loading video texture *from HTML*
    let video = document.getElementById(name)
    video.play()
    texture = new THREE.VideoTexture(video)
  } else {
    //loading image texture *from assets*
    texture = new THREE.TextureLoader().load(name);
  }
  var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, toneMapped: false, })
  let geometry = new THREE.CircleGeometry(r, 32)
  let circle = new THREE.Mesh(geometry, material)
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