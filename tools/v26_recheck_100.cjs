// v26 задача 1: перепроверка 100 языков — сколько значений словаря и статей wiki РЕАЛЬНО переведено
// (отличается от en), сколько — копия en. БЕЗ правок файлов. Результат: консоль + JSON + MD.
// Переведено = значение != en (регистр/пробелы значимы), кроме разрешённых когнатов (i18n_identity.allow.json).
// Usage: node tools/v26_recheck_100.cjs
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const I18N = path.join(ROOT, '.04-Src', 'i18n');
const WIKI = path.join(I18N, 'wiki');
const OUT_JSON = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14', 'v26-recheck-100.json');
const OUT_MD = path.join(ROOT, '09-Docs', 'out-dev-factory', 'logs-release-ready-2026-10-14', 'v26-recheck-100.md');

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const L = read(path.join(I18N, 'languages.json'));
const en = read(path.join(I18N, 'en.json'));
const enWiki = read(path.join(WIKI, 'en.json'));
const enKeys = Object.keys(en);
const enWikiKeys = Object.keys(enWiki);
const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' });

// разрешённые когнаты: значение совпадает с en по ключу и это разрешено allow-листом
const allowRaw = fs.existsSync(path.join(I18N, 'i18n_identity.allow.json')) ? read(path.join(I18N, 'i18n_identity.allow.json')) : {};
const allowArr = Array.isArray(allowRaw) ? allowRaw : Object.values(allowRaw).flat().filter(v => v && v.key);
const allowHit = (key, val, lang) => allowArr.some(a => a.key === key &&
  String(a.value).trim().toLowerCase() === String(val).trim().toLowerCase() &&
  (a.langs.includes('*') || a.langs.includes(lang)));

const wikiBody = v => (v && typeof v === 'object') ? String(v.body || '') : String(v == null ? '' : v);

const rows = [];
for (const l of L) {
  const row = { code: l.code, enabled: !!l.enabled, frozen: ['es','tr','fil'].includes(l.code), dictTotal: enKeys.length, wikiTotal: enWikiKeys.length, dictTranslated: 0, dictCopyEn: 0, dictMissing: 0, wikiTranslated: 0, wikiCopyEn: 0, wikiMissing: 0 };
  if (l.code === 'en') { row.dictTranslated = enKeys.length; row.wikiTranslated = enWikiKeys.length; rows.push(row); continue; }
  const df = path.join(I18N, l.code + '.json');
  if (fs.existsSync(df)) {
    const d = read(df);
    for (const k of enKeys) {
      if (!(k in d)) { row.dictMissing++; continue; }
      const v = String(d[k]);
      if (v.trim().toLowerCase() === String(en[k]).trim().toLowerCase() && !allowHit(k, v, l.code)) row.dictCopyEn++;
      else row.dictTranslated++;
    }
  } else row.dictMissing = enKeys.length;
  const wf = path.join(WIKI, l.code + '.json');
  if (fs.existsSync(wf)) {
    const w = read(wf);
    for (const k of enWikiKeys) {
      if (!(k in w)) { row.wikiMissing++; continue; }
      const v = wikiBody(w[k]);
      if (v.trim().toLowerCase() === wikiBody(enWiki[k]).trim().toLowerCase()) row.wikiCopyEn++;
      else row.wikiTranslated++;
    }
  } else row.wikiMissing = enWikiKeys.length;
  rows.push(row);
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ at: now, enKeys: enKeys.length, enWiki: enWikiKeys.length, rows }, null, 2));

// MD-таблица: сначала enabled, потом по убыванию недоперевода
const pct = r => Math.round(100 * r.dictTranslated / r.dictTotal);
const sorted = [...rows].sort((a, b) => (b.enabled - a.enabled) || (pct(a) - pct(b)));
let md = '# v26 перепроверка 100 языков — ' + now + ' UTC+3\n\nПереведено = значение отличается от en (кроме разрешённых когнатов allow-листа). en.json: ' + enKeys.length + ' ключей, wiki: ' + enWikiKeys.length + ' статей.\n\n| Язык | вкл | Словарь переведено | копия en | нет ключа | Wiki переведено | копия en | нет |\n|---|---|---|---|---|---|---|---|\n';
for (const r of sorted) {
  md += '| ' + r.code + (r.frozen ? ' (заморожен)' : '') + ' | ' + (r.enabled ? 'да' : '—') + ' | ' + r.dictTranslated + '/' + r.dictTotal + ' | ' + r.dictCopyEn + ' | ' + r.dictMissing + ' | ' + r.wikiTranslated + '/' + r.wikiTotal + ' | ' + r.wikiCopyEn + ' | ' + r.wikiMissing + ' |\n';
}
const sumDict = rows.filter(r => r.code !== 'en').reduce((s, r) => s + r.dictTranslated, 0);
const totDict = rows.filter(r => r.code !== 'en').reduce((s, r) => s + r.dictTotal, 0);
const sumWiki = rows.filter(r => r.code !== 'en').reduce((s, r) => s + r.wikiTranslated, 0);
const totWiki = rows.filter(r => r.code !== 'en').reduce((s, r) => s + r.wikiTotal, 0);
md += '\n**Итого по 99 языкам (без en): словарь ' + sumDict + '/' + totDict + ' (' + Math.round(100 * sumDict / totDict) + '%), wiki ' + sumWiki + '/' + totWiki + ' (' + Math.round(100 * sumWiki / totWiki) + '%).**\n';
fs.writeFileSync(OUT_MD, md);

console.log('Перепроверено языков: ' + rows.length);
console.log('Словарь (99 без en): ' + sumDict + '/' + totDict + ' переведено (' + Math.round(100 * sumDict / totDict) + '%), копий en: ' + (totDict - sumDict));
console.log('Wiki    (99 без en): ' + sumWiki + '/' + totWiki + ' переведено (' + Math.round(100 * sumWiki / totWiki) + '%), копий en: ' + (totWiki - sumWiki));
console.log('JSON: ' + OUT_JSON);
console.log('MD:   ' + OUT_MD);
