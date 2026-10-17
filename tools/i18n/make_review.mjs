// make_review.mjs — TZ v12 U29: пакеты на проверку аналитику (круг 5) на ВСЕ 20 языков.
// Пишет 09-Docs/i18n-review/<lang>-round5-for-review.md (шапка: дата, круг, sha256 словарей;
// таблица «ключ | ru | en | язык | где / макс. длина», новые ключи помечены 🆕; ссылки на снимки)
// и 09-Docs/i18n-review/round5-input-sha.json (полный sha256 каждого <lang>.json — для input_sha256
// аналитика и гейта critic_check --gate). Разработчик НЕ оценивает и НЕ пишет файлы аналитика.
// Usage: node tools/i18n/make_review.mjs [--round 5]
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const ROUND = args.includes('--round') ? args[args.indexOf('--round') + 1] : '5';
const ONLY = args.includes('--langs') ? args[args.indexOf('--langs') + 1].split(',').map((s) => s.trim()).filter(Boolean) : null;
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const OUT = path.join(ROOT, '09-Docs', 'i18n-review');
const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' }) + ' UTC+3';
let LANGS = ['ru','en','pt-BR','id','de','fr','hi','ja','vi','ko','th','it','pl','uk','zh-TW','ms','bn','es','tr','fil'];
if (ONLY) LANGS = ONLY;

const sha = (p) => fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : '—';
const shaShort = (p) => sha(p).slice(0, 16);
const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

// ключи, добавленные после круга 4 (U13 263 + loc.* 9) — baseline = es.json @7358d61 (140 ключей)
const oldBase = new Set(Object.keys(JSON.parse(execSync('git show 7358d61:.04-Src/i18n/es.json', { encoding: 'utf8', maxBuffer: 1e7 }))));

const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(I18N, 'ru.json'), 'utf8'));
const enKeys = Object.keys(en);
const addedCount = enKeys.filter((k) => !oldBase.has(k)).length;

const wikiEn = fs.existsSync(path.join(WIKI, 'en.json')) ? JSON.parse(fs.readFileSync(path.join(WIKI, 'en.json'), 'utf8')) : null;

const PLACE = [
  [/^hud\.btn\..*\.short$/, 'HUD кнопка (короткая) / ≤8'],
  [/^hud\.btn\./, 'HUD кнопка / ≤14'],
  [/^hud\./, 'HUD / ≤40'], [/^loc\./, 'вики «Движение» / ≤18'], [/^menu\./, 'меню / ≤30'],
  [/^set/, 'настройки / ≤40'], [/^toast\./, 'тост / ≤60'], [/^tut\./, 'обучение / ≤200'],
  [/^wiki\./, 'вики / ≤300'], [/^x\./, 'метки/подписи / ≤60'], [/^cat(Short)?\./, 'категория / ≤24'],
  [/^edu\./, 'анатомия / ≤120'], [/^demo\./, 'демо / ≤60'], [/^ev\./, 'событие / ≤60'],
  [/^sp\./, 'имя вида / ≤40'], [/^star?g?\./, 'звезда / ≤40'], [/^mic\./, 'микроскоп / ≤30'],
  [/^food\./, 'питание / ≤60'], [/^role/, 'карточка роли / ≤80'], [/^mob\./, 'моб. UI / ≤30'],
  [/^help\./, 'помощь / ≤200'],
];
const place = (k) => { for (const [re, v] of PLACE) if (re.test(k)) return v; return 'общий UI / ≤60'; };

