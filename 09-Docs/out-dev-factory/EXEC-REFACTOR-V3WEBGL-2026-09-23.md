# EXEC — refactor v3-webgl JS >500 LOC — 2026-09-23

**Проблема → решение → результат**

## Проблема
Прототип `.04-Src/v3-webgl/js/` держал 7 монолитов >500 LOC (до 968). Live `.04-Src/js/` уже был сплитнут. `v3-webgl/index.html` ссылался на чужой путь `04-Src/js/...`.

## Решение
In-place split по швам live (`biology_*`, `render_*`, `ai_move`, `main_events`, `world_update`). Оригиналы → `_archive-pre-split-2026-09-23/`. HTML → локальный `js/?v=1790087247`.

## Результат

### Line counts (before → after core; all final <500)

| File | Before | After (core) | New modules |
|------|--------|--------------|-------------|
| render_effects.js | 968 | 445 | render_surface 393, render_fx 132 |
| biology.js | 894 | 92 | divide 70, eat 188, virus 75, update 3, update_core 473 |
| render.js | 780 | 203 | helpers 365, edu 214 |
| render_entities.js | 661 | 356 | organs 306 |
| main.js | 587 | 308 | main_events 280 |
| ai.js | 565 | 371 | ai_move 196 |
| world.js | 524 | 261 | world_update 264 |

**Overs remaining: 0**

### Tests
| Suite | Result | Log |
|-------|--------|-----|
| vitest | **PASS 50/50** (9 files), exit 0 | `.../refactor-v3webgl-20260923/vitest.log` |
| qa_unit | **MISSING** (BAG-IG-045/файл нет) | `.../qa_unit.log` |
| Playwright | **1 PASS / 2 FAIL** (canvas baselines absent); no hang 31.9s; hard timeout 720s unused | `.../playwright.log` |

### GitHub Pages
- API `DELETE /repos/protnew/igraspore/pages` → **422 not allowed**
- Proof: pages.dev **200**; github.io **200** (still serving)
- Manual: Settings → Pages → Unpublish / source None
- BAG-IG-047

### Git
- Commit on **box** lean-push (Windows disk недоступен из executor) — `9a3a55f0e438ae25e36e845aee69414a852bcc40` (box lean-push; push=no)
- Push: **no** (lean only if safe; live SoT не менялся → CF redeploy не нужен)

### Scope
- Live `.04-Src/js` / root index / stamp: **не трогали**
- v3-webgl folder: **не удаляли**

## Сделано
1. TZ написан и ferry
2. Сплит выполнен + HTML
3. FULL test attempt (vitest+qa_unit+pw)
4. Pages disable attempted (blocked)

## Что дальше (Алексей / parent)
1. Залить ferry в `C:\Users\Space\agent-transfer\refactor-v3webgl-20260923\` и в Windows SoT `C:\Obsidian\New\Projects\08-iGraSpore_V2`
2. Ручной disable GitHub Pages
3. Windows commit/push при чистом дереве (если box commit не канон)
4. Опционально: добавить linux baselines для canvas.spec.js; восстановить qa_unit.js

Полностью закончен ответ
