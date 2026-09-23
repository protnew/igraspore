# ТЗ: восстановление UI без наложений меню — iGraSpore V2

| Поле | Значение |
|------|----------|
| **ID** | `UI-RESTORE-2026-09-22` |
| **Версия** | **1.1** (после 3 критиков) |
| **Дата** | 2026-09-22 |
| **Статус** | Готово к исполнению после v1.1 (код — только по «делай») |
| **Критика** | `UI-RESTORE-CRITIQUE-3x-2026-09-22.md` — layout + SoT/deploy + a11y/QA |
| **Заказчик** | Алексей |
| **Live-канон** | https://igraspore.pages.dev/ |
| **Скрин-источник (плохо)** | вложение 2026-09-22 (демо + CARTOON), также `attachments/…90240fa5….png` у агента |
| **План-родитель** | `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\UI-RESTORE-PLAN-2026-09-22.md` |
| **Связь с ТЗ v3** | Не отменяет пакеты A–H; это отдельный инкремент **UI layout**. После сдачи — ссылка на тест/гейт обязательна |

---

## Changelog v1.1 (врезки по критике)

| Источник | Что добавлено / ужесточено |
|----------|----------------------------|
| Critic 1 Layout | Матрица bbox-пар; pc/mm/scale на `--actbar-h`; канон `#khToggle`; safe-area; RO+orientationchange; demoHud vs hDivReady; hotkey-сводка в drawer |
| Critic 2 SoT | SoT 3 колонки disk/cf/URL; `.04-Src`↔`04-Src`; `mobile.js` в scope; APK/www out-of-scope явно; bump `?v=`; lean-git политика; файлы по этапам |
| Critic 3 A11y/QA | Tab-матрица; energy = **display-only clamp (A)**; `updateEcoPanel` не трогает `#legP`; demo session-override LS; i18n/ARIA; 3 обязательных unit; DoD чекбоксы |


---

## 0. Цель (проблема → решение → результат)

**Проблема.** В игровом HUD одновременно видны две нижние панели (`#actBar` и `#keyHint`) на одной полосе: подсказки перекрывают подписи кнопок. Справа сверху четыре независимых якоря (FPS / звезда / CARTOON / APK) рвут край. Легенда и демо-навигация добавляют шум. Игрок видит «склад панелей», а не пруд.

**Решение.** Жёсткий каркас из **четырёх зон** без пересечения bounding-box’ов: верх-лево, верх-право (одна колонка), низ (только действия), справка клавиш (drawer, по умолчанию свёрнут). Мелочи: clamp отображения энергии, collapse легенды, демо-метки по тумблеру, mobile без двойного низа.

**Результат.** На том же демо-кадре (1280×800) все кнопки `#actBar` читаются целиком; `#keyHint` либо свёрнут в одну кнопку, либо висит **строго выше** actBar без пересечения; шкала µm и миникарта видны; верх-право — одна колонка; vitest зелёный; выкладка на Cloudflare с отчётом.

---

## 1. Границы работ

### 1.1 In scope
1. Layout/CSS игрового HUD (низ, верх-право, легенда, шкала, углы).
2. Логика collapse/expand `#keyHint`, дефолт и persistence.
3. Сборка `#topRightStack` в разметке.
4. Collapse `#legP`.
5. Демо: автосворачивание keyHint + опция меток видов.
6. Визуальный clamp energy-бара/текста HUD.
7. Tab-фокус на стартовом `#menuO` (не ломая Tab=авто в игре).
8. Mobile 390: actBar в 2 ряда **внутри** одной панели (сейчас actBar/keyHint `display:none` — см. §8).
9. Синхронизация артефактов: root `style.css` ↔ `cf-publish/style.css` ↔ проверка `.04-Src/src/style.css`.
10. Тесты + CF deploy + отчёт.

### 1.2 Out of scope
- Геймплей, баланс, WebGL/швейцарский рендер (кроме позиции кнопки режима).
- Переписывание wiki/sandbox/overlays (`#helpO`, `#pauseO`, leaderboard) кроме z-index конфликтов с низом.
- Rewriting git history / отключение GitHub Pages.
- Смена иконок/копирайта кнопок actBar (тексты/hotkey остаются).
- Физическое удаление файлов (только archive при необходимости).

### 1.3 Не делать
- Не лечить наложением через «поднять z-index» без смены `bottom`/`top`.
- Не плодить третий нижний бар.
- Не удалять `#actBar` / `#keyHint` / кнопки.
- Не трогать keystore / секреты.
- Не коммитить `cf-publish/` целиком в lean git, если политика lean push ещё действует — CF sync отдельно.

---

## 2. Источник истины (SoT) и файлы

### 2.1 Три колонки: disk → cf-publish → URL (обязательно)

