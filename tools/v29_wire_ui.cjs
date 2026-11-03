const fs = require('fs');
let idx = fs.readFileSync('index.html','utf8');
if (!idx.includes('theme_engine.js')) {
  idx = idx.replace(
    /(<script src="04-Src\/js\/ui_screens\.js[^"]*"><\/script>)/,
    '<script src="04-Src/js/theme_analytics.js?v=1793720001"></script>\n<script src="04-Src/js/theme_engine.js?v=1793720001"></script>\n$1'
  );
}
if (!idx.includes('igsThemeEngine.initThemes')) {
  idx = idx.replace(
    '</body>',
    '<script>document.addEventListener("DOMContentLoaded",function(){try{if(window.igsThemeEngine)window.igsThemeEngine.initThemes();}catch(e){}});</script>\n</body>'
  );
}
fs.writeFileSync('index.html', idx);
console.log('index', idx.includes('theme_engine.js'), idx.includes('initThemes'));

let ui = fs.readFileSync('.04-Src/js/ui_screens.js','utf8');
if (!ui.includes('injectWikiSwitcher')) {
  const needle = 'wc.innerHTML=html;';
  const i = ui.lastIndexOf(needle);
  if (i >= 0) {
    ui = ui.slice(0, i + needle.length) +
      "\n  try{ if(window.igsThemeEngine&&window.igsThemeEngine.injectWikiSwitcher) window.igsThemeEngine.injectWikiSwitcher(); }catch(eTh){}" +
      ui.slice(i + needle.length);
  }
}
if (!ui.includes('settingsRowsHtml')) {
  ui = ui.replace(
    'sb.innerHTML=html;',
    "if(window.igsThemeEngine&&window.igsThemeEngine.settingsRowsHtml){ html+=window.igsThemeEngine.settingsRowsHtml(); }\n" +
    "html+='<div class=\"sr\"><span>'+(typeof tt==='function'?tt('theme.analyticsOptOut'):'Theme analytics')+'</span>" +
    "<div class=\"tg'+(window.igsThemeAnalytics&&window.igsThemeAnalytics.enabled&&window.igsThemeAnalytics.enabled()?' on':'')+" +
    "'\" id=\"themeAnalyticsTg\" onclick=\"window.__igsToggleThemeAnalytics&&window.__igsToggleThemeAnalytics(this)\"></div></div>';\n" +
    "sb.innerHTML=html;\n" +
    "try{ if(window.igsThemeEngine&&window.igsThemeEngine.bindSettingsSelects) window.igsThemeEngine.bindSettingsSelects(); }catch(eTs){}"
  );
}
fs.writeFileSync('.04-Src/js/ui_screens.js', ui);
console.log('ui', ui.includes('injectWikiSwitcher'), ui.includes('settingsRowsHtml'), ui.split(/\n/).length);

// toggle helper in theme_analytics
let an = fs.readFileSync('.04-Src/js/theme_analytics.js','utf8');
if (!an.includes('__igsToggleThemeAnalytics')) {
  an = an.replace(
    '})(typeof window !== \'undefined\' ? window : globalThis);',
    "w.__igsToggleThemeAnalytics=function(el){var on=!el.classList.contains('on'); if(w.igsThemeAnalytics) w.igsThemeAnalytics.setEnabled(on); el.className='tg'+(on?' on':'');};\n})(typeof window !== 'undefined' ? window : globalThis);"
  );
  fs.writeFileSync('.04-Src/js/theme_analytics.js', an);
}

// CSS append
let css = fs.readFileSync('style.css','utf8');
if (!css.includes('data-theme-pond')) {
  css += `
/* v29 theme engine */
html[data-theme-pond="neon-bio"], body[data-theme-pond="neon-bio"] { background:#000 !important; }
html[data-theme-pond="phase-contrast"], body[data-theme-pond="phase-contrast"] { background:#081214 !important; }
#wikiO[data-theme-bestiary] { background: var(--theme-panel, rgba(0,12,28,.92)); color: var(--theme-text,#fff); border-color: var(--theme-border,#1a3a55); }
#wikiO[data-theme-bestiary="neon-bio"] .wiki-entry { border:1px solid #00ffff55; box-shadow:0 0 8px #ff00aa33; }
#wikiO[data-theme-bestiary="phase-contrast"] .wiki-entry { border:1px solid #7fb2b255; font-family: Georgia, serif; }
#wikiO[data-theme-bestiary="neon-bio"] .tt { color:#00ffff; text-shadow:0 0 8px #ff00aa88; }
#themePondBar, #themeBestiaryBar, .theme-set-row select { min-height:48px; }
.theme-sel-wrap select { min-height:48px; min-width:48px; }
`;
  fs.writeFileSync('style.css', css);
  console.log('css patched', css.split(/\n/).length);
}

// en.json keys
let enPath = '.04-Src/i18n/en.json';
let en = JSON.parse(fs.readFileSync(enPath,'utf8'));
const keys = {
  'theme.classic':'Classic',
  'theme.neonBio':'Neon',
  'theme.phaseContrast':'Phase contrast',
  'theme.bestiary':'Bestiary style',
  'theme.pond':'Pond style',
  'theme.analyticsOptOut':'Theme usage stats',
  'theme.analyticsHint':'Anonymous style stats (no personal data). Can disable.',
  'aria.themeBestiary':'Bestiary visual style',
  'aria.themePond':'Pond visual style'
};
let added = 0;
for (const [k,v] of Object.entries(keys)) { if (en[k] === undefined) { en[k]=v; added++; } }
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log('en keys added', added);

// ru optional
let ruPath = '.04-Src/i18n/ru.json';
if (fs.existsSync(ruPath)) {
  let ru = JSON.parse(fs.readFileSync(ruPath,'utf8'));
  const ruk = {
    'theme.classic':'Классика',
    'theme.neonBio':'Неон',
    'theme.phaseContrast':'Фазовый контраст',
    'theme.bestiary':'Стиль бестиария',
    'theme.pond':'Стиль водоёма',
    'theme.analyticsOptOut':'Статистика стилей',
    'theme.analyticsHint':'Анонимная статистика стилей без персональных данных.',
    'aria.themeBestiary':'Стиль бестиария',
    'aria.themePond':'Стиль водоёма'
  };
  let a=0; for (const [k,v] of Object.entries(ruk)) if (ru[k]===undefined){ru[k]=v;a++;}
  fs.writeFileSync(ruPath, JSON.stringify(ru,null,2)+'\n');
  console.log('ru keys added', a);
}
