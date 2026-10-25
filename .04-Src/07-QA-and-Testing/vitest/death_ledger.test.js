import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.resolve(__dirname, '../../js/ui_screens.js'), 'utf-8');
const m = src.match(/function deathLedger\([\s\S]*?\n\}/);
if (!m) throw new Error('deathLedger missing');
const deathLedger = new Function(m[0] + '\nreturn deathLedger;')();

describe('deathLedger', () => {
  it('dead is start + born - alive and never negative', () => {
    expect(deathLedger(100, 5, 104, 2.2, 3, 104).dead).toBe(1);
    expect(deathLedger(100, 0, 120, 2, 1, 120).dead).toBe(0);
  });
  it('time is the cell age, not the session clock', () => {
    expect(deathLedger(10, 1, 10, 2.4, 1, 10).time).toBe(2);
  });
  it('EXTINCT only when the species and the pond are both gone', () => {
    expect(deathLedger(10, 0, 9, 3, 0, 9).title).toBe('Your cell died');
    expect(deathLedger(10, 0, 9, 3, 0, 9).extinct).toBe(false);
    expect(deathLedger(10, 0, 0, 3, 0, 0).title).toBe('EXTINCT');
    expect(deathLedger(10, 0, 0, 3, 0, 0).extinct).toBe(true);
  });
});

// v20.6 R1: сумма показанных причин + Other = Dead на экране (ТЗ: «Сумма причин = Dead»)
describe('v20.6 R1: causes + Other = shown Dead', () => {
  const screenSrc = fs.readFileSync(path.resolve(__dirname, '../../js/ui_screens.js'), 'utf-8');

  const fn = screenSrc.match(/function deathCauseRow\([\s\S]*?\n\}/);
  if (!fn) throw new Error('deathCauseRow missing');
  const deathCauseRow = new Function(fn[0] + '\nreturn deathCauseRow;')();
  function renderCauses(globalDead, causes){
    return deathCauseRow(globalDead, causes);
  }

  it('Other closes the gap: sum + Other = Dead (long-life case 9 = 3+0+1+0+2 + 3)', () => {
    const r = renderCauses(9, [3, 0, 1, 0, 2]);
    expect(r.total).toBe(9);
    expect(r.other).toBe(3);
  });

  it('приёмка de-1280 (Dead 0 при видимых 1+5): Dead показывается как сумма, не врёт', () => {
    const r = renderCauses(0, [1, 0, 0, 0, 5]);
    expect(r.shownDead).toBe(6);
    expect(r.other).toBe(0);
    expect(r.total).toBe(r.shownDead);
  });

  it('приёмка de-390 (Dead 9 при 1+21) / th-390 (Dead 5 при 1+17)', () => {
    const a = renderCauses(9, [1, 0, 0, 0, 21]);
    expect(a.shownDead).toBe(22);
    expect(a.other).toBe(0);
    expect(a.total).toBe(22);
    const b = renderCauses(5, [1, 0, 0, 0, 17]);
    expect(b.shownDead).toBe(18);
    expect(b.total).toBe(18);
  });

  it('строка Other рендерится всегда (не под if), контракт исходника', () => {
    expect(screenSrc).toContain("tt('deadOther')");
    expect(screenSrc).not.toMatch(/if\s*\(\s*other\s*\)\s*html\s*\+=/);
  });
});
