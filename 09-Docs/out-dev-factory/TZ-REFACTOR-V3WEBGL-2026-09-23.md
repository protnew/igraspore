# TZ — refactor `.04-Src/v3-webgl/js` monoliths >500 LOC

**Дата:** 2026-09-23 (Europe/Volgograd, UTC+3)  
**Проект:** `C:\Obsidian\New\Projects\08-iGraSpore_V2`  
**Канон live URL:** https://igraspore.pages.dev/?v=1790087247  
**Git tip (ожидаемый):** ~`7005248`  
**Область:** ТОЛЬКО `.04-Src/v3-webgl/` (прототип / сырьё пакета C).  
**Вне области:** live SoT `.04-Src/js/` — уже сплитнут, ни один файл >500; не трогать, пока файл сам не пересечёт 500 в ходе этой работы.

---

## Проблема

Live `.04-Src/js/` уже разбит (`biology_*`, `render_*`, `main_events`, `ai_move`, `world_update`, …).  
Прототип `.04-Src/v3-webgl/js/` всё ещё монолитен (это и есть «7 файлов ~968»):

| Файл | LOC (до) | Статус |
|------|----------|--------|
| `render_effects.js` | ~968 | >500 |
| `biology.js` | ~894 | >500 |
| `render.js` | ~780 | >500 |
| `render_entities.js` | ~661 | >500 |
| `main.js` | ~587 | >500 |
| `ai.js` | ~565 | >500 |
| `world.js` | ~524 | >500 / near gate |

`TZ.md`: **не удалять** `v3-webgl` — сырьё для package C / WebGL style. Рефактор **in place**: сплит модулей по тем же швам, что live.

Дополнительно: `v3-webgl/index.html` сейчас ссылается на `04-Src/js/...` (чужие/битые относительные пути) вместо локального `js/`. После сплита HTML должен грузить локальные модули.

---

## Решение

### Принципы
1. Поведение идентично (byte-stable extract по natural seams; без правок логики).
2. Имена модулей зеркалят live, где код уже имеет те же швы.
3. Сохранять global/`window` контракты (script-tag globals).
4. Оригиналы монолитов → archive `_archive-pre-split-2026-09-23/` (never delete).
5. Каждый новый/оставшийся файл **<500 LOC**.
6. Live `.04-Src/js` и root `index.html` — out of scope.

### План сплита (целевые модули)

#### A) `render_effects.js` (~968)
| Целевой файл | Содержимое (швы) |
|--------------|------------------|
| `render_effects.js` | `renderSky`, `renderWater` |
| `render_surface.js` | `renderParallax` … `renderSunRays` (lily/glitter/snell) |
| `render_fx.js` | `renderSediment` … `renderSunOverlay` |

#### B) `biology.js` (~894)
| Целевой файл | Содержимое |
|--------------|------------|
| `biology.js` | `spawnOrg`, `canDivide`, `divideBlockReason`, `doDivide` |
| `biology_divide.js` | `finishDivide` |
| `biology_eat.js` | `eatOrg`, `killOrg`, `doCyst` |
| `biology_virus.js` | `updateInfections`, `updateViruses`, `spawnVirus` |
| `biology_update.js` | stub (как live: хуки / указатель) |
| `biology_update_core.js` | `updateOrg` |

#### C) `render.js` (~780)
| Целевой файл | Содержимое |
|--------------|------------|
| `render.js` | `render()` (+ stub minimap) |
| `render_helpers.js` | shore/trails/organisms/particles/target/daynight/health/tooltip/minimap/popgraph |
| `render_edu.js` | `ORGANELLE_INFO`, `organelleSetFor`, `renderOrganelleEdu`, `ensureOrgEduPanel` |

#### D) `render_entities.js` (~661)
| Целевой файл | Содержимое |
|--------------|------------|
| `render_entities.js` | `drawBody`, `renderOrg` |
| `render_organs.js` | `drawOrgans`, `drawAppendages`, `renderViruses` |

#### E) `main.js` (~587)
| Целевой файл | Содержимое |
|--------------|------------|
| `main.js` | audio stubs, `gameLoop`, tutorial, `startGame` (до `// === EVENT LISTENERS ===`) |
| `main_events.js` | listeners, audio playSound body, `toggleRenderModeLarge`, INIT |

#### F) `ai.js` (~565)
| Целевой файл | Содержимое |
|--------------|------------|
| `ai_move.js` | `ensureFacing`, `turnToward`, `thrustAlongFacing`, `moveOrg` (+ nearby helpers if any) |
| `ai.js` | `playerAutoAI` … `aiOrg` / `steerToward` |

#### G) `world.js` (~524)
| Целевой файл | Содержимое |
|--------------|------------|
| `world.js` | `EventManager`, grids, `initWorld`, `clampToPuddle` |
| `world_update.js` | `updateWorld`, `updateCamera`, `updateTodUI`, `generateTempGrid` |

### Порядок `<script>` в `.04-Src/v3-webgl/index.html`

Заменить битые `04-Src/js/...` на локальные `js/...` (cache-bust `?v=1790087247` ок):

1. config → locomotion → organs  
2. world → world_update  
3. biology → biology_divide → biology_eat → biology_virus → biology_update → biology_update_core  
4. ai_move → ai  
5. render_effects → render_surface → render_fx → render_helpers → render → render_entities → render_organs → render_edu  
6. ui → ui_menus  
7. main → main_events  

Сохранить `window.HYBRID_GL = true` перед скриптами.

### Git / Pages / тесты (часть исполнения)
- Commit (Windows SoT предпочтительно; иначе box lean-push + ferry): только пути v3-webgl + docs. Msg: `refactor(v3-webgl): split modules over 500 LOC`. No force-push.
- Disable GitHub Pages (`gh api` DELETE) — канон только pages.dev.
- FULL tests: vitest + qa_unit + Playwright (hard timeout 10–12 min). Логи → ferry `refactor-v3webgl-20260923/`.

---

## Результат / Acceptance

1. Каждый `.js` в `.04-Src/v3-webgl/js/` (кроме `_archive*`) **<500 LOC**.
2. Нет изменения live SoT / stamp (кроме неизбежного).
3. v3-webgl HTML грузит локальные модули в правильном порядке.
4. Поведение прототипа без намеренной смены логики (extract-only).
5. Отчёты: этот TZ + `EXEC-REFACTOR-V3WEBGL-2026-09-23.md` + ferry mirror.
6. Тест-гейт: логи vitest / qa_unit / playwright с pass|fail|timeout.
7. GH Pages: disabled **или** честный BAG + manual step (не выдумывать успех).
8. FOUND_BUGS.md append-only с новыми BAG-IG при необходимости.

---

## STOP
- Не удалять папку v3-webgl; не force-push; не rewrite history.
- Не трогать APK/www без нужды.
- Не менять live game behavior.
