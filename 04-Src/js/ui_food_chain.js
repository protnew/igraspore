"use strict";


function buildLangBar() {
  var lb = document.getElementById('langSelDrop');
  if(!lb) return;
  lb.innerHTML = '';
  document.getElementById('curLangTxt').textContent = langNames[curLang] || curLang;
  for(var l in LANGS) {
    var b = document.createElement('div');
    b.className = 'lang-item' + (curLang === l ? ' act' : '');
    b.textContent = langNames[l] || LANGS[l];
    b.setAttribute('data-lang', l);
    b.onclick = function(ev) {
      curLang = ev.target.getAttribute('data-lang');
      buildLangBar();
      updateMenuTexts();
      document.getElementById('langSelWrap').blur();
    };
    lb.appendChild(b);
  }
}

function buildDiff(){
  var dw=document.getElementById('diffWrap');dw.innerHTML='';
  var diffs=[['easy',tt('diffE')],['normal',tt('diffN')],['hard',tt('diffH')]];
  for(var i=0;i<diffs.length;i++){var b=document.createElement('div');b.className='diff'+(difficulty===diffs[i][0]?' act':'');b.textContent=diffs[i][1];b.setAttribute('data-d',diffs[i][0]);
    b.onclick=function(ev){difficulty=ev.target.getAttribute('data-d');buildDiff();};dw.appendChild(b);}
}

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
    html += '<div class="fc-row" data-c="'+r.cat+'" style="margin:2px 0;padding:3px 4px;border-radius:4px;cursor:pointer;border:1px solid transparent" onmouseover="this.style.background=\'rgba(80,140,100,0.2)\'" onmouseout="this.style.background=\'transparent\'">';
    html += r.emoji+' <b style="color:'+col+'">'+nm+'</b>';
    html += ' <span style="opacity:.65">— '+r.desc+'</span>';
    html += ' <span style="opacity:.45;font-size:10px">(клик = фильтр)</span>';
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
  var rowsEl = el.querySelectorAll('.fc-row');
  for(var ri=0;ri<rowsEl.length;ri++){
    rowsEl[ri].onclick=function(ev){
      var c=(ev.currentTarget||ev.target).getAttribute('data-c');
      if(!c) return;
      selCat=c; try{window.selCat=c;}catch(e){}
      if(typeof buildCatSel==='function') buildCatSel();
      if(typeof buildSpeciesGrid==='function') buildSpeciesGrid();
      var sg=document.getElementById('spGrid'); if(sg) sg.scrollTop=0;
    };
  }
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
    el.style.cssText = 'text-align:center;margin:6px 8px 10px;padding:8px 12px;border-radius:10px;background:rgba(40,80,120,0.45);border:1px solid rgba(120,200,255,0.35);color:#dff;font-size:13px;line-height:1.35';
    cs.parentNode.insertBefore(el, cs);
  }
  var n = getPoolCount();
  var kinds = (typeof SPECIES_DB!=='undefined') ? SPECIES_DB.length : 100;
  var ru = (typeof curLang==='undefined' || curLang==='ru');
  el.innerHTML = ru
    ? ('\u{1F30A} <b>В бассейне будет ~'+n+' организмов</b> · '+kinds+' видов')
    : ('\u{1F30A} <b>Pool will have ~'+n+' organisms</b> · '+kinds+' species');
}

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
  var rgb=hex2rgb(sp.color);
  var r0=rgb[0],g0=rgb[1],b0=rgb[2];
  // Body fill with gradient (3D look)
  var bodyGr=ctx2.createRadialGradient(-sz*0.3,-sz*0.3,0,0,0,sz*1.2);
  bodyGr.addColorStop(0,shadeRgb(r0,g0,b0,1.3));
  bodyGr.addColorStop(0.6,sp.color);
  bodyGr.addColorStop(1,shadeRgb(r0,g0,b0,0.5));
  ctx2.fillStyle=bodyGr;
  ctx2.strokeStyle=shadeRgb(r0,g0,b0,0.4);
  ctx2.lineWidth=1.5;
  // Draw shape with smooth path
  var sh=sp.shape;
  ctx2.beginPath();
  switch(sh){
    case'circle':ctx2.arc(0,0,sz,0,6.283);break;
    case'rod':ctx2.ellipse(0,0,sz,sz*0.45,0,0,6.283);break;
    case'spiral':for(var i=0;i<40;i++){var t=i/39;var a=t*Math.PI*4;var r=sz*0.85*(1-t*0.3);var x=Math.cos(a)*r,y=Math.sin(a)*r*0.4;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}break;
    case'filament':ctx2.rect(-sz*1.5,-sz*0.2,sz*3,sz*0.4);break;
    case'colony':ctx2.globalAlpha=0.2;ctx2.arc(0,0,sz*1.05,0,6.283);ctx2.fill();ctx2.stroke();ctx2.globalAlpha=1;ctx2.beginPath();for(var i=0;i<16;i++){var a=i*2.399963;var rr=sz*(0.12+0.75*Math.sqrt(i/15));var cx=Math.cos(a)*rr,cy=Math.sin(a)*rr*0.88;ctx2.moveTo(cx+sz*0.2,cy);ctx2.arc(cx,cy,sz*0.18,0,6.283);}break;
    case'slipper':ctx2.ellipse(-sz*0.15,0,sz,sz*0.45,0,0,6.283);break;
    case'bell':ctx2.moveTo(-sz*0.7,-sz*0.3);ctx2.quadraticCurveTo(0,-sz*1.1,sz*0.7,-sz*0.3);ctx2.quadraticCurveTo(sz*0.5,sz*0.8,0,sz);ctx2.quadraticCurveTo(-sz*0.5,sz*0.8,-sz*0.7,-sz*0.3);break;
    case'oval':ctx2.ellipse(0,0,sz,sz*0.6,0,0,6.283);break;
    case'star':for(var i=0;i<12;i++){var a=i/12*Math.PI*2-Math.PI/2;var rr=i%2===0?sz:sz*0.45;var x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}ctx2.closePath();break;
    case'irregular':for(var i=0;i<10;i++){var a=i/10*Math.PI*2;var rr=sz*(0.7+0.3*Math.sin(a*3+1+idx*0.1));var x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i===0)ctx2.moveTo(x,y);else ctx2.lineTo(x,y);}ctx2.closePath();break;
    default:ctx2.arc(0,0,sz,0,6.283);
  }
  ctx2.fill();ctx2.stroke();
  // COLONY override — multi-cell aggregate (must not look like a single green ball)
  if(sh==='colony' || (sp.bio&&sp.bio.colony)){
    ctx2.clearRect(-W/2,-H/2,W,H);
    // restore bg under cells
    var bg2=ctx2.createRadialGradient(0,0,0,0,0,W*0.45);
    bg2.addColorStop(0,'rgba(20,50,80,0.55)');bg2.addColorStop(1,'rgba(5,15,30,0.75)');
    ctx2.fillStyle=bg2;ctx2.beginPath();ctx2.arc(0,0,W*0.48,0,6.283);ctx2.fill();
    // thin mucilage
    ctx2.fillStyle='rgba(80,160,70,0.18)';
    ctx2.beginPath();ctx2.arc(0,0,sz*1.15,0,6.283);ctx2.fill();
    ctx2.strokeStyle='rgba(100,190,90,0.7)';ctx2.lineWidth=2;
    ctx2.beginPath();ctx2.arc(0,0,sz*1.15,0,6.283);ctx2.stroke();
    // 12-16 packed cells
    var nC=16, GA=2.399963;
    for(var ci=0;ci<nC;ci++){
      var t=ci/(nC-0.5), a=ci*GA, rr=sz*(0.15+0.78*Math.sqrt(t));
      var cx=Math.cos(a)*rr, cy=Math.sin(a)*rr*0.9;
      var cr=sz*(0.16+0.04*(1-t));
      var cg=ctx2.createRadialGradient(cx-cr*0.3,cy-cr*0.3,0,cx,cy,cr);
      cg.addColorStop(0,'rgba(140,220,100,1)');cg.addColorStop(0.6,sp.color||'#3a8');cg.addColorStop(1,'rgba(20,80,30,0.95)');
      ctx2.fillStyle=cg;ctx2.beginPath();ctx2.arc(cx,cy,cr,0,6.283);ctx2.fill();
      ctx2.strokeStyle='rgba(20,70,30,0.55)';ctx2.lineWidth=1;ctx2.stroke();
      // chloroplast
      ctx2.fillStyle='rgba(20,70,25,0.8)';ctx2.beginPath();ctx2.arc(cx+cr*0.15,cy,cr*0.3,0,6.283);ctx2.fill();
    }
    // badge text
    ctx2.fillStyle='rgba(0,0,0,0.55)';ctx2.fillRect(-sz*1.2, sz*1.2, sz*2.4, 14);
    ctx2.fillStyle='#9f6';ctx2.font='bold 11px system-ui,sans-serif';ctx2.textAlign='center';ctx2.textBaseline='top';
    ctx2.fillText('КОЛОНИЯ',0,sz*1.25);
  } else {
  // Highlight (specular)
  ctx2.fillStyle='rgba(255,255,255,0.15)';
  ctx2.beginPath();ctx2.ellipse(-sz*0.3,-sz*0.3,sz*0.3,sz*0.15,-0.4,0,6.283);ctx2.fill();
  }
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

