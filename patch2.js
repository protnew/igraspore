const fs = require('fs');

function patchFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  let newContent = replacer(content);
  if(content !== newContent) {
    fs.writeFileSync(path, newContent, 'utf8');
    console.log(`Patched ${path}`);
  } else {
    console.log(`No changes made to ${path}`);
  }
}

// 1. Patch config.js (tod = 5)
patchFile('js/config.js', txt => {
  return txt.replace(/var tod=new Date\(\)\.getHours\(\)\+new Date\(\)\.getMinutes\(\)\/60/, 'var tod=5');
});

// 2. Patch index.html (fonts to white in .scN and .scL)
patchFile('index.html', txt => {
  txt = txt.replace('.scN{color:#4df;', '.scN{color:#fff;text-shadow:1px 1px 2px #000;');
  txt = txt.replace('.scL{color:#678;', '.scL{color:#fff;text-shadow:1px 1px 2px #000;');
  return txt;
});

// 3. Patch ui.js (showDeadScreen completely replaced)
patchFile('js/ui.js', txt => {
  let oldFuncStr = `function showDeadScreen(){
  var ds=document.getElementById('deadStats');var playSec=Math.round((Date.now()-gameStats.startTime)/1000);
  var html='<table class="stbl">';
  html+='<tr><td class="lbl">'+tt('gameTime')+'</td><td class="val">'+playSec+'s</td></tr>';
  html+='<tr><td class="lbl">'+tt('days')+'</td><td class="val">'+totalDays+'</td></tr>';
  html+='<tr><td class="lbl">'+tt('maxPop')+'</td><td class="val">'+gameStats.maxPop+'</td></tr>';
  html+='<tr><td class="lbl">'+tt('offspring')+'</td><td class="val">'+(player?player.offspring:0)+'</td></tr>';
  html+='<tr><td class="lbl">'+tt('eaten')+'</td><td class="val">'+(player?player.eaten:0)+'</td></tr>';
  html+='</table><div style="margin-top:8px;color:#678;font-size:11px;text-align:center">'+tt('dCauses')+'</div>';
  html+='<table class="stbl">';
  for(var d=0;d<5;d++){var dl=(curLang==='ru'?DLAB_RU:DLAB_EN)[d];html+='<tr><td class="lbl">'+dl+'</td><td class="val">'+stats.deathCauses[d]+'</td></tr>';}
  html+='</table>';ds.innerHTML=html;
  document.getElementById('deadT').textContent=tt('dead');document.getElementById('deadO').className='ov show';
}`;

  let newFuncStr = `function showDeadScreen(){
  var ds=document.getElementById('deadStats');var playSec=Math.round((Date.now()-gameStats.startTime)/1000);
  var html='';
  
  // Pond Stats
  var globalBorn = 0; var globalAlive = orgs.length;
  for(var i=0;i<speciesPop.length;i++) globalBorn += speciesPop[i].born;
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
  
  // Causes
  html+='<div style="margin-top:12px;color:#678;font-size:11px;text-align:center">'+tt('dCauses')+' (Global)</div>';
  html+='<table class="stbl">';
  for(var d=0;d<5;d++){var dl=(curLang==='ru'?DLAB_RU:DLAB_EN)[d];html+='<tr><td class="lbl">'+dl+'</td><td class="val">'+stats.deathCauses[d]+'</td></tr>';}
  html+='</table>';
  
  ds.innerHTML=html;
  document.getElementById('deadT').textContent=tt('dead');document.getElementById('deadO').className='ov show';
}`;

  return txt.replace(oldFuncStr, newFuncStr);
});
