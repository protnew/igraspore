// jsdom does not implement Canvas 2D fully — stub required APIs used by config.js
const c = document.createElement('canvas'); c.id = 'c'; document.body.appendChild(c);
const mm = document.createElement('canvas'); mm.id = 'mm'; document.body.appendChild(mm);
const pc = document.createElement('canvas'); pc.id = 'pc'; document.body.appendChild(pc);

class FakeGradient {
  addColorStop() {}
}
class FakeCtx {
  constructor() {
    this.fillStyle = '#000';
    this.strokeStyle = '#000';
    this.globalAlpha = 1;
    this.lineWidth = 1;
    this.font = '10px sans-serif';
    this.textAlign = 'left';
    this.textBaseline = 'alphabetic';
    this.shadowBlur = 0;
    this.shadowColor = 'transparent';
  }
  createRadialGradient() { return new FakeGradient(); }
  createLinearGradient() { return new FakeGradient(); }
  save() {}
  restore() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  rect() {}
  fill() {}
  stroke() {}
  fillRect() {}
  clearRect() {}
  strokeRect() {}
  fillText() {}
  strokeText() {}
  measureText(t) { return { width: String(t||'').length * 6 }; }
  translate() {}
  rotate() {}
  scale() {}
  setTransform() {}
  drawImage() {}
  clip() {}
  quadraticCurveTo() {}
  bezierCurveTo() {}
  ellipse() {}
  getImageData(x,y,w,h){ return { data: new Uint8ClampedArray(Math.max(1,w*h*4)), width:w, height:h }; }
  putImageData() {}
  createImageData(w,h){ return { data: new Uint8ClampedArray(Math.max(1,w*h*4)), width:w, height:h }; }
}
if (typeof globalThis.CanvasRenderingContext2D === 'undefined') {
  globalThis.CanvasRenderingContext2D = FakeCtx;
}
const _getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, ...args) {
  if (type === '2d') {
    if (!this.__fakeCtx) this.__fakeCtx = new FakeCtx();
    return this.__fakeCtx;
  }
  try { return _getContext ? _getContext.call(this, type, ...args) : null; } catch(e) { return null; }
};
// Prototype patch target used by config.js guard
if (!CanvasRenderingContext2D.prototype) CanvasRenderingContext2D.prototype = FakeCtx.prototype;
if (!CanvasRenderingContext2D.prototype.createRadialGradient) {
  CanvasRenderingContext2D.prototype.createRadialGradient = function(){ return new FakeGradient(); };
}
