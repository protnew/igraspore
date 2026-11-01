const fs = require('fs');
const hr = JSON.parse(fs.readFileSync('.04-Src/i18n/hr.json', 'utf8'));
const bg = JSON.parse(fs.readFileSync('.04-Src/i18n/bg.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('.04-Src/i18n/en.json', 'utf8'));

// sr: bg-кириллица как база (близкий язык), hr-структура как карта ключей
const out = {};
for (const k in hr) out[k] = bg[k] || hr[k];
// Сербские прямые переводы
const srKeys = {
  'start':'ПОЧНИ', 'demo':'ДЕМО / Галерија', 'help':'УПУТСТВО ЗА ИГРУ', 'wiki':'ВИКИ',
  'aquarium':'АКВАРИЈУМ', 'resume':'НАСТАВИ', 'set':'ПОДЕШАВАЊА', 'settingsT':'Подешавања',
  'setLang':'Језик', 'menu':'МЕНИ', 'paused':'ПАУЗА', 'ready':'СПРЕМАН', 'restart':'РЕСТАРТ',
  'play':'Играј', 'next':'Следеће', 'skip':'Прескочи', 'exit':'Излаз',
  'exitAsk':'Излазити?', 'exitMsg':'Напредак овог живота ће бити изгубљен.',
  'yes':'Да', 'no':'Не', 'more':'Више', 'clear':'Обриши', 'close':'ЗАТВОРИ',
  'menuSub':'Симулација микроорганизама — {n} врста + вируси. Пресек бара.',
  'poolWill':'У бару: ~{n} организама · {kinds} врста',
  'diffE':'Лако', 'diffN':'Нормално', 'diffH':'Тешко',
  'all':'Све', 'filter':'Филтер', 'topOfList':'на врху списка',
  'colonies':'колоније', 'colonyBadge':'КОЛОНИЈА · гомила ћелија',
  'deadYours':'Твоја ћелија је умрла', 'aliveWord':'живих', 'deadOther':'Остало',
  'dStarve':'Изгладнео', 'dEaten':'Поједен', 'dTemp':'Температура',
  'dAge':'Старост', 'dLysis':'Лиза', 'dCull':'Регулација базена',
  'energy':'Енергија', 'eaten':'Поједен', 'fps':'ФПС', 'flight':'Лет', 'follow':'Прати',
  'light':'Светлост', 'legend':'Легенда', 'map':'Мапа', 'massWord':'Маса',
  'microscope':'Микроскоп', 'particles':'Честице', 'picMode':'Режим слике',
  'predation':'Грабљивци', 'rainy':'Киша', 'season0':'Пролеће', 'season1':'Лето',
  'season2':'Јесен', 'season3':'Зима', 'selectSp':'Изабери организам',
  'shadows':'Сенке', 'shown':'приказано', 'simSpeed':'Брзина', 'skip':'Прескочи',
  'speciesWord':'врста', 'swissNow':'Сада: Свисс. Клик за ВебГЛ.',
  'temp':'Температура', 'tutDone':'Упутство завршено', 'vignette':'Вињета',
  'virus':'Вируси', 'webglNow':'Сада: ВебГЛ вода. Клик за цртани.',
  'cartoon':'ЦРТАНИ', 'cartoonNow':'Сада: цртани. Клик за Свисс.',
  'freeCam':'Слободна камера', 'gameTime':'Време', 'healthBars':'Статусни бар',
  'errGeneric':'Грешка', 'errAsync':'Асинхрона грешка', 'loadingWorld':'Градим бар…',
  'economy':'Уштедни режим', 'economyAsk':'Испод 25 фпс. Уштедни режим у подешавањима: мање ознаке, базен −30%.',
  'camFlyTouch':'Слободна камера', 'roleOk':'Разумем — пливам',
  'roleWho':'Ко си / што једеш', 'roleFood':'Храна',
  'lb.title':'🏆 Лествица', 'kh.hide':'Сакриј дугмад', 'kh.keys':'Дугмад',
  'toast.divide.go':'Дели се', 'toast.divide.blocked':'Још не може да се подели',
  'toast.divided':'Подељено!', 'toast.digest':'Вари... ({s}s)',
  'toast.extinct':'Врста {name} изумрла!', 'toast.infected':'Ћелија заражена! Лиза за 10-20с',
  'toast.eat.ok':'Појео', 'toast.eat.closer':'Ближе плени',
  'toast.eat.none':'Нема плена близу — пливај ближе',
  'toast.eat.plant':'Ти си биљка: пливај ка светлости',
  'toast.lang.fallback':'Језик искључен, приказује се енглески',
  'toast.webglFail':'ВебГЛ недоступан — назад на цртани',
  'toast.parasite.gone':'Паразит одбачен', 'toast.microOff':'Микроскоп искључен',
  'hud.goal':'Деоба: {cur}/{need}', 'hud.genSep':' · Ген ',
  'hud.btn.auto':'АУТО', 'hud.btn.eat':'ЈЕДИ', 'hud.btn.divide':'ДЕОБА',
  'hud.btn.cyst':'СПОРА', 'hud.btn.light':'СВЕТЛО', 'hud.btn.menu':'Мени',
  'speciesShown.one':'{n} врста', 'speciesShown.few':'{n} врсте', 'speciesShown.other':'{n} врста',
  'coloniesCount.one':'{n} колонија', 'coloniesCount.few':'{n} колоније', 'coloniesCount.other':'{n} колонија',
  'aliveCount.one':'{n} жив', 'aliveCount.few':'{n} жива', 'aliveCount.other':'{n} живих',
  'wikiT':'Вики: Живот у бару', 'wiki.searchPh':'Претрага...',
  'edu.cell':'ћелија', 'edu.anatomy':'Анатомија',
  'x.cyst':'Циста', 'x.cyst2':' · ЦИСТА', 'x.dead':'Мртво', 'x.dividing':'Дели се',
  'x.division':'Деоба', 'x.alive':'Живи', 'x.born':'Рођено', 'x.you':'Ти',
  'x.yourCell':'Твоја ћелија', 'x.yourSpecies':'Твоја врста: ', 'x.food':'Храна',
  'x.foodScent':'Мирис хране', 'x.phages':'Фагови', 'x.predators':'Грабљивци',
  'x.starving':'Гладован', 'x.currentlyAlive':'Тренутно живи',
  'x.pondStatistics':'Статистика бара', 'x.nothingFound':'Ништа није нађено.',
  'virusMode':'Режим вируса: {name}. Клик на бактерију за зараза. WASD помера камеру.',
  'virusRate':'Учесталост вируса', 'microscope':'Микроскоп',
  'mic.scope':'МИКРОСКОП ×', 'midEaterTip':'Средњи једе: плива ка зеленилу или бактеријама. Трепље саме филтрирају.',
  'loc.drift':'ношење', 'loc.glide':'клизање', 'loc.flagella':'бичеви', 'loc.cilia':'трепље',
  'loc.ciliaStalk':'трепље на стабљици', 'loc.pseudopodia':'псеудоподие', 'loc.sessile':'приседнуло',
  'loc.budding':'пупање', 'loc.growth':'раст'
};
for (const k in srKeys) out[k] = srKeys[k];
for (const k in en) if (!(k in out)) out[k] = en[k];
fs.writeFileSync('.04-Src/i18n/sr.json', JSON.stringify(out, null, 2) + '\n');
console.log('sr:', Object.keys(out).length, 'ключей; miss:', Object.keys(en).filter(k=>!(k in out)).length);
