# Передача разработки iGraSpore V2 другому ИИ — 27.10.2026 10:57 MSK (UTC+3)

**Что чиним →** доводим игру iGraSpore V2 (симулятор микроорганизмов, 100 видов + вирусы) до релизного качества на всех 20 языках.
**Цель →** все экраны во всех языках без визуальных багов в браузере (390/1280) и на Android-эмуляторе; стабильные тесты.
**Проблема →** остались: нестабильный тест мембраны (R9), неполное покрытие эмулятора, 2 строки fil в запрещённом файле.
**Решение →** продолжить по списку «Что осталось» ниже, теми же инструментами и правилами.
**Результат →** отчёт по форме ниже, первая строка «Отработка ТЗ: было N% → стало M%».

## 1. Проект и пути
- Машина: Windows (PowerShell), CPU часто 100% из-за чужого процесса openclaw gateway (node pid 43384) — **не трогать**.
- Репозиторий: `C:\Obsidian\New\Projects\08-iGraSpore_V2`
- Ветка: `release-ready-2026-10-14` (push в origin после каждого коммита).
- Код игры: `.04-Src\js\` (канон); CSS: `style.css`, `v20_5.css` (корень); `index.html` (корень).
- Переводы: `i18n\*.json`, `i18n\wiki\`, HUD: `.04-Src\js\i18n_hud_*.js`.
- Тесты: `.04-Src` → `npm test` (vitest, 323/323, 41 файл); Playwright: `.04-Src\07-QA-and-Testing\playwright-v20\*.spec.js`, конфиг `playwright.v20.config.js`.
- Android (Capacitor): `06-DevOps-and-Release\android\android`; веб-часть сборки: `app\src\main\assets\public` (а не apk_proj).
- Артефакты/скрины: `C:\Users\Space\agent-transfer\igraspore-v20-12\` (cycle1–3, emu, best).
- LEAD-LOG: `01-Architecture\03-Analysis\LEAD-LOG-v20.6.md` (строка после каждого шага).

## 2. Стенды и порты
- 8821 = текущий репозиторий: `http://127.0.0.1:8821/?test=1&pool=300&lang=xx`
- 8822 = база 289ed40 (для сравнения A/B).
- **Не останавливать:** 8790, 8793, 8795, 8798, 8799, 8802, 8811.
- Эмулятор: AVD `kq_test35`, порт 5584 (`emulator-5584`), только `-no-window`. adb: `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`.

