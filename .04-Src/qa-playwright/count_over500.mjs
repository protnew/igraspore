// Подсчёт файлов > 500 строк в продукте (блок «Файлы >500 строк» отчёта).
// Запуск из корня: node .04-Src/qa-playwright/count_over500.mjs
import cp from 'node:child_process';
import fs from 'node:fs';

const files = cp.execSync('git ls-files', { maxBuffer: 64 * 1024 * 1024 }).toString().split('\n').filter(Boolean);
const SRC_DIRS = /^(\.04-Src\/)(js|i18n|src|v3-webgl|07-QA-and-Testing|qa-playwright)\//;
const ROOT_FILES = /^(index\.html|style\.css|sw\.js)$/;
const TEXT = /\.(js|mjs|cjs|json|css|html)$/;
const SKIP = /(_archive|coverage|node_modules|screenshots|snapshots|-before-)/;

const scope = files.filter((f) => (SRC_DIRS.test(f) || ROOT_FILES.test(f)) && TEXT.test(f) && !SKIP.test(f));
const big = [];
for (const f of scope) {
  try {
    const n = fs.readFileSync(f, 'utf8').split('\n').length;
    if (n > 500) big.push([f, n]);
  } catch (e) { /* файл мог исчезнуть между ls-files и чтением */ }
}
big.sort((a, b) => b[1] - a[1]);

const out = [
  'область: git ls-files под .04-Src/{js,i18n,src,v3-webgl,07-QA-and-Testing,qa-playwright} + корневые index.html/style.css/sw.js;',
  'текстовые расширения .js/.mjs/.cjs/.json/.css/.html; исключены _archive, coverage, node_modules, snapshots, *-before-*.',
  'файлов проверено: ' + scope.length + ' | > 500 строк: ' + big.length,
  '| путь | строк |',
  '|---|---|',
  ...big.map((f) => '| `' + f[0] + '` | ' + f[1] + ' |')
].join('\n');
console.log(out);
fs.writeFileSync('09-Docs/out-dev-factory/runs/report-v14-20261017/files500.txt', out + '\n');
