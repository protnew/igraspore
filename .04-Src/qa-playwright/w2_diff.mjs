// W2/U20: таблица «язык | было → стало» из git-диффа листинга (09-Docs/store-listing).
// Разбираем по ханкам: внутри ханка группы «-» и «+» сопоставляем по порядку; показываем только
// изменившийся фрагмент (общие префикс/суффикс срезаются), иначе целые абзацы выглядят одинаково.
// Запуск из корня: node .04-Src/qa-playwright/w2_diff.mjs <от-коммит> <до-коммит>
import cp from 'node:child_process';

const FROM = process.argv[2] || '7a43a5f';
const TO = process.argv[3] || '4d9e5b2';
const diff = cp.execSync('git diff -U0 ' + FROM + ' ' + TO + ' -- 09-Docs/store-listing', { maxBuffer: 64 * 1024 * 1024 }).toString();

const rows = [];
let lang = null, dels = [], ins = [];
const emit = () => {
  const n = Math.max(dels.length, ins.length);
  for (let i = 0; i < n; i++) rows.push({ lang, old: dels[i] || '', neu: ins[i] || '' });
  dels = []; ins = [];
};
for (const line of diff.split('\n')) {
  const m = line.match(/^\+\+\+ b\/09-Docs\/store-listing\/(.+)\.md$/);
  if (m) { emit(); lang = m[1]; continue; }
  if (line.startsWith('diff ')) { emit(); continue; }
  if (line.startsWith('index ') || line.startsWith('---')) continue;
  if (line.startsWith('@@')) { emit(); continue; }
  if (line.startsWith('-')) dels.push(line.slice(1));
  else if (line.startsWith('+')) ins.push(line.slice(1));
}
emit();

function trimPair(a, b) {
  a = String(a); b = String(b);
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  const pre = a.slice(Math.max(0, i - 25), i), post = a.slice(a.length - j, a.length - j + 25);
  return { ctx: (i > 25 ? '…' : '') + pre, oldF: a.slice(i, a.length - j), newF: b.slice(i, b.length - j), post: (j > 25 ? '…' : '') + post };
}
const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

const out = [];
let same = 0;
for (const r of rows) {
  if (!r.old && !r.neu) continue;
  if (r.old && r.neu) {
    if (r.old === r.neu) { same++; continue; }
    const t = trimPair(r.old, r.neu);
    if (!t.oldF && !t.newF) { same++; continue; }
    out.push('| ' + r.lang + ' | ' + clip((t.ctx + '[' + clip(t.oldF, 90) + ']' + t.post).replace(/\|/g, '/'), 170) +
      ' | ' + clip((t.ctx + '[' + clip(t.newF, 90) + ']' + t.post).replace(/\|/g, '/'), 170) + ' |');
  } else if (r.neu) {
    out.push('| ' + r.lang + ' | — | ' + clip(r.neu.replace(/\|/g, '/'), 120) + ' |');
  } else {
    out.push('| ' + r.lang + ' | ' + clip(r.old.replace(/\|/g, '/'), 120) + ' | — |');
  }
}
const langs = [...new Set(out.map(s => s.split(' | ')[0].replace('| ', '')))];
console.log('| язык | было (изменённый фрагмент в []) | стало |');
console.log('|---|---|---|');
console.log(out.join('\n'));
console.error('строк: ' + out.length + ' | языков: ' + langs.join(', ') + ' | одинаковых пар отброшено: ' + same);
