// Сборка отчёта v14 из скелета + свежих замеров. Запуск из корня:
//   node .04-Src/qa-playwright/build_report.mjs
// Пишет REPORT-…-v14-<ГГГГММДД-ЧЧММ>.md и SCREENSHOTS-… в 01-Architecture\03-Analysis, dirty-лист в логи.
import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RUNS = '09-Docs/out-dev-factory/runs/report-v14-20261017';
const OUTDIR = '01-Architecture/03-Analysis';
const LOGS = '09-Docs/out-dev-factory/logs-release-ready-2026-10-14';

const sh = (cmd) => cp.execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const DRY = process.argv.includes('--dry');   // --dry: писать в runs/, не трогая 01-Architecture
if (DRY) console.log('РЕЖИМ --dry: отчёт пойдёт в ' + RUNS + ', dirty-лист не пишется');
const run = (cmd) => { try { const o = sh(cmd + ' 2>&1'); return { out: o.trim(), code: 0 }; } catch (e) { return { out: String(e.stdout || e.message).trim(), code: e.status || 1 }; } };
const last = (s) => s.split('\n').filter(x => x.trim()).slice(-1)[0] || '';

const d3 = new Date(Date.now() + 3 * 3600 * 1000);
const pad = (n) => String(n).padStart(2, '0');
const TS = d3.getUTCFullYear() + pad(d3.getUTCMonth() + 1) + pad(d3.getUTCDate()) + '-' + pad(d3.getUTCHours()) + pad(d3.getUTCMinutes());
const HHMM = pad(d3.getUTCHours()) + ':' + pad(d3.getUTCMinutes());
const DDMM = pad(d3.getUTCDate()) + '.' + pad(d3.getUTCMonth() + 1);
const NAME = 'REPORT-TZ-08-SPOR-release-ready-20261017-0905-v14-' + TS + '.md';
const RPATH = path.resolve(OUTDIR) + '\\' + NAME;
const SHOTS = 'SCREENSHOTS-TZ-08-SPOR-release-ready-20261017-0905-v14-' + TS + '.md';

// --- dirty-лист ---
const dirty = sh('git status --porcelain').split('\n').filter(x => x.trim());
if (!DRY) fs.writeFileSync(path.join(LOGS, 'dirty-' + TS + '.txt'), dirty.join('\n') + '\n');
const MINE_RX = /^(\.04-Src[\\/](qa-playwright[\\/]|07-QA-and-Testing[\\/](contract-results\.json|test-results-contract)|i18n[\\/])|tools[\\/]verify_report\.fixtures[\\/]run[\\/]|09-Docs[\\/](test-runs[\\/]|i18n-review[\\/](store-listing-round3|\w+-round8)|store-listing[\\/])|01-Architecture[\\/]03-Analysis[\\/]((REPORT|SCREENSHOTS)-TZ-08-SPOR-release-ready-20261017-0905-v14-)|\.10-Archive[\\/](u47-split|w1-tr-wiki|i18n-before-round8)|09-Docs[\\/]out-dev-factory[\\/](runs[\\/]|09a|PROOFS-G))/;
const MINE = dirty.filter(l => MINE_RX.test(l.slice(3))).length;
const WIP = dirty.length - MINE;

