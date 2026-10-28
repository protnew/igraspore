// i18n_coverage.mjs — TZ v9 E10: покрытие ключей en.json каждым языком.
// Usage: node tools/i18n/i18n_coverage.mjs --all | <lang>... [--dir wiki]
// exit 1 если хоть у одного языка пропуски/лишние; по каждому языку строка статуса.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const dirArg = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : '';
const I18N = path.join(ROOT, '.04-Src', 'i18n', dirArg);
const skip = new Set(['languages.json', 'wave2-status.json', 'i18n_identity.allow.json']);
const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'));
const enKeys = Object.keys(en);
let langs;
if (args.includes('--enabled')) {
  const langsJson = JSON.parse(fs.readFileSync(path.join(ROOT, '.04-Src', 'i18n', 'languages.json'), 'utf8'));
  langs = langsJson.filter((l) => l.enabled).map((l) => l.code);
} else if (args.includes('--all')) {
  langs = fs.readdirSync(I18N).filter((f) => f.endsWith('.json') && !skip.has(f)).map((f) => f.replace(/\.json$/, ''));
} else {
  langs = args.filter((a) => !a.startsWith('--') && a !== dirArg);
}
if (!langs.length) { console.error('usage: node tools/i18n/i18n_coverage.mjs --all | <lang>...'); process.exit(2); }

// D11 (TZ v20 §366, принято линией v20/v21): словари es/tr/fil заморожены, новые ключи
// показываются английским фоллбеком из config.js (T.en) и уходят аналитику отдельным пакетом.
// Тот же список, что в langs_consistency.test.js — иначе два checker'а противоречат друг другу
// (один зелёный, второй красный на тех же данных). Фоллбек печатается в строке языка, а не молчит.
const FROZEN = new Set(['es', 'tr', 'fil']);
const D11 = /^(exitAsk|exitMsg|yes|no|more|deadYours|aliveWord|deadOther|helpTouch|setLang|loadingWorld|economy|economyAsk|demoTipTouch|camFlyTouch)$/;

let bad = 0;
for (const lang of langs) {
  const f = path.join(I18N, lang + '.json');
  if (!fs.existsSync(f)) { console.log(lang.padEnd(6), 'NO FILE'); bad++; continue; }
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const missAll = enKeys.filter((k) => !(k in d));
  const fb = FROZEN.has(lang) ? missAll.filter((k) => D11.test(k)) : [];
  const miss = missAll.filter((k) => !fb.includes(k));
  const extra = Object.keys(d).filter((k) => !(k in en));
  const pct = Math.round(100 * (enKeys.length - missAll.length) / enKeys.length);
  console.log(lang.padEnd(6), (miss.length || extra.length ? pct : 100) + '%',
    'keys=' + Object.keys(d).length + '/' + enKeys.length,
    miss.length ? ('missing=' + miss.length + ': ' + miss.slice(0, 8).join(',') + (miss.length > 8 ? '…' : '')) : '',
    fb.length ? ('D11-фоллбек EN: ' + fb.length + ' (' + fb.join(',') + ')') : '',
    extra.length ? ('extra=' + extra.length + ': ' + extra.slice(0, 5).join(',')) : '');
  if (miss.length || extra.length) bad++;
}
console.log(bad ? 'FAIL langs=' + bad : 'OK all langs 100%');
process.exit(bad ? 1 : 0);
