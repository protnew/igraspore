// FR-W1.2: скрипт-поиск испанских слов и английских вставок в fil.json и wiki/fil.json.
// Латинские бининамиальные названия видов игнорируются (по ТЗ остаются латиницей).
import fs from 'fs';

const ui = JSON.parse(fs.readFileSync('.04-Src/i18n/fil.json', 'utf8'));
const wiki = JSON.parse(fs.readFileSync('.04-Src/i18n/wiki/fil.json', 'utf8'));

// то, чего в тагальском быть не должно (испанские формы из таблицы 2 + частотные).
// Исключения — настоящие тагальские слова (не ложные срабатывания, а норма):
//   gutom «голод», nagdaragdag «добавляет», umaatake «атакует» (эту форму пишет сам аналитик),
//   trompo «волчок» — испанское заимствование, ставшее тагальским.
const ES = ['esquema', 'tornillo', 'matsa', 'pintoan', 'salagat', 'salsala', 'bulate', 'trumpo', 'kubo ',
  'pampasaka', 'nalutunaw', 'nakalulutas', 'paypayin', 'akvaryum', 'lubak', 'immunidad', 'humagis',
  'dinudulot', 'pagpasang', 'humaharang', 'isinilangang', 'paglalakbay', 'paglalangoy',
  'lumilangoy', 'yumuyuko', 'balatan', 'dalandan', 'patsik', 'nag-uumpugan', 'hinihihipan', 'sumasagwan',
  'sumakap', 'gutirin', 'nagpapalagyan', 'pahilis', 'isang-uniselula'];
// только английские вставки из строки «wiki (общее)» таблицы 2 + найденные в корпусе
const ENPH = ['social bacterium', 'fruiting body', 'sleeping sickness', 'teaching model', 'water-fungus',
  'water fungus', 'brush mold', 'power plant', 'lab model'];

const hits = [];
const scan = (kind, key, text) => {
  const t = String(text);
  const low = t.toLowerCase();
  for (const w of ES) if (low.includes(w.toLowerCase())) hits.push([kind, key, 'ES', w, t.replace(/\s+/g, ' ').slice(0, 100)]);
  for (const ph of ENPH) if (low.includes(ph.toLowerCase())) hits.push([kind, key, 'EN', ph, t.replace(/\s+/g, ' ').slice(0, 100)]);
};

for (const [k, v] of Object.entries(ui)) scan('UI', k, v);
for (const [k, o] of Object.entries(wiki)) {
  let body = String(o.body || '');
  // вырезаем латинские биномиальные имена и научные термины-латиницу, чтобы не шуметь
  body = body.replace(/\b([A-Z][a-z]{3,})\s+([a-z]{3,}(us|a|um|is|e|on))\b/g, '<<SP>>')
             .replace(/\b[A-Z][a-z]+(phyceae|bacteria|phyta|mycota|zoa|stomata)\b/g, '<<SP>>');
  scan('WIKI', k, body);
}
console.log('| тип | ключ | язык | найдено | контекст |');
console.log('|---|---|---|---|---|');
for (const h of hits) console.log(`| ${h[0]} | ${h[1]} | ${h[2]} | ${h[3]} | ${h[4]} |`);
console.log('ИТОГО вхождений: ' + hits.length + ' (UI: ' + hits.filter(h => h[0] === 'UI').length +
  ', WIKI: ' + hits.filter(h => h[0] === 'WIKI').length + ')');
