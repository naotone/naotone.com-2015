// import Bg from './bg.js';
// import Util from './util.js';
// const date = Util.formatDate();
var mode = 'normal';
var inner = document.querySelector('.inner');

var pjaxTime = 1000;
var bPjax = false;
var projects = 0;
var particlesOn = true;
var loading;
var bLoading = true;

var mouseon;
mouseon = (function() {
  if (Modernizr.touch) {
    return "touchstart";
  } else {
    return "mouseenter";
  }
})();

function pjaxCounter(){
  console.log(bPjax);
  console.log(pjaxTime);
  pjaxTime++;

  setTimeout(pjaxCounter, 10);
  if(pjaxTime > 150 && !bPjax){
    // document.getElementById('wrap').className = ' ';
    bPjax = true;
  }
}

pjaxCounter();

function pjaxSend(){
}





function pjaxComplete(){
    bPjax = false;
      pjaxTime = 0;
      projects = document.getElementsByClassName("project");
      if(projects !== null)
      for(var i=0; i<projects.length; i++){
        // console.log(projects[i]);
        projects[i].addEventListener(mouseon, loadTex, false);
        projects[i].addEventListener('click', projectsIn, false);

        projects[i].addEventListener('mouseleave', removeTex, false);
      }
      preLoadImages();

}


var jsPjax;
jsPjax = document.querySelectorAll('nav a, h1 a');
for(var i=0; i<jsPjax.length; i++){
  jsPjax[i].addEventListener('click', pjaxStart, false);
}

function pjaxStart(){
  bLoading = true;
  particlesOn = false;
  for (var i=0; i<flyingParticles.length; i++){
    var p = flyingParticles[i];
    var s = p.mesh.scale.x;
    var ss = Math.max(p.mesh.scale.x*6, 4)

    TweenMax.to(p.mesh.position, 0.6, {
      x: p.mesh.position.x * 3,
      y: p.mesh.position.y * 3,
      z: 3000,
    	ease: Cubic.In
    });
  }

}


new Pjax({
  elements: 'a[href]', // default is 'a[href], form[action]'
  selectors: ['title', '.js-Pjax'],
  switches: {
    '.js-Pjax': Pjax.switches.sideBySide
  },
  switchesOptions: {
    '.js-Pjax': {
      classNames: {
        // class added on the element that will be removed
        remove: "Animated Animated--reverse Animate--fast Animate--noDelay",
        // class added on the element that will be added
        add: "Animated",
        // class added on the element when it go backward
        backward: "Animate--slideIn",
        // class added on the element when it go forward (used for new page too)
        forward: "Animate--slideOut"
      },
      callbacks: {

        // removeElement: function(el) {
        //   el.style.marginLeft = '-' + (window.innerWidth/2) + 'px'
        // }
        // removeElement: function(el) {
          // document.getElementById('spinnerWrap').className  = 'off';
        // }
        //   // if(hasClass(document.querySelector('section'), 'works')){
        //     // console.log('!!!');
        //
        //     projects = document.getElementsByClassName("project");
        //     for(var i=0; i<projects.length; i++){
        //       projects[i].addEventListener(mouseon, loadTex, false);
        //       projects[i].addEventListener('click', projectsIn, false);
        //
        //       projects[i].addEventListener('mouseleave', removeTex, false);
        //     }
        //   // }
        // }
      }
    }
  }
})


document.addEventListener("pjax:send", pjaxSend)
document.addEventListener("pjax:complete", pjaxComplete)

if( window.location.href.indexOf("works") > -1){
    projects = document.getElementsByClassName("project");
    for(var i=0; i<projects.length; i++){
      projects[i].addEventListener(mouseon, loadTex, false);
      projects[i].addEventListener('click', projectsIn, false);

      projects[i].addEventListener('mouseleave', removeTex, false);
    }
}

/////////////////////////////////////
// THREE
/////////////////////////////////////
var scene, cam, shadowLight, light, backLight, renderer, time, clock;