function showDeadScreen(){
  // Virus spectator mode — show infection stats, not death
  if(window.virusPlayer){
    var _ds2=document.getElementById('deadStats');
    var _inf=0,_lysed=0;
    for(var _vi3=0;_vi3<orgs.length;_vi3++){
      if(orgs[_vi3].infected) _inf++;
      if(orgs[_vi3].virusLysed) _lysed++;
    }
    var _vh='<div style="color:#f66;font-size:14px;text-align:center;margin-bottom:8px;font-weight:bold;">'+(curLang==='ru'?'РЕЖИМ ВИРУСА':'VIRUS MODE')+'</div>';
    _vh+='<table class="stbl">';
    _vh+='<tr><td class="lbl">'+(curLang==='ru'?'Инфицировано':'Infected')+'</td><td class="val">'+_inf+'</td></tr>';
    _vh+='<tr><td class="lbl">'+(curLang==='ru'?'Лизировано':'Lysed')+'</td><td class="val">'+_lysed+'</td></tr>';
    _vh+='<tr><td class="lbl">'+(curLang==='ru'?'Фагов':'Phages')+'</td><td class="val">'+viruses.length+'</td></tr>';
    _vh+='<tr><td class="lbl">'+tt('days')+'</td><td class="val">'+totalDays+'</td></tr>';
    _vh+='</table>';
    _ds2.innerHTML=_vh;
    document.getElementById('deadScreen').style.display='block';
    return;
  }

  var ds=document.getElementById('deadStats');var playSec=Math.round((Date.now()-gameStats.startTime)/1000);
  var html='';
  
  // Pond Stats
  var globalBorn = 0; var globalAlive = orgs.length;
  for(var i=0;i<SPECIES_DB.length;i++) globalBorn += (speciesPop[i] ? speciesPop[i].born : 0);
  var globalDead = globalBorn - globalAlive;
  html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(curLang==='ru'?'Статистика Водоёма':'Pond Statistics')+'</div>';
  html+='<table class="stbl" style="margin-bottom:10px">';
  html+='<tr><td class="lbl">'+tt('days')+'</td><td class="val">'+totalDays+'</td></tr>';
  html+='<tr><td class="lbl">'+(curLang==='ru'?'Живых':'Alive')+'</td><td class="val">'+globalAlive+'</td></tr>';
  html+='<tr><td class="lbl">'+(curLang==='ru'?'Родилось':'Born')+'</td><td class="val">'+globalBorn+'</td></tr>';
  html+='<tr><td class="lbl">'+(curLang==='ru'?'Погибло':'Dead')+'</td><td class="val">'+globalDead+'</td></tr>';
  html+='</table>';

  // Species Stats
  if(player && player.sp) {
    var spData = speciesPop[player.sp.id];
    html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(curLang==='ru'?'Ваш вид: ':'Your species: ')+player.sp.name+'</div>';
    html+='<table class="stbl" style="margin-bottom:10px">';
    html+='<tr><td class="lbl">'+(curLang==='ru'?'Сейчас живы':'Currently alive')+'</td><td class="val">'+spData.alive+'</td></tr>';
    html+='<tr><td class="lbl">'+(curLang==='ru'?'Всего родилось':'Total born')+'</td><td class="val">'+spData.born+'</td></tr>';
    html+='</table>';
  }

  // Personal Stats
  html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(curLang==='ru'?'Ваша клетка':'Your cell')+'</div>';
  html+='<table class="stbl">';
  html+='<tr><td class="lbl">'+tt('gameTime')+'</td><td class="val">'+playSec+'s</td></tr>';
  html+='<tr><td class="lbl">'+tt('offspring')+'</td><td class="val">'+(player?player.offspring:0)+'</td></tr>';
  html+='<tr><td class="lbl">'+tt('eaten')+'</td><td class="val">'+(player?player.eaten:0)+'</td></tr>';
  html+='</table>';
  
  // Causes with Tips
  var TIPS_RU = [
    "Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид.",
    "Совет: Избегайте хищников, используйте Режим везения для бегства.",
    "Совет: Следите за термометром. Мутируйте температурный диапазон.",
    "Совет: Старость неизбежна. Важно успеть разделиться до гибели.",
    "Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше."
  ];
  var TIPS_EN = [
    "Tip: Eat more often, stay near food clusters, or mutate speed.",
    "Tip: Avoid predators, use Grace Period to run away.",
    "Tip: Watch the thermometer. Mutate your temp range.",
    "Tip: Old age is inevitable. Divide before you die.",
    "Tip: Lysis is caused by viruses. Stay away from them."
  ];
  var tips = curLang==='ru' ? TIPS_RU : TIPS_EN;

  html+='<div style="margin-top:12px;color:#4af;font-size:12px;text-align:center;font-weight:bold;">'+tt('dCauses')+' (Global)</div>';
  html+='<table class="stbl" style="margin-bottom:10px">';
  for(var d=0;d<5;d++){
    var dl=(curLang==='ru'?DLAB_RU:DLAB_EN)[d];
    if(stats.deathCauses[d] > 0 || d===0) {
      html+='<tr><td class="lbl" style="color:#faa">'+dl+'</td><td class="val" style="color:#fff">'+stats.deathCauses[d]+'</td></tr>';
      html+='<tr><td colspan="2" style="font-size:10px; color:#aaa; padding-bottom:6px; font-style:italic;">'+tips[d]+'</td></tr>';
    }
  }
  html+='</table>';
  
  ds.innerHTML=html;
  document.getElementById('deadT').textContent=tt('dead');document.getElementById('deadO').className='ov show';
}

