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
