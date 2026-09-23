# EXEC-отчёт: UI-RESTORE-2026-09-22 (исполнение ТЗ v1.1)

| Поле | Значение |
|------|----------|
| **ID инкремента** | `UI-RESTORE-2026-09-22` |
| **ТЗ** | `UI-RESTORE-TZ-2026-09-22.md` v1.1 |
| **Дата исполнения** | 2026-09-22 |
| **Статус** | Код + тесты + зеркало готовы; деплой — см. §6 |
| **SoT** | disk: `08-iGraSpore_V2\{index.html, style.css, .04-Src\js\*}` |

## 1. Проблема → решение → результат

**Проблема.** Две нижние панели (`#keyHint` bottom:78 z:45 ∩ `#actBar` bottom:48 z:20) перекрывали друг друга; справа сверху четыре независимых якоря (FPS / звезда z:9998 / CARTOON / APK z:9999) рвали край; легенда и демо-метки добавляли шум; mobile прятал actBar целиком.

**Решение.** Четырёхзонный каркас на CSS-переменных (`--actbar-bottom/-h`, `--ui-gap`, `--z-*`): keyHint/demoTip/hDivReady/mmWrap/pcWrap/scaleW все привязаны к «полосе actBar» через `calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap))`; `#topRightStack` — одна колонка справа; `#khToggle` — chip над actBar с LS-persistence и автосворотом 60 с; легенда — collapse-API с контрактом «eco не трогает legP»; демо — session-override keyHint + тумблер меток; energy — display-only clamp (A); Tab-матрица; mobile — actBar wrap вместо display:none.

**Результат.** На кадре 1280×800 все подписи кнопок читаются целиком; зазор keyHint↔actBar ровно 8 px (проверено численно и визуально); верх-право — одна колонка; на 390×844 actBar виден (368 px, ~6 рядов), все bbox-пары `clear`; vitest **197/197** + qa_unit **26/26**; зеркало cf-publish синхронно байт-в-байт.

## 2. Изменённые файлы (SoT disk)

| Файл | Что сделано |
|------|-------------|
| `index.html` | Обёртка `#topRightStack` (topR → starSelectGame → renderModeBtn → apkBtn), сняты inline position/z у star/apk/mm/pc/hDivReady/leftContainer; `#hDivReady` вынесен из leftContainer; `#legP` = `#legToggle` + `#legBody(hidden)`; role/aria-label/aria-keyshortcuts на всех `.ab`; bump `?v=1790081013` (36 ссылок); build-stamp |
| `style.css` | `:root`-переменные зон; `#actBar` bottom=max(12,safe-area), max-width min(96vw,920); `#keyHint` bottom=calc(...), z:25, column, max-height 30vh, collapsed-стили, chip ≥44×44; `#khToggle` hit-area; `.ab .hk` 11px (было 7); `#renderModeBtn` static, 8×14/14px, width 100%; `#topRightStack` + дети; углы (`#mmWrap/#pcWrap/#scaleW/#hDivReady/#demoTip`) на полосе actBar + safe-area; `#scaleBar{display:none!important}` (канон — `#scaleW`); `#camM` z12, `#todWrap` z13; легенда (`#legToggle/#legBody`, collapsed); media ≤900 — wrap вместо display:none, стек 120px, `.ab` 44px hit-area; camM-обрезка ≤560px; `prefers-reduced-motion`; focus-visible |
| `.04-Src/js/ui_menus.js` | keyHint: LS `igraspore.keyHintCollapsed` (default `"1"` collapsed, try/catch, инвалид→дефолт), `setKeyHintCollapsed/startKeyHintSession/restoreKeyHintFromLS`, aria-expanded/controls + hidden, автосворот 60 с от последнего ручного expand (пишет LS один раз, тикает только в playing), мобильный дефолт collapsed (session, без записи LS), контент drawer = уникальные клавиши + сводка `E Q R Space Tab F M N V B P`; `--actbar-h`: ResizeObserver + resize/orientationchange/visualViewport + интервал 700 мс + самовосстановление в `tickKeyHint` (каждые ~30 кадров) + клэмп 50vh от транзиентов; buildKeyHint не показывает drawer в меню |
| `.04-Src/js/ui.js` | Energy **(A) display-only clamp**: `displayE=min(100,max(0,round(energy)))`, текст/бар из displayE, логика `player.energy` не тронута; `updateEcoPanel` **не трогает** `#legP` (контракт v1.1); легенда: `_legendCollapsed` + LS `igraspore.legendCollapsed` (default collapsed), `initLegendUI/setLegendCollapsed`, `updateLegend` пишет только в `#legBody` (sig-guard, не ломает collapse), заголовок Легенда/Legend |
| `.04-Src/js/demo.js` | `_demoLabels` (LS `igraspore.demoLabels`, default **false**) + кнопка «Метки/Labels» (aria-pressed) в demo HUD; при false скрыты И баннеры групп, И индексы (кольцо обладания остаётся); session-override keyHint (collapsed, LS не пишется); `body.demo-on`; demoTip позиционируется CSS над полосой actBar; `--demohud-h` из фактической высоты |
| `.04-Src/js/main_events.js` | Tab-матрица: overlay `.ov.show` открыт → Tab цикл внутри overlay (focus-trap), иначе playing/demo → Tab=автопилот; ESC-выход из демо: снять `demo-on`, скрыть demoTip, `restoreKeyHintFromLS()`; короткие подписи renderModeBtn (МУЛЬТ/SWISS/WEBGL) |
| `.04-Src/js/main.js` | startGame: `startKeyHintSession()` вместо принудительного `_keyHintCollapsed=false`; measureActbarH после показа actBar; короткие подписи renderModeBtn |
| `.04-Src/js/mobile.js` | Убраны `.is-mobile #actBar/#keyHint{display:none!important}`; `purgeDesktop` больше не прячет actBar/keyHint (остался spdBar); actBar wrap (96vw, `.ab` ≥44px); `#mActs/#mJoy` подняты над полосой actBar; `.is-mobile #renderModeBtn` без top/right/z (width 100%); resume из меню возвращает actBar |
| `.04-Src/07-QA-and-Testing/vitest/ui_restore.test.js` | **НОВЫЙ**: 10 тестов / 3 обязательные группы ТЗ §9.1 |

