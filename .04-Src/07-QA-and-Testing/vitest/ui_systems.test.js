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

describe('ui_screens.js', () => {
  it('buildDiff exists', () => { expect(hasFunction('ui_screens.js', 'buildDiff')).toBe(true); });
  it('showDeadScreen exists', () => { expect(hasFunction('ui_screens.js', 'showDeadScreen')).toBe(true); });
  it('toggleRenderMode exists', () => { expect(hasFunction('ui_screens.js', 'toggleRenderMode')).toBe(true); });
});

describe('ui_food_chain.js', () => {
  it('applyRenderMode exists', () => { expect(hasFunction('ui_screens.js', 'applyRenderMode')).toBe(true); });
  it('buildWiki exists', () => { expect(hasFunction('ui_screens.js', 'buildWiki')).toBe(true); });
  it('buildSettings exists', () => { expect(hasFunction('ui_screens.js', 'buildSettings')).toBe(true); });
  it('getPoolCount exists', () => { expect(hasFunction('ui_food_chain.js', 'getPoolCount')).toBe(true); });
  it('buildDiff exists', () => { expect(hasFunction('ui_screens.js', 'buildDiff')).toBe(true); });
});

describe('ui_menus.js', () => {
  it('buildSpeciesGrid exists', () => { expect(hasFunction('ui_menus.js', 'buildSpeciesGrid')).toBe(true); });
  it('buildCatSel exists', () => { expect(hasFunction('ui_menus.js', 'buildCatSel')).toBe(true); });
  it('updateMenuTexts exists', () => { expect(hasFunction('ui_menus.js', 'updateMenuTexts')).toBe(true); });
});

describe('main.js', () => {
  const ctx = loadModule('main.js');
  it('startGame exists', () => { expect(typeof ctx.startGame === 'function' || hasFunction('main.js', 'startGame')).toBe(true); });
  it('gameLoop exists', () => { expect(typeof ctx.gameLoop === 'function' || hasFunction('main.js', 'gameLoop')).toBe(true); });
  it('TUTORIAL_STEPS is array', () => { expect(Array.isArray(ctx.TUTORIAL_STEPS) || hasFunction('main.js', 'TUTORIAL_STEPS')).toBe(true); });
  it('advanceTutorial exists', () => { expect(typeof ctx.advanceTutorial === 'function' || hasFunction('main.js', 'advanceTutorial')).toBe(true); });
});

describe('main_events.js', () => {
  it('toggleRenderModeLarge exists', () => { expect(hasFunction('main_events.js', 'toggleRenderModeLarge')).toBe(true); });
  it('manualFeed exists', () => { expect(hasFunction('main_events.js', 'manualFeed') || hasFunction('main_feed.js', 'manualFeed')).toBe(true); });
});

describe('mobile.js', () => {
  const ctx = loadModule('mobile.js');
  it('MAX_PARTICLES defined on window', () => { expect(ctx.MAX_PARTICLES !== undefined || hasFunction('mobile.js', 'MAX_PARTICLES')).toBe(true); });
  it('closeGameMenu exists', () => { expect(typeof ctx.closeGameMenu === 'function' || hasFunction('mobile.js', 'closeGameMenu')).toBe(true); });
  it('openGameMenu exists', () => { expect(typeof ctx.openGameMenu === 'function' || hasFunction('mobile.js', 'openGameMenu')).toBe(true); });
  it('toggleGameMenu exists', () => { expect(typeof ctx.toggleGameMenu === 'function' || hasFunction('mobile.js', 'toggleGameMenu')).toBe(true); });
  it('bindCanvasTaps exists', () => { expect(hasFunction('mobile.js', 'bindCanvasTaps')).toBe(true); });
});