// --- прогоны «до» и «после» ---
const DO = JSON.parse(fs.readFileSync('09-Docs/test-runs/results-20261017-0910.json', 'utf8'));
const files = fs.readdirSync('09-Docs/test-runs').filter(f => /^results-\d{8}-\d{4}\.json$/.test(f)).sort();
const POSLE_FILE = files[files.length - 1];
const POSLE = JSON.parse(fs.readFileSync('09-Docs/test-runs/' + POSLE_FILE, 'utf8'));
const POSLE_TS = POSLE_FILE.match(/results-(\d{8}-\d{4})/)[1];
const POSLE_HHMM = POSLE_TS.slice(9, 11) + ':' + POSLE_TS.slice(11, 13);
const suite = (j, re) => (j.suites || []).find(s => re.test(s.name)) || { name: 'НЕТ СУИТА ' + re, tests: [], exit_code: '-' };
const cnt = (s) => { const t = s.tests || []; return 'pass=' + t.filter(x => x.status === 'pass').length + ' fail=' + t.filter(x => x.status !== 'pass' && x.status !== 'skipped').length + ' exit=' + s.exit_code; };
const NAMES = [['Vitest unit', /vitest/i], ['QA unit', /qa.?unit/i], ['Playwright e2e', /playwright/i], ['i18n checks', /i18n/i], ['Report verify', /report/i], ['AAB signature', /aab/i]];
const rowsT = NAMES.map(([label, re]) => {
  const a = suite(DO, re), b = suite(POSLE, re);
  const fa = (a.tests || []).filter(t => t.status !== 'pass' && t.status !== 'skipped').length;
  const fb = (b.tests || []).filter(t => t.status !== 'pass' && t.status !== 'skipped').length;
  const reg = fa === 0 && fb > 0 ? 'да' : (fb > fa ? 'частично' : 'нет');
  return '| ' + label + ' | ' + cnt(a) + ' | ' + cnt(b) + ' | ' + reg + ' |';
});
rowsT.push('| **ИТОГО (все наборы)** | ' + DO.totals.pass + ' pass / ' + DO.totals.fail + ' fail из ' + DO.totals.total +
  ' | ' + POSLE.totals.pass + ' pass / ' + POSLE.totals.fail + ' fail из ' + POSLE.totals.total +
  ' | см. таблицу 9 |');
const fails = [];
for (const s of POSLE.suites || []) for (const t of (s.tests || [])) if (t.status !== 'pass' && t.status !== 'skipped') fails.push('| ' + s.name + ' | `' + (t.file || '') + '` | ' + String(t.title || t.id).replace(/\|/g, '/') + ' |');
if (!fails.length) fails.push('| — | — | красных строк нет |');

// --- гейты и быстрые проверки ---
const gateRows = ['es', 'tr', 'fil'].map(L => {
  const r = run('node tools/i18n/critic_check.mjs --gate ' + L);
  return '| `node tools\\i18n\\critic_check.mjs --gate ' + L + '` | ' + last(r.out) + ' | ' + r.code + ' |';
});
const cc = run('node tools/i18n/critic_check.mjs');
const sl = run('node tools/i18n/store_len.mjs');

// --- таблицы из замеров ---
const langs = fs.readFileSync(path.join(RUNS, 'langs.txt'), 'utf8').split('\n').filter(x => x.trim());
const langsBody = langs.slice(1).filter(x => !x.startsWith('ИТОГО'));
const langsTotal = langs.find(x => x.startsWith('ИТОГО')) || '';
const w1raw = fs.readFileSync(path.join(RUNS, 'w1-bylo-stalo.txt'), 'utf8').split('\n');
let w1 = '', k = 0;
for (const line of w1raw) {
  if (line.startsWith('### ')) {
    k++;
    w1 += '\n**Таблица 5.' + k + ' — ' + line.slice(4) + '**\n\n| ключ | было | стало |\n|---|---|---|\n';
  } else if (line.startsWith('| `')) w1 += line + '\n';
}
const w2 = fs.readFileSync(path.join(RUNS, 'w2-bylo-stalo.txt'), 'utf8').split('\n').filter(x => x.startsWith('|')).join('\n');

