// TZ v20 B1: голова фага = VIRUS_SCALE × медиана радиуса бактерий (±5%)
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = (f) => fs.readFileSync(path.resolve(__dirname, '../../v3-webgl/js', f), 'utf8');

describe('B1 (TZ v20): virus scale', () => {
  it('VIRUS_SCALE constant = 0.08 in config.js', () => {
    expect(src('config.js')).toMatch(/var VIRUS_SCALE=0\.08/);
  });

  it('virusHeadR() = 0.08 x median bacteria radius within ±5%', () => {
    const sizes = [3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8]; // медиана 4.0
    const sandbox = `
      var window = globalThis;
      var orgs = sizes.map(function(s){ return { alive: true, size: s, sp: { cat: 'consumer1' } }; });
      orgs.push({ alive: true, size: 9, sp: { cat: 'consumer3' } }); // не бактерия — не считается
      var fc = 0, zoom = 12;
      var ctx = new Proxy({}, { get: function(){ return function(){}; } });
      ${src('config.js').split('// === SPECIES DATABASE')[0]}
      ${src('render_organs.js')}
      globalThis.__vhr = virusHeadR;
    `;
    // eslint-disable-next-line no-eval
    eval(sandbox.replace('var window = globalThis;', ''));
    const head = globalThis.__vhr();
    const target = 0.08 * 4.0;
    expect(Math.abs(head - target) / target).toBeLessThanOrEqual(0.05);
  });

  it('renderViruses draws proportions head:tail:fibers = 1:1.7:1.0 (source contract)', () => {
    const code = src('render_organs.js');
    expect(code).toContain('var tail=1.7*rDraw,fib=1.0*rDraw');
    expect(code).toMatch(/Math\.max\(r,1\.5\/zoom\)/); // FR-B1.3: точка ≥1.5px при zoom<3
  });

  it('biology_virus contact zone uses the same head radius (FR-B1.4)', () => {
    const code = src('biology_virus.js');
    expect(code).toMatch(/virusHeadR\(\)\s*:\s*15/);
    expect(code).not.toMatch(/d<15\)\{/);
  });
});
