# REPORT TZ-08-SPOR v20.2 — 21.10.2026 18:43

ТЗ: `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\CHECK-DEV-2026-10-21-v20-1.md`

Ветка: `release-ready-2026-10-14` HEAD `fb53a10` = origin.

## Проблема

AAB 3 200 573 Б был легаси без `igs_v20.js`. `cf-publish\04-Src\js` отставал от `.04-Src\js` (17 sha + не хватало i18n_hud_en/ru). Коммит `2bfbe28` заставлял контракт ждать стенд v3-webgl на :8795. Четыре бага UI: диалог "Выйти?" снимал паузу; заставка шла в `startGame(true)` а не Demo; вирус мельче 3 px без контура; HUD энергии писал 100/100 при 112; в паузе куча кнопок.

## Решение

1. Push `4cda2ec` `426f20a` `c327987` (и неизбежно `2bfbe28` как предок). Затем `git revert 2bfbe28` -> `8e60561`, push.
2. Копия 45 `*.js` из `.04-Src\js` в `cf-publish\04-Src\js`. 0 расхождений sha.
3. `igs_v20.js`: `pExit` и `ecNo` держат `state=paused`. Подложка `exitConfirm`: `rgba(0,0,0,0.5)` + `blur(6px)`.
4. `screensaverBtn` -> `startDemoMode` (zoom 0.58, облёт, кнопка 48 px).
5. Вирус: `PHAGE_R = max(virusHeadR(), 3/zoom)` + контур. Пауза: видимы RESUME и Exit. HUD: текст = `Math.round(player.energy)` без clamp 100/100.
6. `npx cap sync` (webDir `../cf-publish`), `gradlew bundleRelease` на JDK 21, `sign-local.ps1` (jar verified).

v3-webgl не правился и не был источником.

## Результат

AAB:

```
C:\Obsidian\New\Projects\08-iGraSpore_V2\06-DevOps-and-Release\android\android\app\build\outputs\bundle\release\app-release.aab
```

Размер 111 940 950 Б. `igs_v20.js` внутри `base/assets/public/04-Src/js/igs_v20.js`. sha256 префикс `359937d01eadf7c2` совпадает с `.04-Src\js` и `cf-publish`. Подпись: jarsigner exit 0, `jar verified.`

Стенд приёмки: :8795 занят чужим процессом `kqstage\wt-spor-repro` (v3-webgl), не останавливал. Релиз крутится на уже поднятом :8797 (`serve-static.mjs` корень этого репо). Клики и 17 скринов сняты с :8797.

Vitest с `NODE_OPTIONS=--localstorage-file`: 298 pass / 2 fail / 300. Оба fail в `ui_restore.test.js`: тест ждёт текст `100/100`, ТЗ велело показывать реальное 109. Тесты не подкручивал.

Playwright v20 на :8797: B2.1-B2.4 (Esc / Выйти? Нет / Да) pass. Остальные спеки падают на intro/demo/HUD-контракте v20, не на четырёх багах этого ТЗ. Полный `run-all-tests.ps1` 0 fail / 0 skip не получен: контракт ходил бы в :8795 v3.

Старый AAB 3 200 573 Б перезаписан gradle в том же пути, в `.10-Archive` не успел. Файл 3 200 576 Б на диске не найден.

## Пункт / тест до / тест после / доказательство

| Пункт | Тест до | Тест после | Доказательство |
|---|---|---|---|
| 1 push + revert 2bfbe28 | origin 956c1d3, ahead 4, 8795=v3 | origin=fb53a10, revert 8e60561 | git log `8e60561` `fb53a10` |
| 2 cf-publish 45 js | 43 файла, 17 sha diff | 45/45 sha 0 | таблица sha ниже |
| 3 Выйти? пауза + подложка | state=playing, energy едет | state=paused до и после Нет, bg rgba(0,0,0,0.5) blur 6px, energy 110.17=110.17 | `06-exit-confirm.png` `07-after-no.png` shots.json |
| 4 Screensaver=Demo | startGame(true) | demoMode true, zoom 0.58, inFrame 101, exit 48x48, cam сдвинулась | `12-screensaver.png` `10-demo.png` |
| 5 вирус 3px, один Exit, HUD | virus пыль, много кнопок паузы, HUD 100/100 | VIRUS_SCALE 0.08 screenR 3, пауза RESUME+Exit, HUD 110 и 120 | `13-virus.png` `05-esc-pause.png` `04-playing.png` |
| 6 AAB | 3 200 573 без igs_v20 | 111 940 950, igs_v20 внутри, 45/45 sha, signed | путь AAB выше |

## Скрины (17) — `C:\Users\Space\agent-transfer\igraspore-v20-2\`

