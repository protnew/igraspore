import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

// v20.10 R6: one-time migration to the full pool with a version flag; the manual slider choice is kept.
const SRC = fs.readFileSync(path.resolve(__dirname, '../../js/density_pref.js'), 'utf-8');
function boot(stored, density) {
  const mem = Object.assign({}, stored || {});
  const localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } };
  const sb = { settings: { density: density == null ? 0.3 : density }, localStorage, parseFloat, isFinite, Math };
  sb.window = sb; vm.createContext(sb); vm.runInContext(SRC, sb);
  return { sb, mem };
}

describe('R6 density migration', () => {
  it('old install (no flag, phone-lowered 0.3) -> full pool 1.0 and flag v2', () => {
    const { sb, mem } = boot({}, 0.3);
    expect(sb.igsDensityMigrateResult).toBe('migrated');
    expect(sb.settings.density).toBe(1);
    expect(mem.igs_density_ver).toBe('2');
  });
  it('migration is one-time: second boot reports current, still 1.0', () => {
    const { sb } = boot({ igs_density_ver: '2' }, 0.55);
    expect(sb.igsDensityMigrateResult).toBe('current');
    expect(sb.settings.density).toBe(1);
  });
  it('manual choice is never overwritten (with or without old flag)', () => {
    for (const ver of [undefined, '1', '2']) {
      const st = { igs_density: '0.6', igs_density_manual: '1' }; if (ver) st.igs_density_ver = ver;
      const { sb } = boot(st, 1);
      expect(sb.igsDensityMigrateResult).toBe('manual');
      expect(sb.settings.density).toBe(0.6);
    }
  });
  it('slider write marks the value as manual; invalid values are rejected', () => {
    const { sb, mem } = boot({}, 1);
    expect(sb.igsSetDensity('1.7')).toBe(true);
    expect(mem.igs_density).toBe('1.7'); expect(mem.igs_density_manual).toBe('1');
    expect(sb.igsSetDensity('5')).toBe(false); expect(sb.settings.density).toBe(1.7);
    const again = boot(mem, 1); expect(again.sb.settings.density).toBe(1.7);
  });
  it('corrupted manual value falls back to migration (no NaN density)', () => {
    const { sb } = boot({ igs_density: 'abc', igs_density_manual: '1' }, 0.3);
    expect(sb.settings.density).toBe(1);
  });
  it('wired: index.html loads density_pref.js right after config.js; slider calls igsSetDensity', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../../index.html'), 'utf-8');
    expect(html).toMatch(/config\.js[^\n]*<\/script>\s*<script src="04-Src\/js\/density_pref\.js/);
    const ui = fs.readFileSync(path.resolve(__dirname, '../../js/ui_screens.js'), 'utf-8');
    expect(ui).toContain('igsSetDensity(this.value)');
  });
});
