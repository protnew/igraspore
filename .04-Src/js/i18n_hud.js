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
  ru: 'Русский', en: 'English', 'pt-BR': 'Português (Brasil)', id: 'Bahasa Indonesia',
  de: 'Deutsch', fr: 'Français', hi: 'हिन्दी', ja: '日本語', vi: 'Tiếng Việt',
  ko: '한국어', th: 'ไทย', it: 'Italiano', pl: 'Polski', uk: 'Українська',
  'zh-TW': '繁體中文', ms: 'Bahasa Melayu', bn: 'বাংলা',
  zh: '中文', es: 'Español', tr: 'Türkçe', fil: 'Filipino', ar: 'العربية', pt: 'Português'
};

if(typeof T!=='undefined'){ if(T.ru)T.ru['x.scaleBar']='Масштаб: 100 мкм'; if(T.en)T.en['x.scaleBar']='Scale: 100 µm'; }