Live Pages грузит пути **без точки**: `style.css?v=…`, `04-Src/js/….js?v=…`.  
На диске канон правок JS часто лежит в **`.04-Src\js\`** (с точкой). При sync обязан быть junction/copy → `cf-publish/04-Src/js/`.

| Роль | Edit on disk (SoT) | Путь в `cf-publish/` | URL на Pages |
|------|--------------------|----------------------|--------------|
| HTML | `…\08-iGraSpore_V2\index.html` | `index.html` | `/` |
| CSS | `…\08-iGraSpore_V2\style.css` | `style.css` | `/style.css?v=` |
| JS menus | `…\.04-Src\js\ui_menus.js` | `04-Src/js/ui_menus.js` | `/04-Src/js/ui_menus.js?v=` |
| JS HUD | `…\.04-Src\js\ui.js` | `04-Src/js/ui.js` | `/04-Src/js/ui.js?v=` |
| JS demo | `…\.04-Src\js\demo.js` | `04-Src/js/demo.js` | `/04-Src/js/demo.js?v=` |
| JS events | `…\.04-Src\js\main_events.js` | `04-Src/js/main_events.js` | `/04-Src/js/main_events.js?v=` |
| **JS mobile** | `…\.04-Src\js\mobile.js` | `04-Src/js/mobile.js` | `/04-Src/js/mobile.js?v=` |
| CF mirror root | — | `06-DevOps-and-Release\cf-publish\` | deploy target |

**Запрет:** править «не тот» каталог (например только `cf-publish` без disk SoT, или `.04-Src/src/*` вместо root).  
**Запрет:** править `.04-Src\src\index.html` / `.04-Src\src\style.css` в этом инкременте (нет live `#actBar`; token-CSS ≠ root).

### 2.2 Dual-CSS / dual-HTML (не трогать)

| Путь | Размер (снимок 2026-09-22) | Статус в инкременте |
|------|----------------------------|---------------------|
| root `style.css` | 20921 | **единственный** CSS для правок; новые `:root` vars — **только сюда** |
| `.04-Src\src\style.css` | 18951 | untouched unless Алексей скажет «свести» |
| `.04-Src\src\index.html` | 43867 | untouched |

После правок в отчёте: sizes/hash `root style.css` ≡ `cf-publish/style.css`.

### 2.3 APK / WebView (явный out of scope)

| Путь | Решение v1.1 |
|------|----------------|
| `06-DevOps-and-Release\apk_proj\assets\www\` | **Не sync в этом инкременте** |
| Rebuild APK | **Out of scope** |
| R12 | Только CF download `/igraspore.apk` (MIME/size), не проверка www-бандла |

Если позже понадобится паритет WebView — отдельная команда Алексея.

### 2.4 Lean git vs cf-publish

| Артефакт | Lean git (по «делай + пуш») | Только deploy-mirror |
|----------|-----------------------------|----------------------|
| root `index.html`, `style.css` | да | копируется в cf-publish |
| `.04-Src/js/*` (или `04-Src/js/*` если так в repo) | да | → `cf-publish/04-Src/js/` |
| весь `cf-publish/` | **нет** (не коммитить целиком) | wrangler deploy |
| apk www | нет | нет |

Запрет: выкладка «только cf-publish» без обновлённого SoT на диске.

### 2.5 Репозиторий
- GitHub: `https://github.com/protnew/igraspore.git` branch `master`
- Push только по фразе «делай + пуш» (или отдельному «пуш»).

---

## 3. As-is: инвентарь UI (факты с диска)

### 3.1 Карта якорей (игровой HUD)

| ID / класс | Файл | position | top/bottom/left/right | z-index | display as-is | Назначение |
|------------|------|----------|------------------------|---------|---------------|------------|
| `#leftContainer` | index.html inline | absolute | top:6 left:6 | 10 | flex column | Язык + HUD + eco + легенда |
| `#langSelWrap` | index + style | absolute (внутри left) | — | 50 | — | Выбор языка |
| `#hud` | index + ui.js | relative в left | — | 10 | none→block | Карточка организма |
| `#ecoP` | index + ui.js | — | — | 10 | **forced none** | Эко-панель (снята) |
| `#legP` | index + ui.js | — | — | 10 | block в `updateLegend` | Легенда цветов |
| `#topR` | style + ui.js | absolute | top:6 right:6 | 10 | none→block | FPS / pop / light / temp |
| `#weatherP` | style | absolute | top:50 right:6 | 10 | **display:none!important** | Погода (выкл) |
| `#apkBtn` | index inline | **fixed** | top:10 right:10 | **9999** | flex | Скачать APK |
| `#starSelectGame` | index inline | absolute | top:48 right:6 | **9998** | — | Выбор звезды (7 option) |
| `#renderModeBtn` | style + index | absolute | **top:90 right:6** | 15 | none→block | CARTOON/SWISS/WEBGL |
| `#camM` | index/style | absolute | top:5 left:50% | — | — | FOLLOW / free cam pill |
| `#actBar` | style + index | absolute | **bottom:48** left:50% | **20** | none→flex | Кнопки действий |
| `#keyHint` | style + ui_menus | absolute | **bottom:78** left:50% | **45** | none→flex | Подсказки клавиш |
| `#khToggle` | создаётся JS | — | — | — | button | Свернуть/Клавиши |
| `.kh-keys` | создаётся JS | — | — | — | hidden если `.collapsed` | Ряд kbd |
| `#scaleW` | style + ui.js | absolute | bottom:6 right:140 | 10 | none→block | Шкала µm |
| `#scaleBar` | index inline | absolute | bottom:20 left:50% | — | — | **Вторая** шкала (центр) — конфликт/дубль |
| `#mmWrap` / `#mm` | index | absolute | bottom:6 right:6 | 10 | — | Миникарта 110×80 |
| `#pcWrap` / `#pc` | index | absolute | **bottom:92** right:6 | 10 | — | График популяции 110×55 |
| `#hDivReady` | index inline | **fixed** | left:12 **bottom:78** | 40 | — | «Эн/Масса / ГОТОВО» — ещё один низ-лево |
| Demo HUD | demo.js DOM | обычно bottom-left | — | — | создаётся в demo | «ДЕМО · WASD… · 1–5» |

### 3.2 `#actBar` — полный список кнопок (поля)

Контейнер: `<div id="actBar">` → дети `.ab`.

| id | Видимый label (RU as-is) | `.hk` hotkey | title / aria | onclick wiring (as-is) |
|----|--------------------------|--------------|--------------|------------------------|
| `bEat` | ЕСТЬ | E | Есть | main_events / eat |
| `bDiv` | ДЕЛИТЬ | Q | Делить | divide |
| `bCyst` | ЦИСТА | R | Циста | cyst |
| `bFeed` | 🍽 КУСЬ | Space | Ручное питание | feed (inline style green) |
| `bAuto` | АВТО | Tab | Авто | autopilot |
| `bFree` | ПОЛЁТ F | F | Свободный полёт… | free cam |
| `bMicro` | 🔬 | M | Microscope Mode | optics |
| `bRender` | 🎨 | N | Картинка: мульт / Swiss | `toggleRenderModeLarge` |
| `bFol` | СЛЕДИТЬ | V | Следить | follow |
| `bWiki` | 📖 | B | Wiki/Bestiary | wiki |
| `bPause` | ⏸ | P | Pause | pause |
| `bZI` | 🔍+ | — | Zoom+ | zoom in |
| `bZO` | 🔍- | — | Zoom- | zoom out |
| `bSandbox` | 🛠 | — | Sandbox Tools | sandbox |

CSS кнопки `.ab`: padding 12×16, min-width 72, min-height 48, font 15/800, `.hk` font 7–11.

### 3.3 `#keyHint` — состояние и поля (логика)

Файл: `.04-Src\js\ui_menus.js`

| Поле / символ | Тип | As-is | Целевое |
|---------------|-----|-------|---------|
| `window._keyHintCollapsed` | boolean | **`false`** (открыт) | **`true`** по умолчанию |
| `window._keyHintStart` | number (ms) | Date.now при build | без изменения смысла |
| Автосворот | timer | через **5×60×1000** мс → collapse | оставить **или** сократить до 30–60 с (решение в §5.1) |
| Persistence | — | нет | `localStorage` ключ `igraspore.keyHintCollapsed` = `"0"|"1"` |
| DOM `#keyHint` | element | `class="p"`, style display none до старта | display flex в игре; класс `collapsed` |
| `#khToggle` | button | текст RU: «Свернуть клавиши» / «Клавиши»; EN: «Hide keys» / «Keys» | то же + `aria-expanded` |
| `.kh-keys` | div | HTML подсказок (WASD, ЛКМ, …) | не дублировать hotkey, уже стоящие на `.ab .hk` (см. §5.1) |
| `buildKeyHint(hkHtml)` | function | пересобирает innerHTML | сохранить API; добавить persist |
| `tickKeyHint()` | function | автосворот | вызывать как сейчас |

### 3.4 `#starSelectGame` — поля option

| value | label |
|-------|-------|
| `sol` | ☀ Солнце |
| `sirius` | ★ Сириус |
| `betelgeuse` | ★ Бетельгейзе |
| `rigel` | ★ Ригель |
| `vega` | ★ Вега |
| `antares` | ★ Антарес |
| `alphacentauri` | ★ α Центавра |

Событие: `onchange → window.setStarSystem(this.value)`.

Параллельно в меню есть `#starSelect` (стартовый экран) — **не** переносить в topRightStack; только game-select.

### 3.5 `#renderModeBtn` — состояния

| `settings.renderMode` | class кнопки | Подпись (целевая краткая) | Цикл по N / клику |
|-----------------------|--------------|---------------------------|-------------------|
| `cartoon` | `.cartoon` | CARTOON / МУЛЬТ | → swiss |
| `swiss` | (задать `.swiss`) | SWISS | → webgl |
| `webgl` | (задать `.webgl`) | WEBGL | → cartoon |
| fallback / fail webgl | `.cartoon` | CARTOON | — |

As-is padding **12×24**, font **18** — слишком крупно. Целевое: padding **8×14**, font **13–14**, width 100% колонки.

### 3.6 `#apkBtn` — поля

| Атрибут | Значение as-is | Целевое |
|---------|----------------|---------|
| `href` | `/igraspore.apk` | без изменения |
| `download` | `igraspore.apk` | без изменения |
| `aria-label` | Скачать приложение Android APK | без изменения |
| position | `fixed; top:10; right:10; z-index:9999` | **убрать fixed**; стать ребёнком `#topRightStack` (static/relative), z внутри стека |

### 3.7 HUD энергия — поля отображения

В `updateHUD()` (`ui.js`):

| Поле | Источник | As-is | Баг | Целевое |
|------|----------|-------|-----|---------|
| Ширина бара | `eRatio = clamp(player.energy/100, 0, 1)` | clamp OK | — | оставить |
| Текст | `Math.max(0, Math.round(player.energy)) + '/100'` | может быть **109/100** | текст > max | **Product-решение v1.1 = (A) display-only:** `displayE = Math.min(100, Math.max(0, round(energy)))`, текст `displayE+'/100'`, бар `displayE/100`. Логику `player.energy` **не** капить в этом инкременте. В отчёте явно: «логика >100 не трогали». `#hDivReady` остаётся `Эн {raw}/{repEnergy}` (другой знаменатель — порог деления); R8 сверяет, что игрок не видит противоречивый «100/100» рядом с «Эн 109/80» без пояснения — допустимо разные метрики, но HUD `/100` всегда clamp |
| Цвет бара | пороги 0.6 / 0.3 | OK | — | без изменения |
| Запах еды | `foodScentStrength` | вторая полоска | — | без изменения |
| Имя / роль / Gen / µm | player.sp… | OK | — | без изменения |

`#hDivReady` показывает `Эн {en}/{rep}` где `rep = player.sp.repEnergy||80` — это **другой** знаменатель (порог деления), не путать с HUD `/100`. Позицию `bottom:78` сменить (см. §5.1), чтобы не пересекаться с actBar/keyHint.

### 3.8 Легенда `#legP` — items (as-is в `updateLegend`)

| color | label RU |
|-------|----------|
| `#2c2` | Водоросли |
| `#4af` | Бактерии |
| `#dd44cc` | Крупные охотники |
| `#c4f` | Крупные |
| `#a86` | Разлагатели |
| `#f44` | Вирусы |

Заголовок: «Легенда». EN-локализацию добавить при collapse (пара `Легенда`/`Legend`).

Заметка: `updateEcoPanel()` ставит `legP.display='none'`, `updateLegend()` — `block`. Порядок вызовов в кадре должен оставить legend под контролем нового collapse API (см. §5.3).

### 3.9 Демо (`demo.js`)

| Символ | Описание |
|--------|----------|
| `DEMO_GROUPS[]` | группы 1..N (ключ, цвет, ru/en) |
| `o.demoGroup` | int 1..N |
| HUD HTML | «ДЕМО · WASD/mouse fly · 1-5 group · click = take» + кнопки 1..5 |
| Метки в мире | group banner + per-organism index (шум на скрине) |
| При старте demo | `actBar.display='flex'`, `renderModeBtn.display='block'` |

---

## 4. Целевая архитектура зон

```
┌─ leftContainer (A) ──────────────┐          ┌─ topRightStack (B) ─┐
│ langSelWrap                      │   camM   │ topR (FPS…)         │
│ hud                              │          │ starSelectGame      │
│ legP [collapsed chip]            │          │ renderModeBtn       │
└──────────────────────────────────┘          │ apkBtn              │
                                              └─────────────────────┘
                         (пруд / canvas)

┌ hDivReady (над actBar, left) ┐   ┌ keyHint OPEN: только над actBar ┐
└──────────────────────────────┘   └─────────────────────────────────┘
        ┌────────────── actBar (C) — единственная нижняя панель ──────────────┐
        │ bEat … bSandbox (+ опционально khToggle как крайняя кнопка)         │
        └─────────────────────────────────────────────────────────────────────┘
 demoHud (D-left)     scaleW (у карты)     pcWrap     mmWrap (D-right)
```

**Инвариант (матрица пар):** при любом состоянии (keyHint open/closed, legend open/closed, demo on/off, 1–N рядов actBar)  
bounding boxes **не пересекаются** (допуск 0 px; зазор ≥ 8 px).

Обязательные пары:
| A | B |
|---|---|
| `#actBar` | `#keyHint` (expanded и collapsed chip) |
| `#actBar` | `#hDivReady`, demoHud, `#scaleW`, `#pcWrap`, `#mmWrap` |
| `#topRightStack` | `#camM`, `#todWrap`, `#leftContainer` (на узкой ширине) |
| `#keyHint` expanded | `#leftContainer` / `#topRightStack` / `#camM` (если конфликт — scroll внутри keyHint, не наезд) |
| demoHud | `#hDivReady` (см. порядок §5.4 / §5.1) |

---

## 5. Функциональные требования по этапам

### 5.1 Этап 1 — развести низ (P0)

**Проблема:** `#keyHint` (bottom:78, z:45) ∩ `#actBar` (bottom:48, z:20).

**Решение (обязательные изменения):**

#### CSS (`style.css`)
Добавить CSS-переменные:

```css
:root {
  --actbar-bottom: 12px;
  --actbar-h: 64px;          /* обновлять JS при wrap, см. ниже */
  --ui-gap: 8px;
  --z-actbar: 20;
  --z-keyhint: 25;           /* выше actBar, но layout-разведён */
  --z-corner: 10;
  --z-topstack: 30;
}
#actBar {
  bottom: var(--actbar-bottom);
  z-index: var(--z-actbar);
  /* display:flex в игре; max-width: min(96vw, 920px); */
}
#keyHint {
  bottom: calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap));
  z-index: var(--z-keyhint);
  max-height: 30vh;
  overflow-y: auto;
}
#keyHint.collapsed {
  /* только кнопка: можно сузить padding */
}
#scaleW {
  bottom: calc(var(--actbar-bottom) + 4px);
  right: 130px; /* слева от mmWrap 110px + gap */
  z-index: var(--z-corner);
}
#hDivReady {
  position: absolute; /* не fixed */
  left: 12px;
  bottom: calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap));
  z-index: 18;
}
```

**Канон шкалы:** `#scaleW` — единственная шкала в `playing` и `demo`. `#scaleBar` → `display:none !important` в игре и демо (R1 проверяет).

