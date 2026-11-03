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
