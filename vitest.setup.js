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


// Game globals so classic scripts can import without ReferenceError
const g = globalThis;
g.window = g.window || g;
if (!g.orgs) g.orgs = [];
if (!g.viruses) g.viruses = [];
if (!g.parts) g.parts = [];
if (!g.nutrientClouds) g.nutrientClouds = [];
if (!g.settings) g.settings = { renderMode: 'cartoon', particles: true, virusRate: 1, currents: false, healthBars: true, predation: 1, divRate: 1, simSpeed: 1 };
if (!g.stats) g.stats = { births: 0, deaths: 0, deathCauses: {} };
if (!g.player) g.player = { x: 0, y: 0, alive: true, energy: 80, size: 4 };
if (typeof g.state === 'undefined') g.state = 'menu';
if (typeof g.zoom === 'undefined') g.zoom = 1.8;
if (!g.cam) g.cam = { x: 0, y: 0 };
if (typeof g.tod === 'undefined') g.tod = 10;
if (typeof g.dayLight === 'undefined') g.dayLight = 1;
if (typeof g.gt === 'undefined') g.gt = 0;
if (typeof g.difficulty === 'undefined') g.difficulty = 'normal';
if (!g.DCODE) g.DCODE = { EATEN: 0, LYSIS: 1, TEMP: 2, STARVE: 3, AGE: 4 };
if (!g.FOOD) g.FOOD = { producer: [], consumer1: ['producer'], consumer2: ['producer','consumer1'], consumer3: ['producer','consumer1','consumer2'], decomposer: [] };
if (typeof g.clamp !== 'function') g.clamp = (v,a,b) => Math.min(b, Math.max(a, v));
if (typeof g.lerp !== 'function') g.lerp = (a,b,t) => a + (b-a)*t;
if (typeof g.dist2 !== 'function') g.dist2 = (a,b) => { const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy; };
if (typeof g.rng !== 'function') g.rng = (a,b) => a + (b-a)*0.5;
if (typeof g.canDivide !== 'function') g.canDivide = () => false;
if (typeof g.doDivide !== 'function') g.doDivide = () => {};
if (typeof g.killOrg !== 'function') g.killOrg = (o) => { if(o) o.alive=false; };
if (typeof g.eatOrg !== 'function') g.eatOrg = () => {};
if (typeof g.forceEat !== 'function') g.forceEat = () => {};
if (typeof g.updateOrg !== 'function') g.updateOrg = () => {};
if (typeof g.render !== 'function') g.render = () => {};

if (!g.speciesPop) g.speciesPop = {};
