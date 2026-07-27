import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '../../04-Src/js');
const configCode = fs.readFileSync(path.join(srcDir, 'config.js'), 'utf-8');
const uiCode = fs.readFileSync(path.join(srcDir, 'ui.js'), 'utf-8');
const uiMenusCode = fs.readFileSync(path.join(srcDir, 'ui_menus.js'), 'utf-8');

const script = `
  window.window = window;
  window.document = document;
  var navigator = window.navigator || {};
  
  document.body.innerHTML = "<div id='dnaModal' style='display: none;'></div><div id='dnaPts'></div><div id='setBody'></div><div id='deadStats'></div><div id='deadT'></div><div id='deadO' class=''></div><div id='langSelDrop'></div><div id='curLangTxt'></div><div id='diffWrap'></div><div id='catSel'></div><div id='spGrid'></div><canvas id='c'></canvas><canvas id='mm'></canvas><canvas id='pc'></canvas>";
  window.c = document.getElementById('c');
  window.mm = document.getElementById('mm');
  window.pc = document.getElementById('pc');
  window.c.getContext = () => ({ fill: () => {}, stroke: () => {}, beginPath: () => {}, arc: () => {} });
  window.mm.getContext = () => ({ fill: () => {} });
  window.pc.getContext = () => ({ fill: () => {} });
  
  ${configCode}
  ${uiCode}
  ${uiMenusCode}
  
  window.api = {
    openDNAEditor: () => window.openDNAEditor(),
    closeDNAEditor: () => window.closeDNAEditor(),
    toggleSet: (el) => toggleSet(el),
    showDeadScreen: () => showDeadScreen(),
    set state(v) { state = v; },
    set player(v) { player = v; },
    set gameStats(v) { gameStats = v; },
    set timeScale(v) { timeScale = v; },
    get timeScale() { return timeScale; },
    set orgs(v) { orgs = v; },
    set speciesPop(v) { speciesPop = v; },
    set stats(v) { stats = v; },
    get settings() { return settings; },
    set settings(v) { settings = v; },
    set curLang(v) { curLang = v; }
  };
`;

eval(script);

describe('ui and ui_menus logic', () => {
  beforeEach(() => {
    // Reset global state
    window.api.state = 'playing';
    window.api.player = { alive: true, sp: { name: 'Test', id: 0 }, offspring: 0, eaten: 0 };
    window.api.gameStats = { dna: 10, startTime: Date.now() };
    window.api.timeScale = 1;
    window.api.orgs = [];
    window.api.speciesPop = { 0: { alive: 1, born: 1 } };
    window.api.stats = { deathCauses: [0,0,0,0,0] };
    window.api.curLang = 'en';
    
    // Reset DOM
    document.getElementById('dnaModal').style.display = 'none';
    document.getElementById('deadO').className = '';
  });

  it('toggles DNA Editor visibility and pauses the game', () => {
    window.api.openDNAEditor();
    
    expect(document.getElementById('dnaModal').style.display).toBe('block');
    expect(window.api.timeScale).toBe(0);
    expect(String(document.getElementById('dnaPts').innerText)).toBe('10');
    
    window.api.closeDNAEditor();
    expect(document.getElementById('dnaModal').style.display).toBe('none');
    expect(window.api.timeScale).toBe(1);
  });

  it('shows Dead Screen with statistics and modifies UI state', () => {
    window.api.showDeadScreen();
    
    expect(document.getElementById('deadT').textContent).toBeDefined();
    expect(document.getElementById('deadO').className).toContain('show');
    expect(document.getElementById('deadStats').innerHTML).toContain('Test');
  });

  it('toggles settings configuration', () => {
    window.api.settings.particles = true;
    
    const toggleEl = document.createElement('div');
    toggleEl.setAttribute('data-s', 'particles');
    
    window.api.toggleSet(toggleEl);
    
    expect(window.api.settings.particles).toBe(false);
    expect(toggleEl.className).toBe('tg');
    
    window.api.toggleSet(toggleEl);
    
    expect(window.api.settings.particles).toBe(true);
    expect(toggleEl.className).toBe('tg on');
  });
});
