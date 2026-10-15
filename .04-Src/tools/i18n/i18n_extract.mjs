#!/usr/bin/env node
// i18n_extract.mjs — codemod выноса строк по TZ v9 §L.2
// Вход: plan JSON [{file, line, find, key, ru, en, mode, params}]
//   file   — 'js/ui.js' или 'index.html' (путь от .04-Src или корня)
//   line   — строка находки из i18n-inventory
//   find   — точный текст литерала (для ternary — любая ветка можно опустить)
//   key    — имя ключа словаря
//   ru/en  — значения словаря (с {параметрами} при надобности)
//   params — {имя: 'js-выражение'} → tt('key',{имя:expr})
//   mode   — 'lit' (по умолч.), 'ternary' (заменить весь curLang?:),
//            'binary' (заменить цепочку конкатенации, содержащую литерал),
//            'html-text' / 'html-attr:<имя>' — для index.html (точная строка-замена)
// Выход: правит файлы, дописывает ключи в i18n/ru.json и en.json (сортировка, 2sp).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', '..');
const ROOT = path.resolve(SRC, '..');
const PLAN = process.argv.find(a => a.startsWith('--plan='));
if (!PLAN) { console.error('usage: i18n_extract.mjs --plan=<json>'); process.exit(2); }
const plan = JSON.parse(fs.readFileSync(PLAN.slice(7), 'utf8'));

const ruFile = path.join(SRC, 'i18n', 'ru.json');
const enFile = path.join(SRC, 'i18n', 'en.json');
const ruDict = JSON.parse(fs.readFileSync(ruFile, 'utf8'));
const enDict = JSON.parse(fs.readFileSync(enFile, 'utf8'));

function jsesc(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
function ttCall(key, params) {
  if (!params || !Object.keys(params).length) return `tt(${jsesc(key)})`;
  const ps = Object.entries(params).map(([k, v]) => `${k}:${v}`).join(',');
  return `tt(${jsesc(key)},{${ps}})`;
}

let applied = 0, missed = 0;
const byFile = {};
for (const it of plan) (byFile[it.file] = byFile[it.file] || []).push(it);

for (const [rel, items] of Object.entries(byFile)) {
  const abs = rel === 'index.html' ? path.join(ROOT, 'index.html')
    : path.join(SRC, rel);
  if (!fs.existsSync(abs)) { console.log('NOFILE', rel); missed += items.length; continue; }
  let code = fs.readFileSync(abs, 'utf8');

  if (items.some(i => i.mode && i.mode.startsWith('html'))) {
    // текстовая замена в html по точному совпадению (атрибут/узел)
    for (const it of items) {
      const idx = code.indexOf(it.find);
      if (idx < 0) { console.log('MISS html', rel, it.line, JSON.stringify(it.find).slice(0, 60)); missed++; continue; }
      code = code.slice(0, idx) + it.repl + code.slice(idx + it.find.length);
      ruDict[it.key] = it.ru; enDict[it.key] = it.en; applied++;
    }
    fs.writeFileSync(abs, code);
    continue;
  }

  // JS: находим ноды по позициям, заменяем с конца файла к началу
  const ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'script', locations: true });
  const repls = [];
  const climb = (node, ancestors) => {
    // вернуть [targetNode, отРодителяВверхСписокИндексов] уже отсортировано просто target
    return node;
  };
  walk.ancestor(ast, {
    Literal(node, ancestors) {
      for (const it of items) {
        if (it._done) continue;
        if (node.loc.start.line !== it.line) continue;
        if (it.find != null && String(node.value) !== it.find) continue;
        let target = node;
        if (it.mode === 'binary' || it.mode === 'chain' || it.mode === 'condLift') {
          target = node;
          for (let i = ancestors.length - 2; i >= 0; i--) {
            const a = ancestors[i];
            if (it.mode === 'binary') {
              if (a.type === 'BinaryExpression' && a.operator === '+') { target = a; continue; }
              break;
            }
            if (it.mode === 'chain') {
              // a.b(...).c(...) цепочки и вызов, где литерал — аргумент
              if (a.type === 'MemberExpression' && a.object === target) { target = a; continue; }
              if (a.type === 'CallExpression' && (a.callee === target || a.arguments.includes(target))) { target = a; continue; }
              break;
            }
            if (it.mode === 'condLift') {
              // подъём через ветку тернария/логики и через обёртку-вызов igsText/tt/tx
              if (a.type === 'ConditionalExpression' || a.type === 'LogicalExpression') { target = a; continue; }
              if (a.type === 'CallExpression' && a.callee && a.callee.name && ['igsText', 'tt', 'tx'].includes(a.callee.name) && a.arguments.includes(target)) { target = a; continue; }
              break;
            }
          }
        }
        const txt = it.mode === 'inline' ? it.repl : ttCall(it.key, it.params);
        repls.push({ s: target.start, e: target.end, text: txt });
        if (it.key) { ruDict[it.key] = it.ru; enDict[it.key] = it.en; }
        it._done = true; applied++;
      }
    },
    ConditionalExpression(node) {
      for (const it of items) {
        if (it._done || it.mode !== 'ternary') continue;
        if (node.loc.start.line !== it.line) continue;
        let hasCur = false;
        walk.simple(node.test, { Identifier(n) { if (n.name === 'curLang') hasCur = true; } });
        if (!hasCur) continue;
        repls.push({ s: node.start, e: node.end, text: ttCall(it.key, it.params) });
        ruDict[it.key] = it.ru; enDict[it.key] = it.en;
        it._done = true; applied++;
      }
    },
    TemplateLiteral(node) {
      for (const it of items) {
        if (it._done || it.mode !== 'template') continue;
        if (node.loc.start.line !== it.line) continue;
        repls.push({ s: node.start, e: node.end, text: ttCall(it.key, it.params) });
        ruDict[it.key] = it.ru; enDict[it.key] = it.en;
        it._done = true; applied++;
      }
    },
    AssignmentExpression(node) {
      const l = node.left;
      if (l.type !== 'MemberExpression') return;
      const prop = l.property && (l.property.name || l.property.value);
      if (!['innerHTML', 'textContent', 'innerText', 'title', 'placeholder'].includes(prop)) return;
      for (const it of items) {
        if (it._done || it.mode !== 'dom') continue;
        if (node.loc.start.line !== it.line) continue;
        repls.push({ s: node.right.start, e: node.right.end, text: ttCall(it.key, it.params) });
        ruDict[it.key] = it.ru; enDict[it.key] = it.en;
        it._done = true; applied++;
      }
    }
  });
  for (const it of items) if (!it._done) { console.log('MISS js', rel, it.line, JSON.stringify(it.find || '').slice(0, 60)); missed++; }
  repls.sort((a, b) => b.s - a.s);
  for (const r of repls) code = code.slice(0, r.s) + r.text + code.slice(r.e);
  fs.writeFileSync(abs, code);
}

// словари: сортировка + 2sp
for (const [f, d] of [[ruFile, ruDict], [enFile, enDict]]) {
  const sorted = {};
  for (const k of Object.keys(d).sort()) sorted[k] = d[k];
  fs.writeFileSync(f, JSON.stringify(sorted, null, 2) + '\n');
}
console.log(`extract: applied=${applied} missed=${missed} | ru=${Object.keys(ruDict).length} en=${Object.keys(enDict).length}`);
process.exit(missed ? 1 : 0);
