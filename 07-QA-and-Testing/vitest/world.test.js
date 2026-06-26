import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '../../04-Src/js');
const configCode = fs.readFileSync(path.join(srcDir, 'config.js'), 'utf-8');
const worldCode = fs.readFileSync(path.join(srcDir, 'world.js'), 'utf-8');

// Combine and evaluate into global scope
const script = `
  window.window = window;
  window.document = document;
  var navigator = window.navigator || {};
  
  document.body.innerHTML = "<div id='todR'></div><div id='todL'></div><div id='seasL'></div><canvas id='c'></canvas><canvas id='mm'></canvas><canvas id='pc'></canvas>";
  window.c = document.getElementById('c');
  window.mm = document.getElementById('mm');
  window.pc = document.getElementById('pc');
  window.c.getContext = () => ({ fill: () => {}, stroke: () => {}, beginPath: () => {}, arc: () => {} });
  window.mm.getContext = () => ({ fill: () => {} });
  window.pc.getContext = () => ({ fill: () => {} });

  window.updateOrg = () => {};
  window.updateInfections = () => {};
  window.updateViruses = () => {};
  window.updateCamera = () => {};
  window.updateTodUI = () => {};
  window.spawnOrg = () => {};
  window.getNearby = () => [];
  
  ${configCode}
  ${worldCode}
  
  window.api = {
    initWorld: () => initWorld(),
    updateWorld: (dt) => updateWorld(dt),
    clampToPuddle: (o) => clampToPuddle(o),
    generateTempGrid: () => generateTempGrid(),
    set fc(v) { fc = v; },
    set totalDays(v) { totalDays = v; },
    set tod(v) { tod = v; },
    get tod() { return tod; },
    set season(v) { season = v; },
    set timeScale(v) { timeScale = v; },
    set orgs(v) { orgs = v; },
    set parts(v) { parts = v; },
    set viruses(v) { viruses = v; },
    set player(v) { player = v; },
    set state(v) { state = v; },
    get dayLight() { return dayLight; },
    get PD() { return PD; },
    set eclipseMod(v) { window.eclipseMod = v; }
  };
`;

eval(script);

describe('world.js logic', () => {
  beforeEach(() => {
    // Reset state via API
    window.api.fc = 0;
    window.api.totalDays = 0;
    window.api.tod = 0;
    window.api.season = 1;
    window.api.timeScale = 1;
    window.api.orgs = [];
    window.api.parts = [];
    window.api.viruses = [];
    window.api.player = null;
    window.api.state = 'playing';
    window.spatialGrid = {};
    window.globalCatastrophe = {active: false, type: "", timer: 0};
  });

  it('generates spatial chunks correctly based on coordinates', () => {
    window.api.orgs = [
      { id: 1, x: 100, y: 150, alive: true, sp: { cat: 'producer' } },
      { id: 2, x: 450, y: 150, alive: true, sp: { cat: 'producer' } },
      { id: 3, x: 150, y: 450, alive: true, sp: { cat: 'producer' } },
      { id: 4, x: -100, y: 50, alive: true, sp: { cat: 'producer' } }
    ];

    window.api.updateWorld(1);
    
    expect(window.spatialGrid['0,0']).toBeDefined();
    expect(window.spatialGrid['0,0'].length).toBe(1);
    expect(window.spatialGrid['0,0'][0].id).toBe(1);

    expect(window.spatialGrid['1,0']).toBeDefined();
    expect(window.spatialGrid['1,0'][0].id).toBe(2);

    expect(window.spatialGrid['0,1']).toBeDefined();
    expect(window.spatialGrid['0,1'][0].id).toBe(3);

    expect(window.spatialGrid['-1,0']).toBeDefined();
    expect(window.spatialGrid['-1,0'][0].id).toBe(4);
  });

  it('calculates sun trajectory correctly based on time of day and season', () => {
    window.api.season = 1;
    window.api.eclipseMod = 1.0;
    window.api.tod = 12;

    window.api.updateWorld(0);
    expect(window.api.dayLight).toBeCloseTo(1);

    window.api.tod = 6;
    window.api.updateWorld(0);
    expect(window.api.dayLight).toBeCloseTo(0.02);

    window.api.tod = 18;
    window.api.updateWorld(0);
    expect(window.api.dayLight).toBeCloseTo(0.02);
  });

  it('applies time scaling accurately to tod and dt', () => {
    window.api.tod = 10;
    window.api.timeScale = 2;
    
    window.api.updateWorld(1);
    
    expect(window.api.tod).toBeCloseTo(10.4);
  });

  it('clamps organism to puddle bounds (environmental limits)', () => {
    let orgTop = { x: 0, y: -10, vx: 0, vy: -5 };
    window.api.clampToPuddle(orgTop);
    expect(orgTop.y).toBe(3);
    expect(orgTop.vy).toBe(2);

    let orgBottom = { x: 0, y: 17000, vx: 0, vy: 10 };
    window.api.clampToPuddle(orgBottom);
    expect(orgBottom.y).toBe(window.api.PD - 8);
    expect(orgBottom.vy).toBe(-3);

    let orgRight = { x: 30000, y: 0, vx: 10, vy: 0 };
    window.api.clampToPuddle(orgRight);
    expect(orgRight.x).toBe(25000);
  });
});
