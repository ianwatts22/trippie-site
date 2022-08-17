import * as THREE from 'three'

export default function animate(callback) {
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
  requestAnimationFrame(animate)

  let delta = Math.min(clock.getDelta(), 0.1)

  circleArr.forEach(element => {
    element.quaternion.copy(camera.quaternion)
  });
  //videoTexture.needsUpdate = true
  
  TWEEN.update()
  render()
  function loop(time) {
    requestAnimationFrame(loop)
    callback(time)
  }
  requestAnimationFrame(loop)
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  const needResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight
  if (needResize) { renderer.setSize(width, height, false) }
  return needResize
}