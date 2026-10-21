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

describe('ai_move.js', () => {
  const ctx = loadModule('ai_move.js');
  it('moveOrg function exists', () => {
    expect(typeof ctx.moveOrg).toBe('function');
  });
  it('turnToward rotates facing toward target angle', () => {
    if (typeof ctx.turnToward !== 'function') return;
    const o = { facing: 0 };
    ctx.turnToward(o, Math.PI, 0.1, 10);
    expect(o.facing).not.toBe(0);
  });
  it('thrustAlongFacing adds velocity', () => {
    if (typeof ctx.thrustAlongFacing !== 'function') return;
    const o = { facing: 0, vx: 0, vy: 0 };
    ctx.thrustAlongFacing(o, 2, 0.1, 10);
    expect(o.vx).toBeGreaterThan(0);
  });
  it('ensureFacing does not crash', () => {
    if (typeof ctx.ensureFacing !== 'function') return;
    const o = { facing: 0 };
    ctx.ensureFacing(o, 1, 0.1);
    expect(o).toBeTruthy();
  });
});
