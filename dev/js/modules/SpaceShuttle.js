export default class SpaceShuttle{
  constructor(){
    this.json = '/images/SpaceShuttle.json'
  }

  init(){
    this._initShuttle()
  }

  _initShuttle(){
    this.loadingManager = new THREE.LoadingManager()
    this.loader = new THREE.JSONLoader(this.loadingManager)
    this.loader.load(
      this.json, (geometry, materials) =>{
        this.material = new THREE.MeshFaceMaterial(materials)
        this.geometry = geometry
        for (var i = 0; i < materials.length; i++) {
          materials[i].shading = THREE.FlatShading
        }
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.set(100,100,100)
        this.mesh.position.x = this.mesh.position.y = 0
        this.mesh.position.z = 2000
        this.mesh.rotation.x = 90 * Math.PI / 180
        this.mesh.rotation.y = 180  * Math.PI / 180
        this.mesh.rotation.z = 0
      })
  }

  _getObjects(){
    // this.loadingManager.onProgress = (item, loaded, total) => {
    //   console.log(item, loaded, total)
    // }
    return new Promise((resolve, reject) => {
      this.loadingManager.onLoad = () => {
        resolve(this.mesh)
      }
    })
  }
}