var container,
    HEIGHT,
    WIDTH,
    windowHalfX,
    windowHalfY,
    FOV,
    aspectRatio,
    nearPlane,
    farPlane,
    camZ,
    mesh,
    stats,
    particleArray = [],
    flyingParticles = [],
    // colors = ['#ffffff','#dddddd', '#bbbbbb','#777777','#333333'],
    colors = ['#ffffff','#EA6A63','#61D0EA', '#EAA760','#EEEEEE','#777777'],
    // colors0x = ['0xffffff','0xdddddd', '0xbbbbbb','0x777777','0x333333']
    colors0x = ['0xFFFFFF','0xEA6A63','0x61D0EA', '0xEAA760','0xEEEEEE','0x777777']
    ;

var cube, bActive = false;
var cubes = [];
var mouseX = 0, mouseY = 0;
var speed = {x:0, y:0};
var smoothing = 10;

var maxParicles = 120;
var frequency = 3;

var counter = 0;
var loadingTex = false;
var tex;



window.addEventListener('resize', onWindowResize, false);
window.addEventListener('resize', styling, false);
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
window.addEventListener('click', changeMode, false);

function changeMode(){
  // mode = 'line';
}




preLoadImages();
initDocument();


function styling(){
  HEIGHT = window.innerHeight;
  var sections = document.querySelectorAll('section');
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.height = HEIGHT*0.7 +'px';
    // sections[i].style.visibility = 'visible';
  }
  // document.getElementById('header').style.height = HEIGHT +'px';
  document.body.style.height = HEIGHT +'px';
  document.body.style.visibility = 'visible';
}


function projectsIn(id){
  for(var i=0; i<projects.length; i++){
    scrollInOut(projects[i].nextElementSibling, 'auto', 600, easing.easeInOutQuart, true);
  }
  scrollInOut(this.nextElementSibling, 'auto', 600, easing.easeInOutQuart, false, function(){
    bActive = true;
  });
}

function scrollInOut(elem, target, duration, easingFunction, close, callback) {
    var start = Date.now(),
    reverse = false;
    if(target == 'auto'){
      target = elem.scrollHeight;
    }
    if(elem.offsetHeight > 0 && close){
      reverse = true;
    }

    function min(a,b) {
    	return a<b?a:b;
    }

    function scroll(timestamp) {

        var currentTime = Date.now(),
            time = min(1, ((currentTime - start) / duration)),
            easedT = easingFunction(time);
          if(reverse == true){
            elem.style.height = target - (easedT * (target)) + 'px';
          }else if(!close){
            elem.style.height = (easedT * (target)) + 'px';
          }


        if(time < 1) requestAnimationFrame(scroll);
        else
            if(callback) callback();
    }

    requestAnimationFrame(scroll)
}

function fadeInOut(elem, target, duration, easingFunction, inOut, callback) {
    var start = Date.now();

    function min(a,b) {
    	return a<b?a:b;
    }

    function fade(timestamp) {
        var currentTime = Date.now(),
            time = min(1, ((currentTime - start) / duration)),
            easedT = easingFunction(time);
          if(inOut == true){
            elem.style.opacity = target - (easedT * (target));
          }else{
            elem.style.opacity = (easedT * (target));
          }
        if(time < 1) requestAnimationFrame(fade);
        else
            if(callback) callback();
    }

    requestAnimationFrame(fade)
}


//////////////////////////////////////
// THREE
//////////////////////////////////////

function preLoadImages(){
      // NProgress.start();
      // document.getElementById('spinnerWrap').className  = 'on';
      projects = document.getElementsByClassName('project');

      if(projects.length > 0){
      var textureManager = new THREE.LoadingManager();
      textureManager.onLoad = function () {
          // console.log('done');
          // NProgress.done();
          particlesOn = true;
          bLoading = false;

          // document.getElementById('spinnerWrap').className  = 'off';
      };
        var textureLoader = new THREE.ImageLoader( textureManager );
        var myTextureArray = [];
        var myTexture = new THREE.Texture();
        myTextureArray.push( myTexture );

        for (var i = 0; i < projects.length; i++) {
          var image = projects[i].dataset.tex;
          textureLoader.load( [image], function ( image ) {
              myTexture.image = image;
          } );
        }
      }
      else{
        particlesOn = true;
        if(bLoading)
          bLoading = false;
        // document.getElementById('spinnerWrap').className  = 'off';
      }
}


