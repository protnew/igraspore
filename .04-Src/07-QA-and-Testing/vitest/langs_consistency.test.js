// langs_consistency.test.js — TZ v9 §29: один источник правды для набора языков.
// Проверяет равенство/покрытие источников:
//  (a) ключи LANGS в .04-Src/js/config.js
//  (b) enabled:true в .04-Src/i18n/languages.json
//  (e) ключи window.IGS_ENABLED в .04-Src/js/i18n_detect.js (переключатель)
//  (f) <locale> в android locales_config.xml (P2.12)
//  и для каждого включённого языка:
//  (c) доказательство критиков: валидные (не draft) raw-файлы кругов A+B >=8 схемы §30
//      ИЛИ наследие v2 — >=2 оценки >=8 в поле critics[] languages.json (до перепроверки v3);
//      en/ru — исходники, критики не нужны
//  (d) .04-Src/i18n/<lang>.json содержит 100% ключей en.json; если существует
//      .04-Src/i18n/wiki/en.json — то и wiki/<lang>.json со 100% его ключей.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SRC = path.join(ROOT, '.04-Src');
const I18N = path.join(SRC, 'i18n');
const RAW = path.join(ROOT, '09-Docs', 'i18n-review', 'raw');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const sorted = (a) => [...a].sort();

// (a) LANGS keys from config.js literal
const cfg = fs.readFileSync(path.join(SRC, 'js', 'config.js'), 'utf8');
const langsBody = cfg.match(/LANGS=\{([^}]*)\}/)[1];
const LANGS_KEYS = Object.keys(new Function('return {' + langsBody + '}')());

// (b) enabled from languages.json
const langsJson = readJson(path.join(I18N, 'languages.json'));
const ENABLED = langsJson.filter((l) => l.enabled).map((l) => l.code);

// (e) IGS_ENABLED keys from i18n_detect.js
const det = fs.readFileSync(path.join(SRC, 'js', 'i18n_detect.js'), 'utf8');
const igsBody = det.match(/IGS_ENABLED\s*=\s*window\.IGS_ENABLED\s*\|\|\s*\{([^}]*)\}/)[1];
const IGS_KEYS = Object.keys(new Function('return {' + igsBody + '}')());

// (f) locales_config.xml
const locPath = path.join(ROOT, '06-DevOps-and-Release', 'android', 'android', 'app', 'src', 'main', 'res', 'xml', 'locales_config.xml');
const LOCALES = fs.existsSync(locPath)
  ? [...fs.readFileSync(locPath, 'utf8').matchAll(/android:name="([^"]+)"/g)].map((m) => m[1])
  : null;

// (c) critic evidence per language
const PLACEHOLDER = /^(agent-run-.+|A|B|model|unknown|qfmodel|qoder-hvless|UNATTESTED)$/i;
function v3Evidence(code) {
  if (!fs.existsSync(RAW)) return false;
  const rounds = {};
  for (const f of fs.readdirSync(RAW)) {
    if (!f.endsWith('.json') || f.endsWith('-draft.json')) continue;
    let d; try { d = readJson(path.join(RAW, f)); } catch (e) { continue; }
    if (!d || !d.role || !d.model || PLACEHOLDER.test(String(d.model)) || !d.session_id) continue;
    if (!(Date.parse(d.finished_at) > Date.parse(d.started_at))) continue;
    for (const L of d.langs || []) {
      if (L.code !== code || !(L.score >= 8)) continue;
      const r = 'r' + d.round;
      rounds[r] = rounds[r] || { A: false, B: false };
      if (d.role === 'critic-A') rounds[r].A = true;
      if (d.role === 'critic-B') rounds[r].B = true;
    }
  }
  return Object.values(rounds).some((r) => r.A && r.B);
}
const legacyEvidence = (code) => {
  const rec = langsJson.find((l) => l.code === code);
  return rec && (rec.critics || []).filter((s) => s >= 8).length >= 2;
};

// (d) dictionary completeness vs en.json (+wiki when present)
const enKeys = Object.keys(readJson(path.join(I18N, 'en.json')));
const wikiDir = path.join(I18N, 'wiki');
const wikiEn = fs.existsSync(path.join(wikiDir, 'en.json'))
  ? Object.keys(readJson(path.join(wikiDir, 'en.json'))) : null;
function completeFiles(code) {
  const f = path.join(I18N, code + '.json');
  if (!fs.existsSync(f)) return { ok: false, why: 'нет i18n/' + code + '.json' };
  const keys = new Set(Object.keys(readJson(f)));
  const miss = enKeys.filter((k) => !keys.has(k));
  if (miss.length) return { ok: false, why: 'i18n: нет ' + miss.length + ' ключей (' + miss.slice(0, 5).join(',') + '…)' };
  if (wikiEn) {
    const wf = path.join(wikiDir, code + '.json');
    if (!fs.existsSync(wf)) return { ok: false, why: 'нет wiki/' + code + '.json' };
    const wk = new Set(Object.keys(readJson(wf)));
    const wmiss = wikiEn.filter((k) => !wk.has(k));
    if (wmiss.length) return { ok: false, why: 'wiki: нет ' + wmiss.length + ' ключей' };
  }
  return { ok: true };
}

describe('langs_consistency (TZ v9 §29)', () => {
  it('LANGS (config.js) == enabled (languages.json)', () => {
    expect(sorted(LANGS_KEYS)).toEqual(sorted(ENABLED));
  });
  it('IGS_ENABLED (переключатель) == enabled', () => {
    expect(sorted(IGS_KEYS)).toEqual(sorted(ENABLED));
  });
  it('locales_config.xml == enabled (P2.12)', () => {
    if (!LOCALES) throw new Error('нет locales_config.xml');
    expect(sorted(LOCALES)).toEqual(sorted(ENABLED));
  });
  it('каждый включённый язык имеет доказательство критиков (v3 raw A+B>=8 или наследие v2 >=2x8)', () => {
    const missing = [];
    const legacyOnly = [];
    for (const code of ENABLED) {
      if (code === 'en' || code === 'ru') continue;
      if (v3Evidence(code)) continue;
      if (legacyEvidence(code)) { legacyOnly.push(code); continue; }
      missing.push(code);
    }
    if (legacyOnly.length) console.log('по наследию v2 (перепроверка v3 ждёт):', legacyOnly.join(','));
    expect(missing).toEqual([]);
  });
  it('каждый включённый язык имеет полные файлы i18n (+wiki)', () => {
    const bad = [];
    for (const code of ENABLED) {
      const r = completeFiles(code);
      if (!r.ok) bad.push(code + ': ' + r.why);
    }
    expect(bad).toEqual([]);
  });
});
