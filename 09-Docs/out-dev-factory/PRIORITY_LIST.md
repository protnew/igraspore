# PRIORITY_LIST
Проект: 08-iGraSpore_V2   Путь: C:\Obsidian\New\Projects\08-iGraSpore_V2
Дата: 2026-09-22
Статус: ждёт ручных правок Алексея. Разработка запрещена до «делай» по этому файлу.
Прогон: FULL (не smoke). Merge: предыдущий список 2026-09-10 сохранён как PRIORITY_LIST.md.bak-2026-09-22; устаревшее (PAT в remote, «389 dirty») перепроверено.

Светофор находок: 🔴 BLOCKER 1 / 🔴 CRITICAL 5 / 🟡 MAJOR 4 / 🟢 MINOR 2 / ⚪ ICEBOX 2

| ID | Сев. | Что сделать (бытовым языком) | Зачем | Кто нашёл | AC | Как тестировать |
|---|---|---|---|---|---|---|
| P1 | BLOCKER | Убрать igraspore.keystore из git tracking и ротировать ключ подписи APK. Код игры не трогать. | Секрет подписи в репозитории: git ls-files показывает файл. | 07+08+05+06 | keystore не в ls-files; .gitignore; ротация ключа после отдельного «делай». | git ls-files | findstr keystore → пусто |
| P2 | CRITICAL | Залить binary APK на канон Pages /igraspore.apk (есть локально v2.4) ИЛИ снять/скрыть кнопку APK до заливки. | Live отдаёт text/html 17917 вместо APK; кнопка ведёт игрока в тупик. | 06+08+04 | Content-Type APK или кнопки нет. | curl -sI https://igraspore.pages.dev/igraspore.apk |
| P3 | CRITICAL | Выбрать один SoT для runtime JS (04-Src vs .04-Src vs sync). Победителя кодом не выбирать — нужна таблица Choser + «да» Алексея. | index→04-Src; AGENTS→.04-Src; 13 js diff; тесты на .04-Src. | 01+09+08 | Одно дерево в index+тестах+правилах; md5 diff=0 или явный sync. | md5 04-Src/js vs .04-Src/js; vitest include |
| P4 | CRITICAL | Закрыть развилку рендера Canvas live vs WebGL/D1/META таблицей Choser (5–6×8–12, project_tag, 3 круга). Не кодировать WebGL «заодно». | DECISIONS/META vs live Canvas; CF gfx-stack сейчас Canvas, margin на style=2. | 01+02 | UI Local+CF deep-link + project_tag 08-iGraSpore_V2 + явное «да». | наличие tableId; не md-only |
| P5 | CRITICAL | Выбрать канон publish URL (pages.dev vs github.io) и поправить README Status. Не склеивать поверхности. | pages n=17917 stamp 1786825630; github.io n=34178 stamp 20260812075654; README→github.io. | 01+06 | Один канон в README+AGENTS; второй mirror. | curl length+stamp оба URL |
| P6 | CRITICAL | Не плодить/не закрывать бэклог кодом: SSOT 68 DONE на 2026-07-29 при живых блокерах. Новые дыры = P* в PRIORITY_LIST. | backlog.db max updated 2026-07-29; HEAD 2026-09-14. | 03 | Анализ-only к .db; приоритет блокеров выше ICEBOX. | sqlite status counts |
| P7 | MAJOR | Починить канон пруфов таблиц CF/диска: 390/390 cell proofs REJECT; BIOFILMS math (заявлен Spring 165, пересчёт иначе); meta.project_tag null. | Без PASS пруфов таблицы нельзя считать законом для разработки. | 02+08 | proof_pass>0 на нужных; project_tag; пересчёт BIOFILMS. | 02-tables.json counts |
| P8 | MAJOR | Довести a11y оболочки: APK-контроль как button/link с 4 состояниями; aria-имена критичных контролов; focus-visible. | apkBtn=div; aria=0 в index; focus-visible=0. | 04+09 | 4 состояния + aria-label + focus-visible ≥2px. | Tab + axe |
| P9 | MAJOR | Убрать node_modules из видимого корня проекта (оставить под .04-Src). | AGENTS запрещает; Obsidian OOM риск. | 06 | корневого node_modules нет. | Test-Path node_modules |
| P10 | MAJOR | Добавить smoke на APK Content-Type и XSS/escaping кандидат по innerHTML UI (тесты писать только после «делай»). | E2E не ловит HTML-вместо-APK; innerHTML широко в UI. | 09+07 | Кандидаты в плане тестов; не эксплойт. | после разработки — assert Content-Type; escaping test |
| P11 | MINOR | Обновить DECISIONS D2: waiver 547 строк, на диске biology_update_core.js = 410. | Документ врёт про размер monolith. | 01 | D2 цифры = факт файла или waiver снят. | lines biology_update_core.js |
| P12 | MINOR | Не создавать runtime SQLite для игры: канон localStorage; 05-Database = README only. | Ложный старт миграций сломает модель. | 05 | нет новых .db игры без «делай». | ls 05-Database |

## ICEBOX
| ID | Сев. | Что | Зачем | Кто | AC | Тест |
|---|---|---|---|---|---|---|
| TSK-PROD-001 | MAJOR | ICEBOX: first goal/challenge mode — не трогать без «делай» | Ниже блокеров SoT/APK/keystore | 03 | остаётся ICEBOX | sqlite status |
| TSK-PROD-002 | MAJOR | ICEBOX: simple organelle editor — не трогать без «делай» | Ниже блокеров | 03 | остаётся ICEBOX | sqlite status |

## Конфликты (не решены)
| Тема | Вариант А | Вариант Б |
|---|---|---|
| SoT runtime | A: только .04-Src (как AGENTS), sync/удалить код из 04-Src | B: канон видимый 04-Src (как live), .04-Src = QA mirror |
| Render D1 | A: остаться на Canvas 2D live | B: WebGL/V3 hybrid по DECISIONS/META |
| Publish URL | A: канон igraspore.pages.dev | B: канон protnew.github.io/igraspore |

## Handback из разработки
_Нет в этом ходе (анализ, не 10–12)._

## Handoff unresolved
_Нет — все активные handoff с context приняты._

## Для соседних ИИ
- взял: прогон 01–09 JSON 2026-09-22
- положил: PRIORITY_LIST.md (merge, bak старого)
- не трогал: 04-Src/.04-Src продукт, git commit, Pages deploy, backlog.db write
- конфликт: SoT / D1 / URL — три таблицы в «Конфликты», победителя не выбирал


## Дополнение v2.1 ТЗ (2026-09-22) — не дублирует P1–P12, уточняет

| ID | Сев. | Уточнение | Связь |
|---|---|---|---|
| P2a | CRITICAL | `#apkBtn`: div→a/button (семантика), вместе с P2 | 04+06 |
| P7b | MAJOR | Канон весов таблиц 1–3 vs Σ100 → развилка T4 | 02+01 |
| P7c | MAJOR | md «Таблицы выбора» июня: Choser или ICEBOX+CHOSER_PENDING | 01+02 |
| P10b | MINOR | locomotion.js stub 21 строк — не раздувать без ROI | 09 |
| — | — | PAT в remote (старый список) снят пруфом 2026-09-22 | 07 |

Актуальное ТЗ: `TZ.md` v2.1.
