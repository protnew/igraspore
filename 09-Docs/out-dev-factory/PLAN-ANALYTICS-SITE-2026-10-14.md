# PLAN: аналитический «закулисный» сайт iGraSpore (igraspore-lab) — 2026-10-14

**Проблема:** аналитика iGraSpore (аудит UI, готовность к стору, языки, тесты, скриншоты) разбросана по .md в 09-Docs и не видна владельцу в браузере/с телефона.
**Решение:** отдельный Cloudflare Pages проект `igraspore-lab` по образцу Космоквеста (`kq-dev`): та же игра + статические страницы аналитики, генерируемые Node-скриптом из .md/.json.
**Результат:** один URL https://igraspore-lab.pages.dev/ — игра и все отчёты/таблицы/видео; прод https://igraspore.pages.dev/ не трогается.

## Как сделано в Космоквесте (образец)
- Папка: `C:\Obsidian\New\Projects\25-Космоквест\.04-Src\01-Frontend` (Vite).
- CF-проекты: `kosmoquest` (прод, https://kosmoquest.pages.dev/), `kq-dev` (закулиса, https://kq-dev.pages.dev/), `kq-atlas` (атлас, `npm run build:atlas`, отдельный html-вход atlas.html).
- Деплой закулисы: `npm run deploy:dev` = `npm run build && node tools/qa/build-humor-tree.js && wrangler pages deploy dist/web --project-name=kq-dev --branch=main`.
- Страницы аналитики — **генерируются скриптом**, не руками: `tools/qa/build-humor-tree.js` читает `content/text/ru.json`, `content/scenes.json`, `.07-QA-and-Testing/humor-candidates/batch-*.json` и пишет `dist/web/humor-tree.html` + копирует картинки в `dist/web/assets/img/` **после** сборки — поэтому в прод (`public/` чистый) не попадает.
- Стиль: тёмная тема, CSS-переменные `--bg:#0c1020 --panel:#161d33 --acc:#ffd27a --link:#7ab8ff`, шрифт Georgia; навигация — якоря `#s<id>`, «← пред / дерево / след →», индекс-оглавление сверху.
- В прод-`public/humor-tree.html` лежит только редирект на kq-dev.
- Таблицы решений — отдельный сервис choser-app (https://choser-app-dcy.pages.dev/#/table/...), ссылки из .md в 01-Architecture/01-Decision-Tables.
- Встроенных видео (`<video>`/.mp4) в Космоквесте не найдено; есть скриншоты Playwright (`tools/qa/shots/*.png`, `_shots.mjs`).

## Предлагаемый сайт iGraSpore
- CF-проект: `igraspore-lab` → https://igraspore-lab.pages.dev/ (создать при первом деплое).
- Код генератора: `C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\tools\lab\build-lab.mjs` (новая папка).
- Выход: `C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\dist-lab\` = копия игры (как в прод-деплое) + `/lab/*.html`. В git — только генератор, `dist-lab/` в .gitignore.
- Страницы (`/lab/`):
  1. `index.html` — оглавление (ТЗ-индекс), дата сборки, ссылки на игру.
  2. `ui-audit.html` — из `09-Docs/out-dev-factory/AUDIT-UI-STORE-2026-10-14.md` (пишется другим воркером).
  3. `store-readiness.html` — чек-лист Google Play (тот же аудит + TZ-RELEASE-READY).
  4. `languages.html` — из `CHOICE-LANGUAGES-2026-10-14.html`.
  5. `tests-gates.html` — результаты vitest/playwright (json-репортеры) в таблице.
  6. `media.html` — скриншоты Playwright и видео `<video controls preload=none>` (webm из Playwright `video: 'on'`), файлы >25 МБ не класть (лимит CF Pages).
  7. `tz-index.html` — индекс всех ТЗ: `TZ-RELEASE-READY-2026-10-14.md` и прочих TZ-*.md.
- Генерация: md→html через `marked` (или простой собственный конвертер), общий шаблон со стилем Космоквеста, навигация-шапка на всех страницах.
- `_headers`: `X-Robots-Tag: noindex` для всего lab-проекта.

## Шаги
1. Создать `tools/lab/build-lab.mjs` + шаблон.
2. `npm run lab:build` (скрипт в .04-Src/package.json).
3. Деплой (только с одобрения владельца; прокси очистить):
   `$env:HTTP_PROXY=$null; $env:HTTPS_PROXY=$null; npx wrangler pages deploy dist-lab --project-name=igraspore-lab --branch=main`
4. Git commit (с одобрения): `git add .04-Src/tools/lab .04-Src/package.json .gitignore 09-Docs/out-dev-factory/PLAN-ANALYTICS-SITE-2026-10-14.md` → `git commit -m "lab: analytics backstage site igraspore-lab"`.
