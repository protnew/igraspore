// Отчёт v14: таблица языков (ключи UI, тела вики, круг/оценка аналитика, включён ли язык).
// Запуск из корня: node .04-Src/qa-playwright/report_langs.mjs
import fs from 'node:fs';
import path from 'node:path';

const I18N = '.04-Src/i18n';
const WIKI = path.join(I18N, 'wiki');
const RAW = '09-Docs/i18n-review/raw';

const enabledList = JSON.parse(fs.readFileSync(path.join(I18N, 'languages.json'), 'utf8'));
const enabledBy = {};
for (const e of enabledList) enabledBy[e.code] = e.enabled === true;

const cfg = fs.readFileSync('.04-Src/js/config.js', 'utf8');
const m = cfg.match(/var LANGS=\{([^}]*)\}/);
const inLangs = new Set((m ? m[1] : '').split(',').map(s => s.split(':')[0].trim().replace(/['"]/g, '')).filter(Boolean));

function latestRound(lang) {
  if (!fs.existsSync(RAW)) return null;
  let best = null;
  for (const x of fs.readdirSync(RAW)) {
    if (!/-analyst-round\d+\.json$/.test(x) || /draft/.test(x)) continue;
    const j = JSON.parse(fs.readFileSync(path.join(RAW, x), 'utf8'));
    for (const e of (j.langs || [])) {
      if (e.code !== lang) continue;
      const round = +(x.match(/round(\d+)/) || [])[1];
      if (!best || round > best.round) best = { round, score: e.score, file: x };
    }
  }
  return best;
}

const dictKeys = (f) => fs.existsSync(f) ? Object.keys(JSON.parse(fs.readFileSync(f, 'utf8'))).length : 0;
const en = dictKeys(path.join(I18N, 'en.json'));

const order = enabledList.map(e => e.code);
console.log('язык | ключей UI | тел вики | круг аналитика | оценка | languages.json | LANGS в config.js');
for (const L of order) {
  const kc = dictKeys(path.join(I18N, L + '.json'));
  const wc = dictKeys(path.join(WIKI, L + '.json'));
  const r = latestRound(L);
  console.log([L, kc || 'инлайн T.ru/T.en', wc, r ? r.round : '—', r ? r.score : 'нет оценки',
    enabledBy[L] ? 'вкл' : 'ВЫКЛ', inLangs.has(L) ? 'вкл' : 'ВЫКЛ', r ? r.file : '—'].join(' | '));
}
const scored8 = order.filter(c => { const r = latestRound(c); return r && r.score >= 8; }).length;
const nEnabled = order.filter(c => enabledBy[c]).length;
const nLangsVar = order.filter(c => inLangs.has(c)).length;
console.log('ИТОГО: языков в languages.json =', order.length, '| enabled=true =', nEnabled, '| в LANGS (config.js) =', nLangsVar,
  '| оценка аналитика ≥ 8 =', scored8, '| ключей en.json =', en, '| файлов wiki =', fs.readdirSync(WIKI).filter(x => x.endsWith('.json')).length);