**Углы низа на тех же переменных (must):**
```css
#mmWrap, #pcWrap {
  right: max(6px, env(safe-area-inset-right));
  bottom: calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap));
  z-index: var(--z-corner);
}
#scaleW {
  right: calc(130px + env(safe-area-inset-right)); /* слева от mm 110px + gap */
  bottom: calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap));
  /* НЕ bottom: calc(var(--actbar-bottom) + 4px) — это линия actBar */
}
#actBar, #keyHint, #topRightStack, #leftContainer {
  /* safe-area */
}
#actBar { bottom: max(var(--actbar-bottom), env(safe-area-inset-bottom)); }
#topRightStack { top: max(8px, env(safe-area-inset-top)); right: max(8px, env(safe-area-inset-right)); }
#leftContainer { top: max(6px, env(safe-area-inset-top)); left: max(6px, env(safe-area-inset-left)); }
```

**Канон `#khToggle` (один, зафиксирован):** отдельный chip **над** `#actBar` по центру (или чуть левее центра), **не** внутри `.ab`. Hit-area ≥ 44×44. В collapsed виден только chip; в expanded — chip + `.kh-keys` карточкой выше.

**Порядок слева над actBar:** снизу вверх: demoHud (если demo) → gap ≥8 → `#hDivReady` → gap ≥8 → (опционально keyHint если якорь слева). Не делить один и тот же `bottom` calc без смещения.

