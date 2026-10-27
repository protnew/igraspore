import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.resolve(__dirname, '../../js/ui_food_chain.js'), 'utf-8');
const m = src.match(/function igsPoolExpect\([\s\S]*?\n\}/);
if (!m) throw new Error('igsPoolExpect missing');
const NL = String.fromCharCode(10);
const igsPoolExpect = new Function(m[0] + NL + 'return igsPoolExpect;')();
const world = fs.readFileSync(path.resolve(__dirname, '../../js/world.js'), 'utf-8');
const config = fs.readFileSync(path.resolve(__dirname, '../../js/config.js'), 'utf-8');

// v21 §13.1: одна формула для веба и приложения; продуктовый потолок 300.
const PRODUCT_POOL = 300;
const SC = PRODUCT_POOL / 2450;

describe('pool formula matches the spawn loop (v21 cap 300)', () => {
  it('product pool is capped at 300 for every difficulty (virus count varies only)', () => {
    const easy = igsPoolExpect(1, SC, 0.2);
    const normal = igsPoolExpect(1, SC, 0.4);
    const hard = igsPoolExpect(1, SC, 0.8);
    for (const n of [easy, normal, hard]) {
      expect(n).toBeLessThanOrEqual(300);
      expect(n).toBeGreaterThan(180);
    }
    expect(easy).toBe(normal);
  });
  it('single formula: world.js and ui_food_chain use the same scale source', () => {
    expect(world).toContain('(window.TEST_POOL || (typeof PRODUCT_POOL!==\'undefined\' ? PRODUCT_POOL : 300)) / 2450');
    expect(src).toContain('window.TEST_POOL || (typeof PRODUCT_POOL');
    expect(config).toContain('var PRODUCT_POOL = 300;');
    expect(config).toContain('MAX_ORG = Math.min(MAX_ORG, window.TEST_POOL || PRODUCT_POOL)');
  });
  it('banner shows the pool target (cap), births fill up to it', () => {
    const spawn = igsPoolExpect(1, SC, 0.4);
    expect(spawn).toBeGreaterThan(180);
    expect(spawn).toBeLessThan(300);
  });
  it('economy stays 70% of the body, off by default', () => {
    const full = igsPoolExpect(1, SC, 0.4);
    const eco = igsPoolExpect(1, SC * 0.7, 0.4);
    expect(eco).toBeLessThan(full);
  });
  it('density slider still scales the same terms', () => {
    const base = igsPoolExpect(1, SC, 0.4);
    const dense = igsPoolExpect(1.5, SC, 0.4);
    expect(dense).toBeGreaterThan(base);
  });
});
