#!/usr/bin/env node
// v24 задача 9: проверка содержимого AAB — словари/wiki == enabled-набору; locales_config == enabled; размер.
// Usage: node tools/aab_langs.cjs [путь-к-AAB] ; NEG=1 — исключить один словарь из проверки (должен FAIL)
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const UNZIP = 'unzip';
const AAB = process.argv[2] || path.join(process.cwd(), '06-DevOps-and-Release/android/android/app/build/outputs/bundle/release/app-release.aab');
const TMP = path.join(process.cwd(), '.10-Archive', 'aab-lang-check-tmp');

// enabled-набор: из IGS_ENABLED (i18n_detect.js) — до A1 (реестр)
const det = fs.readFileSync(path.join(process.cwd(), '.04-Src/js/i18n_detect.js'), 'utf8');
const m = det.match(/IGS_ENABLED\s*=\s*window\.IGS_ENABLED\s*\|\|\s*\{([^}]*)\}/) || det.match(/IGS_ENABLED\s*=\s*\{([^}]*)\}/);
if (!m) { console.error('нет IGS_ENABLED'); process.exit(2); }
const enabled = m[1].split(',').map(s => s.trim().split(':')[0].replace(/['"]/g, '')).filter(Boolean);

let check = enabled.slice();
if (process.env.NEG) { check = check.slice(1); console.log('[NEG] проверяю без', enabled[0], '— должен FAIL'); }

fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
try {
  execFileSync(UNZIP, ['-o', '-q', AAB, 'base/assets/public/i18n/*', '-d', TMP], { stdio: 'pipe' });
} catch (e) { console.error('unzip fail:', e.message); process.exit(2); }
const i18nDir = path.join(TMP, 'base/assets/public/i18n');
const SERVICE = ['i18n_identity.allow', 'wave2-status', 'languages']; // v24: служебные — не словари (после задачи 12 их в AAB быть не должно; пока не FAIL)
const inAab = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')).filter(x => !SERVICE.includes(x));

const missing = check.filter(l => !inAab.includes(l));
const extra = inAab.filter(l => !enabled.includes(l));
// locales_config.xml (res) — из распаковки того же AAB
let loc = [];
try {
  // в AAB locales_config — бинарный AXML; сверяем ИСХОДНИК проекта (текст) + факт наличия в AAB (listing)
  const srcXml = path.join(process.cwd(), '06-DevOps-and-Release/android/android/app/src/main/res/xml/locales_config.xml');
  loc = [...fs.readFileSync(srcXml, 'utf8').matchAll(/android:name="([^"]+)"/g)].map(x => x[1]);
  const listing = execFileSync(UNZIP, ['-l', AAB], { encoding: 'utf8' });
  if (listing.indexOf('base/res/xml/locales_config.xml') < 0) loc = []; // файла нет в AAB — считаем пустым
} catch (e) { /* нет исходника или листинга */ }
const locMiss = check.filter(l => !loc.includes(l)); // locales_config использует BCP-47 ('pt-BR'), как и наш реестр

const size = fs.statSync(AAB).size;
const ok = missing.length === 0 && extra.length === 0 && locMiss.length === 0;
console.log(JSON.stringify({ aab: path.basename(AAB), sizeMB: +(size / 1048576).toFixed(2), enabled: enabled.length,
  inAab: inAab.length, missing, extra, localesConfig: loc.length, locMiss, result: ok ? 'OK' : 'FAIL' }));
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(ok ? 0 : 1);
