// v21 D1: полная хеш-сверка android public = канон (РЕАЛЬНЫЙ лэйаут приложения).
// v21 fix (критики 2+5): прежде сверял public/js|public/i18n (мёртвые копии sync-скрипта) вместо
// реальных public/04-Src/js|public/i18n — «0 diffs» не значил ничего, устаревший i18n уехал в подписанный AAB.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const PUB = path.join(process.cwd(), '06-DevOps-and-Release', 'android', 'android', 'app', 'src', 'main', 'assets', 'public');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const diffs = []; let checked = 0;
function cmp(pubRel, canonRel) {
  const pp = path.join(PUB, pubRel), cp = canonRel;
  if (!fs.existsSync(cp)) return;
  checked++;
  if (!fs.existsSync(pp)) { diffs.push('MISSING: ' + pubRel); return; }
  if (sha(pp) !== sha(cp)) diffs.push('DIFF: ' + pubRel);
}
// реальный лэйаут: js и fonts под 04-Src, i18n в корне public (как строит build-www-release + cap sync)
fs.readdirSync(path.join(process.cwd(), '.04-Src', 'js')).filter(f => f.endsWith('.js'))
  .forEach(f => cmp('04-Src/js/' + f, path.join(process.cwd(), '.04-Src', 'js', f)));
fs.readdirSync(path.join(process.cwd(), '.04-Src', 'i18n')).filter(f => f.endsWith('.json'))
  .forEach(f => cmp('i18n/' + f, path.join(process.cwd(), '.04-Src', 'i18n', f)));
const wikiDir = path.join(process.cwd(), '.04-Src', 'i18n', 'wiki');
if (fs.existsSync(wikiDir)) fs.readdirSync(wikiDir).filter(f => f.endsWith('.json'))
  .forEach(f => cmp('i18n/wiki/' + f, path.join(wikiDir, f)));
const fontsDir = path.join(process.cwd(), '.04-Src', 'fonts');
if (fs.existsSync(fontsDir)) fs.readdirSync(fontsDir)
  .forEach(f => cmp('04-Src/fonts/' + f, path.join(fontsDir, f)));
['index.html', 'style.css', 'v20_5.css'].forEach(f => {
  const pp = path.join(PUB, f), cp = path.join(process.cwd(), f);
  if (!fs.existsSync(cp)) return;
  checked++;
  if (!fs.existsSync(pp)) { diffs.push('MISSING: ' + f); return; }
  if (sha(pp) !== sha(cp)) diffs.push('DIFF: ' + f);
});
// мёртвые копии старого sync-скрипта — не должны существовать
if (fs.existsSync(path.join(PUB, 'js'))) diffs.push('STRAY: public/js (мёртвая копия старого sync) ');
if (fs.existsSync(path.join(PUB, 'i18n', 'i18n'))) diffs.push('STRAY: public/i18n/i18n');
console.log(JSON.stringify({ checked, diffs: diffs.length, first: diffs.slice(0, 6) }));
process.exit(diffs.length ? 1 : 0);
