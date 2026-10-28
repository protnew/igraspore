// Сборка отчёта v15 из скелета + свежих замеров.
// Запуск из корня: node 09-Docs/out-dev-factory/runs/v15-report-20261028/build.mjs
import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const RUNS = '09-Docs/out-dev-factory/runs';
const SKEL = path.join(RUNS, 'v15-report-20261028/skeleton.md');
const OUTDIR = '01-Architecture/03-Analysis';
const LOGS = '09-Docs/out-dev-factory/logs-release-ready-2026-10-14';

const sh = (c) => cp.execSync(c, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const run = (c) => { try { return { out: sh(c + ' 2>&1').trim(), code: 0 }; } catch (e) { return { out: String(e.stdout || e.message).trim(), code: e.status || 1 }; } };
const last = (s) => s.split('\n').filter((x) => x.trim()).slice(-1)[0] || '';

const d3 = new Date(Date.now() + 3 * 3600 * 1000);
const p2 = (n) => String(n).padStart(2, '0');
const TS = '' + d3.getUTCFullYear() + p2(d3.getUTCMonth() + 1) + p2(d3.getUTCDate()) + '-' + p2(d3.getUTCHours()) + p2(d3.getUTCMinutes());
const HHMM = p2(d3.getUTCHours()) + ':' + p2(d3.getUTCMinutes());
const DDMM = p2(d3.getUTCDate()) + '.' + p2(d3.getUTCMonth() + 1);
const NAME = 'REPORT-TZ-08-SPOR-release-ready-20261017-0905-v15-' + TS + '.md';
const RPATH = path.resolve(OUTDIR) + '\\' + NAME;

// --- dirty ---
const dirty = sh('git status --porcelain').split('\n').filter((x) => x.trim());
fs.writeFileSync(path.join(LOGS, 'dirty-' + TS + '.txt'), dirty.join('\n') + '\n');
const MINE_RX = /^(\.04-Src[\\/](qa-playwright[\\/]|07-QA-and-Testing[\\/](contract-results\.json|test-results-contract)|i18n[\\/])|tools[\\/](i18n[\\/]i18n_coverage\.mjs|serve-up\.ps1|store_shots\.mjs|verify_report)|09-Docs[\\/](test-runs[\\/]|store-listing[\\/]shots[\\/]fil|out-dev-factory[\\/](runs[\\/]|PROOFS-G|FOUND_BUGS))|01-Architecture[\\/]03-Analysis[\\/]((REPORT|SCREENSHOTS)-TZ-08-SPOR-release-ready-20261017-0905-v15-))|\.10-Archive/;
const MINE = dirty.filter((l) => MINE_RX.test(l.slice(3))).length;

// --- прогоны ---
const DO = JSON.parse(fs.readFileSync('09-Docs/test-runs/results-20261028-1612.json', 'utf8'));
const files = fs.readdirSync('09-Docs/test-runs').filter((f) => /^results-2\d{7}-\d{4}\.json$/.test(f)).sort();
const POSSIBLE = files.filter((f) => f > 'results-20261028-1612.json');
const POSLE_FILE = POSSIBLE[POSSIBLE.length - 1];
if (!POSLE_FILE) { console.error('Нет файла «после» — сначала X6'); process.exit(2); }
const POSLE = JSON.parse(fs.readFileSync('09-Docs/test-runs/' + POSLE_FILE, 'utf8'));
const POSLE_TS = POSLE_FILE.match(/results-(\d{8}-\d{4})/)[1];
const suite = (j, re) => (j.suites || []).find((s) => re.test(s.name)) || { tests: [], exit_code: '-' };
const cnt = (s) => { const t = s.tests || []; return t.filter((x) => x.status === 'pass').length + ' pass / ' + t.filter((x) => x.status !== 'pass' && x.status !== 'skipped').length + ' fail (exit=' + s.exit_code + ')'; };
const NAMES = [['Vitest unit', /vitest/i], ['QA unit', /qa.?unit/i], ['Playwright e2e', /playwright e2e/i], ['Playwright v20 acceptance', /v20/i], ['i18n checks', /i18n/i], ['Report verify', /report/i], ['AAB signature', /aab/i]];
const rowsT = NAMES.map(([label, re]) => {
  const a = suite(DO, re), b = suite(POSLE, re);
  const fa = (a.tests || []).filter((t) => t.status !== 'pass' && t.status !== 'skipped').length;
  const fb = (b.tests || []).filter((t) => t.status !== 'pass' && t.status !== 'skipped').length;
  return '| ' + label + ' | ' + cnt(a) + ' | ' + cnt(b) + ' | ' + (fb > fa ? 'было красно, стало ещё краснее' : (fb < fa ? 'починено' : (fb === 0 ? 'нет' : 'осталось')) ) + ' |';
});
rowsT.push('| **ИТОГО** | ' + DO.totals.pass + ' pass / ' + DO.totals.fail + ' fail из ' + DO.totals.total + ' | ' + POSLE.totals.pass + ' pass / ' + POSLE.totals.fail + ' fail из ' + POSLE.totals.total + ' | — |');
const fails = [];
for (const s of POSLE.suites || []) for (const t of (s.tests || [])) if (t.status !== 'pass' && t.status !== 'skipped') fails.push('| ' + s.name + ' | `' + (t.file || '') + '` | ' + String(t.title || t.id).replace(/\|/g, '/').slice(0, 150) + ' |');
if (!fails.length) fails.push('| — | — | красных строк нет |');

// --- гейты, языки ---
const gates = ['es', 'tr', 'fil'].map((L) => { const r = run('node tools/i18n/critic_check.mjs --gate ' + L); return '| `node tools\\i18n\\critic_check.mjs --gate ' + L + '` | ' + last(r.out) + ' | ' + r.code + ' |'; });
run('node .04-Src/qa-playwright/report_langs.mjs > ' + path.join(RUNS, 'v15-report-20261028/langs.txt') + ' 2>&1');
const langs = fs.readFileSync(path.join(RUNS, 'v15-report-20261028/langs.txt'), 'utf8').split('\n').filter((x) => x.trim());
const langsBody = langs.slice(1).filter((x) => !x.startsWith('ИТОГО')).map((l) => l.split(' | ').slice(0, 7).join(' | '));
const langsTotal = langs.find((x) => x.startsWith('ИТОГО')) || '';

// --- X5 (AAB) ---
let aab = { status: 'не выполнен', sha256: '—', size: '—', verified: '—', android: '—', built: '—' };
const aabPath = path.join(RUNS, 'v15-x5-20261028/aab.json');
if (fs.existsSync(aabPath)) aab = JSON.parse(fs.readFileSync(aabPath, 'utf8').replace(/^\uFEFF/, ''));

// --- коммиты хода ---
const commits = run('git log --oneline --since=2026-10-28T16:10:00 --format="| %h | %s |" | head -20').out;

// --- сборка ---
let out = fs.readFileSync(SKEL, 'utf8');
const REP = {
  '{{TS}}': TS, '{{HHMM}}': HHMM, '{{DDMM}}': DDMM, '{{NAME}}': NAME, '{{REPORT_PATH}}': RPATH,
  '{{HEAD}}': sh('git rev-parse --short HEAD').trim(),
  '{{N}}': String(dirty.length), '{{MINE}}': String(MINE), '{{WIP}}': String(dirty.length - MINE), '{{DIRTYTS}}': TS,
  '{{DO_TOT}}': DO.totals.pass + ' pass / ' + DO.totals.fail + ' fail из ' + DO.totals.total,
  '{{POSLE_TOT}}': POSLE.totals.pass + ' pass / ' + POSLE.totals.fail + ' fail из ' + POSLE.totals.total,
  '{{DO_TS}}': '20261028-1612', '{{POSLE_TS}}': POSLE_TS,
  '{{RUNTABLE}}': rowsT.join('\n'), '{{RUNFAILS}}': fails.join('\n'),
  '{{GATES}}': gates.join('\n'), '{{LANGS_TABLE}}': langsBody.join('\n'), '{{LANGS_TOTAL}}': langsTotal,
  '{{AAB_SHORT}}': aab.sha256 === '—' ? aab.status : 'sha256 ' + String(aab.sha256).slice(0, 16) + '…, ' + aab.size + ', ' + aab.verified,
  '{{X5_STATUS}}': aab.status, '{{X5_PROOF}}': aab.proof || '—',
  '{{B_DONE}}': '28.10',
  '{{COMMITS}}': commits
};
for (const [k, v] of Object.entries(REP)) out = out.split(k).join(v);
const left = (out.match(/\{\{[A-Z0-9_]+\}\}/g) || []).filter((k) => k !== '{{VERIFY_LINE}}');
if (left) console.log('ВНИМАНИЕ, непоставленные метки:', [...new Set(left)].join(', '));
fs.writeFileSync(path.join(OUTDIR, NAME), out);
const SHOTS = 'SCREENSHOTS-TZ-08-SPOR-release-ready-20261017-0905-v15-' + TS + '.md';
const shotsSkel = path.join(RUNS, 'v15-report-20261028/skeleton-shots.md');
if (fs.existsSync(shotsSkel)) fs.writeFileSync(path.join(OUTDIR, SHOTS), fs.readFileSync(shotsSkel, 'utf8').split('{{HHMM}}').join(HHMM));
console.log('снимки-указатель:', path.join(OUTDIR, SHOTS));
console.log('отчёт:', RPATH, out.split('\n').length, 'строк');
console.log('после:', POSLE_FILE, JSON.stringify(POSLE.totals));
console.log('dirty:', dirty.length, 'мои', MINE, 'чужой', dirty.length - MINE);

// --- второй проход: проверка и вписывание вердикта ---
const v1 = run('powershell -NoProfile -ExecutionPolicy Bypass -File tools/verify_report.ps1 -Report "' + RPATH + '"');
const verdict = last(v1.out);
console.log('verify:', verdict);
if (/VERIFY OK/.test(verdict)) {
  let t = fs.readFileSync(path.join(OUTDIR, NAME), 'utf8').split('{{VERIFY_LINE}}').join(verdict);
  fs.writeFileSync(path.join(OUTDIR, NAME), t);
  const v2 = run('powershell -NoProfile -ExecutionPolicy Bypass -File tools/verify_report.ps1 -Report "' + RPATH + '"');
  console.log('verify после вписывания:', last(v2.out));
} else {
  console.log('ПРОВЕРКА НЕ ЗЕЛЁНАЯ — разбираюсь, вердикт не вписываю');
  console.log(v1.out.split('\n').filter((l) => /^FAIL/.test(l)).join('\n'));
}
