// store_len.mjs — счётчик лимитов листинга (L.10). title≤30, short≤80, full≤4000.
// Usage: node tools/i18n/store_len.mjs [--dir 09-Docs/store-listing]  -> печатает по файлу, exit 1 при превышении.
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const dirArg = process.argv.indexOf('--dir');
const DIR = dirArg >= 0 ? process.argv[dirArg + 1] : path.join(ROOT, '09-Docs', 'store-listing');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'DATA-SAFETY-2026-10-14.md');
let bad = 0, n = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(DIR, f), 'utf8');
  const g = (re) => { const m = t.match(re); return m ? m[1].trim() : ''; };
  // tolerate "- title:" / "title:" / "- название:" and a trailing "(NN)" count
  const strip = (s) => s.replace(/\s*\(\d+\)\s*$/, '').trim();
  const title = strip(g(/^\s*-?\s*(?:title|название)\s*[:=]\s*(.+)$/im));
  const short = strip(g(/^\s*-?\s*(?:short|краткое)\s*[:=]\s*(.+)$/im));
  const full = t.split(/^##\s*(?:Full|Полное)\s*$/im)[1] || '';
  const len = (s) => [...s.trim()].length;
  const tl = len(title), sl = len(short), fl = len(full);
  const over = tl > 30 || sl > 80 || fl > 4000 || fl === 0;
  n++;
  if (over) bad++;
  console.log((over ? 'FAIL ' : 'ok   ') + f.padEnd(12) + ' title=' + tl + ' short=' + sl + ' full=' + fl);
}
console.log((bad ? 'FAIL' : 'OK') + ' files=' + n + ' over=' + bad);
process.exit(bad ? 1 : 0);
