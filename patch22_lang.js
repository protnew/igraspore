const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace old langB div with new custom dropdown
let newLangHTML = `
<div id="langSelWrap" tabindex="0">
  <div class="lang-curr"><span style="font-size:14px;margin-right:6px">🌐</span> <span id="curLangTxt">Русский</span> <span style="font-size:10px;margin-left:6px;opacity:0.7">▼</span></div>
  <div class="lang-drop" id="langSelDrop"></div>
</div>
`;
html = html.replace('<div id="langB" style="display:none"></div>', newLangHTML);

// Add beautiful CSS for lang selector
let css = `
#langSelWrap {
  position: absolute; top: 12px; left: 12px; z-index: 200;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  outline: none; user-select: none;
}
.lang-curr {
  background: rgba(10, 20, 35, 0.85); border: 1px solid #2a4055;
  color: #fff; border-radius: 6px; padding: 8px 14px; cursor: pointer;
  display: flex; align-items: center; font-size: 13px; font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4); backdrop-filter: blur(5px);
  transition: background 0.2s, border-color 0.2s;
}
.lang-curr:hover { background: rgba(15, 30, 50, 0.95); border-color: #4af; }
.lang-drop {
  position: absolute; top: 100%; left: 0; margin-top: 6px;
  background: rgba(10, 20, 35, 0.95); border: 1px solid #2a4055;
  border-radius: 6px; overflow: hidden; width: max-content; min-width: 130px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.6);
  opacity: 0; visibility: hidden; transform: translateY(-10px);
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  max-height: 400px; overflow-y: auto;
}
.lang-drop::-webkit-scrollbar { width: 6px; }
.lang-drop::-webkit-scrollbar-thumb { background: #2a4055; border-radius: 3px; }
#langSelWrap:focus-within .lang-drop, #langSelWrap:hover .lang-drop {
  opacity: 1; visibility: visible; transform: translateY(0);
}
.lang-item {
  padding: 10px 16px; color: #bcd; font-size: 13px; cursor: pointer;
  transition: background 0.15s, color 0.15s; border-bottom: 1px solid rgba(40, 60, 80, 0.3);
}
.lang-item:last-child { border-bottom: none; }
.lang-item:hover { background: rgba(30, 60, 90, 0.8); color: #fff; }
.lang-item.act { background: #1a4a6a; color: #4df; font-weight: bold; border-left: 3px solid #4df; padding-left: 13px; }
`;
html = html.replace('</style>', css + '\n</style>');
fs.writeFileSync('index.html', html);


let ui = fs.readFileSync('js/ui.js', 'utf8');

// Replace buildLangBar logic
let newBuildLangBar = `
var langNames = {
  ru: 'Русский', en: 'English', zh: '中文', es: 'Español', hi: 'हिन्दी', 
  ar: 'العربية', pt: 'Português', fr: 'Français', de: 'Deutsch', ja: '日本語', ko: '한국어'
};
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
`;

ui = ui.replace(/function buildLangBar\(\)[\s\S]*?\}\s*lb\.style\.display='flex';\s*\}/, newBuildLangBar);
fs.writeFileSync('js/ui.js', ui);

console.log('Premium Language Selector installed.');
