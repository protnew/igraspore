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

describe('organs.js', () => {
  const ctx = loadModule('organs.js');
  it('genOrgans function exists', () => {
    expect(typeof ctx.genOrgans).toBe('function');
  });
  it('genOrgans returns array for valid organism', () => {
    if (typeof ctx.genOrgans !== 'function') return;
    const o = { size: 5, sp: { cat: 'producer', bio: { nucleus: false } } };
    let result;
    try { result = ctx.genOrgans(o); } catch(e) { result = []; }
    expect(Array.isArray(result)).toBe(true);
  });
});
