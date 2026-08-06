"use strict";


function countCat(cat){
  if(cat==='virus') return (typeof VIRUS_SPECS!=='undefined')?VIRUS_SPECS.length:0;
  if(cat==='all') return SPECIES_DB.length;
  var n=0; for(var i=0;i<SPECIES_DB.length;i++){ if(SPECIES_DB[i]&&SPECIES_DB[i].cat===cat) n++; }
  return n;
}
function buildCatSel(){
  var cs=document.getElementById('catSel'); if(!cs) return; cs.innerHTML='';
  if(typeof renderPoolBanner==='function') renderPoolBanner();
  if(typeof renderFoodChain==='function') renderFoodChain();
  if(typeof selCat==='undefined' || !selCat) selCat='all';
  var cats=[['all',tt('all')],['producer',tt('producer')],['consumer1',tt('consumer1')],['consumer2',tt('consumer2')],['consumer3',tt('consumer3')],['decomposer',tt('decomposer')],['virus',tt('virus')]];
  for(var i=0;i<cats.length;i++){
    var key=cats[i][0], label=cats[i][1], n=countCat(key);
    var b=document.createElement('div');
    b.className='cb'+(selCat===key?' act':'');
    b.setAttribute('data-c', key);
    b.innerHTML=label+' <span style="opacity:.55;font-size:10px">('+n+')</span>';
    b.style.borderLeft='4px solid '+(key==='all'?'#456':(CC[key]||'#f44'));
    b.style.cursor='pointer';
    b.onclick=function(ev){
      var el=ev.currentTarget||ev.target;
      var c=el.getAttribute('data-c');
      if(!c && el.parentElement) c=el.parentElement.getAttribute('data-c');
      if(!c) return;
      selCat=c;
      buildCatSel();
      buildSpeciesGrid();
      var sg=document.getElementById('spGrid'); if(sg) sg.scrollTop=0;
      if(typeof catRole==='function' && selCat && selCat!=='all' && window.showToast){
        var tip=catRole(selCat); if(tip) window.showToast(tip, CC[selCat]||'#8cf');
      }
    };
    cs.appendChild(b);
  }
}

