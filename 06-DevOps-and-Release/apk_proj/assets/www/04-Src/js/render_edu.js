// render_edu.js — educational organelle labels + window exports

function renderEventLogs(){}


// ============================================================
// EDUCATIONAL ORGANELLE LABELS — anatomy learning mode
// ============================================================
var ORGANELLE_INFO = {
  nucleus: {
    ru: 'Ядро', en: 'Nucleus',
    desc: 'Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде.'
  },
  nucleoid: {
    ru: 'Нуклеоид', en: 'Nucleoid',
    desc: 'Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме.'
  },
  mito: {
    ru: 'Митохондрия', en: 'Mitochondrion',
    desc: '«Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии.'
  },
  chloro: {
    ru: 'Хлоропласт', en: 'Chloroplast',
    desc: 'Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений.'
  },
  vacuole: {
    ru: 'Вакуоль', en: 'Vacuole',
    desc: 'Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли.'
  },
  cilia: {
    ru: 'Реснички', en: 'Cilia',
    desc: 'Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту).'
  },
  flagella: {
    ru: 'Жгутик', en: 'Flagellum',
    desc: 'Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис).'
  },
  membrane: {
    ru: 'Мембрана', en: 'Membrane',
    desc: 'Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана.'
  },
  wall: {
    ru: 'Клеточная стенка', en: 'Cell wall',
    desc: 'Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма.'
  },
  oral: {
    ru: 'Ротовая воронка', en: 'Oral groove',
    desc: 'У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль.'
  },
  cyto: {
    ru: 'Цитоплазма', en: 'Cytoplasm',
    desc: 'Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций.'
  }
};

function organelleSetFor(o){
  if(!o || !o.sp) return [];
  var cat = o.sp.cat || '';
  var bio = o.sp.bio || {};
  var list = [{id:'membrane', x:0.0, y:0.75}];
  if(cat==='producer'){
    list.push({id:'chloro', x:-0.25, y:-0.1});
    list.push({id:'nucleoid', x:0.2, y:0.15});
    if(bio.flagella || o.sp.loco==='flagella') list.push({id:'flagella', x:0.7, y:0.0});
  } else if(cat==='consumer1'){
    list.push({id:'nucleoid', x:0.0, y:0.0});
    list.push({id:'wall', x:0.0, y:0.9});
    if(bio.flagella || (o.sp.loco&&String(o.sp.loco).indexOf('flag')>=0))
      list.push({id:'flagella', x:0.85, y:0.0});
  } else if(cat==='consumer2'){
    list.push({id:'nucleus', x:-0.15, y:-0.1});
    list.push({id:'vacuole', x:0.25, y:0.2});
    list.push({id:'cilia', x:0.0, y:-0.85});
    list.push({id:'oral', x:0.55, y:0.0});
    list.push({id:'mito', x:-0.35, y:0.25});
  } else if(cat==='consumer3' || cat==='macrophage'){
    list.push({id:'nucleus', x:0.0, y:-0.15});
    list.push({id:'mito', x:-0.3, y:0.2});
    list.push({id:'vacuole', x:0.3, y:0.15});
  } else {
    list.push({id:'cyto', x:0.0, y:0.0});
  }
  return list;
}

