function detectLang(navLangs, enabled) {
  // v24 A1: автовыбор по таблице ТЗ (первый включённый в цепочке)
  var list = Array.isArray(navLangs) ? navLangs : [];
  var on = {};
  (enabled || ['en']).forEach(function(code){ on[code] = true; });
  function ok(code){ return on[code] ? code : ''; }
  for (var i = 0; i < list.length; i++) {
    var raw = String(list[i] || '').replace('_', '-');
    var low = raw.toLowerCase();
    if (!low) continue;
    var base = low.split('-')[0];
    // цепочки
    var chain;
    if (low === 'zh-cn' || low === 'zh-sg' || low.indexOf('zh-hans') === 0 || low === 'zh') chain = ['zh-CN']
    else if (low === 'zh-tw' || low === 'zh-hk' || low === 'zh-mo' || low.indexOf('zh-hant') === 0) chain = ['zh-TW'];
    else if (low === 'pt-pt' || low === 'pt-ao' || low === 'pt-mz') chain = ['pt-PT', 'pt-BR'];
    else if (base === 'pt') chain = ['pt-BR'];
    else if (low === 'es-es' || low === 'es') chain = ['es'];
    else if (base === 'es') chain = ['es-419', 'es'];
    else if (base === 'nb' || base === 'nn' || base === 'no') chain = ['no'];
    else if (base === 'iw' || base === 'he') chain = ['he'];
    else if (base === 'in') chain = ['id'];
    else if (base === 'tl') chain = ['fil'];
    else if (base === 'sr') chain = ['sr'];
    else chain = [raw, base];
    for (var c = 0; c < chain.length; c++) if (ok(chain[c])) return chain[c];
  }
  return ok('en') || 'en';
}
function applyLangFont(code) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code || 'en';
  var __IGS_FONTS = {"hi":"Noto Sans Devanagari","th":"Noto Sans Thai","bn":"Noto Sans Bengali","ta":"Noto Sans Tamil","te":"Noto Sans Telugu","mr":"Noto Sans Devanagari","gu":"Noto Sans Gujarati","kn":"Noto Sans Kannada","ml":"Noto Sans Malayalam","ne":"Noto Sans Devanagari","si":"Noto Sans Sinhala","my":"Noto Sans Myanmar","he":"Noto Sans Hebrew","km":"Noto Sans Khmer","lo":"Noto Sans Lao","am":"Noto Sans Ethiopic","hy":"Noto Sans Armenian","ka":"Noto Sans Georgian","as":"Noto Sans Bengali","or":"Noto Sans Oriya","bo":"Noto Sans Tibetan","dz":"Noto Sans Tibetan","ti":"Noto Sans Ethiopic"}; // GEN:A1
  var __IGS_DIR = {"ar":"rtl","fa":"rtl","ur":"rtl","he":"rtl","ps":"rtl","ckb":"rtl","sd":"rtl"}; // GEN:A1 (v25 A4)
  var face = __IGS_FONTS[code] || '';
  var sample = (face && (LANG_NAME[code] || '')) ? (LANG_NAME[code] + '').trim().charAt(0) : '';
  var _dir = __IGS_DIR[code] || 'ltr';
  document.documentElement.setAttribute('dir', _dir);
  if (document.body) document.body.classList.toggle('igs-rtl', _dir === 'rtl');
  if (face && sample && document.fonts && document.fonts.load) document.fonts.load('16px "' + face + '"', sample).catch(function(){});
}
// QA-only gate (U39): forcing a disabled language is allowed on the local QA stand or
// when ?qa=1 is present. Off-QA the stored igs_force_lang is ignored, so production
// users can never switch to a disabled language. Pure for unit testing.
function forceLangAllowed(hostname, search) {
  var host = String(hostname || '');
  var qa = '';
  try { qa = new URLSearchParams(String(search || '')).get('qa') || ''; } catch (e) {}
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1' || qa === '1';
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
  window.IGS_ENABLED = window.IGS_ENABLED || {'en': 1, 'ru': 1, 'pt-BR': 1, 'es': 1, 'hi': 1, 'id': 1, 'tr': 1, 'de': 1, 'fr': 1, 'ja': 1, 'vi': 1, 'ko': 1, 'th': 1, 'fil': 1, 'it': 1, 'pl': 1, 'uk': 1, 'zh-TW': 1, 'ms': 1, 'bn': 1, 'nl': 1, 'sv': 1, 'ro': 1, 'el': 1, 'hu': 1, 'cs': 1, 'da': 1, 'fi': 1, 'zh-CN': 1, 'no': 1, 'pt-PT': 1, 'es-419': 1, 'hr': 1, 'sr': 1, 'lt': 1, 'lv': 1, 'et': 1, 'sl': 1, 'ta': 1, 'te': 1, 'mr': 1, 'gu': 1, 'kn': 1, 'ml': 1, 'ne': 1, 'si': 1, 'my': 1, 'ar': 1, 'fa': 1, 'ur': 1, 'he': 1, 'sw': 1, 'kk': 1, 'be': 1, 'az': 1, 'ky': 1, 'mn': 1, 'ca': 1, 'gl': 1, 'eu': 1, 'sq': 1, 'mk': 1, 'is': 1, 'af': 1, 'zu': 1, 'km': 1, 'lo': 1, 'am': 1, 'hy': 1, 'ka': 1, 'uz': 1, 'tg': 1, 'ps': 1, 'ckb': 1, 'sd': 1, 'as': 1, 'or': 1, 'bs': 1, 'mt': 1, 'ha': 1, 'yo': 1, 'ig': 1, 'so': 1, 'rw': 1, 'sn': 1, 'ga': 1, 'cy': 1, 'ht': 1, 'qu': 1, 'lb': 1, 'fo': 1, 'jv': 1, 'su': 1, 'mi': 1, 'bo': 1, 'dz': 1, 'ti': 1, 'bg': 1, 'sk': 1, 'pa': 1 }; // GEN:A1
  // Dev/QA hook (L.9 screenshots): force a language that is NOT in the enabled set
  // without editing languages.json / LANGS / localeConfig. QA-only (U39): honoured
  // solely on the localhost QA stand or with ?qa=1; elsewhere igs_force_lang is ignored.
  try {
    var _allowForce = forceLangAllowed(location.hostname, location.search);
    var forced = _allowForce ? localStorage.getItem('igs_force_lang') : '';
    if (forced) { try { window.IGS_ENABLED[forced] = 1; } catch (e2) {} }
    window.__igsForceLang = _allowForce
      ? function (code) {
          try { localStorage.setItem('igs_force_lang', code); localStorage.setItem('igs_lang', code); } catch (e3) {}
          try { window.IGS_ENABLED[code] = 1; } catch (e4) {}
          location.reload();
        }
      : function () { /* no-op off the QA stand */ };
    window.__igsClearForce = function () { try { localStorage.removeItem('igs_force_lang'); } catch (e5) {} };
  } catch (e6) {}
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
    if (typeof GENDERED_SP!=='undefined') GENDERED_SP.name = tt('sp.1001');
    { // v24 A2: en/ru грузятся из JSON как остальные (единственный источник — i18n/*.json)
      // v28 T4a Д8a: en-fallback — грузим en + curLang параллельно (guard при curLang='en')
      var loadPromises = (curLang === 'en') ? [loadLangPack('en')] : [loadLangPack('en'), loadLangPack(curLang)];
      Promise.all(loadPromises).then(function() {
        window.__igsLangReady = 1; // в26 Д8: с этого момента tt() вправе считать ключ отсутствующим
        applyLangFont(curLang);
        if (typeof buildLangBar === 'function') buildLangBar();
        if (typeof updateMenuTexts === 'function') updateMenuTexts();
        if (typeof GENDERED_SP!=='undefined') GENDERED_SP.name = tt('sp.1001');
      }).catch(function(){ window.__igsLangReady = 1; });
    }
  } catch (e) {}
}
if (typeof module !== 'undefined') module.exports = { detectLang: detectLang, forceLangAllowed: forceLangAllowed };
