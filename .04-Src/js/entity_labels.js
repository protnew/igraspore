// entity_labels.js — floating name/type captions (demo viruses + aquarium)
"use strict";

function placeDemoViruses(){
  if(typeof viruses === 'undefined' || typeof VIRUS_SPECS === 'undefined') return;
  var rowY0 = 30, rowGap = 110, colGap = 70;
  var g = 6;
  var list = VIRUS_SPECS;
  var y = rowY0 + (g - 1) * rowGap;
  var n = list.length;
  var totalW = Math.max(0, n - 1) * colGap;
  var x0 = -totalW / 2;
  for(var i = 0; i < n; i++){
    var sp = list[i];
    if(!sp) continue;
    var x = x0 + i * colGap;
    var yy = y + ((i % 3) - 1) * 6;
    viruses.push({
      x: x, y: yy, vx: 0, vy: 0, sp: sp, target: null, age: 0,
      angle: 0, wobble: 0, demoPinned: true,
      demoHomeX: x, demoHomeY: yy, demoBobPhase: i,
      demoGroup: g, demoIndex: sp.num || (i + 1), demoSpNum: sp.num || (i + 1),
      demoLabel: tt('demo.grp.virus')
    });
  }
}

function _captionChip(text, x, y){
  if(settings && settings.economy && !window.demoMode) return;
  if(!text || typeof ctx === 'undefined') return;
  ctx.font = 'bold 13px system-ui,sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  var tw = Math.min(220, ctx.measureText(text).width);
  var pad = 16, left = x - tw / 2 - 5, top = y - 16, w = tw + 10, h = 17;
  if(typeof cv !== 'undefined'){
    if(left < pad || top < pad || left + w > cv.width - pad || top + h > cv.height - pad) return;
  }
  window._capOcc = window._capOcc || [];
  for(var ci=0; ci<window._capOcc.length; ci++){
    var o=window._capOcc[ci];
    if(left < o.r && left+w > o.l && top < o.b && top+h > o.t) return;
  }
  window._capOcc.push({l:left, t:top, r:left+w, b:top+h});
  ctx.fillStyle = 'rgba(0,8,16,0.88)';
  ctx.fillRect(left, top, w, h);
  ctx.fillStyle = '#f4fff8';
  ctx.fillText(text, x, y - 3);
}

function _shortCat(cat){
  var k = 'catShort.' + cat;
  var v = (typeof tt === 'function') ? tt(k) : k;
  return (v && v !== k) ? v : '';
}

function _screenOf(x, y){
  var z = (typeof zoom === 'number' && zoom > 0) ? zoom : 1;
  return {
    sx: (x - cam.x) * z + cv.width / 2,
    sy: (y - cam.y) * z + cv.height / 2,
    z: z
  };
}

// v20.12 V30: demo virus caption like species #N (no dark plaque); hidden under the demo panel or another caption
function _demoVirusCap(text, x, y){
  ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  var w = ctx.measureText(text).width + 4, h = 15, l = x - w / 2, t = y;
  var pe = window._demoPanelEl; if(pe && pe.offsetParent !== null){ var pr = pe.getBoundingClientRect(), k = cv.width / (window.innerWidth || cv.width);
    if(l < (pr.right) * k && l + w > pr.left * k && t < pr.bottom * k && t + h > pr.top * k) return; }
  for(var i = 0; i < window._capOcc.length; i++){ var c = window._capOcc[i]; if(l < c.r && l + w > c.l && t < c.b && t + h > c.t) return; }
  window._capOcc.push({l:l, t:t, r:l + w, b:t + h});
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillText(text, x + 1, y + 1);
  ctx.fillStyle = '#ffd0d0'; ctx.fillText(text, x, y);
}

function drawDemoVirusLabels(){
  if(!window.demoMode || !window._demoLabels) return;
  if(typeof viruses === 'undefined' || typeof ctx === 'undefined') return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  window._capOcc = [];
  var banner = false;
  for(var i = 0; i < viruses.length; i++){
    var v = viruses[i];
    if(!v || !v.demoPinned) continue;
    var p = _screenOf(v.x, v.y);
    if(p.sx < -40 || p.sx > cv.width + 40 || p.sy < -40 || p.sy > cv.height + 40) continue;
    if(!banner && v.demoLabel){
      banner = true;
      ctx.font = 'bold 14px system-ui,sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(0,10,20,0.72)';
      var tw = ctx.measureText(v.demoLabel).width + 12;
      ctx.fillRect(p.sx - 28, p.sy - 46, tw, 20);
      ctx.fillStyle = '#f66';
      ctx.fillText(v.demoLabel, p.sx - 24, p.sy - 30);
    }
    var num = '#' + String(v.demoSpNum || v.demoIndex || '');
    var name = (v.sp && v.sp.name) ? v.sp.name.split(' ')[0] : 'virus';
    _demoVirusCap(num + ' ' + name, p.sx, p.sy + 18); // v20.12 V30: same look as species #N captions
  }
  ctx.restore();
}

function drawWorldCaptions(){
  if(typeof ctx === 'undefined' || typeof cam === 'undefined') return;
  var z = (typeof zoom === 'number' && zoom > 0) ? zoom : 1;
  var items = [];
  var i;
  if(typeof orgs !== 'undefined'){
    for(i = 0; i < orgs.length; i++){
      var o = orgs[i];
      if(!o || !o.alive || !o.sp) continue;
      var dx = o.x - cam.x, dy = o.y - cam.y;
      if(Math.abs(dx) * z > cv.width * 0.48 || Math.abs(dy) * z > cv.height * 0.48) continue;
      items.push({ x: o.x, y: o.y, size: o.size || 4, d: dx * dx + dy * dy,
        name: o.sp.name || '', cat: o.sp.cat, color: o.sp.color || '#fff' });
    }
  }
  if(typeof viruses !== 'undefined'){
    for(i = 0; i < viruses.length; i++){
      var v = viruses[i];
      if(!v || !v.sp) continue;
      var dx2 = v.x - cam.x, dy2 = v.y - cam.y;
      if(Math.abs(dx2) * z > cv.width * 0.48 || Math.abs(dy2) * z > cv.height * 0.48) continue;
      items.push({ x: v.x, y: v.y, size: v.size || 4, d: dx2 * dx2 + dy2 * dy2,
        name: v.sp.name || 'virus', cat: 'virus', color: '#f88' });
    }
  }
  items.sort(function(a, b){ return a.d - b.d; });
  if(items.length > 26) items.length = 26;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  window._capOcc = [];
  for(i = 0; i < items.length; i++){
    var it = items[i];
    var p = _screenOf(it.x, it.y);
    var short = (it.name || '').split(' ')[0];
    var cat = _shortCat(it.cat);
    var line = short + (cat ? ' · ' + cat : '');
    var y = p.sy - Math.max(16, (it.size || 4) * p.z + 10);
    _captionChip(line, p.sx, y);
  }
  ctx.restore();
}

function renderSpectatorCaptions(){
  var demo = !!window.demoMode;
  var aquarium = !!(window._aquariumLock || (window.spectatorMode && !window.demoMode && (typeof player === 'undefined' || !player)));
  if(!entityLabelsOn({ demoMode: demo, demoLabels: window._demoLabels !== false, aquarium: aquarium })) return;
  if(demo){ drawDemoVirusLabels(); return; }
  if(aquarium) drawWorldCaptions();
}

if(typeof window !== 'undefined'){
  window.placeDemoViruses = placeDemoViruses;
  window.renderSpectatorCaptions = renderSpectatorCaptions;
}
