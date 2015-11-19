import {GetColor} from './Util'

import {pjaxTime, bPjax, bLoading, bParticles, bThumbnail, thumbnail} from './Space'

export class Meteor {
  constructor(color, shape, texture){
    !color ? color = '#ffffff' : color
    if(texture){
      texture = texture.replace(/images\//g, 'images/128/')
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
          this.cubes[i].geometry.dispose()
          this.cubes[i].material.dispose()
          this.cubes[i].texture.dispose()
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
      p.mesh.position.x = (-this.Width + Math.random()*this.Width*2) / 3
      p.mesh.position.y = (-this.Height + Math.random()*this.Height*2) / 3
      // p.mesh.position.x = (-this.Width + Math.random()*this.Width * 2)
      // p.mesh.position.y = (-this.Height + Math.random()*this.Height * 2)
    }
    const scale = 0.1
    p.mesh.scale.set(scale, scale, scale)

    this.flyingParticles.push(p)
    bParticles == true ? this._flyParticle(p) : this._flyParticle(p, 'fast')
    return p.mesh

  }

  _flyParticle(p, mode){
    let thisMesh = p.mesh
    let scale = thisMesh.scale.x * Math.random() * 7
    let duration = 4
    let scaleDuration = 1
    let rotate = Math.random() > 0.5 ? scale : - scale

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
      x: Math.PI * 2 * rotate,
      y: Math.PI * 2 * rotate,
      z: Math.PI * 2 * rotate,
      ease : Power0.easeNone
    });
    TweenMax.to(p.mesh.position, duration, {
      x: p.mesh.position.x * 1.5,
      y: p.mesh.position.y * 1.5,
      z: 3000,
      ease: Strong.QuartIn
    });

  }

  _createParticles(){
    let p = this._getParticle();
    this._flyParticle(p);
  }

  _updateParticlesLoad(){
    let shape = Math.random()
    let color = GetColor(this.colors, '#')
    let texture = thumbnail
      return this._createParticle(new Meteor(color, shape, texture) )
  }

}
