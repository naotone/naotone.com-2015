export const MouseOn = function(){
  if(Modernizr.touch){
    return 'touchstart'
  }else{
    return 'mouseenter'
  }
}


export const AddClass = function(el, _class){
  return  el.className += ' ' + _class
}

export const RemoveClass = function(el, _class){
  let elClass = ' '+　el.className　+' '
  while(elClass.indexOf(' '+_class+' ') != -1){
    elClass = elClass.replace(' '+_class+' ', '')
  }
  el.className = elClass
}

export const HasClass = function(el, _class){
  return (' ' + el.className + ' ').indexOf(' '+_class+' ') > -1
 }


  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

export const GetColor = function(colors, prefix=''){
  return prefix + colors[Math.floor(Math.random() * colors.length)];
}

export const RgbToHex = function(r, g, b, prefix=''){
    return prefix + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }


export const HexToTgb = function(hex){
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

export const Easing = function(mode, t){
  switch(mode){
    case 'linear':
      return t
    break
    // accelerating from zero velocity
    case 'easeInQuad':
      return t*t
    break
    // decelerating to zero velocity
    case 'easeOutQuad':
      return t*(2-t)
    break
    // acceleration until halfway, then deceleration
    case 'easeInOutQuad':
      return t<.5 ? 2*t*t : -1+(4-2*t)*t
    break
    // accelerating from zero velocity
    case 'easeInCubic':
      return t*t*t
    break
    // decelerating to zero velocity
    case 'easeOutCubic':
      return (--t)*t*t+1
    break
    // acceleration until halfway, then deceleration
    case 'easeInOutCubic':
      return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
    break
    // accelerating from zero velocity
    case 'easeInQuart':
      return t*t*t*t
    break
    // decelerating to zero velocity
    case 'easeOutQuart':
      return 1-(--t)*t*t*t
    break
    // acceleration until halfway, then deceleration
    case 'easeInOutQuart':
      return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
    break
    // accelerating from zero velocity
    case 'easeInQuint':
      return t*t*t*t*t
    break
    // decelerating to zero velocity
    case 'easeOutQuint':
      return 1+(--t)*t*t*t*t
    break
    // acceleration until halfway, then deceleration
    case 'easeInOutQuint':
      return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
  }
}
