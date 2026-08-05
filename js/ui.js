"use strict";
function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
function showSpeedBar(){
  var sb=document.getElementById('spdBar');
  if(!sb) return;
  var speeds=[{v:0,l:'\u23f8'},{v:0.25,l:'0.25x'},{v:0.5,l:'0.5x'},{v:1,l:'1x'},{v:2,l:'2x'},{v:5,l:'5x'},{v:10,l:'10x'}];
  sb.innerHTML='';
  sb.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9999;display:flex!important;gap:4px;padding:6px 10px;background:rgba(0,12,28,0.95);border:1px solid #3a6a95;border-radius:8px;pointer-events:auto;box-shadow:0 2px 12px rgba(0,0,0,0.5);';
  for(var i=0;i<speeds.length;i++){
    var b=document.createElement('button');
    b.type='button';
    b.className='sb'+(Math.abs(timeScale-speeds[i].v)<0.001?' act':'');
    b.textContent=speeds[i].l;
    b.setAttribute('data-ts',speeds[i].v);
    b.title=speeds[i].v===0?'Пауза':('Скорость '+speeds[i].l);
    b.style.cssText='padding:6px 12px;font-size:14px;min-width:44px;cursor:pointer;border-radius:5px;border:1px solid #345;background:'+(Math.abs(timeScale-speeds[i].v)<0.001?'#1a6a3a':'#012')+';color:#fff;font-family:inherit;';
    b.onclick=function(ev){
      var el=ev.currentTarget||ev.target;
      timeScale=parseFloat(el.getAttribute('data-ts'));
      if(window.showToast) window.showToast('Время: '+(timeScale===0?'пауза':timeScale+'x'),'#8cf');
      showSpeedBar();
    };
    sb.appendChild(b);
  }
}

var langNames = {
  ru: 'Русский', en: 'English', zh: '中文', es: 'Español', hi: 'हिन्दी', 
  ar: 'العربية', pt: 'Português', fr: 'Français', de: 'Deutsch', ja: '日本語', ko: '한국어'
};







