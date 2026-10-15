#!/usr/bin/env node
// i18n_lint.mjs — инвентаризация строк по TZ v9 §L.1
// AST (acorn+acorn-walk) над .04-Src/js/*.js + текстовые узлы и title/placeholder/aria-label в index.html.
// Находит: литералы с буквами вне tt(), тернарии curLang, innerHTML/textContent с литералом, шаблонные строки с текстом.
// Файлы-словари i18n (i18n_hud.js, i18n_detect.js) и wiki-данные (wiki_articles.js) — не сканируются (L.2/L.3 отдельно).
// Выход: 09-Docs/out-dev-factory/logs-release-ready-2026-10-14/i18n-inventory-<tag>.json
// --strict: exit 1 при находках cat=ui вне allow-листа.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', '..');
const ROOT = path.resolve(SRC, '..');
const JS_DIR = path.join(SRC, 'js');
const LOG_DIR = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14');
const ALLOW_FILE = path.join(HERE, 'i18n_lint.allow.json');
const STRICT = process.argv.includes('--strict');
const TAG = (process.argv.find(a => a.startsWith('--tag=')) || '--tag=before').slice(6);

// файлы-исключения: механизм i18n (сами словари L.2 переносятся в json) и wiki-данные (U08 отдельно)
const SKIP_FILES = new Set(['js/i18n_hud.js', 'js/i18n_hud_ru.js', 'js/i18n_hud_en.js', 'js/i18n_detect.js', 'js/wiki_articles.js']);
// имена переменных-данных: латинские названия видов, формы, цвета, словарь имён языков, подписи локалей — не UI-строки
const DATA_VARS = new Set(['PN', 'CN1', 'CN2', 'CN3', 'DN', 'VN', 'SHAPES', 'CC', 'langNames', 'LANGS', 'WATER_VERT', 'WATER_FRAG', 'VERT', 'FRAG', 'VSRC', 'FSRC']);
// GLSL-шейдеры: технический код, не переводится (L.1: code/data suppression)
const GLSL = /\b(vec[234]|gl_FragColor|gl_Position|attribute|uniform|varying|precision\s+\w+\s+float|void\s+main|mix|fbm|uTime|uResolution|uDayLight|vWaveHeight|vTexCoord)\b/;
// единицы/масштабные суффиксы — не переводятся
const UNITS = /[µμ]m|°C|\bpx\b|\bµm\b/;
// CSS-класс-тоглы: ' act', 'ov show', ' sel' и т.п. — токены разметки, не текст
const CSS_TOKENS = new Set(['ov','show','act','on','sel','collapsed','free','p','sb','sb2','cb','sc','scN','scC','scP','scL','sr','tg','diff','lang-item','swiss','webgl','cartoon','tt','btn','hk','abt','demo-on','is-active-cam','is-active-swiss','is-active-micro','stbl','lbl','val','wiki-entry','wl','rw','kh-keys','kh-sum','div-reason','menu-actions','scrollbox','wiki-search','lang-drop','lang-curr','hidden','inGame','mapLabel','popLabel','free','p']);
// свойства-данные словарей T.ru/T.en пропускаем (L.2 переносит их целиком)

const CYR = /[А-Яа-яЁё]/;
const LET = /[A-Za-zА-Яа-яЁё]/;

const allow = fs.existsSync(ALLOW_FILE) ? JSON.parse(fs.readFileSync(ALLOW_FILE, 'utf8')) : [];
function isAllowed(rel, text, line) {
  for (const a of allow) {
    if (a.file && a.file !== rel) continue;
    if (a.line != null && a.line !== line) continue;
    if (a.exact != null) { if (a.exact === text) return a; continue; }
    if (a.regex) { try { if (new RegExp(a.regex).test(text)) return a; } catch {} continue; }
    if (a.contains != null && String(text).includes(a.contains)) return a;
    if (a.exact == null && !a.regex && a.contains == null) return a; // file+line-only entry
  }
  return null;
}

const findings = [];
function push(file, node, type, text, ctx, cat) {
  findings.push({
    file, line: node && node.loc ? node.loc.start.line : 0,
    type, cat, text: String(text).slice(0, 200), ctx: (ctx || '').slice(0, 80)
  });
}

