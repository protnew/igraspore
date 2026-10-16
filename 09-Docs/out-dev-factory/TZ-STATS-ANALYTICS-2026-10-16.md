# ТЗ: сбор статистики (аналитика + краши) — 2026-10-16

Источник решения: TZ-RELEASE-READY-2026-10-14-v9.md, развилка №7, результат **7.1**
(принято владельцем): «Firebase Crashlytics + Analytics только в Android-сборке,
с пунктом в политике». Требование P3.4 v9: события «старт, первое деление, смерть,
длина сессии» + параметр `lang`. Приёмка P3: D1 ≥ 25 %, средняя сессия ≥ 4 мин —
без аналитики не проверить (Play Console отдаёт установки/рейтинг/виталы,
но не retention и не длительность сессии).

## Скоуп

- **В скоупе**: Firebase Analytics + Crashlytics в Android-сборке Capacitor
  (`06-DevOps-and-Release/android`), тонкий JS-слой событий, обновление политики
  и черновиков Data safety, тесты.
- **Вне скоупа**: веб-версия (pages.dev / cf-publish на сайте) — аналитики нет,
  код грузится, но молчит; реклама; серверная аналитика своя.

## A. Решения (уже принятые — не обсуждаются)

| № | Решение | Источник |
|---|---|---|
| A1 | Только Android-сборка; веб без телеметрии | v9 №7.1 |
| A2 | События: старт, первое деление, смерть, длина сессии; параметр `lang` | v9 P3.4 |
| A3 | Пункт в политике конфиденциальности | v9 №7.1 |
| A4 | Выключатель «Статистика» в настройках (по умолчанию вкл; выкл = события не отправляются и не буферизуются) | эта доделка, рекомендация — дешёвый opt-out, упрощает Data safety и GDPR-позицию |

## B. Реализация

### B.1 Плагины (Android-проект)

- `06-DevOps-and-Release/android/package.json`: добавить
  `@capacitor-firebase/analytics` и `@capacitor-firebase/crashlytics`
  (версии, совместимые с `@capacitor/core 8.5.3` — 8.x линейка плагина).
- `google-services.json`: владелец скачивает из Firebase Console
  (проект на `com.igraspore.app`) и кладёт в
  `06-DevOps-and-Release/android/android/app/google-services.json`.
  Файл в `.gitignore`. `app/build.gradle` уже применяет
  `com.google.gms.google-services` при наличии файла — грэдл-правок минимум:
  BOM `com.google.firebase:firebase-bom` + `firebase-analytics` +
  `firebase-crashlytics` в зависимости app.
- `npx cap sync android` после установки.

### B.2 JS-слой `.04-Src/js/analytics.js` (новый файл ≤ 120 строк)

- Грузится в `index.html` последним (классический script, без импортов).
- API: `window.igsTrack(event, params)` — единственная точка отправки.
- Поведение:
  - Не Capacitor-native (`!window.Capacitor?.isNativePlatform?.()`) → no-op,
    события не буферизуются.
  - `settings.analytics === false` → no-op.
  - Иначе → динамический `import` моста плагина, `logEvent`/`logException`.
- Параметр `lang` (значение `curLang`) подставляется в каждое событие
  автоматически, в вызывающем коде его не пишут.

### B.3 Точки событий (4 события + 1 user property)

| Событие | Где | Параметры |
|---|---|---|
| `igs_session_start` | `startGame()` — переход `state='playing'` (`main.js:328`) | `lang`, `species`, `source:menu\|restart` |
| `igs_first_divide` | `doDivide(player)` вернул true / `finishDivide` по `o.isPlayer`, один раз за сессию (флаг `_igsDivSent`) | `lang`, `t_sec` (сек от старта) |
| `igs_death` | переход `state='gameover'` (`main.js:71`) | `lang`, `t_sec`, `cause` (stats.deathCauses доминирующая), `pop` |
| `igs_session_end` | `visibilitychange→hidden`/`pagehide`/`App pause`, а также `gameover→menu` | `lang`, `duration_sec`, `divides`, `eats` |

- User property `lang` = `curLang` — ставится при каждом `igs_session_start`.
- Длительность сессии считает и Firebase сам (`session_start`/`user_engagement`),
  но `igs_session_end.duration_sec` оставляем — он читается без выгрузок.

### B.4 Краши

- Crashlytics поднимается плагином сам (Android). JS-ошибки:
  `window.onerror`/`unhandledrejection` → `recordException` (non-fatal),
  только на native и только при вкл. статистике.

### B.5 UI: выключатель

- В `setO` (настройки) чекбокс `settings.analytics` (по умолчанию `true`),
  ключи словаря `set.analytics` × 17 языков; сохранение в save-объект
  вместе с остальными настройками.

## C. Контентные правки

- `09-Docs/PRIVACY_POLICY.md` + `cf-publish/privacy.html` (ru+en):
  новый раздел «Аналитика (только Android)»: Firebase Analytics/Crashlytics
  (Google), что собирается (события использования, длительность, сбои),
  что НЕ собирается остаётся как было (имена, локация, рекламный ID — мы
  не включаем Ad ID), как отключить (настройки → Статистика).
  Дата обновления документа.
- Черновики Data safety (артефакт P2.9): переключить с «ничего не собираем»
  на «App activity + Crash logs, shared with Google (Firebase), optional».
- `/lab/store-readiness.html`: пункт статистики отразить в чек-листе.

## D. Тесты

- `vitest`: `analytics.test.js` — no-op вне Capacitor; no-op при
  `settings.analytics:false`; `lang` автоподставляется; `igs_first_divide`
  стреляет один раз на сессию; события не бросают при отсутствии плагина.
- `playwright` (контрактный конфиг): в веб-сборке ни одного запроса
  к `firebase`/`google-analytics` доменам (перехват `page.on('request')`).
- `lint`: `analytics.js` — 0 кириллических литералов (новые строки UI —
  через `tt()`/`data-k`).
- Ручная приёмка на девайсе/эмуляторе: Firebase DebugView показывает
  `igs_session_start` при старте, `igs_first_divide` после Q,
  `igs_death` при гибели, `igs_session_end` при сворачивании.

## E. Приёмка

1. `npm test` зелёный, новый набор тестов входит в `run-all-tests.ps1`.
2. Собранный AAB (`jarsigner -verify` → `jar verified.`), DebugView видит
   все 4 события.
3. Политика обновлена и лежит по URL (после деплоя — P2.8).
4. Data-safety черновики соответствуют реальному сбору.
5. В веб-сборке нулевой трафик телеметрии (тест D).
6. Выключатель реально глушит события (юнит + ручной чек).

## F. Порядок

F1 ключи `set.analytics` ×17 → F2 `analytics.js` + точки событий → F3 тесты
→ F4 плагины/gradle → F5 политика + Data safety → F6 сборка AAB + DebugView
→ F7 коммит `feat(analytics): firebase android-only, 4 события, opt-out`.

## G. Чего тут нет (сознательно)

- UMP/consent-dialog для EEA не вводится: аналитика без рекламы и без
  Ad ID + opt-out в настройках + пункт в политике. Если позже включим
  рекламу/Ad ID — отдельное ТЗ с UMP.
- Свои серверы/метрики не поднимаем — всё через Firebase.
- Никаких событий с координатами игрока, содержимым вики-поиска и т.п. —
  только 4 события из таблицы B.3.
