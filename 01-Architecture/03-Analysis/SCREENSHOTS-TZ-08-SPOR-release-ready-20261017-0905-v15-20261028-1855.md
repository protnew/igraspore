# SCREENSHOTS — отчёт TZ-08-SPOR-release-ready-20261017-0905-v15 от 28.10.2026 18:55 (UTC+3)

Указатель снимков и логов этого хода. Все снимки сделаны на локальных стендах (`http://127.0.0.1:8792/` — игра, `http://127.0.0.1:8795/` — QA), поднятых скрытно `tools\serve-up.ps1`. Консоль на каждом экране: 0 красных / 0 жёлтых от своего кода (дамп ниже).

| Что | Где лежит | Проверка |
|---|---|---|
| es/tr/fil, 390×844, 8 экранов (menu, tutorial, game, pause, settings, wiki-list, wiki-article, gameover) | код-блок 1 | тест `[lang] forced 390x844: 8 экранов без переполнений` — 3/3 passed; переполнений 0, `__i18nMiss` 0 |
| Магазин, fil, 1080×1920 (menu, game, settings, wiki-list) | код-блок 2 | 4/4 файла, все ровно 1080×1920, md5-дублей 0 (всего в папке 50 файлов, дублей 0) |
| B0/B1 — кнопки, обе фазы (96 карточек) | код-блок 3 | обе фазы `1 passed` (23,0 и 24,3 мин); вердикты одинаковые: work 34 / partial 15 / hidden 47 / broken **0** |
| Дамп консоли es/tr/fil на 8 экранах | код-блок 4 | 0 красных / 0 жёлтых / 0 сторонних у всех трёх языков |

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\i18n\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\store-listing\shots\fil\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\buttons-after\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\runs\v15-x4-20261028\x4-console-dump.txt
```

Манифест снимков с хешами (737 записей на 16.10; файлы обновлялись 28.10):

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\shots-manifest.json
```

Полные URL каждого снимка в браузере (локальный стенд, файлы отдаёт `tools\serve-static.mjs`):

```
http://127.0.0.1:8792/09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n/fil/390-game.png
http://127.0.0.1:8792/09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-game.png
http://127.0.0.1:8792/09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n/tr/390-game.png
http://127.0.0.1:8792/09-Docs/store-listing/shots/fil/1080-game.png
```

Логи этого хода:

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\runs\v15-x4-20261028\
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\runs\v15-x5-20261028\
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\runs\baseline-v15-20261028-1612\
```