const hasLetters = v => typeof v === 'string' && LET.test(v);
const isCodeToken = v => /^[a-zA-Z0-9_.\-#\/:{}()=?&%]*$/.test(v) && v.length <= 40 && !/\s/.test(v);
// разметка/CSS/шаблон-плейсхолдеры — не переводимый текст
const isMarkup = v => /<\/?[a-zA-Z]/.test(v) || /style\s*=|[a-z-]+\s*:\s*[^;]+;/.test(v) || /^\{[a-zA-Z]+\}$/.test(v)
  || /\b(rgba?|#[0-9a-fA-F]{3,8}|system-ui|monospace|sans-serif)\b/.test(v) || /^;/.test(v) || /^(bold|italic)\b/.test(v)
  || /^\(.*:\s*[^)]+\)$/.test(v) || /^\.[\w-]/.test(v) || /\{[^}]*\}/.test(v)
  || /&[a-z]+;/.test(v) || /var\(--/.test(v) || /[a-zA-Z-]+\s*=\s*"/.test(v) || /^\s*[\d.]+(px|em|rem|vh|vw|%|fr|s|ms)\b/.test(v)
  || /^[%\w\s]*;[a-z-]+:$/.test(v);
const isCssClassTokens = v => { const t=v.trim().split(/\s+/).filter(Boolean); return t.length>0 && t.every(tok=>CSS_TOKENS.has(tok)); };
// латинский одиночный токен в коде (класс, id, код клавиши, режим, тег, цвет) — cat=code
function latinCat(v, ctx) {
  if (CYR.test(v)) return 'ui';
  if (GLSL.test(v)) return 'code';
  if (isMarkup(v)) return 'code';
  if (isCssClassTokens(v)) return 'code';
  if (UNITS.test(v) && v.length <= 30) return 'code';
  if (isCodeToken(v)) return 'code';
  return 'ui';
}
function ancestorOf(ancestors, type) { for (let i = ancestors.length - 1; i >= 0; i--) if (ancestors[i].type === type) return ancestors[i]; return null; }
function dataVarName(node) {
  if (!node) return '';
  if (node.type === 'VariableDeclaration') return node.declarations.map(d => d.id && d.id.name).filter(Boolean).join(',');
  if (node.type === 'AssignmentExpression' && node.left.type === 'MemberExpression')
    return (node.left.object.name || '') + '.' + (node.left.property.name || node.left.property.value || '');
  return '';
}

function scanJS(fileAbs) {
  const rel = path.relative(SRC, fileAbs).split(path.sep).join('/');
  const code = fs.readFileSync(fileAbs, 'utf8');
  let ast;
  try { ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'script', locations: true, allowHashBang: true }); }
  catch (e) { console.error('parse fail', rel, e.message); return; }

  walk.ancestor(ast, {
    Literal(node, ancestors) {
      const parent = ancestors[ancestors.length - 2];
      if (!hasLetters(node.value)) return;
      if (parent && parent.type === 'CallExpression') {
        const cal = parent.callee;
        const nm = cal.type === 'Identifier' ? cal.name : (cal.property && cal.property.name) || '';
        if (['tt', 'igsText', 'matchMedia', 'getElementById', 'createElement', 'setAttribute', 'getAttribute', 'addEventListener', 'removeEventListener', 'postMessage', 'open', 'send'].includes(nm)) return; // ключ словаря / API-аргумент — не UI-текст
        // console.* и DOM-API (querySelector, classList.*, localStorage.*, canvas ctx) — не UI игрока
        if (cal.type === 'MemberExpression') {
          const on = cal.object.name || (cal.object.object && cal.object.object.name) || '';
          if (['console', 'classList', 'localStorage', 'sessionStorage', 'document', 'navigator', 'location', 'ctx', 'g', 'gl'].includes(on)) return;
          const prop = (cal.property && cal.property.name) || '';
          if (['querySelector', 'querySelectorAll', 'getElementById', 'getContext', 'setAttribute', 'getAttribute', 'addEventListener', 'removeEventListener', 'setProperty', 'appendChild'].includes(prop)) return;
        }
      }
      if (parent && parent.type === 'ExpressionStatement' && node.value === 'use strict') return;
      if (parent && (parent.type === 'ImportDeclaration' || parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportAllDeclaration')) return;
      if (parent && parent.type === 'CallExpression' && parent.callee.name === 'require') return;
      if (parent && parent.type === 'Property' && parent.key === node && !parent.computed) return; // ключ объекта
      if (parent && parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return;
      // литерал внутри данных: var PN=[...] / SHAPES={...} / T.ru={...}
      const holder = ancestorOf(ancestors, 'VariableDeclaration') || ancestorOf(ancestors, 'AssignmentExpression');
      const hname = dataVarName(holder);
      if (hname && (hname.split(',').some(n => DATA_VARS.has(n)) || hname === 'T.ru' || hname === 'T.en')) return;
      const type = CYR.test(node.value) ? 'cyrillic' : 'literal';
      push(rel, node, type, node.value, 'Literal', latinCat(node.value));
    },
    ConditionalExpression(node) {
      let hasCur = false;
      walk.simple(node.test, { Identifier(n) { if (n.name === 'curLang') hasCur = true; } });
      if (!hasCur) return;
      const texts = [];
      for (const side of [node.consequent, node.alternate]) {
        if (side.type === 'Literal') texts.push(side.value);
        else if (side.type === 'TemplateLiteral') texts.push(side.quasis.map(q => q.value.cooked).join('${…}'));
      }
      push(rel, node, 'ternary', texts.join(' | '), 'curLang ? :', 'ui');
    },
    TemplateLiteral(node, ancestors) {
      if (ancestors[ancestors.length - 2] && ancestors[ancestors.length - 2].type === 'TaggedTemplateExpression') return;
      const holder = ancestorOf(ancestors, 'VariableDeclaration');
      const hname = dataVarName(holder);
      if (hname && hname.split(',').some(n => DATA_VARS.has(n))) return;
      const text = node.quasis.map(q => q.value.cooked || '').join('');
      if (!hasLetters(text)) return;
      push(rel, node, 'template', text.trim().replace(/\s+/g, ' ').slice(0, 120), 'TemplateLiteral', latinCat(text.trim()));
    },
    AssignmentExpression(node) {
      const l = node.left;
      if (l.type !== 'MemberExpression') return;
      const prop = l.property && (l.property.name || l.property.value);
      if (!['innerHTML', 'textContent', 'innerText', 'title', 'placeholder', 'aria-label'].includes(prop)) return;
      const r = node.right;
      let txt = '';
      if (r.type === 'Literal') txt = String(r.value);
      else if (r.type === 'TemplateLiteral') txt = r.quasis.map(q => q.value.cooked || '').join('${…}');
      if (!txt || !hasLetters(txt)) return;
      push(rel, node, 'dom', txt.slice(0, 160), prop + '=', 'ui');
    }
  });
}

function scanHTML(fileAbs) {
  const rel = path.relative(SRC, fileAbs).split(path.sep).join('/');
  const lines = fs.readFileSync(fileAbs, 'utf8').split(/\r?\n/);
  const attrRe = /(?<![\w-])(title|placeholder|aria-label|alt|data-en|data-ru|data-i18n)\s*=\s*"([^"]+)"/g;
  let inScript = false, inStyle = false;
  lines.forEach((ln, i) => {
    if (/<script[\s>]/.test(ln)) inScript = true;
    if (/<style[\s>]/.test(ln)) inStyle = true;
    let m;
    while ((m = attrRe.exec(ln))) {
      if (hasLetters(m[2])) push(rel, { loc: { start: { line: i + 1 } } }, 'html-attr', m[2], m[1], 'ui');
    }
    if (!inScript && !inStyle) {
      const txtRe = />([^<]+)</g;
      while ((m = txtRe.exec(ln))) {
        const t = m[1].trim();
        if (!t || !hasLetters(t)) continue;
        // буквы-горячие клавиши в <span class="hk">…</span> — не переводятся (код клавиши)
        const before = ln.slice(Math.max(0, m.index - 80), m.index);
        if (/class\s*=\s*"hk"/.test(before)) { push(rel, { loc: { start: { line: i + 1 } } }, 'html-text', t.slice(0, 120), 'node', 'code'); continue; }
        push(rel, { loc: { start: { line: i + 1 } } }, 'html-text', t.slice(0, 120), 'node', 'ui');
      }
    }
    if (/<\/script>/.test(ln)) inScript = false;
    if (/<\/style>/.test(ln)) inStyle = false;
  });
}

