// TZ v20 M1: мягкая мембрана — unit-контракты
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = (f) => fs.readFileSync(path.resolve(__dirname, '../../v3-webgl/js', f), 'utf8');

function makeEnv(){
  const calls = { moveTo: 0, quadraticCurveTo: 0, closePath: 0 };
  const ctx = new Proxy({}, { get: (t, k) => (k in calls ? (() => { calls[k]++; }) : function(){}) });
  const o = {
    vx: 0, vy: 0, wobble: 0.3, facing: 0,
    sp: { speed: 3, shape: 'circle' },
  };
  return { ctx, o, calls };
}

const load = () => {
  const { ctx, o, calls } = makeEnv();
  const sandbox = `
    var window = globalThis; var settings = { softMembrane: true };
    var gt = 1.5;
    ${src('render_membrane.js')}
    globalThis.__mp = membranePath; globalThis.__me = membraneEnabled; globalThis.__N = MEMB_N;
  `;
  // eslint-disable-next-line no-eval
  eval(sandbox.replace('var window = globalThis;', ''));
  return { ctx, o, calls };
};

describe('M1 (TZ v20): мягкая мембрана', () => {
  it('28 точек, путь замкнут квадратичными через середины', () => {
    const { o, calls } = load();
    globalThis.__mp(o, 10);
    expect(globalThis.__N).toBe(28);
    expect(calls.moveTo).toBe(1);
    expect(calls.quadraticCurveTo).toBe(28);
    expect(calls.closePath).toBe(1);
    expect(o._memb.length).toBe(28);
    expect(o._membV.length).toBe(28);
  });

  it('при v=0 отклонение точек ≤ A·sz (+нос=0)', () => {
    const { o } = load();
    for (let k = 0; k < 240; k++) globalThis.__mp(o, 10); // пружина в равновесии
    const A = 0.05, sz = 10;
    for (let i = 0; i < 28; i++) {
      expect(Math.abs(o._memb[i])).toBeLessThanOrEqual(A * sz + 1e-6);
    }
  });

  it('пружина сходится: энергия скорости точек падает', () => {
    const { o } = load();
    o.vx = 5;
    globalThis.__mp(o, 10);           // инициализация состояния
    o._memb[0] = 6; o._membV[0] = 50; // сильный начальный импульс
    let e0 = 0, e1 = 0;
    for (let k = 0; k < 60; k++) globalThis.__mp(o, 10);
    e0 = o._membV[0] * o._membV[0];
    for (let k = 0; k < 180; k++) globalThis.__mp(o, 10);
    e1 = o._membV[0] * o._membV[0];
    expect(e1).toBeLessThan(e0);
    expect(Math.abs(o._memb[0])).toBeLessThanOrEqual(10 * 0.6 + 1e-6);
  });

  it('выкл → старый путь: drawBody не зовёт membranePath (source contract)', () => {
    const code = src('render_entities.js');
    expect(code).toContain("membraneEnabled() && zoom>3");
    expect(code).toMatch(/if\(membraneEnabled\(\) && zoom>3/); // batched-guard снят: cartoon рисует тела через batch-путь
    // переключатель читается из localStorage
    expect(src('config.js')).toContain("igs.softMembrane");
  });

  it('toggle из настроек пишет igs.softMembrane (source contract)', () => {
    const code = src('ui_menus.js');
    expect(code).toContain("toggleMembrane");
    expect(code).toContain("settings.softMembrane");
  });
});
