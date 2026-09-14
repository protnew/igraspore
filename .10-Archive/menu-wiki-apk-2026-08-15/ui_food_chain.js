"use strict";

function renderFoodChain(){
  var el = document.getElementById('foodChainDiagram');
  if(!el) return;
  var ru = (curLang === 'ru');
  var rows = [
    {emoji:'\u{1F33F}', cat:'producer', eats:null, desc:ru?'делают еду из света':'make food from light'},
    {emoji:'\u{1F535}', cat:'consumer1', eats:['producer'], desc:ru?'грызут зелёных':'nibble greens'},
    {emoji:'\u{1F7E0}', cat:'consumer2', eats:['producer','consumer1'], desc:ru?'фильтруют мелочь':'filter small ones'},
    {emoji:'\u{1F7E3}', cat:'consumer3', eats:['producer','consumer1','consumer2','consumer3'], desc:ru?'едят всех':'eat everyone'},
    {emoji:'\u{1F9F9}', cat:'decomposer', eats:null, desc:ru?'убирают мёртвое':'clean up dead'},
  ];
  var html = '';
  for(var i=0;i<rows.length;i++){
    var r = rows[i];
    var nm = (typeof catName==='function') ? catName(r.cat) : r.cat;
    var col = (typeof roleColor==='function') ? roleColor(r.cat) : '#8cf';
    html += '<div class="fc-row" data-c="'+r.cat+'" style="margin:2px 0;padding:3px 4px;border-radius:4px;border:1px solid transparent">';
    html += r.emoji+' <b style="color:'+col+'">'+nm+'</b>';
    html += ' <span style="opacity:.65">— '+r.desc+'</span>';
    html += ' <span style="opacity:.4;font-size:10px">(\u0441\u0445\u0435\u043c\u0430)</span>';
    if(r.eats){
      html += ' <span style="opacity:.5">→</span> ';
      for(var e=0;e<r.eats.length;e++){
        var en = (typeof catName==='function') ? catName(r.eats[e]) : r.eats[e];
        var ec = (typeof roleColor==='function') ? roleColor(r.eats[e]) : '#8cf';
        html += '<span style="color:'+ec+'">'+en+'</span>';
        if(e<r.eats.length-1) html += ', ';
      }
    }
    html += '</div>';
  }
  el.innerHTML = html;
  // Legend only. Species pick is #spGrid + #catSel — not a second menu.
}


function getPoolCount(){
  var poolN = 0;
  try {
    var dens = (typeof settings!=='undefined' && settings.density) ? settings.density : 1;
    if(typeof INIT_N==='object'){
      for(var k in INIT_N){ if(INIT_N.hasOwnProperty(k)) poolN += Math.round((INIT_N[k]||0)*dens); }
    }
    if(typeof DIFF!=='undefined' && typeof difficulty!=='undefined' && DIFF[difficulty] && DIFF[difficulty].spawn)
      poolN = Math.round(poolN * DIFF[difficulty].spawn);
  } catch(e){ poolN = 1600; }
  if(!poolN) poolN = 1600;
  return poolN;
}

function renderPoolBanner(){
  var el = document.getElementById('poolBanner');
  if(!el){
    // insert above catSel
    var cs = document.getElementById('catSel');
    if(!cs || !cs.parentNode) return;
    el = document.createElement('div');
    el.id = 'poolBanner';
    el.style.cssText='text-align:center;margin:6px 8px 10px;padding:8px 12px;border-radius:10px;background:rgba(40,80,120,0.45);border:1px solid rgba(120,200,255,0.35);color:#dff;font-size:13px;line-height:1.35';
    cs.parentNode.insertBefore(el, cs);
  }
  var n = getPoolCount();
  var kinds = (typeof SPECIES_DB!=='undefined') ? SPECIES_DB.length : 100;
  var ru = (typeof curLang==='undefined' || curLang==='ru');
  el.innerHTML = ru
    ? ('\u{1F30A} <b>В бассейне будет ~'+n+' организмов</b> · '+kinds+' видов')
    : ('\u{1F30A} <b>Pool will have ~'+n+' organisms</b> · '+kinds+' species');
}


