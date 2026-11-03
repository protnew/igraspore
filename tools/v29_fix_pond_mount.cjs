const fs = require('fs');
const p = '.04-Src/js/theme_engine.js';
let s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
const old = `function injectPondSwitcher() { var stack = document.getElementById('topRightStack'); if (!stack) return; if (!document.getElementById('themeSelPond')) { var wrap = document.createElement('div'); wrap.id = 'themePondBar'; wrap.innerHTML = buildSelectHtml('themeSelPond', 'pond', currentPond()); stack.insertBefore(wrap, stack.firstChild); } bindSelect(document.getElementById('themeSelPond')); applyThemePond(currentPond()); }`;
const neu = `function injectPondSwitcher() { if (!document.getElementById('themeSelPond')) { var wrap = document.createElement('div'); wrap.id = 'themePondBar'; wrap.setAttribute('data-theme-pond-bar','1'); wrap.innerHTML = buildSelectHtml('themeSelPond', 'pond', currentPond()); document.body.appendChild(wrap); } bindSelect(document.getElementById('themeSelPond')); applyThemePond(currentPond()); }`;
if (!s.includes(old)) {
  console.log('OLD not found, trying flexible replace');
  if (s.includes('function injectPondSwitcher()')) {
    s = s.replace(/function injectPondSwitcher\(\) \{[^]*?\n  function settingsRowsHtml/, neu + '\n  function settingsRowsHtml');
  }
} else {
  s = s.replace(old, neu);
}
fs.writeFileSync(p, s);
console.log('has body.append', s.includes("document.body.appendChild(wrap)"));
console.log('lines', s.split(/\n/).length);

// CSS for fixed pond bar
let css = fs.readFileSync('style-themes-v29.css', 'utf8').replace(/^\uFEFF/, '');
if (!css.includes('#themePondBar')) {
  css += [
    '',
    '#themePondBar{position:fixed;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));z-index:45;display:flex;flex-direction:column;gap:4px;pointer-events:auto;background:rgba(0,12,28,.72);padding:6px 8px;border-radius:10px;border:1px solid #1a3a55;}',
    'body.in-menu #themePondBar{display:none!important;}',
    '#themeBestiaryBar select,#themePondBar select,.theme-set-row select{min-height:48px;min-width:48px;}',
    ''
  ].join('\n');
  fs.writeFileSync('style-themes-v29.css', css);
  console.log('css updated');
} else {
  // ensure fixed rules present
  if (!css.includes('position:fixed')) {
    css += '\n#themePondBar{position:fixed;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));z-index:45;display:flex;background:rgba(0,12,28,.72);padding:6px 8px;border-radius:10px;}\nbody.in-menu #themePondBar{display:none!important;}\n';
    fs.writeFileSync('style-themes-v29.css', css);
  }
  console.log('css already had themePondBar');
}
