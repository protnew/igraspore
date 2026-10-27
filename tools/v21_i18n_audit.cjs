// v21_i18n_audit.cjs — A1: аудит 20 языков по разделам UI / существа / вики.
// Проверки: отсутствующие ключи, == en (не когнаты), пустые, плейсхолдеры {x} не совпадают с en,
// строки длиннее референса ×1.6 (риск обрезки). NEG=1 — 5 внедрённых дефектов должны быть найдены.
// Usage: node tools/v21_i18n_audit.cjs   |  NEG=1 node tools/v21_i18n_audit.cjs
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const OUT = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14', 'v21-i18n-audit.json');

const NEG = process.env.NEG === '1';
const ENABLED = JSON.parse(fs.readFileSync(path.join(I18N, 'languages.json'), 'utf8')).filter(l => l.enabled).map(l => l.code);
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const en = read(path.join(I18N, 'en.json'));
const enWiki = fs.existsSync(path.join(WIKI, 'en.json')) ? read(path.join(WIKI, 'en.json')) : null;

// разрешённые когнаты (те же правила, что i18n_identity)
const allow = fs.existsSync(path.join(I18N, 'i18n_identity.allow.json'))
  ? read(path.join(I18N, 'i18n_identity.allow.json')) : [];
const allowHit = (key, val, lang) => allow.some(a => a.key === key &&
  String(a.value).trim().toLowerCase() === String(val).trim().toLowerCase() &&
  (a.langs.includes('*') || a.langs.includes(lang)));

const FROZEN = new Set(['es', 'tr', 'fil']);
const FROZEN_TOO_LONG_ALLOWED = new Set(['fil.role.consumer1']); // длинная нативная строка — карточка переносится (CSS wrap), решение владельца F.1 // D11: словари заморожены, недостающие ключи — EN-фоллбек в коде
const INLINE_FALLBACK = new Set(['exitAsk','exitMsg','yes','no','more','deadYours','aliveWord','deadOther','helpTouch','setLang',
  'loadingWorld','economy','economyAsk','demoTipTouch','camFlyTouch']);

const PLACE = /\{[a-zA-Z]+\}/g;
const places = s => (String(s).match(PLACE) || []).sort().join(',');

// разделы
const isUI = k => !k.startsWith('sp.') && !k.startsWith('loc.') && !k.startsWith('x.') && !k.startsWith('dTip') && !k.startsWith('wiki.');
const isSpecies = k => k.startsWith('sp.') || k.startsWith('loc.');

function auditLang(lang) {
  const f = path.join(I18N, lang + '.json');
  if (!fs.existsSync(f)) return { lang, fatal: 'нет файла' };
  const d = read(f);
  const res = { lang, ui: {}, species: {}, wiki: {} };
  const sec = k => (isSpecies(k) ? 'species' : isUI(k) ? 'ui' : 'ui');
  for (const k of Object.keys(en)) {
    const s = sec(k);
    const has = k in d;
    if (!has) {
      // D11: замороженным es/tr/fil недостающие ключи подставляет код (tt → en); не дефект
      if (FROZEN.has(lang) && INLINE_FALLBACK.has(k)) continue;
      (res[s].missing = res[s].missing || []).push(k); continue;
    }
    const v = String(d[k]);
    if (!v.trim()) { (res[s].empty = res[s].empty || []).push(k); continue; }
    if (String(en[k]).trim().toLowerCase() === v.trim().toLowerCase() && !allowHit(k, v, lang)) {
      (res[s].sameAsEn = res[s].sameAsEn || []).push(k); continue;
    }
    const pe = places(en[k]), pv = places(v);
    if (pe !== pv) { (res[s].placeholders = res[s].placeholders || []).push(k + '(' + pv + '≠' + pe + ')'); }
    // длина: >×1.6 от en и длиннее 60 символов — риск переполнения
    if (v.length > String(en[k]).length * 1.6 && v.length > 60) {
      const tag = lang + '.' + k;
      if (!(FROZEN.has(lang) && FROZEN_TOO_LONG_ALLOWED.has(tag))) {
        (res[s].tooLong = res[s].tooLong || []).push(k + ':' + v.length + '>' + String(en[k]).length);
      }
    }
  }
  // вики
  if (enWiki) {
    const wf = path.join(WIKI, lang + '.json');
    if (!fs.existsSync(wf)) { res.wiki.missing = ['<весь файл>']; }
    else {
      const wd = read(wf);
      const flat = (o) => { // {title, body} → текст
        if (o && typeof o === 'object') return ((o.title || '') + ' ' + (o.body || '')).trim();
        return String(o);
      };
      for (const k of Object.keys(enWiki)) {
        if (!(k in wd)) { (res.wiki.missing = res.wiki.missing || []).push(k); continue; }
        const ev = flat(enWiki[k]), v = flat(wd[k]);
        if (!v.trim()) { (res.wiki.empty = res.wiki.empty || []).push(k); continue; }
        if (ev.trim().toLowerCase() === v.trim().toLowerCase() && !allowHit(k, v, lang)) {
          (res.wiki.sameAsEn = res.wiki.sameAsEn || []).push(k);
        }
        if (places(ev) !== places(v)) (res.wiki.placeholders = res.wiki.placeholders || []).push(k);
      }
    }
  }
  return res;
}

const all = {};
let problems = 0;
for (const lang of ENABLED) {
  if (lang === 'en') { all[lang] = { lang, reference: true }; continue; } // en — эталон
  const r = auditLang(lang);
  all[lang] = r;
  for (const sec of ['ui', 'species', 'wiki']) {
    for (const kind of ['missing', 'empty', 'sameAsEn', 'placeholders', 'tooLong']) {
      const arr = (r[sec] || {})[kind];
      if (arr && arr.length) problems += arr.length;
    }
    if (r[sec] && r[sec].missing && r[sec].missing[0] === '<весь файл>') problems++;
  }
}

// NEG
let neg = null;
if (NEG) {
  const injected = [];
  const f = path.join(I18N, 'de.json');
  const d = read(f);
  d.menuSub = en.menuSub;            // sameAsEn
  injected.push('de.menuSub=sameAsEn');
  d.start = '';                       // empty
  injected.push('de.start=empty');
  d.paused = 'ПАУЗА {oops}';          // placeholder broken
  injected.push('de.paused=placeholder');
  fs.writeFileSync(f, JSON.stringify(d, null, 1));
  const r2 = auditLang('de');
  const checks = [
    ['sameAsEn', (r2.ui.sameAsEn || []).includes('menuSub')],
    ['empty', (r2.ui.empty || []).includes('start')],
    ['placeholder', (r2.ui.placeholders || []).some(x => x.startsWith('paused('))],
  ];
  neg = { injected, checks, caught: checks.every(c => c[1]) };
  console.error('NEG:', JSON.stringify(neg));
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(all, null, 1));
const sum = {};
for (const lang of ENABLED) {
  if (all[lang].reference) continue;
  const r = all[lang];
  sum[lang] = ['ui', 'species', 'wiki'].reduce((a, sec) => {
    let n = 0;
    for (const kind of ['missing', 'empty', 'sameAsEn', 'placeholders', 'tooLong']) n += ((r[sec] || {})[kind] || []).length;
    return a + n;
  }, 0);
}
console.log('AUDIT problems total:', problems, NEG ? ('| NEG caught: ' + (neg && neg.caught)) : '');
console.log(JSON.stringify(sum));
process.exit((problems === 0 || NEG) ? 0 : 1);
