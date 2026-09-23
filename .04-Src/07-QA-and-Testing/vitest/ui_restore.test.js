// UI-RESTORE-2026-09-22 — 3 mandatory unit checks (TZ §9.1):
//   1) keyHint LS roundtrip + default collapsed
//   2) energy display policy (A): display-only clamp, HUD never shows >100/100
//   3) after updateEcoPanel()+updateLegend() the legend stays under collapse-API control
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '../../js');
const read = (f) => fs.readFileSync(path.join(srcDir, f), 'utf-8');

function fixture(){
  document.body.innerHTML =
    "<div id='keyHint' class='p' style='display:none'></div>" +
    "<div id='hud' class='p'></div>" +
    "<div id='legP' class='p' style='display:none'>" +
      "<button type='button' id='legToggle' aria-expanded='false' aria-controls='legBody'>Легенда ▾</button>" +
      "<div id='legBody' hidden></div>" +
    "</div>" +
    "<div id='ecoP' class='p'></div>" +
    "<div id='hDivReady'></div>" +
    "<canvas id='c'></canvas><canvas id='mm'></canvas><canvas id='pc'></canvas>";
  window.c = document.getElementById('c');
  window.mm = document.getElementById('mm');
  window.pc = document.getElementById('pc');
}

const ctx = {};
// minimal prologue for globals that normally come from config.js
const PROLOGUE = `
  var curLang = 'ru';
  var clamp = function(v, a, b){ return v < a ? a : (v > b ? b : v); };
  var tt = function(k){ return k; };
  var catName = function(c){ return c; };
  var foodScentStrength = function(){ return 0; };
  var SEASONS = [{temp:20},{temp:20},{temp:20},{temp:20}];
  var season = 0, dayLight = 1, totalDays = 0, fps = 60, orgs = [];
`;
const makeCtx = () => eval(`(function(){ ${PROLOGUE}\n${read('ui.js')}\n${read('ui_menus.js')}\n; return {
  updateHUD, updateEcoPanel, updateLegend,
  api: window
}; })()`);

beforeEach(() => {
  localStorage.clear();
  fixture();
});

describe('UI-RESTORE §5.1 — keyHint collapse (LS roundtrip, default collapsed)', () => {
  it('defaults to collapsed when LS is empty', () => {
    const c = makeCtx();
    expect(c.api._keyHintCollapsed).toBe(true);
    c.api.buildKeyHint();
    const kh = document.getElementById('keyHint');
    expect(kh.classList.contains('collapsed')).toBe(true);
    const btn = document.getElementById('khToggle');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toBe('Клавиши');
    expect(document.getElementById('khKeys').hasAttribute('hidden')).toBe(true);
  });

  it('invalid LS value falls back to collapsed default', () => {
    localStorage.setItem('igraspore.keyHintCollapsed', 'garbage');
    const c = makeCtx();
    expect(c.api._keyHintCollapsed).toBe(true);
  });

  it('manual toggle persists "0"/"1" and survives a reload (roundtrip)', () => {
    const c1 = makeCtx();
    c1.api.setKeyHintCollapsed(false, { persist: true });
    expect(localStorage.getItem('igraspore.keyHintCollapsed')).toBe('0');
    expect(document.getElementById('khToggle').getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('khKeys').hasAttribute('hidden')).toBe(false);

    // "reload": fresh script read must honour LS
    const c2 = makeCtx();
    expect(c2.api._keyHintCollapsed).toBe(false);

    c2.api.setKeyHintCollapsed(true, { persist: true });
    expect(localStorage.getItem('igraspore.keyHintCollapsed')).toBe('1');
    const c3 = makeCtx();
    expect(c3.api._keyHintCollapsed).toBe(true);
  });

  it('auto-collapse ticks only after 60s from last expand and persists once', () => {
    const c = makeCtx();
    c.api.startKeyHintSession();           // collapsed (default)
    c.api.setKeyHintCollapsed(false, { persist: true, manual: true });
    // simulate 30s — no collapse
    c.api._keyHintLastExpand = Date.now() - 30 * 1000;
    c.api.tickKeyHint();
    expect(c.api._keyHintCollapsed).toBe(false);
    // simulate 61s — collapses and writes LS
    c.api._keyHintLastExpand = Date.now() - 61 * 1000;
    c.api.tickKeyHint();
    expect(c.api._keyHintCollapsed).toBe(true);
    expect(localStorage.getItem('igraspore.keyHintCollapsed')).toBe('1');
    // already collapsed → timer must not touch LS again
    localStorage.setItem('igraspore.keyHintCollapsed', 'X-sentinel');
    c.api.tickKeyHint();
    expect(localStorage.getItem('igraspore.keyHintCollapsed')).toBe('X-sentinel');
  });
});