function initDocument(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  container = document.getElementById('world');

  initTHREE();
  styling();
}

function initTHREE(){
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.overrideMaterial
  scene.fog = new THREE.FogExp2( 0xf0f0f0, 0.00075 );

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  createStats();
  createCam();
  createLight();
  createLoading();
  animate();
}

function createStats(){
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0';
  stats.domElement.style.right = '0';
  container.appendChild(stats.domElement);
}

function createCam(){
  FOV = 60;
  aspectRatio = WIDTH / HEIGHT;
  nearPlane = 1;
  farPlane = 3000;
  camZ = 3000;
  cam = new THREE.PerspectiveCamera(
    FOV,
    aspectRatio,
    nearPlane,
    farPlane
  );
  cam.position.x = cam.position.y = 0;
  cam.position.z = camZ;
  cam.lookAt({x:0, y:0, z:0 });

}

function createLoading(){
  var textureManager = new THREE.LoadingManager();
  textureManager.onLoad = function () {
      // console.log('done');
      // NProgress.done();
      scene.add(loading);
      // document.getElementById('spinnerWrap').className  = 'off';
  };
    var textureLoader = new THREE.ImageLoader( textureManager );
    var myTexture = new THREE.Texture();
    var image = 'images/loading.jpg';
    textureLoader.load( [image], function ( image ) {
        myTexture.image = image;
    } );



  tex = 'images/loading.jpg';
  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  var material = new THREE.MeshLambertMaterial({
    color: '#ffffff',
    shading: THREE.FlatShading,
    // transparent: false,
    // overdraw: false,
    map: THREE.ImageUtils.loadTexture(tex)
  });
  var s = 5;
  geometry.__dirtyVertices = true;
  geometry.dynamic = true;

  loading = new THREE.Mesh(geometry, material);
  var s;
  s = 3;
  loading.scale.set(s,s,0);
  loading.position.x = 0;
  loading.position.y = 0;
  loading.position.z = 2000;

  // scene.add(loading);
  // loadings.push(loading);


  TweenMax.to(loading.rotation, 5, {
    x: Math.PI*2,
    y: Math.PI*2,
    z: - Math.PI*2,
    ease: Linear.easeNone,
    repeat: -1
  });

}

function createLight(){
  shadowLight = new THREE.DirectionalLight(0xffffff, 1.5);
  shadowLight.position.set(20, 0 ,10);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = 0.01;
  scene.add(shadowLight);

  light = new THREE.DirectionalLight(0xffffff, .5);
  light.position.set(-20, 0, 20);
  scene.add(light);

  backLight = new THREE.DirectionalLight(0xffffff, .1);
  backLight.position.set(0, 0, -20);
  scene.add(backLight);
}

function setupParticle(){
  if(loadingTex == true){
    this.col = '#ffffff';
    this.tex = THREE.ImageUtils.loadTexture(tex);
  }else{
    this.col = getColor();
    this.tex = '';
  }

  if(Math.random() > .5){
    this.geometry = new THREE.CylinderGeometry(100, 0, 100, 3, 3, false);
    this.geometry = new THREE.OctahedronGeometry(100, 0);
    // this.geometry = new THREE.BoxGeometry( 100, 100, 100 );
    this.material = new THREE.MeshLambertMaterial({
      color: this.col,
      shading: THREE.FlatShading,
      // transparent: false,
      // overdraw: false,
      map: this.tex
  });
  }else{
    this.geometry = new THREE.IcosahedronGeometry(50, 0);
    this.material = new THREE.MeshLambertMaterial({
      color: this.col,
      shading: THREE.FlatShading,
      // transparent: false,
      // overdraw: false,
      map: this.tex
    });
  }
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  createParticle(this);

}

function createParticle(p){
  p.material.needsUpdate = true;
  p.mesh.position.z = 0;
  if(loadingTex == false){
    p.mesh.position.x =  (-WIDTH + Math.random()*WIDTH*2 ) /3;
    p.mesh.position.y = (-HEIGHT + Math.random()*HEIGHT*2 ) /3;
    var s = .1 + Math.random();
  }else{
    p.mesh.position.x =  (-WIDTH + Math.random()*WIDTH*2 );
    p.mesh.position.y = (-HEIGHT + Math.random()*HEIGHT*2 );
    var s = .05 + Math.random();
  }
  if(mode == 'line'){
    p.mesh.scale.set(s,s,100);
  }else{
    p.mesh.scale.set(s,s,s);
  }
  // p.mesh.scale.set(10,10,10);

  scene.add(p.mesh);
  particleArray.push(p);
  flyingParticles.push(p);

}

