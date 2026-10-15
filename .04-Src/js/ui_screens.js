"use strict";

function buildLangBar() {
  var lb = document.getElementById('langSelDrop');
  if(!lb) return;
  lb.innerHTML = '';
  document.getElementById('curLangTxt').textContent = langNames[curLang] || curLang;
  var enabled = window.IGS_ENABLED || {ru:1, en:1, 'pt-BR':1, id:1, de:1, fr:1, hi:1, ja:1, vi:1, ko:1, th:1, it:1, pl:1, uk:1, 'zh-TW':1, ms:1, bn:1};
  for(var l in LANGS) {
    if(!enabled[l]) continue;
    var b = document.createElement('div');
    b.className = 'lang-item' + (curLang === l ? ' act' : '');
    b.textContent = langNames[l] || LANGS[l];
    b.setAttribute('data-lang', l);
    b.onclick = function(ev) {
      var next = ev.target.getAttribute('data-lang');
      function apply() {
        curLang = next;
        if (typeof applyLangFont === 'function') applyLangFont(curLang);
        try { localStorage.setItem('igs_lang', curLang); localStorage.removeItem('igs_lang_auto'); } catch(e){}
        buildLangBar();
        if (typeof updateMenuTexts === 'function') updateMenuTexts();
      }
      if (window.loadLangPack) window.loadLangPack(next).then(apply).catch(apply);
      else apply();
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
    var _vh='<div style="color:#f66;font-size:14px;text-align:center;margin-bottom:8px;font-weight:bold;">'+(tt('x.virusMode'))+'</div>';
    _vh+='<table class="stbl">';
    _vh+='<tr><td class="lbl">'+(tt('x.infected3'))+'</td><td class="val">'+_inf+'</td></tr>';
    _vh+='<tr><td class="lbl">'+(tt('x.lysed'))+'</td><td class="val">'+_lysed+'</td></tr>';
    _vh+='<tr><td class="lbl">'+(tt('x.phages'))+'</td><td class="val">'+viruses.length+'</td></tr>';
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
  html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(tt('x.pondStatistics'))+'</div>';
  html+='<table class="stbl" style="margin-bottom:10px">';
  html+='<tr><td class="lbl">'+tt('days')+'</td><td class="val">'+totalDays+'</td></tr>';
  html+='<tr><td class="lbl">'+(tt('x.alive'))+'</td><td class="val">'+globalAlive+'</td></tr>';
  html+='<tr><td class="lbl">'+(tt('x.born'))+'</td><td class="val">'+globalBorn+'</td></tr>';
  html+='<tr><td class="lbl">'+(tt('x.dead'))+'</td><td class="val">'+globalDead+'</td></tr>';
  html+='</table>';

  // Species Stats
  if(player && player.sp) {
    var spData = speciesPop[player.sp.id];
    html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(tt('x.yourSpecies'))+player.sp.name+'</div>';
    html+='<table class="stbl" style="margin-bottom:10px">';
    html+='<tr><td class="lbl">'+(tt('x.currentlyAlive'))+'</td><td class="val">'+spData.alive+'</td></tr>';
    html+='<tr><td class="lbl">'+(tt('x.totalBorn'))+'</td><td class="val">'+spData.born+'</td></tr>';
    html+='</table>';
  }

  // Personal Stats
  html+='<div style="color:#bcd;font-size:12px;text-align:center;margin-bottom:4px;font-weight:bold;">'+(tt('x.yourCell'))+'</div>';
  html+='<table class="stbl">';
  html+='<tr><td class="lbl">'+tt('gameTime')+'</td><td class="val">'+playSec+'s</td></tr>';
  html+='<tr><td class="lbl">'+tt('offspring')+'</td><td class="val">'+(player?player.offspring:0)+'</td></tr>';
  html+='<tr><td class="lbl">'+tt('eaten')+'</td><td class="val">'+(player?player.eaten:0)+'</td></tr>';
  html+='</table>';
  
  // Causes with Tips
  var tips = [tt('dTip.starve'),tt('dTip.eaten'),tt('dTip.temp'),tt('dTip.age'),tt('dTip.lysis')];

  html+='<div style="margin-top:12px;color:#4af;font-size:12px;text-align:center;font-weight:bold;">'+tt('dCauses')+' (Global)</div>';
  html+='<table class="stbl" style="margin-bottom:10px">';
  for(var d=0;d<5;d++){
    var dl=tt(DLAB_KEYS[d]);
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
  if(typeof toggleRenderModeLarge==='function'){ toggleRenderModeLarge(); }
  else {
    settings.renderMode = settings.renderMode==='swiss' ? 'webgl' : (settings.renderMode==='webgl' ? 'cartoon' : 'swiss');
    applyRenderMode();
  }
  if(el) el.className='tg'+(settings.renderMode!=='cartoon'?' on':'');
}

function applyRenderMode(){
  if(settings.renderMode!=='cartoon' && settings.renderMode!=='swiss' && settings.renderMode!=='webgl'){
    settings.renderMode='cartoon';
  }
  window._swissStrict = (settings.renderMode==='swiss');
  if(settings.renderMode==='webgl'){
    if(typeof window.enableWebGLRenderMode==='function'){
      if(!window.enableWebGLRenderMode()){ settings.renderMode='cartoon'; }
    }
  } else if(typeof window.disableWebGLRenderMode==='function'){
    window.disableWebGLRenderMode();
  }
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
  if(smBtn){smBtn.classList.remove('is-active-swiss');}
  if(settings.renderMode==='swiss'){
    if(btn){btn.className='swiss';btn.innerHTML=tt('modeBig.swiss');btn.title=tt('tip.swiss');}
    if(smBtn){smBtn.classList.add('is-active-swiss');}
    if(lbl) lbl.innerHTML=tt('modeLbl.swiss');
  } else if(settings.renderMode==='webgl'){
    if(btn){btn.className='webgl';btn.innerHTML=tt('modeBig.webgl');btn.title=tt('tip.webgl');}
    if(lbl) lbl.innerHTML=tt('modeLbl.webgl');
  } else {
    if(btn){btn.className='cartoon';btn.innerHTML=tt('modeBig.cartoon');btn.title=tt('tip.cartoon');}
    if(lbl) lbl.innerHTML=tt('modeLbl.cartoon');
  }
}

function buildSettings(){
  var sb=document.getElementById('setBody');
  var opts=[['particles',tt('particles')],['bubbles',tt('bubbles')],['currents',tt('currents')],['vignette',tt('vignette')],['healthBars',tt('healthBars')],['shadows',tt('shadows')]];
  var html='';
  for(var i=0;i<opts.length;i++)html+='<div class="sr"><span>'+opts[i][1]+'</span><div class="tg'+(settings[opts[i][0]]?' on':'')+'" data-s="'+opts[i][0]+'" onclick="toggleSet(this)"></div></div>';
  // Render mode toggle: cartoon ↔ swiss (same 2-mode cycle as N / big button)
  html+='<div class="sr"><span>'+tt('picMode')+': <b id="rmodeLbl">'+tt(settings.renderMode==='swiss'?'modeLbl.swiss':'modeLbl.cartoon')+'</b></span><div class="tg'+(settings.renderMode==='swiss'?' on':'')+'" id="rmodeTg" onclick="toggleRenderMode(this)"></div></div>';
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
  try{
    if(typeof window.ensureWikiPack==='function'){
      var _wl=(typeof curLang!=='undefined'&&curLang)?curLang:'en';
      if(!window.WIKI_PACKS||!window.WIKI_PACKS[_wl]){
        window.ensureWikiPack(_wl,function(ok){ if(ok) buildWiki(filter); });
      }
    }
  }catch(eW2){}
  var html='';
  var search=(filter||'').toLowerCase();
  var ru=(typeof curLang==='undefined' || curLang!=='en');
  var cats=[['producer',tt('producer')],['consumer1',tt('consumer1')],['consumer2',tt('consumer2')],['consumer3',tt('consumer3')],['decomposer',tt('decomposer')],['virus',tt('virus')]];
  function organList(sp){
    var bio=sp&&sp.bio?sp.bio:{};
    var organs=[];
    if(bio.chloro)organs.push(tt('x.chloroplasts'));
    if(bio.nucleus)organs.push(tt('x.nucleus'));
    if(bio.macro)organs.push(tt('x.macroMicronucleus'));
    if(bio.cilia)organs.push(tt('x.cilia'));
    if(bio.flag)organs.push(tt('x.flagella'));
    if(bio.pseudo)organs.push(tt('x.pseudopodia'));
    if(bio.mito)organs.push(tt('x.mitochondria'));
    if(bio.golgi)organs.push(tt('x.golgi'));
    if(bio.trich)organs.push(tt('x.trichocysts'));
    if(bio.contractile)organs.push(tt('x.contractileVacuole'));
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
    return '<div class="wf"><b>'+(tt('x.locomotion'))+':</b> '+(w.loc||'-')+
      ' \u00b7 <b>'+(tt('x.division'))+':</b> '+(w.div||'-')+
      ' \u00b7 <b>'+(tt('x.food'))+':</b> '+(w.food||'-')+
      ' \u00b7 <b>'+(tt('x.predators'))+':</b> '+(w.pred||'-')+'</div>';
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
          var vfb=tt('x.bacteriophageInfectsBacteriaCauses');
          html+='<div class="wiki-entry"><b style="color:'+(vs.color||'#f44')+'">'+(vs.name||('virus '+vi))+'</b>'+
            '<div class="wl">'+(tt('x.size'))+': '+(vs.size||'?')+'\u03bcm</div>'+
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
      if(typeof catRole==='function'){
        var role=catRole(cat);
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
          (organs.length?'<div class="wo"><b>'+(tt('x.organelles'))+':</b> '+organs.join(', ')+'</div>':'')+
          '</div>';
      }
    }
    if(!html) html='<div class="wiki-entry">'+(tt('x.nothingFound'))+'</div>';
  }catch(eBuild){
    html='<div class="wiki-entry">Wiki error: '+(eBuild&&eBuild.message?eBuild.message:'unknown')+'</div>';
  }
  wc.innerHTML=html;
}
