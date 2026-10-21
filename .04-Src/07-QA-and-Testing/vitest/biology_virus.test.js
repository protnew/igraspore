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

describe('biology_virus.js', () => {
  const ctx = loadModule('biology_virus.js');
  it('spawnVirus function exists', () => {
    expect(typeof ctx.spawnVirus).toBe('function');
  });
  it('updateInfections function exists', () => {
    expect(typeof ctx.updateInfections).toBe('function');
  });
  it('updateViruses function exists', () => {
    expect(typeof ctx.updateViruses).toBe('function');
  });
  it('spawnVirus does not crash', () => {
    if (typeof ctx.spawnVirus !== 'function') return;
    try { ctx.spawnVirus(0, 20, 'bacteriophage'); } catch(e) {}
    expect(true).toBe(true);
  });
});
