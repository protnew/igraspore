# PRIORITY_LIST — 08-iGraSpore_V2
Дата: 2026-09-10
Ветка: ЗАПРОС-1 только анализ. Код продукта не менялся.
Live канон: https://igraspore.pages.dev GET 200 n=17917 stamp=1786825630
SSOT бэклог: 08-Backlog/backlog_iGraSpore_V2.db (70 tasks, DONE 68, ICEBOX 2)

Новые дыры без тикета = P*. Тикеты ICEBOX = TSK-PROD-*. Победителя конфликта SoT в коде не выбирать.

| 🚦 | ID | Сев. | Что делать | Зачем |
|---|---|---|---|---|
| 🔴 | P1 | CRITICAL | Убрать credential из git remote.origin.url, ротировать PAT. Код игры 0 строк | Token в origin, git remote -v утекает |
| 🔴 | P2 | CRITICAL | Pages /igraspore.apk отдаёт HTML 17917, не APK. Залить binary v2.4 или снять кнопку | Кнопка APK на live мертва |
| 🔴 | P3 | CRITICAL | Четыре SoT (live Canvas 04-Src / D1 WebGL / AGENTS.md .04-Src / README github.io). Две строки, победителя кодом не выбирать | Следующий агент сломает live |
| 🔴 | P4 | CRITICAL | Бэклог 68 DONE на 2026-07-29, git HEAD 2026-08-15. Не плодить задачи, не закрывать DONE кодом | SSOT бэклога врёт про live |
| 🟡 | P5 | MAJOR | 13 js расходятся 04-Src vs .04-Src. Live читает видимое. Тесты — скрытое | Правка не в том дереве |
| 🟡 | P6 | MAJOR | github.io stamp 20260811 n=34178 ≠ pages.dev. README Status = github.io. Поверхности не склеивать | Чужой URL как «починить live» |
| 🟡 | P7 | MAJOR | vitest include .04-Src/js, coverage-summary.json mtime 2026-08-15 ≠ Zero-Point. Vitest в ходе не гнали | Зелёный тест ≠ Pages |
| 🟡 | P8 | MAJOR | 8 таблиц июня pipe-rows 5–10, REJECT 5-6×8-12. D1 176/165/84 без весов в файле 1080b | D1 как закон → WebGL |
| 🟡 | P9 | MAJOR | git dirty 389, ahead 9 of origin. node_modules в корне. Не push | Изоляция AGENTS.md и грязный индекс |
| 🟢 | P10 | MINOR | locomotion.js stub 22 строки. 05-Database только README. Runtime БД нет (localStorage) | Не создавать .db, не split locomotion без AC |
| 🟢 | P11 | MINOR | D2 waiver 547L vs biology_update_core 411L. OVER500=[] на 04-Src/js | Не пилить updateOrg |

| 🟡 | TSK-PROD-001 | MAJOR vs ICEBOX | Конфликт ролей: 03-cpo = первый челлендж ядро (score 33.33); SQL status=ICEBOX. Победителя не выбирать | Песочница без цели vs live уже 100 видов |

## ICEBOX
| 🧊 | ID | Сев. | Что | Зачем |
|---|---|---|---|---|
| 🧊 | TSK-PROD-001 | ICEBOX | first goal/challenge mode score 33.33 (та же дыра, что строка выше) | SQL status ICEBOX, не закрывать кодом |
| 🧊 | TSK-PROD-002 | ICEBOX | simple organelle editor score 27.5 | Не ядро; 03-cpo MINOR |

## Не в список
- innerHTML XSS: нет пруфа user-input в этом ходе
- Docker/K8s/Prometheus: не дыра Solo
- CSS>500 / 20×20: не гейт
- [AUDIT FAILED]: запрещён, live 200
- Победитель 01 (A Canvas+04-Src, 172 vs 159) — бумага, не задача на код GL

## Волна 01-03 (late, после склейки)
- 01-forks: API timeout 90s x3. Отчёт оркестратора без смены Winner A.
- 02-tables: T1 CRITICAL D1 без весов → не второй CRITICAL в списке (уже P3+P8). HIGH=MAJOR, MEDIUM=MINOR, все в P8.
- 03-cpo: SSOT=P4. TSK-PROD-001 MAJOR vs ICEBOX = две строки. TSK-PROD-002 ICEBOX. 20x20 не в список.
- Код продукта не менялся.
