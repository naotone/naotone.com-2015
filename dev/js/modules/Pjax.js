import {MouseOn} from './Util'

export default class Pjax {
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
    for (var i=0; i<this.meteos.flyingParticles.length; i++){
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
