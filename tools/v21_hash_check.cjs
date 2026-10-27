// v21 D1: хеш-сверка public=канон (js/i18n/fonts). NEG=1 — модифицирует один файл public, должен быть пойман.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const PUB = path.join(process.cwd(), '06-DevOps-and-Release', 'android', 'android', 'app', 'src', 'main', 'assets', 'public');
const NEG = process.env.NEG === '1';
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function cmp(basePub, baseCanon, rels, diffs) {
  for (const rel of rels) {
    const pp = path.join(basePub, rel), cp = path.join(baseCanon, rel);
    if (!fs.existsSync(cp)) continue;
    if (!fs.existsSync(pp)) { diffs.push('MISSING public: ' + rel); continue; }
    if (sha(pp) !== sha(cp)) diffs.push('DIFF: ' + rel);
  }
}
const diffs = [];
cmp(PUB, path.join(process.cwd(), '.04-Src'), ['i18n/en.json', 'i18n/ru.json', 'i18n/languages.json'], diffs);
cmp(PUB, path.join(process.cwd(), '.04-Src'), ['fonts/game.woff2'].filter(f => fs.existsSync(path.join(process.cwd(), '.04-Src', f))), diffs);
const canonJs = fs.readdirSync(path.join(process.cwd(), '.04-Src', 'js')).filter(f => f.endsWith('.js'));
cmp(PUB, path.join(process.cwd(), '.04-Src'), canonJs.map(f => 'js/' + f).filter(r => fs.existsSync(path.join(PUB, r))), diffs);
if (fs.existsSync(path.join(PUB, 'index.html'))) {
  const a = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
  const b = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  if (a !== b) diffs.push('DIFF: index.html');
}
if (fs.existsSync(path.join(PUB, 'style.css'))) {
  if (sha(path.join(PUB, 'style.css')) !== sha(path.join(process.cwd(), 'style.css'))) diffs.push('DIFF: style.css');
}
console.log(JSON.stringify({ checked: 'js+i18n+html+css', diffs: diffs.length, first: diffs.slice(0, 5) }));
process.exit(diffs.length ? 1 : 0);
