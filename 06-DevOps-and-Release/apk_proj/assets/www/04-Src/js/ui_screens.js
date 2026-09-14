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
  if(settings.renderMode!=='cartoon' && settings.renderMode!=='swiss'){
    settings.renderMode='cartoon';
  } else {
    settings.renderMode = settings.renderMode==='swiss' ? 'cartoon' : 'swiss';
  }
  el.className='tg'+(settings.renderMode==='swiss'?' on':'');
  var lbl=document.getElementById('rmodeLbl');
  if(lbl) lbl.innerHTML = settings.renderMode==='swiss' ? '📗 SwissBioPics' : '🎨 Cartoon';
  applyRenderMode();
}

function applyRenderMode(){
  if(settings.renderMode!=='cartoon' && settings.renderMode!=='swiss'){
    settings.renderMode='cartoon';
  }
  window._swissStrict = (settings.renderMode==='swiss');
  if(settings.renderMode==='swiss'){
    settings.particles=true; settings.bubbles=true; settings.vignette=false;
    settings.lightMul=1.0;
    if(typeof window.loadSwissSprites==='function'){
      var ready = (typeof window.swissReady==='function') ? window.swissReady() : false;
      if(!ready) window.loadSwissSprites();
    }
  } else {
    settings.lightMul=1.0;
  }
  var btn=document.getElementById('renderModeBtn');
  var smBtn=document.getElementById('bRender');
  var lbl=document.getElementById('rmodeLbl');
  if(settings.renderMode==='swiss'){
    if(btn){btn.className='swiss';btn.innerHTML='\uD83D\uDCD7 SWISSBIOPICS';btn.title='SwissBioPics. Click -> cartoon';}
    if(smBtn){smBtn.classList.add('is-active-swiss');}
    if(lbl) lbl.innerHTML='\uD83D\uDCD7 SwissBioPics';
  } else {
    if(btn){btn.className='cartoon';btn.innerHTML='\uD83C\uDFA8 CARTOON';btn.title='Cartoon. Click -> SwissBioPics';}
    if(smBtn){smBtn.classList.remove('is-active-swiss');}
    if(lbl) lbl.innerHTML='\uD83C\uDFA8 Cartoon';
  }
}

