# LEAD-LOG v20.6 / v20.7

## Цикл 1
Сделано: окончания строк 4 js = HEAD (обычный diff = diff без CR). main_events.js 465 строк, кормление в main_feed.js. Тестовый пул ?test=1&pool=N сохранён.
Замер полного пула до порций: мир ~14 мс, start.end ~20 мс от клика, стена до state ~1511 мс, 1796 организмов.
93.1: 24 файла миров по ~24 КБ, 1779 организмов. Старт с готового мира: кадр 969 мс, start.end 7 мс, полный мир 787 мс, 1796 организмов. Perf-тест «полный пул: кадр ≤1 с, мир ≤3 с» — 1 passed.
Красное: run-all ещё не зелёный, телефон и 20 языков этого круга не пройдены, V01–V44 и R1–R10 не закрыты целиком.
Следующий шаг: коммит старта, затем гейт и языки.
% : 25

## Цикл 2
Сделано: индикатор «собираем пруд» на 20 языках (es/tr/fil — запасной английский в коде, их json не трогал). Пауза на pointerup с защитой от двойного срабатывания. Назад из настроек и справки, открытых из паузы, возвращает в паузу. «Other» берётся из deathCauseRow, сумма причин равна показанному Dead. Формула бассейна та же, что у живого старта: 1779 организмов плюс вирусы, без множителя сложности. Экономный режим выключен, пул −30% только если его включить; предложение после 10 с ниже 25 кадров. Переключатели снова 34×16, зона касания паддингом. В списке языка 20 родных имён. Подсказка демо на таче без WASD. Подписи групп не уезжают за левый край.
Проверка: npm test 39 файлов, 313 passed, 0 failed (после того как новые ключи убраны из en.json, а manualFeed ищется и в main_feed.js).
Красное: run-all, телефон, 20 языков глазами, 3+3 круга, AAB.
Следующий шаг: полный npm test, затем run-all на свободном порту.
% : 40

## v20.9.1 — 2026-10-27 00:42 (UTC+3)
- Этап 0: c18ffc9 (pushed) — K2 убрана подмена силуэта (архив .10-Archive), K3/K4 AGENTS.md/package.json восстановлены, i18n в config.js. npm test 313/313.
- Этап 1: a5e0f54 (pushed) — K5 fine grid/getNearby. FPS 1280 медиана: 289ed40 5.8 → 8.3 (машина 100% CPU, цель 30 не достигнута — развилка).
- Этап 2 (в работе): K6 mobile.js cap плотности снят (пул одинаков); K7 компактный HUD ≤430 + ที่กำบัง без разрыва (ui.js _nbw); K8 START шрифт = DEMO/AQUARIUM, KOLONIE в 1 строку (colBadge). Скрины shots-b de/th 390/1280: 24/24 OK, проверено глазами.

