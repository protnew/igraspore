import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadInteract() {
  const code = fs.readFileSync(
    path.resolve(__dirname, '../../js/biology_update_interact.js'),
    'utf-8'
  );
  const orgs = [];
  const killed = [];
  const divided = [];
  const eaten = [];
  const toasts = [];
  const sandbox = {
    tt: (k) => k,
    window: {},
    document: { getElementById: () => null, querySelectorAll: () => [], addEventListener: () => {} },
    console, Math, Date, JSON, parseInt, parseFloat, isNaN, isFinite,
    setTimeout: () => 0, setInterval: () => 0, requestAnimationFrame: () => 0,
    orgs,
    demoMode: false,
    gt: 100,
    DCODE: { EATEN: 0, LYSIS: 1, TEMP: 2, STARVE: 3, AGE: 4 },
    FOOD: {
      producer: [],
      consumer1: ['producer'],
      consumer2: ['producer', 'consumer1'],
      consumer3: ['producer', 'consumer1', 'consumer2'],
      decomposer: [],
    },
    canDivide: (o) => !!(o && o.energy > 80 && !o.cyst && !o.dividing),
    doDivide: (o) => { divided.push(o); o.dividing = true; },
    killOrg: (o, code) => { o.alive = false; killed.push({ o, code }); },
    eatOrg: (a, p) => { p.alive = false; a.energy += 10; eaten.push([a, p]); },
    forceEat: (a, p) => { p.alive = false; a.energy += 10; eaten.push([a, p]); },
    dist2: (a, b) => {
      const dx = a.x - b.x, dy = a.y - b.y;
      return dx * dx + dy * dy;
    },
    clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    showToast: (m) => toasts.push(m),
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.global = sandbox;
  sandbox.window.demoMode = false;
  sandbox.window.showToast = sandbox.showToast;
  sandbox.window.getNearby = (x, y, r) => orgs.filter(o => o && o.alive);
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return { sandbox, orgs, killed, divided, eaten, toasts };
}

function makeOrg(over = {}) {
  return {
    alive: true,
    x: 0, y: 20, vx: 0, vy: 0,
    size: 6, energy: 50, facing: 0, age: 10,
    cyst: false, dividing: false, dying: false,
    isPlayer: false, flash: 0, massFood: 0,
    _cystCount: 0, divCD: 0, invuln: 0, spawnTime: 0,
    sizeMult: 1, birthSize: 3,
    state: 'idle', aiTarget: null,
    sp: {
      id: 1, cat: 'consumer1', size: 6, speed: 0.4,
      shape: 'rod', color: '#33a',
      repEnergy: 100, isEuk: false, flags: {},
    },
    ...over,
  };
}

describe('biology_update_interact.js', () => {
  let env;
  beforeEach(() => { env = loadInteract(); });

  it('exposes updateOrgInteract on window', () => {
    expect(typeof env.sandbox.updateOrgInteract).toBe('function');
    expect(typeof env.sandbox.window.updateOrgInteract).toBe('function');
  });

  it('starving NPC enters cyst and restores energy to 10', () => {
    const o = makeOrg({ energy: 0, _cystCount: 0 });
    env.orgs.push(o);
    env.sandbox.updateOrgInteract(o, 0.16);
    expect(o.cyst).toBe(true);
    expect(o.energy).toBe(10);
    expect(o._cystCount).toBe(1);
    expect(o.alive).toBe(true);
  });

  it('energy <= -15 kills via STARVE', () => {
    const o = makeOrg({ energy: -20, _cystCount: 99, cyst: true });
    env.orgs.push(o);
    env.sandbox.updateOrgInteract(o, 0.16);
    expect(o.alive).toBe(false);
    expect(env.killed.length).toBeGreaterThan(0);
    expect(env.killed[0].code).toBe(env.sandbox.DCODE.STARVE);
  });

  it('player wakes from cyst when energy >= 18', () => {
    const o = makeOrg({ isPlayer: true, cyst: true, energy: 20 });
    env.orgs.push(o);
    env.sandbox.updateOrgInteract(o, 0.16);
    expect(o.cyst).toBe(false);
  });

  it('player cyst toast on first starve', () => {
    const o = makeOrg({ isPlayer: true, energy: 0, _cystCount: 0 });
    env.orgs.push(o);
    env.sandbox.updateOrgInteract(o, 0.16);
    expect(o.cyst).toBe(true);
    expect(env.toasts.length).toBeGreaterThan(0);
  });

  it('lerps size toward adult target when not dividing', () => {
    const o = makeOrg({ size: 2, energy: 80, massFood: 20, cyst: false });
    env.orgs.push(o);
    const s0 = o.size;
    env.sandbox.updateOrgInteract(o, 1.0);
    expect(o.size).toBeGreaterThan(s0);
  });

  it('auto-eat: consumer eats smaller producer in range', () => {
    const pred = makeOrg({ energy: 40, size: 10, x: 0, y: 0, cat: undefined });
    pred.sp.cat = 'consumer1';
    const prey = makeOrg({
      energy: 30, size: 3, x: 2, y: 0,
      sp: { id: 2, cat: 'producer', size: 3, speed: 0.1, shape: 'circle', color: '#4c4', repEnergy: 80, isEuk: false, flags: {} },
    });
    env.orgs.push(pred, prey);
    env.sandbox.updateOrgInteract(pred, 0.16);
    expect(env.eaten.length).toBeGreaterThan(0);
    expect(prey.alive).toBe(false);
    expect(pred.energy).toBeGreaterThan(40);
  });

  it('does not eat prey >= 1.25x attacker size', () => {
    const pred = makeOrg({ energy: 40, size: 4, x: 0, y: 0 });
    pred.sp.cat = 'consumer1';
    const prey = makeOrg({
      energy: 30, size: 8, x: 1, y: 0,
      sp: { id: 2, cat: 'producer', size: 8, speed: 0.1, shape: 'circle', color: '#4c4', repEnergy: 80, isEuk: false, flags: {} },
    });
    env.orgs.push(pred, prey);
    env.sandbox.updateOrgInteract(pred, 0.16);
    expect(prey.alive).toBe(true);
    expect(env.eaten.length).toBe(0);
  });

  it('skips invulnerable NPC prey', () => {
    const pred = makeOrg({ energy: 40, size: 10, x: 0, y: 0, isPlayer: false });
    pred.sp.cat = 'consumer1';
    const prey = makeOrg({
      energy: 30, size: 3, x: 1, y: 0, invuln: 5,
      sp: { id: 2, cat: 'producer', size: 3, speed: 0.1, shape: 'circle', color: '#4c4', repEnergy: 80, isEuk: false, flags: {} },
    });
    env.orgs.push(pred, prey);
    env.sandbox.updateOrgInteract(pred, 0.16);
    expect(prey.alive).toBe(true);
    expect(env.eaten.length).toBe(0);
  });

  it('gendered pair in range calls doDivide on both', () => {
    const a = makeOrg({ energy: 120, size: 6, x: 0, y: 0, gender: 'm', seekingMate: true });
    a.sp.flags = { gendered: true };
    a.sp.id = 7;
    const b = makeOrg({ energy: 120, size: 6, x: 2, y: 0, gender: 'f', seekingMate: true });
    b.sp = { ...a.sp, flags: { gendered: true } };
    env.orgs.push(a, b);
    env.sandbox.updateOrgInteract(a, 1.0);
    expect(env.divided.length).toBeGreaterThanOrEqual(2);
    expect(a.dividing).toBe(true);
    expect(b.dividing).toBe(true);
  });

  it('ciliate filter-feed eats in-chain small prey', () => {
    const cil = makeOrg({ energy: 50, size: 12, x: 0, y: 0 });
    cil.sp.cat = 'consumer2';
    const prey = makeOrg({
      energy: 20, size: 2, x: 5, y: 0,
      sp: { id: 3, cat: 'producer', size: 2, speed: 0.05, shape: 'circle', color: '#4c4', repEnergy: 60, isEuk: false, flags: {} },
    });
    env.orgs.push(cil, prey);
    env.sandbox.updateOrgInteract(cil, 0.16);
    expect(env.eaten.length).toBeGreaterThan(0);
    expect(prey.alive).toBe(false);
  });

  it('demoMode blocks random divide', () => {
    env.sandbox.window.demoMode = true;
    const o = makeOrg({ energy: 200 });
    env.orgs.push(o);
    for (let i = 0; i < 30; i++) env.sandbox.updateOrgInteract(o, 1);
    expect(env.divided.length).toBe(0);
  });
});
