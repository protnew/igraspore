import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function load() {
  const code = fs.readFileSync(path.resolve(__dirname, '../../js/biology.js'), 'utf-8');
  const sandbox = {
    window: {}, console, Math, Date,
    orgs: [], MAX_ORG: 100, gt: 1, PD: 1000,
    stats: { births: 0 }, speciesPop: {},
    genOrgans: () => [],
    rng: (a, b) => a,
    settings: { divRate: 0.1 },
    tt: (k) => k,

    igsText: (k, fb) => fb,
    igsNum: (n, d) => (d ? Number(n).toFixed(d) : String(Math.round(n))),
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

function org(over) {
  return Object.assign({
    alive: true, isPlayer: true, cyst: false, dying: false, dividing: false,
    divCD: 0, age: 20, energy: 100, size: 8, massFood: 6, sizeMult: 1,
    sp: { cat: 'consumer1', size: 6, repEnergy: 80, minAge: 3 },
  }, over);
}

describe('divideNeeds contract', () => {
  it('canDivide matches divideNeeds().ok on 200 random states', () => {
    const s = load();
    for (let i = 0; i < 200; i++) {
      const o = org({
        alive: i % 17 !== 0,
        cyst: i % 19 === 0,
        dividing: i % 23 === 0,
        divCD: (i % 11) - 3,
        age: i % 30,
        energy: (i * 7) % 120,
        size: (i % 15) + 1,
        massFood: (i % 9),
        isPlayer: i % 2 === 0,
        sp: { cat: ['producer', 'consumer1', 'consumer2', 'decomposer'][i % 4], size: 4 + (i % 5), repEnergy: 60 + (i % 40), minAge: 3 },
      });
      const n = s.divideNeeds(o);
      expect(s.canDivide(o)).toBe(n.ok);
      if (!n.ok) expect(s.divideBlockReason(o).length).toBeGreaterThan(0);
      else expect(s.divideBlockReason(o)).toBe('');
    }
  });

  it('divRate does not block the player', () => {
    const s = load();
    const o = org({});
    expect(s.canDivide(o)).toBe(true);
    let blocked = 0;
    for (let i = 0; i < 30; i++) {
      const copy = org({ dividing: false });
      if (!s.doDivide(copy)) blocked++;
    }
    expect(blocked).toBe(0);
  });
});