fs.mkdirSync(OUT, { recursive: true });
const shaFile = path.join(OUT, 'round' + ROUND + '-input-sha.json');
const shaOut = fs.existsSync(shaFile) ? { ...(JSON.parse(fs.readFileSync(shaFile, 'utf8')).dicts || {}) } : {};
for (const lang of LANGS) {
  const lf = path.join(I18N, lang + '.json');
  if (!fs.existsSync(lf)) { console.log(lang, 'нет словаря'); continue; }
  const d = JSON.parse(fs.readFileSync(lf, 'utf8'));
  const wikiFile = path.join(WIKI, lang + '.json');
  shaOut[lang] = sha(lf);
  if (fs.existsSync(wikiFile)) shaOut['wiki/' + lang + '.json'] = sha(wikiFile); // FR-W1.4: sha словаря И вики
  const wikiL = wikiEn && fs.existsSync(wikiFile) ? JSON.parse(fs.readFileSync(wikiFile, 'utf8')) : null;

  let md = '';
  md += '# Пакет на проверку аналитику: ' + lang + ' (круг ' + ROUND + ')\n\n';
  md += '- Дата: ' + now + '  |  Круг: ' + ROUND + '\n';
  md += '- input_sha256 словарей (полные — для raw<' + lang + '-analyst-round' + ROUND + '.json):\n';
  md += '  - `en.json` = ' + sha(path.join(I18N, 'en.json')) + '\n';
  md += '  - `ru.json` = ' + sha(path.join(I18N, 'ru.json')) + '\n';
  md += '  - `' + lang + '.json` = ' + sha(lf) + '\n';
  if (wikiL) md += '  - `wiki/' + lang + '.json` = ' + sha(path.join(WIKI, lang + '.json')) + '\n';
  md += '- Ключей UI: ' + enKeys.length + ' (из них 🆕 новых после круга 4: ' + addedCount + ' — U13 263 + U42 loc.* 9)' + (wikiEn ? '; вики-тел: ' + Object.keys(wikiEn).length : '') + '\n';
  md += '- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.\n';
  md += '- Ответ аналитика: `09-Docs/i18n-review/raw/' + lang + '-analyst-round' + ROUND + '.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).\n\n';

  const sd = path.join(ROOT, '09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n', lang);
  const shots = fs.existsSync(sd) ? fs.readdirSync(sd).filter((f) => f.endsWith('.png')) : [];
  md += '## Снимки 390×844\n\n' + (shots.length ? shots.map((f) => '- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/' + lang + '/' + f + '`').join('\n') + '\n\n' : '- снимков нет (язык выключен и не переснят)\n\n');

  md += '## Словарь UI (' + enKeys.length + ')\n\n| 🆕 | ключ | ru | en | ' + lang + ' | где / макс. длина |\n|---|---|---|---|---|---|\n';
  for (const k of enKeys) {
    const n = !oldBase.has(k) ? '🆕' : '';
    md += '| ' + n + ' | `' + k + '` | ' + esc(ru[k]) + ' | ' + esc(en[k]) + ' | ' + esc(d[k]) + ' | ' + place(k) + ' |\n';
  }
  if (wikiEn) {
    md += '\n## Вики — тела видов (' + Object.keys(wikiEn).length + ')\n\n| id | en | ' + lang + ' |\n|---|---|---|\n';
    for (const k of Object.keys(wikiEn)) md += '| `' + k + '` | ' + esc((wikiEn[k] && wikiEn[k].body) || '') + ' | ' + esc(wikiL && wikiL[k] ? wikiL[k].body : '— НЕТ') + ' |\n';
  }
  fs.writeFileSync(path.join(OUT, lang + '-round' + ROUND + '-for-review.md'), md);
  console.log(lang, '-> round' + ROUND + '-for-review.md', Math.round(md.length / 1024) + 'KB', 'wiki=' + (wikiL ? 'да' : 'нет'));
}
fs.writeFileSync(path.join(OUT, 'round' + ROUND + '-input-sha.json'), JSON.stringify({ schema: 'review-input-sha/1', round: Number(ROUND), generated: now, dicts: shaOut }, null, 1) + '\n');
console.log('wrote round' + ROUND + '-input-sha.json for ' + Object.keys(shaOut).length + ' langs');
