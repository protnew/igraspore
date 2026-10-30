(function(){
  var extra={ru:window.IGS_HUD_RU||{}, en:window.IGS_HUD_EN||{}};

  ['ru','en'].forEach(function(lang){
    if(typeof T==='undefined') return;
    if(!T[lang]) T[lang]={};
    Object.keys(extra[lang]).forEach(function(k){ T[lang][k]=extra[lang][k]; });
  });
})();

// Native language names (endonyms — intentionally not translated)
window.langNames = {
  'en': 'English',
  'ru': 'Русский',
  'pt-BR': 'Português (Brasil)',
  'es': 'Español',
  'hi': 'हिन्दी',
  'id': 'Bahasa Indonesia',
  'tr': 'Türkçe',
  'de': 'Deutsch',
  'fr': 'Français',
  'ja': '日本語',
  'vi': 'Tiếng Việt',
  'ko': '한국어',
  'th': 'ไทย',
  'fil': 'Filipino',
  'it': 'Italiano',
  'pl': 'Polski',
  'uk': 'Українська',
  'zh-TW': '繁體中文',
  'ms': 'Bahasa Melayu',
  'bn': 'বাংলা'
}; // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json) // GEN:A1 (реестр languages.json)

if(typeof T!=='undefined'){ if(T.ru)T.ru['x.scaleBar']='Масштаб: 100 мкм'; if(T.en)T.en['x.scaleBar']='Scale: 100 µm'; }
