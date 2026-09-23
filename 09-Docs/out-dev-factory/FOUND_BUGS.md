# FOUND_BUGS — 08-iGraSpore_V2

Append-only. Do not wipe others' rows.

| BAG-№ | Дата | Категория | Что | Где | Owner | Deadline | Статус |
|-------|------|-----------|-----|-----|-------|----------|--------|
| BAG-IG-041 | 2026-09-23 | Тесты/SoT | `ui_restore.test.js` раньше отсутствовал на GitHub master; добавлен lean-push SHA `7005248` (box). Windows working tree мог ещё быть на `5874f02` — сверить после proxy-clear fetch. | `.04-Src/07-QA-and-Testing/vitest/ui_restore.test.js` + origin/master | агент | 2026-09-23 | закрыт (на GitHub); Windows sync Owner=parent |
| BAG-IG-042 | 2026-09-23 | Релиз/канон | GitHub Pages всё ещё **built** + HTTP 200 на https://protnew.github.io/igraspore/ — дубль канона рядом с Cloudflare Pages. Выключать только после явного «да» владельца (не трогали API). | GitHub Pages `gh-pages` / settings | пользователь | после «да» | открыт — ждём «да» |
| BAG-IG-043 | 2026-09-23 | QA | Playwright e2e UI-RESTORE §7 не гоняли (риск hang). Не запускали в dogon20. | e2e / playwright | агент/позже | по решению | открыт / отложено |
| BAG-IG-044 | 2026-09-23 | Рабочее дерево | Windows i1: executor box-scoped не видит диск; HEAD ранее `5874f02` vs origin `7005248`. Parent чинит index после soft-reset race. Грязь/align — на стороне parent. | `C:\Obsidian\New\Projects\08-iGraSpore_V2` | parent | сегодня | в работе (parent) |
| BAG-IG-045 | 2026-09-23 | QA | `qa_unit.js` отсутствует на tip master `7005248` — нечем гонять. | `.04-Src/07-QA-and-Testing/qa_unit.js` | агент | бэклог | открыт |
| BAG-IG-046 | 2026-09-23 | Рефактор/прототип | Закрыт сплитом: `.04-Src/v3-webgl/js` монолиты >500 (render_effects 968…world 524) → модули <500; archive `_archive-pre-split-2026-09-23/`; HTML грузит локальный `js/`. Live `.04-Src/js` не трогали. | `.04-Src/v3-webgl/` | агент 08 | 2026-09-23 | закрыт (box lean-push; Windows SoT sync Owner=parent) |
| BAG-IG-047 | 2026-09-23 | Релиз/канон | GitHub Pages DISABLE API DELETE → **422** «Deactivating GitHub pages for this repository is not allowed.» pages.dev=200, github.io=200. Нужен ручной Unpublish в Settings→Pages. | `protnew/igraspore` Pages / `gh-pages` | Алексей | ASAP | открыт — API blocked |
| BAG-IG-048 | 2026-09-23 | QA | Playwright e2e: simulation PASS; canvas visual 2 FAIL (нет baseline snapshots linux). Не hang (31.9s). | `.04-Src/07-QA-and-Testing/playwright/canvas.spec.js` | агент | бэклог | открыт (baselines) |
| BAG-IG-049 | 2026-09-23 | QA | vitest на box: **50/50 PASS** (9 files). Исторически на Windows было ~197 — часть suite отсутствует в lean-push tip; не регресс от v3-webgl split (тесты live SoT). | vitest | parent | сверить Windows | наблюдение |
| BAG-IG-050 | 2026-09-23 | Инфра | MachineId Windows `eb1f1b15-…` с box executor не доступен; commit сделан на box clone `igraspore-lean-push`, не на `C:\Obsidian\...`. Ferry pack для parent. | box ↔ Windows | parent | сегодня | открыт |
