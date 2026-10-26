function hslToHex(h,s,l){l/=100;var a=s*Math.min(l,1-l)/100;var f=function(n){var k=(n+h/30)%12;var color=l-a*Math.max(Math.min(k-3,9-k,1),-1);var hex=Math.round(255*color).toString(16);if(hex.length<2)hex='0'+hex;return hex;};return '#'+f(0)+f(8)+f(4);}
"use strict";
var LANGS={ru:'\u0420\u0443',en:'EN','pt-BR':'PT',id:'ID',de:'DE',fr:'FR',hi:'Hi',ja:'\u65e5',vi:'VI',ko:'KO',th:'TH',it:'IT',pl:'PL',uk:'UK','zh-TW':'ZH',ms:'MS',bn:'BN',es:'ES',tr:'TR',fil:'FIL'};
var LANG_NAME={ru:'Русский',en:'English','pt-BR':'Português',id:'Indonesia',de:'Deutsch',fr:'Français',hi:'हिन्दी',ja:'日本語',vi:'Tiếng Việt',ko:'한국어',th:'ไทย',it:'Italiano',pl:'Polski',uk:'Українська','zh-TW':'繁體中文',ms:'Bahasa Melayu',bn:'বাংলা',es:'Español',tr:'Türkçe',fil:'Filipino'};
var curLang='ru',T={};
T.ru={menuSub:'\u0421\u0438\u043c\u0443\u043b\u044f\u0446\u0438\u044f \u043c\u0438\u043a\u0440\u043e\u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c\u043e\u0432 \u2014 100 \u0432\u0438\u0434\u043e\u0432 + \u0432\u0438\u0440\u0443\u0441\u044b. \u0420\u0430\u0437\u0440\u0435\u0437 \u0432\u043e\u0434\u043e\u0451\u043c\u0430 \u0441\u0431\u043e\u043a\u0443.',start:'\u041d\u0410\u0427\u0410\u0422\u042c',help:'\u041a\u0410\u041a \u0418\u0413\u0420\u0410\u0422\u042c',set:'\u041d\u0410\u0421\u0422\u0420\u041e\u0419\u041a\u0418',wiki:'\u0412\u0418\u041a\u0418',diffE:'\u041b\u0451\u0433\u043a\u0438\u0439',diffN:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',diffH:'\u0421\u043b\u043e\u0436\u043d\u044b\u0439',all:'\u0412\u0441\u0435',producer:'Зелёные (корм)',consumer1:'Мелкие едоки',consumer2:'Средние едоки',consumer3:'Крупные охотники',decomposer:'Уборщики (грибки)',virus:'\u0412\u0438\u0440\u0443\u0441\u044b',paused:'\u041f\u0410\u0423\u0417\u0410',resume:'\u041f\u0420\u041e\u0414\u041e\u041b\u0416\u0418\u0422\u042c',dead:'\u0412\u042b\u041c\u0418\u0420\u0410\u041d\u0418\u0415',restart:'\u0417\u0410\u041d\u041e\u0412\u041e',menu:'\u0412 \u041c\u0415\u041d\u042e',close:'\u0417\u0410\u041a\u0420\u042b\u0422\u042c',energy:'\u042d\u043d\u0435\u0440\u0433\u0438\u044f',age:'\u0412\u043e\u0437\u0440\u0430\u0441\u0442',eaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',divs:'\u0414\u0435\u043b\u0435\u043d\u0438\u0439',pop:'\u041f\u043e\u043f-\u0446\u0438\u044f',fps:'FPS',light:'\u0421\u0432\u0435\u0442',temp:'\u0422\u00b0',days:'\u0414\u043d\u0435\u0439',selectSp:'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c',autoOn:'\u0410\u0412\u0422\u041e',season0:'\u0412\u0435\u0441\u043d\u0430',season1:'\u041b\u0435\u0442\u043e',season2:'\u041e\u0441\u0435\u043d\u044c',season3:'\u0417\u0438\u043c\u0430',clear:'\u042f\u0441\u043d\u043e',rainy:'\u0414\u043e\u0436\u0434\u044c',gameTime:'\u0412\u0440\u0435\u043c\u044f',maxPop:'\u041c\u0430\u043a\u0441. \u043f\u043e\u043f',offspring:'\u041f\u043e\u0442\u043e\u043c\u043a\u043e\u0432',dStarve:'\u0413\u043e\u043b\u043e\u0434',dEaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',dTemp:'\u0422\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u0430',dAge:'\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c',dLysis:'\u041b\u0438\u0437\u0438\u0441',dCauses:'\u041f\u0440\u0438\u0447\u0438\u043d\u044b \u0433\u0438\u0431\u0435\u043b\u0438',settingsT:'\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438',particles:'\u0427\u0430\u0441\u0442\u0438\u0446\u044b',bubbles:'\u041f\u0443\u0437\u044b\u0440\u044c\u043a\u0438',currents:'\u0422\u0435\u0447\u0435\u043d\u0438\u044f',vignette:'\u0412\u0438\u043d\u044c\u0435\u0442\u043a\u0430',healthBars:'\u0428\u043a\u0430\u043b\u044b \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f',shadows:'\u0422\u0435\u043d\u0438',freeCam:'\u0421\u0432\u043e\u0431. \u043a\u0430\u043c\u0435\u0440\u0430',density:'\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c',lightInt:'\u0418\u043d\u0442. \u0441\u0432\u0435\u0442\u0430',virusRate:'\u0427\u0430\u0441\u0442\u043e\u0442\u0430 \u0432\u0438\u0440\u0443\u0441\u043e\u0432',wikiT:'\u0412\u0438\u043a\u0438: \u0436\u0438\u0442\u0435\u043b\u0438 \u043b\u0443\u0436\u0438',simSpeed:'\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c',predation:'\u0425\u0438\u0449\u043d\u0438\u043a\u0438',divRate:'\u0420\u0430\u0437\u043c\u043d\u043e\u0436\u0435\u043d\u0438\u0435',legend:'\u041b\u0435\u0433\u0435\u043d\u0434\u0430',camFly:'\u041f\u043e\u043b\u0451\u0442 \u043a\u0430\u043c\u0435\u0440\u044b',mapChart:'\u041a\u0430\u0440\u0442\u0430 \u0438 \u0433\u0440\u0430\u0444\u0438\u043a',microscope:'\u041c\u0438\u043a\u0440\u043e\u0441\u043a\u043e\u043f',picMode:'\u0420\u0435\u0436\u0438\u043c \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0438',exit:'\u0412\u044b\u0445\u043e\u0434',poolWill:'\u0412 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0435 \u0431\u0443\u0434\u0435\u0442: ~{n} \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c\u043e\u0432 \u00b7 {kinds} \u0432\u0438\u0434\u043e\u0432',demo:'\u0414\u0415\u041c\u041e / \u0413\u0430\u043b\u0435\u0440\u0435\u044f',aquarium:'\u0410\u041a\u0412\u0410\u0420\u0418\u0423\u041c',filter:'\u0424\u0438\u043b\u044c\u0442\u0440',shown:'\u043f\u043e\u043a\u0430\u0437\u0430\u043d\u043e',speciesWord:'\u0432\u0438\u0434\u043e\u0432',colonies:'\u043a\u043e\u043b\u043e\u043d\u0438\u0439',topOfList:'\u0432\u0432\u0435\u0440\u0445\u0443 \u0441\u043f\u0438\u0441\u043a\u0430',filterHint:'\u043d\u0430\u0436\u043c\u0438 \u0434\u0440\u0443\u0433\u0443\u044e \u043a\u043d\u043e\u043f\u043a\u0443 \u0447\u0442\u043e\u0431\u044b \u0441\u043c\u0435\u043d\u0438\u0442\u044c',colonyBadge:'\u041a\u041e\u041b\u041e\u041d\u0418\u042f \u00b7 \u043a\u0443\u0447\u0430 \u043a\u043b\u0435\u0442\u043e\u043a',eatsLight:'\u0435\u0441\u0442 \u0441\u0432\u0435\u0442',eatsDead:'\u0435\u0441\u0442 \u043c\u0451\u0440\u0442\u0432\u043e\u0435',eats:'\u0435\u0441\u0442',map:'\u041a\u0430\u0440\u0442\u0430',noSpecies:'\u041d\u0435\u0442 \u0432\u0438\u0434\u043e\u0432 \u0432 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438 \u00ab{cat}\u00bb. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0412\u0441\u0435\u00bb.',massWord:'\u041c\u0430\u0441\u0441\u0430',ready:'\u0413\u041e\u0422\u041e\u0412\u041e',skip:'\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c',next:'\u0414\u0430\u043b\u0435\u0435',autoPilotOn:'\u0410\u0412\u0422\u041e-\u041f\u0418\u041b\u041e\u0422 \u0412\u041a\u041b',roleWho:'\u0422\u044b \u043a\u0442\u043e / \u043a\u043e\u0433\u043e \u0435\u0448\u044c',roleFood:'\u0415\u0434\u0430',roleHint:'\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430: \u0435\u0434\u0430 \u043f\u043e\u0434\u0441\u0432\u0435\u0447\u0435\u043d\u0430 \u0446\u0432\u0435\u0442\u043d\u044b\u043c \u043a\u043e\u043b\u044c\u0446\u043e\u043c. \u041f\u043e\u043b\u043e\u0441\u043a\u0430 \u00ab\u0417\u0430\u043f\u0430\u0445 \u0435\u0434\u044b\u00bb \u0441\u043f\u0440\u0430\u0432\u0430 \u0432\u0432\u0435\u0440\u0445\u0443.',roleOk:'\u041f\u043e\u043d\u044f\u0442\u043d\u043e \u2014 \u043f\u043b\u044b\u0432\u0443',dnaTitle:'\u041c\u0443\u0442\u0430\u0446\u0438\u0438 \u0414\u041d\u041a',dnaPoints:'\u041e\u0447\u043a\u0438 \u043c\u0443\u0442\u0430\u0446\u0438\u0438:',dnaSpeed:'\u0423\u0441\u043a\u043e\u0440\u0435\u043d\u0438\u0435 \u0436\u0433\u0443\u0442\u0438\u043a\u043e\u0432 (5 \u0414\u041d\u041a)',dnaSize:'\u0423\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u0435 \u043c\u0430\u0441\u0441\u044b (8 \u0414\u041d\u041a)',dnaSpikes:'\u041e\u0442\u0440\u0430\u0441\u0442\u0438\u0442\u044c \u0448\u0438\u043f\u044b (15 \u0414\u041d\u041a)',dnaShell:'\u041a\u0440\u0435\u043c\u043d\u0438\u0435\u0432\u044b\u0439 \u043f\u0430\u043d\u0446\u0438\u0440\u044c (20 \u0414\u041d\u041a)',play:'\u0418\u0433\u0440\u0430\u0442\u044c',tutDone:'\u0422\u0443\u0442\u043e\u0440\u0438\u0430\u043b \u043f\u0440\u043e\u0439\u0434\u0435\u043d',colonyKind:'\u041a\u043e\u043b\u043e\u043d\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0432\u0438\u0434',flight:'\u041f\u043e\u043b\u0451\u0442',cartoon:'\u041c\u0423\u041b\u042c\u0422',cartoonNow:'\u0421\u0435\u0439\u0447\u0430\u0441: \u043c\u0443\u043b\u044c\u0442\u044f\u0448\u043d\u044b\u0439. \u041a\u043b\u0438\u043a \u2192 SwissBioPics.',webglNow:'\u0421\u0435\u0439\u0447\u0430\u0441: WebGL-\u0432\u043e\u0434\u0430. \u041a\u043b\u0438\u043a \u2192 \u043c\u0443\u043b\u044c\u0442\u044f\u0448\u043d\u044b\u0439.',swissNow:'\u0421\u0435\u0439\u0447\u0430\u0441: SwissBioPics. \u041a\u043b\u0438\u043a \u2192 WebGL.',mapTip:'\u041c\u0438\u043d\u0438\u043a\u0430\u0440\u0442\u0430 \u2014 \u0433\u0434\u0435 \u0432\u044b \u0432 \u043f\u0440\u0443\u0434\u0443. \u041a\u043b\u0438\u043a = \u043f\u0440\u044b\u0436\u043e\u043a \u043a\u0430\u043c\u0435\u0440\u044b.',popTip:'\u0413\u0440\u0430\u0444\u0438\u043a \u043f\u043e\u043f\u0443\u043b\u044f\u0446\u0438\u0438 \u2014 \u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043c\u0438\u043a\u0440\u043e\u0431\u043e\u0432 \u0432\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0438.',follow:'\u0421\u043b\u0435\u0434\u0438\u0442\u044c',midEaterTip:'\u0421\u0440\u0435\u0434\u043d\u0438\u0439 \u0435\u0434\u043e\u043a: \u043f\u043e\u0434\u043f\u043b\u044b\u0432\u0438 \u043a \u0437\u0435\u043b\u0451\u043d\u044b\u043c/\u0431\u0430\u043a\u0442\u0435\u0440\u0438\u044f\u043c \u2014 \u0440\u0435\u0441\u043d\u0438\u0447\u043a\u0438 \u0444\u0438\u043b\u044c\u0442\u0440\u0443\u044e\u0442 \u0441\u0430\u043c\u0438.',virusMode:'\u0420\u0435\u0436\u0438\u043c \u0432\u0438\u0440\u0443\u0441\u0430: {name}. \u041a\u043b\u0438\u043a\u043d\u0438 \u043f\u043e \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438 = \u0438\u043d\u0444\u0438\u0446\u0438\u0440\u043e\u0432\u0430\u0442\u044c. WASD = \u043a\u0430\u043c\u0435\u0440\u0430.','sp.999':'Макрофаг (Иммунитет)','sp.1000':'Губка (фильтратор)','sp.1001':'Половая эукариота','loc.drift':'дрейф','loc.glide':'скользящий','loc.flagella':'жгутики','loc.cilia':'реснички','loc.ciliaStalk':'реснички на стебельке','loc.pseudopodia':'псевдоподии','loc.sessile':'прикреплённый','loc.budding':'почкование','loc.growth':'рост'};
T.en={menuSub:'Microorganism Simulation — 100 species + viruses. Pond cross-section view.',start:'START',help:'HOW TO PLAY',set:'SETTINGS',wiki:'WIKI',diffE:'Easy',diffN:'Normal',diffH:'Hard',all:'All',producer:'Greens (food)',consumer1:'Small eaters',consumer2:'Mid eaters',consumer3:'Big hunters',decomposer:'Cleaners (fungi)',virus:'Viruses',paused:'PAUSED',resume:'RESUME',dead:'EXTINCT',restart:'RESTART',menu:'MENU',close:'CLOSE',energy:'Energy',age:'Age',eaten:'Eaten',divs:'Divisions',pop:'Pop',fps:'FPS',light:'Light',temp:'Temp',days:'Days',selectSp:'Select organism',autoOn:'AUTO',season0:'Spring',season1:'Summer',season2:'Autumn',season3:'Winter',clear:'Clear',rainy:'Rain',gameTime:'Time',maxPop:'Max Pop',offspring:'Offspring',dStarve:'Starved',dEaten:'Eaten',dTemp:'Temp',dAge:'Old age',dLysis:'Lysis',dCauses:'Death Causes',settingsT:'Settings',particles:'Particles',bubbles:'Bubbles',currents:'Currents',vignette:'Vignette',healthBars:'Health Bars',shadows:'Shadows',freeCam:'Free Cam',density:'Density',lightInt:'Light Intensity',virusRate:'Virus Rate',wikiT:'Wiki: Pond Life',simSpeed:'Speed',predation:'Predators',divRate:'Reproduction',legend:'Legend',camFly:'Camera flight',mapChart:'Map and chart',microscope:'Microscope',picMode:'Picture mode',exit:'Exit',poolWill:'Pool will have: ~{n} organisms · {kinds} species',demo:'DEMO / Gallery',aquarium:'AQUARIUM',filter:'Filter',shown:'shown',speciesWord:'species',colonies:'colonies',topOfList:'top of the list',filterHint:'tap another button to switch',colonyBadge:'COLONY · clump of cells',eatsLight:'eats light',eatsDead:'eats dead matter',eats:'eats',map:'Map',noSpecies:'No species in "{cat}". Tap All.',massWord:'Mass',ready:'READY',skip:'Skip',next:'Next',autoPilotOn:'AUTO ON',roleWho:'Who you are / what you eat',roleFood:'Food',roleHint:'Hint: food is marked with a colored ring. The food-scent bar is at the top right.',roleOk:"Got it — I'll swim",dnaTitle:'DNA mutations',dnaPoints:'Mutation points:',dnaSpeed:'Faster flagella (5 DNA)',dnaSize:'More mass (8 DNA)',dnaSpikes:'Grow spikes (15 DNA)',dnaShell:'Silica shell (20 DNA)',play:'Play',tutDone:'Tutorial done',colonyKind:'Colony species',flight:'Flight',cartoon:'CARTOON',cartoonNow:'Now: cartoon. Click for Swiss.',webglNow:'Now: WebGL water. Click for cartoon.',swissNow:'Now: Swiss. Click for WebGL.',mapTip:'Minimap: where you are in the pond. Click jumps the camera.',popTip:'Population chart: how many microbes over time.',follow:'Follow',midEaterTip:'Mid eater: swim to greens or bacteria. Cilia filter on their own.',virusMode:'Virus mode: {name}. Click a bacterium to infect. WASD moves the camera.','sp.999':'Macrophage (Immunity)','sp.1000':'Sponge (Filter Feeder)','sp.1001':'Sexual Eukaryote','loc.drift':'drift','loc.glide':'glide','loc.flagella':'flagella','loc.cilia':'cilia','loc.ciliaStalk':'cilia on stalk','loc.pseudopodia':'pseudopodia','loc.sessile':'sessile','loc.budding':'budding','loc.growth':'growth'};
T.en.exitAsk='Exit?';T.en.exitMsg='Progress of this life will be lost.';T.en.yes='Yes';T.en.no='No';T.en.more='More';T.en.deadYours='Your cell died';T.en.aliveWord='alive';T.en.deadOther='Other';T.en.helpTouch='<p><b>Controls:</b> Drag the joystick to swim. Tap the water to aim. Bottom buttons: Eat, Divide, Spore, Auto. Pinch to zoom.</p>';T.en.setLang='Language';
T.en.loadingWorld='Building the pond…';T.en.economy='Economy mode';T.en.economyAsk='Frame rate is under 25. Economy mode is in Settings: fewer captions, pool −30%.';T.en.demoTipTouch='<b>DEMO</b> · drag to fly · 1–6 jump group · tap a cell to enter<br>';T.en.camFlyTouch='Free cam';
T.ru.exitAsk='Выйти?';T.ru.exitMsg='Прогресс этой жизни будет потерян.';T.ru.yes='Да';T.ru.no='Нет';T.ru.more='Ещё';T.ru.deadYours='Ваша клетка погибла';T.ru.aliveWord='живых';T.ru.deadOther='Прочее';T.ru.helpTouch='<p><b>Управление:</b> Джойстик — плыть. Касание воды — направление. Нижние кнопки: есть, делиться, спора, авто. Щипок — масштаб.</p>';T.ru.setLang='Язык';
T.ru.loadingWorld='Собираем пруд…';T.ru.economy='Экономный режим';T.ru.economyAsk='Кадров меньше 25. Экономный режим — в настройках: меньше подписей, бассейн −30%.';T.ru.demoTipTouch='<b>ДЕМО</b> · палец двигает камеру · 1–6 группа · касание клетки — войти<br>';T.ru.camFlyTouch='Свободная камера';

// v20.7: строки быстрого старта/эконом-режима — inline (es/tr/fil — английский фоллбек по D11,
// словари этих языков заморожены; аналитику — пакет tools/v20_7_i18n_keys.mjs)
if(!T['pt-BR'])T['pt-BR']={};T['pt-BR'].loadingWorld="Montando o lago…";T['pt-BR'].economy="Modo econômico";T['pt-BR'].economyAsk="Menos de 25 quadros. O modo econômico está nos ajustes: menos legendas, lago −30%.";T['pt-BR'].demoTipTouch="<b>DEMO</b> · arraste para voar · 1–6 muda o grupo · toque numa célula para entrar<br>";T['pt-BR'].camFlyTouch="Câmera livre";
if(!T['id'])T['id']={};T['id'].loadingWorld="Menyusun kolam…";T['id'].economy="Mode hemat";T['id'].economyAsk="Kurang dari 25 gambar. Mode hemat ada di pengaturan: lebih sedikit tulisan, kolam −30%.";T['id'].demoTipTouch="<b>DEMO</b> · geser untuk terbang · 1–6 pindah kelompok · ketuk sel untuk masuk<br>";T['id'].camFlyTouch="Kamera bebas";
if(!T['de'])T['de']={};T['de'].loadingWorld="Der Teich wird aufgebaut…";T['de'].economy="Sparmodus";T['de'].economyAsk="Unter 25 Bildern. Der Sparmodus steht in den Einstellungen: weniger Beschriftungen, Teich −30 %.";T['de'].demoTipTouch="<b>DEMO</b> · ziehen zum Fliegen · 1–6 wechselt die Gruppe · Zelle antippen zum Betreten<br>";T['de'].camFlyTouch="Freie Kamera";
if(!T['fr'])T['fr']={};T['fr'].loadingWorld="Le bassin se construit…";T['fr'].economy="Mode économe";T['fr'].economyAsk="Moins de 25 images. Le mode économe est dans les réglages : moins de légendes, bassin −30 %.";T['fr'].demoTipTouch="<b>DÉMO</b> · glisser pour voler · 1–6 change de groupe · toucher une cellule pour entrer<br>";T['fr'].camFlyTouch="Caméra libre";
if(!T['hi'])T['hi']={};T['hi'].loadingWorld="तालाब बन रहा है…";T['hi'].economy="किफायती मोड";T['hi'].economyAsk="25 से कम चित्र। किफायती मोड सेटिंग में है: कम लेख, तालाब −30%.";T['hi'].demoTipTouch="<b>डेमो</b> · उड़ने के लिए खींचें · 1–6 समूह · कोशिका छूकर अंदर जाएँ<br>";T['hi'].camFlyTouch="मुक्त कैमरा";
if(!T['ja'])T['ja']={};T['ja'].loadingWorld="池を作っています…";T['ja'].economy="節約モード";T['ja'].economyAsk="25フレーム未満です。節約モードは設定にあります。表示を減らし、池は−30%。";T['ja'].demoTipTouch="<b>デモ</b> · ドラッグで飛ぶ · 1–6でグループ · 細胞をタップして入る<br>";T['ja'].camFlyTouch="自由カメラ";
if(!T['vi'])T['vi']={};T['vi'].loadingWorld="Đang dựng ao…";T['vi'].economy="Chế độ tiết kiệm";T['vi'].economyAsk="Dưới 25 khung hình. Chế độ tiết kiệm nằm trong cài đặt: ít chữ hơn, ao −30%.";T['vi'].demoTipTouch="<b>DEMO</b> · kéo để bay · 1–6 đổi nhóm · chạm tế bào để vào<br>";T['vi'].camFlyTouch="Camera tự do";
if(!T['ko'])T['ko']={};T['ko'].loadingWorld="연못을 만드는 중…";T['ko'].economy="절약 모드";T['ko'].economyAsk="25프레임 미만입니다. 절약 모드는 설정에 있습니다. 글자를 줄이고 연못은 −30%.";T['ko'].demoTipTouch="<b>데모</b> · 끌어 날기 · 1–6 무리 이동 · 세포를 눌러 들어가기<br>";T['ko'].camFlyTouch="자유 카메라";
if(!T['th'])T['th']={};T['th'].loadingWorld="กำลังสร้างบ่อ…";T['th'].economy="โหมดประหยัด";T['th'].economyAsk="ต่ำกว่า 25 ภาพ โหมดประหยัดอยู่ในตั้งค่า: ตัวหนังสือน้อยลง บ่อ −30%";T['th'].demoTipTouch="<b>เดโม</b> · ลากเพื่อบิน · 1–6 เปลี่ยนกลุ่ม · แตะเซลล์เพื่อเข้า<br>";T['th'].camFlyTouch="กล้องอิสระ";
if(!T['it'])T['it']={};T['it'].loadingWorld="Sto costruendo lo stagno…";T['it'].economy="Modalità risparmio";T['it'].economyAsk="Meno di 25 fotogrammi. La modalità risparmio è nelle impostazioni: meno scritte, stagno −30%.";T['it'].demoTipTouch="<b>DEMO</b> · trascina per volare · 1–6 cambia gruppo · tocca una cella per entrare<br>";T['it'].camFlyTouch="Camera libera";
if(!T['pl'])T['pl']={};T['pl'].loadingWorld="Budujemy staw…";T['pl'].economy="Tryb oszczędny";T['pl'].economyAsk="Poniżej 25 klatek. Tryb oszczędny jest w ustawieniach: mniej podpisów, staw −30%.";T['pl'].demoTipTouch="<b>DEMO</b> · przeciągnij, by lecieć · 1–6 zmienia grupę · dotknij komórki, by wejść<br>";T['pl'].camFlyTouch="Wolna kamera";
if(!T['uk'])T['uk']={};T['uk'].loadingWorld="Збираємо ставок…";T['uk'].economy="Ощадний режим";T['uk'].economyAsk="Менше ніж 25 кадрів. Ощадний режим у налаштуваннях: менше підписів, ставок −30%.";T['uk'].demoTipTouch="<b>ДЕМО</b> · палець рухає камеру · 1–6 група · дотик клітини — увійти<br>";T['uk'].camFlyTouch="Вільна камера";
if(!T['zh-TW'])T['zh-TW']={};T['zh-TW'].loadingWorld="正在建造池塘…";T['zh-TW'].economy="省電模式";T['zh-TW'].economyAsk="低於 25 張畫面。省電模式在設定裡：較少文字，池塘 −30%。";T['zh-TW'].demoTipTouch="<b>示範</b> · 拖曳飛行 · 1–6 換組 · 點細胞進入<br>";T['zh-TW'].camFlyTouch="自由鏡頭";
if(!T['ms'])T['ms']={};T['ms'].loadingWorld="Membina kolam…";T['ms'].economy="Mod jimat";T['ms'].economyAsk="Bawah 25 bingkai. Mod jimat ada dalam tetapan: kurang kapsyen, kolam −30%.";T['ms'].demoTipTouch="<b>DEMO</b> · seret untuk terbang · 1–6 tukar kumpulan · ketik sel untuk masuk<br>";T['ms'].camFlyTouch="Kamera bebas";
if(!T['bn'])T['bn']={};T['bn'].loadingWorld="পুকুর তৈরি হচ্ছে…";T['bn'].economy="সাশ্রয়ী অবস্থা";T['bn'].economyAsk="২৫ ছবির কম। সাশ্রয়ী অবস্থা সেটিংসে: কম লেখা, পুকুর −৩০%.";T['bn'].demoTipTouch="<b>ডেমো</b> · টেনে উড়ুন · ১–৬ দল · কোষে ছুঁয়ে ঢুকুন<br>";T['bn'].camFlyTouch="মুক্ত ক্যামেরা";
for(var l in LANGS){if(!T[l]){T[l]={};var ks=Object.keys(T.en);for(var k=0;k<ks.length;k++)T[l][ks[k]]=T.en[ks[k]];}}
function tt(k, params){
  var s=(T[curLang]&&T[curLang][k])||(T.en&&T.en[k])||k;
  if(s===k && !(T.en&&T.en[k]) && typeof window!=='undefined'){
    window.__i18nMiss=window.__i18nMiss||0;
    window.__i18nMissKeys=window.__i18nMissKeys||{};
    var mk=(curLang||'')+':'+k;
    if(!window.__i18nMissKeys[mk]){
      window.__i18nMissKeys[mk]=1;
      window.__i18nMiss++;
      if(typeof console!=='undefined'&&console.debug) console.debug('[i18n] miss', curLang, k);
    }
  }
  if(params){
    for(var p in params){
      if(Object.prototype.hasOwnProperty.call(params,p)) s=String(s).split('{'+p+'}').join(String(params[p]));
    }
  }
  return s;
}
// U42/F5: localize wiki movement ("Locomotion:") values. Only the 9 known locomotion
// tokens map to loc.* keys; anything else (a full localized sentence from the wiki pack)
// passes through untouched — silent fallback, so __i18nMiss stays clean.
function locLabel(v){
  if(!v||v==='-') return v;
  var slug=(v==='cilia+stalk')?'ciliaStalk':v;
  var key='loc.'+slug;
  var s=(T[curLang]&&T[curLang][key])||(T.en&&T.en[key]);
  return s||v;
}
function igsText(key, fallback){
  var s=(typeof tt==='function')?tt(key):key;
  return (!s||s===key)?fallback:s;
}
function igsNum(n, digits){
  var lang=(typeof curLang==='string'&&curLang)?curLang:'ru';
  var d=digits==null?0:digits;
  try{ return new Intl.NumberFormat(lang,{maximumFractionDigits:d,numberingSystem:'latn'}).format(n); }
  catch(e){ return (d?Number(n).toFixed(d):String(Math.round(n))); }
}
if(typeof window!=='undefined'){ window.tt=tt; window.igsText=igsText; window.igsNum=igsNum; }

// === SPECIES DATABASE — 100 species + 5 virus types ===
var SPEED_SCALE=0.5; if(typeof window!=='undefined')window.SPEED_SCALE=0.5; // v2: global movement speed halved
var PN=["Synechocystis sp.","Anabaena variabilis","Spirulina platensis","Nostoc punctiforme","Oscillatoria limnetica","Microcystis aeruginosa","Gloeocapsa sp.","Lyngbya majuscula","Chlamydomonas reinhardtii","Chlorella vulgaris","Volvox globator","Euglena gracilis","Scenedesmus quadricauda","Haematococcus pluvialis","Dunaliella salina","Micrasterias rotata","Navicula sp.","Pinnularia viridis","Cyclotella meneghiniana","Diatoma vulgare","Rhodospirillum rubrum","Chromatium vinosum","Porphyridium cruentum","Prochlorococcus marinus","Chroococcidiopsis thermalis"];
var CN1=["Bdellovibrio bacteriovorus","Vampirococcus sp.","Daptobacter sp.","Myxococcus xanthus","Bacteriovorax stolpii","Halobacteriovorax sp.","Peredibacter starrii","Monas guttula","Oikomonas termo","Anthophysa vegetans","Chilomonas paramecium","Cercomonas longicauda","Heteromita globosa","Bodo saltans","Procryptobia sorokini","Trypanosoma brucei","Leishmania donovani","Monosiga brevicollis","Salpingoeca rosetta","Codonosiga botrytis"];
var CN2=["Paramecium caudatum","Paramecium bursaria","Stentor coeruleus","Stentor polymorphus","Vorticella campanula","Vorticella microstoma","Didinium nasutum","Spirostomum ambiguum","Blepharisma americanum","Euplotes patella","Stylonychia pustulata","Oxytricha trifallax","Tetrahymena thermophila","Coleps hirtus","Litonotus lamella","Dileptus anser","Urocentrum turbo","Zoothamnium arbuscula","Opercularia coarctata","Amoeba proteus","Arcella vulgaris","Difflugia oblonga","Euglypha alveolata","Nebela collaris","Centropyxis aculeata"];
var CN3=["Actinophrys sol","Actinosphaerium eichhorni","Raphidiophrys pallida","Rotaria rotatoria","Philodina roseola","Brachionus plicatilis","Keratella cochlearis","Asplanchna priodonta","Chaetonotus maximus","Lepidodermella squamata","Macrostomum lignano","Stenostomum leucops","Microstomum lineare","Prostoma graecense","Trichoplax adhaerens"];
var DN=["Saccharomyces cerevisiae","Candida albicans","Mucor mucedo","Rhizopus stolonifer","Penicillium chrysogenum","Aspergillus niger","Batrachochytrium dendrobatidis","Chytriomyces aureus","Allomyces macrogynus","Bacillus subtilis","Pseudomonas putida","Streptomyces coelicolor","Cellulomonas fimi","Thermus aquaticus","Deinococcus radiodurans"];
var VN=["T4 Bacteriophage","Lambda Phage","T7 Bacteriophage","Phi-6 Phage","MS2 Phage"];
var CC={producer:"#22dd44",consumer1:"#33aaff",consumer2:"#ff9900",consumer3:"#dd44cc",decomposer:"#bb9966",virus:"#ff3333",macrophage:"#eeeeee"};
var SHAPES={producer:["circle","filament","spiral","trichormus","filament","colony","diplococci","filament","bell","circle","volvox","oval","rodtococcus","oval","oval","star","rod","rod","circle","rod","spiral","rod","circle","circle","archaea"],consumer1:["comma","circle","rod","rod","rod","rod","rod","oval","oval","oval","oval","irregular","circle","comma","comma","filament","oval","bell","bell","bell"],consumer2:["slipper","slipper","bell","bell","bell","bell","oval","rod","slipper","irregular","irregular","irregular","oval","oval","slipper","rod","oval","bell","bell","irregular","irregular","irregular","irregular","irregular","irregular"],consumer3:["star","star","star","oval","oval","oval","star","oval","rod","rod","oval","rod","rod","rod","irregular"],decomposer:["circle","circle","filament","filament","filament","filament","circle","circle","filament","rod","rod","filament","rod","rod","circle"]};
function bioFlags(cat,i){
  var b={nucleus:false,chloro:false,vac:false,flag:false,cilia:false,eye:false,pseudo:false,wall:false,biolum:false,stalk:false,oral:false,bud:false,chain:false,mito:false,golgi:false,er:false,trich:false,macro:false,ribo:false,plastid:false,contractile:false,pellicle:false,glide:false,nucleoid:false,thylakoid:false};
  if(cat==='producer'){
    b.wall=true; b.ribo=true; b.biolum=(i===2||i===5||i===14);
    b.chain=(i===2||i===3||i===7||i===10);
    var sh=SHAPES.producer[i];
    b.glide=(sh==='circle'&&i<8)||sh==='rod';
    if(i<8){ // Cyanobacteria (Prokaryote)
      b.nucleoid=true; b.thylakoid=true;
    } else { // Eukaryotic Algae & Diatoms
      b.nucleus=true; b.chloro=true; b.mito=true; b.vac=true;
      if(i>=8&&i<=14){ b.flag=(i===8||i===11||i===13||i===14); b.eye=b.flag; b.contractile=true; }
    }
  }
  if(cat==='consumer1'){ // Bacteria (Prokaryote)
    b.nucleoid=true; b.ribo=true; b.wall=true;
    var sh=SHAPES.consumer1[i];
    b.glide=(sh==='rod'); b.flag=!b.glide;
  }
  if(cat==='consumer2'){ // Ciliates
    b.nucleus=true; b.macro=true; b.vac=true; b.cilia=true; b.oral=true; b.mito=true; b.er=true; b.pellicle=true; b.contractile=true;
  }
  if(cat==='consumer3'){ // Predators — full internals (not empty ovals)
    b.nucleus=true; b.vac=true; b.mito=true; b.contractile=true; b.er=true; b.golgi=true; b.oral=true;
    var sh=SHAPES.consumer3[i];
    b.pseudo=(sh==='star'||sh==='irregular');
    b.cilia=(sh==='bell'||sh==='oval'||sh==='slipper');
    b.flag=(sh==='rod') || (!b.cilia && !b.pseudo);
    b.pellicle = b.cilia;
    if (i > 8) b.venom = true;
  }
  if(cat==='decomposer'){ // Fungi/Yeast
    b.nucleus=true; b.vac=true; b.wall=true; b.mito=true; b.ribo=true;
    b.stalk=(i>=2&&i<=5); b.bud=(i<2); b.chain=(i>=2&&i<=8);
  }
  return b;
}
function mkSp(arr,cat,minSz,maxSz,minSp,maxSp){
  var o=[];
  for(var i=0;i<arr.length;i++){
    var ti=i/arr.length; var sz=minSz+(maxSz-minSz)*ti; var baseSp=minSp+(maxSp-minSp)*(0.6+ti*0.4); // NO +0.5 floor
    var loc=getLocomotion(cat,i);
    var finalSp=baseSp;
    if(loc==='drift') finalSp*=0.25; // still barely moves
    else if(loc==='budding'||loc==='growth') finalSp*=0.10; // fungi: nearly stationary
    else if(loc==='pseudopodia') finalSp*=0.55;
    else if(loc==='glide') finalSp*=0.35;
    else if(loc==='flagella') finalSp*=1.0;
    else if(loc==='cilia') finalSp*=1.15;
    else if(loc==='cilia+stalk') finalSp*=0.7;
    
    var flags = {};
    var bioName = arr[i].toLowerCase();
    if(cat==='producer') {
       // Diatoms (Silicon shell)
       if(bioName.includes('navicula') || bioName.includes('pinnularia') || bioName.includes('cyclotella') || bioName.includes('diatoma')) {
           flags.shell = true;
       }
       // Green algae with spikes
       if(bioName.includes('scenedesmus') || bioName.includes('micrasterias')) {
           flags.spikes = true;
       }
       // Toxic Cyanobacteria
       if(bioName.includes('microcystis') || bioName.includes('lyngbya')) {
           // Lyngbya toxin removed — was causing energy drain at game start
       }
    } else {
       // Venomous carnivores
       if(bioName.includes('didinium') || bioName.includes('dileptus') || bioName.includes('litonotus')) {
           flags.venom = true;
       }
    }
    
    o.push({
      id:o.length, name:arr[i], cat:cat, shape:SHAPES[cat]?SHAPES[cat][i%SHAPES[cat].length]:'circle',
      color:(function(){var b={producer:90,consumer1:205,consumer2:28,consumer3:300,decomposer:25}[cat];if(b===undefined)return CC[cat];return hslToHex((b+(i*13)%80-40+360)%360,78,45+(i%3)*6);})(),
      size:Math.round(sz*10)/10, speed:Math.round(finalSp*1000)/1000,
      energy:55+Math.floor(Math.random()*25), repEnergy:60+Math.floor(Math.random()*8),
      minAge:4+Math.floor(Math.random()*5), isEuk:cat!=='consumer1'&&!(cat==='producer'&&i<8),
      tempRange:[5+Math.floor(Math.random()*10),28+Math.floor(Math.random()*10)],
      bio:bioFlags(cat,i), biolum:(cat==='producer')&&(i===2||i===5||i===14), locomotion:loc,
      flags: flags
    });
    o[o.length-1].id=o.length-1;
  }
  return o;
}
function getLocomotion(cat,i){
  // Sessile ONLY by true biology (peritrich stalks), never by shape=bell alone (Stentor swims!)
  var nm='';
  try{
    if(cat==='consumer2'&&typeof CN2!=='undefined') nm=CN2[i]||'';
    if(cat==='consumer1'&&typeof CN1!=='undefined') nm=CN1[i]||'';
  }catch(e){}
  if(/Vorticella|Zoothamnium|Opercularia/i.test(nm)) return 'sessile';
  // Choanoflagellates often stalked/sessile in nature
  if(/Codonosiga|Salpingoeca/i.test(nm)) return 'sessile';
  if(cat==='producer'){
    var sh=SHAPES.producer[i];
    if(sh==='spiral'||sh==='bell'||i===8||i===11||i===13||i===14)return'flagella';
    if(sh==='filament'||sh==='colony')return'drift'; // cyanobacterial filaments/colonies float/glide slowly
    if(i<8||sh==='rod')return'glide';
    return'drift';
  }
  if(cat==='consumer1'){
    var sh1=SHAPES.consumer1[i];
    if(sh1==='comma')return'flagella'; // Bdellovibrio swims with polar flagellum
    if(sh1==='rod')return'glide';
    if(sh1==='filament')return'flagella'; // Trypanosoma undulating
    return'flagella';
  }
  if(cat==='consumer2'){
    var sh=SHAPES.consumer2[i];
    if(sh==='slipper'||sh==='oval'||sh==='rod'||sh==='bell')return'cilia'; // Stentor free-swims with cilia
    return'pseudopodia'; // Amoeba / testates
  }
  if(cat==='consumer3'){
    var sh=SHAPES.consumer3[i];
    if(sh==='star')return'pseudopodia'; // heliozoa axopodia, slow
    if(sh==='oval'||sh==='rod')return'cilia'; // rotifers/gastrotrichs ciliary
    return'pseudopodia';
  }
  if(cat==='decomposer')return SHAPES.decomposer[i]==='circle'?'budding':'growth';
  return'drift';
}
var SPECIES_DB=mkSp(PN,'producer',3,5,0.010,0.027).concat(mkSp(CN1,'consumer1',3,7,0.10,0.23)).concat(mkSp(CN2,'consumer2',4,7,0.20,0.40)).concat(mkSp(CN3,'consumer3',5,8,0.33,0.60)).concat(mkSp(DN,'decomposer',3,6,0.007,0.02));
// Virus species
for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}
var VIRUS_SPECS=[];
for(var vi=0;vi<VN.length;vi++){VIRUS_SPECS.push({id:100+vi,name:VN[vi],cat:'virus',shape:'phage',color:'#f44',size:4,speed:0.35,infectRate:0.3,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift'});}
VIRUS_SPECS.push({id:200,name:'Neuro-Parasite',cat:'virus',shape:'phage',color:'#f0f',size:4,speed:0.4,infectRate:0.5,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift',type:'parasite'});

var MACROPHAGE_SP = {
    id: 999, name: tt('sp.999'), cat: "macrophage", shape: "circle", color: "#eeeeee",
    size: 20, speed: 1.2, energy: 100, repEnergy: 200, minAge: 5, isEuk: true,
    tempRange: [0, 40], locomotion: "pseudopodia", flags: { noRandomSpawn: true, immune: true, shell: true }, bio: {nucleus:true, vac:true, pseudo:true, mito:true, er:true, golgi:true}
};
// SPECIES_DB.push(MACROPHAGE_SP); // disabled mega immune cell

var SPONGE_SP = {
    id: 1000, name: tt('sp.1000'), cat: "consumer2", shape: "irregular", color: "#5a7a62",
    size: 8, speed: 0, energy: 100, repEnergy: 9999, minAge: 10, isEuk: true,
    tempRange: [0, 40], locomotion: "sessile",
    // noRandomSpawn: never flood pond with giant green killers
    flags: { filter_feeder: true, shell: true, noRandomSpawn: true }, bio: {nucleus:true, vac:true}
};
// SPONGE not in random pool — too big/wrong scale for micro game
// // SPECIES_DB.push(SPONGE_SP); // disabled giant green filter

var GENDERED_SP = {
    id: 1001, name: tt('sp.1001'), cat: "consumer3", shape: "oval", color: "#d9534f",
    size: 15, speed: 2.0, energy: 80, repEnergy: 160, minAge: 5, isEuk: true,
    tempRange: [0, 40], locomotion: "flagella", flags: { gendered: true }, bio: {nucleus:true, vac:true, flag:true}
};
SPECIES_DB.push(GENDERED_SP);
/* COLONY_PATCH + continuous species numbers */
(function(){
  // Continuous numbering for ALL species (1..N) — menu + demo + HUD
  for(var i=0;i<SPECIES_DB.length;i++){
    var s=SPECIES_DB[i]; if(!s) continue;
    s.num = i+1; // сквозной номер
    s.id = (typeof s.id==='number') ? s.id : i;
  }
  // Viruses continue after last species
  if(typeof VIRUS_SPECS!=='undefined'){
    for(var vi=0;vi<VIRUS_SPECS.length;vi++){
      VIRUS_SPECS[vi].num = SPECIES_DB.length + 1 + vi;
    }
  }
  for(var i=0;i<SPECIES_DB.length;i++){
    var s=SPECIES_DB[i]; if(!s||!s.name) continue;
    var n=s.name.toLowerCase();
    // Colony shapes are now unique per species (set in SHAPES array)
    // Only set bio.colony flag for UI badges
    if(n.indexOf('volvox')>=0 || n.indexOf('gloeocapsa')>=0 || n.indexOf('microcystis')>=0 ||
       n.indexOf('nostoc')>=0 || n.indexOf('scenedesmus')>=0 || n.indexOf('chroococcidiopsis')>=0){
      s.bio=Object.assign({}, s.bio||{}, {colony:true, daughter:true});
      s.bio=Object.assign({}, s.bio||{}, {colony:true, daughter:true});
      // playable in menu/demo; still rare in random world spawn
      s.flags=Object.assign({}, s.flags||{}, {noRandomSpawn:true, colony:true});
      // ~2x smaller than before (was up to 8) — still larger than single cells
      var base = s.size || 3;
      s.size = Math.max(9, Math.min(14, base * 1.5 + 5)); // v2: 3× bigger — visible clusters, not bacteria-sized
      s.visScale = 1.0; // v2: full visual size (was shrunk 0.85)
      if(n.indexOf('microcystis')>=0){
        s.flags=Object.assign({}, s.flags||{}, {toxic:true});
      }
    }
  }
})();


var VIRUS_ID_START=100;
// Wiki facts
// WIKI facts moved to .04-Src/i18n/wiki/*.json (lazy pack, window.WIKI_I18N)
function getWikiEntry(i){
    var sp=(typeof SPECIES_DB!=='undefined')?SPECIES_DB[i]:null;
    if(!sp) return {loc:'-',div:'-',food:'-',pred:'-'};
    var wp=(window.WIKI_I18N&&window.WIKI_I18N[curLang])||(window.WIKI_I18N&&window.WIKI_I18N.ru)||{};
    var w=(wp.facts&&wp.facts[String(i)])||{};
    var loc=locLabel(w.loc||sp.locomotion||'-');
    var div=w.div||(sp.cat==='decomposer'?tt('wiki.div.budding'):tt('wiki.div.binary'));
    var food=w.food||(typeof foodListRu==='function'?foodListRu(sp.cat):(FOOD[sp.cat]?FOOD[sp.cat].join(', '):tt('food.producer')));
    var pred=w.pred||'-';
    var defs=[];
    if(sp.flags && sp.flags.shell) defs.push(tt('wiki.def.shell'));
    if(sp.flags && sp.flags.spikes) defs.push(tt('wiki.def.spikes'));
    if(sp.flags && sp.flags.toxic) defs.push(tt('wiki.def.toxic'));
    if(sp.flags && sp.flags.venom) defs.push(tt('wiki.def.venom'));
    if(defs.length>0) loc += " <br><span style='color:#f80'>"+tt('wiki.defs')+" " + defs.join(", ") + "</span>";
    return{loc:loc,div:div,food:food,pred:pred};
}

// === CONFIG ===
var PW=25000,PD=2000,BW=600,MAX_ORG=8000,DAY_SEC=120,SPD_SCALE=16;
// v20.6 G2: тестовый режим — малый пул только при ?test=1 (игру не уменьшает)
try{
  var __qp=new URLSearchParams(location.search);
  if(__qp.get('test')==='1'&&__qp.get('pool')){ window.TEST_POOL=parseInt(__qp.get('pool'),10)||200; }
}catch(e){}
if(window.TEST_POOL){ MAX_ORG=Math.min(MAX_ORG,window.TEST_POOL+80); }
var SPAWN_RATES={producer:2,consumer1:0.3,consumer2:0.08,consumer3:0.02,decomposer:0.2,macrophage:0.05,virus:0.1};
var FOOD={consumer1:["producer"],consumer2:["producer","consumer1","consumer2"],consumer3:["producer","consumer1","consumer2","consumer3"],decomposer:[],macrophage:["consumer1","consumer2","consumer3"]};
// Кто есть кто — простыми словами (для UI/вики/подростка)
// Тексты вынесены в словари i18n: role.* и ключи категорий (producer, consumer1, ...)
function catName(cat){
  var k = cat;
  var v = (typeof tt==='function') ? tt(k) : k;
  return (v && v !== k) ? v : cat;
}
function catRole(cat){
  var k = 'role.' + cat;
  var v = (typeof tt==='function') ? tt(k) : '';
  return (v && v !== k) ? v : '';
}
function foodListRu(cat){
  var arr = FOOD[cat]||[];
  if(!arr.length){
    if(cat==='producer') return tt('food.producer');
    if(cat==='decomposer') return tt('food.decomposer');
    return '—';
  }
  return arr.map(catName).join(', ');
}

var DIFF={easy:{spawn:1.5,energy:0.8,metab:0.3,virus:0.2},normal:{spawn:1.0,energy:1.0,metab:0.5,virus:0.4},hard:{spawn:0.7,energy:1.2,metab:0.8,virus:0.8}};
var TGT={producer:1400,consumer1:160,consumer2:100,consumer3:40,decomposer:160,macrophage:0};
var INIT_N={producer:1200,consumer1:150,consumer2:90,consumer3:40,decomposer:150,macrophage:0,virus:3};
var SEASONS=[{temp:16,light:0.85,ice:0,rain:0.15},{temp:24,light:1,ice:0,rain:0.08},{temp:10,light:0.7,ice:0.05,rain:0.25},{temp:3,light:0.45,ice:0.6,rain:0.03}];
var SEASON_DAYS=2;
var DCODE={STARVE:0,EATEN:1,TEMP:2,AGE:3,LYSIS:4};
var VIRUS_SCALE=0.08;
var DLAB_KEYS=['dStarve','dEaten','dTemp','dAge','dLysis'];
var DIV_COOLDOWN=6;
var DIV_SEPARATION=40;
var DIV_ANIM=1.25;

// === GAME STATE ===
// GLOBAL GUARD: prevent createRadialGradient from crashing on NaN/Infinity
(function(){
  var _origCRG = CanvasRenderingContext2D.prototype.createRadialGradient;
  CanvasRenderingContext2D.prototype.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(r0)||r0<0)r0=0;
    if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;if(!isFinite(r1)||r1<0)r1=1;
    return _origCRG.call(this,x0,y0,r0,x1,y1,r1);
  };
  var _origCLG = CanvasRenderingContext2D.prototype.createLinearGradient;
  CanvasRenderingContext2D.prototype.createLinearGradient = function(x0,y0,x1,y1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;
    return _origCLG.call(this,x0,y0,x1,y1);
  };
})();

var cv=document.getElementById('c'),ctx=cv.getContext('2d');
// GLOBAL gradient guard — prevents createRadialGradient crashes from NaN/Infinity
(function(){
  var origCRG = ctx.createRadialGradient.bind(ctx);
  ctx.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(r0)||r0<0)r0=0;
    if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;if(!isFinite(r1)||r1<0)r1=1;
    return origCRG(x0,y0,r0,x1,y1,r1);
  };
})();
// Same guard for createLinearGradient
(function(){
  var origCLG = ctx.createLinearGradient.bind(ctx);
  ctx.createLinearGradient = function(x0,y0,x1,y1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;
    if(!isFinite(x1))x1=1;if(!isFinite(y1))y1=1;
    return origCLG(x0,y0,x1,y1);
  };
})();
var mm=document.getElementById('mm'),mc=mm.getContext('2d');
if(mm){ mm.width=110; mm.height=80; }
var pc=document.getElementById('pc'),pcc=pc.getContext('2d');
if(pc){ pc.width=110; pc.height=55; }
var orgs=[],parts=[],player=null,inspOrg=null,viruses=[];
var cam={x:0,y:300},zoom=1,tZoom=3;
var gt=0,fc=0,fps=60,fAcc=0,fCnt=0;
var state='menu',keys={},mx=9999,my=9999;
var dayLight=0.85;
var stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]},spawnT=0,virusT=0;
var popHist=[];
var tod=9.0,totalDays=0,season=1;
var seasonT=0, spawnT=0, virusT=0;
var wind={x:0,y:0,strength:0};
var isRaining=false,rainTimer=0,rainDrops=[];
var autoAI=false,freeCam=false;
var gameStats={startTime:0,maxPop:0,maxPlayerSize:0,evoLvl:0};
var timeScale=1.0,lastT=0;
var settings={particles:true,bubbles:true,currents:true,vignette:false,healthBars:true,shadows:true,density:1.0,lightMul:1.0,virusRate:0.7,renderMode:'cartoon',microscopeMode:false,simSpeed:0.33,predation:1.0,divRate:1.0,economy:false};
try{ var _ls=(typeof window!=='undefined'?window.localStorage:null); settings.softMembrane = !_ls || _ls.getItem('igs.softMembrane') !== '0'; }catch(e){ settings.softMembrane = true; }
var difficulty='easy',selCat='all',selSpecies=0;
var mouseDown=false,moveTarget=null;
var camKeys={w:false,a:false,s:false,d:false};
var sliderDragging=false;
var currents=[],nutrientClouds=[],o2Bubbles=[],shoreDecor=[],sedimentClumps=[],sunRays=[];
var speciesPop={};


