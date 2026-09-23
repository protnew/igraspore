# EXEC-отчёт: UI-POLISH-CORNERS-2026-09-22

| Поле | Значение |
|------|----------|
| **ID инкремента** | UI-POLISH-CORNERS-2026-09-22 |
| **Дата** | 2026-09-22 (Europe/Volgograd, UTC+3) |
| **Статус** | Код + локальный CDP-гейт + скрины готовы; CF deploy — нужен Windows (box-scoped executor, нет CLOUDFLARE_API_TOKEN на box) |
| **SoT** | disk: C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\{index.html, style.css, .04-Src\\js\\ui.js} |
| **Cache-bust** | ?v=1790087247 (36 ссылок в index.html) |
| **Live URL (после деплоя)** | https://igraspore.pages.dev/?v=1790087247 |
| **CF deploy id** | pending (см. PARENT_RUNME.md) |

## 1. Проблема → решение → результат

**Проблема.** На live 1280×800 #pcWrap / #mmWrap / #demoTip визуально висели в нижней трети. CSS якорил их к bottom = actbar-bottom + actbar-h + ui-gap, а #actBar в демо реально 194px (3 ряда при width≈640). Числа до правки (CDP live):

| id | bottom от низа viewport | top y | gap → actBar.top |
|----|-------------------------|-------|------------------|
| mmWrap | 214px | 506 | 8px |
| pcWrap | 302px | 443 | (stack +88) |
| demoTip | 214px | 523.3 | 8px |
| actBar | h=194px, top=594 | | --actbar-h=194px |

Справа ниже карты оставалась пустая вертикаль (actBar только центр x=320–960) — панели выглядели mid-height.

**Решение.** Desktop: боковые стеки на истинные нижние углы (--corner-bottom = max(actbar-bottom, safe-area)); #pcWrap над #mmWrap через --mm-h + --ui-gap (gap 8). #demoTip — bottom-left с max-width min(280px, 36vw), чтобы не пересечь центрированный actBar. #keyHint без изменений (остаётся над actBar). Narrow ≤900 / coarse: подъём на полосу actbar-h + gap, чтобы не накрывать .ab. EN: 6 строк тела легенды в updateLegend (chip уже был). Toasts z:50 — оставлены (pointer-events:none).

**Результат (локальный сервер патча, CDP 1280):**

| id | bottom от низа | top y | notes |
|----|----------------|-------|-------|
| mmWrap | **12px** | 708 | правый нижний угол; x=1164–1274 clear vs actBar |
| pcWrap | **100px** | 645 | gap pc→mm = 8px |
| demoTip | **12px** | 707.7 | right=288 < actBar.left 320 |
| keyHint | (без изменений) | | gap→actBar = 8px |

390×844: mm/tip над actBar (gap 8px), abOverlaps mm/pc/demoTip = [].

## 2. Изменённые файлы (полные абсолютные пути Windows после apply)

| Файл | Что |
|------|-----|
| C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\style.css | --corner-bottom/--mm-h/--pc-h; mm/pc/demoTip/scaleW/hDivReady на углы; media ≤900 lift |
| C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\index.html | bump ?v=1790087247 (36) |
| C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\.04-Src\\js\\ui.js | updateLegend EN body (6 строк) + sig по текстам |
| C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\.04-Src\\07-QA-and-Testing\\vitest\\ui_polish_corners.test.js | NEW unit |
| C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\cf-publish\\ (style.css, index.html, 04-Src/js/*) | sync |

Не тронуто: .04-Src\\src\\style.css, .04-Src\\src\\index.html, APK/www, git push.

## 3. Тесты

| Проверка | Результат |
|----------|-----------|
| Contract asserts (node на патче) | 16/16 PASS (CSS corners + legend EN/RU) |
| vitest полный suite | pending — run-ui-polish-deploy.ps1 на Windows |
| qa_unit | pending |
| CDP 1280/390 локально | PASS |
| Tab live https://igraspore.pages.dev/ | PASS: menu Tab cycles startBtn→demoBtn inside #menuO; playing+possessed Tab toggles autoAI false→true. Demo free-cam без player: Tab no-op (if player && player.alive) |
| Legend EN (локально) | PASS body Algae/Bacteria/Apex hunters/Large/Decomposers/Viruses; RU intact |
| Toasts z:50 | leave as-is |

## 4. CF deploy

| Шаг | Статус |
|-----|--------|
| Патчи + cf-publish в ferry | DONE |
| wrangler pages deploy | BLOCKED on box (нет Windows Shell / нет token) |
| Live hard-load verify | после деплоя parent |

Parent: см. PARENT_RUNME.md. Ferry box path: /workspace/agent-transfer-staging/igraspore-ui-polish-20260922/

## 5. Хвосты §7

1. EN legend body — DONE
2. Manual Tab gate live — PASS
3. Toasts z:50 — leave as-is
4. Corner stack gap / narrow — DONE

## 6. Скриншоты / отчёт

- C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\09-Docs\\out-dev-factory\\EXEC-UI-POLISH-CORNERS-2026-09-22.md
- C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\09-Docs\\out-dev-factory\\UI-POLISH-1280.png
- C:\\Obsidian\\New\\Projects\\08-iGraSpore_V2\\09-Docs\\out-dev-factory\\UI-POLISH-390.png

Box copies: /workspace/uploads/EXEC-UI-POLISH-CORNERS-2026-09-22.md , UI-POLISH-1280.png , UI-POLISH-390.png

## 7. Open items

1. CF deploy + live verify на machineId eb1f1b15-17ce-46e0-9365-d1c0a98494dc
2. vitest/qa_unit counts после ps1
3. Git push — не делать (нет фразы «делай + пуш»)
