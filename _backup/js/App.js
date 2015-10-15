// import * as Pjax from './Pjax.js';
// import Parm from './Parameters.js'
import Util from './Util.js'
import myPjax from './Pjax.js'
import Three from './_Three.js'

export var colors = ['ffffff','EA6A63','61D0EA', 'EAA760','EEEEEE','777777']
export var items = document.querySelectorAll('nav a, h1 a')
export var time = 1000, bPjax = false, bLoading = false, bParticles= true
export var projects = document.getElementsByClassName('projects')
export var flyingParticles = [], particleArray  = [], cubes = []
export var bLoadingTex = false, counter = 0, frequency = 3, bParticles = true , mouseX = 0, mouseY = 0

window.onload = () =>{

  new Pjax({
    elements: 'a[href]',
    selector: ['title', 'js-Pjax']
  })

  var MyPjax = new myPjax(document.querySelectorAll('nav a, h1 a'), time, bPjax, bLoading, bParticles)
  var util = new Util()
  var three = new Three(document.getElementById('world'))

  // document.body.style.visibility = 'visible'
}