function buildSpeciesGrid(){
  var sg=document.getElementById('spGrid'); if(!sg) return; sg.innerHTML='';
  if(typeof selCat==='undefined' || !selCat) selCat='all';
  // Status line: what filter is active
  var shownN = (selCat==='virus') ? ((typeof VIRUS_SPECS!=='undefined')?VIRUS_SPECS.length:0)
              : (selCat==='all' ? SPECIES_DB.length : countCat(selCat));
  var st=document.createElement('div');
  st.id='spFilterStatus';
  st.style.cssText='width:100%;padding:4px 8px;margin:0 0 6px 0;font-size:11px;color:#9cf;background:rgba(0,40,60,0.45);border-radius:6px;border:1px solid rgba(80,140,180,0.35)';
  var catLabel = (selCat==='all') ? tt('all') : (typeof catName==='function'?catName(selCat):selCat);
  st.textContent = 'Показано: '+shownN+' видов · фильтр: '+catLabel+(selCat==='producer'?' (есть колонии)':'');
  sg.appendChild(st);
  if(selCat==='virus'){
    for(var vi=0;vi<VIRUS_SPECS.length;vi++){
      var vs=VIRUS_SPECS[vi];
      var c=document.createElement('div');c.className='sc'+(selSpecies===VIRUS_ID_START+vi?' sel':'');c.setAttribute('data-si',VIRUS_ID_START+vi);
      var vnum=(typeof vs.num==='number')?vs.num:(SPECIES_DB.length+1+vi);c.innerHTML='<div class="scN" style="color:'+vs.color+'"><span style="opacity:.7;font-size:10px;margin-right:4px">#'+vnum+'</span>'+vs.name+'</div><div class="scL">'+vs.size+'\u03bcm</div><div class="scC">\u2620 \u0412\u0438\u0440\u0443\u0441</div><div class="scP">-</div>';
      c.onclick=function(ev){selSpecies=parseInt(ev.currentTarget.getAttribute('data-si'));buildSpeciesGrid();};
      sg.appendChild(c);
    }
    return;
  }
  // Build index list, colonies first so they are visible without scrolling
  var idxs=[];
  for(var i=0;i<SPECIES_DB.length;i++){
    var sp0=SPECIES_DB[i]; if(!sp0) continue;
    if(selCat!=='all'&&sp0.cat!==selCat) continue;
    idxs.push(i);
  }
  idxs.sort(function(a,b){
    var ca=(SPECIES_DB[a].shape==='colony'||(SPECIES_DB[a].bio&&SPECIES_DB[a].bio.colony))?0:1;
    var cb=(SPECIES_DB[b].shape==='colony'||(SPECIES_DB[b].bio&&SPECIES_DB[b].bio.colony))?0:1;
    if(ca!==cb) return ca-cb;
    return a-b;
  });
  for(var ii=0;ii<idxs.length;ii++){
    var i=idxs[ii];
    var sp=SPECIES_DB[i];
    var c=document.createElement('div');c.className='sc'+(selSpecies===i?' sel':'');c.setAttribute('data-si',i);
    var pop=speciesPop[i]?speciesPop[i].alive:0;
    var eatInfo='';
    if(sp.cat==='producer'){ eatInfo='<span style="color:#8f8">\u{1F31E} ест свет</span>'; }
    else if(sp.cat==='decomposer'){ eatInfo='<span style="color:#b96">\u{1F9F9} ест мёртвое</span>'; }
    else {
      var eatsCats = FOOD[sp.cat]||[];
      var parts=[];
      for(var ec=0;ec<eatsCats.length;ec++){
        var cn = (typeof catName==='function')?catName(eatsCats[ec]):eatsCats[ec];
        parts.push((typeof roleColor==='function'?'<span style="color:'+roleColor(eatsCats[ec])+'">':'<span>')+cn+'</span>');
      }
      eatInfo='<span style="font-size:8.5px">\u{1F5D1} ест: '+parts.join(', ')+'</span>';
    }
    var roleShort='';
    if(typeof catName==='function'){ roleShort=catName(sp.cat); }
    var spNum=(typeof sp.num==='number')?sp.num:(i+1);
    var isCol=(sp.shape==='colony'||(sp.bio&&sp.bio.colony));
    var colonyTag=isCol?' · КОЛОНИЯ':'';
    if(isCol){c.style.boxShadow='inset 0 0 0 2px #4c8';c.style.background='rgba(20,60,30,0.55)';}
    c.innerHTML='<canvas class="scPrev" width="120" height="120" style="display:block;margin:2px auto;background:rgba(0,15,35,0.6);border-radius:4px"></canvas>'+
      '<div class="scN" style="color:'+sp.color+';font-size:9px;line-height:1.2"><span style="opacity:.75;font-weight:700;margin-right:3px;color:#9cf">#'+spNum+'</span>'+sp.name+'</div>'+
      '<div class="scL">'+(Math.round(sp.size*10)/10)+'\u03bcm &middot; '+sp.shape+colonyTag+'</div>'+
      '<div class="scC">'+sp.locomotion+'</div>'+
      '<div style="font-size:8.5px;opacity:.75;margin-top:1px">'+roleShort+'</div>'+
      '<div style="font-size:8.5px;margin-top:1px;line-height:1.2">'+eatInfo+'</div>'+
      '<div class="scP">'+pop+' alive</div>';
    var pcv=c.querySelector('.scPrev');drawSpeciesPreview(pcv,sp,i);
    c.onclick=function(ev){selSpecies=parseInt(ev.currentTarget.getAttribute('data-si'));buildSpeciesGrid();};
    sg.appendChild(c);
  }
}