| Файл | Что на снимке | state |
|---|---|---|
| 01-menu.png | Меню v2.0.0, HUD display none | menu |
| 02-start-card-pause.png | Карточка роли, игра на паузе, energy 100 | paused |
| 03-start-paused-3s.png | Через 3 с всё ещё paused, energy 100 | paused |
| 04-playing.png | Игра, HUD Energy 110 / 120 | playing |
| 05-esc-pause.png | Пауза: RESUME + Exit, extras display none | paused |
| 06-exit-confirm.png | Выйти? подложка 0.5+blur | paused |
| 07-after-no.png | Нет: confirm скрыт, пауза осталась, energy не ехала | paused |
| 08-membrane-a.png | Игра кадр мембраны A | playing |
| 09-membrane-b.png | Игра кадр мембраны B | playing |
| 10-demo.png | Demo zoom 0.58, 101 в кадре, X 48px | playing + demoMode |
| 11-demo-3s.png | Demo через 3 с, камера уехала | playing + demoMode |
| 12-screensaver.png | Заставка = demoMode, zoom 0.58, 101, exit 48 | playing + demoMode |
| 13-virus.png | virusPlayer T4, 20 phages, screenPx 3, scale 0.08 | playing spectator |
| 14-dead-restart.png | deadO + RESTART | dead |
| 15-after-restart.png | После RESTART снова карточка | paused |
| 16-zh-TW-390x844.png | zh-TW меню, кнопка 開始, 390x844 | menu |
| 17-zh-mobile-play.png | zh-TW мобильная игра, HUD block | playing |

Консоль Playwright на этих кликах: 0 ошибок (`cons: []`).

## sha 45 файлов SoT = cf-publish = AAB (префикс sha256)

| файл | sha256[:16] | расхождений |
|---|---|---|
| ai.js | `b5fd908a3bcd9a9e` | 0 |
| ai_move.js | `59a14c00cf16446a` | 0 |
| biology.js | `08d49ba94ebc7b15` | 0 |
| biology_divide.js | `b1917ad44f9f682f` | 0 |
| biology_eat.js | `74153c5d5f44f682` | 0 |
| biology_update.js | `b9311000a3b7a633` | 0 |
| biology_update_core.js | `e8f9b81e72697173` | 0 |
| biology_update_interact.js | `eb71e5d10fe693c9` | 0 |
| biology_virus.js | `65150eaae8e5441f` | 0 |
| camera_follow.js | `c575d321ca919a43` | 0 |
| config.js | `53091fb90ae1040d` | 0 |
| demo.js | `5827f422c4b139a9` | 0 |
| entity_labels.js | `6267366141c0c85d` | 0 |
| i18n_detect.js | `4c54184c83f2cd4c` | 0 |
| i18n_hud.js | `7ee3fd3516379e67` | 0 |
| i18n_hud_en.js | `c6d5ee1574819a26` | 0 |
| i18n_hud_ru.js | `6ddcd5c0265ce792` | 0 |
| igs_v20.js | `359937d01eadf7c2` | 0 |
| lifecycle.js | `b75de4eb4c2793f2` | 0 |
| locomotion.js | `de09f2cb6bdad861` | 0 |
| main.js | `d8e75001db322f39` | 0 |
| main_events.js | `2090dbb5ac6c2dc6` | 0 |
| mobile.js | `cb2cb61e8c8914cb` | 0 |
| night_sky.js | `6cf6507f2527ad7f` | 0 |
| organs.js | `f9c63f9ea82cc198` | 0 |
| render.js | `c440a4be857c1a8f` | 0 |
| render_edu.js | `203c4a627b21747a` | 0 |
| render_effects.js | `89b68dc40347765c` | 0 |
| render_entities.js | `69b13b7aaecac559` | 0 |
| render_fx.js | `28f7ad8b00ede32c` | 0 |
| render_helpers.js | `b6e01b228b457f26` | 0 |
| render_membrane.js | `48fe7fb56d30b97b` | 0 |
| render_organs.js | `db4b294109f3714a` | 0 |
| render_surface.js | `8bc8a91cfed2827e` | 0 |
| render_swiss.js | `354865e809ab0f59` | 0 |
| render_webgl.js | `f488f2a6b0125eb4` | 0 |
| stars.js | `d24b6a3a4955df82` | 0 |
| toast_queue.js | `94282eb7f350f0fd` | 0 |
| ui.js | `f5f4af4c1aef4b5b` | 0 |
| ui_food_chain.js | `8b9fef1787f5bf3e` | 0 |
| ui_menus.js | `dfd2d3a8b96e204d` | 0 |
| ui_screens.js | `88180d84a1a6a148` | 0 |
| wiki_articles.js | `71e38c9884e2c46d` | 0 |
| world.js | `3a4159031cc052dc` | 0 |
| world_update.js | `3fd1dcbc547c61ef` | 0 |

## Коммиты этого прогона

- push `956c1d3..c327987`
- `8e60561` revert 2bfbe28
- `fb53a10` sync cf-publish + UI v20.2

## git status в конце

HEAD `fb53a10` = origin/release-ready-2026-10-14. Грязь: фабрика 01-08 json/md, backlog db, playwright-v20/_helpers.js, playwright.v20.config.js (CJS, не коммитил), ACCEPT-v20 скрины. `git add -A` не использовал.

## Не закрыто

1. :8795 остаётся v3-webgl (kqstage). Релиз на :8797.
2. `run-all-tests.ps1` целиком 0 fail / 0 skip не прогнан.
3. Vitest 2 fail на политике HUD 100/100 vs реальное число.
4. Старый AAB 3 200 573 Б не в `.10-Archive` (перезаписан).
5. Playwright v20 кроме B2.* — fail (спеки introO/HUD), тесты не менял.
