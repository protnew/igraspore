// make_for_b.mjs — TZ v9 L.7/U15: пакеты для критика B.
// Для каждого языка пишет 09-Docs/i18n-review/<lang>-round<N>-for-B.md:
// шапка (sha256 словарей, дата) + таблица `ключ | ru | en | <lang> | где показывается / макс. длина`
// + вики-таблица body + ссылки на снимки 390x844.
// Usage: node tools/i18n/make_for_b.mjs [--langs de,fr] [--round 1]
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };

const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const OUT = path.join(ROOT, '09-Docs', 'i18n-review');
const ROUND = arg('--round', '1');
const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' }) + ' UTC+3';

const sha = (p) => fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16) : '—';
const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

// где показывается / макс. длина — по префиксу ключа
const PLACE = [
  [/^hud\.btn\..*\.short$/, 'нижняя панель, кнопка (короткая) / ≤8'],
  [/^hud\.btn\./, 'нижняя панель, кнопка / ≤14'],
  [/^hud\./, 'HUD над игрой / ≤40'],
  [/^menu\./, 'главное меню / ≤30'],
  [/^set/, 'настройки / ≤40'],
  [/^toast\./, 'тост (всплывашка) / ≤60'],
  [/^tut\./, 'обучение / ≤200'],
  [/^wiki\./, 'вики / ≤300'],
  [/^x\./, 'HUD/метки/подписи / ≤60'],
  [/^cat(Short)?\./, 'категория вида / ≤24'],
  [/^edu\./, 'панель анатомии / ≤120'],
  [/^demo\./, 'демо-режим / ≤60'],
  [/^ev\./, 'событие мира / ≤60'],
  [/^sp\./, 'имя вида / ≤40'],
  [/^star\./, 'звезда/небо / ≤40'],
  [/^mic\./, 'микроскоп / ≤30'],
  [/^food\./, 'чем питается / ≤60'],
  [/^role/, 'карточка роли / ≤80'],
  [/^mob\./, 'мобильный UI / ≤30'],
  [/^help\./, 'помощь / ≤200'],
];
const place = (k) => { for (const [re, v] of PLACE) if (re.test(k)) return v; return 'общий UI / ≤60'; };

const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(I18N, 'ru.json'), 'utf8'));
const langsJson = JSON.parse(fs.readFileSync(path.join(I18N, 'languages.json'), 'utf8'));
let langs = langsJson.map((l) => l.code).filter((c) => c !== 'en' && c !== 'ru');
if (arg('--langs')) langs = arg('--langs').split(',');

const wikiEn = fs.existsSync(path.join(WIKI, 'en.json')) ? JSON.parse(fs.readFileSync(path.join(WIKI, 'en.json'), 'utf8')) : null;
const wikiRu = wikiEn && fs.existsSync(path.join(WIKI, 'ru.json')) ? JSON.parse(fs.readFileSync(path.join(WIKI, 'ru.json'), 'utf8')) : null;

// мини-глоссарий: ключевые термины (категории + базовые сущности)
const GLOSS_KEYS = ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer', 'virus', 'energy', 'massWord', 'divide', 'eat', 'cyst'];

const shotsDir = path.join(ROOT, '09-Docs', 'out-dev-factory', 'shots-release-ready-2026-10-14', 'i18n');

for (const lang of langs) {
  const lf = path.join(I18N, lang + '.json');
  if (!fs.existsSync(lf)) { console.log(lang, '— нет словаря, пропуск'); continue; }
  const d = JSON.parse(fs.readFileSync(lf, 'utf8'));
  const wikiL = wikiEn && fs.existsSync(path.join(WIKI, lang + '.json'))
    ? JSON.parse(fs.readFileSync(path.join(WIKI, lang + '.json'), 'utf8')) : null;

  let md = '';
  md += '# Пакет для критика B: ' + lang + ' (round ' + ROUND + ')\n\n';
  md += '- Дата: ' + now + '\n';
  md += '- input_sha256: en.json=' + sha(path.join(I18N, 'en.json')) + ', ru.json=' + sha(path.join(I18N, 'ru.json'))
    + ', ' + lang + '.json=' + sha(lf) + (wikiL ? ', wiki/' + lang + '.json=' + sha(path.join(WIKI, lang + '.json')) : '') + '\n';
  md += '- Ключей UI: ' + Object.keys(en).length + (wikiEn ? '; вики-тел: ' + Object.keys(wikiEn).length : '') + '\n';
  md += '- Рубрика 0–10 по 5 осям: точность смысла, соответствие глоссарию, естественность/регистр (дружелюбное «ты»/неформально, где принято), длина (влезает в кнопку — см. колонку «где/макс»), ошибки (опечатки, сломанные {param}).\n';
  md += '- Ответ — в `09-Docs/i18n-review/raw/' + lang + '-critic-B-round' + ROUND + '.json` (схема tools/i18n/critic.schema.json); поля command/pid/log/prompt_sha256 для B необязательны.\n\n';

  // снимки 390x844 (L.9) — то, что есть
  const sd = path.join(shotsDir, lang);
  const shots = fs.existsSync(sd) ? fs.readdirSync(sd).filter((f) => f.endsWith('.png')) : [];
  md += '## Снимки 390×844\n\n';
  md += shots.length
    ? shots.map((f) => '- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/' + lang + '/' + f + '`').join('\n') + '\n\n'
    : '- снимков этого языка ещё нет (L.9 по этому языку не сделан)\n\n';

  // глоссарий
  md += '## Глоссарий (ключевые термины)\n\n| ключ | ru | en | ' + lang + ' |\n|---|---|---|---|\n';
  for (const k of GLOSS_KEYS) {
    if (en[k] === undefined) continue;
    md += '| `' + k + '` | ' + esc(ru[k]) + ' | ' + esc(en[k]) + ' | ' + esc(d[k]) + ' |\n';
  }

  // основная таблица
  md += '\n## Словарь UI (' + Object.keys(en).length + ' ключей)\n\n| ключ | ru | en | ' + lang + ' | где / макс. длина |\n|---|---|---|---|---|\n';
  for (const k of Object.keys(en)) {
    md += '| `' + k + '` | ' + esc(ru[k]) + ' | ' + esc(en[k]) + ' | ' + esc(d[k]) + ' | ' + place(k) + ' |\n';
  }

  // вики
  if (wikiEn) {
    md += '\n## Вики — тела видов (' + Object.keys(wikiEn).length + ')\n\n| id | en | ' + lang + ' |\n|---|---|---|\n';
    for (const k of Object.keys(wikiEn)) {
      md += '| `' + k + '` | ' + esc(wikiEn[k].body || '') + ' | ' + esc(wikiL && wikiL[k] ? wikiL[k].body : '— НЕТ ПЕРЕВОДА') + ' |\n';
    }
  }

  const out = path.join(OUT, lang + '-round' + ROUND + '-for-B.md');
  fs.writeFileSync(out, md);
  console.log(lang, '->', path.relative(ROOT, out), Math.round(md.length / 1024) + 'KB', 'wiki=' + (wikiL ? 'да' : 'нет'));
}
