import Scene from './Scene'
import TweenMax from '../libs/greensock/src/uncompressed/TweenMax'

import Planet from './Planet'
import LoadingPanel from './LoadingPanel'
import SpaceShuttle from './SpaceShuttle'
import {Meteor, Meteors} from './Meteor'
import Cube from './Cube'
import Raycaster from './Raycaster'

import Style from './Style'

import {GetColor, MouseOn, HasClass, AddClass, RemoveClass} from './Util'

export var pjaxTime = 1000
export var bPjax = false
export var bLoading = true
export var bParticles = false
export var bThumbnail = false
export var thumbnail = null
export var flag = true


export class Pjax {
  constructor() {
  }

  _counter(){
    pjaxTime++
    if(pjaxTime > 150 && !bPjax){
      bPjax = true
    }
    requestAnimationFrame(this._counter.bind(this))
  }

  _start(el, scene, camera, flyingParticles, cubes){
    // console.log('start');
    let target = el.target.href
    let lcoation = window.location.href.indexOf('works')
    flag = false

    AddClass(document.body, 'stopScrolling')
    document.body.addEventListener("touchmove", (el) => {
     if(HasClass(document.body,'stopScrolling')){
          el.preventDefault();
     }
     }, false);
    // document.body.addEventListener('touchmove', (el) => {el.preventDefault() })

    if(!HasClass(el.target, 'project')){
      thumbnail = null

      const thisScene = scene
      if(cubes.length > 0){
        for (var i = 0; i < cubes.length; i++) {
          let cube = cubes[i]
          TweenMax.to(cube.rotation, 1, {
            // x: 0.1,
            y: Math.PI,
            // z: 0.1,
            ease: Strong.CubicIn,
            onComplete () {
              thisScene.remove(cube)
            }
          })
          TweenMax.to(cube.scale, 1, {
            x: 0.001,
            y: 0.001,
            // z: 0.1,
            ease: Strong.CubicIn,
            onComplete () {
              thisScene.remove(cube)
            }
          })
        }
        cubes = []
      }
    }

    if(cubes.length > 0 && !target.indexOf('works') > -1 ){
      for (var i = 0; i < cubes.length; i++) {
        let cube = cubes[i]
        // let positionX = camera.position.x
        // let positionY = camera.position.y
        cube.rotation.set(0, 0, 0)
        cube.material.transparent = true
        TweenMax.to(cube.rotation, 1.5, {
          x: 0,
          y: - Math.PI ,
          z: 0,
          ease: Cubic.In,
        })
        TweenMax.to(cube.position, 1.5, {
          x: 0,
          y: 0,
          z: 2000,
          ease: Cubic.In
        })
        TweenMax.to(camera.position, 1.5, {
          x: 0,
          y: 0,
          ease: Cubic.In,
          onComplete () {
            flag = true
          }
        })
        // TweenMax.to(cube.material, 1.5, {
        //   opacity: 0.5,
        //   ease: Cubic.In
        // })
        // console.log(cube, cube.material);
      }

    }else if(target.indexOf('works')){
      flag = true

      for (var i = 0; i < cubes.length; i++) {
        let cube = cubes[i]
        cube._removeCube().then(response => {
          this.scene.remove(response)
        }, error => {
        })
      }

    }else{
      flag = true
    }

    bLoading = true
    bParticles = false

    document.getElementById('wrap').style.visibility ='hidden'
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
    // console.log('pjaxComplete', window.location);
    bPjax = false
    pjaxTime = 0
    this._preLoadImages();
    // this.style.init()

  }

  _popstate(){
    // console.log(window.location.href.indexOf("works") > -1);
    // flag = true
    // thumbnail = null
    // bThumbnail = false
  }

  _onLoad(){
    const regex = new RegExp('http[s]?:[/]+.*[/]*([^/]*)/works/[a-zA-Z0-9]+\/.*', 'g')
    let target = window.location.href
    if (target.match(regex) ){
      let project = target.match(".+/(.+?)([\?#;].*)?$")[1].replace('/', '')
      let thumbnail = '/images/' + project + '.jpg'
      return thumbnail
     }
  }

