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
    colors = ['#EA6A63','#61D0EA', '#EAA760','#EEEEEE','#333333'],
    colors0x = ['0xEA6A63','0x61D0EA', '0xEAA760','0xEEEEEE','0x333333']
    ;

var cube;
var cubes = [];
var mouseX = 0, mouseY = 0;
var speed = {x:0, y:0};
var smoothing = 10;

var maxParicles = 120;
var frequency = 3;

var counter = 0;
var loadingTex = false;
var tex;
var projects = document.getElementsByClassName("project");

window.addEventListener('resize', onWindowResize, false);
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
// window.addEventListener( 'mouseenter', loadTex, false );
// test.addEventListener( 'mouseleave', removeTex, false );
for(var i=0; i<projects.length; i++){
  projects[i].addEventListener('mouseenter', loadTex, false);
}
for(var i=0; i<projects.length; i++){
  projects[i].addEventListener('mouseleave', removeTex, false);
}

NProgress.start();

initDocument();


var textureManager = new THREE.LoadingManager();
textureManager.onLoad = function () {
    console.log('done');
    NProgress.done();
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
  console.log(i);
}


function initDocument(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  container = document.getElementById('world');

  initTHREE();
}

function initTHREE(){
  clock = new THREE.Clock();
  console.log(time);
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

function createLight(){
  shadowLight = new THREE.DirectionalLight(0xffffff, 2);
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
  p.mesh.scale.set(s,s,s);
  // p.mesh.scale.set(10,10,10);

  scene.add(p.mesh);
  particleArray.push(p);
  flyingParticles.push(p);

}

function flyParticle(p){

  p.material.needsUpdate = true;
  var s = p.mesh.scale.x;
  var ss = Math.max(p.mesh.scale.x*6, 4)
  TweenMax.to(p.mesh.rotation, ss, {
    x: s * 4 *Math.random(),
    y: s * 4 *Math.random(),
    z: s * 4 *Math.random(),
    ease : Quart.out
  });

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
  // console.log('on');
  id = this.id;
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
  cube.position.x = cube.position. y = 0;
  cube.position. z = 2000;

  scene.add(cube);
  cubes.push(cube);

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
    z: 3000,
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
  if(counter % frequency == 0){
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
  time = clock.getElapsedTime();
  // console.log(cubes.length);
  // console.log(time);
  cam.position.x += ( mouseX - cam.position.x ) * .05;
  cam.position.y += ( - mouseY - cam.position.y ) * .05;
  cam.lookAt( scene.position );

  if(cube){
    // console.log(cube);
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



// this.geometry.gynamic= true;
// this.geometry.__dirtyVertices = true;
// this.geometry.verticesNeedUpdate = true;
// for (var i = 0; i < this.geometry.vertices.length; i++) {
//   this.geometry.vertices[i].x += -10 + Math.random() * 20;
//   this.geometry.vertices[i].y += -10 + Math.random() * 20;
//   this.geometry.vertices[i].z += -10 + Math.random() * 20;
// }
//
