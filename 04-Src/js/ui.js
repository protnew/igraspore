"use strict";
function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
function showSpeedBar(){
  var sb=document.getElementById('spdBar');
  var speeds=[{v:0,l:'\u23f8'},{v:0.1,l:'0.1x'},{v:0.25,l:'0.25x'},{v:0.5,l:'0.5x'},{v:1,l:'1x'},{v:5,l:'5x'},{v:25,l:'25x'},{v:100,l:'100x'}];
  sb.innerHTML='';
  for(var i=0;i<speeds.length;i++){
    var b=document.createElement('div');b.className='sb'+(timeScale===speeds[i].v?' act':'');b.textContent=speeds[i].l;
    b.setAttribute('data-ts',speeds[i].v);b.title=speeds[i].v===0?tt('paused'):speeds[i].l;
    b.onclick=function(ev){timeScale=parseFloat(ev.target.getAttribute('data-ts'));showSpeedBar();};
    sb.appendChild(b);
  }
  sb.style.display='flex';
}

var langNames = {
  ru: 'Русский', en: 'English', zh: '中文', es: 'Español', hi: 'हिन्दी', 
  ar: 'العربية', pt: 'Português', fr: 'Français', de: 'Deutsch', ja: '日本語', ko: '한국어'
};







function updateHUD(){
  if(!player||!player.alive){document.getElementById('hud').style.display='none';return;}
  var h=document.getElementById('hud');h.style.display='block';var eRatio=clamp(player.energy/100,0,1);
  var dnaBtn = '<button onclick="openDNAEditor()" style="margin-top:5px;background:#0ff;color:#000;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;width:100%;box-sizing:border-box;">\uD83E\uDDEC \u0414\u041d\u041a-\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440</button>';
  h.innerHTML='<div class="nm">'+player.sp.name+'</div><div class="la">Gen '+player.generation+' \u00b7 '+player.size.toFixed(1)+'\u03bcm</div>'+
    '<div id="ebar"><div id="efill" style="width:'+(eRatio*100)+'%;background:'+(eRatio>0.6?'#4f4':eRatio>0.3?'#ff4':'#f44')+'"></div></div>'+
    '<div class="st">'+tt('energy')+': '+Math.round(player.energy)+'/100 \u00b7 '+tt('age')+': '+Math.round(player.age)+'s<br>'+
    tt('eaten')+': '+player.eaten+' \u00b7 '+tt('divs')+': '+player.offspring+'</div>'+(player.infected?'<div style="color:#f44;font-size:9px">\u2620 '+(curLang==='ru'?'\u0417\u0430\u0440\u0430\u0436\u0435\u043d!':'Infected!')+'</div>':'') + dnaBtn;
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
function updateEcoPanel(){
  var ep=document.getElementById('ecoP');var cats=['producer','consumer1','consumer2','consumer3','decomposer'];
  var html='<div class="ecT">'+(curLang==='ru'?'\u042d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u0430':'Ecosystem')+'</div>';
  var maxCat=1;
  for(var ci=0;ci<cats.length;ci++){var c=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cats[ci])c++;if(c>maxCat)maxCat=c;}
  for(var ci=0;ci<cats.length;ci++){var cat=cats[ci];var c=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cat)c++;
    html+='<div class="ecR"><div class="ecD" style="background:'+CC[cat]+'"></div><div class="ecB"><div class="ecF" style="width:'+(c/maxCat*100)+'%;background:'+CC[cat]+'"></div></div><div class="ecC">'+c+'</div></div>';}
  if(viruses.length>0)html+='<div class="ecR"><div class="ecD" style="background:#f44"></div><div class="ecB"><div class="ecF" style="width:'+Math.min(100,viruses.length*5)+'%;background:#f44"></div></div><div class="ecC">'+viruses.length+'</div></div>';
  html+='<div class="ecSub">'+tt('dCauses')+':<div style="display:flex; flex-direction:column; gap:2px;">';
  for(var d=0;d<5;d++){
      var dl=(curLang==='ru'?DLAB_RU:DLAB_EN)[d];
      html+='<div style="display:flex; justify-content:space-between; width:100%;"><span>'+dl+':</span> <span>'+stats.deathCauses[d]+'</span></div>';
  }
  html+='</div></div>';ep.innerHTML=html;ep.style.display='block';
}
function updateLegend(){
  var lg=document.getElementById('legP');var cats=['producer','consumer1','consumer2','consumer3','decomposer','virus','macrophage'];
  var html='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(curLang==='ru'?'\u041b\u0435\u0433\u0435\u043d\u0434\u0430':'Legend')+'</div>';
  for(var ci=0;ci<cats.length;ci++){var cat=cats[ci];html+='<div class="lgR" style="color:#fff"><div class="lgD" style="background:'+(CC[cat]||'#f44')+'"></div>'+tt(cat)+'</div>';}
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
        if(settings.particles) for(var k=0;k<15;k++) parts.push({x:player.x,y:player.y,vx:rng(-2,2),vy:rng(-2,2),life:2,maxL:2,size:3,color:'#0ff'});
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
        if(settings.particles) for(var k=0;k<15;k++) parts.push({x:player.x,y:player.y,vx:rng(-2,2),vy:rng(-2,2),life:2,maxL:2,size:3,color:'#f0f'});
        document.getElementById('dnaString').value = 'DNA Imported Successfully!';
    } catch(e) {
        document.getElementById('dnaString').value = 'Invalid DNA String!';
    }
};