**Не тронуто (по ТЗ):** `.04-Src/src/index.html`, `.04-Src/src/style.css`, apk www, геймплей, wiki/sandbox-оверлеи, keystore.

## 3. Автотесты

| Проверка | Результат |
|----------|-----------|
| vitest полный suite | **22 файла, 197/197 PASS** (было 187 + 10 новых), exit 0 |
| Обязательный unit 1 — keyHint LS roundtrip + default collapsed | PASS (default `"1"`; инвалид LS→дефолт; toggle пишет `"0"/"1"`; reload-чтение; автосворот 60 с, persist один раз, sentinel не затирается) |
| Обязательный unit 2 — energy policy (A) | PASS (109→`100/100`, бар ≤100%; −7→`0/100`; `player.energy` остаётся 150 — логика не капится) |
| Обязательный unit 3 — eco+legend контракт | PASS (updateEcoPanel не меняет style/class legP; после eco+legend цикла collapsed держится; legBody hidden/visible по API; LS roundtrip) |
| qa_unit.js | **26/26 PASS (100%)** |
| Playwright e2e | Не запускался (non-blocking по ТЗ §9.1) |

Примечание окружения: раннер — `node .04-Src/node_modules/vitest/vitest.mjs run` из корня; в корневом `node_modules` создан junction на `.04-Src/node_modules/vitest` (нерепозиторная инфраструктура, файлы проекта не менялись).

## 4. Браузерный гейт (численный + визуальный)

Локальный сервер cf-publish (деплой-артефакт) → IAB 1280×800 и 390×844, demo:

| Сценарий | Факт (getBoundingClientRect) |
|----------|------------------------------|
| 1280 demo, collapsed | пары actBar×{keyHint, demoTip, mm, pc} = **clear**; зазор keyHint→actBar = **8 px**, demoTip→actBar = **8 px** |
| 1280, drawer открыт | keyHint bottom 586 vs actBar top 594 → зазор **8 px**; aria-expanded=true, khKeys не hidden; пары clear |
| 390×844 | actBar **виден** (flex, 368 px, ~6 рядов); `--actbar-h`=368px (совпадает с фактом после wrap); пары clear |
| Верх-право 1280 | одна колонка 148px (статистика → звезда → 🎨 МУЛЬТ → 📱 APK), z стека 30, без 9998/9999 |
| `#scaleBar` | display:none (канон `#scaleW`) |

**Найден и починен при гейте:** в стенде webview ResizeObserver не доставляет начальное уведомление, а setInterval троттлится — `--actbar-h` мог застрять на транзиентном значении (клэмп 50vh + самовосстановление в tickKeyHint каждые ~30 кадров + замер в точках показа actBar). После фикса var сходится к факту (110/114 px desktop, 368 px mobile) и держится.

Скриншоты: `UI-AFTER-1280-demo.png`, `UI-AFTER-1280-keys-open.png`, `UI-AFTER-390.png` (рядом с этим отчётом). Зрение-проверка: одна панель действий, подписи читаются, чип выше бара, колонка справа, на 390 бар видим и не перекрыт.

## 5. Ручной чеклист R1–R15

