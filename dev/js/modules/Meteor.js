import {GetColor} from './Util'

import {pjaxTime, bPjax, bLoading, bParticles, bThumbnail, thumbnail} from './Space'

export class Meteor {
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
}


export class Meteors{
  constructor() {
    this.colors = ['ffffff','EA6A63','61D0EA', 'EAA760','EEEEEE','777777'],
    this.flyingParticles = []
    this.counter = 0
    this.frequency = 2
    this.Height = window.innerHeight
    this.Width = window.innerWidth
  }

  init(){

  }

  _animate(){

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
  }

  _createParticle(p){
    p.mesh.material.needsUpdate =  true

    if(bThumbnail == false){
      p.mesh.position.x = (-this.Width + Math.random()*this.Width*2) / 3
      p.mesh.position.y = (-this.Height + Math.random()*this.Height*2) / 3
    }else {
      p.mesh.position.x = (-this.Width + Math.random()*this.Width * 2)
      p.mesh.position.y = (-this.Height + Math.random()*this.Height * 2)
    }
    const scale = 0.1
    p.mesh.scale.set(scale, scale, scale)

    this.flyingParticles.push(p)
    bParticles == true ? this._flyParticle(p) : this._flyParticle(p, 'fast')
    return p.mesh

  }

  _flyParticle(p, mode){
    const thisMesh = p.mesh
    const scale = Math.random() + .2

    let duration = Math.max(scale * 6, 4)
    let scaleDuration = 1

    if(mode == 'fast'){
       scaleDuration = 0.4
       duration = 1
    }


    TweenMax.to(p.mesh.scale, scaleDuration, {
      x: scale,
      y: scale,
      z: scale,
      ease : Quart.In
    });
    TweenMax.to(p.mesh.rotation, duration, {
      x: scale * 4 *Math.random(),
      y: scale * 4 *Math.random(),
      z: scale * 4 *Math.random(),
      ease : Quart.In
    });
    TweenMax.to(p.mesh.position, duration, {
      x: p.mesh.position.x * 2,
      y: p.mesh.position.y * 2,
      z: 3000,
      ease: Strong.QuartIn
    });

  }

  _createParticles(){
    var p = this._getParticle();
    this._flyParticle(p);
  }

  _updateParticlesLoad(){
    var shape = Math.random()
    var color = GetColor(this.colors, '#')
    var texture = thumbnail
      return this._createParticle(new Meteor(color, shape, texture) )
  }

}
