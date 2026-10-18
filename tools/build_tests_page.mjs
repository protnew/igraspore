// Собирает вкладку «Тесты» из results-*.json.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function loadRuns(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (!/^results-.*\.json$/i.test(name) || name === 'results-latest.json') continue;
    const full = path.join(dir, name);
    let data;
    try { data = JSON.parse(fs.readFileSync(full, 'utf8')); }
    catch { out.push({ broken: name }); continue; }
    if (!data || typeof data !== 'object' || !data.totals) { out.push({ broken: name }); continue; }
    data._file = name;
    out.push(data);
  }
  out.sort((a, b) => String(b.started_at || b._file || '').localeCompare(String(a.started_at || a._file || '')));
  return out;
}

function shotLinks() {
  const base = path.join(ROOT, '09-Docs', 'out-dev-factory');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^(ACCEPT-|shots-)/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse()
    .slice(0, 40);
}

function asList(x) {
  if (Array.isArray(x)) return x;
  if (x && typeof x === 'object') return Object.values(x);
  return [];
}

function testRows(run) {
  const rows = [];
  for (const suite of asList(run.suites)) {
    for (const t of asList(suite.tests)) {
      const st = t.status || 'unknown';
      const err = t.error_first_line || '';
      rows.push(`<tr class="${esc(st)}"><td>${esc(st)}</td><td>${esc(t.file || suite.name || '')}</td><td>${esc(t.title || t.id || '')}</td><td>${esc(err)}</td></tr>`);
    }
  }
  return rows.join('\n');
}

export function render(runs, shots) {
  const blocks = runs.length ? runs.map((run) => {
    if (run.broken) return `<section class="card"><h2>повреждён: ${esc(run.broken)}</h2></section>`;
    const tot = run.totals || {};
    const head = `${esc(run.started_at || run._file)} · коммит ${esc(run.commit || '—')} · dirty ${esc(run.dirty_count ?? '—')} · ${esc(tot.pass ?? 0)}/${esc(tot.total ?? 0)} pass, fail ${esc(tot.fail ?? 0)}`;
    return `<section class="card"><details open><summary>${head}</summary><table><thead><tr><th>статус</th><th>файл</th><th>тест</th><th>ошибка</th></tr></thead><tbody>${testRows(run)}</tbody></table></details></section>`;
  }).join('\n') : '<p>нет прогонов</p>';
  const shotHtml = (shots || []).map((name) => `<li><a href="http://127.0.0.1:8795/09-Docs/out-dev-factory/${esc(name)}/">${esc(name)}</a></li>`).join('');
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Тесты — iGraSpore</title><style>:root{--bg:#0c1020;--panel:#161d33;--link:#7ab8ff;--text:#e8eefc}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.45 system-ui,sans-serif}header{display:flex;gap:12px;flex-wrap:wrap;padding:12px 16px;background:#101628;position:sticky;top:0}a{color:var(--link)}main{padding:16px;max-width:1100px}table{border-collapse:collapse;width:100%;background:var(--panel)}td,th{border:1px solid #2a3558;padding:6px 8px;vertical-align:top}tr.fail td{background:#3a1420}tr.pass td{background:#102818}.card{background:var(--panel);padding:12px;margin:12px 0;border-radius:8px}summary{cursor:pointer}</style></head><body><header><a href="index.html">Оглавление</a><a href="tests.html">Тесты</a><a href="languages.html">Языки</a></header><main><h1>Тесты</h1><p>Ручная проверка игры: <a href="http://127.0.0.1:8795/?lang=en">http://127.0.0.1:8795/?lang=en</a></p><h2>Снимки</h2><ul>${shotHtml}</ul>${blocks}</main></body></html>`;
}

function selftest() {
  const osDir = fs.mkdtempSync(path.join(os.tmpdir(), 'igs-tests-page-'));
  const empty = render(loadRuns(osDir), []);
  fs.writeFileSync(path.join(osDir, 'results-bad.json'), '{', 'utf8');
  fs.writeFileSync(path.join(osDir, 'results-20261018-1200.json'), JSON.stringify({
    schema: 'igs-test-run/1', started_at: '2026-10-18 12:00 UTC+3', commit: 'abc', dirty_count: 1,
    totals: { pass: 1, fail: 1, total: 2 },
    suites: [{ name: 'demo', tests: [{ status: 'pass', file: 'a.js', title: 'ok' }, { status: 'fail', file: 'b.js', title: 'bad', error_first_line: 'boom' }] }]
  }));
  const runs = loadRuns(osDir);
  const html = render(runs, ['ACCEPT-v17-demo']);
  const ok = empty.includes('нет прогонов') && html.includes('повреждён: results-bad.json') && html.includes('boom') && html.includes('bad');
  fs.rmSync(osDir, { recursive: true, force: true });
  if (!ok) { console.error('SELFTEST FAIL'); process.exit(1); }
  console.log('SELFTEST PASS');
}

function main() {
  if (process.argv.includes('--selftest')) { selftest(); return; }
  const dir = path.join(ROOT, '09-Docs', 'test-runs');
  const out = path.join(ROOT, '.04-Src', 'dist-lab', 'lab', 'tests.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = render(loadRuns(dir), shotLinks());
  fs.writeFileSync(out, html, 'utf8');
  console.log('tests.html', out, 'bytes', Buffer.byteLength(html));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
