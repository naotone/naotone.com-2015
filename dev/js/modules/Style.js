export default class Style {
  constructor() {
    this.Height = window.innerHeight
    this.Width = window.innerWidth
  }

  init(){
    if(document.querySelector('#header')){
      this._general('#header')
    }else if(document.querySelector('#about') || document.querySelector('#works.list')){
      this._general('section')
    }else if(document.querySelector('#works.single')){
      this._worksSingle()
    }
  }

  _general(_target = 'section'){
    const target = document.querySelector(_target)
    let targetHeight = target.clientHeight
    if(this.Height > targetHeight + 150){
      target.style.top = ( this.Height - targetHeight ) / 2 + 'px'
      target.style.paddingBottom = 0
    }else{
      target.style.top = '150px'
      target.style.paddingBottom = '150px'
    }
  }

  _worksSingle(){
    const header = document.querySelector('header')
    const headerH1 = document.querySelector('header h1')
    const headerA = document.querySelectorAll('header a')
    const section = document.querySelector('section')
    let sectionHeight = section.clientHeight

    header.style.height = this.Height * .95 + 'px'
    headerH1.style.top = (this.Height - headerH1.clientHeight) / 2 + 'px'
    if(headerA){
      for (var i = 0; i < headerA.length; i++) {
        headerA[i].style.top = (this.Height - headerH1.clientHeight) / 2 + 'px'
      }
    }
  }

  _onResize(){
    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.init()
  }

}
