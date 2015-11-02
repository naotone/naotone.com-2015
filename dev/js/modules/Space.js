import Scene from './Scene'
import TweenMax from '../libs/greensock/src/uncompressed/TweenMax'

// import Pjax from './Pjax'
import Planet from './Planet'
import LoadingPanel from './LoadingPanel'
import SpaceShuttle from './SpaceShuttle'
import {Meteor, Meteors} from './Meteor'
import Cube from './Cube'
import Raycaster from './Raycaster'

import {GetColor, MouseOn} from './Util'
// import {pjaxTime, bPjax, bLoading, bParticles} from './Space'

export var pjaxTime = 1000
export var bPjax = false
export var bLoading = false
export var bParticles = true
export var bThumbnail = false
export var thumbnail = null

class Pjax {
  constructor() {
  }

  _counter(){
    pjaxTime++
    if(pjaxTime > 150 && !bPjax){
      bPjax = true
    }
    requestAnimationFrame(this._counter.bind(this))
  }

  _start(flyingParticles){
    console.log('pjaxStart', document.location);
    console.log(this.cube)
    if(document.location.pathname.indexOf('works'))
    bLoading = true
    bParticles = false
    // console.log(bParticles);
    document.getElementById('wrap').style.display ='none'
    for (var i=0; i<flyingParticles.length; i++){
      var p = flyingParticles[i];
      var s = p.mesh.scale.x;

      TweenMax.to(p.mesh.position, 1, {
        x: p.mesh.position.x * 2,
        y: p.mesh.position.y * 2,
        z: 3000,
      	ease: Cubic.In
      });
    }
  }

  _complete(){
    console.log('pjaxComplete', document.location);

    bPjax = false
    pjaxTime = 0
    this._preLoadImages();
  }

  _popstate(){
    console.log(document.location);

  }

  _preLoadImages(){
    const projects = document.getElementsByClassName("project");
    if(projects.length > 0){
      let textureManager = new THREE.LoadingManager()
      textureManager.onLoad = function () {
          bLoading = false;
      }
      let textureLoader = new THREE.ImageLoader(textureManager)
      let myTextureArray = []
      let myTexture = new THREE.Texture()
      myTextureArray.push(myTexture)

      for (var i = 0; i < projects.length; i++) {
        let image = projects[i].dataset.tex
        textureLoader.load([image],function(image){
          myTexture.image = image
        })
      }
    }else{
      bLoading = false
    }
  }
}


export default class Space extends Scene{
  constructor() {
    super()
    this.pjax = new Pjax()
    this.earth = new THREE.Object3D()
    this.earthLand = new Planet('EarthLand')
    this.earthSea = new Planet('EarthSea')
    this.earthCloud = new Planet('EarthCloud')
    this.fire = new Planet('Fire')
    this.sea = new Planet('Sea')
    this.shuttle = new SpaceShuttle()
    this.loading = new LoadingPanel()
    this.meteor = new Meteor()
    this.meteors = new Meteors()
    this.cube = new Cube()
    // this.raycaster = new Ra

    this.pjax._counter()
    this.shuttle.init()
    this.earthLand.init()
    this.earthSea.init()
    this.earthCloud.init()
    this.fire.init()
    this.sea.init()
    this.loading.init()
    // this.meteor.init()

    document.body.style.visibility = 'visible';
  }

  _start(){
    this.pjax._start(this.meteors.flyingParticles)
  }

  _complete(){
    this.pjax._complete()
  }

  _popsate(){
    this.pjax._popstate()
    const thisScene = this.scene
    if(this.cube.cubes.length > 0){
      for (var i = 0; i < this.cube.cubes.length; i++) {
        let cube = this.cube.cubes[i]
        TweenMax.to(cube.scale, .3, {
          x: 0.1,
          // y: 0.1,
          // z: 0.1,
          ease: Strong.CubicIn,
          onComplete () {
            thisScene.remove(cube)
          }
        })
      }
      this.cube.cubes = []
    }
  }

  _initScene() {
    super._initScene()
  }
  _initCamera() {
    super._initCamera()
  }

  _initLights() {
    super._initLights()
  }

  _initGeometry() {
    super._initGeometry()
    this.earth.add(this.earthLand._getObjects())
    this.earth.add(this.earthSea._getObjects())
    this.earth.add(this.earthCloud._getObjects())
    // this.scene.add(this.earth)

    // this.scene.add(this.fire._getObjects())
    // this.scene.add(this.sea._getObjects())
    // this.loading._getObjects().then(response => {
    //   // this.scene.add(sresponse)
    // }, error => {
    // })
    // this.shuttle._getObjects().then(response => {
    //   // this.scene.add(response)
    // }, error => {
    // })
  }

  _initTween(){
    super._initTween()
  }

  _initThumbnail(id){
      if(this.cube && Modernizr.touch){
      this.scene.remove(this.cube)
      // console.log('000');
    }
    bThumbnail = true
    thumbnail = id.target.dataset.tex
    this.scene.add(this.cube._initCube(thumbnail, this.camera))
    this.cube.cubes.push(this.cube._getObjects())

    for (var i = 0; i < this.meteors.flyingParticles.length; i++) {
      const meteor = this.meteors.flyingParticles[i].mesh
      const scale = meteor.scale.x
      const duration = 2
      TweenMax.to(meteor.position, .6, {
        x: meteor.position.x * 3,
        y: meteor.position.y * 3,
        z: 3000,
      	ease: Cubic.In
      })
    }
  }

  _removeThumbnail(){
    thumbnail = null
    this.cube._removeCube().then(response => {
      this.scene.remove(response)
    }, error => {
    })
  }


  _animate(){

    // if(this.cube.cubes){
    //   console.log(this.cube);
    //   if(this.cube.position.z >= 3000){
    //     for (var i = 0; i < this.cube.cubes.length; i++) {
    //       this.scene.remove(this.cube.cubes[i])
    //     }
    //     this.cubes = []
    //   }
    //   for (var i = 0; i < this.cube.geometry.vertices.length; i++) {
    //     this.cube.geometry.vertices[i].x += Math.sin(time)*0.25*Math.random();
    //     this.cube.geometry.vertices[i].y += Math.cos(time)*0.25*Math.random();
    //     this.cube.geometry.vertices[i].z += Math.cos(time)*0.25*Math.random();
    //   }
    // }

    if(!bLoading && bPjax){
      bParticles = true
      document.getElementById('wrap').style.display = 'block';

    }else{

    }
    super._animate()
    this.meteors._animate()
    for(var i = 0; i < this.meteors.flyingParticles.length; i++){
      var meteor = this.meteors.flyingParticles[i].mesh
      if(meteor.position.z >= 3000){
        this.scene.remove(meteor)
        meteor.material.dispose()
        this.meteors.flyingParticles.splice(i, 1)
      }
    }
    if(this.counter % this.frequency == 0){
      this.scene.add(this.meteors._updateParticlesLoad());
    }

    this.counter < 1000 ? this.counter++ : this.counter = 0
    // console.log(this.counter)
    // console.log(pjaxTime);
   // this.scene.add(this.meteors._updateParticlesLoad())
  }
  _render() {
    super._render()
  }


}