function toggleRenderMode(el){
  window._rmodeUserPicked = true;
  settings.renderMode = settings.renderMode==='realistic' ? 'cartoon' : 'realistic';
  el.className='tg'+(settings.renderMode==='realistic'?' on':'');
  var lbl=document.getElementById('rmodeLbl');
  if(lbl) lbl.innerHTML = settings.renderMode==='realistic' ? '🔬 Realistic' : '🎨 Cartoon';
  // Apply visual changes
  applyRenderMode();
}

function applyRenderMode(){
  window._swissStrict = (settings.renderMode==='swiss');
  if(settings.renderMode==='realistic'){
    // Realistic: darker, deeper colors, less saturation, more particles
    settings.particles=true; settings.bubbles=true; settings.vignette=true;
    settings.lightMul=1.2;
  } else if(settings.renderMode==='swiss'){
    // Swiss only changes organism art — keep full pond FX/color
    settings.particles=true; settings.bubbles=true; settings.vignette=false;
    settings.lightMul=1.0;
  } else {
    // Cartoon / bioicons: brighter, more saturated, simpler
    settings.lightMul=1.0;
  }
}

function buildSettings(){
  var sb=document.getElementById('setBody');
  var opts=[['particles',tt('particles')],['bubbles',tt('bubbles')],['currents',tt('currents')],['vignette',tt('vignette')],['healthBars',tt('healthBars')],['shadows',tt('shadows')]];
  var html='';
  for(var i=0;i<opts.length;i++)html+='<div class="sr"><span>'+opts[i][1]+'</span><div class="tg'+(settings[opts[i][0]]?' on':'')+'" data-s="'+opts[i][0]+'" onclick="toggleSet(this)"></div></div>';
  // Render mode toggle: Realistic vs Cartoon
  html+='<div class="sr"><span>'+(window._t_renderMode||'Camera Mode')+': <b id="rmodeLbl">'+(settings.renderMode==='realistic'?'🔬 Realistic':'🎨 Cartoon')+'</b></span><div class="tg'+(settings.renderMode==='realistic'?' on':'')+'" id="rmodeTg" onclick="toggleRenderMode(this)"></div></div>';
  // Sliders
  html+='<div class="slider-row"><span>'+tt('density')+'</span><input type="range" min="0.3" max="2" step="0.1" value="'+settings.density+'" oninput="settings.density=parseFloat(this.value)" /><span class="slider-val">'+settings.density.toFixed(1)+'</span></div>';
  html+='<div class="slider-row"><span>'+tt('lightInt')+'</span><input type="range" min="0.3" max="2" step="0.1" value="'+settings.lightMul+'" oninput="settings.lightMul=parseFloat(this.value)" /><span class="slider-val">'+settings.lightMul.toFixed(1)+'</span></div>';
  html+='<div class="slider-row"><span>'+tt('virusRate')+'</span><input type="range" min="0" max="2" step="0.1" value="'+settings.virusRate+'" oninput="settings.virusRate=parseFloat(this.value)" /><span class="slider-val">'+settings.virusRate.toFixed(1)+'</span></div>';
  // User speed control (0.1 = very slow, 3.0 = fast). Default 0.33 = 3x slower
  html+='<div class="slider-row"><span>'+tt('simSpeed')+'</span><input type="range" min="0.1" max="3" step="0.05" value="'+settings.simSpeed+'" oninput="settings.simSpeed=parseFloat(this.value)" /><span class="slider-val">'+settings.simSpeed.toFixed(2)+'\u00d7</span></div>';
  // Predation intensity
  html+='<div class="slider-row"><span>'+tt('predation')+'</span><input type="range" min="0" max="2" step="0.1" value="'+settings.predation+'" oninput="settings.predation=parseFloat(this.value)" /><span class="slider-val">'+settings.predation.toFixed(1)+'</span></div>';
  // Reproduction rate
  html+='<div class="slider-row"><span>'+tt('divRate')+'</span><input type="range" min="0" max="3" step="0.1" value="'+settings.divRate+'" oninput="settings.divRate=parseFloat(this.value)" /><span class="slider-val">'+settings.divRate.toFixed(1)+'</span></div>';
  sb.innerHTML=html;
}

