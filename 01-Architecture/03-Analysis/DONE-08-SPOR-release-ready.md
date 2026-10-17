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
