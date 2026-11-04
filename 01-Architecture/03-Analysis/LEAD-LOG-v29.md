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

## 2026-11-04 02:45 Asia/Jerusalem — neon pond CLEAN + LIVE shots
- neon_pond_bg.jpg procedural CLEAN (water/rays/walls/bed/particles; NO organisms/HUD)
- theme_neon_draw contour glow tightened; fallback shadowBlur reduced; bed overlay alpha 0.42
- LIVE browser shots (box :8820 + headless chrome): menu/pond/bestiary → /workspace/v29all3/*_neon-bio_live.jpg + side_pond_neon-bio.jpg
- bestiary labels = scientific names; NO deploy
- theme_neon_draw v2: contour-only glow (no soft circular halo plates / no lighter bloom)

## 2026-11-04 02:55 Asia/Jerusalem — phase-contrast dedicated assets
- phase_pond_bg.jpg CLEAN (no orgs/HUD); 101 species sprites; theme_visuals bed+thumbs
- LIVE shots box :8820 → /workspace/v29all3/*_phase-contrast_live.jpg + sides; labels scientific; NO deploy

## 2026-11-04 03:05 Asia/Jerusalem — engraving dedicated assets
- clean pond bg (no orgs/HUD) + 101 species sprites; theme_visuals bed+thumbs
- LIVE shots /workspace/v29all3/*_engraving_live.jpg + sides; scientific labels; NO deploy

## 2026-11-04 03:05 Asia/Jerusalem — cyberpunk-scanner dedicated assets
- clean pond bg (no orgs/HUD) + 101 species sprites; theme_visuals bed+thumbs
- LIVE shots /workspace/v29all3/*_cyberpunk-scanner_live.jpg + sides; scientific labels; NO deploy

## 2026-11-04 03:05 Asia/Jerusalem — glass-lab dedicated assets
- clean pond bg (no orgs/HUD) + 101 species sprites; theme_visuals bed+thumbs
- LIVE shots /workspace/v29all3/*_glass-lab_live.jpg + sides; scientific labels; NO deploy

## 2026-11-04 03:05 Asia/Jerusalem — haeckel-watercolor dedicated assets
- clean pond bg (no orgs/HUD) + 101 species sprites; theme_visuals bed+thumbs
- LIVE shots /workspace/v29all3/*_haeckel-watercolor_live.jpg + sides; scientific labels; NO deploy

## 2026-11-04 neon-bio LIVE pass (box)
- screen-space neon_pond_bg under water; swiss+neon sprites at o.x/o.y; HUD/menu neon CSS; themePondBar no overlap 375/1400
- shots /workspace/v29neon/; FPS target ≥ classic; JS ≤500

## 2026-11-04 03:24 IST — neon-bio LIVE v2 (acceptance retry)

Owner rejected prior neon LIVE (~60%): huge identical ovals, Pond style clipped on 375, Divide/Energy mid-scene, cheap wavy tubes/bubbles instead of painterly bed.

Fixes:
1. Species PNG sprites via `sp.num-1` / array index (was missing → bake-only ovals); `neonDrawSz` ≈ sz*2.6 (readable, not half-screen); zoom boost 5.5 removed.
2. `#themePondBar` mobile: kill `.theme-sel-wrap{min-width:120}` that forced select to 120px past edge; bar right=18 width=82; select fully in viewport (pink gap ≥18px @375).
3. `#hDivReady` / `#divReason` neon mobile → bottom-left above actBar (not mid-scene top).
4. Rebuilt painterly `neon_pond_bg.jpg` (rocky cavern, surface, rays, glowing bed); skip `renderShore`/`renderBubbles`/`renderSediment` for neon; wrapWater = screen-space bed only.

FPS @1400: neon 60 ≥ classic 55; @375: neon 60 ≈ classic 60. JS: neon_draw 177, visuals 500, engine 52. Shots `/workspace/v29neon/*_v2.jpg`. No deploy. Honest eye ~85–88% vs concept 03 (still HUD chrome differs from circular concept icons).

## 2026-11-04 03:34 IST — neon-bio LIVE v3

Owner rejected v2 (~70%): Pop:11, dull plaques, black left wall, square buttons.

(0) Pop:11 was shot-script artifact (`orgs.length=0` seed). Real spawn classic=297 neon=297 delta=0 same seed. Added `.04-Src/tests/test_theme_pop_invariant.mjs` (07-QA is gitignored). sp.num only affects PNG index in theme_neon_draw — not biology/spawn.

(1) Species PNGs: punched dark fills → transparent; removed draw tint ellipse; single-pass contour glow (FPS-safe).
(2) neon_pond_bg rebuilt: translucent symmetric cave rims + surface band + rays + bed; shore/bubbles still skipped.
(3) actBar buttons border-radius:50% circular neon.

FPS: neon 60 ≥ classic 51 @1400; 60/60 @375. JS neon_draw 169 / visuals 500 / engine 52.
Shots /workspace/v29neon/*_v3.jpg. Honest eye ~85%. No deploy.

### v3 final metrics (2026-11-04 ~03:45 IST)
- Pop invariant: classic=298 neon=298 Δ0 (`.04-Src/tests/test_theme_pop_invariant.mjs` PASS)
- LIVE shots Pop≈297–300; circular actBar (48×48)
- FPS: neon 60–61 ≥ classic ~57 @1400; neon 60 @375
- JS: theme_neon_draw 168 / theme_visuals 500 / theme_engine 52
- bed neon-bio-v5 + translucent cave walls w/ cyan·magenta rims + surface band
- Honest eye vs concept 03: ~85% (surface shimmer & creature cilia detail still weaker)
- No deploy


## 2026-11-04 03:55 IST — neon-bio LIVE v4

Owner rejected v3 (~50%): black upper void + dotted lines + rectangular ray; flat blue jagged rect; dull small creatures. Root cause: `render.js` water `clip()` clipped fullscreen `neon_pond_bg` to world water band; STEP1 sky/water gradients + sky dots + sunRays still painted.

Fix:
- render.js: neon draws `neon_pond_bg` cover on full viewport with cam parallax in STEP1; skips sky/water/sunRays/sediment/shore/bubbles clip path
- theme_visuals: neon sky/water no-op; expose `__igsNeonPondBg`; skip renderSunRays; postFX vignette only; bed v6
- neon_pond_bg rebuilt from concept 03 (HUD circles scrubbed)
- creatures ~2× drawSz + brighter glow (shadow + lighter pass)

Metrics: Pop invariant Δ3 PASS (297/300). FPS neon 60 ≥ classic 57 @1400; 60/60 @375. JS visuals 474 / neon_draw 171 / engine 52. Shots `/workspace/v29neon/*_v4.jpg`. Honest eye ~88% vs concept (same cave). No deploy.


## v5 neon-bio (2026-11-04)
- neon_pond_bg.jpg → CLEAN owner background (720×1280, q84, 127KB); concept-baked v4 bg archived to .10-Archive/neon-bg-concept-baked-2026-11-04/. Concept images are never used as game backgrounds.
- theme_neon_draw.js: procedural species bodies (translucent glowing fill, bright contour, cilia/flagella/phage tail, inner speckles + nucleus); no oval rings, no species PNGs.
- render.js: cover background with clamped parallax (no uncovered edge when camera is far off-centre).
- Tests: pop invariant PASS; FPS neon 60.2 ≈ classic 60.2 @375; JS: render 230 / theme_visuals 474 / theme_neon_draw 162.
- Shots: /workspace/v29neon/*_v5.jpg + side_*_v5.jpg.

## v5.1 neon + v5 styles (2026-11-04)
- neon: palette cyan/magenta (green only for producers, yellow rare), denser cilia (×2.8), creatures ×1.9 at ≥900px. Commit e61289b.
- Generic v5 pipeline for 6 styles: clean bg cover full viewport + old layers off + procedural per-style creatures (theme_neon_draw.js) + procedural bestiary thumbs + style-themes-v5chrome.css (HUD/menu/bestiary).
- phase-contrast: clean bg (old → .10-Archive/pond-bg-pre-v5-2026-11-04/), grey translucent bodies with bright halo. Pop PASS, FPS 375 60/60, 1400 51 vs classic 55 (headless).
- engraving: clean bg, sepia paper bodies + ink hatching/cross-hatch + ink contour; light chrome (paper/ink). Pop PASS.
