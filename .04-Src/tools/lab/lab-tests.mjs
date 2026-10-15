// lab-tests.mjs — §49.2: страница тестов из results-*.json. Чисел руками нет.
import fs from 'fs';
import path from 'path';

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Читает 09-Docs/test-runs → {latest, history[]}
export function loadRuns(runsDir) {
  if (!fs.existsSync(runsDir)) return { latest: null, history: [] };
  const files = fs.readdirSync(runsDir)
    .filter((f) => /^results-\d{8}-\d{4}\.json$/.test(f))
    .sort()
    .reverse();
  const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
  const runs = [];
  for (const f of files.slice(0, 20)) {
    try { runs.push(readJson(path.join(runsDir, f))); } catch (e) {}
  }
  let latest = null;
  const lf = path.join(runsDir, 'results-latest.json');
  if (fs.existsSync(lf)) {
    try { latest = readJson(lf); } catch (e) {}
  }
  if (!latest && runs.length) latest = runs[0];
  return { latest, history: runs };
}

export function testsPage(runsDir) {
  const { latest, history } = loadRuns(runsDir);
  if (!latest) {
    return '<p>нет данных: прогонов ещё не было. Запустите <code>npm run test:all</code>.</p>';
  }
  const t = latest.totals || { pass: 0, fail: 0, skipped: 0, total: 0 };
  const okAll = t.fail === 0;
  let h = '';
  // --- шапка ---
  h += '<div class="card" style="border-left:6px solid ' + (okAll ? '#3c6' : '#f55') + '">'
    + '<b>Прогон ' + esc(latest.run_id) + '</b> · ' + esc(latest.finished_at || latest.started_at)
    + ' · коммит <code>' + esc(latest.commit) + '</code> · ветка <code>' + esc(latest.branch) + '</code><br>'
    + 'прошло <b style="color:#3c6">' + t.pass + '</b> · упало <b style="color:' + (t.fail ? '#f55' : 'inherit') + '">' + t.fail + '</b>'
    + ' · пропущено ' + t.skipped + ' · всего ' + t.total + '</div>';
  // --- наборы ---
  h += '<div class="card"><b>Наборы</b><div id="suites">';
  for (const s of latest.suites || []) {
    const bad = s.totals.fail > 0 || (s.exit_code !== null && s.exit_code !== 0 && s.totals.pass === 0);
    h += '<div style="border:1px solid #2a3558;border-radius:6px;padding:8px;margin:6px 0;' + (bad ? 'border-color:#f55' : '') + '">'
      + '<b>' + esc(s.name) + '</b> <code>' + esc(s.id) + '</code> — '
      + 'pass ' + s.totals.pass + ' / fail ' + s.totals.fail + ' / skip ' + s.totals.skipped
      + ' · exit ' + (s.exit_code === null ? '—' : s.exit_code) + ' · ' + s.ms + ' ms'
      + ' · <a href="../../' + esc(s.log) + '">лог</a></div>';
  }
  h += '</div></div>';
  // --- фильтры + таблица ---
  h += '<div class="card"><b>Тесты</b><div style="margin:8px 0;display:flex;gap:8px;flex-wrap:wrap">'
    + '<select id="fStatus"><option value="">все статусы</option><option value="fail">упавшие</option><option value="pass">прошедшие</option><option value="skipped">пропущенные</option></select>'
    + '<select id="fSuite"><option value="">все наборы</option>'
    + (latest.suites || []).map((s) => '<option>' + esc(s.id) + '</option>').join('') + '</select>'
    + '<input id="fText" placeholder="поиск по названию" style="flex:1;min-width:120px;background:#0a0e1c;color:var(--text);border:1px solid #2a3558;padding:4px 8px"></div>'
    + '<div style="overflow-x:auto"><table id="tt"><tr><th>набор</th><th>файл</th><th>тест</th><th>статус</th><th>ms</th></tr>';
  const rows = [];
  for (const s of latest.suites || []) {
    for (const tt of s.tests || []) rows.push({ suite: s.id, ...tt });
  }
  rows.sort((a, b) => (a.status === 'fail' ? -1 : 0) - (b.status === 'fail' ? -1 : 0));
  for (const r of rows) {
    const col = r.status === 'fail' ? '#f55' : (r.status === 'skipped' ? '#fa4' : '#3c6');
    h += '<tr data-s="' + esc(r.status) + '" data-suite="' + esc(r.suite) + '" data-t="' + esc((r.title || '').toLowerCase()) + '">'
      + '<td>' + esc(r.suite) + '</td><td>' + esc(r.file) + '</td><td>' + esc(r.title)
      + (r.error_first_line ? '<br><code style="color:#f88">' + esc(r.error_first_line) + '</code>' : '')
      + '</td><td style="color:' + col + '">' + esc(r.status) + '</td><td>' + Math.round(r.ms || 0) + '</td></tr>';
  }
  h += '</table></div></div>';
  // --- история ---
  h += '<div class="card"><b>История (последние ' + history.length + ')</b><table><tr><th>прогон</th><th>время</th><th>коммит</th><th>pass/fail/skip</th></tr>';
  for (const r of history) {
    const rt = r.totals || {};
    h += '<tr><td><a href="../../09-Docs/test-runs/results-' + esc(r.run_id) + '.json">' + esc(r.run_id) + '</a></td>'
      + '<td>' + esc(r.finished_at || '') + '</td><td><code>' + esc(r.commit) + '</code></td>'
      + '<td>' + (rt.pass || 0) + ' / <span style="color:' + (rt.fail ? '#f55' : 'inherit') + '">' + (rt.fail || 0) + '</span> / ' + (rt.skipped || 0) + '</td></tr>';
  }
  h += '</table></div>';
  // --- скачать ---
  h += '<p><a href="../../09-Docs/test-runs/results-latest.json">results-latest.json</a>'
    + ' · <a href="../../09-Docs/test-runs/results-' + esc(latest.run_id) + '.json">results-' + esc(latest.run_id) + '.json</a></p>';
  // --- фильтры JS (offline, без внешних) ---
  h += '<script>(function(){var fs=document.getElementById("fStatus"),fu=document.getElementById("fSuite"),ft=document.getElementById("fText");'
    + 'function ap(){var sv=fs.value,uv=fu.value,tv=(ft.value||"").toLowerCase();'
    + 'document.querySelectorAll("#tt tr[data-s]").forEach(function(r){'
    + 'var ok=(!sv||r.dataset.s===sv)&&(!uv||r.dataset.suite===uv)&&(!tv||r.dataset.t.indexOf(tv)>=0);'
    + 'r.style.display=ok?"":"none";});}'
    + '[fs,fu,ft].forEach(function(e){e.oninput=ap;e.onchange=ap;});})();</script>';
  return h;
}
