import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.04-Src/i18n');
const skip = new Set(['es', 'tr', 'fil']);
const extra = {
  'pt-BR': { loadingWorld:'Montando o lago…', economy:'Modo econômico', economyAsk:'Menos de 25 quadros. O modo econômico está nos ajustes: menos legendas, lago −30%.', demoTipTouch:'<b>DEMO</b> · arraste para voar · 1–6 muda o grupo · toque numa célula para entrar<br>', camFlyTouch:'Câmera livre' },
  id: { loadingWorld:'Menyusun kolam…', economy:'Mode hemat', economyAsk:'Kurang dari 25 gambar. Mode hemat ada di pengaturan: lebih sedikit tulisan, kolam −30%.', demoTipTouch:'<b>DEMO</b> · geser untuk terbang · 1–6 pindah kelompok · ketuk sel untuk masuk<br>', camFlyTouch:'Kamera bebas' },
  de: { loadingWorld:'Der Teich wird aufgebaut…', economy:'Sparmodus', economyAsk:'Unter 25 Bildern. Der Sparmodus steht in den Einstellungen: weniger Beschriftungen, Teich −30 %.', demoTipTouch:'<b>DEMO</b> · ziehen zum Fliegen · 1–6 wechselt die Gruppe · Zelle antippen zum Betreten<br>', camFlyTouch:'Freie Kamera' },
  fr: { loadingWorld:'Le bassin se construit…', economy:'Mode économe', economyAsk:'Moins de 25 images. Le mode économe est dans les réglages : moins de légendes, bassin −30 %.', demoTipTouch:'<b>DÉMO</b> · glisser pour voler · 1–6 change de groupe · toucher une cellule pour entrer<br>', camFlyTouch:'Caméra libre' },
  hi: { loadingWorld:'तालाब बन रहा है…', economy:'किफायती मोड', economyAsk:'25 से कम चित्र। किफायती मोड सेटिंग में है: कम लेख, तालाब −30%.', demoTipTouch:'<b>डेमो</b> · उड़ने के लिए खींचें · 1–6 समूह · कोशिका छूकर अंदर जाएँ<br>', camFlyTouch:'मुक्त कैमरा' },
  ja: { loadingWorld:'池を作っています…', economy:'節約モード', economyAsk:'25フレーム未満です。節約モードは設定にあります。表示を減らし、池は−30%。', demoTipTouch:'<b>デモ</b> · ドラッグで飛ぶ · 1–6でグループ · 細胞をタップして入る<br>', camFlyTouch:'自由カメラ' },
  vi: { loadingWorld:'Đang dựng ao…', economy:'Chế độ tiết kiệm', economyAsk:'Dưới 25 khung hình. Chế độ tiết kiệm nằm trong cài đặt: ít chữ hơn, ao −30%.', demoTipTouch:'<b>DEMO</b> · kéo để bay · 1–6 đổi nhóm · chạm tế bào để vào<br>', camFlyTouch:'Camera tự do' },
  ko: { loadingWorld:'연못을 만드는 중…', economy:'절약 모드', economyAsk:'25프레임 미만입니다. 절약 모드는 설정에 있습니다. 글자를 줄이고 연못은 −30%.', demoTipTouch:'<b>데모</b> · 끌어 날기 · 1–6 무리 이동 · 세포를 눌러 들어가기<br>', camFlyTouch:'자유 카메라' },
  th: { loadingWorld:'กำลังสร้างบ่อ…', economy:'โหมดประหยัด', economyAsk:'ต่ำกว่า 25 ภาพ โหมดประหยัดอยู่ในตั้งค่า: ตัวหนังสือน้อยลง บ่อ −30%', demoTipTouch:'<b>เดโม</b> · ลากเพื่อบิน · 1–6 เปลี่ยนกลุ่ม · แตะเซลล์เพื่อเข้า<br>', camFlyTouch:'กล้องอิสระ' },
  it: { loadingWorld:'Sto costruendo lo stagno…', economy:'Modalità risparmio', economyAsk:'Meno di 25 fotogrammi. La modalità risparmio è nelle impostazioni: meno scritte, stagno −30%.', demoTipTouch:'<b>DEMO</b> · trascina per volare · 1–6 cambia gruppo · tocca una cellula per entrare<br>', camFlyTouch:'Camera libera' },
  pl: { loadingWorld:'Budujemy staw…', economy:'Tryb oszczędny', economyAsk:'Poniżej 25 klatek. Tryb oszczędny jest w ustawieniach: mniej podpisów, staw −30%.', demoTipTouch:'<b>DEMO</b> · przeciągnij, by lecieć · 1–6 zmienia grupę · dotknij komórki, by wejść<br>', camFlyTouch:'Wolna kamera' },
  uk: { loadingWorld:'Збираємо ставок…', economy:'Ощадний режим', economyAsk:'Менше ніж 25 кадрів. Ощадний режим у налаштуваннях: менше підписів, ставок −30%.', demoTipTouch:'<b>ДЕМО</b> · палець рухає камеру · 1–6 група · дотик клітини — увійти<br>', camFlyTouch:'Вільна камера' },
  'zh-TW': { loadingWorld:'正在建造池塘…', economy:'省電模式', economyAsk:'低於 25 張畫面。省電模式在設定裡：較少文字，池塘 −30%。', demoTipTouch:'<b>示範</b> · 拖曳飛行 · 1–6 換組 · 點細胞進入<br>', camFlyTouch:'自由鏡頭' },
  ms: { loadingWorld:'Membina kolam…', economy:'Mod jimat', economyAsk:'Bawah 25 bingkai. Mod jimat ada dalam tetapan: kurang kapsyen, kolam −30%.', demoTipTouch:'<b>DEMO</b> · seret untuk terbang · 1–6 tukar kumpulan · ketik sel untuk masuk<br>', camFlyTouch:'Kamera bebas' },
  bn: { loadingWorld:'পুকুর তৈরি হচ্ছে…', economy:'সাশ্রয়ী অবস্থা', economyAsk:'২৫ ছবির কম। সাশ্রয়ী অবস্থা সেটিংসে: কম লেখা, পুকুর −৩০%।', demoTipTouch:'<b>ডেমো</b> · টেনে উড়ুন · ১–৬ দল · কোষে ছুঁয়ে ঢুকুন<br>', camFlyTouch:'মুক্ত ক্যামেরা' },
  ru: { loadingWorld:'Собираем пруд…', economy:'Экономный режим', economyAsk:'Кадров меньше 25. Экономный режим — в настройках: меньше подписей, бассейн −30%.', demoTipTouch:'<b>ДЕМО</b> · палец двигает камеру · 1–6 группа · касание клетки — войти<br>', camFlyTouch:'Свободная камера' },
  en: { loadingWorld:'Building the pond…', economy:'Economy mode', economyAsk:'Frame rate is under 25. Economy mode is in Settings: fewer captions, pool −30%.', demoTipTouch:'<b>DEMO</b> · drag to fly · 1–6 jump group · tap a cell to enter<br>', camFlyTouch:'Free cam' }
};

for (const code of Object.keys(extra)) {
  if (skip.has(code)) continue;
  const file = path.join(dir, code + '.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(data, extra[code]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('ok', code);
}