// HSL color helpers for per-species unique colors
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;var max=Math.max(r,g,b),min=Math.min(r,g,b);var h,s,l=(max+min)/2;if(max===min){h=s=0;}else{var d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return[h*360,s,l];}
function hslToRgb(h,s,l){h/=360;var r,g,b;if(s===0){r=g=b=l;}else{var hue2rgb=function(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];}

function drawSpeciesPreview(canvas,sp,idx){
  var ctx2=canvas.getContext('2d');
(function(){
  var origCRG2 = ctx2.createRadialGradient.bind(ctx2);
  ctx2.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(r0)||r0<0)r0=0;
    if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;if(!isFinite(r1)||r1<0)r1=1;
    return origCRG2(x0,y0,r0,x1,y1,r1);
  };
})();
  var W=canvas.width,H=canvas.height;
  ctx2.clearRect(0,0,W,H);
  // Water-like background gradient
  var bg=ctx2.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.6);
  bg.addColorStop(0,'rgba(20,50,80,0.6)');
  bg.addColorStop(1,'rgba(5,15,30,0.8)');
  ctx2.fillStyle=bg;ctx2.fillRect(0,0,W,H);
  // Subtle bubbles
  ctx2.strokeStyle='rgba(150,200,230,0.15)';ctx2.lineWidth=0.5;
  for(var bi=0;bi<5;bi++){var bx=rng(5,W-5),by=rng(5,H-5);ctx2.beginPath();ctx2.arc(bx,by,rng(1,3),0,6.283);ctx2.stroke();}
  var sz=Math.min(W,H)*0.35;
  ctx2.save();ctx2.translate(W/2,H/2);
  // PER-SPECIES UNIQUE COLOR: hue shift by index so no two species share the same color
  var baseRgb=hex2rgb(sp.color);
  var baseHsl=rgbToHsl(baseRgb[0],baseRgb[1],baseRgb[2]);
  // Each species gets a unique hue offset (spread across the hue wheel)
  var hueOffset = ((idx * 137.508) % 80) - 40; // golden angle, max ±40° shift
  var uniqHue = (baseHsl[0] + hueOffset + 360) % 360;
  var uniqSat = Math.min(1, baseHsl[1] + (idx % 3) * 0.05);
  var uniqLight = Math.max(0.25, Math.min(0.72, baseHsl[2] + ((idx * 7) % 5 - 2) * 0.04));
  var uniqRgb = hslToRgb(uniqHue, uniqSat, uniqLight);
  var r0=uniqRgb[0],g0=uniqRgb[1],b0=uniqRgb[2];
  var uniqHex='#'+[r0,g0,b0].map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2);}).join('');
  var rgb=[r0,g0,b0];
  // PER-SPECIES UNIQUE SIZE/PROPORTION
  var aspectVar = 0.4 + (idx % 7) * 0.05; // 0.40 to 0.70 — varies roundness
  var szMod = 0.85 + (idx % 5) * 0.06; // size variation
  sz *= szMod;
  // Body fill with gradient (3D look)
  var bodyGr=ctx2.createRadialGradient(-sz*0.3,-sz*0.3,0,0,0,sz*1.2);
  bodyGr.addColorStop(0,shadeRgb(r0,g0,b0,1.3));
  bodyGr.addColorStop(0.6,uniqHex);
  bodyGr.addColorStop(1,shadeRgb(r0,g0,b0,0.5));
  ctx2.fillStyle=bodyGr;
  ctx2.strokeStyle=shadeRgb(r0,g0,b0,0.4);
  ctx2.lineWidth=1.5;
  // Draw shape with smooth path
  var sh=sp.shape;
  ctx2.beginPath();
  switch(sh){
    case'circle':ctx2.arc(0,0,sz,0,6.283);break;
    case'rod':ctx2.ellipse(0,0,sz,sz*aspectVar,0,0,6.283);break;
    case'clubrod':ctx2.moveTo(0,-sz);ctx2.quadraticCurveTo(-sz*0.55,-sz*0.6,-sz*0.45,0);ctx2.quadraticCurveTo(-sz*0.3,sz*0.7,0,sz);ctx2.quadraticCurveTo(sz*0.3,sz*0.7,sz*0.45,0);ctx2.quadraticCurveTo(sz*0.55,-sz*0.6,0,-sz);break;
    case'rodtococcus':ctx2.ellipse(-sz*0.4,0,sz*0.4,sz*0.3,0,0,6.283);ctx2.moveTo(sz*0.1,-sz*0.3);ctx2.ellipse(sz*0.4,0,sz*0.4,sz*0.3,0,0,6.283);break;
    case'diplococci':ctx2.arc(-sz*0.3,0,sz*0.35,0,6.283);ctx2.moveTo(sz*0.65,0);ctx2.arc(sz*0.3,0,sz*0.35,0,6.283);break;
    case'archaea':ctx2.moveTo(0,-sz);ctx2.lineTo(-sz*0.7,0);ctx2.lineTo(0,sz);ctx2.lineTo(sz*0.7,0);ctx2.closePath();break;
    case'mollicutes':ctx2.arc(0,0,sz*0.7,0,6.283);break;
    case'comma':ctx2.moveTo(0,-sz);ctx2.quadraticCurveTo(-sz*0.6,sz*0.2,-sz*0.3,sz);ctx2.quadraticCurveTo(0,sz*0.4,sz*0.4,sz*0.6);ctx2.quadraticCurveTo(sz*0.5,0,sz*0.3,-sz*0.6);ctx2.quadraticCurveTo(sz*0.2,-sz,0,-sz);break;
    case'spiral':for(var i=0;i<40;i++){var t=i/39;var a=t*Math.PI*4;var r=sz*0.85*(1-t*0.3);var x=Math.cos(a)*r,y=Math.sin(a)*r*0.4;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}break;
    case'filament':ctx2.rect(-sz*1.5,-sz*0.2,sz*3,sz*0.4);break;
    case'trichormus':for(var i=0;i<6;i++){var bx=-sz*1.2+i*sz*0.48;ctx2.moveTo(bx+sz*0.22,0);ctx2.ellipse(bx,0,sz*0.22,sz*0.22,0,0,6.283);}break;
    case'volvox':ctx2.globalAlpha=0.15;ctx2.arc(0,0,sz*1.05,0,6.283);ctx2.fill();ctx2.globalAlpha=1;ctx2.beginPath();for(var i=0;i<24;i++){var a=i*2.399963;var rr=sz*(0.15+0.72*Math.sqrt(i/23));var cx=Math.cos(a)*rr,cy=Math.sin(a)*rr*0.88;ctx2.moveTo(cx+sz*0.14,cy);ctx2.arc(cx,cy,sz*0.14,0,6.283);}break;
    case'colony':ctx2.globalAlpha=0.2;ctx2.arc(0,0,sz*1.05,0,6.283);ctx2.fill();ctx2.stroke();ctx2.globalAlpha=1;ctx2.beginPath();for(var i=0;i<16;i++){var a=i*2.399963;var rr=sz*(0.12+0.75*Math.sqrt(i/15));var cx=Math.cos(a)*rr,cy=Math.sin(a)*rr*0.88;ctx2.moveTo(cx+sz*0.2,cy);ctx2.arc(cx,cy,sz*0.18,0,6.283);}break;
    case'colony':ctx2.globalAlpha=0.2;ctx2.arc(0,0,sz*1.05,0,6.283);ctx2.fill();ctx2.stroke();ctx2.globalAlpha=1;ctx2.beginPath();for(var i=0;i<16;i++){var a=i*2.399963;var rr=sz*(0.12+0.75*Math.sqrt(i/15));var cx=Math.cos(a)*rr,cy=Math.sin(a)*rr*0.88;ctx2.moveTo(cx+sz*0.2,cy);ctx2.arc(cx,cy,sz*0.18,0,6.283);}break;
    case'slipper':ctx2.ellipse(-sz*0.15,0,sz,sz*0.45,0,0,6.283);break;
    case'trypanosoma':ctx2.moveTo(-sz*0.8,0);ctx2.bezierCurveTo(-sz*0.5,-sz*0.4,sz*0.5,-sz*0.4,sz*0.8,0);ctx2.bezierCurveTo(sz*0.5,sz*0.4,-sz*0.5,sz*0.4,-sz*0.8,0);ctx2.moveTo(-sz*1.3,0);ctx2.lineTo(-sz*0.8,0);break;
    case'bell':ctx2.moveTo(-sz*0.7,-sz*0.3);ctx2.quadraticCurveTo(0,-sz*1.1,sz*0.7,-sz*0.3);ctx2.quadraticCurveTo(sz*0.5,sz*0.8,0,sz);ctx2.quadraticCurveTo(-sz*0.5,sz*0.8,-sz*0.7,-sz*0.3);break;
    case'yeast':ctx2.ellipse(-sz*0.3,-sz*0.3,sz*0.5,sz*0.5,0,0,6.283);ctx2.moveTo(sz*0.5+sz*0.3,0);ctx2.ellipse(sz*0.3,sz*0.2,sz*0.4,sz*0.4,0,0,6.283);break;
    case'oval':ctx2.ellipse(0,0,sz,sz*0.6*aspectVar,0,0,6.283);break;
    case'star':for(var i=0;i<12;i++){var a=i/12*Math.PI*2-Math.PI/2;var rr=i%2===0?sz:sz*0.45;var x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}ctx2.closePath();break;
    case'phage':ctx2.rect(-sz*0.4,-sz*0.8,sz*0.8,sz*0.8);ctx2.moveTo(-sz*0.2,sz);ctx2.lineTo(0,sz*0.2);ctx2.lineTo(sz*0.2,sz);ctx2.moveTo(-sz*0.15,sz*0.2);ctx2.lineTo(-sz*0.15,sz*0.7);ctx2.moveTo(sz*0.15,sz*0.2);ctx2.lineTo(sz*0.15,sz*0.7);break;
    case'irregular':for(var i=0;i<10;i++){var a=i/10*Math.PI*2;var rr=sz*(0.7+0.3*Math.sin(a*3+1+idx*0.1));var x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}ctx2.closePath();break;
    default:ctx2.arc(0,0,sz,0,6.283);
  }
  ctx2.fill();ctx2.stroke();
  // Highlight (specular) — unique position per species
  ctx2.fillStyle='rgba(255,255,255,' + (0.1 + (idx%3)*0.05) + ')';
  var hlX = -sz*0.3 + (idx%5 - 2)*sz*0.05;
  var hlY = -sz*0.3 + ((idx*3)%5 - 2)*sz*0.05;
  ctx2.beginPath();ctx2.ellipse(hlX,hlY,sz*0.25,sz*0.12,-0.4+idx*0.1,0,6.283);ctx2.fill();
  // Per-species internal pattern — EVERY species gets unique internal details
  var patType = idx % 5; // 5 different patterns
  ctx2.lineWidth=0.5;
  if(patType===0 && (sh==='rod'||sh==='filament'||sh==='clubrod'||sh==='rodtococcus')){
    // Transverse stripes (like bacterial septa)
    ctx2.strokeStyle='rgba(255,255,255,0.18)';
    var stripes=2+(idx%4);
    for(var si=1;si<stripes;si++){var sx=-sz+si*(sz*2/stripes);ctx2.beginPath();ctx2.moveTo(sx,-sz*0.3);ctx2.lineTo(sx,sz*0.3);ctx2.stroke();}
  } else if(patType===1 && (sh==='circle'||sh==='oval'||sh==='slipper'||sh==='bell')){
    // Spots/dots pattern (like intracellular granules)
    ctx2.fillStyle='rgba(255,255,255,0.12)';
    var dots=3+(idx%5);
    for(var di=0;di<dots;di++){var da=di/dots*6.283+idx*0.3;var dr=sz*(0.2+(di%3)*0.15);ctx2.beginPath();ctx2.arc(Math.cos(da)*dr,Math.sin(da)*dr,sz*0.06,0,6.283);ctx2.fill();}
  } else if(patType===2){
    // Concentric rings
    ctx2.strokeStyle='rgba(255,255,255,0.1)';
    for(var ri=1;ri<=3;ri++){ctx2.beginPath();ctx2.arc(0,0,sz*ri/3*0.8,0,6.283);ctx2.stroke();}
  } else if(patType===3 && (sh==='rod'||sh==='oval'||sh==='slipper')){
    // Longitudinal line (nerve/cord)
    ctx2.strokeStyle='rgba(255,255,255,0.15)';
    ctx2.beginPath();ctx2.moveTo(-sz*0.8,0);ctx2.lineTo(sz*0.8,0);ctx2.stroke();
  }
  // patType===4: no pattern (clean) — already differs by color+proportion
  // Internal organelles (textbook style) — skip for colonies (already drawn)
  var b=(sh==='colony'||(sp.bio&&sp.bio.colony))?null:sp.bio;
  if(b){
    // Nucleus — with nucleolus and chromatin dots
    if(b.nucleus){
      ctx2.fillStyle='rgba(147,88,160,0.85)';ctx2.beginPath();ctx2.arc(0,0,sz*0.24,0,6.283);ctx2.fill();
      ctx2.fillStyle='rgba(192,96,192,0.9)';ctx2.beginPath();ctx2.arc(sz*0.05,sz*0.03,sz*0.1,0,6.283);ctx2.fill();
      // Nuclear membrane
      ctx2.strokeStyle='rgba(120,60,130,0.6)';ctx2.lineWidth=1;ctx2.beginPath();ctx2.arc(0,0,sz*0.24,0,6.283);ctx2.stroke();
    }
    // Macronucleus (ciliates) — bean-shaped
    if(b.macro){
      ctx2.fillStyle='rgba(160,80,160,0.8)';ctx2.beginPath();
      ctx2.ellipse(-sz*0.3,0,sz*0.3,sz*0.18,0,0,6.283);ctx2.fill();
      ctx2.strokeStyle='rgba(130,60,130,0.5)';ctx2.lineWidth=0.8;ctx2.stroke();
      // Micronucleus
      ctx2.fillStyle='rgba(192,112,192,0.9)';ctx2.beginPath();ctx2.arc(sz*0.15,-sz*0.15,sz*0.06,0,6.283);ctx2.fill();
    }
    // Chloroplasts — green discs with thylakoid lines
    if(b.chloro){var cn=4+Math.floor(sz/3);
      for(var i=0;i<cn;i++){var a=i/cn*Math.PI*2+0.3;
        var cx2=Math.cos(a)*sz*0.5,cy2=Math.sin(a)*sz*0.42;
        ctx2.save();ctx2.translate(cx2,cy2);ctx2.rotate(a);
        var chlGr=ctx2.createRadialGradient(0,0,0,0,0,sz*0.15);
        chlGr.addColorStop(0,'#4caf4c');chlGr.addColorStop(1,'#1a6a1a');
        ctx2.fillStyle=chlGr;ctx2.beginPath();ctx2.ellipse(0,0,sz*0.15,sz*0.08,0,0,6.283);ctx2.fill();
        ctx2.strokeStyle='rgba(20,80,20,0.4)';ctx2.lineWidth=0.5;
        ctx2.beginPath();ctx2.moveTo(-sz*0.1,0);ctx2.lineTo(sz*0.1,0);ctx2.stroke();
        ctx2.restore();}}
    // Mitochondria — red sausage shapes with cristae
    if(b.mito){for(var i=0;i<3;i++){var a=rng(0,6.28),r=rng(sz*0.2,sz*0.5);
      ctx2.save();ctx2.translate(Math.cos(a)*r,Math.sin(a)*r);ctx2.rotate(a+rng(0,1));
      ctx2.fillStyle='rgba(204,68,68,0.7)';
      ctx2.beginPath();ctx2.ellipse(0,0,sz*0.14,sz*0.05,0,0,6.283);ctx2.fill();
      ctx2.strokeStyle='rgba(140,30,30,0.5)';ctx2.lineWidth=0.5;
      for(var ci=0;ci<3;ci++){ctx2.beginPath();ctx2.moveTo(-sz*0.08+ci*sz*0.06,-sz*0.03);ctx2.lineTo(-sz*0.08+ci*sz*0.06,sz*0.03);ctx2.stroke();}
      ctx2.restore();}}
        if(b.nucleoid){
      ctx2.strokeStyle='rgba(140,160,255,0.7)'; ctx2.lineWidth=1.5; ctx2.beginPath();
      for(var k=0;k<16;k++){
         var a=k/16*Math.PI*2; var rr=sz*0.35*(0.5+Math.sin(k*134)*0.5);
         var px=Math.cos(a)*rr, py=Math.sin(a)*rr;
         if(k===0) ctx2.moveTo(px,py); else ctx2.lineTo(px,py);
      }
      ctx2.closePath(); ctx2.stroke();
    }
    if(b.thylakoid){
      ctx2.strokeStyle='rgba(30,120,60,0.4)'; ctx2.lineWidth=1.5;
      for(var k=1;k<=3;k++){
         ctx2.beginPath(); ctx2.arc(0, 0, sz*0.6*(k/3), 0, 6.283); ctx2.stroke();
      }
    }
    // Contractile vacuole — star shape
    if(b.contractile){
      ctx2.fillStyle='rgba(100,180,255,0.4)';ctx2.strokeStyle='rgba(80,160,240,0.6)';ctx2.lineWidth=1;
      ctx2.beginPath();
      for(var j=0;j<10;j++){
        var a=j/10*Math.PI*2; var rr=(j%2===0)?sz*0.12:sz*0.06;
        var vx=sz*0.35+Math.cos(a)*rr, vy=-sz*0.15+Math.sin(a)*rr;
        if(j===0) ctx2.moveTo(vx,vy); else ctx2.lineTo(vx,vy);
      }
      ctx2.closePath(); ctx2.fill(); ctx2.stroke();
    }
    // Oral groove / cytostome
    if(b.oral){ctx2.fillStyle='rgba(221,136,68,0.6)';ctx2.beginPath();
      ctx2.ellipse(sz*0.35,sz*0.2,sz*0.1,sz*0.06,0.3,0,6.283);ctx2.fill();}
    // Eyespot (stigma) — red dot
    if(b.eye){ctx2.fillStyle='#ff6600';ctx2.beginPath();ctx2.arc(sz*0.45,-sz*0.05,sz*0.06,0,6.283);ctx2.fill();
      ctx2.fillStyle='#ffaa00';ctx2.beginPath();ctx2.arc(sz*0.45,-sz*0.05,sz*0.03,0,6.283);ctx2.fill();}
    // Ribosomes — tiny dots
    if(b.ribo){ctx2.fillStyle='rgba(220,220,220,0.5)';
      for(var ri=0;ri<8;ri++){ctx2.beginPath();ctx2.arc(rng(-sz*0.5,sz*0.5),rng(-sz*0.45,sz*0.45),sz*0.025,0,6.283);ctx2.fill();}}
    // Food vacuoles — yellowish bubbles
    if(b.vac&&!b.contractile){ctx2.fillStyle='rgba(200,180,80,0.3)';
      ctx2.beginPath();ctx2.arc(-sz*0.2,sz*0.2,sz*0.08,0,6.283);ctx2.fill();}
    // Trichocysts — small lines near surface
    if(b.trich){ctx2.strokeStyle='rgba(255,200,200,0.4)';ctx2.lineWidth=0.5;
      for(var ti=0;ti<8;ti++){var ta=ti/8*Math.PI*2;ctx2.beginPath();ctx2.moveTo(Math.cos(ta)*sz*0.85,Math.sin(ta)*sz*0.85);ctx2.lineTo(Math.cos(ta)*sz*0.98,Math.sin(ta)*sz*0.98);ctx2.stroke();}}
  }
  // Cilia — hair-like structures around cell
  if(b&&b.cilia){ctx2.strokeStyle=shadeRgb(r0,g0,b0,0.5);ctx2.lineWidth=0.8;
    var cn2=Math.max(8,Math.floor(sz*1.5));
    for(var i=0;i<cn2;i++){var a=i/cn2*Math.PI*2;
      var wave=Math.sin(i*0.5)*sz*0.05;
      ctx2.beginPath();ctx2.moveTo(Math.cos(a)*sz*0.92,Math.sin(a)*sz*0.92);
      ctx2.lineTo(Math.cos(a)*(sz*1.15+wave),Math.sin(a)*(sz*1.15+wave));ctx2.stroke();}}
  // Flagella — whip-like tail
  if(b&&b.flag){ctx2.strokeStyle=shadeRgb(r0,g0,b0,0.6);ctx2.lineWidth=1.2;
    var fn2=b.eye?1:2;
    for(var fi=0;fi<fn2;fi++){
      var fa=(fi-(fn2-1)/2)*sz*0.3;
      ctx2.beginPath();ctx2.moveTo(fa,sz*0.5);
      for(var w=0;w<8;w++){var t=w/7;var wx=fa+Math.sin(w*0.9+idx)*sz*0.18*(1-t*0.5);var wy=sz*0.5+t*sz*1.3;ctx2.lineTo(wx,wy);}
      ctx2.stroke();}}
  // Pseudopodia — blobby extensions
  if(b&&b.pseudo){ctx2.fillStyle=bodyGr;ctx2.strokeStyle=shadeRgb(r0,g0,b0,0.4);ctx2.lineWidth=1;
    for(var i=0;i<5;i++){var a=i/5*Math.PI*2+0.3;
      ctx2.beginPath();ctx2.moveTo(0,0);
      var endX=Math.cos(a)*sz*1.3,endY=Math.sin(a)*sz*1.3;
      var midX=Math.cos(a+0.5)*sz*0.7,midY=Math.sin(a+0.5)*sz*0.7;
      ctx2.quadraticCurveTo(midX,midY,endX,endY);
      ctx2.quadraticCurveTo(Math.cos(a-0.3)*sz*0.8,Math.sin(a-0.3)*sz*0.8,0,0);
      ctx2.fill();}}
  ctx2.restore();
  // Border
  ctx2.strokeStyle='rgba(68,170,255,0.2)';ctx2.lineWidth=1;
  ctx2.strokeRect(0.5,0.5,W-1,H-1);
}

