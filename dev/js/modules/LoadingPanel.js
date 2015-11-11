export default class LoadingPanel{
  constructor(){
    this.image = '/images/loading.jpg'
    this.scale = 4
  }

  init(){
    this._initLoading()
  }

  _initLoading(){
    this.loadingManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.ImageLoader(this.loadingManager)
    this.texture = new THREE.Texture()
    this.geometry = new THREE.BoxGeometry(100, 100, 0.1)
    this.material = new THREE.MeshPhongMaterial({
      color: '#ffffff',
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: THREE.ImageUtils.loadTexture(this.image)
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(this.scale, this.scale)
    this.mesh.position.z = 2200

    this.textureLoader.load([this.image], () => {
        this.texture.image = this.image
    })
  }

  _getObjects(){
    return new Promise((resolve, reject) => {
      this.loadingManager.onLoad = () => {
        resolve(this.mesh)
      }
    })
  }
}
