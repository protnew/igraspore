// W2/U20: таблица «язык | было | стало» из git-диффа листинга (круг аналитика → коммит правок).
// Запуск из корня: node .04-Src/qa-playwright/w2_diff.mjs <от-коммит> <до-коммит>
import cp from 'node:child_process';

const FROM = process.argv[2] || '7a43a5f';
const TO = process.argv[3] || '4d9e5b2';
const diff = cp.execSync(`git diff -U0 ${FROM} ${TO} -- 09-Docs/store-listing`, { maxBuffer: 64 * 1024 * 1024 }).toString();
const clip = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; };

let lang = null;
let dels = [];
const rows = [];
const flush = () => {
  if (dels.length) rows.push({ lang, old: dels.join(' ') });
  dels = [];
};
for (const line of diff.split('\n')) {
  const m = line.match(/^\+\+\+ b\/09-Docs\/store-listing\/(.+)\.md$/);
  if (m) { flush(); lang = m[1]; continue; }
  if (line.startsWith('diff ') || line.startsWith('index ') || line.startsWith('---')) { if (line.startsWith('diff ')) flush(); continue; }
  if (line.startsWith('@@')) continue;
  if (line.startsWith('+')) rows.push({ lang, old: dels.length ? dels.join(' ') : '—', neu: line.slice(1) });
  else if (line.startsWith('-')) dels.push(line.slice(1));
}
flush();

const out = [];
let last = null;
for (const r of rows) {
  const key = r.lang + '|' + r.old;
  if (last === key) continue;
  last = key;
  out.push('| ' + r.lang + ' | ' + clip(r.old, 130) + ' | ' + clip(r.neu, 130) + ' |');
}
console.log(out.join('\n'));
console.error('строк в таблице: ' + out.length);
