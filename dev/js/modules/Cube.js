export default class Cube {
  constructor(){
    this.cubes = []
    this.tex
    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.windowHalfX =  this.Width / 2
    this.windowHalfY = this.Height / 2
  }

  init(texture){
    this._initCube(texture)
  }

  _initCube(texture, camera, project=false){
    let scale = 200

    // const scale = 0.00001
    const geometry = new THREE.BoxGeometry(scale, scale, 1)
    geometry.computeBoundingBox()
    const material = new THREE.MeshPhongMaterial({
      color: '#ffffff',
      shading: THREE.FlatShading,
      map: THREE.ImageUtils.loadTexture(texture)
    })

    this.mesh = new THREE.Mesh(geometry, material)
    if(!project){
      scale = 0.0001
      this.mesh.scale.set(scale, scale, scale)
      // this.mesh.position.set(0,0,2200)
      this.mesh.position.copy( camera.position )
      this.mesh.rotation.copy( camera.rotation )
      this.mesh.translateZ(-1000)
      // this.mesh.translateX(this.windowHalfX / 3 )

      TweenMax.to(this.mesh.scale,  .4, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        ease: Power2.In,
        delay: 0.1
      })
      TweenMax.to(this.mesh.rotation, 5, {
        // x: Math.PI * 2,
        y: "+=" + Math.PI * 2,
        // z: - Math.PI *2,
        ease: Power0.easeNone,
        repeat: -1
      })
    }else{
      const scale = 1.5
      this.mesh.position.set(0,0,2000)
      this.mesh.scale.set(scale, scale, scale)
    }
    return this.mesh
  }

  _removeCube(){
    TweenMax.to(this.mesh.position, .5, {
      z: 3500,
      ease: Cubic.In
    })
    let thisMesh = this.mesh
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(thisMesh);
          this.cubes.shift()
      }, 500);
    })
  }


  _getObjects(){
    return this.mesh
  }
}
