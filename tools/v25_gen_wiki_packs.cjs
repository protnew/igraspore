// v25 задача 5 (Р2): wiki-паки — полный pack (108 статей) для языков без вики.
// База — en.json (научные названия остаются en по Р2), оверлей — компактные локальные body (1-2 предложения)
// из v25_wiki_core_data.json для флагманских статей. НЕ из другого языка, НЕ регэкспом.
const fs = require('fs');
const en = JSON.parse(fs.readFileSync('.04-Src/i18n/wiki/en.json', 'utf8'));
const core = JSON.parse(fs.readFileSync(__dirname + '/v25_wiki_core_data.json', 'utf8'));
const L = JSON.parse(fs.readFileSync('.04-Src/i18n/languages.json', 'utf8'));

let made = 0, skipped = [];
for (const l of L) {
  const p = '.04-Src/i18n/wiki/' + l.code + '.json';
  if (fs.existsSync(p)) { skipped.push(l.code); continue; }
  const overlay = core.find(c => c[0] === l.code);
  const d = Object.assign({}, en);
  if (overlay) { for (const k in overlay[1]) d[k] = { body: overlay[1][k] }; }
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log(l.code + ': ' + Object.keys(d).length + ' статей, локализовано: ' + (overlay ? Object.keys(overlay[1]).length : 0));
  made++;
}
console.log('Паков создано: ' + made + '; уже были: ' + skipped.length);
