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

describe('render_swiss.js', () => {
  const ctx = loadModule('render_swiss.js');
  it('drawSwissCell exists', () => { expect(typeof ctx.drawSwissCell === 'function' || hasFunction('render_swiss.js', 'drawSwissCell')).toBe(true); });
  it('drawSwissVirus exists', () => { expect(typeof ctx.drawSwissVirus === 'function' || hasFunction('render_swiss.js', 'drawSwissVirus')).toBe(true); });
  it('loadSwissSprites exists', () => { expect(typeof ctx.loadSwissSprites === 'function' || hasFunction('render_swiss.js', 'loadSwissSprites')).toBe(true); });
  it('swissReady exists', () => { expect(typeof ctx.swissReady === 'function' || hasFunction('render_swiss.js', 'swissReady')).toBe(true); });
  it('pickShape exists', () => { expect(hasFunction('render_swiss.js', 'pickShape')).toBe(true); });
  it('drawSprite exists', () => { expect(hasFunction('render_swiss.js', 'drawSprite')).toBe(true); });
  it('fbCoccus exists', () => { expect(hasFunction('render_swiss.js', 'fbCoccus')).toBe(true); });
});
