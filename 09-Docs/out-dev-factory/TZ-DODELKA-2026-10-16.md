# ТЗ: доделка релиза — языки es/tr/fil + статистика + хвосты U20–U22 — 2026-10-16

Объединяет: (а) аналитику из `TZ-STATS-ANALYTICS-2026-10-16.md` (этот файл —
канонический, прежний считать черновиком-источником); (б) незакрытые находки
критиков из `CHECK-DEV-2026-10-15-1114.md` §2 и `CHECK-DEV-2026-10-15-1248.md` §3;
(в) открытые строки U16, U20–U22 из `TZ-RELEASE-READY-2026-10-14-v9.md`.

Проверено на диске 16.10 (HEAD `a4652d0`): из таблиц критиков не внесён ровно
один ключ — `fil.colonyKind="Uri ng kolonya"` («kolonya» = одеколон). Все
остальные правки es/tr/fil/ru/en — в словарях и закоммичены. Все raw-файлы
критиков переименованы в `*-draft.json` (U06 выполнен).

## Часть S — языковой гейт es/tr/fil (закрытие U16)

- S.1 `fil.colonyKind`: «Uri ng kolonya» → «Uri ng kumpol ng selula»
  (аналог colonies/colonyBadge «kumpol ng selula»). Прогнать
  `tools/i18n/i18n_coverage.mjs` и `i18n_identity.mjs` после правки.
- S.2 Снимки для пакета B: es/tr/fil сейчас выключены — в Playwright
  принудительно подгружать словарь (`window.__igsForceLang`), НЕ включая язык
  в репо. 8 экранов × 390×844 на язык (menu, tutorial, game, pause, settings,
  wiki-list, wiki-article, gameover). Проверить переполнение `tr.paused`
  «DURAKLATILDI» (12 символов) — при вылезании ставить «DURAKLADI».
- S.3 Критик A, круг 4 — es/tr/fil. Жёстко по §30 v9: **отдельный новый
  диалог** (не сессия разработчика), честное имя модели, реальные
  `started_at`/`finished_at` (finished ≤ момент записи файла), свой
  `session_id`, `input_sha256` от текущих словарей. Артефакты:
  `09-Docs/i18n-review/raw/<lang>-critic-A-round4.json`, прогон
  `tools/i18n/critic_check.mjs` — должен принять (не draft). Порог A≥8.
- S.4 Пакеты критику B: перегенерировать `make_for_b.mjs` →
  `*-round4-for-B.md` (таблица ключ|ru|en|lang|где/макс-длина + sha словарей
  + ссылки на снимки S.2). Отправка Алексею пачкой — ждём B≥8
  (`raw/<lang>-critic-B-round4.json`).
- S.5 Гейт включения: для каждого языка A≥8 и B≥8 **одного** круга →
  `LANGS`/`localeConfig`/`languages.json`/`enabled:true` →
  `langs_consistency` 5/5 → пересборка AAB один раз на пачку →
  `jarsigner -verify` = `jar verified.` Языки с A<8 или B<8 остаются
  выключенными (правило №22 — «не прошёл» не выключаем, чиним и следующий круг;
  максимум 5 кругов, дальше — решение владельца).

## Часть A — статистика (Firebase, только Android)

Решение №7.1 v9 принято: Firebase Crashlytics + Analytics только в
Android-сборке, с пунктом в политике. Цель — приёмка P3 (D1 ≥ 25 %, средняя
сессия ≥ 4 мин): Play Console даёт установки/рейтинг/виталы, но не длительность
сессии и retention.

- A.1 Плагины в `06-DevOps-and-Release/android/package.json`:
  `@capacitor-firebase/analytics`, `@capacitor-firebase/crashlytics`
  (линейка 8.x под `@capacitor/core 8.5.3`), `npx cap sync android`.
- A.2 `google-services.json` — **действие владельца**: Firebase Console →
  проект на `com.igraspore.app` → скачать в
  `06-DevOps-and-Release/android/android/app/google-services.json`
  (файл в `.gitignore`; `app/build.gradle` уже применяет
  `com.google.gms.google-services` при наличии файла — строки 65–70).
  В `build.gradle` app: BOM `com.google.firebase:firebase-bom` +
  `firebase-analytics` + `firebase-crashlytics`.
- A.3 Новый файл `.04-Src/js/analytics.js` (≤120 строк, классический script,
  последним в `index.html`): единая точка `window.igsTrack(event, params)`.
  No-op если `!window.Capacitor?.isNativePlatform?.()` (веб чистый) или
  `settings.analytics===false` — события не буферизуются. Параметр `lang`
  (= `curLang`) подставляется в каждое событие автоматически.