  _preLoadImages(){
    let projects = document.getElementsByClassName("project")
    if(projects.length > 0){
      let textureManager = new THREE.LoadingManager()
      textureManager.onLoad = () => {
          bLoading = false
          // console.log('Finish preload images ------------------');
      }
      let textureLoader = new THREE.ImageLoader(textureManager)
      let textures = []
      let texture = new THREE.Texture()
      textures.push(texture)

      for (var i = 0; i < projects.length; i++) {
        let image = projects[i].dataset.tex
        textureLoader.load([image],function(image){
          texture.image = image
          // console.log('done', image)
        })
      }
    }else{
        bLoading = false
        // console.log('No preload images  ------------------');
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
    this.ice = new Planet('Ice')
    // this.shuttle = new SpaceShuttle()
    // this.loading = new LoadingPanel()
    this.meteor = new Meteor()
    this.meteors = new Meteors()
    this.cube = new Cube()
    // this.raycaster = new Raycaster()

    this.style = new Style()

    this.pjax._counter()
    // this.shuttle.init()
    this.earthLand.init()
    this.earthSea.init()
    this.earthCloud.init()
    this.fire.init()
    this.sea.init()
    this.ice.init()
    // this.loading.init()
    this.pjax._preLoadImages()

    document.body.style.visibility = 'visible';
  }

  _start(el){
    this.pjax._start(el, this.scene, this.camera,this.meteors.flyingParticles, this.cube.cubes)
    let rand = Math.random()*100
    console.log(~~rand);
    if(~~rand % 4 == 0){
      TweenMax.to(this.earth.position, 3,{
        z: 5000,
        delay: 1,
        ease: Strong.CubicIn
      })
    }
    if(~~rand % 5 == 0){
      TweenMax.to(this.ice.mesh.position, 3,{
        z: 5000,
        delay: 1.4,
        ease: Strong.CubicIn
      })
    }
    if(~~rand % 6 == 0){
      TweenMax.to(this.fire.mesh.position, 3,{
        z: 5000,
        delay: 1.1,
        ease: Strong.CubicIn
      })
    }
    if(~~rand % 7 == 0){
      TweenMax.to(this.sea.mesh.position, 3,{
        z: 5000,
        delay: 1.6,
        ease: Strong.CubicIn
      })
    }
  }

  _complete(){
    this.pjax._complete()
    this.earth.position.z = this.ice.mesh.position.z = this.fire.mesh.position.z = this.sea.mesh.position.z = -1000
  }

  _preLoadImages(){
    this.pjax._preLoadImages()
  }

  _popsate(){
    this.pjax._popstate()
    const thisScene = this.scene
    const regex = new RegExp('http[s]?:[/]+.*[/]*([^/]*)/works/[a-zA-Z0-9]+\/.*', 'g')
    let target = window.location.href
    if (!target.match(regex)){
      for (var i = 0; i < this.cube.cubes.length; i++) {
        let cube = this.cube.cubes[i]
        TweenMax.to(cube.rotation, 1, {
          // x: 0.1,
          y: Math.PI,
          // z: 0.1,
          ease: Strong.CubicIn,
          onComplete () {
            thisScene.remove(cube)
          }
        })
        TweenMax.to(cube.scale, 1, {
          x: 0.001,
          y: 0.001,
          // z: 0.1,
          ease: Strong.CubicIn,
          onComplete () {
            thisScene.remove(cube)
          }
        })
      }
      this.cube.cubes = []
      flag = true
      thumbnail = null
      bThumbnail = false
    }else if(target.match(regex)){
      if(this.pjax._onLoad()){
        this.scene.add(this.cube._initCube(this.pjax._onLoad(), this.camera, true))
        this.cube.cubes.push(this.cube._getObjects())
      }
    }else{
      flag = true
      thumbnail = null
      bThumbnail = false
    }
  }

  _onLoad(){
    if(this.pjax._onLoad()){
      thumbnail = this.pjax._onLoad()
      this.scene.add(this.cube._initCube(this.pjax._onLoad(), this.camera, true))
      this.cube.cubes.push(this.cube._getObjects())
    }
    // this.style.init()
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
    this._onLoad()

    this.earth.add(this.earthLand._getObjects())
    this.earth.add(this.earthSea._getObjects())
    this.earth.add(this.earthCloud._getObjects())
    this.scene.add(this.earth)

    this.scene.add(this.fire._getObjects())
    this.scene.add(this.ice._getObjects())
    this.scene.add(this.sea._getObjects())
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
    if(flag){
      thumbnail = null
      this.cube._removeCube().then(response => {
        this.scene.remove(response)
      }, error => {
      })
    }
  }

  _animate(){
    if(!bLoading && bPjax){
      bParticles = true
      document.getElementById('wrap').style.visibility = 'visible';
      HasClass(document.body, 'stopScrolling') ?  RemoveClass(document.body, 'stopScrolling') : null
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
