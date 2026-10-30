import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const ROOT = path.join(process.cwd(), '..'); // проект
const SRC = path.join(process.cwd()); // .04-Src
const REG = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/languages.json'), 'utf8'));
const ON = REG.filter(l => l.enabled !== false);

describe('A1: единый реестр языков', () => {
  it('все enabled есть во всех сгенерированных местах', () => {
    const cfg = fs.readFileSync(path.join(SRC, 'js/config.js'), 'utf8');
    const det = fs.readFileSync(path.join(SRC, 'js/i18n_detect.js'), 'utf8');
    const hud = fs.readFileSync(path.join(SRC, 'js/i18n_hud.js'), 'utf8');
    const loc = fs.readFileSync(path.join(ROOT, '06-DevOps-and-Release/android/android/app/src/main/res/xml/locales_config.xml'), 'utf8');
    for (const l of ON) {
      expect(cfg, 'LANGS/LANG_NAME ' + l.code).toContain("'" + l.code + "'");
      expect(det, 'IGS_ENABLED ' + l.code).toContain("'" + l.code + "'");
      expect(hud, 'langNames ' + l.code).toContain(l.code);
      expect(loc, 'locales_config ' + l.code).toContain('android:name="' + l.code + '"');
    }
  });
  it('реестр: обязательные поля у каждого', () => {
    for (const l of REG) {
      for (const f of ['code','native','script','dir','digits','playListing','register','font','enabled'])
        expect(l[f], l.code + '.' + f).toBeDefined();
      expect(['ltr','rtl']).toContain(l.dir);
    }
  });
  it('langNames не содержит выключенных/лишних кодов', () => {
    const hud = fs.readFileSync(path.join(SRC, 'js/i18n_hud.js'), 'utf8');
    const m = hud.match(/window\.langNames = \{[\s\S]*?\};/)[0];
    const codes = [...m.matchAll(/'([^']+)':/g)].map(x => x[1]).concat([...m.matchAll(/([a-z-]+):/g)].map(x => x[1]));
    const onSet = new Set(ON.map(l => l.code));
    const uniq = [...new Set(codes)];
    for (const c of uniq) if (c.length > 1 && !onSet.has(c) && !['window','langNames'].includes(c)) expect.fail('лишний код в langNames: ' + c);
  });
});
