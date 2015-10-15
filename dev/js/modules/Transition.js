import Particle from './Particle'
import {MouseOn} from './Util'

export default class Transition{
  constructor() {
    this.three = new Particle()
    // this.ioio = this.flyingParticles.length
    this.time = 1000
    this.bPjax = false
    this.bLoading = true

  }

  init(){
  }

  _counter(){
    // console.log(three);
    // console.log(flyingParticles);
    // console.log(this.io);
    // console.log(this.flyingParticles);
    // console.log('this.' + this.flyingParticles);
    this.time++
    // console.log(this.time);

    if(this.time < 150 && !this.bPjax){
      this.bPjax = true
    }

    requestAnimationFrame(this._counter.bind(this))
  }

  _update(){
  }

  _start(flyingParticles){
    console.log('pjaxStart');
    this.bLoading = true
    this.particlesOn = false
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

  _complete(three){
    this.bPjax = false
    this.time = 0
    const projects = document.getElementsByClassName("project");
    console.log(projects);
    if(projects !== null){
      for(var i=0; i<projects.length; i++){
        projects[i].addEventListener(MouseOn(), (e) => { this.three._loadTex(e) })
        projects[i].addEventListener('mouseleave',  () => { this.three._removeTex() }, false)
      }
    }
    this.three._preLoadImages(false, 0);
  }

}
