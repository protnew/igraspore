// UI-IMPROVE-2026-09-28 stage 1: liveness contracts for HUD widgets that
// previously passed the green gate while being dead (#hDivReady, #scaleW).
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '../../js');
const read = (f) => fs.readFileSync(path.join(srcDir, f), 'utf-8');
const configCode = read('config.js');
const uiCode = read('ui.js');
const uiMenusCode = read('ui_menus.js');
const uiFoodChainCode = read('ui_food_chain.js');
const uiScreensCode = read('ui_screens.js');

const script = `
  window.window = window;
  document.body.innerHTML = "<div id='menuO' class='ov show'><button id='startBtn'>go</button></div><select id='starSelectGame'></select><a id='apkBtn'>apk</a><div id='hDivReady'></div><div id='scaleW'></div><div id='hud'></div><div id='topR'></div><div id='weatherP'></div><div id='ecoP'></div><div id='legP'><button id='legToggle'></button><div id='legBody'></div></div><div id='dnaModal'></div><div id='dnaPts'></div><div id='setBody'></div><div id='deadStats'></div><div id='deadT'></div><div id='deadO'></div><div id='langSelDrop'></div><div id='curLangTxt'></div><div id='diffWrap'></div><div id='catSel'></div><div id='spGrid'></div><canvas id='c'></canvas><canvas id='mm'></canvas><canvas id='pc'></canvas>";
  var _ctx = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : (k === 'measureText' ? () => ({ width: 10 }) : (k.startsWith && k.startsWith('create') ? () => ({ addColorStop(){} }) : () => {}))), set: (t, k, v) => { t[k] = v; return true; } });
  ['c','mm','pc'].forEach(function(id){ document.getElementById(id).getContext = _ctx; });
  ${configCode}
  ${uiCode}
  ${uiMenusCode}
  ${uiFoodChainCode}
  ${uiScreensCode}
  window.wapi = {
    set state(v) { state = v; },
    set player(v) { player = v; },
    set zoom(v) { zoom = v; },
    updateDivReady: () => updateDivReady(),
    updateScaleBar: () => updateScaleBar(),
  };
`;
try { eval(script); } catch (e) { console.error('EVAL ERROR:', e.message); throw e; }

const mkPlayer = (over = {}) => ({
  alive: true, energy: 42, massFood: 1.3, sizeMult: 1,
  sp: { name: 'Test', id: 0, size: 4, cat: 'producer', repEnergy: 80 }, ...over,
});

describe('UI-IMPROVE F1: #hDivReady is live during play', () => {
  beforeEach(() => { window.wapi.state = 'playing'; window.demoPossessed = null; });

  it('after 60 frames with a live player the indicator shows energy and mass', () => {
    window.wapi.player = mkPlayer();
    for (let i = 0; i < 60; i++) window.wapi.updateDivReady();
    const txt = document.getElementById('hDivReady').textContent;
    expect(txt.length).toBeGreaterThan(0);
    expect(txt).toContain('Эн 42/80');
    expect(txt).toMatch(/Масса|ГОТОВО/);
  });

  it('shows ГОТОВО (Q) when canDivide is true and updates live values', () => {
    window.wapi.player = mkPlayer();
    window.canDivide = () => true;
    window.wapi.updateDivReady();
    expect(document.getElementById('hDivReady').textContent).toContain('ГОТОВО (Q)');
    window.canDivide = () => false;
    window.wapi.player = mkPlayer({ energy: 7 });
    window.wapi.updateDivReady();
    const txt = document.getElementById('hDivReady').textContent;
    expect(txt).toContain('Эн 7/80');
    expect(txt).not.toContain('ГОТОВО');
    delete window.canDivide;
  });

  it('follows the possessed organism in demo (no player)', () => {
    window.wapi.player = null;
    window.demoPossessed = mkPlayer({ energy: 55 });
    window.wapi.updateDivReady();
    expect(document.getElementById('hDivReady').textContent).toContain('Эн 55/80');
  });

  it('is empty outside play or without a live organism', () => {
    window.wapi.player = mkPlayer();
    window.wapi.state = 'menu';
    window.wapi.updateDivReady();
    expect(document.getElementById('hDivReady').textContent).toBe('');
    window.wapi.state = 'playing';
    window.wapi.player = null;
    window.wapi.updateDivReady();
    expect(document.getElementById('hDivReady').textContent).toBe('');
  });
});

