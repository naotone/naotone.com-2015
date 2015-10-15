import Detector from '../three/Detector'
import Stats from '../three/Stats'

export var time = 1000
export var bPjax = false
export var bLoading = true

export default class Scene {

  constructor() {
    this.debugging = false
    this.container = document.getElementById('world')
    this.mouseX = null
    this.mouseY = null
    this.colors = ['ffffff','EA6A63','61D0EA', 'EAA760','EEEEEE','777777'],
    this.counter = 0
    this.projects = document.getElementsByClassName('project')
    this.frequency = 4
    this.bParticles = true
    this.bLoadingTex = false
    this.tex = null
    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.windowHalfX =  this.Width / 2
    this.windowHalfY = this.Height / 2
    this.cubes = []
    this.flyingParticles = []
    this.particleArray = []

    this._bindEvents()
  }

  init() {
    this._initScene()
    this._initClock()
    this._initRenderer()
    this._initCamera()
    this._initGeometry()
    this._initLights()
    this._addDomElement()

    if (this.debugging) {
      this._debugStats()
    }

    this._update()
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.overrideMaterial
    if (!this.debugging) this.scene.fog = new THREE.FogExp2(0xf0f0f0, 0.0005)
  }

  _initClock() {
    this.clock = new THREE.Clock()
  }

  _initRenderer() {
    if (Detector.webgl) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.Width, this.Height)
    } else if (Detector.canvas) {
      this.renderer = new THREE.CanvasRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    } else {
      Detector.addGetWebGLMessage()
    }
  }

  _initCamera() {
    if (!this.debugging){
      var far = 3000
    }else{
      var far = 5000
    }
    this.camera = new THREE.PerspectiveCamera(60, this.Width / this.Height, 1, far)
    this.camera.position.x = this.camera.position. y = 0
    this.camera.position.z = far

    this.camera.lookAt({x: 0, y: 0, z: 0})
    this.scene.add(this.camera)
  }

  _initGeometry() {
    if (this.debugging) this._axis()
  }

  _axis() {
    this.axes = new THREE.AxisHelper(10000)
    this.scene.add(this.axes)
  }

  _initLights() {
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

  _debugStats() {
    this.stats = new Stats()
    this.stats.setMode(0)
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.left = '0px'
    this.stats.domElement.style.bottom = '0px'
    document.body.appendChild(this.stats.domElement)
  }

  _update() {
    window.requestAnimationFrame(() => {
      this._update()
    })
    this._animate()
    this._render()
  }

  _animate() {
    this.camera.position.x += (this.mouseX - this.camera.position.x) * .025
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * .025
    this.camera.lookAt(this.scene.position)
  }

  _render() {
    if (this.debugging) this.stats.begin()
    this.renderer.render(this.scene, this.camera)
    if (this.debugging) this.stats.end()
  }

  _addDomElement() {
    this.container.appendChild(this.renderer.domElement)
  }

  _bindEvents() {
    if (this._isTouchDevice) {
      this.container.addEventListener('touchmove', (e) => { this._onTouchMove(e) })
    } else {
      window.addEventListener('mousemove', (e) => { this._onMouseMove(e) })
    }
  }

  get _isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
  }

  _onMouseMove(e) {
    e.preventDefault()
    this.mouseX = e.clientX - window.innerWidth / 2
    this.mouseY = e.clientY - window.innerHeight / 2
  }

  _onTouchMove(e) {
    if (e.touches.length === 1) {
      e.preventDefault
      this.mouseX = e.touches[0].pageX - window.innerWidth / 2
      this.mouseY = e.touches[0].pageY - window.innerHeight / 2
    }
  }

}
