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
  try { vm.createContext(sandbox); vm.runInContext(code, sandbox); } catch(e) {}
  return sandbox;
}

function hasFunction(fileName, funcName) {
  const code = fs.readFileSync(path.resolve(__dirname, '../../js/' + fileName), 'utf-8');
  return new RegExp('(function\\s+' + funcName + '\\b|window\\.' + funcName + '\\s*=)').test(code);
}

describe('world_update.js', () => {
  const ctx = loadModule('world_update.js');
  it('updateWorld function exists', () => {
    expect(hasFunction('world_update.js', 'updateWorld')).toBe(true);
  });
  it('generateTempGrid function exists', () => {
    expect(hasFunction('world_update.js', 'generateTempGrid')).toBe(true);
  });
  it('spatialGrid referenced in code', () => {
    expect(hasFunction('world_update.js', 'spatialGrid')).toBe(true);
  });
  it('updateWorld does not crash with null', () => {
    expect(() => { try { ctx.updateWorld(null); } catch(e){} }).not.toThrow();
  });
});
