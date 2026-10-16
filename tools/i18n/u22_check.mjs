// u22_check.mjs — U22 пруфы: localeConfig vs enabled, B0/B1 verdicts, P2.5 иконки, lab sha.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// 1) P2.12 — locales_config.xml множество = enabled
const xml = fs.readFileSync(path.join(ROOT, '06-DevOps-and-Release/android/android/app/src/main/res/xml/locales_config.xml'), 'utf8');
const loc = [...xml.matchAll(/android:name="([A-Za-z0-9-]+)"/g)].map((m) => m[1]);
const enabled = rd('.04-Src/i18n/languages.json').filter((l) => l.enabled).map((l) => l.code);
const A = new Set(loc), B = new Set(enabled);
const xmlOnly = [...A].filter((x) => !B.has(x)), enOnly = [...B].filter((x) => !A.has(x));
console.log('P2.12 locales_config=' + loc.length + ' enabled=' + enabled.length +
  ' | xml-only: ' + (xmlOnly.join(',') || '-') + ' | enabled-only: ' + (enOnly.join(',') || '-') +
  ' | ' + (xmlOnly.length || enOnly.length ? 'MISMATCH' : 'MATCH'));

// 2) B0/B1 вердикты
for (const phase of ['before', 'after']) {
  const f = `09-Docs/out-dev-factory/shots-release-ready-2026-10-14/buttons-${phase}/buttons.json`;
  if (!fs.existsSync(f)) { console.log('B/' + phase + ': нет файла'); continue; }
  const j = rd(f);
  const rows = j.rows || j.results || j.items || [];
  const c = {};
  for (const x of rows) { const v = x.verdict || x.status || '?'; c[v] = (c[v] || 0) + 1; }
  const st = fs.statSync(f);
  const pngs = fs.readdirSync(path.dirname(f)).filter((x) => x.endsWith('.png')).length;
  console.log(`B0/${phase} ${new Date(st.mtime).toISOString().slice(0, 16).replace('T', ' ')} rows=${j.count ?? rows.length} png=${pngs} verdicts=${JSON.stringify(c)}`);
}

// 3) P2.5 — иконки
const iconCands = [
  '06-DevOps-and-Release/cf-publish/assets/icons',
  '06-DevOps-and-Release/android/android/app/src/main/res/mipmap-xxhdpi',
  '06-DevOps-and-Release/android/android/app/src/main/res/drawable',
];
for (const d of iconCands) {
  if (fs.existsSync(d)) console.log('P2.5 ' + d + ': ' + fs.readdirSync(d).filter((f) => /\.(png|xml)$/i.test(f)).slice(0, 6).join(', '));
  else console.log('P2.5 ' + d + ': НЕТ');
}
// manifest icons
const mf = '06-DevOps-and-Release/cf-publish/manifest.json';
if (fs.existsSync(mf)) { const m = rd(mf); console.log('P2.5 manifest icons: ' + (m.icons || []).map((i) => `${i.sizes} ${i.purpose || ''}`.trim()).join(' | ')); }

// 4) P2.6 — фича-графика и снимки 1080x1920 по языкам
const shots = '09-Docs/store-listing/shots';
console.log('P2.6 store shots dir: ' + (fs.existsSync(shots) ? fs.readdirSync(shots).length + ' подпапок' : 'НЕТ'));

// 5) A.7 — lab собран с текущим sha
const labIdx = '.04-Src/dist-lab/lab/index.html';
if (fs.existsSync(labIdx)) {
  const t = fs.readFileSync(labIdx, 'utf8');
  const sha = (t.match(/sha ([0-9a-f]{7})/) || [])[1] || '?';
  const head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log('A.7 lab header sha=' + sha + ' HEAD=' + head + ' ' + (sha === head ? 'MATCH' : 'STALE'));
}
