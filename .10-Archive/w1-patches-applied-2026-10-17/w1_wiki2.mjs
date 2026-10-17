// FR-W1.2 (продолжение): перевод оставшихся английских вставок в wiki/fil.json
// по строке «wiki (общее)» таблицы 2. Латинские названия видов не трогаем.
import fs from 'fs';
const p = '.04-Src/i18n/wiki/fil.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));
const rows = [];
const edits = [
  ['0', 'Lab model ng hydrogen metabolism.', 'Modelong pang-laboratoryo ng metabolismo ng hydrogen.'],
  ['28', 'ay social bacterium.', 'ay bakteryang panlipunan.'],
  ['28', 'bumubuo ng fruiting body', 'bumubuo ng katawan ng pagbubunga'],
  ['35', 'kumakain ng nalutunaw na organiko', 'kumakain ng natunaw na organiko'],
  ['40', 'nagdudulot ng sleeping sickness', 'nagdudulot ng sakit sa pagtulog'],
  ['61', 'umiikot na trumpo:', 'umiikot na trompo (manok-manokan):'],
  ['81', 'Humahati ito pahilis sa kadena', 'Humahati ito pagilid-gilid sa kadena'],
  ['89', 'ay brush mold, pinagmulan ng penicillin', 'ay amag na parang brotsa, pinagmulan ng penicillin'],
  ['91', 'modelo ng water-fungus', 'modelo ng amag sa tubig'],
  ['93', 'ay water fungus na may tunay na mycelium', 'ay amag sa tubig na may tunay na mycelium'],
  ['1001', 'Ang Sexual Eukaryote ay teaching model ng sexual reproduction.', 'Ang Eukariyota (sekswal) ay modelong panturo ng sekswal na paramihan.'],
  ['Sexual Eukaryote', 'Ang Sexual Eukaryote ay teaching model ng sexual reproduction.', 'Ang Eukariyota (sekswal) ay modelong panturo ng sekswal na paramihan.'],
];
for (const [k, from, to] of edits) {
  if (!w[k]) { rows.push([k, '(КЛЮЧА НЕТ)', '-']); continue; }
  const before = w[k].body;
  if (!before.includes(from)) { rows.push([k, 'НЕ НАЙДЕНО: ' + from, '-']); continue; }
  w[k].body = before.split(from).join(to);
  rows.push([k, from, to]);
}
fs.writeFileSync(p, JSON.stringify(w, null, 2) + '\n', 'utf8');
console.log('| wiki | было | стало |');
console.log('|---|---|---|');
for (const [k, a, b] of rows) console.log(`| ${k} | ${a.slice(0, 55)} | ${b.slice(0, 55)} |`);
console.log('исправлено: ' + rows.filter(r => r[2] !== '-').length + ' из ' + rows.length);
