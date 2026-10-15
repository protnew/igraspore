// i18n_identity.mjs — TZ v9 §28: finds untranslated leftovers (value identical to en.json).
// Usage: node tools/i18n/i18n_identity.mjs --all | <lang> [<lang>...]
// A value equal to en (trim, case-insensitive) is a violation unless (key,value,lang) is in
// .04-Src/i18n/i18n_identity.allow.json with a legal category.
// Writes logs-release-ready-2026-10-14/i18n-identity-<ts>.json; exit 1 when violations>0.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const LOGDIR = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14');
// v9-ext: 'cognate' — родное слово языка совпадает с английским написанием (de Winter, fr Menu):
// подтверждено переводом, а не недоперевод. Отмечено в отчёте; владелец может ужесточить.
const CATEGORIES = new Set(['unit', 'abbr', 'brand', 'latin_species', 'number', 'code', 'cognate']);

const args = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'));
const skip = new Set(['en.json', 'languages.json', 'wave2-status.json', 'i18n_identity.allow.json']);
let langs;
if (args.includes('--all')) {
  langs = fs.readdirSync(I18N).filter((f) => f.endsWith('.json') && !skip.has(f)).map((f) => f.replace(/\.json$/, ''));
} else {
  langs = args.filter((a) => !a.startsWith('--'));
  if (!langs.length) { console.error('usage: node tools/i18n/i18n_identity.mjs --all | <lang>...'); process.exit(2); }
}

const allowPath = path.join(I18N, 'i18n_identity.allow.json');
const allow = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, 'utf8')) : [];
for (const a of allow) {
  if (!CATEGORIES.has(a.category)) { console.error('allow.json: bad category ' + a.category + ' for key ' + a.key); process.exit(2); }
  if (!a.key || a.value === undefined || !Array.isArray(a.langs)) { console.error('allow.json: bad entry ' + JSON.stringify(a)); process.exit(2); }
}
const allowHit = (key, val, lang) => allow.some((a) =>
  a.key === key && String(a.value).trim().toLowerCase() === String(val).trim().toLowerCase() &&
  (a.langs.includes('*') || a.langs.includes(lang)));

const out = {};
let bad = 0;
for (const lang of langs) {
  const f = path.join(I18N, lang + '.json');
  if (!fs.existsSync(f)) { out[lang] = { error: 'no file' }; bad++; continue; }
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const total = Object.keys(en).length;
  const identical = [], allowed = [], violations = [];
  for (const k of Object.keys(en)) {
    if (!(k in d)) continue;
    if (String(d[k]).trim().toLowerCase() === String(en[k]).trim().toLowerCase()) {
      identical.push(k);
      if (allowHit(k, d[k], lang)) allowed.push(k); else violations.push(k);
    }
  }
  out[lang] = {
    total, identical: identical.length, allowed: allowed.length,
    violations, identical_pct: +(100 * identical.length / total).toFixed(1),
    allowed_pct: +(100 * allowed.length / total).toFixed(1),
  };
  if (violations.length) bad++;
  console.log(
    lang.padEnd(6), 'identical=' + String(identical.length).padStart(3),
    'allowed=' + String(allowed.length).padStart(2), 'violations=' + violations.length,
    violations.length ? ' -> ' + violations.slice(0, 12).join(',') + (violations.length > 12 ? '…' : '') : '');
}

if (!fs.existsSync(LOGDIR)) fs.mkdirSync(LOGDIR, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
const logFile = path.join(LOGDIR, 'i18n-identity-' + ts + '.json');
fs.writeFileSync(logFile, JSON.stringify({ ts: new Date().toISOString(), langs: out }, null, 2));
console.log('log:', path.relative(ROOT, logFile));
if (bad) { console.log('FAIL violations langs=' + bad); process.exit(1); }
console.log('OK violations=0');
process.exit(0);
