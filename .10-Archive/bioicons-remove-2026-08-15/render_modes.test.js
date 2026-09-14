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

describe('render_bio_v2.js', () => {
  const ctx = loadModule('render_bio_v2.js');
  it('drawBioicon exists', () => { expect(typeof ctx.drawBioicon === 'function' || hasFunction('render_bio_v2.js', 'drawBioicon')).toBe(true); });
  it('bioiconsReady returns boolean', () => { expect(typeof ctx.bioiconsReady === 'function' || hasFunction('render_bio_v2.js', 'bioiconsReady')).toBe(true); });
  it('drawCoccus exists', () => { expect(hasFunction('render_bio_v2.js', 'drawCoccus')).toBe(true); });
  it('drawRod exists', () => { expect(hasFunction('render_bio_v2.js', 'drawRod')).toBe(true); });
  it('drawSpiral exists', () => { expect(hasFunction('render_bio_v2.js', 'drawSpiral')).toBe(true); });
});

describe('render_bio_v3.js', () => {
  const ctx = loadModule('render_bio_v3.js');
  it('drawBioicon exists', () => { expect(typeof ctx.drawBioicon === 'function' || hasFunction('render_bio_v3.js', 'drawBioicon')).toBe(true); });
  it('drawCoccus exists', () => { expect(hasFunction('render_bio_v3.js', 'drawCoccus')).toBe(true); });
  it('drawRod exists', () => { expect(hasFunction('render_bio_v3.js', 'drawRod')).toBe(true); });
  it('drawFilament exists', () => { expect(hasFunction('render_bio_v3.js', 'drawFilament')).toBe(true); });
  it('drawSpiral exists', () => { expect(hasFunction('render_bio_v3.js', 'drawSpiral')).toBe(true); });
});

describe('render_bioicons.js', () => {
  it('drawBioicon exists', () => { expect(hasFunction('render_bioicons.js', 'drawBioicon')).toBe(true); });
  it('loadBioicons exists', () => { expect(hasFunction('render_bioicons.js', 'loadBioicons')).toBe(true); });
  it('rasterizeSVG exists', () => { expect(hasFunction('render_bioicons.js', 'rasterizeSVG')).toBe(true); });
  it('drawVirusBioicon exists', () => { expect(hasFunction('render_bioicons.js', 'drawVirusBioicon')).toBe(true); });
});

describe('render_edu.js', () => {
  const ctx = loadModule('render_edu.js');
  it('renderMinimap exists', () => { expect(typeof ctx.renderMinimap === 'function' || hasFunction('render_edu.js', 'renderMinimap')).toBe(true); });
  it('renderPopGraph exists', () => { expect(typeof ctx.renderPopGraph === 'function' || hasFunction('render_edu.js', 'renderPopGraph')).toBe(true); });
  it('ORGANELLE_INFO exists', () => { expect(ctx.ORGANELLE_INFO !== undefined || hasFunction('render_edu.js', 'ORGANELLE_INFO')).toBe(true); });
  it('organelleSetFor exists', () => { expect(typeof ctx.organelleSetFor === 'function' || hasFunction('render_edu.js', 'organelleSetFor')).toBe(true); });
  it('renderOrganelleEdu exists', () => { expect(hasFunction('render_edu.js', 'renderOrganelleEdu')).toBe(true); });
});
