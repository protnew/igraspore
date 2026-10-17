// W1/U26: таблица «ключ | было | стало» — сравнение словарей до правки (копия в .10-Archive) и после.
// Запуск из корня: node .04-Src/qa-playwright/w1_diff.mjs
import fs from 'node:fs';

const BEFORE = '.10-Archive/i18n-before-round8-2026-10-17';
const pairs = [
  ['UI fil', BEFORE + '/fil.json', '.04-Src/i18n/fil.json'],
  ['WIKI fil', BEFORE + '/wiki-fil.json', '.04-Src/i18n/wiki/fil.json'],
  ['UI tr', BEFORE + '/tr.json', '.04-Src/i18n/tr.json'],
  ['WIKI tr', BEFORE + '/wiki-tr.json', '.04-Src/i18n/wiki/tr.json']
];
const clip = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; };

for (const [name, b, a] of pairs) {
  const B = JSON.parse(fs.readFileSync(b, 'utf8')), A = JSON.parse(fs.readFileSync(a, 'utf8'));
  const keys = [...new Set([...Object.keys(B), ...Object.keys(A)])];
  const changed = keys.filter(k => JSON.stringify(B[k]) !== JSON.stringify(A[k]));
  console.log('\n### ' + name + ' — изменено ключей: ' + changed.length + ' (всего ключей ' + keys.length + ')');
  for (const k of changed) {
    console.log('| `' + k + '` | ' + clip(B[k] === undefined ? '—' : B[k], 150) + ' | ' + clip(A[k] === undefined ? '—' : A[k], 150) + ' |');
  }
}
