// v21 D1: полная хеш-сверка public=канон (js 38 + i18n 21 + html + css + fonts)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const PUB = path.join(process.cwd(), '06-DevOps-and-Release', 'android', 'android', 'app', 'src', 'main', 'assets', 'public');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const diffs = []; let checked = 0;
function cmp(rel) {
  const pp = path.join(PUB, rel), cp = path.join(process.cwd(), '.04-Src', rel);
  if (!fs.existsSync(cp)) return;
  checked++;
  if (!fs.existsSync(pp)) { diffs.push('MISSING: ' + rel); return; }
  if (sha(pp) !== sha(cp)) diffs.push('DIFF: ' + rel);
}
fs.readdirSync(path.join(process.cwd(), '.04-Src', 'js')).filter(f => f.endsWith('.js')).forEach(f => cmp('js/' + f));
fs.readdirSync(path.join(process.cwd(), '.04-Src', 'i18n')).filter(f => f.endsWith('.json')).forEach(f => cmp('i18n/' + f));
if (fs.existsSync(path.join(process.cwd(), '.04-Src', 'fonts'))) fs.readdirSync(path.join(process.cwd(), '.04-Src', 'fonts')).forEach(f => cmp('fonts/' + f));
['index.html', 'style.css', 'v20_5.css'].forEach(f => {
  const pp = path.join(PUB, f), cp = path.join(process.cwd(), f);
  if (!fs.existsSync(cp)) return;
  checked++;
  if (!fs.existsSync(pp)) { diffs.push('MISSING: ' + f); return; }
  if (sha(pp) !== sha(cp)) diffs.push('DIFF: ' + f);
});
console.log(JSON.stringify({ checked, diffs: diffs.length, first: diffs.slice(0, 6) }));
process.exit(diffs.length ? 1 : 0);