function flyParticle(p){

  p.material.needsUpdate = true;
  var s = p.mesh.scale.x;
  var ss = Math.max(p.mesh.scale.x*6, 4)
  if(mode == 'normal'){
  TweenMax.to(p.mesh.rotation, ss, {
    x: s * 4 *Math.random(),
    y: s * 4 *Math.random(),
    z: s * 4 *Math.random(),
    ease : Quart.out
  });
}else if(mode =='line'){
  TweenMax.to(p.mesh.rotation, 0, {
    // x: s * 4 *Math.random(),
    // y: s * 4 *Math.random(),
    y: Math.PI/2,
    ease : Quart.out
  });

}

  TweenMax.to(p.mesh.position, ss, {
    x: p.mesh.position.x *2,
    y: p.mesh.position.y *2,
    z: 3000,
    ease : Strong.QuartInOut,
    onComplete: function(){
      scene.remove(p.mesh);
      // p.geometry.dispose();
      p.material.dispose();
      flyingParticles.shift();
      createParticle;
    },
    onCompleteParams:[p]
  });
}

function loadTex(id){
  console.log('loadtex');
  if(Modernizr.touch && cube){
    scene.remove(cube);
  }
  // console.log('on');
  // if(!id){
  //   id = this.id;
  // }
  // tex = id;
  tex = this.dataset.tex;
  loadingTex = true;
  for (var i=0; i<flyingParticles.length; i++){
    var p = flyingParticles[i];
    var s = p.mesh.scale.x;
    var ss = Math.max(p.mesh.scale.x*6, 4)

    // p.material.needsUpdate = true;
    // p.material.color.setHex(0xffffff);
    // p.material.map = THREE.ImageUtils.loadTexture( 'images/'+id+'.jpg');

    // TweenMax.to(p.mesh, 0.6, {
    //   x: 2,
    //   y: 2,
    //   z: 2,
    // 	ease: Cubic.In,
    //   delay: 0.01*i
    // });
    TweenMax.to(p.mesh.position, 0.6, {
      x: p.mesh.position.x * 3,
      y: p.mesh.position.y * 3,
      z: 3000,
    	ease: Cubic.In
    });
  }

  // var geometry = new THREE.IcosahedronGeometry(50, 1);

  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  var material = new THREE.MeshLambertMaterial({
    color: '#ffffff',
    shading: THREE.FlatShading,
    // transparent: false,
    // overdraw: false,
    map: THREE.ImageUtils.loadTexture(tex)
  });
  var s = 5;
  geometry.__dirtyVertices = true;
  geometry.dynamic = true;

  cube = new THREE.Mesh(geometry, material);
  var s = 0.01;
  cube.scale.set(s,s,s);
  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 2000;

  scene.add(cube);
  cubes.push(cube);

  TweenMax.to(cube.position, 1, {
    x: 200,
    ease: Cubic.In
  });

  TweenMax.to(cube.scale, 1, {
    x: 5,
    y: 5,
    z: 5,
    ease: Cubic.In
  });


  TweenMax.to(cube.rotation, 5, {
    x: Math.PI*2,
    y: Math.PI*2,
    z: - Math.PI*2,
    ease: Linear.easeNone,
    repeat: -1
  });


}

function removeTex(){
  TweenMax.to(cube.position, 0.5, {
    // x: 0,
    // y: 0,
    z: 3500,
    ease: Cubic.In,
    // onComplete: function(){
    //   scene.remove(cube);
    // }
  });

  loadingTex = false;
  for (var i=0; i<flyingParticles.length; i++){
    var col = getColor0x();
    var p = flyingParticles[i];
    var s = Math.random();
    p.material.needsUpdate = true;
    p.material.color.setHex(col);
    p.material.map = '';
  TweenMax.to(p.mesh.scale, 0.3, {
    x: 0.3+s,
    y: 0.3+s,
    z: 0.3+s,
    ease: Cubic.Out
  });
  // TweenMax.to(particle.mesh.position, particle.mesh.position.z / 500, {
  //   x: particle.mesh.position.x * 1.5,
  //   y: particle.mesh.position.y * 1.5,
  //   z: 3000,
  //   ease: Cubic.Out
  // });

}
}

