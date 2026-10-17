// Починка последних строк DONE-реестра: предыдущая запись через bash потерял обратные слеши
// (\f, \t, \r превратились в управляющие символы). Переписываем хвост, пути — через /.
import fs from 'node:fs';
const P = '01-Architecture/03-Analysis/DONE-08-SPOR-release-ready.md';
const lines = fs.readFileSync(P, 'utf8').split('\n');
let cut = lines.length;
for (let i = lines.length - 1; i >= 0; i--) {
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(lines[i]) || /^\| U26 круг 8 \(W1\)/.test(lines[i])) { cut = i; break; }
}
// режем по самой верхней повреждённой/моей строке
let top = cut;
for (let i = cut; i >= 0; i--) {
  if (i === 0 || /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(lines[i - 1]) || !lines[i - 1].trim().startsWith('|')) { top = i; break; }
}
const keep = lines.slice(0, top).filter(l => !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(l));
const rows = [
 '| U26 круг 8 (W1) | fil: 40 групп замечаний — 28 ключей UI + 31 тело вики; tr: 8 правок таблицы 3 (5 ключей UI + 7 ключей вики); сканер вставок fil_insertion_scan — остаток 0 | `1a3cbd8`, `c512062`; пакеты `09-Docs/i18n-review/fil-round8-for-review.md`, `tr-round8-for-review.md`, `round8-input-sha.json` (4 записи = диск) |',
 '| U20 круг 3 (W2) | листинг: 15 правок в 13 языках (sw, fi, hu, fil, sv — fail; da, ms, es, pt-BR — обязательные; el, no, cs, ro — желательные); 24/24 требуемых формы, старых форм 0 | `4d9e5b2`, `5b2b8c6`, `614defb`; store_len `OK files=32 over=0`; пакет `09-Docs/i18n-review/store-listing-round3-for-review.md` (--full, 13 языков) |',
 '| U45 (W3) | verify_report: V13 первая строка «ПРИСТУПАЮ», V14 блок «Файлы >500 строк», V1 принимает имя v14 и легаси; «ЦИКЛ k/3» не проверяется; selftest 9 → 19 случаев | `0be0bc5`; логи `09-Docs/out-dev-factory/runs/w3-verify-report-20261017/selftest-DO.txt`, `selftest-POSLE.txt` |',
 '| U46 (W4) | PROBE: `.04-Src/src/index.html` (1248 строк) НЕ в сборке — webDir = ../cf-publish, хеши точек входа не совпадают, ссылок в build-скриптах и HTML 0 | `9a19f4e`; `09-Docs/out-dev-factory/runs/w4-probe-index-html-20261017/PROBE-U46.md` |',
 '| U47 (W5) | functional_test.js 612 → 6 строк-указатель + модули 76/255/307; тестов 60 до и 60 после, имена и порядок совпадают, expect-набор 11 = 11 | `3ed4507`, `f757d70`; `09-Docs/out-dev-factory/runs/w5-functional-split-20261017/diff-titles.txt` |',
 '| U22 AN.1 (W6) | PROOFS-G: колонка «Пруф (путь)»; 6 PASS с путём, 1 PASS честно снят в «не подтверждено» (лога 14.10 нет) | `2deb98a`; `09-Docs/out-dev-factory/runs/w6-an1-20261017/test-path.txt` (16/16 Test-Path True) |',
 '| Вне ТЗ (найдено в baseline, блок W0) | vitest давал exit=1 при 285/285 зелёных: утёкшие `setTimeout` из eval ui.js в ui_restore.test.js; починен харнес, ожидания и число тестов не менялись | `863c5b0`; FOUND_BUGS BAG-IG-261017-1 |'
];
fs.writeFileSync(P, keep.concat(rows, ['']).join('\n'));
console.log('строк было:', lines.length, 'стало:', keep.length + rows.length + 1, '| вырезано хвоста:', lines.length - top);
console.log(keep.slice(-2).join('\n'));
