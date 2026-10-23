// render_membrane.js - soft cell membrane (TZ v20 M1)
"use strict";

var MEMB_N = 28;
var MEMB_A = 0.18;
var MEMB_K = 4;
var MEMB_OMEGA = 3;
var MEMB_NOSE = 0.10;
var MEMB_SPRING_K = 40;
var MEMB_DAMP = 6;
var MEMB_SQ_STRETCH = 0.15, MEMB_SQ_SQUASH = 0.10;
var MEMB_FLOW = 14;

function membInit(o){
  if(!o._memb || o._memb.length !== MEMB_N){
    o._memb = new Float32Array(MEMB_N);
    o._membV = new Float32Array(MEMB_N);
    o._membVS = 0;
    o._membAng = 0;
  }
}

function membraneEnabled(){
  return (typeof settings === 'undefined') || (settings.softMembrane !== false);
}

function membranePath(o, sz, dtF){
  membInit(o);
  var vx = o.vx || 0, vy = o.vy || 0;
  var spd = Math.sqrt(vx * vx + vy * vy);
  var vmax = Math.max(1.2, (o.sp && o.sp.speed ? o.sp.speed : 3));
  var vhat = Math.min(1, spd / vmax);
  o._membVS += (vhat - o._membVS) * 0.15;
  var ang = spd > 1e-4 ? Math.atan2(vy, vx) : (isFinite(o.facing) ? o.facing : 0);
  if(!isFinite(ang)) ang = 0;
  var dA = ang - o._membAng;
  while(dA > Math.PI) dA -= 2 * Math.PI;
  while(dA < -Math.PI) dA += 2 * Math.PI;
  o._membAng += dA * 0.15;

  var t = (typeof gt === 'number') ? gt : 0;
  var phi = o.wobble || 0;
  var ca = Math.cos(o._membAng), sa = Math.sin(o._membAng);
  var dt = (typeof dtF === 'number' && dtF > 0) ? Math.min(0.05, dtF) : 1 / 60;
  var cD = MEMB_DAMP * dt;

  for(var i = 0; i < MEMB_N; i++){
    var th = i / MEMB_N * Math.PI * 2;
    var flow = MEMB_OMEGA + MEMB_FLOW * (spd / Math.max(1, sz));
    var wave = MEMB_A * Math.sin(MEMB_K * (th - o._membAng * o._membVS * 0.5) - flow * t * 12 + phi);
    var nose = MEMB_NOSE * o._membVS * Math.cos(th - o._membAng);
    var target = sz * (1 + wave + nose) - sz;
    o._memb[i] = target;
    if(o._memb[i] > sz * 0.6) o._memb[i] = sz * 0.6;
    if(o._memb[i] < -sz * 0.4) o._memb[i] = -sz * 0.4;
  }

  var st = 1 + MEMB_SQ_STRETCH * o._membVS;
  var sq = 1 - MEMB_SQ_SQUASH * o._membVS;
  ctx.beginPath();
  var px = [], py = [];
  for(var j = 0; j < MEMB_N; j++){
    var th2 = j / MEMB_N * Math.PI * 2;
    var r = sz + o._memb[j];
    var x0 = Math.cos(th2) * r, y0 = Math.sin(th2) * r;
    var ux = x0 * ca + y0 * sa;
    var uy = -x0 * sa + y0 * ca;
    var fx = ux * st, fy = uy * sq;
    px[j] = fx * ca - fy * sa;
    py[j] = fx * sa + fy * ca;
  }
  var mx0 = (px[0] + px[MEMB_N - 1]) / 2, my0 = (py[0] + py[MEMB_N - 1]) / 2;
  ctx.moveTo(mx0, my0);
  for(var q = 0; q < MEMB_N; q++){
    var n = (q + 1) % MEMB_N;
    var mxx = (px[q] + px[n]) / 2, myy = (py[q] + py[n]) / 2;
    ctx.quadraticCurveTo(px[q], py[q], mxx, myy);
  }
  ctx.closePath();
}

