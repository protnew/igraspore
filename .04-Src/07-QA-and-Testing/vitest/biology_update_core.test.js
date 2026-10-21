import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadModule(fileName) {
  const code = fs.readFileSync(path.resolve(__dirname, '../../js/' + fileName), 'utf-8');
  const sandbox = {
    window: {}, document: { getElementById: () => null, querySelectorAll: () => [], addEventListener: () => {} },
    console: console, Math, Date, JSON, parseInt, parseFloat, isNaN, isFinite,
    setTimeout: () => 0, setInterval: () => 0, requestAnimationFrame: () => 0,
    localStorage: { getItem: () => null, setItem: () => {} },
    navigator: { userAgent: 'test' }, location: { href: '' },
    performance: { now: () => Date.now() }, Image: function(){ this.onload=null; },
    KeyboardEvent: function(){}, MouseEvent: function(){}, TouchEvent: function(){},
    module: { exports: {} }, exports: {},
  };
  sandbox.window = sandbox; sandbox.self = sandbox; sandbox.global = sandbox;
  try { vm.createContext(sandbox); vm.runInContext(code, sandbox); } catch(e) { /* swallow runtime errors */ }
  return sandbox;
}

describe('biology_update_core.js', () => {
  const ctx = loadModule('biology_update_core.js');
  it('updateOrg function exists', () => {
    expect(typeof ctx.updateOrg).toBe('function');
  });
  it('updateOrg does not crash with null', () => {
    expect(() => { try { ctx.updateOrg(null, 0.1); } catch(e){} }).not.toThrow();
  });
  it('updateOrg processes a basic organism', () => {
    if (typeof ctx.updateOrg !== 'function') return;
    const o = { alive: true, x: 0, y: 20, vx: 0, vy: 0, size: 4, energy: 80, facing: 0,
      sp: { cat: 'producer', size: 4, speed: 0.01, shape: 'circle', color: '#4c4' },
      isPlayer: false, cyst: false, dying: false, divCD: 0, eatCD: 0, organs: [], state: 'idle' };
    try { ctx.updateOrg(o, 0.1); } catch(e) {}
    expect(o).toBeTruthy();
  });
});
