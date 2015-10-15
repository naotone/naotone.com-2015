import Particle from './modules/Particle'
import {MouseOn} from './modules/Util'


export default class App {

  constructor() {
    this.el = document.getElementById('world')
    this.mouseEnabled = false
    new Pjax({
      elements: 'a[href]', // default is 'a[href], form[action]'
      selectors: ['title', '.js-Pjax']
    })
    this.three = new Particle()
    this.three.init()
    this._bindEvents()
  }

  _bindEvents() {
    const projects = document.getElementsByClassName("project")
    const transitionTrigger = document.querySelectorAll('nav a, h1 a')

    this._onResize()
    window.addEventListener('resize', (e) => { this._onResize(e) })
    document.addEventListener('pjax:complete', () => {
      this.three._complete()
      if(projects !== null){
        for(var i=0; i<projects.length; i++){
          projects[i].addEventListener(MouseOn(), (e) => { this.three._loadTex(e) })
          projects[i].addEventListener('mouseleave',  () => { this.three._removeTex() }, false)
        }
      }
    })

    for(var i=0; i<projects.length; i++){
      projects[i].addEventListener(MouseOn(), (e) => { this.three._loadTex(e) })
      projects[i].addEventListener('mouseleave',  () => { this.three._removeTex() }, false)
    }

    for(var i=0; i<transitionTrigger.length; i++){
      transitionTrigger[i].addEventListener('click',  () => { this.three._start()}, false);
    }

  }

  _onResize(e) {
    this.three.camera.aspect = window.innerWidth / window.innerHeight
    this.three.camera.updateProjectionMatrix()
    this.three.renderer.setSize(window.innerWidth, window.innerHeight)

    this.el.style.width = window.innerWidth + 'px'
    this.el.style.height = window.innerHeight + 'px'
  }

}