#### JS (`ui_menus.js` + измерение высоты)
1. `window._keyHintCollapsed = true` по умолчанию (first-run / null LS → collapsed).
2. Init: `try { localStorage.getItem('igraspore.keyHintCollapsed') } catch` → при throw/invalid — дефолт `"1"`. `"0"` → open, иначе collapsed.
3. Toggle: писать `"1"`/`"0"` в LS (try/catch); выставлять class + `aria-expanded` + `aria-controls="khKeys"`; у `.kh-keys` id=`khKeys` и `hidden`/`aria-hidden` когда collapsed.
4. **`--actbar-h`:** обновлять через `ResizeObserver` на `#actBar` **и** на `orientationchange` / `visualViewport` resize (не только однократный build).
5. Содержимое `.kh-keys`: (a) уникальные WASD / ЛКМ / ПКМ / без кнопки; (b) **компактная сводка** уже известных hotkeys одной строкой `E Q R Tab F V B P` (мелкий текст) — новичок при open drawer всё же видит полный набор; `.hk` на кнопках поднять читаемость (min ~10–11px) в CSS этапа 1.
6. Автосворот: **60 с** с последнего **ручного expand**, тикает **только** пока `state==='playing'` (не в pause/menu/hidden tab). Уже collapsed — таймер не пишет LS повторно.
7. Transition max 150–200ms; уважать `prefers-reduced-motion: reduce` (без анимации).
8. First-run (опционально P2): один пульс chip «Клавиши» в первой playing-сессии, если LS ключ first-tip отсутствует.