- A.4 События (ровно 4, никаких координат/поисковых запросов/чужого контента):

  | событие | точка | параметры |
  |---|---|---|
  | `igs_session_start` | `startGame()`, `state='playing'` (main.js:328) | `lang`, `species`, `source:menu\|restart` |
  | `igs_first_divide` | успешный `doDivide(player)` / `finishDivide` по `o.isPlayer`, 1 раз на сессию (флаг `_igsDivSent`) | `lang`, `t_sec` |
  | `igs_death` | `state='gameover'` (main.js:71) | `lang`, `t_sec`, `cause`, `pop` |
  | `igs_session_end` | `visibilitychange→hidden`/`pagehide`/App pause, `gameover→menu` | `lang`, `duration_sec`, `divides`, `eats` |

  + user property `lang` при каждом `igs_session_start`.
- A.5 Краши: Crashlytics поднимается сам; `window.onerror`/
  `unhandledrejection` → `recordException` (non-fatal), только native и при
  вкл. статистике.
- A.6 Настройки: чекбокс `settings.analytics` (по умолчанию `true`,
  сохраняется в save), ключ `set.analytics` × 17 включённых словарей
  (новый ключ → сразу прогон `i18n_coverage` + `langs_consistency`;
  es/tr/fil получают ключ в рамках части S, чтобы гейт не пересдавать).
- A.7 Контент: `09-Docs/PRIVACY_POLICY.md` + `cf-publish/privacy.html`
  (ru+en) — раздел «Аналитика (только Android)»: Firebase Analytics/
  Crashlytics (Google), собираются события использования/длительность/сбои,
  НЕ собираются имена/локация/Ad ID; отключение — настройки → Статистика;
  дата обновления. Черновики Data safety (артефакт P2.9,
  `09-Docs/store-listing/DATA-SAFETY-2026-10-14.md`): «ничего не собираем» →
  «App activity + Crash logs, shared with Google (Firebase), optional».
  Строка статистики в `/lab/store-readiness.html`.

## Часть T — хвосты U20–U22 (по факту на диске)

- T.1 U20 store-листинг: есть 10 языков (`09-Docs/store-listing/*.md`),
  нужно 32 → дописать 22 (az, bn, bg, cs, el, es-419, et, fil, he, hr, hu, hy,
  id есть, it, ka, kk, lo, lt, lv, mk, mr, ms, nl, ro, sk, sl, sr, sv, sw, ta,
  te, th, tr, uk, ur, uz, vi — сверить с таблицей L.10 v9, взять недостающие),
  по 1 критику на язык (тот же протокол, что S.3–S.4), raw-файлы +
  строки в `/lab/store-readiness.html`.
- T.2 U21 сайт-закулисье: `dist-lab/lab/` собран (index, ui-audit,
  store-readiness, languages, tests, media, buttons, competitors, tz-index) —
  прогнать стенд 8793 (`tools/serve-static.mjs`), снять скриншот каждой
  страницы A.0–A.8 + `button/<id>`, положить в
  `09-Docs/out-dev-factory/shots-release-ready-2026-10-14/lab/`,
  добавить в `shots-manifest.json`.
- T.3 U22: замеры B0/B1 (та же команда «до/после»), AN-хвосты по таблице 10
  v9, P2.5–P2.12, A.7 пересборка после B1 — свести в §27 E1–E15.
- T.4 U23 (рост) — только когда P0–P2 зелёные и S/A/T закрыты.
  U24 (деплой лаба) — только после слов владельца «деплой лаба».

## Порядок, коммиты, отчёт

1. S.1 (1 ключ) → коммит `fix(i18n): fil colonyKind`.
2. Часть A код (analytics.js + точки + тесты + ключи словарей) — коммит
   `feat(analytics): firebase android-only, 4 события, opt-out`.
3. S.2 снимки + S.3 круги A (отдельные диалоги) → коммит raw+пакеты.
4. Политика/Data safety (A.7) + store-листинги (T.1) — коммит `docs:`.
5. После B≥8: S.5 включение + AAB → коммит `feat(i18n): enable es/tr/fil`.
6. T.2–T.3 — коммит `docs(lab):`.
7. Отчёт: `REPORT-TZ-RELEASE-READY-2026-10-14-v9-<YYYYMMDD-HHMM>.md`,
   финальная строка со ссылкой на heartbeat.log (V6), VERIFY OK через
   `tools/verify_report.ps1`, push.

Запреты: без деплоя, без Play Store, без force-push, без чтения `.secrets`
и `credentials.toml`, `google-services.json` не коммитить, круги критика A —
только отдельные диалоги с реальным временем (иначе → draft и не считается).

## Приёмка (всё зелёное)

- es/tr/fil включены ИЛИ честно выключены с A/B-оценками в raw-файлах.
- DebugView видит 4 события на тест-устройстве; веб-сборка — ноль запросов
  к firebase/google-analytics (Playwright-перехват).
- `npm test` зелёный + новые тесты в `run-all-tests.ps1`.
- Политика и Data safety соответствуют реальному сбору данных.
- AAB подписан, `jar verified.`
- VERIFY OK 12/12 по свежему отчёту v9.