const jsFiles = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js')).map(f => path.join(JS_DIR, f))
  .filter(f => !SKIP_FILES.has(path.relative(SRC, f).split(path.sep).join('/')));
for (const f of jsFiles) scanJS(f);
const idx = path.join(ROOT, 'index.html');
if (fs.existsSync(idx)) scanHTML(idx);

let open = 0, allowed = 0, code = 0;
for (const f of findings) {
  const a = isAllowed(f.file, f.text, f.line);
  f.allowed = a ? (a.reason || a.category || 'allow') : null;
  if (f.cat === 'code') { code++; f.suppressed = 'code-token'; continue; }
  if (a) allowed++; else open++;
}
const byType = {};
for (const f of findings) if (f.cat !== 'code') byType[f.type] = (byType[f.type] || 0) + 1;
const ternCount = findings.filter(f => f.type === 'ternary').length;

fs.mkdirSync(LOG_DIR, { recursive: true });
const outFile = path.join(LOG_DIR, `i18n-inventory-${TAG}.json`);
fs.writeFileSync(outFile, JSON.stringify({ generated: new Date().toISOString(), total: findings.length, open, allowed, codeSuppressed: code, byType, findings }, null, 2));

console.log(`i18n_lint: files=${jsFiles.length + (fs.existsSync(idx) ? 1 : 0)} findings=${findings.length} open=${open} allowed=${allowed} code=${code}`);
console.log('byType:', JSON.stringify(byType));
console.log(`curLang-ternaries: ${ternCount}`);
console.log('log:', path.relative(ROOT, outFile).split(path.sep).join('/'));
if (STRICT && open > 0) { console.log('FAIL open=' + open); process.exit(1); }
console.log('OK');
