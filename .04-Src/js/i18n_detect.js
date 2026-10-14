function detectLang(navLangs, enabled) {
  var list = Array.isArray(navLangs) ? navLangs : [];
  var on = {};
  (enabled || ['en']).forEach(function(code){ on[code] = true; });
  function ok(code){ return on[code] ? code : ''; }
  for (var i = 0; i < list.length; i++) {
    var raw = String(list[i] || '').replace('_', '-');
    var low = raw.toLowerCase();
    if (!low) continue;
    if (ok(raw)) return raw;
    if (low === 'in' && ok('id')) return 'id';
    if (low === 'tl' && ok('fil')) return 'fil';
    if (low === 'pt-br' && ok('pt-BR')) return 'pt-BR';
    if (low.indexOf('pt') === 0 && ok('pt-BR')) return 'pt-BR';
    if (low.indexOf('es') === 0 && ok('es')) return 'es';
    if ((low === 'zh-tw' || low === 'zh-hk' || low.indexOf('zh-hant') === 0) && ok('zh-TW')) return 'zh-TW';
    if ((low === 'zh-cn' || low.indexOf('zh-hans') === 0 || low === 'zh') && ok('en')) return 'en';
    var base = low.split('-')[0];
    if (ok(base)) return base;
    if (base === 'en' && ok('en')) return 'en';
  }
  return ok('en') || 'en';
}
function applyLangFont(code) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code || 'en';
  var face = code === 'bn' ? 'Noto Sans Bengali' : code === 'hi' ? 'Noto Sans Devanagari' : code === 'th' ? 'Noto Sans Thai' : '';
  if (face && document.fonts && document.fonts.load) document.fonts.load('16px "' + face + '"').catch(function(){});
}
function loadLangPack(code) {
  if (typeof fetch !== 'function') return Promise.resolve(code);
  return fetch('i18n/' + code + '.json').then(function(r) {
    if (!r.ok) throw new Error(code);
    return r.json();
  }).then(function(obj) {
    if (typeof T !== 'undefined') {
      if (!T[code]) T[code] = {};
      Object.keys(obj).forEach(function(k) { T[code][k] = obj[k]; });
    }
    return code;
  });
}
if (typeof window !== 'undefined') {
  window.loadLangPack = loadLangPack;
  window.detectLang = detectLang;
  window.IGS_ENABLED = window.IGS_ENABLED || { ru: 1, en: 1, 'pt-BR': 1, id: 1, de: 1, fr: 1, hi: 1, ja: 1, vi: 1, ko: 1, th: 1, it: 1, pl: 1, uk: 1, 'zh-TW': 1, ms: 1, bn: 1 };
  try {
    var fromQuery = '';
    try { fromQuery = new URLSearchParams(location.search).get('lang') || ''; } catch (e1) {}
    if (fromQuery && window.IGS_ENABLED[fromQuery]) curLang = fromQuery;
    else {
      var saved = localStorage.getItem('igs_lang');
      if (saved && window.IGS_ENABLED[saved]) curLang = saved;
      else {
        var code = detectLang((navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'], Object.keys(window.IGS_ENABLED));
        curLang = code;
        localStorage.setItem('igs_lang', code);
        localStorage.setItem('igs_lang_auto', '1');
      }
    }
    applyLangFont(curLang);
    if (curLang !== 'ru' && curLang !== 'en') {
      loadLangPack(curLang).then(function() {
        applyLangFont(curLang);
        if (typeof buildLangBar === 'function') buildLangBar();
        if (typeof updateMenuTexts === 'function') updateMenuTexts();
      }).catch(function(){});
    }
  } catch (e) {}
}
if (typeof module !== 'undefined') module.exports = { detectLang: detectLang };
