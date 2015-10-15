import Scene from './Scene'
import TweenMax from '../libs/greensock/src/uncompressed/TweenMax'
import {GetColor, MouseOn} from './Util'

var pjaxTime = 1000
var bPjax = false
var bLoading = false
var bParticles = true

class Transition {

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

    console.log('pjaxStart');
    bLoading = true
    bParticles = false
    document.getElementById('wrap').style.display ='none'
    for (var i=0; i<flyingParticles.length; i++){
      var p = flyingParticles[i];
      var s = p.mesh.scale.x;

      TweenMax.to(p.mesh.position, 0.6, {
        x: p.mesh.position.x * 3,
        y: p.mesh.position.y * 3,
        z: 3000,
      	ease: Cubic.In
      });
    }
  }

  _complete(){
    console.log('pjaxComplete')
    bPjax = false
    pjaxTime = 0
    this._preLoadImages();
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


class Objects {
  constructor(color, shape, texture){
    if(texture){
      this.col = '#ffffff'
      this.tex =  THREE.ImageUtils.loadTexture(texture)
    }else{
      this.col = color
      this.tex =  ''
    }
    if(shape > 0.5){
      this.geometry = new THREE.OctahedronGeometry(10, 0)
      this.material = new THREE.MeshPhongMaterial({
        color: this.col,
        shading: THREE.FlatShading,
        map: this.tex
      })
    }else{
      this.geometry = new THREE.IcosahedronGeometry(10, 0)
      this.material = new THREE.MeshPhongMaterial({
        color: this.col,
        shading: THREE.FlatShading,
        map: this.tex
      })
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  _getObjects(){
    return this.mesh
  }

}

export default class Particle extends Scene{

  constructor() {
    super()
    this.transition = new Transition()
    this.transition._counter()
    document.body.style.visibility = 'visible';
  }

  _start(){
    this.transition._start(this.flyingParticles)
  }

  _complete(){
    this.transition._complete()
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
    this._initLoading()

  }

  _animate(){
    super._animate()
    const time = this.clock.getElapsedTime()
    if(!bLoading && bPjax){
      console.log(11);
      TweenMax.to(this.loading.scale, 0.2, {
        x: 0.00001,
        z: 0.00001,
        ease: Cubic.In
      });
      bParticles = true
      document.getElementById('wrap').style.display = 'block';
    }else {
      TweenMax.to(this.loading.scale, 0.4, {
        x: 7,
        y: 7,
        ease: Cubic.In
      });
      TweenMax.to(this.camera.position, 0.4,{
        x: 0.5,
        y: 0.5,
        ease: Cubic.In
      });
    }

    if(this.cube){
      if(this.cube.position.z >= 3000){
        for (var i = 0; i < this.cubes.length; i++) {
          this.scene.remove(this.cubes[i])
        }
        this.cubes = []
      }
      for (var i = 0; i < this.cube.geometry.vertices.length; i++) {
        this.cube.geometry.vertices[i].x += Math.sin(time)*0.25*Math.random();
        this.cube.geometry.vertices[i].y += Math.cos(time)*0.25*Math.random();
        this.cube.geometry.vertices[i].z += Math.cos(time)*0.25*Math.random();
      }
    }
    this._updateParticlesLoad()
  }
  _render() {
    super._render()
  }

  _initLoading(){
    var textureManager = new THREE.LoadingManager()

    var textureLoader = new THREE.ImageLoader(textureManager)
    var myTexture = new THREE.Texture()
    var image = '/images/loading.jpg'
    textureLoader.load([image], image => {
        myTexture.image = image
        this.scene.add(this.loading)
    })

    var tex = '/images/loading.jpg'
    var geometry = new THREE.PlaneGeometry(100, 100, 100)
    var material = new THREE.MeshPhongMaterial({
      color: '#ffffff',
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: THREE.ImageUtils.loadTexture(tex)
    })
    this.loading = new THREE.Mesh(geometry, material)
    var s = 5
    this.loading.scale.set(s, s, 0.0001)
    this.loading.position.x = this.loading.position.y = 0
    this.loading.position.z = 1500

    TweenMax.to(this.loading.rotation, 5, {
      x: Math.PI,
      y: Math.PI,
      z: Math.PI,
      ease: Linear.easeNone,
      repeat: -1
    })

  }



  _createParticle(p){

    p.mesh.material.needsUpdate =  true
      // p.mesh.positiond.z = 2000
    if(p.bLoadingTex == false){
      p.mesh.position.x = (-this.Width + Math.random()*this.Width*2) / 3
      p.mesh.position.y = (-this.Height + Math.random()*this.Height*2) / 3
      var s = 1.1 + Math.random()
    }else {
      p.mesh.position.x = (-this.Width + Math.random()*this.Width * 2)
      p.mesh.position.y = (-this.Height + Math.random()*this.Height * 2)
      var s = 1.5 + Math.random()
    }
    p.mesh.scale.set(s,s,s)

    this.scene.add(p.mesh)
    this.particleArray.push(p)
    this.flyingParticles.push(p)
    this._flyParticle(p)
  }

  _flyParticle(p){
    const thisMesh = p.mesh
    const s = p.mesh.scale.x;
    const duration = Math.max(p.mesh.scale.x * 6, 4)
    TweenMax.to(p.mesh.rotation, duration, {
      x: s * 4 *Math.random(),
      y: s * 4 *Math.random(),
      z: s * 4 *Math.random(),
      ease : Quart.out
    });
    TweenMax.to(p.mesh.position, duration, {
      x: p.mesh.position.x * 2,
      y: p.mesh.position.y * 2,
      z: 3000,
      ease: Strong.QuartInOut,
      onComplete: () => {
        this.scene.remove(thisMesh)
        p.mesh.material.dispose();
        this.flyingParticles.shift();
      },
      onCompleteParams: [p]
    });
  }

  _getParticle(){
    if(this.particleArray.length){
      return this.particleArray.pop();
    }else{
      return this._initParticle();
    }
  }

  _createParticles(){
    var p = this._getParticle();
    this._flyParticle(p);
  }

  _updateParticlesLoad(){
    if(this.counter % this.frequency == 0 && bParticles){
      var shape = Math.random()
      var color = GetColor(this.colors, '#')
      var texture = this.tex
        this._createParticle(new Objects(color, shape, texture) )
    }
    this.counter++
  }


  _loadTex(id){
    if(Modernizr.touch && this.cube){
      this.scene.remove(this.cube)
    }
    this.tex = id.srcElement.dataset.tex
    this.bLoadingTex = true
    for (var i = 0; i < this.flyingParticles.length; i++) {
      var p = this.flyingParticles[i]
      var s = p.mesh.scale.x
      var duration = 2
      TweenMax.to(p.mesh.position, .6, {
        x: p.mesh.position.x * 3,
        y: p.mesh.position.y * 3,
        z: 3000,
      	ease: Cubic.In
      })
    }

    let geometry = new THREE.BoxGeometry(100, 100, 150)
    let material = new THREE.MeshPhongMaterial({
      color: '#ffffff',
      shading: THREE.FlatShading,
      map: THREE.ImageUtils.loadTexture(this.tex)
    })

    geometry.__dirtyVertices = false
    geometry.dynamic = false

    this.cube = new THREE.Mesh(geometry, material)
    const ss = 0.01
    this.cube.scale.set(ss, ss, ss)
    this.cube.position.x = this.cube.position.y = 0
    this.cube.position.z = 2000
    this.scene.add(this.cube)
    this.cubes.push(this.cube)

    TweenMax.to(this.cube.position, duration, {
      x: 200,
      ease: Cubic.In
    })
    TweenMax.to(this.cube.scale, duration, {
      x: 5,
      y: 5,
      z: 5,
      ease: Cubic.In
    })
    TweenMax.to(this.cube.rotation, duration, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      z: - Math.PI *2,
      ease: Linear.easeNone,
      repeat: -1
    })
  }

  _removeTex(){
      TweenMax.to(this.cube.position, .5, {
        z: 3500,
        ease: Cubic.In
      })

      this.bLoadingTex = false
      for (var i = 0; i < this.flyingParticles.length; i++) {
        let col = GetColor(this.colors, '0x')
        let p = this.flyingParticles[i]
        let s = Math.random()
        p.material.needsUpdate = true
        p.material.color.setHex(col)
        p.material.map = ''
        TweenMax.to(p.mesh.scale, .3, {
          x: .3 +s,
          y: .3 +s,
          z: .3 +s,
          ease: Cubic.Out
        })
      }
      this.tex = null
  }

}