#### Поведение `#khToggle`
| Состояние | `aria-expanded` | Текст RU | Текст EN | Видимость `.kh-keys` |
|-----------|-----------------|----------|----------|----------------------|
| collapsed | `false` | Клавиши | Keys | none |
| expanded | `true` | Свернуть | Hide keys | flex |

**Критерий этапа 1:** скрин 1280×800 демо — подписи АВТО/ПАУЗА/… не перекрыты; при expand зазор ≥ 8px.

---

### 5.2 Этап 2 — `#topRightStack` (P0)

**Разметка** в `index.html` (новая обёртка):

```html
<div id="topRightStack" aria-label="Игровые переключатели">
  <div id="topR" class="p" …></div>
  <select id="starSelectGame" …>…</select>
  <button id="renderModeBtn" …></button>
  <a id="apkBtn" …>📱 APK</a>
</div>
```

| Поле CSS `#topRightStack` | Значение |
|---------------------------|----------|
| position | absolute |
| top | 8px |
| right | 8px |
| display | flex |
| flex-direction | column |
| align-items | stretch |
| gap | 8px |
| z-index | var(--z-topstack) |
| width | 148px (desktop); 120px (≤900px) |
| pointer-events | auto |

Дочерние элементы: **сбросить** индивидуальные `position:absolute/fixed; top; right; z-index` (inline и CSS). Ширина 100% стека.