describe('UI-IMPROVE F2: #scaleW shows a real µm scale in play', () => {
  it('in playing: non-empty µm label and a line with width > 0 tied to zoom', () => {
    window.wapi.state = 'playing';
    window.wapi.zoom = 1.4;
    window.wapi.updateScaleBar();
    const sw = document.getElementById('scaleW');
    expect(sw.style.display).toBe('block');
    expect(sw.textContent).toContain('µm');
    const sl = document.getElementById('scaleL');
    expect(sl).not.toBeNull();
    expect(sw.contains(sl)).toBe(true);
    expect(parseInt(sl.style.width, 10)).toBe(140);
    window.wapi.zoom = 2.25;
    window.wapi.updateScaleBar();
    expect(parseInt(document.getElementById('scaleL').style.width, 10)).toBe(225);
    expect(sw.querySelectorAll('#scaleL').length).toBe(1);
  });

  it('outside play the scale is hidden', () => {
    window.wapi.state = 'menu';
    window.wapi.updateScaleBar();
    expect(document.getElementById('scaleW').style.display).toBe('none');
  });
});
describe('UI-IMPROVE F4/F5: clean start menu, focus on НАЧАТЬ, stale overlays closed', () => {
  it('menu shown: body.in-menu and focus lands on #startBtn; menu hidden: class removed', () => {
    const mo = document.getElementById('menuO');
    mo.className = 'ov'; window.syncMenuChrome();
    expect(document.body.classList.contains('in-menu')).toBe(false);
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    mo.className = 'ov show'; window.syncMenuChrome();
    expect(document.body.classList.contains('in-menu')).toBe(true);
    expect(document.activeElement && document.activeElement.id).toBe('startBtn');
  });

  it('style.css hides star picker and APK over the menu', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../../style.css'), 'utf-8');
    expect(css).toMatch(/body\.in-menu #starSelectGame,\s*body\.in-menu #apkBtn\{display:none!important\}/);
  });

  it('startGame closes wiki/help/settings/pause/leaderboard overlays', () => {
    const main = read('main.js');
    const start = main.indexOf('function startGame(');
    const body = main.slice(start, start + 8000);
    expect(body).toMatch(/\['wikiO','helpO','setO','pauseO','leaderboardO'\]\.forEach/);
  });
});
describe('UI-IMPROVE F6: mobile compact bottom bar', () => {
  const css = () => fs.readFileSync(path.resolve(__dirname, '../../../style.css'), 'utf-8');
  it('hides text on non-key buttons, shows icon, keeps 44x44 hit area', () => {
    const c = css();
    expect(c).toMatch(/\.ab:not\(\.ab-keep\) \.abt \{ display: none !important; \}/);
    expect(c).toMatch(/\.ab\[data-ico\]:not\(\.ab-keep\)::before \{ content: attr\(data-ico\)/);
    expect(c).toMatch(/min-width: 44px !important; min-height: 44px !important/);
    expect(read('mobile.js')).toMatch(/\.is-mobile \.ab\{min-width:44px!important;min-height:44px!important/);
  });
  it('text stays only on ЕСТЬ / ДЕЛИТЬ / АВТО', () => {
    const m = read('main.js');
    // Reason: P0.3 hotkey label is E, not "авто"; P1 spore label is СПОРА and stays visible (ab-keep).
    expect(m).toMatch(/labelBtn\('bEat','ЕСТЬ','E','[^']+',true\)/);
    expect(m).toMatch(/labelBtn\('bDiv','ДЕЛИТЬ','Q','[^']+',true\)/);
    expect(m).toMatch(/labelBtn\('bAuto','АВТО','Tab','[^']+',true\)/);
    expect(m).toMatch(/labelBtn\('bCyst','СПОРА','R','[^']+',true\)/);
    expect(m).toMatch(/labelBtn\('bFree','ПОЛЁТ','F','[^']+'\)/);
    expect(m).toMatch(/labelBtn\('bFol','СЛЕДИТЬ','V','[^']+'\)/);
  });
});

describe('UI-IMPROVE F7: P2 polish', () => {
  it('toast z-index is 35 (under modal overlays)', () => {
    expect(read('main_events.js')).toMatch(/translateX\(-50%\);z-index:35;padding:12px 24px/);
  });
  it('no dead apple-touch-icon link in index.html', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../../index.html'), 'utf-8');
    expect(html).not.toMatch(/apple-touch-icon/);
  });
  it('first-run pulse of «Клавиши» chip runs once (LS igraspore.firstTip)', () => {
    localStorage.removeItem('igraspore.firstTip');
    const b = document.createElement('button'); b.id = 'khToggle'; document.body.appendChild(b);
    expect(window.maybeFirstRunPulse()).toBe(true);
    expect(b.classList.contains('kh-pulse')).toBe(true);
    expect(localStorage.getItem('igraspore.firstTip')).toBe('1');
    expect(window.maybeFirstRunPulse()).toBe(false);
    b.remove();
  });
});