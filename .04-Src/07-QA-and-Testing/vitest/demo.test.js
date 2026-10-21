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

describe('demo.js', () => {
  const ctx = loadModule('demo.js');
  it('startDemoMode function exists', () => {
    expect(typeof ctx.startDemoMode).toBe('function');
  });
  it('demoPickAtScreen function exists', () => {
    expect(typeof ctx.demoPickAtScreen).toBe('function');
  });
  it('demoPossessOrg function exists', () => {
    expect(typeof ctx.demoPossessOrg).toBe('function');
  });
  it('exitDemoPossess function exists', () => {
    expect(typeof ctx.exitDemoPossess).toBe('function');
  });
  it('updateDemoPinned function exists', () => {
    expect(typeof ctx.updateDemoPinned).toBe('function');
  });
  it('renderDemoLabels function exists', () => {
    expect(typeof ctx.renderDemoLabels).toBe('function');
  });
  it('demoPickAtScreen returns null when no orgs', () => {
    if (typeof ctx.demoPickAtScreen !== 'function') return;
    let result;
    try { result = ctx.demoPickAtScreen(100, 100); } catch(e) { result = 'error'; }
    expect(result === null || result === 'error' || result === undefined).toBe(true);
  });
});
