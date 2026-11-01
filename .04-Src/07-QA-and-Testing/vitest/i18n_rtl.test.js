import { describe, it, expect } from 'vitest';
import fs from 'fs'; import path from 'path';
const SRC = path.join(process.cwd()); // .04-Src
const REG = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/languages.json'), 'utf8'));
const det = fs.readFileSync(path.join(SRC, 'js/i18n_detect.js'), 'utf8');

describe('v25 A4: RTL-инфраструктура', () => {
  it('карта __IGS_DIR содержит ровно rtl-языки реестра', () => {
    const m = det.match(/var __IGS_DIR = (\{[^\n]*\});/);
    expect(m, '__IGS_DIR сгенерирован').toBeTruthy();
    const dirmap = JSON.parse(m[1]);
    const expectRtl = REG.filter(l => l.dir === 'rtl').map(l => l.code).sort();
    expect(Object.keys(dirmap).sort()).toEqual(expectRtl);
    expect(expectRtl).toEqual(['ar', 'ckb', 'fa', 'he', 'ps', 'sd', 'ur']);
  });
  it('applyLangFont применяет dir и класс igs-rtl', () => {
    expect(det).toContain("document.documentElement.setAttribute('dir', _dir)");
    expect(det).toContain("document.body.classList.toggle('igs-rtl', _dir === 'rtl')");
  });
  it('style.css содержит RTL-блок', () => {
    const css = fs.readFileSync(path.join(SRC, 'src/style.css'), 'utf8');
    expect(css).toContain('.igs-rtl .ov');
  });
});
