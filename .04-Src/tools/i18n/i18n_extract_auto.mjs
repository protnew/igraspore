#!/usr/bin/env node
// i18n_extract_auto.mjs — автоматический codemod L.2 для доминирующих паттернов.
// Паттерны:
//   1) curLang==='ru'?'RU':'EN'  →  tt('key')         (и вариант с typeof curLang!=='undefined')
//   2) curLang==='en'?'EN':'RU'  →  tt('key')         (обратный порядок веток)
//   3) ru?'RU':'EN'              →  tt('key')         (только если в файле есть var ru = curLang==='ru')
//   4) (typeof igsText==='function'?)?igsText('k','RU'):'RU'  →  tt('k')
//   5) igsText('k','RU')         →  tt('k')
// Результат: правки .js + карта i18n-extract-map.json {key:{ru,en,sites}} для мержа в ru.json/en.json.
// Ключи автогенерируются: x.<slug(en)> ; одна и та же пара (ru,en) → один ключ.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', '..');
const JS_DIR = path.join(SRC, 'js');
const LOG_DIR = path.join(SRC, '..', '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14');
const MAP_FILE = path.join(LOG_DIR, 'i18n-extract-map.json');
const SKIP = new Set(['i18n_hud.js', 'i18n_hud_ru.js', 'i18n_hud_en.js', 'i18n_detect.js', 'wiki_articles.js']);

const Q = `'(?:[^'\\\\]|\\\\.)*'`;                       // '...' с эскейпами
const RE_RU_EN = new RegExp(`(?:typeof\\s+curLang\\s*!==\\s*'undefined'\\s*&&\\s*)?curLang\\s*===\\s*'ru'\\s*\\?\\s*(${Q})\\s*:\\s*(${Q})`, 'g');
const RE_EN_RU = new RegExp(`(?:typeof\\s+curLang\\s*!==\\s*'undefined'\\s*&&\\s*)?curLang\\s*===\\s*'en'\\s*\\?\\s*(${Q})\\s*:\\s*(${Q})`, 'g');
const RE_RUVAR = new RegExp(`\\bru\\s*\\?\\s*(${Q})\\s*:\\s*(${Q})`, 'g');
const RE_IGS_COND = new RegExp(`typeof\\s+igsText\\s*===\\s*'function'\\s*\\?\\s*igsText\\(\\s*'([^']+)'\\s*,\\s*(${Q})\\s*\\)\\s*:\\s*(${Q})`, 'g');
const RE_IGS = new RegExp(`igsText\\(\\s*'([^']+)'\\s*,\\s*(${Q})\\s*\\)`, 'g');

function unq(s) { // снять кавычки и разэкранировать \uXXXX
  const inner = s.slice(1, -1);
  return inner.replace(/\\u([0-9a-fA-F]{4})/g, (m, c) => String.fromCharCode(parseInt(c, 16)))
              .replace(/\\'/g, "'").replace(/\\n/g, '\n');
}
function slug(en) {
  let s = en.replace(/<[^>]*>/g, ' ').replace(/[^A-Za-z0-9]+/g, ' ').trim().toLowerCase();
  const w = s.split(/\s+/).filter(Boolean);
  let out = '';
  for (const x of w) { const c = out ? x[0].toUpperCase() + x.slice(1) : x; if ((out + c).length > 34) break; out += c; }
  return out || 'str';
}

const map = {};
function keyFor(ru, en) {
  for (const k in map) if (map[k].ru === ru && map[k].en === en) return k;
  const base = 'x.' + slug(en);
  let k = base, n = 2;
  while (map[k] && (map[k].ru !== ru || map[k].en !== en)) k = base + n++;
  map[k] = { ru, en, sites: [] };
  return k;
}

const report = [];
for (const fn of fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js') && !SKIP.has(f))) {
  const fp = path.join(JS_DIR, fn);
  let s = fs.readFileSync(fp, 'utf8');
  let n = 0;
  const hasRuVar = /\bvar\s+ru\s*=\s*[^;]*curLang\s*===\s*'ru'/.test(s) || /\bvar\s+ru\s*=\s*[^;]*curLang\s*!==\s*'en'/.test(s);

  s = s.replace(RE_IGS_COND, (m, k, a) => { map[k] = map[k] || { ru: unq(a), en: '', sites: [] }; map[k].sites.push(fn); n++; return `tt('${k}')`; });
  s = s.replace(RE_IGS, (m, k, a) => { map[k] = map[k] || { ru: unq(a), en: '', sites: [] }; map[k].sites.push(fn); n++; return `tt('${k}')`; });
  s = s.replace(RE_RU_EN, (m, a, b) => { const k = keyFor(unq(a), unq(b)); map[k].sites.push(fn); n++; return `tt('${k}')`; });
  s = s.replace(RE_EN_RU, (m, a, b) => { const k = keyFor(unq(b), unq(a)); map[k].sites.push(fn); n++; return `tt('${k}')`; });
  if (hasRuVar) s = s.replace(RE_RUVAR, (m, a, b) => { const k = keyFor(unq(a), unq(b)); map[k].sites.push(fn); n++; return `tt('${k}')`; });

  if (n) { fs.writeFileSync(fp, s); report.push(`${fn}: ${n}`); }
}

fs.mkdirSync(LOG_DIR, { recursive: true });
fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
console.log('extract-auto: replaced per file:'); report.forEach(r => console.log('  ' + r));
console.log(`keys in map: ${Object.keys(map).length}`);
console.log('map:', path.relative(SRC, MAP_FILE));