`#weatherP` остаётся `display:none !important` (вне стека).

`aria-label` стека: через i18n (`Игровые переключатели` / `Game controls`), не хардкод только RU.

`#camM` / `#todWrap`: не пересекать `#topRightStack`. При ширине < stack_right_edge + cam_width — укоротить label camM или сместить левее центра. На 390 проверить открытый `<select>` (truncation label, dropdown не уезжает за край).

**Критерий:** правый край одной вертикали; CARTOON не гигантский; APK без z=9999; camM∩stack = ∅.

---

### 5.3 Этап 3 — легенда collapse (P1)

| Поле / API | Значение |
|------------|----------|
| Дефолт | collapsed (`true`) |
| Persistence | `localStorage['igraspore.legendCollapsed']` = `"0"|"1"` |
| DOM | `#legP` содержит `#legToggle` + `#legBody` |
| `updateLegend()` | пишет только в `#legBody`; не трогает toggle |
| `updateEcoPanel()` | **контракт v1.1:** **не трогает** `#legP` вообще (ни `display`, ни `innerHTML`). Eco/`#ecoP` по-прежнему none. Visibility легенды — только `legendCollapsed` + CSS/class |
| ARIA | `#legToggle`: `aria-expanded`, `aria-controls="legBody"`; `#legBody` `hidden` когда collapsed |
| leftContainer | gap ≥8px; expanded legend не обязан перекрывать весь пруд, max-height + scroll если >40vh |

Состояния:

| collapsed | Видно |
|-----------|-------|
| true | кнопка/чип «Легенда ▾» |
| false | заголовок + 6 строк цветов |

Клик по чипу / Enter/Space на focusable toggle.

---

### 5.4 Этап 4 — демо (P1)

| Поле | Целевое |
|------|---------|
| При `startDemo` | session override: `_keyHintCollapsed = true` + rebuild; **не** перезаписывать `localStorage` keyHint (после выхода из demo — вернуть из LS) |
| `window._demoLabels` | boolean, default **`false`** |
| Persistence | `localStorage['igraspore.demoLabels']` (`"1"`/`"0"`, try/catch) |
| UI | кнопка в demo HUD: RU «Метки» / EN «Labels» |
| Когда false | скрыть **и** per-organism index, **и** group banners |
| Когда true | as-is текущая отрисовка |

Demo HUD позиция: `left: max(8px, env(safe-area-inset-left)); bottom: calc(var(--actbar-bottom) + var(--actbar-h) + var(--ui-gap))`.  
`#hDivReady` в demo: **выше** demoHud на ≥8px (не тот же bottom).

---

### 5.5 Этап 5 — мелочи + a11y + mobile.js (P2, часть — blocker для R9/R10)

1. **Energy display** — §3.7, решение **(A) display-only clamp**.
2. **Tab-матрица (обязательна):**

| Режим | Tab / Shift+Tab | Примечание |
|-------|-----------------|------------|
| `menu` (`#menuO` show) | цикл focusable внутри `#menuO` | start/demo/aquarium/… |
| `playing` | **только** автопилот (`#bAuto`); `preventDefault` | фокус-цикл по `.ab` **не** через Tab; hotkeys/стрелки ок |
| `demo` | как `playing` (Tab = авто, если actBar показан) | |
| overlay `#pauseO` / `#helpO` / wiki / sandbox / leaderboard | Tab цикл **внутри overlay** | игра не получает Tab пока overlay open |
| focus на `#khToggle` / `#legToggle` / stack | Enter/Space активируют | не красть Tab у playing-авто |

3. **Mobile — файлы:** root `style.css` **и** `04-Src/js/mobile.js` (as-is: `.is-mobile #actBar{display:none!important}` + `setProperty(...,'important')`). Без правки **обоих** R9 провален.
   - Убрать/заменить hide actBar на flex-wrap; hit-area `.ab` крупная.
   - keyHint: только collapsed по умолчанию на mobile.
   - `--actbar-h` после wrap (часто **>2** рядов при 14×min-width 72 на 390 — это ОК; инвариант углов всё равно держать).
4. **Focus-visible** на `.ab`, toggles, apk, renderMode, starSelect; до старта — порядок таба в стеке B допустим.
5. **ARIA на `.ab`:** осмысленный `aria-label` (не только title); на `#bAuto` — `aria-keyshortcuts="Tab"` или help в wiki.

---

### 5.6 Этап 6 — проверка и выкладка (P0 после кода)

См. §9–10.

---

## 6. Новые / изменённые localStorage-ключи

