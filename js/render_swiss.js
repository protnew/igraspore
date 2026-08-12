/* render_swiss.js — REAL SwissBioPics sprite mode
 * Sprites: assets/bioicons/swiss_sprites/{shape}.png
 * Built from SoT SwissBioPics SVG (CC BY 4.0) — one scheme per game shape.
 * Fallback: light procedural if sprite not ready.
 */
(function(){
'use strict';

var SPRITE_BASE = 'assets/bioicons/swiss_sprites/';
var SHAPES = ['circle','rod','spiral','filament','comma','colony','oval','slipper','bell','irregular','star','phage','trypanosoma','yeast','volvox','archaea','diplococci','trichormus','apicomplexa','mollicutes','clubrod','rodtococcus'];
var sprites = {}; // shape -> HTMLImageElement
var loadState = 'idle'; // idle|loading|ready|error
var loadedCount = 0;

// category / name overrides → better sprite
var NAME_OVERRIDE = [
  // PRODUCERS — cyanobacteria
  [/Synechocystis/i, 'circle'],
  [/Anabaena/i, 'filament'],
  [/Spirulina|Arthrospira/i, 'spiral'],
  [/Nostoc/i, 'colony'],
  [/Oscillatoria|Phormidium|Leptolyngbya/i, 'filament'],
  [/Microcystis/i, 'colony'],
  [/Gloeocapsa/i, 'colony'],
  [/Lyngbya/i, 'filament'],
  [/Prochlorococcus/i, 'circle'],
  [/Chroococcidiopsis/i, 'colony'],
  // PRODUCERS — algae / diatoms
  [/Chlamydomonas/i, 'bell'],
  [/Chlorella/i, 'circle'],
  // Volvox moved to dedicated sprite below
  [/Euglena/i, 'oval'],
  [/Scenedesmus/i, 'colony'],
  [/Haematococcus/i, 'oval'],
  [/Dunaliella/i, 'oval'],
  [/Micrasterias|Desmid/i, 'star'],
  [/Navicula|Pinnularia|Diatoma/i, 'rod'],
  [/Cyclotella/i, 'circle'],
  [/Rhodospirillum/i, 'spiral'],
  [/Chromatium/i, 'rod'],
  [/Porphyridium/i, 'circle'],
  // CONSUMER1 — predatory bacteria / flagellates
  [/Bdellovibrio/i, 'comma'],
  [/Vampirococcus/i, 'circle'],
  [/Daptobacter/i, 'rod'],
  [/Myxococcus/i, 'rod'],
  [/Bacteriovorax|Halobacteriovorax|Peredibacter/i, 'rod'],
  [/Monas|Oikomonas|Anthophysa|Chilomonas/i, 'oval'],
  [/Cercomonas/i, 'irregular'],
  [/Heteromita/i, 'circle'],
  [/Bodo|Procryptobia/i, 'comma'],
  // Trypanosoma moved to dedicated sprite below
  [/Leishmania/i, 'oval'],
  [/Monosiga|Salpingoeca|Codonosiga/i, 'bell'],
  // CONSUMER2 — ciliates / amoebae
  [/Paramecium/i, 'slipper'],
  [/Stentor/i, 'bell'],
  [/Vorticella/i, 'bell'],
  [/Didinium/i, 'oval'],
  [/Spirostomum/i, 'rod'],
  [/Blepharisma/i, 'slipper'],
  [/Euplotes|Stylonychia|Oxytricha/i, 'irregular'],
  // Tetrahymena moved to batch 3 (slipper); Coleps|Urocentrum stay oval
  [/Litonotus/i, 'slipper'],
  [/Dileptus/i, 'rod'],
  [/Zoothamnium|Opercularia/i, 'bell'],
  [/Amoeba|Chaos/i, 'irregular'],
  [/Arcella|Difflugia|Euglypha|Nebela|Centropyxis/i, 'irregular'],
  // CONSUMER3 — heliozoa / rotifers / worms
  [/Actinophrys|Actinosphaerium|Raphidiophrys/i, 'star'],
  // Rotaria|Philodina moved to batch 3 (irregular)
  // Brachionus|Asplanchna moved to batch 3 (irregular)
  [/Keratella/i, 'star'],
  [/Chaetonotus|Lepidodermella/i, 'rod'],
  // Macrostomum moved to batch 3 (rod)
  [/Prostoma/i, 'rod'],
  [/Trichoplax/i, 'irregular'],
  // DECOMPOSERS
  // Saccharomyces|Candida moved to dedicated sprite below
  [/Mucor|Rhizopus/i, 'filament'],
  [/Penicillium|Aspergillus/i, 'filament'],
  [/Batrachochytrium|Chytriomyces|Allomyces/i, 'circle'],
  [/Bacillus|Pseudomonas|Cellulomonas|Thermus/i, 'rod'],
  [/Streptomyces/i, 'filament'],
  [/Deinococcus/i, 'star'],
  // SPECIFIC MORPHOTYPES (higher fidelity — dedicated sprites)
  [/Trypanosoma/i, 'trypanosoma'],   // undulating membrane, not generic filament
  [/Saccharomyces|Candida/i, 'yeast'], // budding yeast, not generic oval
  [/Volvox/i, 'volvox'],              // spherical colony, not generic colony
  // SPECIFIC MORPHOTYPES batch 3 — fix biologically wrong generic mappings
  [/Macrostomum|Stenostomum|Microstomum/i, 'rod'],       // flatworms: elongated, not oval
  [/Rotaria|Philodina/i, 'irregular'],                    // rotifers: have foot/corona, not plain oval
  [/Brachionus|Asplanchna/i, 'irregular'],                // planktonic rotifers: lorica shape
  [/Tetrahymena/i, 'slipper'],                            // pear-shaped ciliate, not oval
  [/Thermus/i, 'rod'],                                    // already rod, ensure dedicated
  // SPECIFIC MORPHOTYPES batch 2
  [/Apicomplexa|Plasmodium|Toxoplasma|Cryptosporid/i, 'apicomplexa'],
  [/Mollicutes|Mycoplasma|Acholeplasma|Spiroplasma/i, 'mollicutes'],
  [/Corynebacter|Arthrobacter|Brevibacter/i, 'clubrod'],
  [/Rhodobacter|Agrobacterium|Azorhizob|rodtococcus/i, 'rodtococcus'],
  // VIRUSES
  [/phage|virus|Neuro.Parasite|Macrophage|T4|Lambda|T7|Phi|MS2/i, 'phage']
];

function pickShape(o, sh){
  var name = ((o && o.sp && (o.sp.name||o.sp.id||'')) || '').toString();
  var cat = ((o && o.sp && o.sp.cat) || '').toString().toLowerCase();
  // Match by species name — most accurate
  for (var i=0;i<NAME_OVERRIDE.length;i++){
    if (NAME_OVERRIDE[i][0].test(name)) return NAME_OVERRIDE[i][1];
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
      for (var k in sprites) if (sprites[k] && sprites[k].complete && sprites[k].naturalWidth>0) ok++;
      loadState = ok > 0 ? 'ready' : 'error';
      console.log('[swiss] sprites ready', ok+'/'+total, loadState);
    }
  };
  SHAPES.forEach(function(shape){
    var img = new Image();
    img.decoding = 'async';
    img.onload = function(){ sprites[shape] = img; done(); };
    img.onerror = function(){ console.warn('[swiss] fail', shape); done(); };
    img.src = base + shape + '.png?v=1';
  });
};

window.swissReady = function(){
  return loadState === 'ready';
};

window.swissLoadState = function(){ return loadState; };

// Auto-preload shortly after parse (idle)
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(function(){ window.loadSwissSprites(); }, {timeout: 2500});
} else {
  setTimeout(function(){ window.loadSwissSprites(); }, 800);
}

