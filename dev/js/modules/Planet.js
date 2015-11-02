import {GetColor} from './Util'

export default class Planet {
  constructor(type, radius, detail) {
    this.type = type
    this.radius = radius
    this.detail = detail
  }

  init(){
    this._initPlanet()
  }

  _initPlanet(){
    // IcosahedronGeometry　
    switch (this.type) {
      case 'EarthLand':
        this.colors = ['80C8FF']
        this.geometry = new THREE.IcosahedronGeometry(100, 2)
        break;
      case 'EarthSea':
        this.colors = ['69C044']
        this.geometry = new THREE.IcosahedronGeometry(100, 2)
        break;
      case'EarthCloud':
        this.colors = ['ffffff']
        this.geometry = new THREE.IcosahedronGeometry(99, 2)
        this.opacity = 0.8
        break;
      case 'Fire':
        this.colors = ['f7461f', 'e95b2f', 'cd3006']
        this.geometry = new THREE.OctahedronGeometry(60, 4)
        break;
      case 'Sea':
        this.colors = ['cdd8e7', 'f2ede6', 'edfbfc']
        this.geometry = new THREE.OctahedronGeometry(200, 4)
        break;
      default:
        this.colors = ['cdd8e7', 'f2ede6', 'edfbfc']
        this.geometry = new THREE.OctahedronGeometry(200, 4)
        break;
    }

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading,
      shininess: 0,
      opacity: this.opacity,
      transparent: true
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(500, -200, -500)
    this.mesh.position.set(0, 0, 2000)


    for(var i = 0; i < this.mesh.geometry.faces.length; i++){
      let col = GetColor(this.colors, '0x')
      this.mesh.geometry.faces[i].color.setHex(col)
    }

    for(var i = 0; i < this.mesh.geometry.vertices.length; i++){
      this.mesh.geometry.vertices[i].x += 5*Math.random()
      this.mesh.geometry.vertices[i].y += 5*Math.random()
      this.mesh.geometry.vertices[i].z += 5*Math.random()
    }

    TweenMax.to(this.mesh.rotation, 20, {
      x: Math.PI*2,
      y: Math.PI*2,
      // z: Math.PI,
      ease: SteppedEase.config(500),
      repeat: -1
    })
  }

  _getObjects(){
    return this.mesh
  }
}