function toggleSet(el){var k=el.getAttribute('data-s');settings[k]=!settings[k];el.className='tg'+(settings[k]?' on':'');}

function buildWiki(filter){
  var wc=document.getElementById('wikiContent');var html='';
  var search=(filter||'').toLowerCase();
  var cats=[['producer',tt('producer')],['consumer1',tt('consumer1')],['consumer2',tt('consumer2')],['consumer3',tt('consumer3')],['decomposer',tt('decomposer')],['virus',tt('virus')]];
  for(var ci=0;ci<cats.length;ci++){
    var cat=cats[ci][0],catName=cats[ci][1];
    if(cat==='virus'){
      var hasVirus=false;
      for(var vi=0;vi<VIRUS_SPECS.length;vi++){var vs=VIRUS_SPECS[vi];
        if(search&&vs.name.toLowerCase().indexOf(search)<0)continue;
        if(!hasVirus){html+='<div class="wiki-cat" style="color:'+CC.virus+'">'+catName+'</div>';hasVirus=true;}
        html+='<div class="wiki-entry"><b style="color:'+vs.color+'">'+vs.name+'</b><div class="wl">\u0420\u0430\u0437\u043c\u0435\u0440: '+vs.size+'\u03bcm</div>'+
          '<div class="wf">'+(curLang==='ru'?'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u043e\u0444\u0430\u0433. \u0417\u0430\u0440\u0430\u0436\u0430\u0435\u0442 \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438, \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u043b\u0438\u0437\u0438\u0441 \u0438 \u0432\u044b\u043f\u0443\u0441\u043a\u0430\u0435\u0442 \u0434\u043e 8 \u043d\u043e\u0432\u044b\u0445 \u0447\u0430\u0441\u0442\u0438\u0446.':'Bacteriophage. Infects bacteria, causes lysis, releases up to 8 new virions.')+'</div></div>';
      }
      continue;
    }
    var pool=SPECIES_DB.filter(function(s){return s.cat===cat;});
    if(pool.length===0)continue;
    if(search){
      pool=pool.filter(function(s){return s.name.toLowerCase().indexOf(search)>=0;});
      if(pool.length===0)continue;
    }
    html+='<div class="wiki-cat" style="color:'+CC[cat]+'">'+catName+' ('+pool.length+')</div>';
    for(var si=0;si<pool.length;si++){
      var sp=pool[si];var w=getWikiEntry(sp.id);
      var organs=[];
      if(sp.bio.chloro)organs.push(curLang==='ru'?'\u0445\u043b\u043e\u0440\u043e\u043f\u043b\u0430\u0441\u0442\u044b':'chloroplasts');
      if(sp.bio.nucleus)organs.push(curLang==='ru'?'\u044f\u0434\u0440\u043e':'nucleus');
      if(sp.bio.macro)organs.push(curLang==='ru'?'\u043c\u0430\u043a\u0440\u043e/\u043c\u0438\u043a\u0440\u043e\u043d\u0443\u043a\u043b\u0435\u0443\u0441':'macro/micronucleus');
      if(sp.bio.cilia)organs.push(curLang==='ru'?'\u0440\u0435\u0441\u043d\u0438\u0447\u043a\u0438':'cilia');
      if(sp.bio.flag)organs.push(curLang==='ru'?'\u0436\u0433\u0443\u0442\u0438\u043a':'flagella');
      if(sp.bio.pseudo)organs.push(curLang==='ru'?'\u043f\u0441\u0435\u0432\u0434\u043e\u043f\u043e\u0434\u0438\u0438':'pseudopodia');
      if(sp.bio.mito)organs.push(curLang==='ru'?'\u043c\u0438\u0442\u043e\u0445\u043e\u043d\u0434\u0440\u0438\u0438':'mitochondria');
      if(sp.bio.golgi)organs.push(curLang==='ru'?'\u0433\u043e\u043b\u044c\u0434\u0436\u0438':'Golgi');
      if(sp.bio.trich)organs.push(curLang==='ru'?'\u0442\u0440\u0438\u0445\u043e\u0446\u0438\u0441\u0442\u044b':'trichocysts');
      if(sp.bio.contractile)organs.push(curLang==='ru'?'\u0441\u043e\u043a\u0440. \u0432\u0430\u043a\u0443\u043e\u043b\u044c':'contractile vacuole');
      html+='<div class="wiki-entry"><b style="color:'+sp.color+'">'+sp.name+'</b>'+
        '<div class="wl">'+sp.size+'\u03bcm \u00b7 '+sp.speed+'\u03bcm/s \u00b7 '+sp.locomotion+'</div>'+
        '<div class="wf"><b>'+(curLang==='ru'?'\u0414\u0432\u0438\u0436\u0435\u043d\u0438\u0435':'Locomotion')+':</b> '+w.loc+
        ' \u00b7 <b>'+(curLang==='ru'?'\u0414\u0435\u043b\u0435\u043d\u0438\u0435':'Division')+':</b> '+w.div+
        ' \u00b7 <b>'+(curLang==='ru'?'\u041f\u0438\u0449\u0430':'Food')+':</b> '+w.food+
        ' \u00b7 <b>'+(curLang==='ru'?'\u0412\u0440\u0430\u0433\u0438':'Predators')+':</b> '+w.pred+'</div>'+
        (organs.length?'<div style="color:#678;font-size:9px;margin-top:2px"><b>'+(curLang==='ru'?'\u041e\u0440\u0433\u0430\u043d\u0435\u043b\u043b\u044b':'Organelles')+':</b> '+organs.join(', ')+'</div>':'')+
        '</div>';
    }
  }
  wc.innerHTML=html;
}