function updateMenuTexts(){
  (function(){
    var poolN = 0;
    try {
      var dens = (typeof settings!=='undefined' && settings.density) ? settings.density : 1;
      if(typeof INIT_N==='object'){
        for(var k in INIT_N){ if(INIT_N.hasOwnProperty(k)) poolN += Math.round((INIT_N[k]||0)*dens); }
      }
      // difficulty can scale spawn
      if(typeof DIFF!=='undefined' && typeof difficulty!=='undefined' && DIFF[difficulty] && DIFF[difficulty].spawn)
        poolN = Math.round(poolN * DIFF[difficulty].spawn);
    } catch(e){ poolN = 1600; }
    if(!poolN) poolN = 1600;
    var el = document.getElementById('menuSub');
    if(el) el.innerHTML = tt('menuSub') +
      '<br><span style="color:#8cf;font-size:11px">\u{1F30A} В бассейне будет: <b style="color:#fff">~'+poolN+'</b> организмов · '+SPECIES_DB.length+' видов</span>';
  })();
  document.getElementById('startBtn').textContent=tt('start');
  document.getElementById('helpBtn').textContent=tt('help');
  document.getElementById('setBtn2').textContent=tt('set');
  document.getElementById('wikiBtnMenu').textContent=tt('wiki');
  document.getElementById('resBtn').textContent=tt('resume');
  document.getElementById('pHelp').textContent=tt('help');document.getElementById('pSet').textContent=tt('set');document.getElementById('pWiki').textContent=tt('wiki');
  document.getElementById('pauseT').textContent=tt('paused');
  document.getElementById('restartBtn').textContent=tt('restart');document.getElementById('menuBtn').textContent=tt('menu');
  document.getElementById('helpT').textContent=tt('help');document.getElementById('helpClose').textContent=tt('close');
  document.getElementById('setT').textContent=tt('settingsT');document.getElementById('setClose').textContent=tt('close');
  document.getElementById('wikiT').textContent=tt('wikiT');document.getElementById('wikiClose').textContent=tt('close');
  var hk=curLang==='ru'?'<span><kbd>WASD</kbd> \u041f\u043b\u044b\u0432\u0430\u0442\u044c</span><span><kbd>\u041b\u041a\u041c</kbd> \u041a \u043a\u0443\u0440\u0441\u043e\u0440\u0443</span><span><kbd>\u041f\u043a\u041c</kbd> \u0426\u0435\u043b\u044c</span><span><kbd>F</kbd> \u0421\u0432\u043e\u0431. \u043a\u0430\u043c\u0435\u0440\u0430</span><span><kbd>V</kbd> \u041a \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c\u0443</span><span><kbd>E</kbd> \u0421\u044a\u0435\u0441\u0442\u044c</span><span><kbd>Q</kbd> \u0414\u0435\u043b\u0435\u043d\u0438\u0435</span><span><kbd>Tab</kbd> \u0410\u0432\u0442\u043e</span><span><kbd>B</kbd> \u0412\u0438\u043a\u0438</span><span><kbd>P</kbd> \u041f\u0430\u0443\u0437\u0430</span>'
    :'<span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>F</kbd> Free cam</span><span><kbd>V</kbd> Follow</span><span><kbd>E</kbd> Eat</span><span><kbd>Q</kbd> Divide</span><span><kbd>Tab</kbd> Auto</span><span><kbd>B</kbd> Wiki</span><span><kbd>P</kbd> Pause</span>';
  document.getElementById('keyHint').innerHTML=hk;
  document.getElementById('helpBody').innerHTML=curLang==='ru'?
    '<p><b style="color:#4df">Управление:</b> WASD — плавание. Вверх = поверхность, вниз = дно. ЛКМ — плыть к курсору. Пробел — укус.</p>'+
    '<p><b style="color:#8f8">Кто кого ест (просто):</b></p>'+
    '<p style="line-height:1.45">🌱 <b>Зелёные</b> — не охотятся. Кормятся светом (как растения). Это основной корм пруда.<br>'+
    '🔵 <b>Мелкие едоки</b> — бактерии. Грызут зелёных.<br>'+
    '🟠 <b>Средние едоки</b> — инфузории. Фильтруют воду: затягивают бактерий и зелёных. Не прыгают на гигантов.<br>'+
    '🟣 <b>Крупные охотники</b> — едят зелёных, бактерий и средних. Можно кусать и чуть более крупных (опасно). Без еды живут долго.</p>'+
    '<p><b style="color:#4df">Камера:</b> F — свободный полёт. V — вернуться к клетке. Колесо — зум.</p>'+
    '<p><b style="color:#4df">Деление:</b> Наелся и вырос — делишься на двоих. Q — вручную.</p>'
    :'<p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p>'+
    '<p><b style="color:#8f8">Who eats whom:</b></p>'+
    '<p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p>'+
    '<p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p>'+
    '<p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p>';
  buildDiff();buildCatSel();buildSpeciesGrid();
}
