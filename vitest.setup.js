const c = document.createElement('canvas'); c.id = 'c'; c.width = 1400; c.height = 900; document.body.appendChild(c);
const mm = document.createElement('canvas'); mm.id = 'mm'; mm.width = 200; mm.height = 100; document.body.appendChild(mm);
const pc = document.createElement('canvas'); pc.id = 'pc'; pc.width = 100; pc.height = 100; document.body.appendChild(pc);
window.cv = c;
window.ctx = c.getContext('2d');

// Mock CanvasRenderingContext2D for jsdom
if (typeof CanvasRenderingContext2D === 'undefined') {
  global.CanvasRenderingContext2D = class {
    constructor() {
      this.fillStyle='';this.strokeStyle='';this.lineWidth=1;this.font='';
      this.globalAlpha=1;this.textAlign='left';this.textBaseline='alphabetic';
      this.globalCompositeOperation='source-over';this.imageSmoothingEnabled=true;
      this.shadowColor='';this.shadowBlur=0;this.shadowOffsetX=0;this.shadowOffsetY=0;
    }
    save(){}restore(){}translate(){}rotate(){}scale(){}beginPath(){}
    arc(){}arcTo(){}rect(){}fillRect(){}strokeRect(){}clearRect(){}
    fill(){}stroke(){}closePath(){}moveTo(){}lineTo(){}bezierCurveTo(){}
    quadraticCurveTo(){}drawImage(){}putImageData(){}getImageData(){
      return {data:new Uint8ClampedArray([0,0,0,0])};
    }
    createLinearGradient(){return {addColorStop(){}};}
    createRadialGradient(){return {addColorStop(){}};}
    measureText(){return {width:10};}
    clip(){}isPointInPath(){return false;}
  };
}
// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => 0;
global.cancelAnimationFrame = (id) => {};

// Mock canvas getContext to return a mock 2D context
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === '2d') {
      return {
        fillStyle:'',strokeStyle:'',lineWidth:1,font:'',globalAlpha:1,
        textAlign:'left',textBaseline:'alphabetic',globalCompositeOperation:'source-over',
        imageSmoothingEnabled:true,shadowColor:'',shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,
        canvas: this,
        save(){},restore(){},translate(){},rotate(){},scale(){},beginPath(){},
        arc(){},arcTo(){},rect(){},fillRect(){},strokeRect(){},clearRect(){},
        fill(){},stroke(){},closePath(){},moveTo(){},lineTo(){},bezierCurveTo(){},
        quadraticCurveTo(){},drawImage(){},putImageData(){},
        getImageData(){return {data:new Uint8ClampedArray([0,0,0,0])};},
        createLinearGradient(){return {addColorStop(){}};},
        createRadialGradient(){return {addColorStop(){}};},
        createPattern(){return {};},
        measureText(){return {width:10};},
        clip(){},isPointInPath(){return false;},
        setTransform(){},transform(){},resetTransform(){}
      };
    }
    return null;
  };
  HTMLCanvasElement.prototype.toDataURL = function() { return 'data:image/png;base64,'; };
}
