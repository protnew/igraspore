import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

// v20.10 R6: a phone must get the same pool as desktop — mobile.js must not lower settings.density.
// Density is not persisted in localStorage, so there is no stale value to migrate (checked 27.10).
function runMobile(nav) {
  const code = fs.readFileSync(path.resolve(__dirname, '../../js/mobile.js'), 'utf-8');
  const el = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, addEventListener() {}, setAttribute() {}, appendChild() {} });
  const sb = {
    settings: { density: 1 }, console, Math, Date, JSON, parseInt, parseFloat, isNaN, isFinite,
    setTimeout: () => 0, setInterval: () => 0, clearTimeout() {}, requestAnimationFrame: () => 0,
    localStorage: { getItem: () => null, setItem() {} },
    navigator: Object.assign({ userAgent: 'Mozilla/5.0 (Linux; Android 10) Mobile', maxTouchPoints: 5 }, nav),
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 2, screen: { width: 390, height: 844 },
    matchMedia: () => ({ matches: true, addEventListener() {}, addListener() {} }),
    addEventListener() {}, location: { href: '', search: '' },
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], createElement: el, addEventListener() {}, body: el(), documentElement: el(), head: el() },
  };
  sb.window = sb; sb.self = sb;
  vm.createContext(sb);
  try { vm.runInContext(code, sb); } catch (e) { /* DOM-heavy parts may throw; capPerf runs first in its own try */ }
  return sb.settings.density;
}

describe('R6 mobile pool', () => {
  it('weak phone (2 GB, 2 cores) keeps full density', () => {
    expect(runMobile({ deviceMemory: 2, hardwareConcurrency: 2 })).toBe(1);
  });
  it('mid phone (4 GB, 8 cores) keeps full density', () => {
    expect(runMobile({ deviceMemory: 4, hardwareConcurrency: 8 })).toBe(1);
  });
  it('mobile.js still contains no density cap', () => {
    const code = fs.readFileSync(path.resolve(__dirname, '../../js/mobile.js'), 'utf-8');
    expect(/settings\.density\s*=\s*Math\.min/.test(code)).toBe(false);
  });
});
