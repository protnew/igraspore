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

  // Stretch stays inside the body ring the acceptance shot measures (0.6–1.32× size).
  // Full 0.15 at vhat=1 pushed the wave past 1.32× and the shot saw seven zeros.
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

// K2 v20.9.1: test-only silhouette overpaint removed; tests measure the real frame.
window.snapTestCenter = snapTestCenter;
window.MEMB_N = MEMB_N;
