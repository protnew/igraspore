// store_review_pkg.mjs — пакет на проверку аналитику по листингу (U20).
// Usage: node tools/i18n/store_review_pkg.mjs --round 2 --langs sw,fi,hu,...
import fs from 'fs';
const ROOT = process.cwd();
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const ROUND = arg('--round', '2');
const ONLY = arg('--langs', null);
const DIR = '09-Docs/store-listing';
const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' }) + ' UTC+3';
const game = ['ru','en','pt-BR','es','tr','de','fr','hi','id','ja','vi','ko','th','it','pl','uk','zh-TW','ms','bn','fil'];
let langs = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'DATA-SAFETY-2026-10-14.md').map((f) => f.replace(/\.md$/, ''));
if (ONLY) langs = ONLY.split(',').map((s) => s.trim()).filter(Boolean);
const g = (t, re) => { const m = t.match(re); return m ? m[1].trim() : ''; };
let md = `# Store-listing round ${ROUND} — на проверку аналитику (U20)\n\n`;
md += `Дата: ${now}  |  Круг: ${ROUND}  |  Языков в пакете: ${langs.length}${ONLY ? ' (только изменённые)' : ' (все 32)'}\n`;
md += `Рубрика: название ≤30, краткое ≤80, полное ≤4000; естественность; правильность терминов (не «нематоды» вместо ресничных); ключевые слова. Разработчик НЕ оценивает.\n`;
md += `Важно: фраза «данные игрока не собираются» НЕ трогать до решения №24 (при 1.1/1.2 обновить во всех 32 и в Data safety).\n\n`;
md += `| язык | тип | title (len) | short (len) | full первые 300 |\n|---|---|---|---|---|\n`;
for (const l of langs) {
  const t = fs.readFileSync(`${DIR}/${l}.md`, 'utf8');
  const title = g(t, /^\s*-?\s*(?:title|название)\s*[:=]\s*(.+)$/im);
  const short = g(t, /^\s*-?\s*(?:short|краткое)\s*[:=]\s*(.+)$/im);
  const full = (t.split(/^##\s*(?:Full|Полное)\s*$/im)[1] || '').trim();
  // FR-W2.2: круг 3+ отдаёт ПОЛНЫЙ текст (не обрезку 300); переносы сворачиваются в « / » для таблицы
  const clip = args.includes('--full')
    ? full.replace(/\s*\n\s*/g, ' / ').replace(/\|/g, '/')
    : [...full].slice(0, 300).join('').replace(/\|/g, '/') + '…';
  md += `| ${l} | ${game.includes(l) ? 'игра' : 'лист.'} | ${title} (${[...title].length}) | ${short} (${[...short].length}) | ${clip} |\n`;
}
const out = `09-Docs/i18n-review/store-listing-round${ROUND}-for-review.md`;
fs.writeFileSync(out, md);
console.log('wrote', out, 'langs=' + langs.length);
