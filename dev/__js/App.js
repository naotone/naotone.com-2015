import { MouseOn, AddClass, RemoveClass, Easing} from './Util'

window.onload = () =>{

  new Pjax({
    elements: 'a[href]',
    selector: ['title', 'js-Pjax']
  })
  // console.log('Util: ' + Util);

  // AddClass(document.body, '999')
  // AddClass(document.body, '7666')
  // RemoveClass(document.body, '999')
  // RemoveClass(document.body, '7666')

  console.log(Easing('linear', 10));
  console.log(Easing('easeInQuad', 10));
  console.log(Easing('easeInCubic', 10));
  // console.log('util: ' + util);
  // console.log('Util: ' + Util);
  // console.log(Util.MouseOn);
  // document.body.style.visibility = 'visible'
}