function buildSettings(){
  var sb=document.getElementById('setBody');
  var opts=[['particles',tt('particles')],['bubbles',tt('bubbles')],['currents',tt('currents')],['vignette',tt('vignette')],['healthBars',tt('healthBars')],['shadows',tt('shadows')]];
  var html='';
  for(var i=0;i<opts.length;i++)html+='<div class="sr"><span>'+opts[i][1]+'</span><div class="tg'+(settings[opts[i][0]]?' on':'')+'" data-s="'+opts[i][0]+'" onclick="toggleSet(this)"></div></div>';
  // Render mode toggle: cartoon ↔ swiss (same 2-mode cycle as N / big button)
  html+='<div class="sr"><span>'+(window._t_renderMode||'Render Mode')+': <b id="rmodeLbl">'+(settings.renderMode==='swiss'?'📗 SwissBioPics':'🎨 Cartoon')+'</b></span><div class="tg'+(settings.renderMode==='swiss'?' on':'')+'" id="rmodeTg" onclick="toggleRenderMode(this)"></div></div>';
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
  var wc=document.getElementById('wikiContent');
  if(!wc) return;
  var html='';
  var search=(filter||'').toLowerCase();
  var ru=(typeof curLang==='undefined' || curLang!=='en');
  var cats=[['producer',tt('producer')],['consumer1',tt('consumer1')],['consumer2',tt('consumer2')],['consumer3',tt('consumer3')],['decomposer',tt('decomposer')],['virus',tt('virus')]];
  function organList(sp){
    var bio=sp&&sp.bio?sp.bio:{};
    var organs=[];
    if(bio.chloro)organs.push(ru?'\u0445\u043b\u043e\u0440\u043e\u043f\u043b\u0430\u0441\u0442\u044b':'chloroplasts');
    if(bio.nucleus)organs.push(ru?'\u044f\u0434\u0440\u043e':'nucleus');
    if(bio.macro)organs.push(ru?'\u043c\u0430\u043a\u0440\u043e/\u043c\u0438\u043a\u0440\u043e\u043d\u0443\u043a\u043b\u0435\u0443\u0441':'macro/micronucleus');
    if(bio.cilia)organs.push(ru?'\u0440\u0435\u0441\u043d\u0438\u0447\u043a\u0438':'cilia');
    if(bio.flag)organs.push(ru?'\u0436\u0433\u0443\u0442\u0438\u043a':'flagella');
    if(bio.pseudo)organs.push(ru?'\u043f\u0441\u0435\u0432\u0434\u043e\u043f\u043e\u0434\u0438\u0438':'pseudopodia');
    if(bio.mito)organs.push(ru?'\u043c\u0438\u0442\u043e\u0445\u043e\u043d\u0434\u0440\u0438\u0438':'mitochondria');
    if(bio.golgi)organs.push(ru?'\u0433\u043e\u043b\u044c\u0434\u0436\u0438':'Golgi');
    if(bio.trich)organs.push(ru?'\u0442\u0440\u0438\u0445\u043e\u0446\u0438\u0441\u0442\u044b':'trichocysts');
    if(bio.contractile)organs.push(ru?'\u0441\u043e\u043a\u0440. \u0432\u0430\u043a\u0443\u043e\u043b\u044c':'contractile vacuole');
    return organs;
  }
  function artBlock(sp, fallback){
    var art='';
    try{ if(typeof window.getWikiArticle==='function') art=window.getWikiArticle(sp)||''; }catch(eA){ art=''; }
    if(!art) art=fallback||'';
    var wp='';
    try{ if(typeof window.wikiPage==='function') wp=window.wikiPage(sp)||''; }catch(eP){ wp=''; }
    var out='';
    if(art) out+='<div class="wa">'+art+'</div>';
    if(wp) out+='<div class="ww"><a href="'+wp+'" target="_blank" rel="noopener noreferrer">Wikipedia</a></div>';
    return out;
  }
  function factsRow(w){
    if(!w) w={loc:'-',div:'-',food:'-',pred:'-'};
    return '<div class="wf"><b>'+(ru?'\u0414\u0432\u0438\u0436\u0435\u043d\u0438\u0435':'Locomotion')+':</b> '+(w.loc||'-')+
      ' \u00b7 <b>'+(ru?'\u0414\u0435\u043b\u0435\u043d\u0438\u0435':'Division')+':</b> '+(w.div||'-')+
      ' \u00b7 <b>'+(ru?'\u041f\u0438\u0449\u0430':'Food')+':</b> '+(w.food||'-')+
      ' \u00b7 <b>'+(ru?'\u0412\u0440\u0430\u0433\u0438':'Predators')+':</b> '+(w.pred||'-')+'</div>';
  }
  try{
    for(var ci=0;ci<cats.length;ci++){
      var cat=cats[ci][0],catLabel=cats[ci][1];
      if(cat==='virus'){
        var hasVirus=false;
        var vlist=(typeof VIRUS_SPECS!=='undefined' && VIRUS_SPECS)?VIRUS_SPECS:[];
        for(var vi=0;vi<vlist.length;vi++){
          var vs=vlist[vi]; if(!vs) continue;
          if(search && String(vs.name||'').toLowerCase().indexOf(search)<0) continue;
          if(!hasVirus){
            html+='<div class="wiki-cat" style="color:'+(CC&&CC.virus?CC.virus:'#f44')+'">'+catLabel+'</div>';
            hasVirus=true;
          }
          var vfb=ru?'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u043e\u0444\u0430\u0433. \u0417\u0430\u0440\u0430\u0436\u0430\u0435\u0442 \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438, \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u043b\u0438\u0437\u0438\u0441.':'Bacteriophage. Infects bacteria, causes lysis.';
          html+='<div class="wiki-entry"><b style="color:'+(vs.color||'#f44')+'">'+(vs.name||('virus '+vi))+'</b>'+
            '<div class="wl">'+(ru?'\u0420\u0430\u0437\u043c\u0435\u0440':'Size')+': '+(vs.size||'?')+'\u03bcm</div>'+
            artBlock(vs, vfb)+'</div>';
        }
        continue;
      }
      var pool=(typeof SPECIES_DB!=='undefined'?SPECIES_DB:[]).filter(function(s){return s&&s.cat===cat;});
      if(pool.length===0) continue;
      if(search){
        pool=pool.filter(function(s){return String(s.name||'').toLowerCase().indexOf(search)>=0;});
        if(pool.length===0) continue;
      }
      html+='<div class="wiki-cat" style="color:'+((CC&&CC[cat])||'#8cf')+'">'+catLabel+' ('+pool.length+')</div>';
      if(typeof CAT_ROLE==='object' && CAT_ROLE[cat]){
        var role=ru?CAT_ROLE[cat].ru:CAT_ROLE[cat].en;
        if(role) html+='<div class="wiki-role">'+role+'</div>';
      }
      for(var si=0;si<pool.length;si++){
        var sp=pool[si];
        var w={loc:'-',div:'-',food:'-',pred:'-'};
        try{ if(typeof getWikiEntry==='function') w=getWikiEntry(sp.id)||w; }catch(eW){}
        var organs=organList(sp);
        html+='<div class="wiki-entry"><b style="color:'+(sp.color||'#8cf')+'">'+(sp.name||('sp '+si))+'</b>'+
          '<div class="wl">'+(sp.size||'?')+'\u03bcm \u00b7 '+(sp.speed||'?')+'\u03bcm/s \u00b7 '+(sp.locomotion||'-')+'</div>'+
          artBlock(sp,'')+
          factsRow(w)+
          (organs.length?'<div class="wo"><b>'+(ru?'\u041e\u0440\u0433\u0430\u043d\u0435\u043b\u043b\u044b':'Organelles')+':</b> '+organs.join(', ')+'</div>':'')+
          '</div>';
      }
    }
    if(!html) html='<div class="wiki-entry">'+(ru?'\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e.':'Nothing found.')+'</div>';
  }catch(eBuild){
    html='<div class="wiki-entry">Wiki error: '+(eBuild&&eBuild.message?eBuild.message:'unknown')+'</div>';
  }
  wc.innerHTML=html;
}
