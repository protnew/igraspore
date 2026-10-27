# V01–V44 status (auto, v20.10)

langs ru,en,hi × vp 390,1280; PASS=32 FAIL=0 MANUAL=10 ENV=2; page errors: 0

| V | status | evidence | screenshot |
|---|---|---|---|
| V01 | MANUAL | player-cell plaque: look at the screenshot (not measurable from DOM, canvas) | ru_390_game.png |
| V02 | PASS | #pauseBtn hidden in menu (all lang×vp) | ru_390_menu.png |
| V03 | PASS | ≤1 pause button visible at 390 | ru_390_game.png |
| V04 | MANUAL | death counters: check Starved+Eaten+Other=Dead in deadStats text | ru_390_death.png |
| V05 | PASS | Exit dialog translated | ru_390_exit.png |
| V06 | PASS | pExit/pMore translated, centered | ru_390_pause.png |
| V07 | PASS | death title translated | ru_390_death.png |
| V08 | PASS | touch help at 390 | ru_390_help.png |
| V09 | PASS | one overlay at a time (exit = pause+confirm by design) | ru_390_menu.png |
| V10 | PASS | no overflow in settings at 390 | ru_390_settings.png |
| V11 | PASS | death backdrop covers full viewport | ru_390_death.png |
| V12 | MANUAL | old AAB/APK build issue; AAB rebuild is fork R5 (waiting for Alexey) | ru_390_pause.png |
| V13 | PASS | difficulty buttons ≥44px, ≥13px | ru_390_menu.png |
| V14 | PASS | footer labels not clipped | ru_390_menu.png |
| V15 | PASS | card badges ≥12px | ru_390_menu.png |
| V16 | PASS | cards translated | ru_390_menu.png |
| V17 | PASS | Pop/Map hidden in menu | ru_390_menu.png |
| V18 | PASS | lang selector does not overlap title | ru_390_menu.png |
| V19 | MANUAL | pool estimate stability: R6 makes density 1.0 on every screen (vitest density_migrate, mobile_pool) | ru_390_menu.png |
| V20 | MANUAL | second row of cards cut by footer: look at 1280 menu | ru_1280_menu.png |
| V21 | PASS | HUD text inside card at 390 | ru_390_game.png |
| V22 | PASS | no bare "Pop" | ru_390_game.png |
| V23 | PASS | key hints hidden on touch | ru_390_game.png |
| V24 | PASS | action buttons inside screen | ru_390_game.png |
| V25 | MANUAL | status text duplicates / scale bar overlap: look at game 390 | ru_390_game.png |
| V26 | PASS | pause buttons ≥44px | ru_390_pause.png |
| V27 | PASS | settings translated | ru_390_settings.png |
| V28 | PASS | settings targets ≥48 | ru_390_settings.png |
| V29 | PASS | settings panel opaque ≥0.85 | ru_390_settings.png |
| V30 | MANUAL | demo group labels / hint: look at demo 390 | ru_390_demo.png |
| V31 | PASS | demo buttons ≥48 at 390 | ru_390_demo.png |
| V32 | MANUAL | player HUD ghost text in demo: look at demo 390 | ru_390_demo.png |
| V33 | PASS | death screen clean at 390 | ru_390_death.png |
| V34 | PASS | no "Global" in death causes | ru_390_death.png |
| V35 | PASS | wiki search ≥40px | ru_390_wiki.png |
| V36 | PASS | no pause button over intro | ru_390_intro.png |
| V37 | PASS | title v3, no RU/EN mix | ru_390_menu.png |
| V38 | ENV | Capacitor splash: phone build only; AAB rebuild = fork R5 |  |
| V39 | MANUAL | empty menu buttons at phone start: emulator shots emu/emu2 v20.9.1 | ru_390_menu.png |
| V40 | MANUAL | menu header grid at 1280: look at screenshot | ru_1280_menu.png |
| V41 | PASS | category row fits/wraps | ru_390_menu.png |
| V42 | PASS | intro OK ≤ dialog width | ru_1280_intro.png |
| V43 | PASS | actBar hidden on death | ru_1280_death.png |
| V44 | ENV | System UI not responding = emulator environment, not a game defect |  |

## Manual verdicts (screenshots opened by the executor, 27.10 ~06:00 UTC+3)

| V | verdict | what is on the screenshot | file (vcheck2/vcheck3) |
|---|---|---|---|
| V01 | PASS | player cell drawn on water, no black square plaque | ru_390_game.png |
| V04 | PASS | ru 390: Голод 1 + Съедено 6 + Прочее 0 = Погибло 7 | ru_390_death.png |
| V12 | WAIT (R5) | old AAB issue; AAB rebuild = fork R5, waiting for Alexey | — |
| V19 | PASS (by tests) | density 1.0 on every screen: vitest mobile_pool + density_migrate (R6) | — |
| V20 | PASS | 1280 menu: one full card row, footer does not cut borders | ru_1280_menu.png |
| V25 | PASS | status "слишком молода" once (panel), 100 µm scale does not overlap it | ru_390_game.png |
| V30 | PARTIAL | group labels readable; species numbers overlap each other in dense rows (#88/#62) | ru_390_demo.png |
| V32 | PASS | no player HUD ghost text in demo | ru_390_demo.png |
| V39 | ENV-check | needs phone cold start; v20.9.1 emulator shots emu/emu2 had text on buttons | — |
| V40 | PARTIAL | 1280: title/subtitle ~10px from the left edge; START/DEMO/AQUARIUM no dark plaque any more | ru_1280_menu.png |

Residual notes for PASS-by-metric items: V13 difficulty buttons are ≥44px and ≥13px but still full-width bars (segment control not done); V33 death title is left-aligned on 390 (no overlap, no black band).

**Totals (auto+manual):** PASS 38 · PARTIAL 2 (V30, V40) · WAIT R5 1 (V12) · ENV 3 (V38, V39, V44) · FAIL 0.
Fixed this round: V15 (badge 12px), V27 (ru "Мультяшный"), V42 (intro OK ≤420px).

## R7 — доказательства (обновлено ~06:40 MSK)
| Пункт | Ложное срабатывание (до) | После | Негативная проверка (NEG=1) | Итог |
|---|---|---|---|---|
| V09 | FAIL «menuO+setO / menuO+helpO / menuO+wikiO»: меню под полностью непрозрачным оверлеем (alpha 1). .10-Archive/v20.10-neg-r7/V09-before-FP-*.png | PASS (vcheck3) | setO сделан полупрозрачным (alpha 0.4) поверх меню → **V09 FAIL** «ru_390:settings:menuO+setO» | правило ловит реальный дефект |
| V10 | старое правило считало переполнение в любых элементах, в т.ч. menuO>colBadge под непрозрачным setO (vcheck2 FAIL) | PASS (vcheck3) | в панель setO вставлен обрезанный ярлык → **V10 FAIL** «setO>#negOvf» | правило ловит реальный дефект |

Линтер (по решению 06:00): в allow остаются только 8 самоназваний языков (config.js:4). 107 inline-переводов и код 'ru' (config.js:65) проверены поштучно: настоящих ошибок 0 (сравнение со значением en: одно совпадение it.no="No" — верный итальянский). В allow не внесены → линтер open=108, **не зелёный**, ждёт решения R7. Негатив: новый литерал → open 109 (ловится). Слабое место: дубликат того же endonym в той же строке 4 проходит (привязка line+exact).