function getParticle(){
  if(particleArray.length){
    return particleArray.pop();
  }else{
    return new setupParticle();
  }
}

function createParticles(){
  var p = getParticle();
  flyParticle(p);
}

function updateParticlesLoad(){
  if(counter % frequency == 0 && particlesOn){
    createParticles();
  }
  counter++;
}

function animate(){
  requestAnimationFrame(animate);
  updateParticlesLoad();
  render();
  stats.update();
  // console.log(flyingParticles.length);
}


function render(){
  // console.log(bLoading);
  time = clock.getElapsedTime();
  if(!bLoading && bPjax){
      TweenMax.to(loading.scale, 0.2, {
      x: 0.001,
      // y: 0.001,
      z: 0.001,
      ease: Cubic.In
    });
  }else{
      TweenMax.to(loading.scale, 0.4, {
      x: 3,
      y: 3,
      // z: 3,
      ease: Cubic.In
    });
  }
  cam.position.x += ( mouseX - cam.position.x ) * .025;
  cam.position.y += ( - mouseY - cam.position.y ) * .025;
  cam.lookAt( scene.position );

  if(cube){
    if(cube.position.z >= 3000){
      for (var i = 0; i < cubes.length; i++) {
        scene.remove(cubes[i]);
      }
      cubes = [];
  }

  for (var i = 0; i < cube.geometry.vertices.length; i++) {
    cube.geometry.vertices[i].x += Math.sin(time)*50*Math.random();
    cube.geometry.vertices[i].y += Math.cos(time)*50*Math.random();
    cube.geometry.vertices[i].z += Math.cos(time)*50*Math.random();
  }
}
  renderer.render(scene, cam);
}

function onWindowResize(){
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  styling();
}

function onDocumentMouseMove(event) {
  mouseX = ( event.clientX - windowHalfX ) * 0.5;
  mouseY = ( event.clientY - windowHalfY ) * 0.5;
}

function getColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
function getColor0x() {
  return colors0x[Math.floor(Math.random() * colors.length)];
}

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function scrollTo(Y, duration, easingFunction, callback) {

    var start = Date.now(),
    	elem = document.documentElement.scrollTop?document.documentElement:document.body,
    	from = elem.scrollTop;

    if(from === Y) {
        callback();
        return; /* Prevent scrolling to the Y point if already there */
    }

    function min(a,b) {
    	return a<b?a:b;
    }

    function scroll(timestamp) {

        var currentTime = Date.now(),
            time = min(1, ((currentTime - start) / duration)),
            easedT = easingFunction(time);

        elem.scrollTop = (easedT * (Y - from)) + from;

        if(time < 1) requestAnimationFrame(scroll);
        else
            if(callback) callback();
    }

    requestAnimationFrame(scroll)
}

/* bits and bytes of the scrollTo function inspired by the works of Benjamin DeCock */

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
var easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}


function hasClass( el, klass ){
  return (" " + el.className + " " ).indexOf( " "+klass+" " ) > -1;
}

function addClass(el, klass){
  el.className += ' '+klass;
}

function removeClass(el, klass){
  var elClass = ' '+el.className+' ';
  while(elClass.indexOf(' '+klass+' ') != -1)
    elClass = elClass.replace(' '+klass+' ', '');
  el.className = elClass;
}

// this.geometry.gynamic= true;
// this.geometry.__dirtyVertices = true;
// this.geometry.verticesNeedUpdate = true;
// for (var i = 0; i < this.geometry.vertices.length; i++) {
//   this.geometry.vertices[i].x += -10 + Math.random() * 20;
//   this.geometry.vertices[i].y += -10 + Math.random() * 20;
//   this.geometry.vertices[i].z += -10 + Math.random() * 20;
// }
//
