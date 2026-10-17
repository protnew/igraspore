// W1 (U26 круг 8): правки wiki/fil.json по таблице 2 (19 групп) ANALYST-ROUND7.
import fs from 'fs';
const p = '.04-Src/i18n/wiki/fil.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));
const rows = [];
// [ключ, было(подстрока), стало]
const edits = [
  ['2', 'berdeng tornillo', 'berdeng turnilyo'],
  ['4', 'Umuuga ito pahilis', 'Umuuga ito pagilid-gilid'],
  ['7', 'Bumubuo ng matsa', 'Bumubuo ng banig'],
  ['13', 'nagpapalagyan ng makapal na dingding', 'nagpapatubo ng makapal na dingding'],
  ['13', 'nakalulutas sa tagtuyot', 'nakaliligtas sa tagtuyot'],
  ['16', 'may silica na pintoan', 'may silica na balbula'],
  ['19', 'nagdaragdag ng salagat sa haligi ng tubig', 'nagdaragdag ng hila (drag) sa haligi ng tubig'],
  ['22', 'ay isang-uniselula na pulang algae', 'ay isang uniselular na pulang alga'],
  ['25', 'hanggang sumabog ang punong.', 'hanggang sumabog ang punong-abala (host).'],
  ['44', 'Ilang salsala sa isang puno', 'Ilang pansala sa isang puno'],
  ['45', 'bulate ng bibig', 'uka ng bibig'],
  ['47', 'asul na trumpo hanggang', 'asul na trumpeta hanggang'],
  ['48', 'mula trumpo hanggang bola', 'mula trumpeta hanggang bola'],
  ['52', 'Kumikilos ito nang ilang beses sa bahagi ng segundo.', 'Umiikli ito nang ilang ulit sa loob ng bahagi ng segundo.'],
  ['59', 'at hinihihipan.', 'at sinisipsip.'],
  ['63', 'Takip ang sumasagwan sa bibig.', 'May takip na tumatakip sa bibig.'],
  ['65', 'may matigas na kubo ng baluti', 'may matigas na simboryo ng baluti'],
  ['79', 'sa nag-uumpugan na kaliskis', 'sa nagpapatong-patong na kaliskis'],
  ['85', 'ay pampasaka ng tinapay', 'ay lebadura ng tinapay'],
  ['85', 'tagalinis ng nalutunaw na organiko', 'tagalinis ng natunaw na organiko'],
  ['94', 'nakalulutas sa kumukulong tubig', 'nakaliligtas sa kumukulong tubig'],
  ['Lambda Phage', 'sumakap sa chromosome', 'sumanib sa chromosome'],
  ['Lambda Phage', 'agad na gutirin ang selula', 'agad na wasakin ang selula'],
];
for (const [k, from, to] of edits) {
  if (!w[k]) { rows.push([k, '(КЛЮЧА НЕТ)', '-']); continue; }
  const before = w[k].body;
  if (!before.includes(from)) { rows.push([k, 'НЕ НАЙДЕНО: ' + from, '-']); continue; }
  w[k].body = before.split(from).join(to);
  rows.push([k, from, to]);
}
fs.writeFileSync(p, JSON.stringify(w, null, 2) + '\n', 'utf8');
console.log('| wiki-ключ | было | стало |');
console.log('|---|---|---|');
for (const [k, a, b] of rows) console.log(`| ${k} | ${a.slice(0, 58)} | ${b.slice(0, 58)} |`);
console.log('строк: ' + rows.length + ', исправлено: ' + rows.filter(r => r[2] !== '-' && !r[1].startsWith('НЕ НАЙДЕНО') && !r[1].startsWith('(')).length);
