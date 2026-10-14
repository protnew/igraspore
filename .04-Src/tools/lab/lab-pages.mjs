import { mdToHtml } from './lab-md.mjs';

const NAV = [
  ['index.html', 'Оглавление'],
  ['buttons.html', 'Кнопки'],
  ['competitors.html', 'Конкуренты'],
  ['languages.html', 'Языки'],
  ['tests.html', 'Тесты'],
  ['ui-audit.html', 'Аудит'],
  ['store-readiness.html', 'Стор'],
  ['tz-index.html', 'ТЗ'],
  ['media.html', 'Медиа'],
];

export function page(title, body, sha) {
  const links = NAV.map(([href, name]) => '<a href="' + href + '">' + name + '</a>').join('');
  return '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title><style>' + CSS + '</style></head><body><header>' + links + '<span>sha ' + sha + '</span></header><main><h1>' + title + '</h1>' + body + '</main></body></html>';
}

const CSS = ':root{--bg:#0c1020;--panel:#161d33;--acc:#ffd27a;--link:#7ab8ff;--text:#e8eefc}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.45 system-ui,sans-serif}header{display:flex;gap:12px;flex-wrap:wrap;padding:12px 16px;background:#101628;position:sticky;top:0}a{color:var(--link)}main{padding:16px;max-width:1100px}table{border-collapse:collapse;width:100%;background:var(--panel)}td,th{border:1px solid #2a3558;padding:6px 8px;vertical-align:top}code,pre{background:#0a0e1c;color:#d7e2ff}.card{background:var(--panel);padding:12px;margin:12px 0;border-radius:8px}video,img{max-width:100%;height:auto}';

export function buttonsPage(rows) {
  if (!rows.length) return '<p>buttons.json ещё нет. Сначала фаза before.</p>';
  return rows.map((r) => {
    const png = (r.png || []).map((p) => '<img alt="" src="' + fileName(p) + '">').join('');
    const vid = r.webm ? '<video controls preload="none" src="' + fileName(r.webm) + '"></video>' : '<p>видео не выложено</p>';
    return '<article class="card" id="' + r.id + '-' + r.viewport + '"><h2>' + r.id + ' ' + r.selector + '</h2><p>' + r.screen + ' · ' + r.viewport + ' · ' + r.verdict + '</p><p>' + esc(r.label || '') + '</p>' + png + vid + '<p><a href="button/' + r.id + '.html">карточка</a></p></article>';
  }).join('');
}

export function buttonDetail(id, rows) {
  const mine = rows.filter((r) => r.id === id);
  return '<p>' + mine.length + ' записей</p>' + buttonsPage(mine);
}

export function fromMd(text) { return mdToHtml(text); }
function fileName(p) { return String(p).split(/[\\/]/).pop(); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
