import Space from './modules/Space'
import MyPjax from './modules/Space'
import {MouseOn} from './modules/Util'

export default class App {

  constructor() {
    this.el = document.getElementById('world')
    this.mouseEnabled = false
    new Pjax({
      elements: 'a[href]', // default is 'a[href], form[action]'
      selectors: ['title', '.js-Pjax', '.pjax']
    })
    this.three = new Space()
    this.pjax = new MyPjax()
    this.three.init()
    this._bindEvents()
  }

  _bindEvents() {
    const projects = document.getElementsByClassName("project")
    let transitionTrigger = document.querySelectorAll('nav a, h1 a, a.pjax')

    this.pjax._preLoadImages()
    this._onResize()
    window.addEventListener('resize', (el) => { this._onResize(el) })
    window.addEventListener('popstate', () => { this.three._popsate() })

    for(var i=0; i<transitionTrigger.length; i++){
      transitionTrigger[i].addEventListener('click',  (el) => { this.three._start(el)}, false);
    }

    for(var i=0; i<projects.length; i++){
      projects[i].addEventListener(MouseOn(), (el) => { this.three._initThumbnail(el) })
      projects[i].addEventListener('mouseleave',  () => { this.three._removeThumbnail() }, false)
    }

    document.addEventListener('pjax:complete', () => {
      this.three._complete()

      if(projects !== null){
        for(var i=0; i<projects.length; i++){
          projects[i].addEventListener('click',  (el) => { this.three._start(el)}, false);
          projects[i].addEventListener(MouseOn(), (el) => { this.three._initThumbnail(el) })
          projects[i].addEventListener('mouseleave',  () => { this.three._removeThumbnail() }, false)
        }
      }
    })


  }

  _onResize(el) {
    this.three.camera.aspect = window.innerWidth / window.innerHeight
    this.three.camera.updateProjectionMatrix()
    this.three.renderer.setSize(window.innerWidth, window.innerHeight)

    this.el.style.width = window.innerWidth + 'px'
    this.el.style.height = window.innerHeight + 'px'
  }

}