describe('UI-RESTORE §3.7/§5.5 — energy display policy (A)', () => {
  function hudWith(energy){
    const c = makeCtx();
    window.player = {
      alive: true, energy, generation: 1, offspring: 0, age: 10, size: 5.5,
      cyst: false, infected: false, _lilyCover: 0,
      sp: { name: 'Testium', cat: 'consumer1', repEnergy: 80 }
    };
    try { c.updateHUD(); } finally { /* keep player for assertions */ }
    return document.getElementById('hud').innerHTML;
  }

  it('energy > 100 renders clamped text 100/100 and bar <= 100%', () => {
    const html = hudWith(109);
    expect(html).toContain('100/100');
    expect(html).not.toContain('109/100');
    const bar = /width:(\d+(?:\.\d+)?)%/.exec(html);
    expect(bar).not.toBeNull();
    expect(parseFloat(bar[1])).toBeLessThanOrEqual(100);
  });

  it('negative energy renders 0/100', () => {
    const html = hudWith(-7);
    expect(html).toContain('0/100');
  });

  it('raw energy stays untouched (display-only clamp)', () => {
    const c = makeCtx();
    window.player = { alive: true, energy: 150, generation: 1, offspring: 0, age: 1, size: 5,
      cyst: false, infected: false, sp: { name: 'T', cat: 'producer', repEnergy: 80 } };
    c.updateHUD();
    expect(window.player.energy).toBe(150); // logic NOT capped
  });
});

describe('UI-RESTORE §5.3 — legend collapse contract (eco never stomps legend)', () => {
  it('updateEcoPanel does not touch #legP at all', () => {
    const c = makeCtx();
    const leg = document.getElementById('legP');
    const before = leg.getAttribute('style');
    const clsBefore = leg.className;
    c.updateEcoPanel();
    expect(leg.getAttribute('style')).toBe(before);
    expect(leg.className).toBe(clsBefore);
  });

  it('after eco+legend cycle, collapsed legend stays collapsed (API-owned)', () => {
    const c = makeCtx();
    window.state = 'playing';
    c.updateEcoPanel();
    c.updateLegend();
    const leg = document.getElementById('legP');
    expect(leg.classList.contains('collapsed')).toBe(true);          // default collapsed
    expect(document.getElementById('legBody').hasAttribute('hidden')).toBe(true);
    expect(leg.style.display).toBe('block');                        // panel visible, body hidden

    // expand via API → still intact after another eco+legend cycle
    c.api.setLegendCollapsed(false, { persist: true });
    c.updateEcoPanel();
    c.updateLegend();
    expect(leg.classList.contains('collapsed')).toBe(false);
    expect(document.getElementById('legBody').hasAttribute('hidden')).toBe(false);
    expect(localStorage.getItem('igraspore.legendCollapsed')).toBe('0');
    expect(document.getElementById('legBody').textContent).toContain('Водоросли');
  });

  it('legend collapse persists across reload (LS roundtrip)', () => {
    const c1 = makeCtx();
    c1.api.setLegendCollapsed(false, { persist: true });
    const c2 = makeCtx();
    expect(c2.api._legendCollapsed).toBe(false);
    c2.api.setLegendCollapsed(true, { persist: true });
    const c3 = makeCtx();
    expect(c3.api._legendCollapsed).toBe(true);
  });
});
