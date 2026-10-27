# V01–V44 status (auto, v20.10)

langs ru × vp 390; PASS=29 FAIL=3 MANUAL=10 ENV=2; page errors: 0

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
| V09 | FAIL | ru_390:settings:menuO+setO | ru_390_menu.png |
| V10 | FAIL | ru_390:setO>#negOvf:NEGATIVE CHECK very  | ru_390_settings.png |
| V11 | PASS | death backdrop covers full viewport | ru_390_death.png |
| V12 | MANUAL | old AAB/APK build issue; AAB rebuild is fork R5 (waiting for Alexey) | ru_390_pause.png |
| V13 | PASS | difficulty buttons ≥44px, ≥13px | ru_390_menu.png |
| V14 | PASS | footer labels not clipped | ru_390_menu.png |
| V15 | PASS | card badges ≥12px | ru_390_menu.png |
| V16 | PASS | cards translated | ru_390_menu.png |
| V17 | PASS | Pop/Map hidden in menu | ru_390_menu.png |
| V18 | PASS | lang selector does not overlap title | ru_390_menu.png |
| V19 | MANUAL | pool estimate stability: R6 makes density 1.0 on every screen (vitest density_migrate, mobile_pool) | ru_390_menu.png |
| V20 | MANUAL | second row of cards cut by footer: look at 1280 menu |  |
| V21 | PASS | HUD text inside card at 390 | ru_390_game.png |
| V22 | PASS | no bare "Pop" | ru_390_game.png |
| V23 | PASS | key hints hidden on touch | ru_390_game.png |
| V24 | PASS | action buttons inside screen | ru_390_game.png |
| V25 | MANUAL | status text duplicates / scale bar overlap: look at game 390 | ru_390_game.png |
| V26 | PASS | pause buttons ≥44px | ru_390_pause.png |
| V27 | PASS | settings translated | ru_390_settings.png |
| V28 | PASS | settings targets ≥48 | ru_390_settings.png |
| V29 | FAIL | ru_390:panel alpha 0/0.4 | ru_390_settings.png |
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
| V40 | MANUAL | menu header grid at 1280: look at screenshot |  |
| V41 | PASS | category row fits/wraps | ru_390_menu.png |
| V42 | PASS | intro OK ≤ dialog width |  |
| V43 | PASS | actBar hidden on death |  |
| V44 | ENV | System UI not responding = emulator environment, not a game defect |  |