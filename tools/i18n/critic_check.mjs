// critic_check.mjs — validates i18n-review raw critic JSON per TZ v9 §30.
// Usage: node tools/i18n/critic_check.mjs [dir]   (default 09-Docs/i18n-review/raw)
// Rejects: placeholder models, empty session, finished_at not matching file mtime (±5 min),
//          missing log (critic-A), A/B same-round same session or same model (unless split).
// *-draft.json files are skipped (reported as drafts, not counted).
// Exit 0 + "OK files=<n> models=<k>" when every non-draft file passes; exit 1 otherwise.
import fs from 'fs';
import path from 'path';

const dir = process.argv[2] || path.join('09-Docs', 'i18n-review', 'raw');
const PLACEHOLDER = /^(agent-run-.+|A|B|model|unknown|qfmodel|qoder-hvless|UNATTESTED)$/i;
const TOL_MS = 5 * 60 * 1000;

function fail(list, msg) { list.push(msg); }

if (!fs.existsSync(dir)) { console.error('нет папки ' + dir); process.exit(2); }
const all = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const drafts = all.filter((f) => f.endsWith('-draft.json'));
const files = all.filter((f) => !f.endsWith('-draft.json'));

const errors = [];
const sessionsByRound = {}; // key round|lang -> [{role, session_id, model}]
const models = new Set();

for (const f of files) {
  const full = path.join(dir, f);
  let d;
  try { d = JSON.parse(fs.readFileSync(full, 'utf8')); }
  catch (e) { fail(errors, f + ': не читается как JSON (' + e.message + ')'); continue; }
  const isB = d.role === 'critic-B';
  // required fields
  for (const k of ['schema','role','model','session_id','round','langs','started_at','finished_at']) {
    if (d[k] === undefined) fail(errors, f + ': нет поля ' + k);
  }
  if (d.schema !== 'igs-critic/1') fail(errors, f + ': schema != igs-critic/1');
  // model
  if (!d.model || PLACEHOLDER.test(String(d.model))) fail(errors, f + ': модель-заглушка "' + d.model + '"');
  else models.add(d.model);
  if (!d.session_id) fail(errors, f + ': пустой session_id');
  // time vs file mtime
  const st = fs.statSync(full);
  const fin = Date.parse(d.finished_at), start = Date.parse(d.started_at);
  if (!(fin > start)) fail(errors, f + ': finished_at не позже started_at');
  if (isFinite(fin) && Math.abs(fin - st.mtimeMs) > TOL_MS) fail(errors, f + ': finished_at расходится с временем файла > 5 мин');
  // log (critic-A required; critic-B optional)
  if (!isB) {
    if (!d.log) fail(errors, f + ': critic-A без поля log');
    else {
      const logPath = path.join('09-Docs', 'out-dev-factory', d.log);
      const alt = path.resolve(d.log);
      if (!fs.existsSync(logPath) && !fs.existsSync(alt)) fail(errors, f + ': log-файл не найден: ' + d.log);
    }
  }
  // score = mean of axes (sanity)
  for (const L of (d.langs || [])) {
    const ax = L.axes || {};
    const vals = ['meaning','glossary','register','length','errors'].map((k) => ax[k]);
    if (vals.some((v) => typeof v !== 'number')) { fail(errors, f + ': ось не число в ' + L.code); continue; }
    const mean = vals.reduce((a,b)=>a+b,0) / 5;
    if (Math.abs(mean - L.score) > 0.06) fail(errors, f + ': score ' + L.score + ' != среднее осей ' + mean.toFixed(2) + ' (' + L.code + ')');
    const key = d.round + '|' + L.code;
    (sessionsByRound[key] = sessionsByRound[key] || []).push({ role: d.role, session_id: d.session_id, model: d.model, file: f });
  }
}

// A/B same-round cross checks
for (const [key, arr] of Object.entries(sessionsByRound)) {
  const A = arr.filter((x) => x.role === 'critic-A');
  const B = arr.filter((x) => x.role === 'critic-B');
  for (const a of A) for (const b of B) {
    if (a.session_id && a.session_id === b.session_id) fail(errors, 'круг ' + key + ': A и B один session_id');
    if (a.model && a.model === b.model) fail(errors, 'круг ' + key + ': A и B одна модель ' + a.model + ' (нужен different model или same_model_role_split)');
  }
}

console.log('critic_check: проверено=' + files.length + ' черновиков(не засчитано)=' + drafts.length + ' моделей=' + models.size);
if (errors.length) {
  for (const e of errors) console.log('  REJECT ' + e);
  console.log('FAIL files=' + files.length + ' errors=' + errors.length);
  process.exit(1);
}
console.log('OK files=' + files.length + ' models=' + models.size);
process.exit(0);