- 01:27 Этап 2 закоммичен 5b511fd (pushed), npm test 313/313. Этап 3: M1 честно FAIL — XOR соседних кадров =0 (gt идёт, state playing); диагностика формы игрока/хэша канваса в работе. B1px — pass. run-all-tests запущен (rat1).
- 01:32 M1 причина: канвас изменяется между кадрами (хэши разные, форма circle, membranePath работает), но маска спека = альфа>60 в кольце, а канвас непрозрачный (фон воды) → маска всегда полное кольцо → XOR=0. Без подмены рендера тест не может пройти; правка теста запрещена → РАЗВИЛКА, пункт не закрыт. Дальше: E2 240 кадров в фоне.
- 01:48 E2: 240/240 OK (20 яз × 1280/390 × 6 экранов, оверлей проверяется скриптом), выборочно глазами bn death, hi pause, de menu, th game — ок. Путь: C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\
- 01:52 run-all-tests (8821, лог 09-Docs\test-runs\logs\20261027-0100): vitest 313/313, qa_unit 26/26, playwright 65 pass / 5 fail: hud_contract pause ×3 (exitConfirm перекрывает #pMore — тест не закрывает exitConfirm, раньше маскировалось авто-«Нет» 900мс, хак удалён в K-этапе 0 → развилка), i18n_overflow ru 390 tutorial nav click timeout, perf_start мир 4.7с>3с (CPU 100%). Дальше: FPS 390 база/текущий 5 прогонов.
- 02:11 FPS 5 прогонов, ru, 20с, один стенд, сразу подряд (CPU сейчас 100%): 1280 база 289ed40 fps 5.7 (min 3.5, кадр 468мс) → текущий 9.4 (min 5.7, кадр 393мс), +65%. 390 база 5.8 → 5.5, но пул на 390 теперь полный (~1800 вместо ~1000, K6), так что сравнение неравное. Цель 30 НЕ достигнута (R1: приёмка утром). R2: маска M1 переделана на «отличие от цвета фона» (порог 60, асп. 1.10/XOR 3% не тронуты).
- 02:22 R2: M1 ON с новой маской PASS; негативная проверка (MEMB_A/NOSE/STRETCH=0) — тест FAIL на аспекте (ловит сломанную), скрин agent-transfer\M1-negative-broken.png, спека-негатив в .10-Archive\v20.9.1-neg-check. M1 OFF: медиана XOR 0.9% > 0.5% (всплески 2% — фон/частицы) — открыт. R3: в hud_contract после pExit проверка «диалог висит 1.2с» + клик #ecNo → пауза. Прогон hud_contract в фоне.
- 02:39 R3 hud_contract «меню паузы» ru/en/hi: 3/3 PASS. Choser-таблицы R1/R2/R3 (10×10, 3 круга) в 01-Architecture\Таблицы-выбора\choser-08-igraspore-r{1-fps,2-m1-mask,3-exitconfirm}-20261027.json.
- 02:40 b5e6124 pushed. Этап 4: диски C44/M46/O55 ГБ. Запущен эмулятор kq_test35 -no-window порт 5584.
- 02:59 Эмулятор: Chrome Android 10 через CDP (adb forward 9333) на 10.0.2.2:8821, tools\v20_9_shots_emu.cjs, 20 яз × menu/game/pause в фоне; ru menu проверен глазами — ок. AAB/APK НЕ собираю: сборка требует синхронизации apk_proj\assets\www (запрет) → в v20.10.
- 03:15 Эмулятор прогон1: 41 OK / 7 FAIL (en,fr,vi,zh-TW,ms — goto>90с; uk,bn — screenshot>30с; среда: CPU 100%, swiftshader). Повтор для 7 языков в emu2.
- 03:19 Отчёт 01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.9.1-2026-10-27_0316.md; ТЗ 09-Docs\out-dev-factory\TZ-08-SPOR-v20.10-fps-m1off-aab-v01v44-2026-10-27_0318.md (59 строк).
- 03:27 40d670f pushed (отчёт+ТЗ v20.10). Эмулятор повтор emu2: 11 OK / 4 FAIL (fr, vi goto>90с; zh-TW, ms screenshot>30с). Итого эмулятор 52/60 кадров OK, остаток — таймауты среды. Эмулятор оставлен работать (kq_test35, порт 5584, скрыт).

## v20.10 ночь — 2026-10-27 03:30 (UTC+3)
- Старт. C 37 ГБ. Пункт 1 i18n_overflow ru 390: в падении tutorial:nav — page.click('#startBtn') timeout 12с. Воспроизвожу.
- 03:42 i18n_overflow ru 390 в одиночку: 3/3 PASS (1 + repeat-each 2) → падение в полном прогоне = таймаут клика 12с под нагрузкой (4 воркера + CPU 100%), не баг вёрстки; порог не трогаю, в отчёт. Таблицы Choser R4/R5/R6 готовы; вопрос Алексею R5: 01-Architecture\03-Analysis\QUESTION-R5-AAB-2026-10-27.md. perf_start: замер фаз база/текущий × 1280/390 × 3 в фоне.
- 03:54 R6: плотность НЕ сохраняется в localStorage (ключи: igraspore_save/star/tut_v2, igs.softMembrane, igs_lang…) → устаревшего значения нет, миграция не нужна (флаг версии не добавляю, чтобы не плодить мёртвый код). Добавлен vitest mobile_pool.test.js (3/3): слабый/средний телефон сохраняет density=1. Негатив: тот же sandbox на mobile.js из 289ed40 даёт density 0.3 → тест ловит возврат cap. Полный npm test в фоне.
- 03:55 perf_start измерен (3 прогона, en, без test, n=1796 везде): клик→start.end 76–84 мс (база 83–117), клик→world.full 84–308 мс (база 120–1165) при пороге 3000 мс → код укладывается с запасом 10×; 4.7 с в полном прогоне и 12.5 с «меню» в fps-скрипте = нагрузка машины (4 воркера playwright + CPU 100%), не пул. Регресс к базе: загрузка до меню 2.8–3.6 с против 1.9–2.6 с (+~0.7 с) — разбираю.
- 04:01 npm test 316/316 (40 файлов). Коммит: mobile_pool.test.js, Choser R4/R5/R6, вопрос R5.

- 2026-10-27 04:20 R4 done: membrane.spec.js grab -> offscreen drawBody (visible render untouched, thresholds unchanged). ON+OFF 2/2 pass on 8821. NEG (ON-test with softMembrane=false) FAILS as required: XOR 0.2% < 3%; spec in .10-Archive/v20.10-neg-r4, screenshot agent-transfer/igraspore-v20-9-1/R4-negative-off.png. npm test 316/316. C 37 GB.

- 2026-10-27 04:43 World diversity: tools/v20_10_world_diversity.cjs, 3 starts on 8821 -> hashes cd0d46cd / f7bd96bf / c56c767 (3/3 unique), n=1796 each, species 25/28/25. World has no seed (Math.random), so 'same seed = same world' does not apply. npm test 316/316.

- 2026-10-27 04:54 Optimizations: CPU profile (tools/v20_10_profile.cjs, 6 s, 1280x720, 8821): (program/raster) 55%, fill 6%, renderWater 4.3%, drawOrgans 3.4%, renderTrails 2.8% (render_helpers.js - dirty, not touched), drawBody 1.9%. World simulation does not appear in the top 25 -> the bottleneck is rendering, not the world calculation. Tried a trapezoid pond outline in renderWater: NOT pixel-identical (maxd 85/255 on 82 bytes at scale 1, AA) -> REVERTED (git checkout of my own edit), evidence in .10-Archive/v20.10-water-rejected. No pool cuts.

- 2026-10-27 05:28 R6 (supervisor 05:10 'внедрять'): new .04-Src/js/density_pref.js (loaded right after config.js in index.html) - one-time migration to density 1.0 with flag igs_density_ver=2; manual slider choice (igs_density + igs_density_manual=1, written by igsSetDensity from ui_screens slider) is restored and never overwritten. vitest density_migrate.test.js 6/6; negative mutants (.10-Archive/v20.10-neg-r6) both break invariants; e2e tools/v20_10_r6_e2e.cjs 390x844: fresh -> migrated 1.0, slider 0.6 -> reload -> manual 0.6, 0 page errors; screenshot R6-settings-slider-0.6.png. npm test 323/323 (41 files). C 34.6 GB.

- 2026-10-27 05:28 Render opt #1 (pixel-identical by construction): hex2rgb memoized in config.js (pure fn, returns a copy -> callers may mutate; cap 4096 keys; in-game 103 unique colors, outputs verified [170,187,204] for #abc, 0 page errors). Was 0.4% self-time in profile (tools/v20_10_profile.cjs). npm test 323/323. FPS gain not measured (machine loaded) - to be measured on a free machine vs 289ed40 with CPU%.

- 2026-10-27 05:33 V01–V44: wrote tools/v20_10_vcheck.cjs + v20_10_vmap.cjs (states menu/help/settings/wiki/intro/game/pause/exit/death/demo × ru,en,hi × 390,1280; auto PASS/FAIL per V, MANUAL with screenshot, ENV). Run started in background -> agent-transfer/igraspore-v20-10/vcheck, log %TEMP%/vcheck.log.

- 2026-10-27 05:42 vcheck run1: PASS 28 / FAIL 4 / MANUAL 10 / ENV 2, page errors 0. FAIL analysis with screenshots: V42 real (intro OK 1101px vs dialog 512 at 1280) -> CSS cap 420px; V27 real (ru 'Режим картинки: 🎨 Cartoon') -> i18n_hud_ru.js modeLbl.cartoon = '🎨 Мультяшный' (= SoT ru.json); V15 real (colBadge 11px at <=430) -> 12px; V09 false positive (menuO under full-screen opaque setO/helpO/wikiO alpha 1, nothing visible through) -> rule fixed. Re-run -> vcheck2.

- 2026-10-27 05:49 vcheck2: PASS 31 / FAIL 1 / MANUAL 10 / ENV 2 (V09/V15/V27/V42 now PASS). V10 fail = menu .colBadge under setO (ellipsis = V15 fix) -> V10 restricted to elements inside #setO; vcheck3 started. L1 linter: all 116 open findings are translation values in config.js inline dictionaries (T.<lang>.<key>, LANG_NAME endonyms) + 1 fallback code 'ru'; justified one by one in i18n_lint.allow.json (file+line+exact+reason, tools/v20_10_lint_justify.cjs), each re-verified against source (116/116). Linter unchanged: open=0, --strict exit 0.

- 06:31 v20.10: V15/V27/V42 fixed (v20_5.css, i18n_hud_ru.js); vcheck3 32/0/10/2; R7 evidence: NEG=1 -> V09 FAIL + V10 FAIL (rules still catch real defects), archive .10-Archive/v20.10-neg-r7; linter: allow trimmed to 8 endonyms, 107 inline translations reviewed one by one: 0 real errors, open=108 not green (R7); npm 323/323.

- 06:34 v20.10: Choser R7 table, final report 01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.10-2026-10-27_0634.md, CPU 100% measured (perf open).

- 07:13 v20.11: TZ+3 experts d749b3e; T1 before: 104-106 overlapping #N captions/frame at 390 (ru/en/hi), fix in demo.js renderDemoLabels (occupancy, captions only).

- 07:40 v20.11 progress: T1 demo captions overlap 1->0 (fixed measurement: 1 frame), T2 menu header centred dC=0 at 1280/1400, T6 lint dup caught (108->109, positive 108), T3/T5 perf gate running; CPU 100% (openclaw gateway ~1GB, not ours).

- 07:50 v20.11 progress: critic-1 found own bug (caption collision 'continue' skipped possessed ring) -> fixed with flag; cycles restarted on fixed tree; real tap/click START ok 390/1280.

- 08:11 v20.11 progress: cycles 1-2 green, cycle 3 membrane ON aspect 1.092<1.10 (flaky: unseeded player shape; threshold NOT lowered) -> cycles 4-6 started.

- 08:35 v20.11: cycles 5-7 three consecutive green; membrane ON flaky in 3,4 -> fork R8 (Choser); 5 critics: fixed 2, checked 1, open 4; report 01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v20.11-2026-10-27_0830.md.

- 27.10 09:01 v20.12: R8.1 membrane median5 (1.10 kept); V30 demo: banners/panel pre-registered in occupancy, #N deferred after banners, virus chip without plaque + hidden under the panel; colBadge wraps at 1280. npm 323/323.