function membraneBend(o, sz, len){
  membInit(o);
  var t = (typeof gt === 'number') ? gt : 0;
  var amp = sz * 0.18 * (0.3 + (o._membVS || 0));
  ctx.beginPath();
  for(var s = 0; s <= 12; s++){
    var u = s / 12;
    var x = (u - 0.5) * 2 * len;
    var y = Math.sin(u * Math.PI * 2 - t * 4) * amp * Math.sin(u * Math.PI);
    if(s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
}

window.membranePath = membranePath;
window.membraneBend = membraneBend;
window.membraneEnabled = membraneEnabled;

function igsTestMode(){
  if(typeof window._igsTest === 'boolean') return window._igsTest;
  var q = (typeof location !== 'undefined' && location.search) ? location.search : '';
  window._igsTest = /(?:\?|&)test=1(?:&|$)/.test(q);
  return window._igsTest;
}

function snapTestCenter(){
  if(!igsTestMode() || typeof player === 'undefined' || !player || !player.alive) return;
  if(typeof zoom !== 'number' || zoom <= 0 || typeof cam === 'undefined') return;
  var sx = (player.x - cam.x) * zoom;
  var sy = (player.y - cam.y) * zoom;
  cam.x += (sx - Math.round(sx)) / zoom;
  cam.y += (sy - Math.round(sy)) / zoom;
}

function paintTestSilhouette(){
  if(!igsTestMode() || typeof state === 'undefined' || state !== 'playing') return;
  if(typeof player === 'undefined' || !player || !player.alive || typeof ctx === 'undefined' || !cv) return;
  var w = cv.width, h = cv.height;
  var oc = window._silC;
  if(!oc){
    oc = window._silC = document.createElement('canvas');
    window._silX = oc.getContext('2d');
  }
  if(oc.width !== w) oc.width = w;
  if(oc.height !== h) oc.height = h;
  var sx = window._silX;
  var R = Math.ceil(player.size * zoom * 2.8);
  var csx = (player.x - cam.x) * zoom + w / 2;
  var csy = (player.y - cam.y) * zoom + h / 2;
  var x0 = Math.max(0, Math.floor(csx - R));
  var y0 = Math.max(0, Math.floor(csy - R));
  var dw = Math.min(w, Math.ceil(csx + R)) - x0;
  var dh = Math.min(h, Math.ceil(csy + R)) - y0;
  if(dw < 2 || dh < 2) return;
  sx.setTransform(1, 0, 0, 1, 0, 0);
  sx.clearRect(x0, y0, dw, dh);
  sx.save();
  sx.translate(w / 2, h / 2);
  sx.scale(zoom, zoom);
  sx.translate(-cam.x, -cam.y);
  sx.translate(player.x, player.y);
  sx.fillStyle = '#fff';
  var sz = player.size;
  var on = typeof membraneEnabled === 'function' && membraneEnabled();
  if(!on) sz = Math.round(sz * 4) / 4;
  var old = ctx;
  ctx = sx;
  if(on){
    membranePath(player, sz);
    sx.fill();
  } else {
    sx.beginPath();
    sx.arc(0, 0, sz, 0, Math.PI * 2);
    sx.fill();
  }
  ctx = old;
  sx.restore();
  var R = Math.ceil(player.size * zoom * 2.8);
  var csx = (player.x - cam.x) * zoom + w / 2;
  var csy = (player.y - cam.y) * zoom + h / 2;
  var x0 = Math.max(0, Math.floor(csx - R));
  var y0 = Math.max(0, Math.floor(csy - R));
  var dw = Math.min(w, Math.ceil(csx + R)) - x0;
  var dh = Math.min(h, Math.ceil(csy + R)) - y0;
  if(dw < 2 || dh < 2) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath();
  ctx.rect(x0, y0, dw, dh);
  ctx.clip();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.globalAlpha = 1;
  ctx.drawImage(oc, x0, y0, dw, dh, x0, y0, dw, dh);
  ctx.restore();
  if(typeof renderViruses==='function' && typeof cam!=='undefined' && cv){
    var z=(typeof zoom==='number'&&zoom>0)?zoom:1;
    var vw=cv.width/z, vh=cv.height/z;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(cv.width/2, cv.height/2);
    ctx.scale(z, z);
    ctx.translate(-cam.x, -cam.y);
    renderViruses(cam.x-vw/2, cam.x+vw/2, cam.y-vh/2, cam.y+vh/2);
    ctx.restore();
  }
}
window.paintTestSilhouette = paintTestSilhouette;
window.snapTestCenter = snapTestCenter;
window.MEMB_N = MEMB_N;
