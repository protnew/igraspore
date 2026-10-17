// W1 (FR-W1.3): остальные 3 правки таблицы 3 ANALYST-ROUND7 в wiki/tr.json (toksisistler, sirruslar, Eşeyli Ökaryot).
// Запуск из корня: node .10-Archive/w1-tr-wiki-2026-10-17/apply.mjs
import fs from 'node:fs';

const P = '.04-Src/i18n/wiki/tr.json';
fs.writeFileSync('.10-Archive/w1-tr-wiki-2026-10-17/wiki-tr-before-3fix.json', fs.readFileSync(P, 'utf8'));
let s = fs.readFileSync(P, 'utf8');

const REPS = [
  ['Toksisitler fırlatır', 'Toksisistler fırlatır', 1],
  ["'hortumunda' toksisitler olan", "'hortumunda' toksisistler olan", 1],
  ['sirleri bacak gibi', 'sirruslarını bacak gibi', 1],
  ['Büyük sirler,', 'Büyük sirruslar,', 1],
  ['Sirlerle yürür', 'Sirruslarla yürür', 1],
  ['Sexual Eukaryote, eşeyli üremenin öğretim modelidir.', 'Eşeyli Ökaryot, eşeyli üremenin öğretim modelidir.', 2]
];

for (const [from, to, want] of REPS) {
  const n = s.split(from).length - 1;
  if (n !== want) throw new Error('неожиданное число вхождений «' + from + '»: ' + n + ', ждали ' + want);
  s = s.split(from).join(to);
  console.log('OK x' + want + ':', from.slice(0, 40), '→', to.slice(0, 40));
}
JSON.parse(s); // не писать битый JSON
fs.writeFileSync(P, s);
console.log('wiki/tr.json записан,', s.length, 'знаков');
