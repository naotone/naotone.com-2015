import * as Parm from './App.js'
import Util from './Util.js'
import Three from './_Three.js'
// import {items} from './App.js'
// console.log(Parm.time);
// import Parm from './Parameters.js'
// console.log(Parm);
var util = new Util()
// var three = new Three()


export default class Pjax{
  constructor(items, time, bPjax, bLoading, bParticles){
    this.items = items
    this.time = time
    this.bPjax = Parm.bPjax
    this.bParticles = Parm.bParticles
    this.init()
  }
  init(){
    this.setup()
    this.counter()
  }
  setup(){
    for(var i=0; i<this.items.length; i++){
      this.items[i].addEventListener('click', this.start, false);
    }
    document.addEventListener("pjax:complete", this.complete)

  }
  counter(){
    this.time++
    if(this.time < 150 && !this.bPjax){
      this.bPjax = true
    }
    // console.log(this.flyingParticles.length);
    requestAnimationFrame(this.counter.bind(this))
  }
  start(){
    this.flyingParticles = Parm.flyingParticles

    this.bLoading = true
    this.bParticles = false
    document.getElementById('wrap').style.display = 'none'
    console.log(this.flyingParticles);

    for (var i=0; i< this.flyingParticles.length; i++){

      this.p = this.flyingParticles[i]
      this.s = this.p.mesh.scale.x

      TweenMax.to(this.p.mesh.position, 0.6, {
        x: this.p.mesh.position.x * 3,
        y: this.p.mesh.position.y * 3,
        z: 3000,
      	ease: Cubic.In
      });
    }

  }
  complete(){
    this.bPjax = false
    this.time = 0
    this.projects = Parm.projects
    if(this.projects !== null){
      for (var i = 0; i < this.projects.length; i++) {
        console.log(this.prijects[i]);
        this.projects[i].addEventListener(util.mouseon, three.loadtex, false)
        this.projects[i].addEventListener('mouseleave', three.removeTex, false)
      }
      // three.preLoadImages()
    }
  }
}