function renderOrganelleEdu(vL,vR,vT,vB){
  if(typeof player==='undefined' || !player || !player.alive) {
    var p0=document.getElementById('orgEduPanel'); if(p0) p0.style.display='none';
    return;
  }
  // Only in deep zoom — anatomy mode
  if(typeof zoom!=='number' || zoom < 3.2) {
    var pan0 = document.getElementById('orgEduPanel');
    if(pan0) pan0.style.display = 'none';
    return;
  }
  var o = player;
  // pick cell under cursor if free cam
  if(typeof mx==='number'){
    var wx0 = cam.x+(mx-cv.width/2)/zoom, wy0 = cam.y+(my-cv.height/2)/zoom;
    var best=null,bd=(o.size*1.2)*(o.size*1.2);
    // prefer player if mouse over player
    var pdx=player.x-wx0, pdy=player.y-wy0;
    if(pdx*pdx+pdy*pdy < (player.size*1.1)*(player.size*1.1)) best = player;
    if(!best && window.freeCam){
      bd = 40*40;
      for(var i=0;i<orgs.length;i++){
        var t=orgs[i]; if(!t||!t.alive) continue;
        var dd=(t.x-wx0)*(t.x-wx0)+(t.y-wy0)*(t.y-wy0);
        if(dd<bd && t.size*zoom>14){ bd=dd; best=t; }
      }
    }
    if(best) o = best;
  }
  // Must hover INSIDE the cell to show anatomy
  var mouseWX = (typeof mx==='number') ? cam.x+(mx-cv.width/2)/zoom : null;
  var mouseWY = (typeof my==='number') ? cam.y+(my-cv.height/2)/zoom : null;
  var inside = false;
  if(mouseWX!=null){
    var idx=mouseWX-o.x, idy=mouseWY-o.y;
    inside = (idx*idx+idy*idy) <= (o.size*1.05)*(o.size*1.05);
  }
  if(!inside){
    var panH = document.getElementById('orgEduPanel');
    if(panH) panH.style.display = 'none';
    return; // no permanent labels swimming around
  }

  var set = organelleSetFor(o);
  if(!set.length) return;

  var hovered = null;
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);

  for(var k=0;k<set.length;k++){
    var it = set[k];
    var info = ORGANELLE_INFO[it.id]; if(!info) continue;
    var wxp = o.x + it.x * o.size * 0.85;
    var wyp = o.y + it.y * o.size * 0.85;
    var sx = (wxp - cam.x)*zoom + cv.width/2;
    var sy = (wyp - cam.y)*zoom + cv.height/2;
    if(sx<-20||sy<-20||sx>cv.width+20||sy>cv.height+20) continue;

    var over = false;
    if(mouseWX!=null){
      var mdx = mouseWX - wxp, mdy = mouseWY - wyp;
      var hitR = Math.max(o.size*0.22, 6/zoom);
      if(mdx*mdx+mdy*mdy < hitR*hitR) over = true;
      // also screen-space comfort hit
      var sdx = mx - sx, sdy = my - sy;
      if(sdx*sdx+sdy*sdy < 16*16) over = true;
    }
    if(over) hovered = {id:it.id, info:info, sx:sx, sy:sy};

    // Quiet pins only (no text) — text solely on hover
    ctx.beginPath();
    ctx.fillStyle = over ? 'rgba(255,240,160,0.95)' : 'rgba(220,240,220,0.35)';
    ctx.strokeStyle = over ? 'rgba(255,220,100,0.9)' : 'rgba(120,180,140,0.35)';
    ctx.lineWidth = over ? 2 : 1;
    ctx.arc(sx, sy, over ? 5 : 3, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
  }

  // Hover label chip next to pin ONLY
  if(hovered){
    var lab = hovered.info.ru;
    ctx.font = 'bold 13px system-ui,sans-serif';
    var tw = ctx.measureText(lab).width;
    var lx = hovered.sx + 12, ly = hovered.sy - 16;
    ctx.fillStyle = 'rgba(6,16,12,0.92)';
    roundRect(ctx, lx-6, ly-12, tw+12, 22, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(180,220,160,0.5)';
    ctx.stroke();
    ctx.fillStyle = '#e8ffe0';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(lab, lx, ly);
  }
  ctx.restore();

  // Bottom panel only while inside cell
  ensureOrgEduPanel();
  var pan = document.getElementById('orgEduPanel');
  if(!pan) return;
  pan.style.display = 'block';
  var spn = (o.sp && o.sp.name) ? o.sp.name : 'клетка';
  var cat = (o.sp && o.sp.cat) ? o.sp.cat : '';
  var catRu = (typeof catName==='function'?catName(cat):null) || {producer:'зелёные',consumer1:'мелкий едок',consumer2:'средний едок',consumer3:'крупный охотник',decomposer:'уборщик'}[cat]||cat;
  var focus = hovered ? hovered.info : null;
  if(focus){
    pan.innerHTML = '<div style="font-size:11px;opacity:.7;margin-bottom:2px">🔬 Анатомия · '+spn+' <span style="opacity:.55">('+catRu+')</span></div>'+
      '<div style="font-size:15px;font-weight:700;color:#d4f5c8;margin:2px 0">'+focus.ru+
      (focus.en?' <span style="opacity:.5;font-weight:500;font-size:12px">'+focus.en+'</span>':'')+'</div>'+
      '<div style="font-size:12.5px;line-height:1.35;opacity:.92">'+focus.desc+'</div>';
  } else {
    pan.innerHTML = '<div style="font-size:11px;opacity:.7">🔬 Анатомия · '+spn+'</div>'+
      '<div style="font-size:13px;opacity:.85;margin-top:4px">Наведи на точку внутри клетки — название и роль органа</div>';
  }
}

function ensureOrgEduPanel(){
  if(document.getElementById('orgEduPanel')) return;
  var d = document.createElement('div');
  d.id = 'orgEduPanel';
  d.style.cssText = 'display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:72px;z-index:60;'+
    'max-width:min(520px,92vw);padding:10px 14px;border-radius:10px;'+
    'background:rgba(4,16,22,0.88);border:1px solid rgba(100,180,140,0.45);'+
    'color:#eaf7f0;font-family:system-ui,sans-serif;pointer-events:none;'+
    'box-shadow:0 8px 28px rgba(0,0,0,0.45)';
  document.body.appendChild(d);
}
window.renderOrganelleEdu = renderOrganelleEdu;
window.ORGANELLE_INFO = ORGANELLE_INFO;

window.renderMinimap = renderMinimap;

window.renderPopGraph = typeof renderPopGraph!=="undefined" ? renderPopGraph : function(){};
