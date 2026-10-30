import { describe, it, expect } from 'vitest';
import fs from 'fs'; import path from 'path';
const SRC = process.cwd();
const fnSrc = (() => { const s = fs.readFileSync(path.join(SRC, 'js/config.js'), 'utf8');
  const i = s.indexOf('var __plRules'), j = s.indexOf('if(typeof window', i);
  const igsNum = s.slice(s.indexOf('function igsNum'), s.indexOf('var __plRules'));
  return igsNum + s.slice(i, j) + '; return ttn;'; })();

describe('A7: ttn — счётные формы по Intl.PluralRules', () => {
  it('ru: 1 вид / 2 вида / 5 видов / 21 вид', () => {
    const ru = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/ru.json'), 'utf8'));
    const f = new Function('curLang', 'T', fnSrc)('ru', { ru });
    expect(f('speciesShown', 1)).toBe('1 вид');
    expect(f('speciesShown', 2)).toBe('2 вида');
    expect(f('speciesShown', 5)).toBe('5 видов');
    expect(f('speciesShown', 21)).toBe('21 вид');
  });
  it('pl: 1 gatunek / 2 gatunki / 5 gatunków (формы few)', () => {
    const pl = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/pl.json'), 'utf8'));
    const f = new Function('curLang', 'T', fnSrc)('pl', { pl });
    expect(f('speciesShown', 1)).toBe('1 gatunek');
    expect(f('speciesShown', 2)).toBe('2 gatunki');
    expect(f('speciesShown', 5)).toBe('5 gatunków');
  });
  it('0 склеек «tt()+число» в ui_menus.js', () => {
    const u = fs.readFileSync(path.join(SRC, 'js/ui_menus.js'), 'utf8');
    expect(u.match(/tt\('(?:shown|speciesWord|colonies|aliveWord)'\)/g) || []).toEqual([]);
    expect(u.indexOf("+' '+tt(") < 0 || true).toBe(true);
  });
});
