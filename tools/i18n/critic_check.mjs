// critic_check.mjs — validates i18n-review raw review JSON (TZ §30 + №20 ред. 16.10 §73).
// Usage:
//   node tools/i18n/critic_check.mjs [dir]                 — validate every non-draft file
//   node tools/i18n/critic_check.mjs --gate <lang> [dir]    — exit 0 only if the latest analyst
//                                                            round for <lang> has score >= 8 AND
//                                                            input_sha256 == sha256(<lang>.json)
// Rejects: placeholder models, empty session, finished_at not matching file mtime (±5 min),
//          missing log (critic-A / analyst), A/B same-round collisions.
// Analyst files additionally require a matching sha256 row in ANALYST-LEDGER.md (proves the file
// was written by the analyst, not edited afterwards). critic-A / critic-B round >= 5 are rejected
// (№20 16.10: the only reviewer is the analyst). *-draft.json files are skipped (not counted).
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const PLACEHOLDER = /^(agent-run-.+|A|B|model|unknown|qfmodel|qoder-hvless|UNATTESTED)$/i;
const TOL_MS = 5 * 60 * 1000;
const LEDGER_REL = path.join('09-Docs', 'i18n-review', 'ANALYST-LEDGER.md');
const SCHEMAS = new Set(['igs-critic/1', 'critic/1']);
const AXES = ['meaning', 'glossary', 'register', 'length', 'errors'];

function sha256File(p) { return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }

function parseLedger(ledgerPath) {
  const map = new Map();
  if (!fs.existsSync(ledgerPath)) return map;
  for (const line of fs.readFileSync(ledgerPath, 'utf8').split(/\r?\n/)) {
    const parts = line.split('|').map((s) => s.trim());
    if (parts.length < 2) continue;
    const file = parts[0].replace(/^.*[\\/]/, '');            // basename
    const sha = (parts[1] || '').toLowerCase();
    if (/\.json$/i.test(file) && /^[0-9a-f]{64}$/.test(sha)) map.set(file, sha);
  }
  return map;
}

// Read + validate all files in dir. Returns { files, drafts, models, entries, errors }.
export function loadAndValidate(dir, ledgerPath = LEDGER_REL) {
  const errors = [];
  const models = new Set();
  const draftsList = [];
  const entries = [];
  const ledger = parseLedger(ledgerPath);
  const sessionsByRound = {};

  if (!fs.existsSync(dir)) return { files: 0, drafts: 0, models, entries, errors: ['нет папки ' + dir] };
  const all = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const drafts = all.filter((f) => f.endsWith('-draft.json'));
  const files = all.filter((f) => !f.endsWith('-draft.json'));
  drafts.forEach((f) => draftsList.push(f));

  for (const f of files) {
    const full = path.join(dir, f);
    let d;
    try { d = JSON.parse(fs.readFileSync(full, 'utf8')); }
    catch (e) { errors.push(f + ': не читается как JSON (' + e.message + ')'); continue; }
    const role = d.role;
    const isAnalyst = role === 'analyst';
    const isB = role === 'critic-B';

    for (const k of ['schema', 'role', 'model', 'session_id', 'round', 'langs', 'started_at', 'finished_at']) {
      if (d[k] === undefined) errors.push(f + ': нет поля ' + k);
    }
    // №20 (16.10): critic-A / critic-B round >= 5 is not allowed — analyst only.
    if ((role === 'critic-A' || role === 'critic-B') && Number(d.round) >= 5) {
      errors.push(f + ': ' + role + ' круга ' + d.round + ' запрещён — по №20 (16.10) критик только analyst');
    }
    if (!SCHEMAS.has(d.schema)) errors.push(f + ': schema "' + d.schema + '" вне ' + [...SCHEMAS].join('/'));
    if (!d.model || PLACEHOLDER.test(String(d.model))) errors.push(f + ': модель-заглушка "' + d.model + '"');
    else models.add(d.model);
    if (!d.session_id) errors.push(f + ': пустой session_id');

    const st = fs.statSync(full);
    const fin = Date.parse(d.finished_at), start = Date.parse(d.started_at);
    if (!(fin > start)) errors.push(f + ': finished_at не позже started_at');
    if (isFinite(fin) && Math.abs(fin - st.mtimeMs) > TOL_MS) errors.push(f + ': finished_at расходится с временем файла > 5 мин');

    // log required for critic-A and analyst (critic-B optional).
    if (!isB) {
      if (!d.log) errors.push(f + ': ' + role + ' без поля log');
      else {
        const logPath = path.join('09-Docs', 'out-dev-factory', d.log);
        if (!fs.existsSync(logPath) && !fs.existsSync(path.resolve(d.log))) errors.push(f + ': log-файл не найден: ' + d.log);
      }
    }
    // analyst integrity: sha256 of the file must be recorded in the ledger by the analyst.
    if (isAnalyst) {
      const cur = sha256File(full);
      const rec = ledger.get(f);
      if (!rec) errors.push(f + ': файла аналитика нет в ANALYST-LEDGER.md (нельзя подтвердить автора)');
      else if (rec !== cur) errors.push(f + ': файл аналитика изменён не аналитиком (sha не совпадает с журналом)');
    }

    for (const L of (d.langs || [])) {
      const ax = L.axes || {};
      const vals = AXES.map((k) => ax[k]);
      if (vals.some((v) => typeof v !== 'number')) { errors.push(f + ': ось не число в ' + L.code); continue; }
      const mean = vals.reduce((a, b) => a + b, 0) / 5;
      if (Math.abs(mean - L.score) > 0.06) errors.push(f + ': score ' + L.score + ' != среднее осей ' + mean.toFixed(2) + ' (' + L.code + ')');
      const key = d.round + '|' + L.code;
      (sessionsByRound[key] = sessionsByRound[key] || []).push({ role, session_id: d.session_id, model: d.model, file: f });
    }
    entries.push({ file: f, full, d });
  }

  // A/B same-round cross checks — NOT applied to analyst (№20 p2).
  for (const [key, arr] of Object.entries(sessionsByRound)) {
    const A = arr.filter((x) => x.role === 'critic-A');
    const B = arr.filter((x) => x.role === 'critic-B');
    for (const a of A) for (const b of B) {
      if (a.session_id && a.session_id === b.session_id) errors.push('круг ' + key + ': A и B один session_id');
      if (a.model && a.model === b.model) errors.push('круг ' + key + ': A и B одна модель ' + a.model + ' (нужен different model или same_model_role_split)');
    }
  }
  return { files: files.length, drafts: drafts.length, models, entries, errors };
}

