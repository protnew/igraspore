import { describe, it, expect } from 'vitest';
import fs from 'fs'; import path from 'path';
const SRC = process.cwd(); // .04-Src
const REG = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/languages.json'), 'utf8'));
const fnSrc = (() => { const s = fs.readFileSync(path.join(SRC, 'js/config.js'), 'utf8');
  return s.slice(s.indexOf('function igsNum'), s.indexOf('if(typeof window', s.indexOf('function igsNum'))); })();

describe('A3: igsNum — система цифр из реестра (Р7: умолчание Intl, ar=latn)', () => {
  it('digits реестра синхронен с фактическим Intl', () => {
    for (const l of REG) {
      const fact = new Intl.NumberFormat(l.code).resolvedOptions().numberingSystem || 'latn';
      expect(l.digits, l.code).toBe(l.code === 'ar' ? 'latn' : fact);
    }
  });
  it('не-latn системы реально форматируются родными цифрами', () => {
    const natives = REG.filter(l => l.digits !== 'latn');
    expect(natives.length).toBeGreaterThan(0);
    for (const l of natives) {
      const f = new Function('curLang', fnSrc + '; return igsNum;')(l.code);
      expect(f(101), l.code).not.toMatch(/^101$/); // родные цифры, не латиница
    }
  });
  it('latn-языки (и ar) — 101 латиницей', () => {
    for (const l of REG.filter(x => x.digits === 'latn')) {
      const f = new Function('curLang', fnSrc + '; return igsNum;')(l.code);
      expect(f(101), l.code).toBe('101');
    }
  });
});
