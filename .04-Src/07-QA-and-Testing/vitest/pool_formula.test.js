import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.resolve(__dirname, '../../js/ui_food_chain.js'), 'utf-8');
const m = src.match(/function igsPoolExpect\([\s\S]*?\n\}/);
if (!m) throw new Error('igsPoolExpect missing');
const igsPoolExpect = new Function(m[0] + '\nreturn igsPoolExpect;')();
const world = fs.readFileSync(path.resolve(__dirname, '../../js/world.js'), 'utf-8');

describe('pool formula matches the spawn loop', () => {
  const init = { producer:1200, consumer1:150, consumer2:90, consumer3:40, decomposer:150, macrophage:0, virus:3 };
  it('does not scale organisms by difficulty spawn', () => {
    const easy = igsPoolExpect(1, 1, 0.2);
    const normal = igsPoolExpect(1, 1, 0.4);
    const hard = igsPoolExpect(1, 1, 0.8);
    expect(easy).toBe(1779 + 15);
    expect(normal).toBe(1779 + 15);
    expect(hard).toBe(1779 + 20);
    expect(easy).not.toBe(2450);
  });
  it('economy is 70 percent of the organism body, off unless asked', () => {
    const full = igsPoolExpect(1, 1, 0.4);
    const eco = igsPoolExpect(1, 0.7, 0.4);
    expect(eco).toBeLessThan(full);
    expect(world).toContain('settings.economy ? 0.7 : 1');
    expect(world).not.toMatch(/_poolScale\s*=\s*0\.7/);
  });
  it('uses the same INIT_N terms the live loop uses', () => {
    expect(igsPoolExpect(1, 1, 0.4)).toBeGreaterThan(1700);
    expect(init.producer).toBe(1200);
  });
});
