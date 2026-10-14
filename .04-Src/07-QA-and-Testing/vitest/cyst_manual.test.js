import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function load() {
  const interact = fs.readFileSync(path.resolve(__dirname, '../../js/biology_update_interact.js'), 'utf-8');
  const eat = fs.readFileSync(path.resolve(__dirname, '../../js/biology_eat.js'), 'utf-8');
  const sandbox = {
    window: {}, console, Math, Date,
    orgs: [], demoMode: false, gt: 10,
    DCODE: { STARVE: 3 },
    canDivide: () => false,
    doDivide: () => {},
    killOrg: (o) => { o.alive = false; },
    dist2: () => 1e9,
    clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    rng: (a, b) => (a + b) / 2,
    FOOD: { producer: [], consumer1: ['producer'], consumer2: ['producer'], decomposer: [] },
    nutrientClouds: [],
    PD: 1000,
    halfW: () => 400,
    showToast: () => {},
    settings: { predation: 1 },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(interact + '\n' + eat, sandbox);
  return sandbox;
}

function player(over) {
  return Object.assign({
    alive: true, isPlayer: true, x: 0, y: 10, vx: 1, vy: 1,
    size: 6, energy: 40, age: 20, cyst: false, cystT: 0, dividing: false,
    dying: false, divCD: 0, massFood: 1, manualCyst: false,
    sp: { cat: 'consumer1', size: 6, repEnergy: 80, minAge: 3, isEuk: false, flags: {} },
  }, over);
}

describe('manual cyst holds', () => {
  it('does not wake a manual spore in the same frame when energy is high', () => {
    const s = load();
    const o = player({ cyst: true, manualCyst: true, cystMin: 5, energy: 40, cystT: 0 });
    s.updateOrgInteract(o, 0.016);
    expect(o.cyst).toBe(true);
  });

  it('stays encysted for at least 5 seconds of updates', () => {
    const s = load();
    const o = player({ cyst: true, manualCyst: true, cystMin: 5, energy: 80, cystT: 0 });
    for (let i = 0; i < 320; i++) s.updateOrgInteract(o, 1 / 60);
    expect(o.cyst).toBe(true);
    expect(o.cystT).toBeGreaterThanOrEqual(5);
  });

  it('leaves the spore when doCyst toggles after the hold', () => {
    const s = load();
    const o = player({ cyst: true, manualCyst: true, cystMin: 5, cystT: 6, speedMult: 0 });
    s.doCyst(o);
    expect(o.cyst).toBe(false);
    expect(o.manualCyst).toBe(false);
  });

  it('still wakes a hunger cyst once energy returns', () => {
    const s = load();
    const o = player({ cyst: true, manualCyst: false, cystMin: 0, energy: 20, cystT: 1 });
    s.updateOrgInteract(o, 0.2);
    expect(o.cyst).toBe(false);
  });
});
