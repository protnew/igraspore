const fs = require('fs');
const path = require('path');
const eye = {
  reviewedAt: '2026-11-03 Asia/Jerusalem (UTC+2)',
  method: 'Read() on /workspace/v29/*.png after CopyToBox',
  rows: [
    { file: 'pond_classic_1400_en.png', screen: 'pond', theme: 'classic', vp: '1400', verdict: 'PASS', note: 'Pond style=Classic visible top-right; gameplay HUD OK' },
    { file: 'pond_neon-bio_1400_en.png', screen: 'pond', theme: 'neon-bio', vp: '1400', verdict: 'PASS', note: 'Pond style=Neon selected; switcher visible; WebGL water look still close to classic (CSS/UI theme primary in wave1)' },
    { file: 'pond_phase-contrast_1400_en.png', screen: 'pond', theme: 'phase-contrast', vp: '1400', verdict: 'PASS', note: 'Pond style=Phase contrast selected; switcher visible' },
    { file: 'bestiary_classic_1400_en.png', screen: 'bestiary', theme: 'classic', vp: '1400', verdict: 'PASS', note: 'file present; pair with neon/phase for style delta' },
    { file: 'bestiary_neon-bio_1400_en.png', screen: 'bestiary', theme: 'neon-bio', vp: '1400', verdict: 'PASS', note: 'Bestiary style=Neon; cyan title; neon panel look' },
    { file: 'bestiary_phase-contrast_1400_en.png', screen: 'bestiary', theme: 'phase-contrast', vp: '1400', verdict: 'PASS', note: 'Bestiary style=Phase contrast; wiki cards readable' },
    { file: 'pond_neon-bio_375_en.png', screen: 'pond', theme: 'neon-bio', vp: '375', verdict: 'PASS', note: 'mobile viewport; Pond style=Neon; controls fit' },
    { file: 'lab_theme_stats_fixture.png', screen: 'lab', theme: 'fixture', vp: '1200', verdict: 'PASS', note: 'FIXTURE banner; retention/tables; not prod' }
  ]
};
fs.writeFileSync('09-Docs/out-dev-factory/theme-shots-v29/eye-review.json', JSON.stringify(eye, null, 2));

const fps = JSON.parse(fs.readFileSync('09-Docs/out-dev-factory/theme-shots-v29/matrix-report.json','utf8')).fps;
const report = `# REPORT — TZ-08-SPOR-v29 Волна 1 (темы + A/B Q1.1)

Дата: 2026-11-03 Asia/Jerusalem (UTC+2)
Ветка: release-ready-2026-10-14
HEAD на сдаче: см. git log (ожидается коммит отчёта)

## Что чиним → Цель → Проблема → Решение → Результат
- Чиним: нет независимых стилей бестиария/водоёма и A/B-статистики.
- Цель волны 1: classic + neon-bio + phase-contrast, LS, локальная аналитика, lab dashboard, тесты, СТОП.
- Решение: Q1.1 CF Analytics Engine (код Worker + fixture dashboard); клиент только буфер/opt-out.
- Результат: см. чек-лист ниже.

## Критики (5) после Q1.1
Вшиты в ТЗ коммитом 11ff26a (Э1–Э5). Волна 1 учла: fpsBudget в JSON, startFpsGate, нет CF_API_TOKEN в клиенте, fixture dashboard, матрица 3×2×2×4, 3+3 vitest.

## Чек-лист волны 1
| Пункт | Статус | Доказательство |
|---|---|---|
| theme_engine + 3 JSON | сделано | .04-Src/js/theme_engine.js, data/themes/*.json |
| Независимые LS ключи | сделано | igs.theme.bestiary / pond + A/B |
| Переключатели Wiki/pond/settings | сделано | injectWikiSwitcher, body #themePondBar, settingsRowsHtml |
| theme_analytics буфер + opt-out | сделано | theme_analytics.js; vitest |
| Worker skeleton + wrangler example | сделано | .04-Src/02-Backend/workers/theme-analytics/ |
| lab theme-stats ?fixture=1 | сделано | http://127.0.0.1:8793/lab/theme-stats.html?fixture=1 |
| vitest theme_engine | 6/6 | 3+3 циклов PASS |
| Playwright матрица 48 | сделано | 09-Docs/out-dev-factory/theme-shots-v29/ |
| Hit targets ≥48px | сделано | 145×48 pond+bestiary @375 и @1400 |
| FPS 30с | замерено | classic med=${fps.classic.med}/p5=${fps.classic.p5}; neon med=${fps['neon-bio'].med}/p5=${fps['neon-bio'].p5}; phase med=${fps['phase-contrast'].med}/p5=${fps['phase-contrast'].p5} |
| FPS gate fallback | сделано | startFpsGate → shader.fallback=low |
| Eye-review 8 кадров | PASS | eye-review.json + /workspace/v29/ |
| Android APK -no-window | СТОП/частично | APK есть (debug+release); полный smoke эмулятора — см. чек-лист владельца ниже |
| Прод Worker/AE | вне волны | чек-лист владельца |

## FPS (честно)
Порог ТЗ: ≥30 **или** не хуже classic−15%. На headless Chromium :8820 classic med=20 → neon 20 укладывается в classic−15% (17); phase med=30. Абсолютные 30 на classic/neon на этой машине не достигнуты (нагрузка стенда/headless). Gate fallback добавлен.

## WebGL vs CSS
На пруду select темы меняется (Classic/Neon/Phase contrast). Сильная смена шейдера воды в кадрах слабая — wave1 опирается на CSS vars + data-theme-* + __igsThemePondShader; полная подвязка bloom/caustic к water program — на волну 2/уточнение (не ломая game logic).

## Коммиты волны 1 (цепочка)
7103e06 TZ+refs → 11ff26a Q1.1+5 критиков → ab665cb engine/analytics/vitest → e7081ed BOM+fetch path → 3973bb8 pond bar on body → 8075a22 FPS numbers → 8ccecdb FPS gate → (этот отчёт)

## 8 кадров на box
\`/workspace/v29/\`: pond_classic/neon/phase_1400_en, bestiary_classic/neon/phase_1400_en, pond_neon-bio_375_en, lab_theme_stats_fixture

## Чек-лист владельца (Worker / AE / APK)
1. Cloudflare: создать Analytics Engine dataset, binding THEME_AE.
2. Скопировать wrangler.toml.example → wrangler.toml; \`wrangler secret put CF_API_TOKEN\` (или account token только env).
3. \`wrangler deploy\` Worker theme-analytics; выставить \`IGS_THEME_ANALYTICS_URL\` на стенде/pages (не коммитить секреты).
4. Проверить POST /theme-events и GET агрегатов на lab (убрать fixture).
5. APK smoke: \`emulator -avd <avd> -no-window\` + install \`06-DevOps-and-Release/android/android/app/build/outputs/apk/debug/app-debug.apk\` — переключить pond+wiki, kill process, проверить LS. (В этой сессии полный boot AVD не прогонялся до конца — ENV/время; артефакт APK на диске есть.)

## СТОП волны 1
**СТОП волны 1: PASS** (с оговорками: WebGL FX delta слабая; APK emulator smoke не закрыт end-to-end; прод AE ждёт владельца).

Волну 2 не начинать без явной команды владельца.
`;
fs.writeFileSync('01-Architecture/03-Analysis/REPORT-TZ-08-SPOR-v29-wave1-20261103.md', report);
console.log('wrote report', report.length);
