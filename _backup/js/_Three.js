import * as Parm from './App.js'
import { Util } from './Util.js'
import _Pjax from './Pjax.js'

var util = new Util()

export default class Three{
  constructor(container){
    this.colors = Parm.colors
    this.counter = Parm.counter
    this.projects = Parm.projects
    this.frequency = Parm.frequency
    this.bParticles = Parm.bParticles
    this.mouseX = Parm.mouseX
    this.mouseY = Parm.mouseY
    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.windowHalfX = this.width / 2
    this.windowHalfY = this.Height / 2
    this.container = container
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this.cubes = Parm.cubes
    this.flyingParticles = Parm.flyingParticles
    this.particleArray = Parm.particleArray
    this.bLoadingTex = Parm.bLoadingTex
    this.setup()
  }
  setup(){
    this.preloadImages()
    this.init()
   }
  init(){
    this.scene.overrideMaterial
    this.scene.fog = new THREE.FogExp2(0xf0f0f0, 0.00075)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.Width, this.Height)
    this.container.appendChild(this.renderer.domElement)

    this.createCam()
    this.createLight()
    this.createLoading()
    this.animate()
    this.styling()
  }

  createCam(){
    this.fov = 60
    this.aspectRatio = this.Width / this.Height
    this.near = 1
    this.far = 4000
    this.camZ = 4000
    this.cam = new THREE.PerspectiveCamera(
      this.fov, this.aspectRatio, this.near, this.far
    )
    this.cam.position.x = this.cam.position.y = 0
    this.cam.position.z = this.camZ
    this.cam.lookAt({x:0, y:0, z:0 });
  }

  createLight(){
    this.shadowLight = new THREE.DirectionalLight(0xffffff, 1.5)
    this.shadowLight.position.set(20, 0, 10)
    this.shadowLight.castShadow = true
    this.shadowLight.shadowDarkness = 0.01
    this.scene.add(this.shadowLight)

    this.light = new THREE.DirectionalLight(0xffffff, .5)
    this.light.position.set(-20, 0, 20)
    this.scene.add(this.light)

    this.backLight = new THREE.DirectionalLight(0xffffff, .1)
    this.backLight.position.set(0, 0, -20)
    this.scene.add(this.backLight)
  }

  createLoading(){
    let textureManager = new THREE.LoadingManager()
    textureManager.onload = function(){
      this.scene.add(this.loading)
    }
    let textureLoader = new THREE.ImageLoader(textureManager)
    let myTexture = new THREE.Texture()
    let image = '/images/loading.jpg'
    textureLoader.load([image], function(image){
      myTexture.image = image
    })

    let tex = '/images/loading.jpg'
    let geometry = new THREE.PlaneGeometry(100, 100, 100)
    let material = new THREE.MeshLambertMaterial({
      color: '#ffffff',
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: THREE.ImageUtils.loadTexture(tex)
    })
    this.loading = new THREE.Mesh(geometry, material)
    let s = 5
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

  setupParticle(){
    let self = this
    // console.log(p);
    self.colors = Parm.colors
    if(self.bLoadingTex == true){
      self.col = '#ffffff'
      self.tex = THREE.ImageUtils.loadTexture(tex)
    }else {
      self.col = util.GetColor(self.colors, '#')
      // self.col = '#000000'
      self.tex = ''
    }

    if(Math.random() > .5){
      self.geometry = new THREE.OctahedronGeometry(100, 0)
      self.material = new THREE.MeshLambertMaterial({
        color: self.col,
        shading: THREE.FlatShading,
        map: self.tex
      })
    }else {
      self.geometry = new THREE.IcosahedronGeometry(50, 0)
      self.material = new THREE.MeshLambertMaterial({
        color: self.col,
        shading: THREE.FlatShading,
        map: self.tex
      })
    }
    self.mesh = new THREE.Mesh(self.geometry, self.material)

    this.createParticle(self)
    // console.log(this)
    // console.log(p);
    // this.createParticle(p)
    // console.log(this.);

  }

  createParticle(p){
    p.material.needsUpdate =  true
    p.mesh.position.z = 0
    if(p.bLoadingTex == false){
      p.mesh.position.x = (-p.Width + Math.random()*p.Width*2) / 3
      p.mesh.position.y = (-p.Height + Math.random()*p.Height*2) / 3
      let s = .1 + Math.random()
    }else {
      p.mesh.position.x = (-p.Width + Math.random()*p.Width * 2)
      p.mesh.position.y = (-this.Height + Math.random()*this.Height * 2)
      let s = .5 + Math.random()
    }
    // if(this.mode){}else{}

    this.scene.add(p.mesh)
    // this.particleArray.push(p)
    this.flyingParticles.push(p)
    this.flyParticle(this)

  }

  flyParticle(pp){
    let self = this
    let flyingParticles = this.flyingParticles
    this.material.needsUpdate = true;
    var  selfPP = pp
    // this.p = p
    // console.log(p);
    // console.log(pp.mesh.scale.x);
    // alert('break')
    // pp.material.needsUpdate = true
    let ss = this.mesh.scale.x;
    let duration = Math.max(this.mesh.scale.x * 6, 4)
    duration = 1
    // let duration = 3;
    // if(this.mode){}else{}
    TweenMax.to(this.mesh.rotation, duration, {
      x: ss * 4 *Math.random(),
      y: ss * 4 *Math.random(),
      z: ss * 4 *Math.random(),
      ease : Quart.out
    });
    TweenMax.to(this.mesh.position, duration, {
      x: this.mesh.position.x * 2,
      y: this.mesh.position.y * 2,
      z: 3000,
      ease: Strong.QuartInOut,
      onComplete: function onComplete() {
        self.scene.remove(self.mesh)
        // self.scene.remove(self.flyingParticles.shift())
        // self.material.dispose()
        // self.flyingParticles.shift()
        // console.log(self.flyingParticles)
        // self.createParticle
      }
      // onCompleteParams: [this]
    })
  }

  loadTex(id){
    console.log('898989');
    if(Modernizr.touch && this.cube){
      this.scene.remove(this.cube)
    }

    let tex = this.dataset.tex
    this.bLoadingTex = true
    for (var i = 0; i < flyingParticles.length; i++) {
      let p = flyingParticles[i]
      let s = p.mesh.scale.x
      let duration = Math.max(p.mesh.scale.x*6, 4)
      TweenMax.to(p.mesh.position, .6, {
        x: p.mesh.position.x * 3,
        y: p.mesh.position.y * 3,
        z: 3000,
      	ease: Cubic.In
      })
      let geometry = new THREE.BoxGeometry(100, 100, 150)
      let material = new THREE.MeshLambertMaterial({
        colof: '#ffffff',
        shading: THREE.FlatShading,
        map: THREE.ImageUtils.loadTexture(tex)
      })
      s = 5
      geometry.__dirtyVertices = faslse
      geometry.dynamic = false

      this.cube = new THREE.Mesh(geometry, material)
      s = 0.01
      this.cube.scale.set(s, s, s)
      this.cube.position.x = this.cube.position.y = 0
      this.cube.position.z = 2000
      this.scene.add(this.cube)
      this.cubes.push(this.cube)

      TweenMax.to(this.cube.position, 1, {
        x: 200,
        ease: Cubic.In
      })
      TweenMax.to(this.cube.scale, 1, {
        x: 5,
        y: 5,
        z: 5,
        ease: Cubic.In
      })
      TweenMax.to(this.cube.rotation, 1, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: - Math.PI *2,
        ease: Linear.easeNone,
        repeat: -1
      })

    }
  }

  removeTex(){
    TweenMax.to(this.cube.poosition, .5, {
      z: 3500,
      ease: Cubic.In
    })

    this.bLoadingTex = false
    for (var i = 0; i < this.flyingParticles.length; i++) {
      let col = util.GetColor(this.colrs, '0x')
      let p = flyingParticles[i]
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
  }

  // getParticle(){
  //   if(this.particleArray.length){
  //     return this.particleArray.pop()
  //   }else{
  //     return set = new this.setupParticle()
  //   }
  // }

  updateParticlesLoad(){
    if(this.counter % this.frequency == 0 && this.bParticles){
      this.setupParticle()
    }
    this.counter++
  }

  animate(){
    requestAnimationFrame(this.animate.bind(this))
    this.updateParticlesLoad()
    this.render()
  }

  render(){
    let time = this.clock.getElapsedTime()
    if(!this.bLoading && this.bPjax){
      TweenMax.to(this.loading.scale, 0.2, {
        x: 0.00001,
        // y: 0.001,
        z: 0.00001,
        ease: Cubic.In
      });
      document.getElementById('wrap').style.display = 'block'
      this.cam.position.x += (this.mouseX - this.cam.position.x) * .025
      this.cam.position.y += (this.mouseY - this.cam.position.y) * .025
      this.bParticles = true
    }else {
      TweenMax.to(this.loading.scale, 0.4, {
        x: 7,
        y: 7,
        // z: 3,
        ease: Cubic.In
      });
      TweenMax.to(this.cam.position, 0.4,{
        x: 0.5,
        y: 0.5,
        ease: Cubic.In
      });
    }
    this.cam.lookAt(this.scene.position)

    if(this.cube){
      if(this.cube.position.z >= 3000){
        for (var i = 0; i < this.cubes.length; i++) {
          this.scene.remove(this.cubes[i])
        }
        this.cubes = []
      }
      for (var i = 0; i < this.cube.geometry.vertices.length; i++) {
        this.scube.geometry.vertices[i].x += Math.sin(time)*25*Math.random();
        this.scube.geometry.vertices[i].y += Math.cos(time)*25*Math.random();
        this.scube.geometry.vertices[i].z += Math.cos(time)*25*Math.random();
      }
    }
    this.renderer.render(this.scene, this.cam)
  }

  styling(){
    this.Height = window.innerHeight;
    var sections = document.querySelectorAll('section');
    for (var i = 0; i < sections.length; i++) {
      sections[i].style.height = this.Height*0.65 +'px';
      // sections[i].style.visibility = 'visible';
    }
    // document.getElementById('header').style.height = this.Height +'px';
    document.body.style.height = this.Height +'px';
    document.body.style.visibility = 'visible';

  }

  onWindowResize(){
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
    this.cam.aspect = window.innerWidth / window.innerHeight
    this.cam.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.styling()

  }
  onMouseMove(event){
    this.mouseX = (event.clientX - this.windowHalfX) * 0.5
    this.mouseY = (event.clientY - this.windowHalfY) * 0.5
  }

  preloadImages(){
    if(this.projects.length > 0){
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
        textureLoader.laod([image],function(image){
          myTexture.image = image
        })
      }
    }else{
      this.bLoading = false
    }
  }
}
