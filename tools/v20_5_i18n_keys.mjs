import fs from 'fs';
import path from 'path';
const dir = 'C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/i18n';
const pack = {
  en: { exitAsk:'Exit?', exitMsg:'Progress of this life will be lost.', yes:'Yes', no:'No', more:'More', deadYours:'Your cell died', aliveWord:'alive', deadOther:'Other', setLang:'Language', helpTouch:'<p><b>Controls:</b> Drag the joystick to swim. Tap the water to aim. Bottom buttons: Eat, Divide, Spore, Auto. Pinch to zoom.</p>' },
  ru: { exitAsk:'Выйти?', exitMsg:'Прогресс этой жизни будет потерян.', yes:'Да', no:'Нет', more:'Ещё', deadYours:'Ваша клетка погибла', aliveWord:'живых', deadOther:'Прочее', setLang:'Язык', helpTouch:'<p><b>Управление:</b> Джойстик — плыть. Касание воды — направление. Нижние кнопки: есть, делиться, спора, авто. Щипок — масштаб.</p>' },
  de: { exitAsk:'Beenden?', exitMsg:'Der Fortschritt dieses Lebens geht verloren.', yes:'Ja', no:'Nein', more:'Mehr', deadYours:'Deine Zelle ist gestorben', aliveWord:'lebend', deadOther:'Sonstiges', setLang:'Sprache', helpTouch:'<p><b>Steuerung:</b> Joystick zum Schwimmen. Tippe ins Wasser für die Richtung. Unten: Fressen, Teilen, Spore, Auto. Ziehen zum Zoomen.</p>' },
  fr: { exitAsk:'Quitter ?', exitMsg:'La progression de cette vie sera perdue.', yes:'Oui', no:'Non', more:'Plus', deadYours:'Votre cellule est morte', aliveWord:'vivants', deadOther:'Autre', setLang:'Langue', helpTouch:'<p><b>Commandes :</b> joystick pour nager. Touchez l’eau pour viser. Boutons du bas : manger, diviser, spore, auto. Pincez pour zoomer.</p>' },
  es: { exitAsk:'¿Salir?', exitMsg:'Se perderá el progreso de esta vida.', yes:'Sí', no:'No', more:'Más', deadYours:'Tu célula murió', aliveWord:'vivos', deadOther:'Otros', setLang:'Idioma', helpTouch:'<p><b>Controles:</b> joystick para nadar. Toca el agua para apuntar. Botones de abajo: comer, dividir, espora, auto. Pellizca para zoom.</p>' },
  pt: { exitAsk:'Sair?', exitMsg:'O progresso desta vida será perdido.', yes:'Sim', no:'Não', more:'Mais', deadYours:'Sua célula morreu', aliveWord:'vivos', deadOther:'Outros', setLang:'Idioma', helpTouch:'<p><b>Controles:</b> joystick para nadar. Toque na água para mirar. Botões de baixo: comer, dividir, esporo, auto. Belisque para zoom.</p>' },
  it: { exitAsk:'Uscire?', exitMsg:'I progressi di questa vita andranno persi.', yes:'Sì', no:'No', more:'Altro', deadYours:'La tua cellula è morta', aliveWord:'vivi', deadOther:'Altro', setLang:'Lingua', helpTouch:'<p><b>Comandi:</b> joystick per nuotare. Tocca l’acqua per mirare. Pulsanti in basso: mangia, dividi, spora, auto. Pizzica per lo zoom.</p>' },
  pl: { exitAsk:'Wyjść?', exitMsg:'Postęp tego życia przepadnie.', yes:'Tak', no:'Nie', more:'Więcej', deadYours:'Twoja komórka zginęła', aliveWord:'żywych', deadOther:'Inne', setLang:'Język', helpTouch:'<p><b>Sterowanie:</b> joystick pływa. Dotknij wody, by celować. Dolne przyciski: jedz, dziel, spora, auto. Uszczypnij, by przybliżyć.</p>' },
  uk: { exitAsk:'Вийти?', exitMsg:'Прогрес цього життя буде втрачено.', yes:'Так', no:'Ні', more:'Ще', deadYours:'Ваша клітина загинула', aliveWord:'живих', deadOther:'Інше', setLang:'Мова', helpTouch:'<p><b>Керування:</b> джойстик — плисти. Дотик води — напрям. Нижні кнопки: їсти, ділитися, спора, авто. Щипок — масштаб.</p>' },
  id: { exitAsk:'Keluar?', exitMsg:'Kemajuan hidup ini akan hilang.', yes:'Ya', no:'Tidak', more:'Lainnya', deadYours:'Selmu mati', aliveWord:'hidup', deadOther:'Lainnya', setLang:'Bahasa', helpTouch:'<p><b>Kontrol:</b> joystick untuk berenang. Ketuk air untuk mengarah. Tombol bawah: makan, belah, spora, auto. Cubit untuk zoom.</p>' },
  ms: { exitAsk:'Keluar?', exitMsg:'Kemajuan hayat ini akan hilang.', yes:'Ya', no:'Tidak', more:'Lagi', deadYours:'Sel anda mati', aliveWord:'hidup', deadOther:'Lain', setLang:'Bahasa', helpTouch:'<p><b>Kawalan:</b> kayu bedik untuk berenang. Ketik air untuk hala. Butang bawah: makan, bahagi, spora, auto. Cubit untuk zum.</p>' },
  tr: { exitAsk:'Çıkılsın mı?', exitMsg:'Bu yaşamın ilerlemesi silinecek.', yes:'Evet', no:'Hayır', more:'Daha', deadYours:'Hücren öldü', aliveWord:'canlı', deadOther:'Diğer', setLang:'Dil', helpTouch:'<p><b>Kontrol:</b> yüzmek için joystick. Yön için suya dokun. Alt düğmeler: ye, böl, spor, otomatik. Yakınlaştırmak için sıkıştır.</p>' },
  vi: { exitAsk:'Thoát?', exitMsg:'Tiến trình đời này sẽ mất.', yes:'Có', no:'Không', more:'Thêm', deadYours:'Tế bào của bạn đã chết', aliveWord:'sống', deadOther:'Khác', setLang:'Ngôn ngữ', helpTouch:'<p><b>Điều khiển:</b> cần để bơi. Chạm nước để hướng. Nút dưới: ăn, chia, bào tử, tự động. Chụm để phóng.</p>' },
  fil: { exitAsk:'Lumabas?', exitMsg:'Mawawala ang progreso ng buhay na ito.', yes:'Oo', no:'Hindi', more:'Iba pa', deadYours:'Namatay ang cell mo', aliveWord:'buhay', deadOther:'Iba', setLang:'Wika', helpTouch:'<p><b>Kontrol:</b> joystick para lumangoy. Pindutin ang tubig para tumutok. Mga pindutan sa ibaba: kain, hati, spore, auto. Kuran para mag-zoom.</p>' },
  hi: { exitAsk:'बाहर जाएँ?', exitMsg:'इस जीवन की प्रगति मिट जाएगी।', yes:'हाँ', no:'नहीं', more:'और', deadYours:'आपकी कोशिका मर गई', aliveWord:'जीवित', deadOther:'अन्य', setLang:'भाषा', helpTouch:'<p><b>नियंत्रण:</b> तैरने के लिए जॉयस्टिक। दिशा के लिए पानी छुएँ। नीचे के बटन: खाओ, बाँटो, बीजाणु, ऑटो। ज़ूम के लिए पिंच।</p>' },
  bn: { exitAsk:'বের হবেন?', exitMsg:'এই জীবনের অগ্রগতি মুছে যাবে।', yes:'হ্যাঁ', no:'না', more:'আরও', deadYours:'আপনার কোষ মারা গেছে', aliveWord:'জীবিত', deadOther:'অন্য', setLang:'ভাষা', helpTouch:'<p><b>নিয়ন্ত্রণ:</b> সাঁতারের জন্য জয়স্টিক। দিকের জন্য জল ছুঁয়ে। নিচের বোতাম: খাও, ভাগ, স্পোর, অটো। জুমে চিমটি।</p>' },
  th: { exitAsk:'ออกหรือไม่?', exitMsg:'ความคืบหน้าของชีวิตนี้จะหายไป', yes:'ใช่', no:'ไม่', more:'เพิ่มเติม', deadYours:'เซลล์ของคุณตายแล้ว', aliveWord:'มีชีวิต', deadOther:'อื่น ๆ', setLang:'ภาษา', helpTouch:'<p><b>ควบคุม:</b> จอยสติ๊กเพื่อว่ายน้ำ แตะน้ำเพื่อเล็ง ปุ่มล่าง: กิน แบ่ง สปอร์ อัตโนมัติ บีบเพื่อซูม</p>' },
  ja: { exitAsk:'終了しますか？', exitMsg:'この命の進行は失われます。', yes:'はい', no:'いいえ', more:'その他', deadYours:'あなたの細胞は死にました', aliveWord:'生存', deadOther:'その他', setLang:'言語', helpTouch:'<p><b>操作:</b> ジョイスティックで泳ぐ。水をタップして向き。下のボタン: 食べる、分裂、胞子、自動。ピンチで拡大。</p>' },
  ko: { exitAsk:'나갈까요?', exitMsg:'이번 삶의 진행이 사라집니다.', yes:'예', no:'아니요', more:'더보기', deadYours:'당신의 세포가 죽었습니다', aliveWord:'생존', deadOther:'기타', setLang:'언어', helpTouch:'<p><b>조작:</b> 조이스틱으로 헤엄. 물을 눌러 방향. 아래 버튼: 먹기, 분열, 포자, 자동. 집어서 확대.</p>' },
  zh: { exitAsk:'要離開嗎？', exitMsg:'這一生的進度將會失去。', yes:'是', no:'否', more:'更多', deadYours:'你的細胞死了', aliveWord:'存活', deadOther:'其他', setLang:'語言', helpTouch:'<p><b>操作：</b>搖桿游泳。點水決定方向。下方按鈕：吃、分裂、孢子、自動。雙指縮放。</p>' }
};
const fileFor = { 'pt-BR':'pt', 'zh-TW':'zh' };
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith('.json') || name.includes('allow') || name.includes('status') || name.includes('v1')) continue;
  const code = name.replace('.json','');
  const key = fileFor[code] || code;
  const add = pack[key];
  if (!add) { console.log('skip', code); continue; }
  const p = path.join(dir, name);
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  Object.assign(obj, add);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  console.log('ok', code);
}
