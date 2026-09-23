// Aquarium regressions: caption flags, sticky camera follow, mitosis pacing per type.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const jsDir = path.resolve(__dirname, '../../js');

function load(files){
  const sandbox = {
    console, Math, Object, Array, String, Number, Boolean, Date, JSON, RegExp, Error
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  for(const f of files){
    vm.runInContext(fs.readFileSync(path.join(jsDir, f), 'utf8'), ctx, { filename: f });
  }
  return sandbox;
}

const api = load(['lifecycle.js', 'camera_follow.js']);

function runFollow(start, steps, dt){
  let s = Object.assign({ zoom: 2.25, viewW: 800, viewH: 600, vx: 0, vy: 0, now: 0, dt: dt || 0.05 }, start);
  const ids = [];
  const xs = [];
  let flips = 0;
  let prevSign = 0;
  for(let i = 0; i < steps; i++){
    s.now += s.dt;
    const n = api.aquariumFollowStep(s);
    if(prevSign && n.vx && Math.sign(n.vx) !== prevSign && Math.abs(n.vx) > 1) flips++;
    if(Math.abs(n.vx) > 1) prevSign = Math.sign(n.vx);
    ids.push(n.targetId);
    xs.push(n.camX);
    s = Object.assign({}, s, n, { orgs: s.orgs, dt: s.dt, zoom: s.zoom, viewW: s.viewW, viewH: s.viewH });
  }
  return { ids, xs, flips, last: s };
}

describe('entity caption visibility', () => {
  it('demo labels default on unless storage is explicitly 0', () => {
    expect(api.demoLabelsDefault(null)).toBe(true);
    expect(api.demoLabelsDefault(undefined)).toBe(true);
    expect(api.demoLabelsDefault('1')).toBe(true);
    expect(api.demoLabelsDefault('0')).toBe(false);
  });

  it('aquarium and demo show captions; normal play does not', () => {
    expect(api.entityLabelsOn({ demoMode: true, demoLabels: true })).toBe(true);
    expect(api.entityLabelsOn({ demoMode: true, demoLabels: false })).toBe(false);
    expect(api.entityLabelsOn({ aquarium: true })).toBe(true);
    expect(api.entityLabelsOn({ demoMode: false, aquarium: false })).toBe(false);
  });
});

describe('aquarium camera follow stability', () => {
  it('size leadership swapping between distant organisms does not flip the target', () => {
    const orgs = [
      { id: 1, x: -5000, y: 0, alive: true, size: 8 },
      { id: 2, x: 5000, y: 0, alive: true, size: 40 }
    ];
    let s = {
      camX: 0, camY: 0, vx: 0, vy: 0, zoom: 1.8, viewW: 900, viewH: 600,
      targetId: 1, wasInView: false, offSince: 0, lockUntil: 0, now: 0, dt: 0.05, orgs
    };
    const ids = [];
    for(let i = 0; i < 50; i++){
      orgs[0].size = (i % 2) ? 50 : 6;
      orgs[1].size = (i % 2) ? 6 : 50;
      s.now += 0.05;
      const n = api.aquariumFollowStep(s);
      ids.push(n.targetId);
      s = Object.assign({}, s, n, { orgs, dt: 0.05, zoom: 1.8, viewW: 900, viewH: 600 });
    }
    expect(new Set(ids)).toEqual(new Set([1]));
  });

  it('does not steal the lock for a larger organism outside the frame', () => {
    const r = runFollow({
      camX: 0, camY: 0, targetId: 1, wasInView: true,
      orgs: [
        { id: 1, x: 12, y: 8, alive: true, size: 4 },
        { id: 2, x: 8000, y: 0, alive: true, size: 80 }
      ]
    }, 40, 0.05);
    expect(new Set(r.ids)).toEqual(new Set([1]));
    expect(r.flips).toBe(0);
  });

  it('empty frame picks one off-screen creature and does not oscillate', () => {
    const r = runFollow({
      camX: 0, camY: 40, targetId: null,
      orgs: [
        { id: 1, x: -6000, y: 40, alive: true, size: 6 },
        { id: 2, x: 6000, y: 40, alive: true, size: 20 }
      ]
    }, 80, 0.05);
    expect(new Set(r.ids)).toEqual(new Set([1]));
    expect(r.flips).toBe(0);
    expect(r.xs[r.xs.length - 1]).toBeLessThan(r.xs[0]);
    const speed = Math.abs(r.last.vx);
    expect(speed).toBeLessThanOrEqual(110);
  });

  it('after the followed organism leaves, it switches once to a stable alternate', () => {
    const orgs = [
      { id: 1, x: 0, y: 0, alive: true, size: 5 },
      { id: 2, x: 40, y: 0, alive: true, size: 5 }
    ];
    let s = {
      camX: 0, camY: 0, vx: 0, vy: 0, zoom: 2.25, viewW: 800, viewH: 600,
      targetId: 1, wasInView: true, offSince: 0, lockUntil: 0, now: 0, dt: 0.05, orgs
    };
    // drift the current target out of view
    orgs[0].x = 4000;
    const seen = [];
    for(let i = 0; i < 80; i++){
      s.now += s.dt;
      const n = api.aquariumFollowStep(s);
      seen.push(n.targetId);
      s = Object.assign({}, s, n, { orgs, dt: 0.05, zoom: 2.25, viewW: 800, viewH: 600 });
    }
    expect(seen[0]).toBe(1);
    const switchedAt = seen.findIndex(id => id === 2);
    expect(switchedAt).toBeGreaterThan(10);
    const after = seen.slice(switchedAt);
    expect(new Set(after)).toEqual(new Set([2]));
  });
});

describe('mitosis lifecycle per creature type', () => {
  const cats = ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer', 'macrophage', 'virus'];

  function parentOf(cat, shape){
    return {
      sp: { cat, shape: shape || 'rod', color: '#4c4', size: 5, flags: { spikes: true }, minAge: 5, repEnergy: 70 },
      size: 5, preDivSize: 5, sizeMult: 1, generation: 0, offspring: 0,
      energy: 90, massFood: 4, _preMitosis: false, dividing: false, _spikeHold: 0, _fromDivide: false, age: 30
    };
  }

  it('simulates each trophic type: morph, spike gate, cooldown, no fast second split', () => {
    for(const cat of cats){
      const p = parentOf(cat, cat === 'virus' ? 'phage' : 'rod');
      const morph = api.daughterMorph(p);
      expect(morph.shape).toBe(p.sp.shape);
      expect(morph.color).toBe(p.sp.color);
      expect(morph.sp).toBe(p.sp);
      if(cat !== 'virus'){
        expect(morph.size).toBeGreaterThan(p.sp.size * 0.5);
        expect(morph.size).toBeLessThanOrEqual(p.sp.size * 0.82 + 0.001);
      }
      const cd1 = api.mitosisCooldown(p.sp, 1);
      const cd2 = api.mitosisCooldown(p.sp, 2);
      const cd3 = api.mitosisCooldown(p.sp, 3);
      if(cat === 'virus'){
        expect(cd1).toBe(0);
        expect(cd2).toBe(0);
      } else {
        expect(cd1).toBeGreaterThan(6);
        expect(cd2).toBeGreaterThan(cd1);
        expect(cd3).toBeGreaterThanOrEqual(cd2);
        expect(api.lifecycleMinAge(p.sp, 0)).toBe(5);
        expect(api.lifecycleMinAge(p.sp, 1)).toBeGreaterThan(5);
      }
      expect(api.showDefenseSpikes(Object.assign({}, p, { _preMitosis: true }))).toBe(false);
      expect(api.showDefenseSpikes(Object.assign({}, p, { dividing: true, _preMitosis: false }))).toBe(false);
      const daughter = Object.assign({}, p, {
        _fromDivide: true, _divideAge: 1, generation: 1, _preMitosis: false, dividing: false, _spikeHold: 0, age: 1
      });
      expect(api.showDefenseSpikes(daughter)).toBe(false);
      const mature = Object.assign({}, p, { age: 40, _spikeHold: 0, _preMitosis: false, dividing: false, _fromDivide: false });
      if(cat === 'virus') expect(api.showDefenseSpikes(mature)).toBe(true);
      else expect(api.showDefenseSpikes(mature)).toBe(true);
    }
  });

  it('grace window keeps a fresh daughter above the starve floor conceptually', () => {
    for(const cat of ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer', 'macrophage']){
      const grace = api.lifeProfile({ cat }).grace;
      expect(grace).toBeGreaterThan(15);
      expect(api.lifeProfile({ cat }).spikeHold).toBeGreaterThan(0);
    }
    expect(api.lifeProfile({ cat: 'virus' }).grace).toBe(0);
  });
});
