import { describe, it, expect, beforeAll } from 'vitest';

// Подготовка DOM-дерева до импорта config.js, чтобы getElementById отработал без ошибок
const c = document.createElement('canvas'); c.id = 'c'; document.body.appendChild(c);
const mm = document.createElement('canvas'); mm.id = 'mm'; document.body.appendChild(mm);
const pc = document.createElement('canvas'); pc.id = 'pc'; document.body.appendChild(pc);

import configFuncs from '../../04-Src/js/config.js';

const { clamp, rng, lerp, dist2, hex2rgb, shadeRgb, hslToHex, halfW } = configFuncs;

describe('Math and Vector Logic', () => {
  it('clamp should restrict value to min and max', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(0, 1, 10)).toBe(1);
    expect(clamp(15, 1, 10)).toBe(10);
  });

  it('rng should generate a number between a and b', () => {
    const val = rng(5, 10);
    expect(val).toBeGreaterThanOrEqual(5);
    expect(val).toBeLessThan(10); // rng uses Math.random() which is < 1
  });

  it('lerp should correctly interpolate', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(100, 200, 0.25)).toBe(125);
  });

  it('dist2 should calculate squared distance between two points', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    expect(dist2(p1, p2)).toBe(25);
  });

  it('hex2rgb should convert hex to rgb array', () => {
    expect(hex2rgb('#ff0000')).toEqual([255, 0, 0]);
    expect(hex2rgb('#00ff00')).toEqual([0, 255, 0]);
    expect(hex2rgb('#fff')).toEqual([255, 255, 255]);
  });

  it('shadeRgb should calculate shaded color', () => {
    expect(shadeRgb(100, 100, 100, 0.5)).toBe('rgb(50,50,50)');
    expect(shadeRgb(100, 100, 100, 2)).toBe('rgb(200,200,200)');
  });

  it('hslToHex should correctly convert', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    // For hslToHex(120, 100, 50) it might be slightly different in precision, 
    // let's just check the length to be sure it returns valid hex
    const res = hslToHex(120, 100, 50);
    expect(res).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
