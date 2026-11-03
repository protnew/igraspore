const fs = require('fs');
const keysEn = {
  'theme.classic':'Classic','theme.phaseContrast':'Phase contrast','theme.neonBio':'Neon',
  'theme.glassLab':'Glass lab','theme.cyberpunk':'Cyberpunk','theme.haeckel':'Haeckel',
  'theme.engraving':'Engraving','theme.bestiary':'Bestiary style','theme.pond':'Pond style',
  'theme.analyticsOptOut':'Theme analytics','theme.analyticsHint':'Anonymous style stats','theme.fpsFallback':'Theme FX reduced (FPS)'
};
const keysRu = {
  'theme.classic':'Классика','theme.phaseContrast':'Фазовый контраст','theme.neonBio':'Неон',
  'theme.glassLab':'Стеклянная лаб.','theme.cyberpunk':'Киберпанк','theme.haeckel':'Геккель',
  'theme.engraving':'Гравюра','theme.bestiary':'Стиль бестиария','theme.pond':'Стиль водоёма',
  'theme.analyticsOptOut':'Аналитика стилей','theme.analyticsHint':'Анонимная статистика стилей','theme.fpsFallback':'Эффекты темы снижены (FPS)'
};
function patch(file, keys) {
  let j = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  let n = 0;
  for (const [k,v] of Object.entries(keys)) { if (j[k] !== v) { j[k]=v; n++; } }
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
  console.log(file, 'updated', n);
}
patch('.04-Src/i18n/en.json', keysEn);
patch('.04-Src/i18n/ru.json', keysRu);