| Ключ | Тип строки | Значения | Дефолт при отсутствии |
|------|------------|----------|------------------------|
| `igraspore.keyHintCollapsed` | string | `"1"` свёрнут, `"0"` открыт | `"1"` |
| `igraspore.legendCollapsed` | string | `"1"` / `"0"` | `"1"` |
| `igraspore.demoLabels` | string | `"1"` / `"0"` | `"0"` |

Не писать другие настройки UI без нужды. Не класть токены.

---

## 7. Z-index политика (целевая)

| Слой | z-index | Элементы |
|------|---------|----------|
| Canvas | 0 | `#c`, `#glCanvas` |
| Углы / шкала | 10 | mm, pc, scaleW, leftContainer base |
| Cam / TOD | 12–15 | `#camM`, `#todWrap` |
| ActBar | 20 | `#actBar` |
| KeyHint / hDivReady | 25 / 18 | справка и статус деления |
| TopRightStack | 30 | стек справа |
| Overlays меню | 40+ | `.ov`, `#menuO` |
| Тосты/tips | 14–35 | `#tip`, `#toast` — не перекрывать actBar кликами |

Запрещены одиночные `z-index: 9998/9999` на APK/star после этапа 2.

---

## 8. Адаптив и брейкпоинты

| Viewport | Ожидание |
|----------|----------|
| ≥1280×800 | эталон приёмки |
| 1024×768 | actBar wrap в 2 ряда допустим **внутри** панели |
| 390×844 | actBar виден (wrap N рядов); keyHint collapsed; topRightStack компакт; легенда collapsed; safe-area |
| landscape phone | pc/mm/scale/keyHint не ∩ actBar; camM ∩ stack = ∅; скрин в отчёт |
| zoom 125% / tablet ~768 | smoke: нет наложений низа |

---

## 9. Тесты и приёмка

### 9.1 Авто
| Тест | Команда / место | Критерий |
|------|-----------------|----------|
| Unit | vitest в `.04-Src` | 187/187 (или актуальный полный green) |
| qa_unit | существующий `qa_unit.js` | PASS |
| **Unit обязательные (3)** | (1) keyHint LS roundtrip + default collapsed; (2) energy display policy (A); (3) после eco+legend `#legP` в состоянии collapse API (eco не затирает) | PASS |
| Playwright e2e | non-blocking; hang → в отчёт | best-effort |

### 9.2 Ручной чеклист (гейт)

| # | Шаг | Ожидание |
|---|-----|----------|
| R1 | Открыть live/local, Старт или Демо, 1280×800 | actBar полностью читаем |
| R2 | keyHint по умолчанию свёрнут | видна только «Клавиши» |
| R3 | Открыть клавиши | панель **выше** actBar, зазор ≥8px, нет пересечения |
| R4 | Обновить страницу | состояние collapse сохранено |
| R5 | Верх-право | одна колонка FPS→звезда→режим→APK |
| R6 | Легенда | chip; раскрытие/сворот работает |
| R7 | Демо | нет сетки меток по умолчанию; тумблер включает |
| R8 | HUD энергия при energy>100 | бар ≤100%, текст не «109/100» (clamp/display) |
| R9 | Mobile 390 + landscape | actBar виден; bbox actBar×{keyHint,pc,mm,scale,demoHud}; safe-area; после wrap `--actbar-h` обновлён |
| R10 | Меню до старта | Tab по `#menuO` |
| R11 | playing / demo | Tab = авто; overlay open → Tab в overlay |
| R12 | APK на CF | download + MIME OK (**не** www/APK rebuild) |
| R13 | Legend / demoLabels | persist LS после reload |
| R14 | `#scaleBar` | hidden в playing и demo |
| R15 | camM vs topRightStack | нет пересечения на 1280 и 390 |

### 9.3 Скриншоты в отчёт
- `UI-BEFORE` (уже есть от пользователя)
- `UI-AFTER-1280-demo.png`
- `UI-AFTER-1280-keys-open.png`
- `UI-AFTER-390.png`

Путь отчёта:  
`C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\EXEC-UI-RESTORE-2026-09-22.md`

---

## 10. Выкладка

1. Править SoT по таблице §2.1 (disk).
2. Sync → `cf-publish/`: `index.html`, `style.css`, `04-Src/js/{ui,ui_menus,demo,main_events,mobile}.js` (+ другие затронутые).
3. **Bump cache:** увеличить `?v=` у `style.css` и всех изменённых скриптов в root **и** cf-publish `index.html`.
4. Gate до deploy: size/hash `style.css` root ≡ cf-publish; `ls` перечисленных js в `cf-publish/04-Src/js/`.
5. `wrangler pages deploy`.
6. Verify: curl/browser hard-refresh live; R1–R3 на https://igraspore.pages.dev/ .
7. В чат: URL + id деплоя + путь отчёта.
8. Git push — только «делай + пуш».

---

## 11. Критерии Done (Definition of Done)