function drawSprite(ctx, o, sz, shapeKey){
  var img = sprites[shapeKey];
  if (!img || !img.complete || !img.naturalWidth) return false;

  // Match cartoon world proportions (was sz*12 / min28 → giant vs lily pads)
  // Cartoon body ~ o.size world units; keep slight bump so diagram still readable.
  var z = (typeof zoom === 'number' && isFinite(zoom) && zoom > 0) ? zoom : 1;
  var drawSz = Math.max(2.2, Math.min(22, sz * 1.15));
  // far LOD: tiny on screen → simple disc (big FPS win when zoomed out)
  if (drawSz * z < 3.5 && !(o && o.isPlayer)) {
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
  var aspect = img.naturalWidth / img.naturalHeight;
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

  // draw real SwissBioPics sprite (no main-canvas source-atop — would tint the pond)
  ctx.drawImage(img, -dw/2, -dh/2, dw, dh);

  // species identity: thin color halo only (does not destroy grey diagram)
  var col = (o.sp && o.sp.color) ? o.sp.color : null;
  if (col) {
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(1.5, drawSz * 0.03);
    ctx.beginPath();
    ctx.ellipse(0, 0, dw*0.48, dh*0.48, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  if (o.dividing || (o.divT && o.divT > 0)) {
    ctx.strokeStyle = 'rgba(40,40,40,0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -dh*0.42);
    ctx.lineTo(0, dh*0.42);
    ctx.stroke();
  }

  if (o.energy < 28) {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000';
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
  var drawSz = Math.max(2.2, Math.min(18, sz*1.15));
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
  if (window._swissStrict && typeof isSwissApprox === 'function' && isSwissApprox(o)) {
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
