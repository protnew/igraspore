#!/usr/bin/env node
// v24 A1: генератор из i18n/languages.json (реестр) во все места, где раньше языки были прописаны руками.
// Идемпотентный. Запуск: node tools/gen_lang_registry.cjs  (build-www-release вызывает сам — после подключения туда).
// Пишет: config.js (LANGS, LANG_NAME), i18n_detect.js (IGS_ENABLED, applyLangFont-карта), i18n_hud.js (langNames),
//        fonts.generated.css (@font-face по полю font), android res/xml/locales_config.xml (только enabled).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const REG = JSON.parse(fs.readFileSync(path.join(ROOT, '.04-Src/i18n/languages.json'), 'utf8'));
const ON = REG.filter(l => l.enabled !== false);

function shortTag(l) {
  const n = (l.native || l.code).replace(/\(.*?\)/g, '').trim();
  if (/^[A-Za-z]/.test(n)) {
    const w = n.split(/\s+/).slice(0, 2).map(x => x.toUpperCase().slice(0, 3));
    return w.join(' ').slice(0, 6);
  }
  return n.replace(/\s+/g, '').slice(0, 3);
}
const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const json = o => JSON.stringify(o, null, 1).replace(/\n\s*/g, ' ');

function replaceLine(file, pattern, newLine) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  if (!pattern.test(s)) { console.error('НЕ НАЙДЕНО в ' + file + ': ' + pattern.source); process.exitCode = 1; return; }
  s = s.replace(pattern, newLine);
  fs.writeFileSync(p, s);
}

// 1. config.js: LANGS и LANG_NAME
const LANGS = 'var LANGS={' + ON.map(l => q(l.code) + ':' + q(shortTag(l))).join(',') + '}; // GEN:A1 — не править руками, генерирует tools/gen_lang_registry.cjs';
const LANG_NAME = 'var LANG_NAME={' + ON.map(l => q(l.code) + ':' + q(l.native)).join(',') + '}; // GEN:A1';
replaceLine('.04-Src/js/config.js', /^var LANGS=\{.*$/m, LANGS);
replaceLine('.04-Src/js/config.js', /^var LANG_NAME=\{.*$/m, LANG_NAME);

// 2. i18n_detect.js: IGS_ENABLED (обе копии: window.= и фолбэк) + applyLangFont карта
const EN = '  window.IGS_ENABLED = window.IGS_ENABLED || {' + ON.map(l => q(l.code) + ': 1').join(', ') + ' }; // GEN:A1';
replaceLine('.04-Src/js/i18n_detect.js', /^[ \t]*window\.IGS_ENABLED = window\.IGS_ENABLED \|\| \{.*$/m, EN);
const FONTMAP = {};
for (const l of ON) if (l.font && l.font !== 'system') FONTMAP[l.code] = l.font;
const fontLine = "var __IGS_FONTS = " + JSON.stringify(FONTMAP) + "; // GEN:A1\n  var face = __IGS_FONTS[code] || '';\n  var sample = (face && (LANG_NAME[code] || '')) ? (LANG_NAME[code] + '').trim().charAt(0) : '';";
// applyLangFont-карта: строковый патч тела функции (регексп на \u-эскейпах нестабилен)
{
  const p = path.join(ROOT, '.04-Src/js/i18n_detect.js');
  let s = fs.readFileSync(p, 'utf8');
  const i = s.indexOf('var __IGS_FONTS');
  if (i >= 0) {
    const end = s.indexOf('catch(function(){});', i);
    if (end > 0) {
      const newBody = fontLine + "\n  if (face && sample && document.fonts && document.fonts.load) document.fonts.load('16px \"' + face + '\"', sample).catch(function(){});";
      s = s.slice(0, i) + newBody + s.slice(end + 'catch(function(){});'.length);
      fs.writeFileSync(p, s);
    }
  }
}


// 3. i18n_hud.js: langNames — только enabled (без лишних zh/ar/pt)
const ln = 'window.langNames = {\n  ' + ON.map(l => q(l.code) + ': ' + q(l.native)).join(',\n  ') + '\n}; // GEN:A1 (реестр languages.json)';
replaceLine('.04-Src/js/i18n_hud.js', /window\.langNames = \{[\s\S]*?\};/, ln);

// 4. fonts.generated.css: @font-face для font!=system (файл .04-Src/fonts/NotoSans<Script>-Regular.woff2)
const SCRIPT_RANGE = { deva: 'U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20B9', beng: 'U+0980-09FE,U+0964-0965,U+200C-200D', thai: 'U+0E01-0E5B,U+200C-200D' };
let css = '/* GEN:A1 — @font-face из реестра (languages.json, поле font). Не править руками. */\n';
for (const l of ON) {
  if (!l.font || l.font === 'system') continue;
  const FILE_BY_FACE = { 'Noto Sans Bengali': 'NotoSansBengali-Regular.woff2', 'Noto Sans Devanagari': 'NotoSansDevanagari-Regular.woff2', 'Noto Sans Thai': 'NotoSansThai-Regular.woff2' }; // v24: имя файла по face, не по script-конвенции
  const file = FILE_BY_FACE[l.font];
  if (!file) { console.error('нет файла для face ' + l.font + ' (' + l.code + ') — добавь в FILE_BY_FACE'); return; }
  if (!fs.existsSync(path.join(ROOT, '.04-Src/fonts', file))) { console.error('шрифт не найден: ' + file + ' (' + l.code + ')'); continue; }
  css += '@font-face{font-family:"' + l.font + '";src:url("04-Src/fonts/' + file + '") format("woff2");font-weight:400;font-style:normal;font-display:swap' +
    (SCRIPT_RANGE[l.script.split('/')[0]] ? ';unicode-range:' + SCRIPT_RANGE[l.script.split('/')[0]] : '') + '}\n';
}
fs.writeFileSync(path.join(ROOT, '.04-Src/fonts.generated.css'), css);

// 5. locales_config.xml — только enabled (BCP-47 коды как в реестре)
const xml = '<?xml version="1.0" encoding="utf-8"?>\n<!-- GEN:A1 — только enabled из languages.json -->\n<locale-config xmlns:android="http://schemas.android.com/apk/res/android">\n' +
  ON.map(l => '    <locale android:name="' + l.code + '"/>').join('\n') + '\n</locale-config>\n';
fs.writeFileSync(path.join(ROOT, '06-DevOps-and-Release/android/android/app/src/main/res/xml/locales_config.xml'), xml);

console.log('GEN OK: языков ' + ON.length + ' (из ' + REG.length + ' в реестре); шрифты: ' + Object.keys(FONTMAP).join(',') || '-');
