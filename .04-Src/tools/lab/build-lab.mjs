import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { page, buttonsPage, buttonDetail, fromMd } from './lab-pages.mjs';
import { testsPage } from './lab-tests.mjs';

const root = path.resolve(import.meta.dirname, '../../..');
const out = path.join(root, '.04-Src/dist-lab');
const lab = path.join(out, 'lab');
const docs = path.join(root, '09-Docs/out-dev-factory');
let sha = 'unknown';
try { sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(); } catch (e) {}
const built = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' }) + ' UTC+3';

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; }
function write(rel, html) {
  const dest = path.join(lab, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function langTable() {
  const file = path.join(root, '.04-Src/i18n/languages.json');
  if (!fs.existsSync(file)) return '<p>languages.json нет.</p>';
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));
  const on = list.filter((r) => r.enabled).map((r) => r.code);
  const body = list.map((r) => {
    const scores = (r.critics && r.critics.length) ? r.critics.join(' / ') : '—';
    return '<tr><td>' + esc(r.code) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.wave) + '</td><td>' + (r.enabled ? 'да' : 'нет') + '</td><td>' + esc(scores) + '</td></tr>';
  }).join('');
  return '<p>Включены (' + on.length + '): ' + esc(on.join(', ')) + '. Язык включён только если оба критика не ниже 8. Оценки не выдуманы.</p><table><tr><th>Код</th><th>Имя</th><th>Волна</th><th>Включён</th><th>Критики</th></tr>' + body + '</table>';
}
function rowsFrom(file) {
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return data.rows || [];
}

fs.mkdirSync(lab, { recursive: true });
const before = rowsFrom(path.join(docs, 'shots-release-ready-2026-10-14/buttons-before/buttons.json'));
const after = rowsFrom(path.join(docs, 'shots-release-ready-2026-10-14/buttons-after/buttons.json'));
const rows = after.length ? after : before;
const beforeMap = {};
before.forEach((r) => { beforeMap[r.id + '|' + r.viewport] = r; });
const media = path.join(lab, 'media');
fs.mkdirSync(media, { recursive: true });
let copied = 0;
let skipped = 0;
function takeMedia(row) {
  (row.png || []).concat(row.webm ? [row.webm] : []).forEach((src) => {
    if (!src || !fs.existsSync(src)) return;
    if (fs.statSync(src).size > 25 * 1024 * 1024) { skipped++; return; }
    const dest = path.join(media, path.basename(src));
    if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
    copied++;
  });
}
before.forEach(takeMedia);
rows.forEach(takeMedia);
write('index.html', page('iGraSpore lab', '<p>Сборка ' + built + '. sha ' + sha + '.</p><p>Стенд игры <a href="http://127.0.0.1:8792/">127.0.0.1:8792</a>. Прод не деплоили.</p><ul>' + ['buttons','competitors','languages','tests','ui-audit','store-readiness','tz-index','media'].map((n) => '<li><a href="' + n + '.html">' + n + '</a></li>').join('') + '</ul>', sha));
write('buttons.html', page('Кнопки', buttonsPage(rows, beforeMap), sha));
write('competitors.html', page('Конкуренты', fromMd(read(path.join(docs, 'COMPETITORS-PLAY-2026-10-14.md'))), sha));
write('languages.html', page('Языки', fromMd(read(path.join(docs, 'LANGUAGES-20-NO-RTL-2026-10-14.md'))) + langTable(), sha));
write('tests.html', page('Тесты', testsPage(path.join(root, '09-Docs/test-runs')), sha));
write('ui-audit.html', page('Аудит UI', fromMd(read(path.join(docs, 'AUDIT-UI-STORE-2026-10-14.md'))), sha));
write('store-readiness.html', page('Стор', '<ul><li>AAB собран, не подписан. jarsigner: jar is unsigned</li><li>targetSdk 36 записан в gradle. bundletool в этом ответе не гонял</li><li>Деплой и публикация: не делались</li></ul>', sha));
write('tz-index.html', page('Индекс ТЗ', '<ul><li><a href="../../09-Docs/out-dev-factory/TZ-RELEASE-READY-2026-10-14-v2.md">TZ v2</a></li></ul>' + fromMd(read(path.join(docs, 'TZ-RELEASE-READY-2026-10-14-v2.md')).slice(0, 4000)), sha));
write('media.html', page('Медиа', '<p>Снимки лежат в shots-release-ready-2026-10-14. На сайт копируются только если есть.</p>', sha));
const ids = [...new Set(rows.map((r) => r.id))];
ids.forEach((id) => write('button/' + id + '.html', page(id, buttonDetail(id, rows, beforeMap), sha)));
fs.writeFileSync(path.join(out, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(lab, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('lab built', lab, 'cards', rows.length, 'media', copied, 'skipped', skipped);
