(function(){
  var extra={
    ru:{
      'toast.cyst.enter':'Спора: защита, движение 0, энергия тратится медленно',
      'toast.cyst.exit':'Вышел из споры',
      'toast.cyst.hunger':'Голод: впал в цисту — найди еду и проснись',
      'toast.eat.plant':'Ты растение: плыви к свету',
      'toast.eat.none':'Рядом нет добычи — подплыви ближе',
      'toast.eat.closer':'Ближе к добыче',
      'toast.eat.ok':'Съел',
      'toast.divide.go':'Деление',
      'toast.divide.blocked':'Пока нельзя делиться',
      'toast.lang.fallback':'Язык не включён, показан английский',
      'hud.divide.reason.energy':'энергия {cur}/{need}',
      'hud.divide.reason.mass':'масса {cur}/{need}',
      'hud.divide.reason.size':'размер {cur}/{need}',
      'hud.divide.reason.cd':'перезарядка {sec} с',
      'hud.divide.reason.age':'слишком молода',
      'hud.divide.reason.busy':'идёт деление',
      'hud.divide.reason.none':'нет клетки',
      'hud.btn.eat':'ЕСТЬ','hud.btn.eat.short':'ЕСТЬ',
      'hud.btn.light':'СВЕТ','hud.btn.light.short':'СВЕТ',
      'hud.btn.divide':'ДЕЛИТЬ','hud.btn.divide.short':'ДЕЛИТЬ',
      'hud.btn.cyst':'СПОРА','hud.btn.cyst.short':'СПОРА',
      'hud.btn.auto':'АВТО','hud.btn.auto.short':'АВТО',
      'hud.btn.menu':'Меню',
      'hud.goal':'Поделись: {cur}/{need}'
    },
    en:{
      'toast.cyst.enter':'Spore: protected, speed 0, energy drains slowly',
      'toast.cyst.exit':'Left the spore',
      'toast.cyst.hunger':'Hunger: encysted — find food and wake',
      'toast.eat.plant':'You are a plant: swim toward the light',
      'toast.eat.none':'No prey nearby — swim closer',
      'toast.eat.closer':'Closer to prey',
      'toast.eat.ok':'Ate',
      'toast.divide.go':'Dividing',
      'toast.divide.blocked':'Cannot divide yet',
      'toast.lang.fallback':'Language is off, showing English',
      'hud.divide.reason.energy':'energy {cur}/{need}',
      'hud.divide.reason.mass':'mass {cur}/{need}',
      'hud.divide.reason.size':'size {cur}/{need}',
      'hud.divide.reason.cd':'cooldown {sec} s',
      'hud.divide.reason.age':'too young',
      'hud.divide.reason.busy':'dividing',
      'hud.divide.reason.none':'no cell',
      'hud.btn.eat':'EAT','hud.btn.eat.short':'EAT',
      'hud.btn.light':'LIGHT','hud.btn.light.short':'LIGHT',
      'hud.btn.divide':'SPLIT','hud.btn.divide.short':'SPLIT',
      'hud.btn.cyst':'SPORE','hud.btn.cyst.short':'SPORE',
      'hud.btn.auto':'AUTO','hud.btn.auto.short':'AUTO',
      'hud.btn.menu':'Menu',
      'hud.goal':'Divide: {cur}/{need}'
    }
  };
  ['ru','en'].forEach(function(lang){
    if(typeof T==='undefined') return;
    if(!T[lang]) T[lang]={};
    Object.keys(extra[lang]).forEach(function(k){ T[lang][k]=extra[lang][k]; });
  });
})();
