import Space from './modules/Space'
import Style from './modules/Style'
import {MouseOn, MouseOff} from './modules/Util'

export default class App {

  constructor() {
    this.el = document.getElementById('world')
    this.mouseEnabled = false
    new Pjax({
      elements: 'a[href]', // default is 'a[href], form[action]'
      selectors: ['title', 'meta[property="og:title"]', 'meta[property="og:image"]', '.js-Pjax', '.pjax']
    })
    this.three = new Space()
    this.style = new Style()
    this.three.init()
    this._onResize()
    this._bindEvents()
  }

  _bindEvents() {
    const projects = document.getElementsByClassName("project")
    let transitionTrigger = document.querySelectorAll('nav a, h1 a')

    window.addEventListener('resize', (el) => { this._onResize(el) })
    window.addEventListener('popstate', () => { this.three._popsate() })

    for(var i=0; i<transitionTrigger.length; i++){
      transitionTrigger[i].addEventListener('click',  (el) => { this.three._start(el)}, false);
    }

    for(var i=0; i<projects.length; i++){
      projects[i].addEventListener(MouseOn(), (el) => { this.three._initThumbnail(el) })
      projects[i].addEventListener(MouseOff(),  () => { this.three._removeThumbnail() }, false)
      projects[i].addEventListener('click',  (el) => { this.three._start(el)} , false);
    }

    document.addEventListener('pjax:complete', () => {
      this.three._complete()

      if(projects !== null){
        for(var i=0; i<projects.length; i++){
          projects[i].addEventListener(MouseOn(), (el) => { this.three._initThumbnail(el) })
          projects[i].addEventListener(MouseOff(),  () => { this.three._removeThumbnail() }, false)
          projects[i].addEventListener('click',  (el) => { this.three._start(el)}, false);
        }
      }
    })
  }

  _onResize(el) {
    this.three.camera.aspect = window.innerWidth / window.innerHeight
    this.three.camera.updateProjectionMatrix()
    this.three.renderer.setSize(window.innerWidth, window.innerHeight)
    this.style._onResize()
    // console.log(this.style.Height, window.innerHeight);
    // this.style.Width = window.innerWidth
    // this.style.Height = window.innerHeight
    this.el.style.width = window.innerWidth + 'px'
    this.el.style.height = window.innerHeight + 'px'
  }

}