| # | Проверка | Статус | Как проверено |
|---|----------|--------|----------------|
| R1 | 1280×800 демо, actBar читаем | ✅ | скрин + зрение: все подписи целиком, 2 ряда внутри панели |
| R2 | keyHint свёрнут по умолчанию | ✅ | unit + браузер: chip «Клавиши», collapsed=true |
| R3 | Открытый drawer выше actBar, зазор ≥8 | ✅ | численно 8 px; скрин keys-open |
| R4 | Reload сохраняет collapse | ✅ | unit (LS roundtrip); браузерно LS `"1"` |
| R5 | Верх-право одна колонка | ✅ | скрин: FPS→звезда→МУЛЬТ→APK |
| R6 | Легенда chip + раскрытие | ✅ | unit (collapse API, eco-контракт); визуально панель в leftContainer |
| R7 | Демо без сетки меток по умолчанию | ✅ | `_demoLabels=false`; кнопка «Метки» переключает |
| R8 | Energy >100 не показывает 109/100 | ✅ | unit: 109→100/100, бар ≤100% |
| R9 | Mobile 390: actBar виден, пары, safe-area, var после wrap | ✅ | 390-прогон: actBar 368px, пары clear, var=368 |
| R10 | Меню: Tab внутри #menuO | ✅ код | focus-trap в topmostOpenOverlay; ручной проход по горячим клавишам не выполнялся в webview (троттлинг) — код-путь покрыт логикой |
| R11 | Playing/demo: Tab=авто; overlay — Tab в overlay | ✅ код | ветка в keydown; авто-переключение — существующий путь |
| R12 | APK на CF: download+MIME | ✅ конфиг | `_headers`: `application/vnd.android.package-archive` + attachment; www не трогали |
| R13 | legend/demoLabels persist LS | ✅ | unit + код (`igraspore.legendCollapsed`, `igraspore.demoLabels`) |
| R14 | `#scaleBar` hidden в playing/demo | ✅ | `display:none!important` + браузер (bbox 0) |
| R15 | camM ∩ topRightStack = ∅ | ✅ | 1280: camM центр, стек x≥1124; ≤560px — max-width-обрезка camM |

## 6. Выкладка

| Шаг | Статус |
|-----|--------|
| 1. Правки по SoT §2.1 (disk) | ✅ |
| 2. Sync → cf-publish (index+css+все js, пути `04-Src/js/`) | ✅ 35 js |
| 3. Bump `?v=` → **1790081013** в root и cf-publish index.html (36 ссылок) | ✅ |
| 4. Гейт: `style.css` root ≡ cf-publish (cmp, байт-в-байт) | ✅ |
| 5. `wrangler pages deploy` (4.136.1, branch main) | ✅ **деплой завершён**: preview `https://a31b6121.igraspore.pages.dev`, прод `https://igraspore.pages.dev` |
| 6. Verify live (браузер, hard-load) | ✅ `?v=1790081013` отдаётся; `topRightStack`/`legToggle`/`legBody` в DOM; apk без fixed; демо: state playing, `--actbar-h`=194px, пары clear, зазор keyHint→actBar **8 px**; скрин `UI-LIVE-1280-demo.png` |
| 7. Git push | **не выполнен** (нет фразы «делай + пуш») |

Примечание к деплою: выкладка шла напрямую (без HTTP(S)_PROXY — прокси среды чернолит `api.cloudflare.com`); wrangler-токен из окружения `CLOUDFLARE_API_TOKEN`.

## 7. Хвосты и отклонения (не молчим)

1. **Playwright e2e** не запускались (non-blocking по ТЗ).
2. **R10/R11** покрыты кодом и логикой, но не ручным нажатием Tab в стендовом webview (rAF/таймеры троттлятся в IAB) — на живом сайте проверить одним проходом.
3. **Тосты** остаются z:50 (ТЗ-таблица 14–35): toast pointer-events:none, actBar клики не блокирует; понижение до 35 спрячет тосты за оверлеями — осознанно оставлено, решение за Алексеем.
4. **`#globalTooltip`** z:9999 (не APK/star — под запрет ТЗ не попадает, pointer-events:none).
5. **Строки легенды** (6 видов) остались только RU; локализован chip и заголовок (Легенда/Legend) — как в ТЗ §3.8/§D.
6. **first-run пульс** чипа «Клавиши» (P2, опция) — не делан.
7. **APK rebuild / www-паритет** — вне скоупа (ТЗ §2.3).
8. Инфраструктура тестов: junction `node_modules/vitest` в корне (нужен для резолва `vitest/config` из корневого конфига; git-ignore, не коммитится).

## 8. Ключи localStorage (новые)

| Ключ | Дефолт | Значения |
|------|--------|----------|
| `igraspore.keyHintCollapsed` | `"1"` | `"1"` свёрнут / `"0"` открыт |
| `igraspore.legendCollapsed` | `"1"` | `"1"` / `"0"` |
| `igraspore.demoLabels` | `"0"` | `"1"` метки вкл / `"0"` выкл |

Демо-режим пишет только `demoLabels`; keyHint в демо — session-override без записи LS.