- [ ] Этапы 1–2 закрывают главный конфликт (низ + topRightStack).
- [ ] Этапы 3–5: сделаны **или** явный хвост в отчёте (P1 legend/demo LS не молчать).
- [ ] Матрица bbox §4: R1–R3, R9, R15.
- [ ] Product-решение energy **(A)** зафиксировано в коде/отчёте.
- [ ] Tab-матрица §5.5 соблюдена (R10–R11).
- [ ] `mobile.js` учтён, если выполнялся этап 5 / R9.
- [ ] 3 обязательных unit §9.1 + vitest green.
- [ ] Ручной чеклист R1–R15 в отчёте.
- [ ] CF: bump `?v=`, sync SoT, URL + deploy id.
- [ ] Отчёт `EXEC-UI-RESTORE-2026-09-22.md` (проблема→решение→результат).
- [ ] APK www не обещан; секреты не утекли.

---

## 12. Оценка и порядок

| Этап | Приоритет | Оценка | Зависимости |
|------|-----------|--------|-------------|
| 1 Низ | P0 | 0.5–1 сессия | — |
| 2 Верх-право | P0 | 0.5 сессии | можно параллельно с 1 |
| 3 Легенда | P1 | 0.5 | после 1–2 |
| 4 Демо | P1 | 0.5 | после 1 |
| 5 Мелочи | P2 | 0.5 | после 1–2 |
| 6 Тест+CF | P0 | 0.5 | после кода |

---

## 13. Риски

| Риск | Митигация |
|------|-----------|
| Два `style.css` (root vs `.04-Src/src`) разъедутся | Править root; в отчёте diff размеров; не молчать |
| Mobile сейчас прячет actBar — «улучшение» вернёт бар и всплывут старые баги тача | Явный тест R9; крупные hit-area `.ab` |
| Playwright hang | Не блокировать DoD; unit+ручной гейт |
| Inline styles в index перебьют CSS стека | Снять inline position/z у apk/star/render при переносе |
| `#scaleBar` vs `#scaleW` | Оставить один канон |

---

## 14. Приложение A — wireframe ASCII (целевой кадр)

```
[🌐 RU ▾]  [HUD Microcystis …]              [FPS 40 · light]
[Легенда ▾]                                 [☀ Солнце ▾]
                                            [CARTOON]
         ☀ солнце     [Своб.камера]         [APK]
                    … пруд …

[Эн 90/80 · масса…]     [Клавиши]     (если open — карточка ВЫШЕ)
     [ЕСТЬ][ДЕЛИТЬ]…[АВТО]…[⏸]…
[ДЕМО 1 2 3 4 5]              [100µm] [pop][map]
```

## 15. Приложение B — трассировка к плану

| Пункт плана | Секция ТЗ |
|-------------|-----------|
| Этап 1 развести низ | §5.1 |
| Этап 2 колонка верх-право | §5.2 |
| Этап 3 легенда | §5.3 |
| Этап 4 демо | §5.4 |
| Этап 5 мелочи | §5.5 |
| Этап 6 проверка+CF | §5.6, §9, §10 |

---

**Конец ТЗ v1.0 (базовый текст).** Ниже — дополнения v1.1.


---

## 16. Приложение C — файлы по этапам (обязательный чеклист)

| Этап | Файлы SoT (disk) |
|------|------------------|
| 1 Низ | root `style.css`; `.04-Src/js/ui_menus.js`; root `index.html` (`#hDivReady`, `#scaleBar` hide) |
| 2 Верх-право | root `index.html` (обёртка `#topRightStack`, снять inline position/z у apk/star/render); root `style.css`; проверить `.04-Src/js/ui.js` если пишет top/right в `#topR` |
| 3 Легенда | `.04-Src/js/ui.js` (`updateLegend`, **`updateEcoPanel` не трогает legP**); `style.css`; при необходимости `index.html` |
| 4 Демо | `.04-Src/js/demo.js`; `ui_menus.js` (session override keyHint) |
| 5 Мелочи/a11y/mobile | `ui.js` (energy A); `style.css`; **`.04-Src/js/mobile.js`**; Tab: `main_events.js` и/или `main.js` / `ui_screens.js` — SoT уточнить grep’ом при старте этапа |
| 6 | sync cf-publish `04-Src/js/*` + bump `?v=` + EXEC отчёт |

## 17. Приложение D — строки i18n (новые/затронутые)

| Ключ смысла | RU | EN |
|-------------|----|----|
| keyHint open button | Клавиши | Keys |
| keyHint close | Свернуть | Hide keys |
| legend chip | Легенда | Legend |
| demo labels toggle | Метки | Labels |
| topRightStack aria | Игровые переключатели | Game controls |

Смена языка через `#langSelWrap` должна обновлять эти строки (не оставлять RU при EN).

## 18. Приложение E — as-is → target z-index

| Элемент | as-is | target (§7) |
|---------|-------|-------------|
| `#keyHint` | 45 | 25 |
| `#apkBtn` | 9999 | внутри stack ~30 |
| `#starSelectGame` | 9998 | внутри stack ~30 |
| `#actBar` | 20 | 20 |

Конец ТЗ **v1.1**.

Исполнение кода — по команде Алексея «делай» (стартовать с этапов 1–2 + SoT §2.1).
