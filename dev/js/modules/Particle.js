import Scene from './Scene'
import TweenMax from '../libs/greensock/src/uncompressed/TweenMax'
import {GetColor, MouseOn} from './Util'
import Planet from './Planet.js'
import LoadingPanel from './LoadingPanel.js'
import SpaceShuttle from './SpaceShuttle.js'

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
    // console.log('pjaxStart');
    bLoading = true
    bParticles = false
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
    // console.log('pjaxComplete')
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


class Meteorites{
  constructor(color, shape, texture){
    this.color = color
    this.shape = shape
    this.texture = texture
  }

  init(){
    _initMeteorite()
  }

  _initMeteorite(){
    if(this.texture){
      this.color = '#ffffff'
      this.texture =  THREE.ImageUtils.loadTexture(texture)
    }else{
      this.color = color
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

}


class loadTex {
  constructor() {

  }
}



export default class Particle extends Scene{
  constructor() {
    super()
    this.transition = new Transition()
    this.transition._counter()
    this.earthLand = new Planet('EarthLand')
    this.earthSea = new Planet('EarthSea')
    this.fire = new Planet('Fire')
    this.sea = new Planet('Sea')
    this.shuttle = new SpaceShuttle()
    this.loading = new LoadingPanel()
    this.shuttle.init()
    this.earthLand.init()
    this.earthSea.init()
    this.fire.init()
    this.sea.init()
    this.loading.init()
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
    // this.scene.add(this.earthLand._getObjects())
    // this.scene.add(this.earthSea._getObjects())
    this.scene.add(this.fire._getObjects())
    // this.scene.add(this.sea._getObjects())
    this.loading._getObjects().then(response => {
      // this.scene.add(response)
    }, error => {
    })
    this.shuttle._getObjects().then(response => {
      // this.scene.add(response)
    }, error => {
    })
  }

  _initTween(){
    super._initTween()
    // TweenMax.to(this.loading.mesh.rotation, 5, {
    //   // x: Math.PI,
    //   y: Math.PI*2,
    //   // z: Math.PI,
    //   ease: SteppedEase.config(60),
    //   repeat: -1
    // })
  }

  _animate(){
    super._animate()
    const time = this.clock.getElapsedTime()
    // if(this.shuttle){
      // console.log(shuttleRotateY)
      // console.log(this.shuttle.position.xi
    if(!bLoading && bPjax){
      // this.earth.mesh.position.z = -500
      // this.snow.mesh.position.z = -500

        //   console.log(this.earth);
      // TweenMax.to(this.loading.scale, 0.2, {
      //   x: 2,
      //   z: 2,
      //   ease: Cubic.In
      // });
      // this.shuttle.position. z = -500
      // this.shuttle.position.x = 200
      // this.shuttle.position.y = 100
      // TweenMax.to(this.shuttle.position, 2,{
      //   x: 200,
      //   z: -1000,
      //   ease: Cubic.In
      // })
      bParticles = true
      document.getElementById('wrap').style.display = 'block';
    }else {
      TweenMax.to(this.earthLand.mesh.position, 1.4, {
        z: 3000,
        ease: Cubic.In,
        delay: .3,
        onComplete: () => {
          this.earthLand.mesh.position.z = -500
        }
      });
      TweenMax.to(this.earthSea.mesh.position, 1.4, {
        z: 3000,
        ease: Cubic.In,
        delay: .3,
        onComplete: () => {
          this.earthSea.mesh.position.z = -500
        }

      });
      // TweenMax.to(this.shuttle.position, 3, {
      //   z: 3500
      // })
      // TweenMax.to(this.shuttle.rotation, 3, {
      //   y: shuttleRotateY,
      //   onComplete: () => {
      //     shuttleRotateY = Math.random()* 360 * Math.PI / 180
      //   }
      // })

      // TweenMax.to(this.shuttle.rotation, 3,{
      //   x: 200,
      //   z: -1000,
      //   ease: Cubic.In
      // })

      // TweenMax.to(this.loading.scale, 0.4, {
      //   x: 0,
      //   y: 0,
      //   ease: Cubic.In
      // });
      // TweenMax.to(this.camera.position, 0.4,{
      //   x: 0.5,
      //   y: 0.5,
      //   ease: Cubic.In
      // });
    }
  // }
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
    // console.log(this.flyingParticles.length)
  }
  _render() {
    super._render()
  }

  _createParticle(p){
    p.mesh.material.needsUpdate =  true
    if(p.bLoadingTex == false){
      p.mesh.position.x = (-this.Width + Math.random()*this.Width*2) / 3
      p.mesh.position.y = (-this.Height + Math.random()*this.Height*2) / 3
    }else {
      p.mesh.position.x = (-this.Width + Math.random()*this.Width * 2)
      p.mesh.position.y = (-this.Height + Math.random()*this.Height * 2)
    }
    const s = 0.1
    p.mesh.scale.set(s,s,s)

    this.scene.add(p.mesh)
    this.flyingParticles.push(p)
    if(bParticles){
      this._flyParticle(p)
    }else{
      this._flyParticleFast(p)
    }
  }

  _flyParticle(p){
    const thisMesh = p.mesh
    const s = Math.random() + .5

    var duration = Math.max(s * 6, 4)
    TweenMax.to(p.mesh.scale, 1, {
      x: s,
      y: s,
      z: s,
      ease : Quart.In
    });
    TweenMax.to(p.mesh.rotation, duration, {
      x: s * 4 *Math.random(),
      y: s * 4 *Math.random(),
      z: s * 4 *Math.random(),
      ease : Quart.In
    });
    TweenMax.to(p.mesh.position, duration, {
      x: p.mesh.position.x * 2,
      y: p.mesh.position.y * 2,
      z: 3000,
      ease: Strong.QuartIn,
      onComplete: () => {
        this.scene.remove(thisMesh)
        p.mesh.material.dispose();
        this.flyingParticles.shift();
      },
      onCompleteParams: [p]
    });
  }

  _flyParticleFast(p){
    const thisMesh = p.mesh
    const s = Math.random() + 0.5

    var duration = Math.max(s * 6, 4)
    duration = 1
    TweenMax.to(p.mesh.scale, 0.4, {
      x: s,
      y: s,
      z: s,
      ease : Quart.In
    });
    TweenMax.to(p.mesh.rotation, duration, {
      x: s * 4 *Math.random(),
      y: s * 4 *Math.random(),
      z: s * 4 *Math.random(),
      ease : Quart.In
    });
    TweenMax.to(p.mesh.position, duration, {
      x: p.mesh.position.x * 1.2,
      y: p.mesh.position.y * 1.2,
      z: 3000,
      ease: Strong.QuartIn,
      onComplete: () => {
        this.scene.remove(thisMesh)
        p.mesh.material.dispose();
        this.flyingParticles.shift();
      },
      onCompleteParams: [p]
    });
  }

  _getParticle(){
    if(this.flyingparticles.length){
      return this.flyingparticles.pop();
    }else{
      return this._initParticle();
    }
  }

  _createParticles(){
    var p = this._getParticle();
    this._flyParticle(p);
  }

  _updateParticlesLoad(){
    if(this.counter % this.frequency == 0){
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

    let geometry = new THREE.BoxGeometry(100, 100, 100)
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

    // TweenMax.to(this.cube.position, duration, {
    //   // x: 200,
    //   ease: Cubic.In
    // })
    TweenMax.to(this.cube.scale,  .4, {
      x: 5,
      y: 5,
      z: 5,
      ease: Power2.In,
      delay: 0.3
    })
    TweenMax.to(this.cube.rotation, 6, {
      // x: Math.PI * 2,
      y: Math.PI * 2,
      // z: - Math.PI *2,
      ease: Power0.easeNone,
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
