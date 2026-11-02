// v26 задачи 4-5: слияние данных-файлов переводчиков в словари и wiki.
// Целый JSON от en.json + оверлей перевода (НЕ регэксп, НЕ генератор из другого языка):
//   tools/v26_data/<lang>.dict.json = { key: перевод }          → .04-Src/i18n/<lang>.json
//   tools/v26_data/<lang>.wiki.json = { articleKey: body }      → .04-Src/i18n/wiki/<lang>.json
// Ключи, которых нет в данных, сохраняют текущее значение (уже переведённое ранее).
// После слияния — запуск recheck. Usage: node tools/v26_merge_data.cjs
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const DATA = path.join(__dirname, 'v26_data');
const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'));
const enWiki = JSON.parse(fs.readFileSync(path.join(WIKI, 'en.json'), 'utf8'));

let dictDone = [], wikiDone = [], skipped = [];
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
for (const f of fs.readdirSync(DATA)) {
  const m = f.match(/^([a-zA-Z][a-zA-Z0-9-]*)\.(dict|wiki)\.json$/); // v26 fix: es-419 и др. коды с цифрами
  if (!m) continue;
  const [, lang, kind] = m;
  const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
  if (kind === 'dict') {
    const cur = fs.existsSync(path.join(I18N, lang + '.json')) ? JSON.parse(fs.readFileSync(path.join(I18N, lang + '.json'), 'utf8')) : {};
    const d = Object.assign({}, en, cur);
    let applied = 0;
    for (const k in data) if (k in en) { d[k] = String(data[k]); applied++; }
    fs.writeFileSync(path.join(I18N, lang + '.json'), JSON.stringify(d, null, 2) + '\n');
    dictDone.push(lang + ' (+' + applied + ')');
  } else {
    const cur = fs.existsSync(path.join(WIKI, lang + '.json')) ? JSON.parse(fs.readFileSync(path.join(WIKI, lang + '.json'), 'utf8')) : {};
    const w = Object.assign({}, enWiki, cur);
    let applied = 0;
    for (const k in data) if (k in enWiki) { w[k] = (typeof enWiki[k] === 'object' && enWiki[k] !== null) ? { body: String(data[k]) } : String(data[k]); applied++; }
    fs.writeFileSync(path.join(WIKI, lang + '.json'), JSON.stringify(w, null, 2) + '\n');
    wikiDone.push(lang + ' (+' + applied + ')');
  }
}
console.log('dict: ' + (dictDone.join(', ') || '—'));
console.log('wiki: ' + (wikiDone.join(', ') || '—'));
if (!dictDone.length && !wikiDone.length) { console.log('Нет данных в ' + DATA); process.exit(0); }
const { execSync } = require('child_process');
console.log(execSync('node ' + path.join(__dirname, 'v26_recheck_100.cjs'), { encoding: 'utf8' }).split('\n').slice(0, 4).join('\n'));
