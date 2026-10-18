// Подсказки HUD: в initTooltips нет кириллицы, ключи есть в 20 словарях.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COPIES = [
  '.04-Src/js/ui.js',
  '06-DevOps-and-Release/cf-publish/04-Src/js/ui.js',
  '.04-Src/v3-webgl/js/ui.js',
  '06-DevOps-and-Release/cf-publish/04-Src/v3-webgl/js/ui.js',
];
const KEYS = ['tip.popC','tip.fpsL','tip.lightL','tip.tempL','tip.daysL','tip.energyBar','tip.ageBar','tip.cbFilter','tip.lang'];

function tooltipBody(text) {
  const a = text.indexOf('function initTooltips');
  const b = text.indexOf('setTimeout(initTooltips', a);
  return text.slice(a, b > a ? b : a + 800);
}

describe('HUD tooltips', () => {
  it('initTooltips без кириллицы во всех копиях', () => {
    const bad = [];
    for (const rel of COPIES) {
      const body = tooltipBody(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
      if (/[А-Яа-яЁё]/.test(body)) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });
  it('девять ключей подсказок есть в 20 словарях', () => {
    const langs = JSON.parse(fs.readFileSync(path.join(ROOT, '.04-Src/i18n/languages.json'), 'utf8')).map((l) => l.code);
    expect(langs.length).toBe(20);
    const miss = [];
    for (const code of langs) {
      const dict = JSON.parse(fs.readFileSync(path.join(ROOT, '.04-Src/i18n', code + '.json'), 'utf8'));
      for (const k of KEYS) if (!(k in dict)) miss.push(code + ':' + k);
    }
    expect(miss).toEqual([]);
  });
});
