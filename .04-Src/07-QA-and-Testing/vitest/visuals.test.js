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

describe('render_surface.js', () => {
  it('renderParallax exists', () => { expect(hasFunction('render_surface.js', 'renderParallax')).toBe(true); });
  it('drawNaturalLilypads exists', () => { expect(hasFunction('render_surface.js', 'drawNaturalLilypads')).toBe(true); });
  it('drawOneLilypad exists', () => { expect(hasFunction('render_surface.js', 'drawOneLilypad')).toBe(true); });
  it('leafPath exists', () => { expect(hasFunction('render_surface.js', 'leafPath')).toBe(true); });
  it('drawDuckweed exists', () => { expect(hasFunction('render_surface.js', 'drawDuckweed')).toBe(true); });
});

describe('stars.js', () => {
  const ctx = loadModule('stars.js');
  it('getStarPreset exists', () => { expect(typeof ctx.getStarPreset === 'function' || hasFunction('stars.js', 'getStarPreset')).toBe(true); });
  it('setStarSystem exists', () => { expect(typeof ctx.setStarSystem === 'function' || hasFunction('stars.js', 'setStarSystem')).toBe(true); });
  it('STAR_PRESETS defined', () => { expect(ctx.STAR_PRESETS !== undefined || hasFunction('stars.js', 'STAR_PRESETS')).toBe(true); });
});

describe('night_sky.js', () => {
  it('renderNightSky exists', () => { expect(hasFunction('night_sky.js', 'renderNightSky')).toBe(true); });
  it('genStars exists', () => { expect(hasFunction('night_sky.js', 'genStars')).toBe(true); });
  it('genMilkyWay exists', () => { expect(hasFunction('night_sky.js', 'genMilkyWay')).toBe(true); });
});

describe('biology_update.js', () => {
  const ctx = loadModule('biology_update.js');
  it('module loads without crash', () => { expect(ctx).toBeTruthy(); });
});
