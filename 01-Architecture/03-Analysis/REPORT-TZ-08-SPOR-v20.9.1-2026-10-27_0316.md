# REPORT TZ-08-SPOR v20.9.1 — 2026-10-27_0316 (UTC+3)

Ветка release-ready-2026-10-14. Стенд: http://127.0.0.1:8821/ (репо), база http://127.0.0.1:8822/ (worktree 289ed40). Лаборатория тестов: http://127.0.0.1:8793/lab/tests

## Коммиты (все запушены, ветка = origin)
| Хэш | Этап | Суть |
|---|---|---|
| c18ffc9 | 0 | K2 убрана подмена силуэта paintTestSilhouette (архив .10-Archive\v20.9.1-test-substitution), K3/K4 AGENTS.md/package.json восстановлены, K10 мусор в .10-Archive, i18n exit/death/help в config.js |
| a5e0f54 | 1 | K5 fine-grid соседей, getNearby для колоний/вирусов/осадка, sweep пузырей, ранний reject getTempAt; tools v20_9_fps/cpuprof |
| 5b511fd | 2 | K6 пул одинаков на телефоне (снят mobile density cap), K7 компактный HUD ≤430 + неразрывные токены (ที่กำบัง), K8 шрифт START = DEMO/AQUARIUM, KOLONIE в 1 строку; tools v20_9_shots |
| b5e6124 | 3 | R2 маска M1 «отличие от цвета фона» (пороги не тронуты), R3 hud_contract отвечает «Нет» и проверяет, что диалог висит; Choser R1–R3 |

## FPS / старт (5 прогонов, ru, 20 с, сид Math.random, один стенд подряд, CPU машины 100% во время замера)
| Экран | База 289ed40 fps мед (min) / кадр мс / меню мс | Текущий | Прирост |
|---|---|---|---|
| 1280×800 | 5.7 (3.5) / 468 / 2621 | 9.4 (5.7) / 393 / 3545 | +65% fps |
| 390×844 | 5.8 (0.5) / 574 / 4061 | 5.5 (1.9) / 1105 / 12510 | неравно: пул 390 теперь ~1800 вместо ~1000 (K6) |
Цель ≥30 FPS НЕ достигнута; приёмка перенесена на свободную машину (решение R1).

### Фазы кадра (1280, текущий, профиль CDP)
| Фаза | Доля/время |
|---|---|
| sim (updateWorld+updateOrg) | ~100 мс/кадр; updateOrg 16%, updateWorld 16% self |
| getTempAt | 10% |
| naturalAI | 8% |
| getNearby / dist2 | 7% / 7% |
| render (world+entities+membranes+particles+ui) | ~7 мс |

## Тесты
- npm test (vitest): 313/313 после каждого этапа.
- qa_unit: 26/26.
- run-all-tests.ps1 (GATE_BASE_URL=8821, лог 09-Docs\test-runs\logs\20261027-0100): playwright 65 pass / 5 fail → после R3 hud_contract «меню паузы» ru/en/hi 3/3 PASS. Остаются: i18n_overflow ru 390 tutorial nav (click timeout), perf_start мир 4.7 с > 3 с (CPU).
- M1 ON (новая маска): PASS. Негативная проверка (MEMB_A/NOSE/STRETCH=0): тест FAIL на аспекте — ловит сломанную мембрану. Скрин: C:\Users\Space\agent-transfer\igraspore-v20-9-1\M1-negative-broken.png. M1 OFF: медиана XOR 0.9% > 0.5% — открыт.
  - Было: маска = альфа>60 в кольце; канвас непрозрачный → маска всегда полное кольцо → XOR=0 (проходило только с подменой силуэта). Стало: пиксель ≠ цвет фона (медиана 4 углов), сумма |ΔRGB|>60.
- B1px вирус: PASS.
- 3+3 зелёных цикла: НЕ выполнено (есть красные: M1 OFF, i18n_overflow ru 390, perf_start) → v20.10.

## E2 скриншоты
- Веб: 240/240 OK (20 яз × 1280/390 × menu/game/pause/settings/bestiary/death; скрипт проверяет видимость оверлея, иначе FAIL). C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\ + status.json.
- Эмулятор kq_test35 (-no-window, Chrome через CDP): прогон1 41/48 OK, 7 таймаутов среды; повтор в C:\Users\Space\agent-transfer\igraspore-v20-9-1\emu2\. Цель 60 кадров (20×3).
- Глазами проверены: de 390 menu (до/после K8), th 390 game (до/после K7), bn 390 death, hi 390 pause, emu ru menu, M1 negative.

## Ключи по 20 языкам
Переводы не удалялись; es/tr/fil не трогались. В config.js добавлены exit/death/help для pt-BR..bn (раньше были в igs_v20.js). Ключ x.cover/x.cyst2 выводится неразрывно.

## Скриншоты (Windows)
1. C:\Users\Space\agent-transfer\igraspore-v20-9-1\shots-a\de_390_menu.png (до K8)
2. C:\Users\Space\agent-transfer\igraspore-v20-9-1\shots-b\de_390_menu.png (после K8)
3. C:\Users\Space\agent-transfer\igraspore-v20-9-1\shots-a\th_390_game.png (до K7)
4. C:\Users\Space\agent-transfer\igraspore-v20-9-1\shots-b\th_390_game.png (после K7)
5. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\bn_390_death.png
6. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\hi_390_pause.png
7. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\ja_1280_menu.png
8. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\ru_1280_game.png
9. C:\Users\Space\agent-transfer\igraspore-v20-9-1\emu\emu_ru_menu.png
10. C:\Users\Space\agent-transfer\igraspore-v20-9-1\M1-negative-broken.png
11. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\th_1280_settings.png
12. C:\Users\Space\agent-transfer\igraspore-v20-9-1\e2\de_390_bestiary.png

## Не сделано
- AAB/APK: сборка требует обновить apk_proj\assets\www — запрещено ТЗ → не собирал.
- V01–V44 и 116 замечаний линтера, world diversity probe (3 хэша), 3+3 зелёных циклов, M1 OFF, i18n_overflow ru 390, perf_start ≤3 с, FPS ≥30.
- K10 частично: TZ-08-20261026-0x, capture-screenshots.js, sw.js, favicon не закоммичены (чужие/неясные изменения).

## Развилки
- R1 FPS (решено супервизором: приёмка утром, мерить прирост с CPU%). Таблица: 01-Architecture\Таблицы-выбора\choser-08-igraspore-r1-fps-20261027.json
- R2 маска M1 (решено: отличие от фона; сделано). choser-08-igraspore-r2-m1-mask-20261027.json
- R3 exitConfirm (решено: явный «Нет»; сделано). choser-08-igraspore-r3-exitconfirm-20261027.json
- R4 (новая, не решена): M1 OFF XOR 0.9% из-за фона/частиц в кольце. Варианты: offscreen-рендер игрока для замера / маска по hue тела / геометрия из membranePath. Рекомендация: offscreen (валидно, без подмены видимого рендера). Не делал.
- R5 (новая): AAB при запрете правки apk_proj\assets\www — нужен разрешённый шаг синхронизации или отдельная сборка из чистого дерева. Не делал.
- R6: сохранённая в localStorage плотность на телефонах может держать старый пул — миграция настроек или нет.
