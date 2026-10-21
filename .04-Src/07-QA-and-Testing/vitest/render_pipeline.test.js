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

describe('render_helpers.js', () => {
  const ctx = loadModule('render_helpers.js');
  it('renderOrganisms exists', () => {
    expect(typeof ctx.renderOrganisms).toBe('function');
  });
  it('renderHealthBars exists', () => {
    expect(typeof ctx.renderHealthBars).toBe('function');
  });
  it('renderMinimap exists', () => {
    expect(typeof ctx.renderMinimap).toBe('function');
  });
  it('renderShore exists', () => {
    expect(typeof ctx.renderShore).toBe('function');
  });
  it('renderParticles exists', () => {
    expect(typeof ctx.renderParticles).toBe('function');
  });
  it('initShoreCache exists', () => {
    expect(typeof ctx.initShoreCache).toBe('function');
  });
});

describe('render_entities.js', () => {
  const ctx = loadModule('render_entities.js');
  it('renderOrg exists', () => {
    expect(typeof ctx.renderOrg).toBe('function');
  });
  it('drawBody exists', () => {
    expect(typeof ctx.drawBody).toBe('function');
  });
});

describe('render_organs.js', () => {
  const ctx = loadModule('render_organs.js');
  it('drawOrgans exists', () => {
    expect(typeof ctx.drawOrgans).toBe('function');
  });
  it('drawAppendages exists', () => {
    expect(typeof ctx.drawAppendages).toBe('function');
  });
  it('renderViruses exists', () => {
    expect(typeof ctx.renderViruses).toBe('function');
  });
});

describe('render_fx.js', () => {
  const ctx = loadModule('render_fx.js');
  it('renderSunOverlay exists', () => {
    expect(typeof ctx.renderSunOverlay).toBe('function');
  });
  it('renderBubbles exists', () => {
    expect(typeof ctx.renderBubbles).toBe('function');
  });
  it('renderNutrients exists', () => {
    expect(typeof ctx.renderNutrients).toBe('function');
  });
  it('renderRain exists', () => {
    expect(typeof ctx.renderRain).toBe('function');
  });
  it('renderShadows exists', () => {
    expect(typeof ctx.renderShadows).toBe('function');
  });
});

describe('render_effects.js', () => {
  const ctx = loadModule('render_effects.js');
  it('renderWater exists', () => {
    expect(typeof ctx.renderWater).toBe('function');
  });
  it('renderSky exists', () => {
    expect(typeof ctx.renderSky).toBe('function');
  });
});
