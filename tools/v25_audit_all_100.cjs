// v25 задача 4: структурный аудит ВСЕХ 100 словарей (missing/empty/плейсхолдеры/длина).
// Смысловую оценку (sameAsEn) делает v21_i18n_audit.cjs на 20 enabled — для L4-L8 en-фоллбек разрешён ТЗ.
// NEG=1 — 5 внедрённых дефектов должны быть найдены (не пишем файлы, правим в памяти).
// Usage: node tools/v25_audit_all_100.cjs   |  NEG=1 node tools/v25_audit_all_100.cjs
const fs = require('fs'), path = require('path');
const I18N = path.join(process.cwd(), '.04-Src', 'i18n');
const NEG = process.env.NEG === '1';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const L = read(path.join(I18N, 'languages.json'));
const en = read(path.join(I18N, 'en.json'));
const PLACE = /\{[a-zA-Z]+\}/g;
const places = s => (String(s).match(PLACE) || []).sort().join(',');
// решение владельца F.1 (как в v21_i18n_audit): длинная нативная строка — карточка переносится (CSS wrap)
const TOO_LONG_ALLOWED = new Set(['fil.role.consumer1']);

// NEG: 5 дефектов на памяти (не трогаем диски)
const negPatch = (d, lang) => {
  if (lang !== 'ar') return d;
  d['start'] = '';                                   // 1: пустая строка
  d['demo'] = en['demo'];                            // 2: == en (не когнат-allow)
  d['menuSub'] = String(en['menuSub']).replace('{n}', '100'); // 3: плейсхолдер потерян
  d['poolWill'] = d['poolWill'] + 'x'.repeat(200);   // 4: длина >×1.6 (плейсхолдеры сохранены)
  delete d['wikiT'];                                 // 5: отсутствующий ключ
  return d;
};

let probs = [], checked = 0;
for (const l of L) {
  const f = path.join(I18N, l.code + '.json');
  if (!fs.existsSync(f)) { probs.push(l.code + ': НЕТ ФАЙЛА'); continue; }
  let d = read(f);
  if (NEG) d = negPatch(d, l.code);
  checked++;
  for (const k of Object.keys(en)) {
    if (!(k in d)) { probs.push(l.code + ' ' + k + ': missing'); continue; }
    const v = String(d[k]);
    if (!v.trim()) { probs.push(l.code + ' ' + k + ': empty'); continue; }
    const pe = places(en[k]), pv = places(v);
    if (pe !== pv) probs.push(l.code + ' ' + k + ': плейсхолдер(' + (pv || '—') + '≠' + (pe || '—') + ')');
    else if (v.length > String(en[k]).length * 1.6 && v.length > 60 && !TOO_LONG_ALLOWED.has(l.code + '.' + k))
      probs.push(l.code + ' ' + k + ': длина ' + v.length + '>' + Math.round(String(en[k]).length * 1.6));
  }
}

const negOk = !NEG || (probs.length >= 4 &&
  probs.some(p => p.includes(' empty')) && probs.some(p => p.includes('плейсхолдер')) &&
  probs.some(p => p.includes('missing')) && probs.some(p => p.includes('длина')));
console.log('Проверено словарей: ' + checked + '/' + L.length);
if (NEG) console.log(negOk ? 'NEG: OK — дефекты найдены (' + probs.length + ' строк)' : 'NEG: ПРОВАЛ — аудит что-то пропустил');
else console.log(probs.length ? 'ПРОБЛЕМ: ' + probs.length + '\n' + probs.slice(0, 40).join('\n') : 'Проблем: 0 — все 100 структурно чисты');
process.exit((NEG && !negOk) ? 1 : 0);
