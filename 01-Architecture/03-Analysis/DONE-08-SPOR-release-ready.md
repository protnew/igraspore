# DONE-08-SPOR-release-ready — реестр сделанного по ТЗ release-ready (v1…v13 → v14)

Создан аналитиком 17.10.2026 09:10 (UTC+3) при выпуске `TZ-08-SPOR-release-ready-20261017-0905-v14` (09A «против ТЗ-свалки» п.1). Дописывается (исполнителем — строками о своём сделанном, с доказательством). Полные тексты прошлых версий: `.10-Archive\tz-v*-before-*.md`, `.10-Archive\tz-v13-before-v14-2026-10-17.md`.

Таблица 1. Сделано (доказательство — коммит / файл / команда)
| U / пункт | что | доказательство |
|---|---|---|
| U01–U08, U10–U12, U14, U17, U18, U25 | инструменты, отчёты, вынос строк, вики 20×108, кнопки, HUD | v13 §68 (строки ✅ с командами) |
| U09 | fil `colonyKind` → «Uri ng kumpol ng selula» | `.04-Src\i18n\fil.json` (17.10) |
| U13 | es/tr/fil 403/403 | `i18n_coverage --all` 100 % (run-all-tests) |
| U15, U28, U29 | пакеты кругов 5/6/7, оценки аналитика | `09-Docs\i18n-review\*-round{5,6,7}-for-review.md`, `raw\*-analyst-round*.json` |
| U19, U27 | снимки es/tr/fil 8×390×844 | `09-Docs\out-dev-factory\shots-release-ready-2026-10-14\i18n\{es,tr,fil}\` |
| U21 | лаб A.0–A.8 снимки | v13 §87 «принято» |
| U26 круги 5–6 | правки 18 языков + fil Hati/KAIN/loc/mito, tr dTip.temp | `2321566`; CHECK-DEV-2026-10-17 |
| U20 круги 1–2 | листинг 32/32, store_len over=0; круг 2 по 16 языкам | `33252b8`; `STORE-LISTING-ANALYST-ROUND2-2026-10-17.md` (27/32 ≥ 8) |
| U22 B1 | 96 карточек, broken 3 → 0 | `829f372`; u22_check |
| U22 A.7 | лаб пересобран на `d7a0cdb` (после — только документы) | u22_check; `git diff --stat d7a0cdb f415d36` |
| U22 P2.5 | иконки 192/512/maskable, feature-graphic 1024×500 | `5394879`, `8d39336` |
| U22 P2.6 | снимки магазина 1080×1920, 10 языков, md5-дублей 0; звезда → меню паузы | `f34cf49`, `d7a0cdb` |
| U22 P2.12 | locales_config 17 = enabled 17 | u22_check MATCH |
| U22 AN.2/3/4/8 | сверка, add-only заметки | `PROOFS-U22-AN-2026-10-16.md`, `5394879` |
| U34 | verify_report на свежих отчётах VERIFY OK 12/12 | отчёт v12 22:58 |
| U35 | coverage --all в run-all-tests | `tools\run-all-tests.ps1:171-172` |
| U37 (часть исполнителя) | инструкция закрытого теста | `09-Docs\out-dev-factory\PLAY-CLOSED-TEST-GUIDE.md` |
| U38–U44 | снимки вики, хук языка, fil/tr/es правки, loc.*, «локальный стенд», critic_check №20 | v13 §87 «принято»; vitest critic_check_analyst 5/5 |
| Аналитик А1, А2, А8, А9 | круги 5, 6, 7; листинг круги 1–2 | `ANALYST-ROUND5/6/7`, `STORE-LISTING-ANALYST-ROUND2-2026-10-17.md` |
| U26 круг 8 (W1, 17.10) | fil: 40 групп замечаний — 28 ключей UI + 31 тело вики; tr: 8 правок таблицы 3 (5 ключей UI + 7 ключей вики); сканер вставок — остаток 0 | `1a3cbd8`, `c512062`; `09-Docs/i18n-review/fil-round8-for-review.md`, `tr-round8-for-review.md`, `round8-input-sha.json` (4 записи = диск) |
| U20 круг 3 (W2, 17.10) | листинг: 15 правок в 13 языках (fail sw, fi, hu, fil, sv + обязательные da, ms, es, pt-BR + желательные el, no, cs, ro); 24/24 требуемых формы, старых форм 0 | `4d9e5b2`, `5b2b8c6`, `614defb`; `store_len` = OK files=32 over=0; пакет `store-listing-round3-for-review.md` (--full) |
| U45 (W3, 17.10) | verify_report: V13 первая строка «ПРИСТУПАЮ», V14 блок «Файлы >500 строк», V1 принимает имя v14 и легаси; «ЦИКЛ k/3» не проверяется; selftest 9 → 19 случаев | `0be0bc5`; `09-Docs/out-dev-factory/runs/w3-verify-report-20261017/selftest-DO.txt`, `selftest-POSLE.txt` |
| U46 (W4, 17.10) | PROBE: `.04-Src/src/index.html` (1248) НЕ в сборке — webDir = ../cf-publish, хеши точек входа не совпадают, ссылок 0 | `9a19f4e`; `09-Docs/out-dev-factory/runs/w4-probe-index-html-20261017/PROBE-U46.md` |
| U47 (W5, 17.10) | functional_test.js 612 → 6 строк-указатель + модули 76/255/307; тестов 60 до и 60 после, имена и порядок совпадают, expect-набор 11 = 11 | `3ed4507`, `f757d70`; `09-Docs/out-dev-factory/runs/w5-functional-split-20261017/diff-titles.txt` |
| U22 AN.1 (W6, 17.10) | PROOFS-G: колонка «Пруф (путь)»; 6 PASS с путём, 1 PASS снят в «не подтверждено» (лога 14.10 нет) | `2deb98a`; `09-Docs/out-dev-factory/runs/w6-an1-20261017/test-path.txt` (16/16 Test-Path True) |
| Вне ТЗ (найдено в baseline W0) | vitest exit=1 при 285/285 зелёных: утёкшие `setTimeout` из eval ui.js в ui_restore.test.js; починен харнес, ожидания и число тестов не менялись | `863c5b0`; `09-Docs/out-dev-factory/FOUND_BUGS.md` BAG-IG-261017-1 |

## v14 → DONE (17.10.2026, CHECK-DEV-2026-10-17-1556.md)
- W1 fil 39/40 + tr 8/8 (1a3cbd8, c512062) · W2 листинг круг 3 (4d9e5b2, 5b2b8c6) · W3 U45 verify_report V13/V14 (0be0bc5, 7446950) · W4 U46 PROBE (9a19f4e) · W5 U47 разрез functional_test (3ed4507, f757d70) · W6 AN.1 16/16 (2deb98a) · харнес ui_restore (863c5b0)
- Круг 8: fil 8.2, tr 8.6; гейты es/tr/fil exit 0; листинг 32/32
