const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('globalTooltip')) {
  let tooltipHTML = `<div id="globalTooltip" style="display:none; position:absolute; z-index:9999; background:rgba(10,20,35,0.95); border:1px solid #4af; color:#fff; padding:8px 12px; border-radius:6px; font-family:sans-serif; font-size:12px; pointer-events:none; box-shadow:0 4px 10px rgba(0,0,0,0.5); max-width:250px; text-shadow:0 1px 2px #000;"></div>`;
  html = html.replace('</body>', tooltipHTML + '\n</body>');
  fs.writeFileSync('index.html', html);
}

let ui = fs.readFileSync('js/ui.js', 'utf8');

if (!ui.includes('function initTooltips')) {
  let tooltipJS = `
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
`;
  ui += '\n' + tooltipJS;
  fs.writeFileSync('js/ui.js', ui);
}

console.log('Tooltips injected successfully.');
