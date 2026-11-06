// v24: генератор L5 (13 языков) + L6 (9 языков) — компактные из hr-базы
const fs = require('fs');
const hr = JSON.parse(fs.readFileSync('.04-Src/i18n/hr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('.04-Src/i18n/en.json', 'utf8'));

function makeLang(code, keys, opts) {
  const d = JSON.parse(JSON.stringify(hr));
  for (const k in keys) d[k] = keys[k];
  for (const k in en) if (!(k in d)) d[k] = en[k];
  fs.writeFileSync('.04-Src/i18n/' + code + '.json', JSON.stringify(d, null, 2) + '\n');
  console.log(code + ':', Object.keys(d).length, 'miss:', Object.keys(en).filter(k=>!(k in d)).length);
  const L = JSON.parse(fs.readFileSync('.04-Src/i18n/languages.json', 'utf8'));
  if (!L.find(x => x.code === code)) L.push({
    code, name: opts.native, native: opts.native, wave: opts.wave || 13,
    enabled: false, readyForReview: true, font: opts.font || 'system',
    plural: opts.plural, script: opts.script, dir: opts.dir || 'ltr',
    digits: opts.digits || 'latn', playListing: opts.listing !== false,
    register: opts.register || 'formal', critics: []
  });
  fs.writeFileSync('.04-Src/i18n/languages.json', JSON.stringify(L, null, 2) + '\n');
}

// Общие ключи для романско-европейских
const romCommon = (s, d) => ({
  'start':'START', 'demo':s.demo, 'help':s.help, 'wiki':'WIKI', 'aquarium':s.aq,
  'resume':s.resume, 'set':s.set, 'settingsT':s.setT, 'setLang':s.lang,
  'menuSub':s.menuSub, 'poolWill':s.poolWill, 'diffE':s.e, 'diffN':s.n, 'diffH':s.h,
  'exitAsk':s.exit, 'exitMsg':s.exitMsg, 'yes':s.yes, 'no':s.no, 'more':s.more,
  'deadYours':s.deadY, 'aliveWord':s.alive, 'deadOther':s.other,
  'errGeneric':s.err, 'errAsync':s.errA, 'loadingWorld':s.load, 'economy':s.eco, 'economyAsk':s.ecoA,
  'camFlyTouch':s.camFly, 'roleOk':s.roleOk, 'roleWho':s.roleWho, 'roleFood':s.roleFood,
  'topOfList':s.top, 'speciesWord':s.species, 'close':s.close, 'clear':s.clear,
  'restart':s.restart, 'play':s.play, 'next':s.next, 'skip':s.skip,
  'speciesShown.one':s.sp1, 'speciesShown.other':s.spO,
  'coloniesCount.one':s.col1, 'coloniesCount.other':s.colO,
  'aliveCount.one':s.al1, 'aliveCount.other':s.alO,
  'wikiT':s.wikiT, 'wiki.searchPh':s.searchPh
});

// ===== L5: 13 языков =====
// ca (каталанский)
makeLang('ca', romCommon({
  demo:'DEMO / Galeria', help:'COM JUGAR', aq:'ACVARI',
  resume:'CONTINUA', set:'CONFIGURACIÓ', setT:'Configuració', lang:'Idioma',
  menuSub:'Simulació de microorganismes — {n} espècies + virus. Secció transversal d\'un estany.',
  poolWill:'A l\'estany: ~{n} organismes · {kinds} espècies',
  e:'Fàcil', n:'Normal', h:'Difícil', exit:'Sortir?', exitMsg:'Es perdrà el progrés d\'aquesta vida.',
  yes:'Sí', no:'No', more:'Més', deadY:'La teva cèl·lula ha mort', alive:'vives', other:'Altres',
  err:'Error', errA:'Error asíncron', load:'Construint l\'estany…', eco:'Mode econòmic',
  ecoA:'Menys de 25 fps. Mode econòmic a configuració: menys etiquetes, estany −30%.',
  camFly:'Càmera lliure', roleOk:'Entesos — nado', roleWho:'Qui ets / què menges', roleFood:'Menjar',
  top:'a l\'inici de la llista', species:'espècies', close:'TANCA', clear:'Esborra',
  restart:'REINICIA', play:'Juga', next:'Següent', skip:'Salta',
  sp1:'{n} espècie', spO:'{n} espècies', col1:'{n} colònia', colO:'{n} colònies',
  al1:'{n} viu', alO:'{n} vius', wikiT:'Wiki: Vida a l\'estany', searchPh:'Cerca...'
}, {}), { native:'Català', font:'system', plural:'ca', script:'latn', dir:'ltr', digits:'latn', register:'tu' });

// gl (галисийский)
makeLang('gl', romCommon({
  demo:'DEMO / Galería', help:'COMO XOGAR', aq:'ACUARIO',
  resume:'CONTINUAR', set:'AXUSTES', setT:'Axustes', lang:'Idioma',
  menuSub:'Simulación de microorganismos — {n} especies + virus. Sección transversal dun lago.',
  poolWill:'No lago: ~{n} organismos · {kinds} especies',
  e:'Fácil', n:'Normal', h:'Difícil', exit:'Saír?', exitMsg:'Perderase o progreso desta vida.',
  yes:'Si', no:'Non', more:'Máis', deadY:'A túa célula morreu', alive:'vivas', other:'Outras',
  err:'Erro', errA:'Erro asíncrono', load:'Construíndo o lago…', eco:'Modo económico',
  ecoA:'Menos de 25 fps. Modo económico en axustes: menos etiquetas, lago −30%.',
  camFly:'Cámara libre', roleOk:'Entendido — nado', roleWho:'Quen es / que comes', roleFood:'Comida',
  top:'ao comezo da lista', species:'especies', close:'PECHAR', clear:'Borrar',
  restart:'REINICIAR', play:'Xogar', next:'Seguinte', skip:'Saltar',
  sp1:'{n} especie', spO:'{n} especies', col1:'{n} colonia', colO:'{n} colonias',
  al1:'{n} vivo', alO:'{n} vivos', wikiT:'Wiki: Vida no lago', searchPh:'Buscar...'
}, {}), { native:'Galego', font:'system', plural:'gl', script:'latn', dir:'ltr', digits:'latn', register:'ti' });

// eu (баскский)
makeLang('eu', romCommon({
  demo:'DEMO / Galeria', help:'NOLA JOKATU', aq:'AKUARIOA',
  resume:'JARRAITU', set:'EZARPENAK', setT:'Ezarpenak', lang:'Hizkuntza',
  menuSub:'Mikroorganismoen simulazioa — {n} espezie + birusak. Ibaiaren zeharkako ikuspegia.',
  poolWill:'Ibaian: ~{n} organism · {kinds} espezie',
  e:'Erraza', n:'Normala', h:'Zaila', exit:'Irten?', exitMsg:'Bizitza honen aurrerapena galduko da.',
  yes:'Bai', no:'Ez', more:'Gehiago', deadY:'Zure zelula hil da', alive:'bizirik', other:'Beste',
  err:'Errorea', errA:'Errore asinkronoa', load:'Ibaia eraikitzen…', eco:'Ekonomia modua',
  ecoA:'25 fps-tik behera. Ekonomia modua ezarpenetan: etiketa gutxiago, ibaia −30%.',
  camFly:'Kamera librea', roleOk:'Ulertu dut — igeri egingo dut', roleWho:'Nor zara / zer jaten duzu', roleFood:'Janaria',
  top:'zerrendaren hasieran', species:'espezie', close:'ITXI', clear:'Garbitu',
  restart:'BERRABIARAZI', play:'Jolastu', next:'Hurrengoa', skip:'Saltatu',
  sp1:'{n} espezie', spO:'{n} espezie', col1:'{n} kolonia', colO:'{n} kolonia',
  al1:'{n} bizirik', alO:'{n} bizirik', wikiT:'Wiki: Bizia ibaian', searchPh:'Bilatu...'
}, {}), { native:'Euskara', font:'system', plural:'eu', script:'latn', dir:'ltr', digits:'latn', register:'hi' });

// sq (албанский)
makeLang('sq', romCommon({
  demo:'DEMO / Galeri', help:'SI LUASH', aq:'AKUARIUM',
  resume:'VAZHDO', set:'CILËSIMET', setT:'Cilësimet', lang:'Gjuha',
  menuSub:'Simulim i mikroorganizmave — {n} lloje + viruse. Prerje e pellgut.',
  poolWill:'Në pellg: ~{n} organizma · {kinds} lloje',
  e:'Lehtë', n:'Normale', h:'Vështirë', exit:'Dalje?', exitMsg:'Përparimi i kësaj jete do të humbet.',
  yes:'Po', no:'Jo', more:'Më shumë', deadY:'Qeliza jote vdiq', alive:'gjallë', other:'Tjetër',
  err:'Gabim', errA:'Gabim asinkron', load:'Ndërtojmë pellgun…', eco:'Modaliteti ekonomik',
  ecoA:'Nën 25 fps. Modaliteti ekonomik në cilësimet: më pak etiketa, pellg −30%.',
  camFly:'Kamere e lirë', roleOk:'E kuptova — notoj', roleWho:'Kush je / çfarë ha', roleFood:'Ushqim',
  top:'në fillim të listës', species:'lloje', close:'MBYLL', clear:'Pastro',
  restart:'RIFILLONI', play:'Luaj', next:'Tjetra', skip:'Kalo',
  sp1:'{n} lloj', spO:'{n} lloje', col1:'{n} koloni', colO:'{n} koloni',
  al1:'{n} gjallë', alO:'{n} gjallë', wikiT:'Wiki: Jeta në pellg', searchPh:'Kërko...'
}, {}), { native:'Shqip', font:'system', plural:'sq', script:'latn', dir:'ltr', digits:'latn', register:'ti' });

// mk (македонский)
makeLang('mk', romCommon({
  demo:'ДЕМО / Галерија', help:'КАКО СЕ ИГРА', aq:'АКВАРИУМ',
  resume:'ПРОДОЛЖИ', set:'ПОСТАВКИ', setT:'Поставки', lang:'Јазик',
  menuSub:'Симулација на микроорганизми — {n} видови + вируси. Пресек на барa.',
  poolWill:'Во барата: ~{n} организми · {kinds} видови',
  e:'Лесно', n:'Нормално', h:'Тешко', exit:'Излез?', exitMsg:'Напредокот на овој живот ќе се загуби.',
  yes:'Да', no:'Не', more:'Повеќе', deadY:'Твоята клетка умря', alive:'живи', other:'Други',
  err:'Грешка', errA:'Асинхрона грешка', load:'Градиме барата…', eco:'Економичен режим',
  ecoA:'Под 25 fps. Економичен режим во поставките: помалку етикети, базен −30%.',
  camFly:'Слободна камера', roleOk:'Разбрав — пливам', roleWho:'Кој си / што јадеш', roleFood:'Храна',
  top:'на почетокот на листата', species:'видови', close:'ЗАТВОРИ', clear:'Избриши',
  restart:'РЕСТАРТ', play:'Играј', next:'Следно', skip:'Прескокни',
  sp1:'{n} вид', spO:'{n} видови', col1:'{n} колонија', colO:'{n} колонии',
  al1:'{n} жив', alO:'{n} живи', wikiT:'Вики: Живот во барата', searchPh:'Барај...'
}, {}), { native:'Македонски', font:'system', plural:'mk', script:'cyrl', dir:'ltr', digits:'latn', register:'ти' });

// is (исландский)
makeLang('is', romCommon({
  demo:'DEMO / Safn', help:'HVERNIG Á AÐ SPILA', aq:'AKVARÍUM',
  resume:'HALDA ÁFRAM', set:'STILLINGAR', setT:'Stillingar', lang:'Tungumál',
  menuSub:'Örverumaður — {n} tegundir + veirur. Þverskurur af tjörn.',
  poolWill:'Í tjörninni: ~{n} lífverur · {kinds} tegundir',
  e:'Auðvelt', n:'Venjulegt', h:'Erfitt', exit:'Fara út?', exitMsg:'Framvindan í þessu lífi tapast.',
  yes:'Já', no:'Nei', more:'Meira', deadY:'Fruman þín dó', alive:'lifandi', other:'Annað',
  err:'Villa', errA:'Ósamstæð villa', load:'Bygg tjörnina…', eco:'Sparnaðarhamur',
  ecoA:'Undir 25 fps. Sparnaðarhamur í stillingum: færri merkingar, tjörn −30%.',
  camFly:'Frjálst myndavél', roleOk:'Skil — ætla að synda', roleWho:'Hver þú ert / hvað þú borðar', roleFood:'Fæða',
  top:'efst á lista', species:'tegundir', close:'LOKA', clear:'Hreinsa',
  restart:'ENDURSETJA', play:'Spila', next:'Næsta', skip:'Sleppa',
  sp1:'{n} tegund', spO:'{n} tegundir', col1:'{n} nýlenda', colO:'{n} nýlendur',
  al1:'{n} lifandi', alO:'{n} lifandi', wikiT:'Wiki: Lífið í tjörninni', searchPh:'Leita...'
}, {}), { native:'Íslenska', font:'system', plural:'is', script:'latn', dir:'ltr', digits:'latn', register:'þú' });

// af zu no + remaining L5 (компактные)
makeLang('af', romCommon({
  demo:'DEMO / Galery', help:'HOE OM TE SPEEL', aq:'AKWARIUM',
  resume:'GAAN VOORT', set:'INSTELLINGS', setT:'Instellings', lang:'Taal',
  menuSub:'Mikroörganisme-simulasie — {n} spesies + virusse. Deursnee van dam.',
  poolWill:'In die dam: ~{n} organismes · {kinds} spesies',
  e:'Maklik', n:'Normaal', h:'Moeilik', exit:'Uitgaan?', exitMsg:'Vordering van hierdie lewe sal verlore gaan.',
  yes:'Ja', no:'Nee', more:'Meer', deadY:'Jou sel het gesterf', alive:'lewend', other:'Ander',
  err:'Fout', errA:'Asinkrone fout', load:'Bou die dam…', eco:'Ekonomiese modus',
  ecoA:'Onder 25 rps. Ekonomiese modus in instellings: minder etikette, dam −30%.',
  camFly:'Vry kamera', roleOk:'Verstaan — ek swem', roleWho:'Wie jy is / wat jy eet', roleFood:'Kos',
  top:'bo aan die lys', species:'spesies', close:'MAAK TOE', clear:'Vee uit',
  restart:'HERBEGIN', play:'Speel', next:'Volgende', skip:'Slaan oor',
  sp1:'{n} spesie', spO:'{n} spesies', col1:'{n} kolonie', colO:'{n} kolonies',
  al1:'{n} lewend', alO:'{n} lewend', wikiT:'Wiki: Lewe in die dam', searchPh:'Soek...'
}, {}), { native:'Afrikaans', font:'system', plural:'af', script:'latn', dir:'ltr', digits:'latn', register:'jy' });

makeLang('zu', romCommon({
  demo:'DEMO / Umboniso', help:'INDLELA YOKUDLALA', aq:'AManzi Abomvu',
  resume:'QHUBEKA', set:'IZILUNGELO', setT:'Izilungelo', lang:'Ulimi',
  menuSub:'Ukuhlolwa kwezimboni — {n} izinhlobo + amagciwane. Isithombe sangaphakathi somthombo.',
  poolWill:'Emthombeni: ~{n} izinto eziphilayo · {kinds} izinhlobo',
  e:'Kulula', n:'Okujwayelekile', h:'Kunzima', exit:'Phuma?', exitMsg:'Inqubekelaphambili yale mpilo izolahleka.',
  yes:'Yebo', no:'Cha', more:'Okuningi', deadY:'I-cell yakho ifile', alive:'philayo', other:'Okunye',
  err:'Iphutha', errA:'Iphutha elingahambisani', load:'Yakha ithombo…', eco:'Indlela yomnotho',
  ecoA:'Ngaphansi kwama-25 fps. Indlela yomnotho ezilungeni: amalebula amancane, ithombo −30%.',
  camFly:'Ikhamela enkululekile', roleOk:'Ngiyazwile — ngizogebha', roleWho:'Ungubani / udla ini', roleFood:'Ukudla',
  top:'phezulu kohlu', species:'izinhlobo', close:'VALA', clear:'Sula',
  restart:'QALA KABUSHA', play:'Dlala', next:'Okulandelayo', skip:'Yeqa',
  sp1:'{n} uhlobo', spO:'{n} izinhlobo', col1:'{n} ikholoni', colO:'{n} amakholoni',
  al1:'{n} ophilayo', alO:'{n} abaphilayo', wikiT:'Wiki: Impilo emthombeni', searchPh:'Sesha...'
}, {}), { native:'isiZulu', font:'system', plural:'zu', script:'latn', dir:'ltr', digits:'latn', register:'wena' });

// km lo am hy ka — краткие стартеры с основными ключами
makeLang('km', romCommon({
  demo:'ដេមូ / វិចិត្រសាល', help:'របៀបលេង', aq:'អាងទឹក',
  resume:'បន្ត', set:'ការកំណត់', setT:'ការកំណត់', lang:'ភាសា',
  menuSub:'ការក្លែងធ្វើមីក្រូបាក់តេរី — {n} ប្រភេទ + វីរុស។ ផ្នែកឆ្លងកាត់ស្រះ។',
  poolWill:'ក្នុងស្រះ៖ ~{n} សារពាង្គកាយ · {kinds} ប្រភេទ',
  e:'ងាយស្រួល', n:'ធម្មតា', h:'ពិបាក', exit:'ចេញ?', exitMsg:'វឌ្ឍនភាពនៃជីវិតនេះនឹងបាត់បង់។',
  yes:'បាទ', no:'ទេ', more:'ច្រើនទៀត', deadY:'កោសិយារបស់អ្នកបានស្លាប់', alive:'រស់នៅ', other:'ផ្សេងៗ',
  err:'កំហុស', errA:'កំហុសអសមកាល', load:'កំពុងសាងសង់ស្រះ…', eco:'របៀបសេដ្ឋកិច្ច',
  camFly:'កាមេរាសេរី', roleOk:'យល់ហើយ — ហែល', roleWho:'អ្នកជាអ្នកណា / អ្នកស៊ីអ្វី', roleFood:'អាហារ',
  top:'នៅខាងដើមបញ្ជី', species:'ប្រភេទ', close:'បិទ', clear:'សម្អាត',
  restart:'ចាប់ផ្ដើមឡើងវិញ', play:'លេង', next:'បន្ទាប់', skip:'រំលង',
  spO:'{n} ប្រភេទ', colO:'{n} អាណានិគម', alO:'{n} រស់នៅ',
  wikiT:'វិគី- ជីវិតក្នុងស្រះ', searchPh:'ស្វែងរក...'
}, {}), { native:'ខ្មែរ', font:'Noto Sans Khmer', plural:'km', script:'khmr', dir:'ltr', digits:'khmr', register:'អ្នក' });

makeLang('lo', romCommon({
  demo:'ຕົວຢ່າງ / ຄັງສະແດງ', help:'ວິທີການຫຼິ້ນ', aq:'ບ່ອນເກັບປາ',
  resume:'ສືບຕໍ່', set:'ການຕັ້ງຄ່າ', setT:'ການຕັ້ງຄ່າ', lang:'ພາສາ',
  menuSub:'ການຈຳລອງເຊື້ອຈຸລັງ — {n} ຊະນິດ + ໄວຣັສ. ການຕັດຂ້າມບ່ອນນ້ຳ.',
  poolWill:'ໃນບ່ອນນ້ຳ: ~{n} ສິ່ງມີຊີວິດ · {kinds} ຊະນິດ',
  e:'ງ່າຍ', n:'ປົກກະຕິ', h:'ຍາກ', exit:'ອອກ?', exitMsg:'ຄວາມຄືບໜ້າຂອງຊີວິດນີ້ຈະສູນເສຍ.',
  yes:'ແມ່ນ', no:'ບໍ່', more:'ຫຼາຍກວ່າ', deadY:'ເຊລຂອງເຈົ້າໄດ້ຕາຍ', alive:'ມີຊີວິດ', other:'ອື່ນໆ',
  err:'ຜິດພາດ', errA:'ຄວາມຜິດບໍ່ປະສານ', load:'ກຳລັງສ້າງບ່ອນນ້ຳ…', eco:'ຮູບແບບປະຫຍັດ',
  camFly:'ກ້ອງສະຫງ່າຈາກຄົນອື່ນ', roleOk:'ເຂົ້າໃຈແລ້ວ — ລອຍນ້ຳ', roleWho:'ເຈົ້າແມ່ນໃຜ / ເຈົ້າກິນຫຍັງ', roleFood:'ອາຫານ',
  top:'ຢູ່ເທິງສຸດຂອງລາຍການ', species:'ຊະນິດ', close:'ປິດ', clear:'ລ້າງ',
  restart:'ເລີ່ມຕົ້ນຄືນ', play:'ຫຼິ້ນ', next:'ຕໍ່ໄປ', skip:'ຂ້າມ',
  spO:'{n} ຊະນິດ', colO:'{n} ອານານິຄົມ', alO:'{n} ມີຊີວິດ',
  wikiT:'ວິກິ- ຊີວິດໃນບ່ອນນ້ຳ', searchPh:'ຄົ້ນຫາ...'
}, {}), { native:'ລາວ', font:'Noto Sans Lao', plural:'lo', script:'laoo', dir:'ltr', digits:'laoo', register:'ເຈົ້າ' });

makeLang('am', romCommon({
  demo:'ማሳያ / ማሳያ', help:'እንዴት እንደሚጫወት', aq:'የዓሣ ጣቢያ',
  resume:'ቀጥል', set:'ቅንብሮች', setT:'ቅንብሮች', lang:'ቋንቋ',
  menuSub:'የተባይቲ ፈሳሽ ማስመሰያ — {n} ዝርያዎች + ቫይረሶች። የመስኖ መስቀሪያ።',
  poolWill:'በመስኖ ውስጥ- ~{n} የህይወት አካላት · {kinds} ዝርያዎች',
  e:'ቀላል', n:'መደበኛ', h:'ከባድ', exit:'መውጣት?', exitMsg:'የዚህ ሕይወት እድገት ይጠፋል።',
  yes:'አዎ', no:'አይ', more:'ተጨማሪ', deadY:'የእርስዎ ሴል ሞተ', alive:'ሕያው', other:'ሌላ',
  err:'ስህተት', errA:'ያልተመሳሰለ ስህተት', load:'መስኖ በመገንባት ላይ…', eco:'የቁጠባ ሁነታ',
  camFly:'ነጻ ካሜራ', roleOk:'ተረድቻለሁ — እወምጣለሁ', roleWho:'አንተ ማን ነህ / ምን ትበላለህ', roleFood:'ምግብ',
  top:'በዝርዝሩ ላይ', species:'ዝርያዎች', close:'ዝጋ', clear:'አጽዳ',
  restart:'እንደገና ጀምር', play:'ተጫወት', next:'ቀጣይ', skip:'ዝለል',
  spO:'{n} ዝርያዎች', colO:'{n} ቅኝ ግዛቶች', alO:'{n} ሕያው',
  wikiT:'ዊኪ- ሕይወት በመስኖ', searchPh:'ፈልግ...'
}, {}), { native:'አማርኛ', font:'Noto Sans Ethiopic', plural:'am', script:'ethi', dir:'ltr', digits:'latn', register:'እርስዎ' });

makeLang('hy', romCommon({
  demo:'ԴԵՄՈ / Պատկերասրահ', help:'ԻՆՉՊԵՍ ԽԱՂԱԼ', aq:'ԱԿՎԱՐԻՈՒՄ',
  resume:'ՇԱՐՈՒՆԱԿԵԼ', set:'ԿԱՐԳԱՎԻՃԱԿՆԵՐ', setT:'Կարգավիճակներ', lang:'Լեզու',
  menuSub:'Միկրոօրգանիզմների սիմուլյացիա — {n} տեսակ + վիրուսներ: Լճակի հատված:',
  poolWill:'Լճակում՝ ~{n} օրգանիզմ · {kinds} տեսակ',
  e:'Հեշտ', n:'Սովորական', h:'Դժվար', exit:'Ելք?', exitMsg:'Այս կյանքի առաջընթացը կկորչի։',
  yes:'Այո', no:'Ոչ', more:'Ավելին', deadY:'Քո բջիջը մահացավ', alive:'կենդանի', other:'Այլ',
  err:'Սխալ', errA:'Ասինխրոն սխալ', load:'Կառուցում ենք լճակը…', eco:'Խնայողության ռեժիմ',
  camFly:'Ազատ տեսախցիկ', roleOk:'Հասկացա — լողում եմ', roleWho:'Ով ես դու / ինչ ես ուտում', roleFood:'Սնունդ',
  top:'ցուցակի սկզբում', species:'տեսակ', close:'Փակել', clear:'Մաքրել',
  restart:'ՎԵՐԱԳՈՐծԱՐԿԵԼ', play:'Խաղալ', next:'Հաջորդ', skip:'Բաց թողնել',
  spO:'{n} տեսակ', colO:'{n} գաղութ', alO:'{n} կենդանի',
  wikiT:'Վիքի- Կյանքը լճակում', searchPh:'Որոնել...'
}, {}), { native:'Հայերեն', font:'Noto Sans Armenian', plural:'hy', script:'armn', dir:'ltr', digits:'latn', register:'դու' });

makeLang('ka', romCommon({
  demo:'დემო / გალერეა', help:'როგორ ვითამაშოთ', aq:'აკვარიუმი',
  resume:'გაგრძელება', set:'პარამეტრები', setT:'პარამეტრები', lang:'ენა',
  menuSub:'მიკროორგანიზმთა სიმულაცია — {n} სახეობა + ვირუსები. ტბის განივი კვეთა.',
  poolWill:'ტბაში: ~{n} ორგანიზმი · {kinds} სახეობა',
  e:'მარტივი', n:'ჩვეულებრივი', h:'რთული', exit:'გასვლა?', exitMsg:'ამ სიცოცხლის პროგრესი დაიკარგება.',
  yes:'დიახ', no:'არა', more:'მეტი', deadY:'შენი უჯრედი დაიღუპა', alive:'ცოცხალი', other:'სხვა',
  err:'შეცდომა', errA:'ასინქრონული შეცდომა', load:'ტბას ვაშენებთ…', eco:'ეკონომიური რეჟიმი',
  camFly:'თავისუფალი კამერა', roleOk:'მივხვდი — ცურავ', roleWho:'ვინ ხარ / რას ჭამ', roleFood:'საკვები',
  top:'სიის დასაწყისში', species:'სახეობა', close:'დახურვა', clear:'გასუფთავება',
  restart:'ხელახლა გაშვება', play:'ითამაშე', next:'შემდეგი', skip:'გამოტოვება',
  spO:'{n} სახეობა', colO:'{n} კოლონია', alO:'{n} ცოცხალი',
  wikiT:'ვიკი- სიცოცხლე ტბაში', searchPh:'მოძებნე...'
}, {}), { native:'ქართული', font:'Noto Sans Georgian', plural:'ka', script:'geor', dir:'ltr', digits:'latn', register:'შენ' });

// L6: 9 языков
makeLang('uz', romCommon({
  demo:'DEMO / Galereya', help:'QANDAY O‘YNASH', aq:'AKVARIUM',
  resume:'DAVOM ETISH', set:'SOZLAMALAR', setT:'Sozlamalar', lang:'Til',
  menuSub:'Mikroorganizmlar simulyatsiyasi — {n} tur + viruslar. Hovuz ko‘ndalang kesimi.',
  poolWill:'Hovuzda: ~{n} organizm · {kinds} tur',
  e:'Oson', n:'Normal', h:'Qiyin', exit:'Chiqish?', exitMsg:'Bu hayotning yutuqlari yo‘qoladi.',
  yes:'Ha', no:'Yo‘q', more:'Ko‘proq', deadY:'Sening hujayrang o‘ldi', alive:'tirik', other:'Boshqa',
  err:'Xato', errA:'Asinxron xato', load:'Hovuz qurilmoqda…', eco:'Tejash rejimi',
  camFly:'Erkin kamera', roleOk:'Tushundim — suzaman', roleWho:'Sen kimsan / nima yeyasan', roleFood:'Ovqat',
  top:'ro‘yxat boshida', species:'tur', close:'YOPISH', clear:'Tozalash',
  restart:'QAYTA ISHGАРИШ', play:'O‘ynash', next:'Keyingi', skip:'O‘tkazib yuborish',
  spO:'{n} tur', colO:'{n} koloniya', alO:'{n} tirik',
  wikiT:'Viki- Hovuzdagi hayot', searchPh:'Qidirish...'
}, {}), { native:'Oʻzbek', font:'system', plural:'uz', script:'latn', dir:'ltr', digits:'latn', register:'sen' });

makeLang('tg', romCommon({
  demo:'ДЕМО / Галерея', help:'ЧӢ ТАРЗ БОЗӢ КАРДАМЕШОВАД', aq:'АКВАРИУМ',
  resume:'ИДОМА', set:'ТАНЗИМОТ', setT:'Танзимот', lang:'Забон',
  menuSub:'Модели микробҳо — {n} намуд + вирусҳо. Буриши кӯл.',
  poolWill:'Дар кӯл: ~{n} организм · {kinds} намуд',
  e:'Осон', n:'Муқаррарӣ', h:'Душвор', exit:'Хуруҷ?', exitMsg:'Пешрафти ин ҳаёт гум мешавад.',
  yes:'Ҳа', no:'Не', more:'Бештар', deadY:'Ҳуҷайраи ту мурд', alive:'зинда', other:'Дигар',
  err:'Хато', errA:'Хатои асинхронӣ', load:'Кӯл месозем…', eco:'Ҳолати иқтисодӣ',
  camFly:'Камераи озод', roleOk:'Фаҳмидам — шиноварӣ', roleWho:'Ту кистӣ / чи мехӯрӣ', roleFood:'Ғизо',
  top:'дар аввали рӯйхат', species:'намуд', close:'ПӮШИДАН', clear:'Тоза кардан',
  restart:'АЗ НАВ ОҒОЗ', play:'Бозӣ кун', next:'Оянда', skip:'Гузарондан',
  spO:'{n} намуд', colO:'{n} колония', alO:'{n} зинда',
  wikiT:'Вики- Ҳаёт дар кӯл', searchPh:'Ҷустуҷӯ...'
}, {}), { native:'Тоҷикӣ', font:'system', plural:'tg', script:'cyrl', dir:'ltr', digits:'latn', register:'ту' });

// ps ckb sd — RTL старты (полный перевод из en-фоллбек)
makeLang('ps', romCommon({
  demo:'ډیمو / ګالري', help:'څنګه لوبه کول', aq:'اکواریم',
  resume:'ادامه', set:'تنظیمات', setT:'تنظیمات', lang:'ژبه',
  menuSub:'میکروارګانیزم شبیه سازي — {n} ډول + ویروسونه. د حوض پرس.',
  poolWill:'په حوض کې: ~{n} ژوندي • {kinds} ډولونه',
  e:'اسانه', n:'معمولي', h:'سخت', exit:'وتل؟', exitMsg:'د دې ژوند پرمختګ به ورک شي.',
  yes:'هو', no:'نه', more:'نور', deadY:'ستاسو حجره مړه شوه', alive:'ژوندي', other:'نور',
  err:'تیروتنه', errA:'نا همزمانه تېروتنه', load:'حوض جوړوی…', eco:'اقتصادي حالت',
  camFly:'ازاده کیمره', roleOk:'پوه شوم — لامبو وهي', roleWho:'ته څوک یې / څه خوري', roleFood:'خواړه',
  top:'د لیست په سر', species:'ډولونه', close:'بندول', clear:'پاکول',
  restart:'بیا پیل', play:'لوبه وکړه', next:'بل', skip:'پرېښودل',
  spO:'{n} ډولونه', colO:'{n} کالونۍ', alO:'{n} ژوندي',
  wikiT:'ویکي- د حوض ژوند', searchPh:'پلټنه...'
}, {}), { native:'پښتو', font:'system', plural:'ps', script:'arab', dir:'rtl', digits:'latn', register:'ته', listing:false });

makeLang('ckb', romCommon({
  demo:'دیمۆ / گەلەری', help:'چۆن یاری بکەیت', aq:'ئەکواریۆم',
  resume:'بەردەوامبە', set:'ڕێکخستنەکان', setT:'ڕێکخستنەکان', lang:'زمان',
  menuSub:'شبیه‌سازی مایکرۆئۆرگانیزم — {n} جۆر + ڤایرۆسەکان. پەرەی گۆم.',
  poolWill:'لە گۆمدا: ~{n} زیندەوەر · {kinds} جۆر',
  e:'ئاسان', n:'ئاسایی', h:'سەخت', exit:'دەرچوون؟', exitMsg:'پێشکەوتنی ئەم ژیانە لەدەست دەچێت.',
  yes:'بەڵێ', no:'نەخێر', more:'زیاتر', deadY:'خانەکەت مرد', alive:'زیندوو', other:'هیتر',
  err:'هەڵە', errA:'هەڵەی ناهاوکێش', load:'گۆمەکە دروست دەکەین…', eco:'دۆخی پاشەکەوت',
  camFly:'کامێرای ئازاد', roleOk:'تێگەیشتم — مەلە دەکەم', roleWho:'تۆ کێی / چی دەخۆیت', roleFood:'خواردن',
  top:'لە سەرەتای لیستەکە', species:'جۆر', close:'داخستن', clear:'سڕینەوە',
  restart:'دەستپێکردنەوە', play:'یاری بکە', next:'دواتر', skip:'پەڕاندن',
  spO:'{n} جۆر', colO:'{n} کۆلۆنیا', alO:'{n} زیندوو',
  wikiT:'ویکی- ژیان لە گۆمدا', searchPh:'گەڕان...'
}, {}), { native:'کوردی', font:'system', plural:'ckb', script:'arab', dir:'rtl', digits:'latn', register:'تۆ', listing:false });

makeLang('sd', romCommon({
  demo:'ڊيمو / گيلري', help:'ڪيئن کھيڻ', aq:'اڪويريم',
  resume:'جاري رکو', set:'سيٽنگون', setT:'سيٽنگون', lang:'ٻولي',
  menuSub:'مائڪروجيو سيموليشن — {n} قسم + وائرل. تلاءُ جو ڪراس-سيڪشن.',
  poolWill:'تلاءَ ۾: ~{n} جيوَ · {kinds} قسم',
  e:'آسان', n:'عام', h:'مشڪل', exit:'نڪرڻ؟', exitMsg:'هن زندگي جي ترقي وڃي ويندي.',
  yes:'ها', no:'نه', more:'وڌيڪ', deadY:'توهان جي سيل مئي', alive:'جيئرو', other:'ٻيا',
  err:'غلطي', errA:'غير هم وقت غلطي', load:'تلاءُ ٺاهي رهيا آهيون…', eco:'بچت موڊ',
  camFly:'کير اچادو', roleOk:'سمجهي ورتو — تريس', roleWho:'تون ڪير آهين / ڇا کائين ٿو', roleFood:'کاڌو',
  top:'فهرست جي شروعات ۾', species:'قسم', close:'بند ڪريو', clear:'صاف ڪريو',
  restart:'ٻيهر شروع', play:'کيڏ', next:'اڳيون', skip:'ڇڏي ڏيو',
  spO:'{n} قسم', colO:'{n} ڪالونيون', alO:'{n} جيئرا',
  wikiT:'وڪي- تلاءُ ۾ زندگي', searchPh:'ڳوليو...'
}, {}), { native:'سنڌي', font:'system', plural:'sd', script:'arab', dir:'rtl', digits:'latn', register:'توهان', listing:false });

// as or bs mt
makeLang('as', romCommon({
  demo:'ডেমো / গেলেৰী', help:'কেনেকৈ খেলিব', aq:'একুৱাৰিয়াম',
  resume:'অব্যাহত ৰাখক', set:'ছেটিংছ', setT:'ছেটিংছ', lang:'ভাষা',
  menuSub:'অণুজীৱ ছিমুলেচন — {n} প্ৰজাতি + ভাইৰাছ। পুখুৰীৰ ক্ৰছ-ছেকচন।',
  poolWill:'পুখুৰীত: ~{n} জীৱ · {kinds} প্ৰজাতি',
  e:'সহজ', n:'স্বাভাৱিক', h:'কঠিন', exit:'ওলাই যাব?', exitMsg:'এই জীৱনৰ প্ৰগতি হেৰুৱাব।',
  yes:'হয়', no:'নহয়', more:'অধিক', deadY:'আপোনাৰ কোষ মৰিল', alive:'জীৱিত', other:'অন্য',
  err:'ভুল', errA:'এচিনক্ৰনাছ ভুল', load:'পুখুৰী সাজি আছে…', eco:'সঞ্চয়ী মোড',
  camFly:'মুক্ত কেমেৰা', roleOk:'বুজিলোঁ — সাঁতৰিম', roleWho:'তুমি কোন / কি খায়', roleFood:'খাদ্য',
  top:'তালিকাৰ আৰম্ভণিত', species:'প্ৰজাতি', close:'বন্ধ কৰক', clear:'পৰিষ্কাৰ',
  restart:'পুনৰ আৰম্ভ', play:'খেলক', next:'পৰৱৰ্তী', skip:'এৰাই যাওক',
  spO:'{n} প্ৰজাতি', colO:'{n} উপনিবেশ', alO:'{n} জীৱিত',
  wikiT:'ৱিকি- পুখুৰীত জীৱন', searchPh:'বিচাৰক...'
}, {}), { native:'অসমীয়া', font:'Noto Sans Bengali', plural:'as', script:'beng', dir:'ltr', digits:'beng', register:'আপুনি' });

makeLang('or', romCommon({
  demo:'ଡେମୋ / ଗ୍ୟାଲେରି', help:'କିପରି ଖେଳିବେ', aq:'ଆକ୍ୱାରିୟମ',
  resume:'ଜାରି ରଖନ୍ତୁ', set:'ସେଟିଂସମୂହ', setT:'ସେଟିଂସମୂହ', lang:'ଭାଷା',
  menuSub:'ମାଇକ୍ରୋଅର୍ଗାନିଜିମ ସିମୁଲେସନ — {n} ପ୍ରଜାତି + ଭୂତାଣୁ। ପୋଖରୀ କ୍ରସ୍-ସେକ୍ସନ।',
  poolWill:'ପୋଖରୀରେ: ~{n} ଜୀବ · {kinds} ପ୍ରଜାତି',
  e:'ସହଜ', n:'ସାଧାରଣ', h:'କଠିନ', exit:'ବାହାରିବେ?', exitMsg:'ଏହି ଜୀବନର ପ୍ରଗତି ହଜିଯିବ।',
  yes:'ହଁ', no:'ନା', more:'ଅଧିକ', deadY:'ତୁମର ଜୀବକୋଷ ମୃତ', alive:'ଜୀବନ୍ତ', other:'ଅନ୍ୟ',
  err:'ତ୍ରୁଟି', errA:'ଅସିନ୍କ୍ରୋନସ ତ୍ରୁଟି', load:'ପୋଖରୀ ନିର୍ମାଣ କରୁଛି…', eco:'ସଞ୍ଚୟ ମୋଡ',
  camFly:'ମୁକ୍ତ କ୍ୟାମେରା', roleOk:'ବୁଝିଗଲି — ପହଁରୁଛି', roleWho:'ତୁମେ କିଏ / କଣ ଖାଉଛ', roleFood:'ଖାଦ୍ୟ',
  top:'ତାଲିକାର ଉପରେ', species:'ପ୍ରଜାତି', close:'ବନ୍ଦ କରନ୍ତୁ', clear:'ସଫା କରନ୍ତୁ',
  restart:'ପୁନଃ ଆରମ୍ଭ', play:'ଖେଳନ୍ତୁ', next:'ପରବର୍ତ୍ତୀ', skip:'ଏଡ଼ାନ୍ତୁ',
  spO:'{n} ପ୍ରଜାତି', colO:'{n} ଉପନିବେଶ', alO:'{n} ଜୀବନ୍ତ',
  wikiT:'ଉଇକି- ପୋଖରୀରେ ଜୀବନ', searchPh:'ଖୋଜନ୍ତୁ...'
}, {}), { native:'ଓଡ଼ିଆ', font:'Noto Sans Oriya', plural:'or', script:'orya', dir:'ltr', digits:'orya', register:'ଆପଣ' });

makeLang('bs', romCommon({
  demo:'DEMO / Galerija', help:'KAKO SE IGRA', aq:'AKVARIJ',
  resume:'NASTAVI', set:'POSTAVKE', setT:'Postavke', lang:'Jezik',
  menuSub:'Simulacija mikroorganizama — {n} vrsta + virusi. Presjek bare.',
  poolWill:'U baru: ~{n} organizama · {kinds} vrsta',
  e:'Lako', n:'Normalno', h:'Teško', exit:'Izaći?', exitMsg:'Napredak ovog života bit će izgubljen.',
  yes:'Da', no:'Ne', more:'Više', deadY:'Tvoja ćelija je umrla', alive:'živih', other:'Ostalo',
  err:'Greška', errA:'Asinhrona greška', load:'Gradim bar…', eco:'Uštedni režim',
  camFly:'Slobodna kamera', roleOk:'Razumijem — plivam', roleWho:'Ko si / što jedeš', roleFood:'Hrana',
  top:'na vrhu liste', species:'vrsta', close:'ZATVORI', clear:'Obriši',
  restart:'RESTART', play:'Igraj', next:'Sljedeće', skip:'Preskoči',
  sp1:'{n} vrsta', spF:'{n} vrste', spO:'{n} vrsta', col1:'{n} kolonija', colF:'{n} kolonije', colO:'{n} kolonija',
  al1:'{n} živ', alF:'{n} živa', alO:'{n} živih',
  wikiT:'Wiki: Život u baru', searchPh:'Traži...'
}, {}), { native:'Bosanski', font:'system', plural:'bs', script:'latn', dir:'ltr', digits:'latn', register:'ti' });

makeLang('mt', romCommon({
  demo:'DEMO / Gallerija', help:'KIF TILGĦAB', aq:'AKWARJU',
  resume:'IKOMPLI', set:'SETTIJGHIET', setT:'Is-Settijghiet', lang:'Lingwa',
  menuSub:'Simulazzjoni ta\u2019 mikroorganizmi — {n} speċi + virużi. Sezzjoni ta\u2019 lag.',
  poolWill:'Fil-lag: ~{n} organiżmi · {kinds} speċi',
  e:'Faċli', n:'Normali', h:'Diffiċli', exit:'Toħroġ?', exitMsg:'Il-progress ta\u2019 din il-ħajja se jintilef.',
  yes:'Iva', no:'Le', more:'Aktar', deadY:'Iċ-ċellola tiegħek mietet', alive:'ħajjin', other:'Oħra',
  err:'Żball', errA:'Żball asinkronu', load:'Kunstruwixxi l-lag…', eco:'Mod ta\u2019 tnaqqis',
  camFly:'Kamera ħielsa', roleOk:'Intebbaħ — sejn', roleWho:'Int min / xi tkun tiekol', roleFood:'Ikel',
  'top':'fil-bidu tal-lista', 'species':'speċi', 'close':'AGĦLAQ', 'clear':'Imsħi',
  'restart':'ERĠA IBDA', 'play':'Ilgħab', 'next':'Li jmiss', 'skip':'Aqbeż',
  'spO':'{n} speċi', 'colO':'{n} kolonji', 'alO':'{n} ħajjin',
  wikiT:'Wiki- Ħajja fil-lag', searchPh:'Fittex...'
}, {}), { native:'Malti', font:'system', plural:'mt', script:'latn', dir:'ltr', digits:'latn', register:'int', listing:false });

console.log('L5+L6: 22 словарей готовы');
