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
if (typeof window !== 'undefined') {
  window.detectLang = detectLang;
  window.IGS_ENABLED = window.IGS_ENABLED || { ru: 1, en: 1 };
  try {
    var saved = localStorage.getItem('igs_lang');
    if (saved && window.IGS_ENABLED[saved]) curLang = saved;
    else {
      var code = detectLang((navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'], Object.keys(window.IGS_ENABLED));
      curLang = code;
      localStorage.setItem('igs_lang', code);
      localStorage.setItem('igs_lang_auto', '1');
    }
  } catch (e) {}
}
if (typeof module !== 'undefined') module.exports = { detectLang: detectLang };