// === UX: role card + food scent (plain language) ===
function showRoleCard(sp){
  if(!sp) return;
  try{
    var old = document.getElementById('roleCard');
    if(old) old.remove();
    var cat = sp.cat || '';
    var name = (typeof catName==='function' ? catName(cat) : cat);
    var role = (typeof catRole==='function' ? catRole(cat) : '');
    var eats = (typeof foodListRu==='function' ? foodListRu(cat) : '—');
    if(cat==='producer') eats = tt('food.producer');
    var d = document.createElement('div');
    d.id = 'roleCard';
    d.style.cssText = 'position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:9999;max-width:520px;width:92%;background:rgba(6,18,14,0.94);border:1px solid rgba(140,220,160,0.45);border-radius:14px;padding:14px 16px;color:#e8ffe8;font:14px/1.4 system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45)';
    d.innerHTML =
      '<div style="font-size:12px;opacity:.7;margin-bottom:4px">'+tt('roleWho')+'</div>'+
      '<div style="font-size:18px;font-weight:700;color:#c8ffc0;margin-bottom:6px">'+(sp.name||name)+' · '+name+'</div>'+
      '<div style="opacity:.95;margin-bottom:8px">'+(role||'')+'</div>'+
      '<div style="background:rgba(255,255,255,.06);border-radius:10px;padding:8px 10px;margin-bottom:8px"><b>'+tt('roleFood')+':</b> '+eats+'</div>'+
      '<div style="opacity:.8;font-size:12.5px">'+tt('roleHint')+'</div>'+
      '<button id="roleCardOk" style="margin-top:10px;width:100%;padding:10px;border:0;border-radius:10px;background:#2d8f55;color:#fff;font-weight:700;cursor:pointer">'+tt('roleOk')+'</button>';
    document.body.appendChild(d);
    var close = function(){
      var el=document.getElementById('roleCard'); if(el) el.remove();
      if(typeof state!=='undefined' && state==='paused') state='playing';
      if(window._pendingTutorial){ window._pendingTutorial=false; try{ window.startTutorial(false); }catch(e2){} }
    };
    var btn = document.getElementById('roleCardOk');
    if(btn) btn.onclick = close;
    setTimeout(close, 12000);
  }catch(e){}
}

