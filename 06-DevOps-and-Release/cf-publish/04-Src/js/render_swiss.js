/* render_swiss.js — REAL SwissBioPics sprite mode
 * Sprites: assets/bioicons/swiss_sprites/{shape}.png
 * Built from SoT SwissBioPics SVG (CC BY 4.0) — one scheme per game shape.
 * Fallback: light procedural if sprite not ready.
 */
(function(){
'use strict';

var SPRITE_BASE = 'assets/bioicons/swiss_sprites/';
var SHAPES = ['circle','rod','spiral','filament','comma','colony','oval','slipper','bell','irregular','star','phage','trypanosoma','yeast','volvox','archaea','diplococci','trichormus','apicomplexa','mollicutes','clubrod','rodtococcus','rotifer','testate','testate2','flatworm','hypotrich'];
var sprites = {}; // shape -> HTMLImageElement
var loadState = 'idle'; // idle|loading|ready|error
var loadedCount = 0;

// category / name overrides → better sprite
var NAME_OVERRIDE = [
  // PRODUCERS — cyanobacteria
  [/Synechocystis/i, 'circle'],
  [/Anabaena/i, 'filament'],
  [/Spirulina|Arthrospira/i, 'spiral'],
  [/Nostoc/i, 'trichormus'],
  [/Oscillatoria|Phormidium|Leptolyngbya/i, 'filament'],
  [/Microcystis/i, 'colony'],
  [/Gloeocapsa/i, 'diplococci'],
  [/Lyngbya/i, 'filament'],
  [/Prochlorococcus/i, 'circle'],
  [/Chroococcidiopsis/i, 'colony'],
  // PRODUCERS — algae / diatoms
  [/Chlamydomonas/i, 'bell'],
  [/Chlorella/i, 'circle'],
  [/Volvox/i, 'volvox'],
  [/Euglena/i, 'oval'],
  [/Scenedesmus/i, 'diplococci'],
  [/Haematococcus/i, 'oval'],
  [/Dunaliella/i, 'oval'],
  [/Micrasterias|Desmid/i, 'star'],
  [/Navicula/i, 'rod'],
  [/Pinnularia/i, 'clubrod'],
  [/Cyclotella/i, 'circle'],
  [/Diatoma/i, 'rodtococcus'],
  [/Rhodospirillum/i, 'spiral'],
  [/Chromatium/i, 'rod'],
  [/Porphyridium/i, 'circle'],
  // CONSUMER1 — predatory bacteria / flagellates
  [/Bdellovibrio/i, 'comma'],
  [/Vampirococcus/i, 'circle'],
  [/Daptobacter/i, 'rod'],
  [/Myxococcus/i, 'clubrod'],
  [/Bacteriovorax/i, 'clubrod'],
  [/Halobacteriovorax/i, 'clubrod'],
  [/Peredibacter/i, 'rodtococcus'],
  [/^Monas |Oikomonas/i, 'oval'],
  [/Anthophysa|Chilomonas/i, 'oval'],
  [/Cercomonas/i, 'irregular'],
  [/Heteromita/i, 'archaea'],
  [/Bodo|Procryptobia/i, 'comma'],
  [/Trypanosoma/i, 'trypanosoma'],
  [/Leishmania/i, 'mollicutes'],
  [/Monosiga|Salpingoeca|Codonosiga/i, 'bell'],
  // Rotifers — corona + foot sprite (Brachionus/Keratella/Asplanchna/Rotaria/Philodina)
  [/Rotaria|Philodina|Brachionus|Keratella/i, 'rotifer'],
  [/Asplanchna/i, 'oval'], // sac-like planktonic rotifer, no foot
  // Spiny/agglutinated testate amoebae
  [/Euglypha|Nebela|Difflugia/i, 'testate2'],
  // Testate amoebae (shell) & hypotrich ciliates (cirri) — dedicated sprites
  [/Arcella|Difflugia|Euglypha|Nebela|Centropyxis/i, 'testate'],
  [/Stylonychia|Oxytricha|Euplotes/i, 'hypotrich'],
  // Flatworms — dedicated sprite
  [/Macrostomum|Stenostomum|Microstomum/i, 'flatworm'],
  // Decomposer rods — spread visually
  [/Pseudomonas/i, 'clubrod'],
  // CONSUMER2 — ciliates / amoebae
  [/Paramecium caudatum/i, 'slipper'],
  [/Paramecium bursaria/i, 'slipper'],
  [/Stentor/i, 'bell'],
  [/Vorticella/i, 'bell'],
  [/Didinium/i, 'rodtococcus'],
  [/Spirostomum/i, 'filament'],
  [/Blepharisma/i, 'slipper'],
  [/Euplotes|Stylonychia|Oxytricha/i, 'irregular'],
  [/Tetrahymena/i, 'slipper'],
  [/Coleps/i, 'rodtococcus'],
  [/Litonotus/i, 'slipper'],
  [/Dileptus/i, 'clubrod'],
  [/Urocentrum/i, 'oval'],
  [/Zoothamnium|Opercularia/i, 'bell'],
  [/Amoeba|Chaos/i, 'irregular'],
  [/Arcella|Difflugia|Euglypha|Nebela|Centropyxis/i, 'irregular'],
  // CONSUMER3 — heliozoa / rotifers / worms
  [/Actinophrys|Actinosphaerium|Raphidiophrys/i, 'star'],
  [/Rotaria|Philodina/i, 'rod'],
  [/Brachionus|Asplanchna/i, 'oval'],
  [/Keratella/i, 'star'],
  [/Chaetonotus/i, 'rodtococcus'],
  [/Lepidodermella/i, 'clubrod'],
  [/Macrostomum|Stenostomum|Microstomum/i, 'rod'],
  [/Prostoma/i, 'clubrod'],
  [/Trichoplax/i, 'irregular'],
  // DECOMPOSERS — fungi
  [/Saccharomyces/i, 'yeast'],
  [/Candida/i, 'yeast'],
  [/Mucor|Rhizopus/i, 'filament'],
  [/Penicillium|Aspergillus/i, 'filament'],
  [/Batrachochytrium|Chytriomyces/i, 'circle'],
  [/Allomyces/i, 'filament'],
  // DECOMPOSERS — bacteria
  [/Bacillus/i, 'rod'],
  [/Pseudomonas/i, 'rod'],
  [/Streptomyces/i, 'filament'],
  [/Cellulomonas/i, 'rodtococcus'],
  [/Thermus/i, 'rod'],
  [/Deinococcus/i, 'diplococci']
];

function pickShape(o, sh){
  var name = ((o && o.sp && (o.sp.name||o.sp.id||'')) || '').toString();
  var cat = ((o && o.sp && o.sp.cat) || '').toString().toLowerCase();
  if(!NAME_OVERRIDE || !NAME_OVERRIDE.length) return sh || 'circle';
  // Match by species name — most accurate
  for (var i=0;i<NAME_OVERRIDE.length;i++){
    try {
      if (NAME_OVERRIDE[i] && NAME_OVERRIDE[i][0] && NAME_OVERRIDE[i][0].test(name)) return NAME_OVERRIDE[i][1];
    } catch(e) { continue; }
  }
  // Fallback by category
  if (cat === 'virus') return 'phage';
  return sh || 'circle';
}

// Swiss board coverage: species with poor morphotype match
// These will still render (mapped to closest shape) but are flagged as "approximate"
// Used by wiki/UI to show which species have a dedicated vs approximate Swiss sprite
var SWISS_APPROX_SHAPES = {
  // Generic SwissBioPics diagrams are REAL biological schemas.
  // They are NOT approximate — multiple species sharing one morphotype is normal.
  // Only flag shapes that are biologically misleading for specific taxa.
  'oval': false,      // Generic eukaryote oval — real Pombe/yeast shape
  'rod': false,       // Generic bacterial rod — real rod shape
  'circle': false,    // Generic coccus — real coccus shape
  'bell': false,      // Chlamydomonas shape — real
  'irregular': false, // Fungal/amoeba shape — real
  'filament': false,  // Filamentous bacteria — real
  // Dedicated sprites (good match, 1-3 species)
  'trypanosoma': false,
  'apicomplexa': false,
  'mollicutes': false,
  'clubrod': false,
  'rodtococcus': false,
  'yeast': false,
  'volvox': false,
  'slipper': false,
  'star': false,
  'colony': false,
  'comma': false,
  'spiral': false,
  'phage': false
};

window.isSwissApprox = function(o){
  if(!o || !o.sp) return true;
  var sh = pickShape(o, o.sp.shape);
  return SWISS_APPROX_SHAPES[sh] === true;
};

// Count how many species have dedicated vs approximate swiss sprites
window.swissCoverageStats = function(){
  var dedicated = 0, approx = 0;
  if(typeof SPECIES_DB === 'undefined') return {dedicated:0, approx:0, total:0};
  for(var i=0;i<SPECIES_DB.length;i++){
    var sp = SPECIES_DB[i]; if(!sp) continue;
    var sh = pickShape({sp:sp}, sp.shape);
    if(SWISS_APPROX_SHAPES[sh] === true) approx++;
    else dedicated++;
  }
  return {dedicated:dedicated, approx:approx, total:dedicated+approx};
};

function setBaseFromScripts(){
  // if page hosted under subpath, keep relative
  try {
    var scripts = document.getElementsByTagName('script');
    for (var i=0;i<scripts.length;i++){
      var s = scripts[i].src || '';
      if (s.indexOf('render_swiss') >= 0) {
        // base is site root
        break;
      }
    }
  } catch(e){}
}

function liftDarkFills(img){
  try {
    if(!img || !img.naturalWidth) return img;
    var c=document.createElement('canvas');
    c.width=img.naturalWidth; c.height=img.naturalHeight;
    var x=c.getContext('2d');
    x.drawImage(img,0,0);
    var d=x.getImageData(0,0,c.width,c.height), p=d.data, changed=0;
    for(var i=0;i<p.length;i+=4){
      if(p[i+3]<180) continue;
      var lum=0.3*p[i]+0.59*p[i+1]+0.11*p[i+2];
      if(lum<70){
        p[i]=Math.max(p[i], 188);
        p[i+1]=Math.max(p[i+1], 192);
        p[i+2]=Math.max(p[i+2], 198);
        changed++;
      }
    }
    if(!changed) return img;
    x.putImageData(d,0,0);
    return c;
  } catch(e){ return img; }
}

window.loadSwissSprites = function(basePath){
  if (loadState === 'loading' || loadState === 'ready') return;
  loadState = 'loading';
  loadedCount = 0;
  var base = basePath || SPRITE_BASE;
  var total = SHAPES.length;
  var done = function(){
    loadedCount++;
    if (loadedCount >= total) {
      var ok = 0;
      for (var k in sprites) if (spriteReady(sprites[k])) ok++;
      loadState = ok > 0 ? 'ready' : 'error';
      console.log('[swiss] sprites ready', ok+'/'+total, loadState);
    }
  };
  SHAPES.forEach(function(shape){
    var img = new Image();
    img.decoding = 'async';
    img.onload = function(){ sprites[shape] = liftDarkFills(img) || img; done(); };
    img.onerror = function(){ console.warn('[swiss] fail', shape); done(); };
    img.src = base + shape + '.png?v=1';
  });
};

window.swissReady = function(){
  return loadState === 'ready';
};

window.swissLoadState = function(){ return loadState; };
window.swissSpriteStats = function(){
  var ok=0, miss=[], keys=[];
  for (var i=0;i<SHAPES.length;i++){
    var k=SHAPES[i], img=sprites[k];
    if(spriteReady(img)){ ok++; keys.push(k+':'+(img.naturalWidth||img.width)); }
    else miss.push(k);
  }
  return {ok:ok, total:SHAPES.length, state:loadState, miss:miss};
};
function swissDrawSz(sz){
  if (window.demoMode) return Math.max(22, Math.min(38, (sz||4)*6));
  return Math.max(2.2, Math.min(22, (sz||4)*1.15));
}
function spriteReady(img){
  if (!img) return false;
  var w = img.naturalWidth || img.width || 0;
  var h = img.naturalHeight || img.height || 0;
  return w > 1 && h > 1;
}

// Auto-preload shortly after parse (idle)
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(function(){ window.loadSwissSprites(); }, {timeout: 2500});
} else {
  setTimeout(function(){ window.loadSwissSprites(); }, 800);
}

function drawSprite(ctx, o, sz, shapeKey){
  var img = sprites[shapeKey];
  if (!spriteReady(img)) return false;

  // Match cartoon world proportions (was sz*12 / min28 → giant vs lily pads)
  // Cartoon body ~ o.size world units; keep slight bump so diagram still readable.
  var z = (typeof zoom === 'number' && isFinite(zoom) && zoom > 0) ? zoom : 1;
  var drawSz = swissDrawSz(sz);
  // far LOD: tiny on screen → simple disc (big FPS win when zoomed out)
  if (drawSz * z < 3.5 && !(o && o.isPlayer) && !window.demoMode) {
    var r = Math.max(0.8, drawSz * 0.45);
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(230,232,235,0.95)';
    ctx.strokeStyle = 'rgba(40,40,40,0.75)';
    ctx.lineWidth = Math.max(0.4, 1/z);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    return true;
  }
  var iw = img.naturalWidth || img.width;
  var ih = img.naturalHeight || img.height;
  var aspect = iw / ih;
  var dw, dh;
  if (aspect >= 1) { dw = drawSz; dh = drawSz / aspect; }
  else { dh = drawSz; dw = drawSz * aspect; }

  var ang = (typeof o.facing === 'number' && isFinite(o.facing)) ? o.facing
          : (typeof o.angle === 'number' && isFinite(o.angle)) ? o.angle : 0;

  ctx.save();
  ctx.translate(o.x, o.y);
  // rotate elongated shapes with facing
  if (shapeKey === 'rod' || shapeKey === 'spiral' || shapeKey === 'filament' || shapeKey === 'comma' || shapeKey === 'phage' || shapeKey === 'trypanosoma' || shapeKey === 'clubrod' || shapeKey === 'rodtococcus' || shapeKey === 'trichormus') {
    ctx.rotate(ang);
  }

  // soft contact shadow
  ctx.save();
  ctx.translate(1.5, 2);
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, dh*0.15, dw*0.42, dh*0.18, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // pale body under diagram so dark compartments don't read as missing textures
  ctx.fillStyle = 'rgba(236,238,242,0.92)';
  ctx.beginPath(); ctx.ellipse(0, 0, dw*0.46, dh*0.46, 0, 0, Math.PI*2); ctx.fill();
  ctx.drawImage(img, -dw/2, -dh/2, dw, dh);

  // species identity: thin color halo only (does not destroy grey diagram)
  var col = (o.sp && o.sp.color) ? o.sp.color : null;
  if (col) {
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(2, drawSz * 0.055);
    ctx.beginPath();
    ctx.ellipse(0, 0, dw*0.48, dh*0.48, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }


  if (o.energy < 28) {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = 'rgba(40,70,50,0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, dw*0.48, dh*0.48, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
  return true;
}

/* ── minimal procedural fallback (only if sprite missing) ── */
function fbCoccus(ctx, sz, col){
  var r = sz*0.45;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
  ctx.fillStyle = '#f2f3f4'; ctx.strokeStyle = '#333'; ctx.lineWidth = Math.max(1.2, sz*0.04);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,r*0.78,0,Math.PI*2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(r*0.05,0,r*0.28,r*0.2,0.3,0,Math.PI*2);
  ctx.fillStyle = 'rgba(80,85,100,0.35)'; ctx.fill();
  if (col){ ctx.globalAlpha=0.15; ctx.fillStyle=col; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
}
function drawFallback(ctx, o, sz, sh){
  var drawSz = swissDrawSz(sz);
  var col = (o.sp && o.sp.color) || '#888';
  ctx.save(); ctx.translate(o.x, o.y);
  var ang = (typeof o.facing==='number' && isFinite(o.facing)) ? o.facing : 0;
  if (sh==='rod'||sh==='spiral'||sh==='filament') ctx.rotate(ang);
  fbCoccus(ctx, drawSz, col);
  ctx.restore();
  return true;
}

window.drawSwissCell = function(ctx, o, sz, sh){
  // SAFETY NET: skip approximate organisms in strict swiss mode
  if (window._swissStrict && !window.demoMode && typeof isSwissApprox === 'function' && isSwissApprox(o)) {
    return; // don't render — species has no accurate board sprite
  }

  if (loadState === 'idle') window.loadSwissSprites();
  var key = pickShape(o, sh || 'circle');
  // Sessile organisms (Vorticella, Zoothamnium): draw contractile stalk
  var isSessile = (o.locomotion==='sessile' || (o.sp && o.sp.locomotion==='sessile'));
  if (isSessile){
    ctx.save();
    ctx.strokeStyle = '#7a8a6a';
    ctx.lineWidth = Math.max(0.6, sz*0.18);
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    var stalkLen = sz * 6;
    for(var ss=1; ss<=8; ss++){
      var t2 = ss/8;
      var sx = o.x + Math.sin(t2*Math.PI*4 + (o.x*0.1)) * sz * 0.3;
      var sy = o.y + stalkLen * t2;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (loadState === 'ready' && sprites[key]) {
    if (o.dividing) {
      var _da=(typeof DIV_ANIM==='number')?DIV_ANIM:1.25;
      var prog = Math.min(1, (o.divT||0)/_da);
      var ease = prog*prog*(3-2*prog);
      var vis = o.preDivSize || sz;
      var lobe = vis * (1 - ease * 0.48);
      var sep = vis * ease * 0.62;
      var left = {x:o.x-sep, y:o.y, facing:o.facing, angle:o.angle, sp:o.sp, energy:o.energy, isPlayer:o.isPlayer};
      var right = {x:o.x+sep, y:o.y, facing:o.facing, angle:o.angle, sp:o.sp, energy:o.energy, isPlayer:o.isPlayer};
      drawSprite(ctx, left, lobe, key);
      drawSprite(ctx, right, lobe, key);
      return true;
    }
    if (drawSprite(ctx, o, sz, key)) return true;
  }
  // try generic circle sprite
  if (loadState === 'ready' && sprites.circle && drawSprite(ctx, o, sz, 'circle')) return true;
  return drawFallback(ctx, o, sz, sh || 'circle');
};

window.drawSwissVirus = function(ctx, v){
  if (loadState === 'idle') window.loadSwissSprites();
  var fake = { x:v.x, y:v.y, angle:v.angle||0, facing:v.angle||0, sp:{cat:'virus', color:'#c66'} };
  if (loadState === 'ready' && sprites.phage) {
    return drawSprite(ctx, fake, Math.max(1.2, (v.size||1.4)*1.0), 'phage');
  }
  // tiny fallback phage
  ctx.save(); ctx.translate(v.x,v.y); ctx.rotate(v.angle||0);
  ctx.fillStyle='#ddd'; ctx.strokeStyle='#333'; ctx.lineWidth=1.2;
  ctx.beginPath();
  for(var i=0;i<6;i++){
    var a=i/6*Math.PI*2-Math.PI/6;
    var x=Math.cos(a)*8, y=Math.sin(a)*8-3;
    if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,5); ctx.lineTo(0,16); ctx.stroke();
  ctx.restore();
  return true;
};

// Kick load when mode becomes swiss
var _prevMode = null;
setInterval(function(){
  try {
    if (typeof settings !== 'undefined' && settings.renderMode === 'swiss') {
      if (loadState === 'idle') window.loadSwissSprites();
    }
  } catch(e){}
}, 500);

window.pickShape = pickShape;

})();
