# LEAD-LOG v29 — темы бестиария/водоёма + A/B статистика

Начало: 2026-11-03 16:48 Asia/Jerusalem (UTC+2)
База: 7103e06, ветка release-ready-2026-10-14

## Хронология

### 2026-11-03 16:48 — ТЗ v29 создано + референсы (коммит 7103e06)
### 2026-11-03 17:01 — Владелец выбрал Q1.1 (CF Analytics Engine + lab дашборд)
### 2026-11-03 17:17 — ТЗ обновлено под Q1.1 + 5 критиков (Э1–Э5) вшиты
- Архитектура Worker POST/GET, SQL API только env, дашборд theme-stats
- Следующее: commit ТЗ → волна 1 код

### 2026-11-03 17:18 — Старт волны 1 (разработка)

### 2026-11-03 17:35 — Волна 1 код
- theme_engine.js, theme_analytics.js, 3 JSON, Worker skeleton, theme-stats.html
- index/ui_screens/CSS/en+ru keys
- vitest theme_engine.test.js


### 2026-11-03 17:41 — shots+FPS старт
- vitest theme_engine 6/6 PASS
- коммиты ab665cb, e7081ed
- запуск tools/v29_theme_shots.cjs (матрица 48 + FPS 30с×3)


### 2026-11-03 17:55 — shots retry на :8820
- :8795 hang/spawn-null при test=1; новый стенд :8820 стартует (paused+alive)


### 2026-11-03 18:07 — resume после прерывания
- HEAD: 3973bb8; матрица 48/48, hitTargets 145x48, vitest 3+3 PASS уже были
- FPS remeasure (30с, sort asc): classic med20/p5=20; neon-bio med20/p5=15; phase med30/p5=20
- 8 png в C:\Users\Space\agent-transfer\v29\; CopyToBox был aborted
- Дальше: commit FPS-отчёта → копирование 8 кадров → eye-review → REPORT → APK/чек-лист → СТОП волны 1

### 2026-11-03 18:11 — FPS gate + 8 кадров на box
- CopyToBox 8/8 → /workspace/v29/
- Eye-read: pond Classic/Neon/PhaseContrast select виден; bestiary Neon/Phase стили; lab FIXTURE
- Добавлен startFpsGate + i18n theme.fpsFallback (en/ru)

### 2026-11-03 18:12 — СТОП волны 1: PASS
- REPORT: 01-Architecture\03-Analysis\REPORT-TZ-08-SPOR-v29-wave1-20261103.md
- eye-review.json PASS (8 кадров просмотрены Read)
- vitest 6/6 после FPS gate
- APK файлы на диске; emulator -no-window e2e не закрыт
- Оговорки: слабая WebGL-дельта пруда; прод AE — чек-лист владельца
- Волна 2 НЕ начата

### 2026-11-03 19:43 — все 6+classic стили: код
- JSON×7, theme_engine THEMES, CSS бестиария по мокапам
- WebGL uniforms + 2D rgbTop/Mid/Bot; pond bar right:64px (не на pause)
- lab/theme-preview.html тестовые ссылки; URL ?themePond=&themeBestiary=

### 2026-11-03 19:44 — shots all 7 styles start (vitest 6/6 @ c4365d4)


### 2026-11-03 19:47 — web shots 7×2×2=28 PASS
- overlapFails=0 (pond bar vs pause)
- FPS 375: classic med30/p5=20; neon med30/p5=20 (neon p5 ≥ classic)
- out: 09-Docs\out-dev-factory\theme-shots-v29-all\

## 2026-11-03 19:55 Asia/Jerusalem — all-styles strengthen + APK sync
- Strengthened neon/glass/cyberpunk shader rgb + glass/phase/engraving wiki light CSS force
- Synced theme JSON/engine/webgl/effects/css into www-release for local APK rebuild
- Emulator emulator-5554 device ready; next: assembleDebug + install + APK shots
- Re-shoot web 1400/375 after color fixes

## 2026-11-03 20:37 Asia/Jerusalem — closeout all-styles
- HEAD a1482a4 (+REPORT next): specificity #wikiO.ov.show fixed; light bestiary glass/phase/haeckel/engraving
- Web 28 shots reshot; APK 14 theme shots via CDP on emulator-5554; overlapFails=0; neon p5=classic=20 on 375
- vitest theme_engine 6/6 ×3; qa_unit 26/26; playwright lab_tests 5/5
- Pond water deltas still milder than mockups (esp. neon); organism sprites not per-theme
- Box /workspace/v29all/ receiving post-fix PNGs + apk samples

## 2026-11-03 21:46 Asia/Jerusalem — resume owner eye-check (neon=classic / haeckel no art)
- HEAD was 2caff5b: theme_visuals + darker neon dayLight 0.12 + chrome channel shots
- Web matrix 28/28; thumbs=107 all styles; FPS neon med59.9 = classic; overlapFails=0
- Eye: neon sky dark OK, water/glow still below mock; haeckel cards HAVE sprite thumbs now
- Auto MAD % inflated (neon pond 92.8) — eye table will be stricter
- APK: assembleDebug OK (Java 17 lang level temp on capacitor); MainActivity WebView debug before onCreate; emulator-5554 up; CDP socket for app WebView still missing — next screencap via zip-boot theme or input
- Box target /workspace/v29all2/ small PNG + side-by-side
- Ban: no i18n es/tr/fil commit; no .04-Src/src; no add -A; no prod


## 2026-11-03 22:07 Asia/Jerusalem — strict eye vs inflated auto MAD
- Web: 28 shots + side-by-side; FPS neon=classic (med 59.9); thumbs count 107/style
- Eye (strict): neon pond ~48% (sky dark OK; water murky; organism glow << mock rays/outlines)
- Eye: haeckel bestiary ~72% (thumbs present but faint technical sprites ≠ watercolor gallery mock)
- Auto MAD neon pond 92.8 / haeckel best 86.4 — REJECTED as inflated (owner was right)
- APK: assembleDebug+cap sync+themes in assets; emulator ANR/System UI not responding on kq_test35; theme APK shots invalid (wait-for-debugger earlier, then crash). Need stable emu pass next.
- Box /workspace/v29all2/: sides + key web shots (no big zip)


## 2026-11-04 01:20 Asia/Jerusalem — neon-bio dedicated assets + species-named bestiary
- 101 species sprites under assets/themes/neon-bio/sprites/species/NNN.png (labels=SPECIES_DB names, not shape ids)
- theme_neon_draw.js + theme_visuals ensureNeonDraw/wiki species thumbs; HUD css; Worker+theme-stats all 7; tests ready; NO deploy
- box sides /workspace/v29all3/side_{menu,pond,bestiary}_neon-bio.jpg


## 2026-11-04 02:25 Asia/Jerusalem — neon-bio pond → concept 03
- neon_pond_bg.jpg rebuilt (concept env + god-rays + cavern walls + biolum bed); theme_visuals drawNeonPondBed alpha 0.78 + path fallback
- box sides: /workspace/v29all3/side_pond_neon-bio.jpg + pond_neon-bio_dedicated.jpg (v3)
- bestiary species names already real; NO deploy
- note: Windows Shell hung — commit via GitHub API; local Obsidian tree may lag until pull

- also committed pond/neon_pond_bg.jpg fallback path (26771c5)

## 2026-11-04 02:32 Asia/Jerusalem — neon pond bg CLEAN (no baked orgs/HUD)
- neon_pond_bg.jpg rebuilt procedural: water/rays/walls/bed/particles ONLY
- removed concept organisms + corner HUD baked into prior bg
- live browser shots next (box http+headless); no deploy
