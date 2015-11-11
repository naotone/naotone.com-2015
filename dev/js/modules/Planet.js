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
        this.colors = ['329A47']
        this.geometry = new THREE.IcosahedronGeometry(199, 2)
        this.shininess = 30
        this.position = { x:500, y:300}
        this.rotation = {duration: 50, x: 1, y: 1}
        this.noise = 20
        break;
      case 'EarthSea':
        this.colors = ['4891DE']
        this.geometry = new THREE.IcosahedronGeometry(200, 2)
        this.shininess = 70
        this.position = { x:500, y:300}
        this.rotation = {duration: 50, x: 1, y: 1}
        this.noise = 20
        break;
      case'EarthCloud':
        this.colors = ['ffffff']
        this.geometry = new THREE.IcosahedronGeometry(195, 2)
        // this.opacity = 1
        this.shininess = 30
        this.position = {x:500, y:300}
        this.rotation = {duration: 50, x: 1, y: 1}
        this.noise = 20
        break;
      case 'Fire':
        this.colors = ['f7461f', 'e95b2f', 'cd3006']
        this.geometry = new THREE.OctahedronGeometry(200, 5)
        this.shininess = 30
        this.position = {x:-500, y:-500}
        this.rotation = {duration: 80, x: -1, y: 1}
        this.noise = 30
        break;
      case 'Ice':
        this.colors = ['cdd8e7', 'f2ede6', 'edfbfc']
        this.geometry = new THREE.OctahedronGeometry(600, 6)
        this.shininess = 300
        this.position = {x:1000, y:1000}
        this.rotation = {duration: 100, x: 1, y: -1}
        this.noise = 30
        break;
      case 'Sea':
        this.colors = ['27CDF6', '48DDDE', '79D2EA']
        this.geometry = new THREE.IcosahedronGeometry(300, 3)
        this.shininess = 200
        this.position = {x: -499, y: 200}
        this.rotation = {duration: 50, x: 1, y: 1}
        this.noise = 20
        break;
      default:
        this.colors = ['cdd8e7', 'f2ede6', 'edfbfc']
        this.geometry = new THREE.OctahedronGeometry(200, 4)
        this.shininess = 30
        this.position = {x:1000, y:1000}
        this.rotation = {duration: 50, x: 1, y: 1}
        this.noise = 30
        break;
    }

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading,
      shininess:this.shininess,
      // opacity: this.opacity,
      transparent: true
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position.x, this.position.y, -1000)

    this.mesh.castShadow = true

    for(var i = 0; i < this.mesh.geometry.faces.length; i++){
      let col = GetColor(this.colors, '0x')
      this.mesh.geometry.faces[i].color.setHex(col)
    }

    for(var i = 0; i < this.mesh.geometry.vertices.length; i++){
      this.mesh.geometry.vertices[i].x += this.noise*Math.random()
      this.mesh.geometry.vertices[i].y += this.noise*Math.random()
      this.mesh.geometry.vertices[i].z += this.noise*Math.random()
    }

    TweenMax.to(this.mesh.rotation, this.rotation.duration, {
      x: Math.PI*2 * this.rotation.x,
      y: Math.PI*2 * this.rotation.y,
      // z: Math.PI,
      ease: Power0.easeNone,
      repeat: -1
    })
  }

  _getObjects(){
    return this.mesh
  }
}
