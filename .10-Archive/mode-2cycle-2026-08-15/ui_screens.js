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
    // Cartoon: brighter, more saturated, simpler
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
