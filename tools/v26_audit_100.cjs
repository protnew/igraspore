// v26 задача 2: аудит 100 языков, который ПАДАЕТ на копиях en.
// Категории (7): dict missing / dict empty / dict плейсхолдер / dict длина / dict sameAsEn / wiki missing-или-empty / wiki sameAsEn.
// sameAsEn исключает: разрешённые когнаты (i18n_identity.allow.json), INLINE_FALLBACK у замороженных es/tr/fil (D11).
// Без NEG: exit 1 если есть проблемы (сейчас — падает на 24161 en-копиях словарей и 7480 wiki).
// NEG=1: 7 дефектов в памяти на ar — все 7 категорий должны быть найдены, иначе exit 1.
// Usage: node tools/v26_audit_100.cjs   |  NEG=1 node tools/v26_audit_100.cjs
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const LOG = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14', 'v26-audit-100.json');
const NEG = process.env.NEG === '1';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const L = read(path.join(I18N, 'languages.json'));
const en = read(path.join(I18N, 'en.json'));
const enWiki = read(path.join(WIKI, 'en.json'));
const PLACE = /\{[a-zA-Z]+\}/g;
const places = s => (String(s).match(PLACE) || []).sort().join(',');
const TOO_LONG_ALLOWED = new Set(['fil.role.consumer1']); // решение владельца F.1
const FROZEN = new Set(['es', 'tr', 'fil']);
const INLINE_FALLBACK = new Set(['exitAsk','exitMsg','yes','no','more','deadYours','aliveWord','deadOther','helpTouch','setLang',
  'loadingWorld','economy','economyAsk','demoTipTouch','camFlyTouch']);
const allowRaw = fs.existsSync(path.join(I18N, 'i18n_identity.allow.json')) ? read(path.join(I18N, 'i18n_identity.allow.json')) : {};
const allowArr = Array.isArray(allowRaw) ? allowRaw : Object.values(allowRaw).flat().filter(v => v && v.key);
const allowHit = (key, val, lang) => allowArr.some(a => a.key === key &&
  String(a.value).trim().toLowerCase() === String(val).trim().toLowerCase() &&
  (a.langs.includes('*') || a.langs.includes(lang)));
const wikiBody = v => (v && typeof v === 'object') ? String(v.body || '') : String(v == null ? '' : v);

// NEG: 7 дефектов (по одному на категорию) на памяти, файлы не трогаем
const negPatch = (d, w, lang) => {
  if (lang !== 'ar') return;
  d['start'] = '';                                            // 1: dict empty
  d['menuSub'] = String(en['menuSub']).replace('{n}', '100'); // 2: dict плейсхолдер
  d['poolWill'] = d['poolWill'] + 'x'.repeat(200);            // 3: dict длина
  delete d['wikiT'];                                          // 4: dict missing
  d['demo'] = en['demo'];                                     // 5: dict sameAsEn
  delete w['0'];                                              // 6: wiki missing
  w['1'] = { body: '' };                                      // 7: wiki empty (входит в wiki missing-или-empty)
};

const probs = { 'dict missing': [], 'dict empty': [], 'dict плейсхолдер': [], 'dict длина': [], 'dict sameAsEn': [], 'wiki missing/empty': [], 'wiki sameAsEn': [] };
let langsChecked = 0;
for (const l of L) {
  const df = path.join(I18N, l.code + '.json');
  const wf = path.join(WIKI, l.code + '.json');
  if (!fs.existsSync(df)) { probs['dict missing'].push(l.code + ': НЕТ ФАЙЛА'); continue; }
  const d0 = read(df);
  const w0 = fs.existsSync(wf) ? read(wf) : {};
  if (NEG) negPatch(d0, w0, l.code);
  langsChecked++;
  if (l.code !== 'en') {
    for (const k of Object.keys(en)) {
      if (!(k in d0)) { probs['dict missing'].push(l.code + ' ' + k); continue; }
      const v = String(d0[k]);
      if (!v.trim()) { probs['dict empty'].push(l.code + ' ' + k); continue; }
      if (places(en[k]) !== places(v)) { probs['dict плейсхолдер'].push(l.code + ' ' + k); continue; }
      if (v.length > String(en[k]).length * 1.6 && v.length > 60 && !TOO_LONG_ALLOWED.has(l.code + '.' + k)) probs['dict длина'].push(l.code + ' ' + k);
      else if (v.trim().toLowerCase() === String(en[k]).trim().toLowerCase() && !allowHit(k, v, l.code) &&
               !(FROZEN.has(l.code) && INLINE_FALLBACK.has(k))) probs['dict sameAsEn'].push(l.code + ' ' + k);
    }
    for (const k of Object.keys(enWiki)) {
      const b = wikiBody(w0[k]);
      if (!(k in w0) || !b.trim()) { probs['wiki missing/empty'].push(l.code + ' wiki[' + k + ']'); continue; }
      if (b.trim().toLowerCase() === wikiBody(enWiki[k]).trim().toLowerCase()) probs['wiki sameAsEn'].push(l.code + ' wiki[' + k + ']');
    }
  }
}

const counts = {}; let total = 0;
for (const c in probs) { counts[c] = probs[c].length; total += counts[c]; }
fs.mkdirSync(path.dirname(LOG), { recursive: true });
fs.writeFileSync(LOG, JSON.stringify({ at: new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' }), NEG, langsChecked, counts, sample: Object.fromEntries(Object.entries(probs).map(([k, v]) => [k, v.slice(0, 50)])) }, null, 2));

console.log('Языков: ' + langsChecked + '/' + L.length + ' · всего проблем: ' + total);
for (const c in counts) console.log('  ' + c + ': ' + counts[c]);
if (NEG) {
  const need = ['dict missing', 'dict empty', 'dict плейсхолдер', 'dict длина', 'dict sameAsEn', 'wiki missing/empty'];
  const ok7 = need.every(c => counts[c] > 0);
  console.log(ok7 ? 'NEG: OK — все 7 категорий найдены' : 'NEG: ПРОВАЛ — ' + need.filter(c => !counts[c]).join(', '));
  process.exit(ok7 ? 0 : 1);
}
console.log(total ? 'АУДИТ ПАДАЕТ (есть проблемы — см. ' + LOG + ')' : 'Аудит чист');
process.exit(total ? 1 : 0);