// --- AN.1 ---
const proofs = fs.readFileSync('09-Docs/out-dev-factory/PROOFS-G-2026-10-14.md', 'utf8').split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| Что') && !l.startsWith('|---'));
const cPass = proofs.filter(l => /PASS с логом|PASS порога/.test(l)).length;
const cNo = proofs.filter(l => /не подтверждено/.test(l)).length;
const an1 = 'PASS-строк с путём на диске — ' + cPass + ', снято в «не подтверждено» — ' + cNo + ' (всего строк в таблице ' + proofs.length + ')';
const an1d = 'Статусы: ' + cPass + ' PASS с путём (qa_unit.txt 26/26, buttons-before-pass1.json с G3 cyst=false и тостом «Проснулся из цисты», buttons-after/buttons.json с G3 cyst=true и G1 тостом про свет + снимки с sha из shots-manifest, гейты pt-BR/id/de/fr PASS exit 0), ' + cNo + ' — PASS vitest 14.10 снят, потому что отдельного лога 14.10 на диске нет (вместо него свежий замер 285/285 в results-20261017-0910.json). Строки «AAB не подписан», «es/hi/tr/ja не включены», «Пакет G сентябрь» PASS не ставили и не ставятся.';

let out = fs.readFileSync(path.join(RUNS, 'skeleton.md'), 'utf8');
const REP = {
  '{{HHMM}}': HHMM, '{{DDMM}}': DDMM, '{{TS}}': TS, '{{NAME}}': NAME, '{{REPORT_PATH}}': RPATH,
  '{{HEAD}}': sh('git rev-parse --short HEAD').trim(),
  '{{N}}': String(dirty.length), '{{MINE}}': String(MINE), '{{WIP}}': String(WIP), '{{DIRTYTS}}': TS,
  '{{DO_TOTAL}}': JSON.stringify(DO.totals), '{{POSLE_TOTAL}}': JSON.stringify(POSLE.totals),
  '{{POSLE_TS}}': POSLE_TS, '{{POSLE_HHMM}}': POSLE_HHMM,
  '{{RUNTABLE}}': rowsT.join('\n'), '{{RUNFAILS}}': fails.join('\n'),
  '{{LANGS_TABLE}}': langsBody.join('\n'), '{{LANGS_TOTAL}}': langsTotal,
  '{{GATES}}': gateRows.join('\n'), '{{STORELEN}}': last(sl.out) + ' (critic_check: ' + last(cc.out) + ')',
  '{{W1_TABLE}}': w1.trim(), '{{W2_TABLE}}': w2, '{{AN1}}': an1, '{{AN1_DETAIL}}': an1d,
  '{{DO_TOT}}': DO.totals.pass + ' pass / ' + DO.totals.fail + ' fail из ' + DO.totals.total,
  '{{POSLE_TOT}}': POSLE.totals.pass + ' pass / ' + POSLE.totals.fail + ' fail из ' + POSLE.totals.total
};
for (const [k2, v] of Object.entries(REP)) out = out.split(k2).join(v);
const left = out.match(/\{\{[A-Z0-9_]+\}\}/g);
if (left) console.log('ВНИМАНИЕ, непоставленные метки:', [...new Set(left)].join(', '));
const OUTDIR_REAL = DRY ? RUNS : OUTDIR;
fs.writeFileSync(path.join(OUTDIR_REAL, (DRY ? 'DRY-' : '') + NAME), out);

const shots = fs.readFileSync(path.join(RUNS, 'skeleton-shots.md'), 'utf8').split('{{HHMM}}').join(HHMM);
fs.writeFileSync(path.join(OUTDIR_REAL, (DRY ? 'DRY-' : '') + SHOTS), shots);

// --- сверка sha пакета круга 8 с диском ---
const sha = JSON.parse(fs.readFileSync('09-Docs/i18n-review/round8-input-sha.json', 'utf8'));
const dicts = sha.dicts || sha;
let badSha = 0;
for (const [key, val] of Object.entries(dicts)) {
  const p = '.04-Src/i18n/' + (key.startsWith('wiki/') ? key : key + '.json');
  if (crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') !== val) badSha++;
}
console.log('Отчёт:', RPATH, out.split('\n').length, 'строк');
console.log('Снимки:', SHOTS);
console.log('dirty: всего=' + dirty.length + ' мои=' + MINE + ' чужой=' + WIP + ' | round8 sha расхождений=' + badSha);
console.log('после: ' + POSLE_FILE + ' ' + JSON.stringify(POSLE.totals));