function updateHUD(){
  if(!player||!player.alive){document.getElementById('hud').style.display='none';return;}
  var h=document.getElementById('hud');h.style.display='block';
  var eRatio=clamp(player.energy/100,0,1);
  var eColor = eRatio>0.6?'#4f4':eRatio>0.3?'#ff4':'#f44';
  // SIMPLE CLEAN HUD: only essential stats
  h.innerHTML = 
    '<div style="font-size:15px;font-weight:bold;color:#fff;margin-bottom:4px;">'+player.sp.name+'</div>'+
    '<div style="font-size:12px;color:#89f;margin-bottom:8px;">Gen '+player.generation+' \u00b7 '+player.size.toFixed(1)+'\u03bcm</div>'+
    '<div style="background:#012;border:1px solid #234;border-radius:4px;height:18px;overflow:hidden;margin-bottom:6px;">'+
      '<div style="width:'+(eRatio*100)+'%;background:'+eColor+';height:100%;transition:width .3s;"></div>'+
    '</div>'+
    '<div style="font-size:13px;line-height:1.6;">'+
      '<span style="color:#8af;font-weight:bold;">'+tt('energy')+':</span> <span style="color:#fff;font-weight:bold;">'+Math.max(0,Math.round(player.energy))+'/100</span><br>'+
      '<span style="color:#8af;font-weight:bold;">'+tt('age')+':</span> <span style="color:#fff;">'+Math.round(player.age)+'s</span><br>'+
      '<span style="color:#8af;font-weight:bold;">'+tt('divs')+':</span> <span style="color:#fff;">'+player.offspring+'</span>'+
    '</div>'+
    (player.infected?'<div style="color:#f44;font-size:12px;margin-top:4px;">\u2620 '+(curLang==='ru'?'\u0417\u0430\u0440\u0430\u0436\u0435\u043d!':'Infected!')+'</div>':'');
}
function updateTopRight(){
  var t=document.getElementById('topR');var pop=0;for(var i=0;i<orgs.length;i++)if(orgs[i].alive)pop++;
  var s=SEASONS[season];
  t.innerHTML='<div class="rw">'+tt('pop')+': <b style="color:#4df">'+pop+'</b></div>'+
    '<div class="rw">'+tt('fps')+': '+fps+' \u00b7 '+tt('light')+': '+Math.round(dayLight*100)+'%</div>'+
    '<div class="rw">'+tt('temp')+': '+s.temp+'\u00b0C \u00b7 '+tt('days')+': '+totalDays+'</div>';
  t.style.display='block';
}
function updateWeather(){
  var w=document.getElementById('weatherP');
  w.innerHTML='<div>'+(isRaining?'\u2614 '+tt('rainy')+'\u00a0\u00a0':'\u2600 '+tt('clear'))+'</div>'+
    '<div style="color:#678;font-size:8px;margin-top:1px">'+(curLang==='ru'?'\u0412\u0435\u0442\u0435\u0440':'Wind')+': '+Math.round(wind.strength*10)/10+'</div>';
  w.style.display='block';
}

  // Energy + mass progress (food/sun grow both; no eat-count gate)
  try{
    var hd=document.getElementById('hDivReady')||document.getElementById('hDiv')||document.getElementById('divInfo');
    if(hd && player && player.alive){
      var ad=(player.sp.size||4)*(player.sizeMult||1);
      var needM=Math.max(ad*0.5, 2.2);
      if(player.sp.cat && player.sp.cat.indexOf('consumer')===0) needM=Math.max(ad*0.75, 3.0);
      if(player.sp.cat==='consumer2'||player.sp.cat==='consumer3'||player.sp.cat==='macrophage') needM=Math.max(ad*0.9, 4.0);
      var m=player.massFood||0;
      var en=Math.max(0,Math.round(player.energy||0));
      var rep=Math.round(player.sp.repEnergy||80);
      var line='Эн '+en+'/'+rep+' · Масса '+m.toFixed(1)+'/'+needM.toFixed(1);
      if(window.canDivide && window.canDivide(player)) hd.textContent=line+' · ГОТОВО (Q)';
      else if(window.divideBlockReason) hd.textContent=line+' · '+window.divideBlockReason(player);
      else hd.textContent=line;
    } else if(hd) hd.textContent='';
  }catch(e){}

function updateEcoPanel(){
  // ECOSYSTEM PANEL REMOVED per user request — confusing numbers
  var ep=document.getElementById('ecoP');if(ep)ep.style.display='none';
  var lg=document.getElementById('legendP')||document.getElementById('legP');
  if(lg) lg.style.display='none';
  var dc=document.getElementById('deathP')||document.getElementById('deathCauses');
  if(dc) dc.style.display='none';
}
function updateLegend(){
  var lg=document.getElementById('legP');
  if(!lg)return;
  // Compact legend — colors only, clear Russian names
  var items=[
    ['#2c2','Водоросли'],
    ['#4af','Бактерии'],
    ['#dd44cc','Крупные охотники'],
    ['#c4f','Крупные'],
    ['#a86','Разлагатели'],
    ['#f44','Вирусы']
  ];
  var html='<div style="color:#bcd;font-size:13px;font-weight:bold;margin-bottom:4px;">Легенда</div>';
  for(var i=0;i<items.length;i++){
    html+='<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin:3px 0;color:#dde;">'+
      '<span style="width:10px;height:10px;border-radius:50%;background:'+items[i][0]+';display:inline-block;"></span>'+
      items[i][1]+'</div>';
  }
  lg.innerHTML=html;lg.style.display='block';
}






function updateScaleBar() {
   var sw = document.getElementById('scaleW');
   if(!sw) return;
   if(state !== 'playing') { sw.style.display = 'none'; return; }
   sw.style.display = 'block';
   // 100 micrometers
   var pixels = 100 * zoom;
   var sl = document.getElementById('scaleL');
   if(sl) sl.style.width = Math.max(10, pixels) + 'px';
}