function foodScentStrength(o){
  if(!o || !o.alive || !o.sp) return 0;
  var cats = (typeof FOOD!=='undefined' && FOOD[o.sp.cat]) ? FOOD[o.sp.cat] : [];
  if(o.sp.cat==='producer') return Math.max(0, Math.min(1, (typeof dayLight==='number'?dayLight:1)));
  if(!cats.length) return 0;
  var best = 1e15;
  var list = (window.getNearby ? window.getNearby(o.x,o.y,140) : (typeof orgs!=='undefined'?orgs:[]));
  for(var i=0;i<list.length;i++){
    var p = list[i];
    if(!p||!p.alive||p===o||p.cyst) continue;
    if(cats.indexOf(p.sp.cat)<0) continue;
    var dx=p.x-o.x, dy=p.y-o.y, d=dx*dx+dy*dy;
    if(d<best) best=d;
  }
  if(best>1e14) return 0;
  var dist = Math.sqrt(best);
  return Math.max(0, Math.min(1, 1 - dist/140));
}

function isEdibleFor(pred, prey){
  if(!pred||!prey||!pred.sp||!prey.sp) return false;
  if(pred.sp.cat==='producer') return false;
  var cats = (typeof FOOD!=='undefined' && FOOD[pred.sp.cat]) ? FOOD[pred.sp.cat] : [];
  return cats.indexOf(prey.sp.cat) >= 0;
}

