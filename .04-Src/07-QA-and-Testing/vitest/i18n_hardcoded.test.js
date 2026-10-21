// i18n_hardcoded.test.js — U07 приёмка: 0 кириллических строковых литералов
// в .04-Src/js вне словарных файлов (config.js T-объекты, i18n_hud.js).
// Комментарии допустимы — проверяются только литералы (AST, acorn).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const SRC = path.resolve(__dirname, '../../js');
// Файлы-источники строк (не UI-хардкод): встроенные словари ru/en.
const EXEMPT = new Set(['config.js', 'i18n_hud.js', 'i18n_hud_ru.js', 'i18n_hud_en.js']);
const CYR = /[Ѐ-ӿ]/;

function collect(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collect(p, out);
    else if (e.name.endsWith('.js') && !EXEMPT.has(e.name)) out.push(p);
  }
  return out;
}

function cyrLiterals(file) {
  const src = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = acorn.parse(src, { ecmaVersion: 2020, allowHashBang: true });
  } catch (e) {
    return ['PARSE FAIL: ' + e.message];
  }
  const hits = [];
  walk.simple(ast, {
    Literal(n) {
      if (typeof n.value === 'string' && CYR.test(n.value)) {
        hits.push(n.start + ': ' + JSON.stringify(n.value).slice(0, 80));
      }
    },
    TemplateElement(n) {
      if (n.value && CYR.test(n.value.cooked || '')) {
        hits.push(n.start + ': tpl ' + JSON.stringify(n.value.cooked).slice(0, 80));
      }
    },
  });
  return hits;
}

describe('U07: нет кириллических литералов в коде (вне i18n/data)', () => {
  const files = collect(SRC);
  it('сканирует ненулевое число файлов', () => {
    expect(files.length).toBeGreaterThan(10);
  });
  for (const f of files) {
    it(path.basename(f), () => {
      const hits = cyrLiterals(f);
      expect(hits, hits.slice(0, 5).join('\n')).toEqual([]);
    });
  }
});
