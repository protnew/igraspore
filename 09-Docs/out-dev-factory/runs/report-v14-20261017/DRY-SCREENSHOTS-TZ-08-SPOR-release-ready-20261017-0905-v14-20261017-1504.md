# SCREENSHOTS — отчёт TZ-08-SPOR-release-ready-20261017-0905-v14 от 17.10.2026 15:04 (UTC+3)

Это указатель снимков и логов этого круга. Снимки интерфейса в кругу W0–W6 не переснимались: вёрстка и цвета не менялись (правки только в словарях fil/tr, документах, инструментах и QA). Пересъёмка экранов es/tr/fil 390×844 и B0/B1 — часть W7 (U16), она стартует после трёх exit 0.

| Что | Где лежит (полный путь-URL) | Ошибок в консоли |
|---|---|---|
| B1 «после» правок кнопок (96 рядов, broken 0) | код-блок ниже | 0 красных от своего кода (лог `report.log`) |
| Снимки переполнения строк fil/tr (390×844) | код-блок ниже | н/д (замер длины — тест i18n_overflow) |
| Снимки страницы магазина 1080×1920 (10 языков) | код-блок ниже | н/д |
| Снимки лаба A.0–A.8 | код-блок ниже | н/д |

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\buttons-after\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\i18n\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\store-listing\shots\
```

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\lab\
```

Список файлов с хешами (737 снимков и логов пакета):

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\shots-release-ready-2026-10-14\shots-manifest.json
```

Логи прогонов этого круга:

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\runs\
```

Комментарий к строке «Ошибок в консоли»: цифры берутся из логов прогона Playwright (`09-Docs\out-dev-factory\logs-release-ready-2026-10-14\playwright.log`) и из `u22_check` (B1: вердикты work 33, partial 16, hidden 47, broken нет).
