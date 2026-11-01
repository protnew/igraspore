import { describe, it, expect } from 'vitest';
import fs from 'fs'; import path from 'path';
const SRC = process.cwd(); // .04-Src
const REG = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/languages.json'), 'utf8'));
// v25: igsNum читает __IGS_DIGITS (реестр — единственный источник, ICU-версии сред различаются),
// поэтому к срезу функции добавляем сгенерированную карту (кавычки JS → JSON).
const s0 = fs.readFileSync(path.join(SRC, 'js/config.js'), 'utf8');
const mapM = s0.match(/var __IGS_DIGITS=(\{[^\n]*\});/);
const mapLine = mapM ? mapM[0] : '';
const fnSrc = mapLine + '\n' + s0.slice(s0.indexOf('function igsNum'), s0.indexOf('if(typeof window', s0.indexOf('function igsNum')));

const VALID = new Set(['latn','beng','deva','arab','arabext','mymr','khmr','laoo','orya','tibt','thai']);

describe('A3: igsNum — система цифр из реестра (Р7: ar=latn; v25 — реестр источник)', () => {
  it('__IGS_DIGITS в config.js синхронен с реестром languages.json', () => {
    expect(mapM, '__IGS_DIGITS сгенерирован').toBeTruthy();
    const map = JSON.parse(mapM[1].replace(/'/g, '"'));
    for (const l of REG) expect(map[l.code], l.code).toBe(l.digits || 'latn');
  });
  it('digits реестра валидны; ar = latn (Р7)', () => {
    for (const l of REG) expect(VALID.has(l.digits), l.code + '=' + l.digits).toBe(true);
    expect(REG.find(l => l.code === 'ar').digits).toBe('latn');
  });
  it('не-latn системы реально форматируются родными цифрами (детерминизм)', () => {
    const natives = REG.filter(l => l.digits !== 'latn');
    expect(natives.length).toBeGreaterThan(0);
    for (const l of natives) {
      const f = new Function('curLang', fnSrc + '; return igsNum;')(l.code);
      expect(f(101), l.code).not.toMatch(/^101$/); // родные цифры, не латиница
    }
  });
  it('latn-языки (и ar) — 101 латиницей (детерминизм)', () => {
    for (const l of REG.filter(x => x.digits === 'latn')) {
      const f = new Function('curLang', fnSrc + '; return igsNum;')(l.code);
      expect(f(101), l.code).toBe('101');
    }
  });
});
