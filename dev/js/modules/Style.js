export default class Style {
  constructor() {
    this.Height = window.innerHeight
    this.Width = window.innerWidth
  }

  init(){
    // console.log('style.init')
    if(document.querySelector('#header')){
      this._top()
    }else if(document.querySelector('#about')){
      this._about()
    }else if(document.querySelector('#works.list')){
      this._about()
    }else if(document.querySelector('#works.single')){
      this._worksSingle()

    }

  }

  _genaral(){

  }

  _top(){
    const header = document.getElementById('header')
    let headerHeight = header.clientHeight
    if(this.Height > headerHeight + 150){
      header.style.top = ( this.Height - headerHeight ) / 2 + 'px'
      header.style.paddingBottom = 0
    }else{
      header.style.top = '150px'
      header.style.paddingBottom = '150px'
    }
  }

  _about(){
    const section = document.querySelector('section')
    let sectionHeight = section.clientHeight
    if(this.Height > sectionHeight + 150){
      section.style.top = ( this.Height - sectionHeight ) / 2 + 'px'
      section.style.paddingBottom = 0
    }else{
      section.style.top = '150px'
      section.style.paddingBottom = '150px'
    }

  }

  _works(){
    const section = document.querySelector('section')
    let sectionHeight = section.clientHeight
    if(this.Height > sectionHeight + 150){
      section.style.top = ( this.Height - sectionHeight ) / 2 + 'px'
      section.style.paddingBottom = 0
    }else{
      section.style.top = '150px'
      section.style.paddingBottom = '150px'
    }

  }

  _worksSingle(){
    const header = document.querySelector('header')
    const headerH1 = document.querySelector('header h1')
    const headerA = document.querySelector('header a')
    const section = document.querySelector('section')
    let sectionHeight = section.clientHeight

    header.style.height = this.Height * .95 + 'px'
    headerH1.style.top = (this.Height - headerH1.clientHeight) / 2 + 'px'
    headerA ? headerA.style.top = (this.Height - headerH1.clientHeight) / 2  + 'px' : null
    // if(this.Height > sectionHeight + 150){
    //   section.style.top = ( this.Height - sectionHeight ) / 2 + 'px'
    //   section.style.paddingBottom = 0
    // }else{
    //   section.style.top = '100px'
    //   section.style.paddingBottom = '100px'
    // }

  }

  _onResize(){
    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.init()
  }

}