function initTooltips() {
  var tip = document.getElementById('globalTooltip');
  if(!tip) return;
  var tooltips = {
    'popC': 'График популяции. Показывает историю рождений и смертей.',
    'fpsL': 'Кадры в секунду (FPS). Показывает производительность игры.',
    'lightL': 'Уровень освещенности. Важен для фотосинтеза водорослей.',
    'tempL': 'Температура воды. Влияет на метаболизм и выживание.',
    'daysL': 'Игровые дни. Смена сезонов влияет на температуру.',
    'energyBar': 'Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода.',
    'ageBar': 'Возраст существа. Старые клетки теряют энергию быстрее.'
  };

  document.addEventListener('mousemove', function(e) {
    var tgt = e.target;
    var tipText = '';
    while(tgt && tgt !== document.body) {
      if(tgt.id && tooltips[tgt.id]) { tipText = tooltips[tgt.id]; break; }
      if(tgt.className && typeof tgt.className === 'string' && tgt.className.includes('cb')) { tipText = 'Фильтр организмов. Нажмите, чтобы показать только этот вид в меню.'; break; }
      if(tgt.id === 'langSelWrap') { tipText = 'Выбор языка (Language Selector)'; break; }
      tgt = tgt.parentElement;
    }
    
    if(tipText) {
      tip.innerHTML = tipText;
      tip.style.display = 'block';
      tip.style.left = (e.clientX + 15) + 'px';
      tip.style.top = (e.clientY + 15) + 'px';
    } else {
      tip.style.display = 'none';
    }
  });
}
// initTooltips is called once
setTimeout(initTooltips, 500);

window.openDNAEditor = function() {
    if(state !== 'playing' || !player || !player.alive) return;
    document.getElementById('dnaModal').style.display='block';
    document.getElementById('dnaPts').innerText = Math.floor(gameStats.dna || 0);
    window.lastTimeScale = timeScale;
    timeScale = 0; // Pause
};
window.closeDNAEditor = function() {
    document.getElementById('dnaModal').style.display='none';
    timeScale = window.lastTimeScale || 0.5;
};
window.buyMutation = function(type) {
    if(!player || !player.alive) return;
    if(!gameStats.dna) gameStats.dna = 0;
    var costs = {speed: 5, size: 8, spikes: 15, shell: 20};
    if(gameStats.dna >= costs[type]) {
        if(!player.sp.isCustom) {
            player.sp = Object.assign({}, player.sp);
            player.sp.flags = Object.assign({}, player.sp.flags || {});
            player.sp.isCustom = true;
        }
        if(type==='speed') { player.speedMult = (player.speedMult||1) + 0.5; player.sp.locomotion='flagella'; }
        if(type==='size') { player.size += 5; player.sp.size += 5; }
        if(type==='spikes') { player.sp.flags.spikes=true; player.sp.shape='spiky'; }
        if(type==='shell') { player.sp.flags.shell=true; }
        gameStats.dna -= costs[type];
        document.getElementById('dnaPts').innerText = Math.floor(gameStats.dna);
        if(settings.particles) for(var k=0;k<3;k++) parts.push({x:player.x,y:player.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.6,maxL:0.6,size:1,color:'#0ff'});
        if(typeof updateHUD === 'function') updateHUD();
    }
};

window.exportDNA = function() {
    if(!player || !player.sp) return;
    var str = btoa(JSON.stringify(player.sp));
    document.getElementById('dnaString').value = str;
};

window.importDNA = function() {
    if(!player) return;
    var str = document.getElementById('dnaString').value;
    try {
        var sp = JSON.parse(atob(str));
        sp.isCustom = true;
        player.sp = sp;
        player.color = sp.color;
        player.size = sp.size;
        if(settings.particles) for(var k=0;k<3;k++) parts.push({x:player.x,y:player.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.6,maxL:0.6,size:1,color:'#f0f'});
        document.getElementById('dnaString').value = 'DNA Imported Successfully!';
    } catch(e) {
        document.getElementById('dnaString').value = 'Invalid DNA String!';
    }
};