## 3. Инструменты
- `node tools\v20_12_allscreens.cjs <base> <out> [langs] [vps]` — 20 языков × 10 экранов (menu, help, settings, wiki, intro, game, pause, death, demo, aquarium), 5 классов багов, светофор; `NEG=1` — самопроверка (должны найтись все 5 классов).
- `node tools\v20_10_vcheck.cjs` (V01–V44), `tools\v20_11_demo_labels.cjs` (наложения подписей демо), `tools\v20_11_perf_gate.cjs` (загрузка меню A/B), `tools\v20_11_menu_grid.cjs`.
- Линтер переводов: `i18n_lint.mjs` (open=108, allowed=44; 107 оставлены открытыми по решению R7.1).
- Сборка: JDK 21 (`C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot`), `gradlew.bat assembleDebug bundleDebug "-Dorg.gradle.java.home=<JDK21>"` (без этого флага — «invalid source release: 21»). Старый скрипт `tools\build-aab-jdk21.ps1` делает bundleRelease (нужен keystore — не трогать).
- Перед синхронизацией public — копия старого в `.10-Archive\`; копировать только .04-Src\js, .04-Src\fonts, i18n, корневые html/css и **только существующие 29 файлов** assets (корневой assets\bioicons = 114 МБ исходников).

## 4. История (v20.9.1 → v20.12)
| Версия | Ключевое | Коммиты | % |
|---|---|---|---|
| v20.9.1 | убрана подмена силуэтов в тестах, сетка соседей (FPS), равный пул на телефоне, компактный HUD, маска M1 | c18ffc9, a5e0f54, 5b511fd, b5e6124, 40d670f | — |
| v20.10 | R4 замер M1 offscreen, R6 миграция плотности, hex2rgb, V15/V27/V42, R7 чекер V + NEG, отчёт | 7783311, 8e5e6ac, e8b0117, bced4da, 636a102, 37c10e7, c977113, 6437737 | — |
| v20.11 | V30 подписи демо 1→0 наложений, V40 центр меню, линтер R7-b, перф-гейт, критики | d749b3e, 6015147, dd9c2ec, bff4a94 | 75% |
| v20.12 | R8.1, V30 до 100%, загрузка меню (liftDarkFills 609 мс → очередь; 1664→965 мс), AAB/APK, полный прогон 3 цикла (цикл 3: 390🟢/10🟡/0🔴), 5 визуальных правок | e4629e9, 95db9a9, 8e797d2, 0dc4ca5, 0e7de4c, df099c5 + отчёт | 90% |

## 5. Что осталось
1. **R9 membrane**: флейк аспекта (3/5 PASS при медиане 5 кадров). Таблица: `01-Architecture\Таблицы-выбора\choser-08-igraspore-r9-membrane-median5-flaky-20261027.json`. Рекомендация N.1 (детерминированная сцена, порог 1.10 прежний) — **ждёт решения владельца**.
2. **Эмулятор**: снять game, demo, aquarium, pause, death и другие языки на новой сборке (сейчас только en: menu/help/settings/wiki/intro). Эмулятор падает при RAM < ~4 ГБ свободно.
3. **fil**: «SETTINGS» в setBtn2/pSet не переведено; fil.json под запретом — спросить владельца.
4. Линтер: 107 открытых переводов (R7.1 — оставлены по решению).
5. Незакоммиченные чужие изменения (cf-publish, render.js/render_helpers.js, 09-Docs\...\i18n-inventory-before.json, backlog .db) — не коммитить.

ТЗ и отчёты (полные пути):
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\TZ-08-SPOR-v20.9.1-prodolzhenie-3experta-2026-10-26_2210.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\TZ-08-SPOR-v20.10-fps-m1off-aab-v01v44-2026-10-27_0318.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\TZ-08-SPOR-v20.11-v30-v40-menuload-fps-perfplan-lint-2026-10-27_0643.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.9.1-2026-10-27_0316.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.10-2026-10-27_0634.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.11-2026-10-27_0830.md`
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.12-2026-10-27_1054.md`

## 6. Все запреты (дословно действуют)
- Не подменять тесты; не снижать пороги/таймауты; без skip/only; без подмены рендера.
- Не трогать es/tr/fil.json, wiki/{es,tr,fil}.json; не удалять переводы; без RTL.
- Не удалять файлы — только перенос в `.10-Archive`.
- Без `git add -A`, `--force`, `reset --hard`; add только явными путями; `npm test` перед коммитом; каждый коммит сразу push.
- Без деплоя на прод; без Google Play, аккаунтов, платежей, секретов, keystore, google-services.json; секреты не печатать.
- Не трогать `.04-Src\src\`, AUDIT-*, CHECK-*, backlog .db, cf-publish, package.json.
- Не коммитить грязные render.js/render_helpers.js и 09-Docs/.../i18n-inventory-before.json.
- Не останавливать порты 8790/8793/8795/8798/8799/8802/8811 и чужие процессы.
- JS-файл ≤ 500 строк.
- Окна только скрытые (headless, -no-window).
- «Лучше пауза, чем сомнительное»; развилки — таблицами Choser (`01-Architecture\Таблицы-выбора\`).
- Артефакты ≤ 1 ГБ; при свободном месте на C < 10 ГБ — стоп.
- При обрыве: сверить git log, git status и LEAD-LOG.

## 7. Тестовый блок (обязателен для приёмки)
1. `npm test` 323/323 (или больше, без удаления тестов).
2. Отдельные spec Playwright по затронутым местам (membrane.spec — 5 прогонов, указать сколько PASS).
3. `tools\v20_12_allscreens.cjs` по **всем 20 языкам × 10 экранам × 390 и 1280**: **3 цикла подряд** без 🔴; NEG=1 находит все 5 классов.
4. Эмулятор kq_test35 с новой сборкой: минимум menu, game, demo, settings, wiki.
5. Глазами (Read PNG) не меньше 10 скринов разных языков: чекер не видит canvas.
6. **≥ 5 скринов до/после** в `C:\Users\Space\agent-transfer\igraspore-<версия>\best\`.
7. Таблица язык × экран со светофором в отчёте.

## 8. Куда отчёт
- `C:\Obsidian\New\Projects\08-iGraSpore_V2\01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-<версия>-2026-MM-DD_ЧЧММ.md`
- Первая строка: «Отработка ТЗ: было N% → стало M%». Вернуть: %, коммиты, тесты, пути артефактов, таблицу, список best\, развилки (Choser). Предпоследняя строка — путь отчёта в блоке кода.