function roleColor(cat){
  if(typeof CC!=='undefined' && CC[cat]) return CC[cat];
  return {producer:'#22dd44',consumer1:'#33aaff',consumer2:'#ff9900',consumer3:'#dd44cc',decomposer:'#bb9966'}[cat]||'#8cf';
}

function halfW(d){d=Math.max(0,Math.min(d,PD));return PW-(PW-BW)*d/PD;}
function lightAt(d){return Math.max(0.1,dayLight*Math.exp(-0.0002*d)*settings.lightMul);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rng(a,b){return a+Math.random()*(b-a);}
function lerp(a,b,t){return a+(b-a)*t;}
function dist2(a,b){var dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy;}
function hex2rgb(h){h=h.replace('#','');if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];}return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function shadeRgb(r,g,b,f){return'rgb('+Math.round(clamp(r*f,0,255))+','+Math.round(clamp(g*f,0,255))+','+Math.round(clamp(b*f,0,255))+')';}
if(typeof module!=='undefined'&&module.exports){module.exports={clamp,rng,lerp,dist2,hex2rgb,shadeRgb,hslToHex,halfW};}
// v20.7: ключи exit/смерть/справка (10) — inline из dicts (аналит. заморозка: dicts вернулись к 412)
// es/tr/fil показывают английский фоллбек (D11); ru/en — уже в config.js T
if(!T['bn'])T['bn']={};T['bn'].exitAsk="বের হবেন?";T['bn'].exitMsg="এই জীবনের অগ্রগতি মুছে যাবে।";T['bn'].yes="হ্যাঁ";T['bn'].no="না";T['bn'].more="আরও";T['bn'].deadYours="আপনার কোষ মারা গেছে";T['bn'].aliveWord="জীবিত";T['bn'].deadOther="অন্য";T['bn'].helpTouch="<p><b>নিয়ন্ত্রণ:</b> সাঁতারের জন্য জয়স্টিক। দিকের জন্য জল ছুঁয়ে। নিচের বোতাম: খাও, ভাগ, স্পোর, অটো। জুমে চিমটি।</p>";T['bn'].setLang="ভাষা";
if(!T['de'])T['de']={};T['de'].exitAsk="Beenden?";T['de'].exitMsg="Der Fortschritt dieses Lebens geht verloren.";T['de'].yes="Ja";T['de'].no="Nein";T['de'].more="Mehr";T['de'].deadYours="Deine Zelle ist gestorben";T['de'].aliveWord="lebend";T['de'].deadOther="Sonstiges";T['de'].helpTouch="<p><b>Steuerung:</b> Joystick zum Schwimmen. Tippe ins Wasser für die Richtung. Unten: Fressen, Teilen, Spore, Auto. Ziehen zum Zoomen.</p>";T['de'].setLang="Sprache";
if(!T['fr'])T['fr']={};T['fr'].exitAsk="Quitter ?";T['fr'].exitMsg="La progression de cette vie sera perdue.";T['fr'].yes="Oui";T['fr'].no="Non";T['fr'].more="Plus";T['fr'].deadYours="Votre cellule est morte";T['fr'].aliveWord="vivants";T['fr'].deadOther="Autre";T['fr'].helpTouch="<p><b>Commandes :</b> joystick pour nager. Touchez l’eau pour viser. Boutons du bas : manger, diviser, spore, auto. Pincez pour zoomer.</p>";T['fr'].setLang="Langue";
if(!T['hi'])T['hi']={};T['hi'].exitAsk="बाहर जाएँ?";T['hi'].exitMsg="इस जीवन की प्रगति मिट जाएगी।";T['hi'].yes="हाँ";T['hi'].no="नहीं";T['hi'].more="और";T['hi'].deadYours="आपकी कोशिका मर गई";T['hi'].aliveWord="जीवित";T['hi'].deadOther="अन्य";T['hi'].helpTouch="<p><b>नियंत्रण:</b> तैरने के लिए जॉयस्टिक। दिशा के लिए पानी छुएँ। नीचे के बटन: खाओ, बाँटो, बीजाणु, ऑटो। ज़ूम के लिए पिंच।</p>";T['hi'].setLang="भाषा";
if(!T['id'])T['id']={};T['id'].exitAsk="Keluar?";T['id'].exitMsg="Kemajuan hidup ini akan hilang.";T['id'].yes="Ya";T['id'].no="Tidak";T['id'].more="Lainnya";T['id'].deadYours="Selmu mati";T['id'].aliveWord="hidup";T['id'].deadOther="Lainnya";T['id'].helpTouch="<p><b>Kontrol:</b> joystick untuk berenang. Ketuk air untuk mengarah. Tombol bawah: makan, belah, spora, auto. Cubit untuk zoom.</p>";T['id'].setLang="Bahasa";
if(!T['it'])T['it']={};T['it'].exitAsk="Uscire?";T['it'].exitMsg="I progressi di questa vita andranno persi.";T['it'].yes="Sì";T['it'].no="No";T['it'].more="Altro";T['it'].deadYours="La tua cellula è morta";T['it'].aliveWord="vivi";T['it'].deadOther="Altro";T['it'].helpTouch="<p><b>Comandi:</b> joystick per nuotare. Tocca l’acqua per mirare. Pulsanti in basso: mangia, dividi, spora, auto. Pizzica per lo zoom.</p>";T['it'].setLang="Lingua";
if(!T['ja'])T['ja']={};T['ja'].exitAsk="終了しますか？";T['ja'].exitMsg="この命の進行は失われます。";T['ja'].yes="はい";T['ja'].no="いいえ";T['ja'].more="その他";T['ja'].deadYours="あなたの細胞は死にました";T['ja'].aliveWord="生存";T['ja'].deadOther="その他";T['ja'].helpTouch="<p><b>操作:</b> ジョイスティックで泳ぐ。水をタップして向き。下のボタン: 食べる、分裂、胞子、自動。ピンチで拡大。</p>";T['ja'].setLang="言語";
if(!T['ko'])T['ko']={};T['ko'].exitAsk="나갈까요?";T['ko'].exitMsg="이번 삶의 진행이 사라집니다.";T['ko'].yes="예";T['ko'].no="아니요";T['ko'].more="더보기";T['ko'].deadYours="당신의 세포가 죽었습니다";T['ko'].aliveWord="생존";T['ko'].deadOther="기타";T['ko'].helpTouch="<p><b>조작:</b> 조이스틱으로 헤엄. 물을 눌러 방향. 아래 버튼: 먹기, 분열, 포자, 자동. 집어서 확대.</p>";T['ko'].setLang="언어";
if(!T['ms'])T['ms']={};T['ms'].exitAsk="Keluar?";T['ms'].exitMsg="Kemajuan hayat ini akan hilang.";T['ms'].yes="Ya";T['ms'].no="Tidak";T['ms'].more="Lagi";T['ms'].deadYours="Sel anda mati";T['ms'].aliveWord="hidup";T['ms'].deadOther="Lain";T['ms'].helpTouch="<p><b>Kawalan:</b> kayu bedik untuk berenang. Ketik air untuk hala. Butang bawah: makan, bahagi, spora, auto. Cubit untuk zum.</p>";T['ms'].setLang="Bahasa";
if(!T['pl'])T['pl']={};T['pl'].exitAsk="Wyjść?";T['pl'].exitMsg="Postęp tego życia przepadnie.";T['pl'].yes="Tak";T['pl'].no="Nie";T['pl'].more="Więcej";T['pl'].deadYours="Twoja komórka zginęła";T['pl'].aliveWord="żywych";T['pl'].deadOther="Inne";T['pl'].helpTouch="<p><b>Sterowanie:</b> joystick pływa. Dotknij wody, by celować. Dolne przyciski: jedz, dziel, spora, auto. Uszczypnij, by przybliżyć.</p>";T['pl'].setLang="Język";
if(!T['pt-BR'])T['pt-BR']={};T['pt-BR'].exitAsk="Sair?";T['pt-BR'].exitMsg="O progresso desta vida será perdido.";T['pt-BR'].yes="Sim";T['pt-BR'].no="Não";T['pt-BR'].more="Mais";T['pt-BR'].deadYours="Sua célula morreu";T['pt-BR'].aliveWord="vivos";T['pt-BR'].deadOther="Outros";T['pt-BR'].helpTouch="<p><b>Controles:</b> joystick para nadar. Toque na água para mirar. Botões de baixo: comer, dividir, esporo, auto. Belisque para zoom.</p>";T['pt-BR'].setLang="Idioma";
if(!T['ru'])T['ru']={};T['ru'].exitAsk="Выйти?";T['ru'].exitMsg="Прогресс этой жизни будет потерян.";T['ru'].yes="Да";T['ru'].no="Нет";T['ru'].more="Ещё";T['ru'].deadYours="Ваша клетка погибла";T['ru'].aliveWord="живых";T['ru'].deadOther="Прочее";T['ru'].helpTouch="<p><b>Управление:</b> Джойстик — плыть. Касание воды — направление. Нижние кнопки: есть, делиться, спора, авто. Щипок — масштаб.</p>";T['ru'].setLang="Язык";
if(!T['th'])T['th']={};T['th'].exitAsk="ออกหรือไม่?";T['th'].exitMsg="ความคืบหน้าของชีวิตนี้จะหายไป";T['th'].yes="ใช่";T['th'].no="ไม่";T['th'].more="เพิ่มเติม";T['th'].deadYours="เซลล์ของคุณตายแล้ว";T['th'].aliveWord="มีชีวิต";T['th'].deadOther="อื่น ๆ";T['th'].helpTouch="<p><b>ควบคุม:</b> จอยสติ๊กเพื่อว่ายน้ำ แตะน้ำเพื่อเล็ง ปุ่มล่าง: กิน แบ่ง สปอร์ อัตโนมัติ บีบเพื่อซูม</p>";T['th'].setLang="ภาษา";
if(!T['uk'])T['uk']={};T['uk'].exitAsk="Вийти?";T['uk'].exitMsg="Прогрес цього життя буде втрачено.";T['uk'].yes="Так";T['uk'].no="Ні";T['uk'].more="Ще";T['uk'].deadYours="Ваша клітина загинула";T['uk'].aliveWord="живих";T['uk'].deadOther="Інше";T['uk'].helpTouch="<p><b>Керування:</b> джойстик — плисти. Дотик води — напрям. Нижні кнопки: їсти, ділитися, спора, авто. Щипок — масштаб.</p>";T['uk'].setLang="Мова";
if(!T['vi'])T['vi']={};T['vi'].exitAsk="Thoát?";T['vi'].exitMsg="Tiến trình đời này sẽ mất.";T['vi'].yes="Có";T['vi'].no="Không";T['vi'].more="Thêm";T['vi'].deadYours="Tế bào của bạn đã chết";T['vi'].aliveWord="sống";T['vi'].deadOther="Khác";T['vi'].helpTouch="<p><b>Điều khiển:</b> cần để bơi. Chạm nước để hướng. Nút dưới: ăn, chia, bào tử, tự động. Chụm để phóng.</p>";T['vi'].setLang="Ngôn ngữ";
if(!T['zh-TW'])T['zh-TW']={};T['zh-TW'].exitAsk="要離開嗎？";T['zh-TW'].exitMsg="這一生的進度將會失去。";T['zh-TW'].yes="是";T['zh-TW'].no="否";T['zh-TW'].more="更多";T['zh-TW'].deadYours="你的細胞死了";T['zh-TW'].aliveWord="存活";T['zh-TW'].deadOther="其他";T['zh-TW'].helpTouch="<p><b>操作：</b>搖桿游泳。點水決定方向。下方按鈕：吃、分裂、孢子、自動。雙指縮放。</p>";T['zh-TW'].setLang="語言";