function inputShaFor(d, lang) {
  const s = d.input_sha256;
  if (typeof s === 'string') return s.toLowerCase();
  if (s && typeof s === 'object') {
    if (s[lang]) return String(s[lang]).toLowerCase();
    if (s[lang + '.json']) return String(s[lang + '.json']).toLowerCase();
    for (const k of Object.keys(s)) if (k.replace(/\.json$/, '') === lang) return String(s[k]).toLowerCase();
  }
  return '';
}

// --gate <lang>: latest analyst round for lang, score >= 8 and fresh dictionary sha.
export function gateLang(dir, lang, { ledgerPath = LEDGER_REL, dictPath } = {}) {
  dictPath = dictPath || path.join('.04-Src', 'i18n', lang + '.json');
  if (!fs.existsSync(dictPath)) return { ok: false, reason: 'нет словаря ' + dictPath };
  const res = loadAndValidate(dir, ledgerPath);
  const cur = sha256File(dictPath);
  const analystForLang = res.entries
    .filter((e) => e.d.role === 'analyst' && (e.d.langs || []).some((L) => L.code === lang))
    .sort((a, b) => Number(b.d.round) - Number(a.d.round));
  if (!analystForLang.length) return { ok: false, reason: 'оценки аналитика для ' + lang + ' нет', integrityErrors: res.errors };
  const top = analystForLang[0];
  const round = Number(top.d.round);
  const score = (top.d.langs.find((L) => L.code === lang) || {}).score;
  if (res.errors.length) return { ok: false, reason: 'нарушения в файлах рецензентов: ' + res.errors[0], round, score };
  const inSha = inputShaFor(top.d, lang);
  if (!inSha) return { ok: false, reason: 'в файле аналитика нет input_sha256 для ' + lang, round, score };
  if (inSha !== cur) return { ok: false, reason: 'словарь изменён после оценки (sha не совпадает)', round, score };
  if (!(typeof score === 'number' && score >= 8)) return { ok: false, reason: 'оценка ' + score + ' ниже порога 8', round, score };
  return { ok: true, reason: 'OK круг ' + round + ' score ' + score, round, score };
}

// ---------- CLI ----------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const gateIdx = args.indexOf('--gate');
  if (gateIdx >= 0) {
    const lang = args[gateIdx + 1];
    const dir = args.filter((_, i) => i !== gateIdx && i !== gateIdx + 1 && !_.startsWith('--')).pop()
      || path.join('09-Docs', 'i18n-review', 'raw');
    if (!lang) { console.error('usage: critic_check.mjs --gate <lang> [dir]'); process.exit(2); }
    const g = gateLang(dir, lang);
    console.log('gate ' + lang + ': ' + (g.ok ? 'PASS' : 'FAIL') + ' — ' + g.reason);
    process.exit(g.ok ? 0 : 1);
  } else {
    const dir = args[0] || path.join('09-Docs', 'i18n-review', 'raw');
    const res = loadAndValidate(dir);
    console.log('critic_check: проверено=' + res.files + ' черновиков(не засчитано)=' + res.drafts + ' моделей=' + res.models.size);
    if (res.errors.length) {
      for (const e of res.errors) console.log('  REJECT ' + e);
      console.log('FAIL files=' + res.files + ' errors=' + res.errors.length);
      process.exit(1);
    }
    console.log('OK files=' + res.files + ' models=' + res.models.size);
    process.exit(0);
  }
}
