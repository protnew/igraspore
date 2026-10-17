// U46 (W4) PROBE: попадает ли .04-Src\src\index.html в веб-сборку и APK.
// Только чтение: ничего не правит. Запуск: node tools/probe_index_html.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const TARGET = '.04-Src/src/index.html';

const CANDIDATES = [
  '.04-Src/src/index.html',
  'index.html',
  '06-DevOps-and-Release/cf-publish/index.html',
  '06-DevOps-and-Release/apk_proj/assets/www/index.html',
  '06-DevOps-and-Release/android/app/src/main/assets/public/index.html',
  '06-DevOps-and-Release/deploy-repo/.04-Src/src/index.html',
  '.04-Src/dist-lab/lab/index.html',
  '.04-Src/v3-webgl/index.html'
];

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const lines = (p) => fs.readFileSync(p, 'utf8').split('\n').length;

console.log('== 1. хеши и длины кандидатов ==');
const tsha = fs.existsSync(path.join(ROOT, TARGET)) ? sha(TARGET) : null;
for (const c of CANDIDATES) {
  const p = path.join(ROOT, c);
  if (!fs.existsSync(p)) { console.log(c.padEnd(64), 'НЕТ ФАЙЛА'); continue; }
  const s = sha(p);
  console.log(c.padEnd(64), 'lines=' + String(lines(p)).padEnd(6), 'bytes=' + String(fs.statSync(p).size).padEnd(8),
    'sha=' + s.slice(0, 16), tsha && s === tsha ? '= ЦЕЛЕВОЙ (.04-Src/src/index.html)' : '');
}

console.log('\n== 2. кто ссылается на src/index.html или на папку src в сборке ==');
const SEARCH_IN = [
  'package.json', '.04-Src/package.json', '06-DevOps-and-Release/android/capacitor.config.json',
  '06-DevOps-and-Release/android/package.json', 'capacitor.config.json', '.04-Src/capacitor.config.json', 'wrangler.toml',
  '06-DevOps-and-Release/deploy.ps1', 'tools/run-all-tests.ps1', '06-DevOps-and-Release/android/sign-local.ps1'
];
const rx = /src[\\/]+index\.html|["']\.?\/?src["']|webDir|copy|assets\/www|dist/i;
for (const rel of SEARCH_IN) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { console.log(rel.padEnd(56), 'нет файла'); continue; }
  const hits = [];
  fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (rx.test(l)) hits.push((i + 1) + ': ' + l.trim().slice(0, 120)); });
  console.log(rel.padEnd(56), hits.length ? hits.length + ' совпад.' : '—');
  hits.slice(0, 8).forEach((h) => console.log('    ' + h));
}

console.log('\n== 3. есть ли src/index.html в зеркале сборки (cf-publish) и в APK-www ==');
for (const dir of ['06-DevOps-and-Release/cf-publish', '06-DevOps-and-Release/apk_proj/assets/www']) {
  const p = path.join(ROOT, dir, '.04-Src/src/index.html');
  const p2 = path.join(ROOT, dir, 'src/index.html');
  console.log(dir.padEnd(46), 'cf/.04-Src/src/index.html=' + fs.existsSync(p), 'cf/src/index.html=' + fs.existsSync(p2));
}
