# LEAD-LOG v26 — перепроверка отчёта v25 и доперевод (100 языков)

Формат: дата время — шаг — результат. Коммит+push после каждого шага. Все пути — полные абсолютные.

- 01.11 16:42 — Старт. Голова 9dae46f, ветка release-ready-2026-10-14. Файл ТЗ v26 на диске отсутствовал — создан из промта владельца: C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\TZ-08-SPOR-v26-i18n-recheck-2026-11-01_1715.md
- 01.11 16:44 — Прочитаны правила и скиллы (запись по требованию владельца):
  - C:\Obsidian\New\Projects\_DEV-FACTORY\ПРОМТ-ПРАВИЛА-ДЛЯ-ИШЕК.md (v1 от 30.10.2026 — канон: Блок A «как отвечать» + Блок B «дисциплина сдачи», 7 пунктов, ресурсная дисциплина)
  - C:\Users\Space\.zcode\skills\00-ОГЛАВЛЕНИЕ.md (мастер-индекс 34 скиллов; примечание: путь C:\Obsidian\New\Projects\15-Hermes\backup\скилы\00-ОГЛАВЛЕНИЕ.md из промта не существует — в backup лежат _АРХИВ/промты/скилы-snapshot-2026-09-20; мастер-копия — в C:\Users\Space\.zcode\skills\)
  - Скиллы по делу: format-otveta-alekseyu, tz-sdacha-discipline (канон = ПРОМТ-ПРАВИЛА v1), 03-alexei-work-style, proverka-rolyami, skrinshoty-dokazatelstvo, tz-i-prompty, igry (iGraSpore-протокол), lokalnye-modeli (Qwen :8081 ЗАМОРОЖЕНА — не трогать), github (пуш по команде ТЗ — здесь владелец прописал коммит+push дисциплиной v25/v26)
- 01.11 16:46 — Проверка локальной MT-инфраструктуры для доперевода: ollama не запущен (порт 11434 недоступен), :8081 заморожен (red line скилла lokalnye-modeli). Решение: перевод вручную (данные-файлы) + параллельные субагенты по волнам, проверка recheck-скриптом после каждой волны.
- Далее: задача 1 (recheck 100 языков, без правок).
- 01.11 17:45 — Задача 1 ✅ (9365bae..df795ea): tools/v26_recheck_100.cjs — честная картина: словарь 19003/43164 (44%), wiki 3212/10692 (30%). Таблица: C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\out-dev-factory\logs-release-ready-2026-10-14\v26-recheck-100.md
- 01.11 17:50 — Задача 2 ✅: tools/v26_audit_100.cjs ПАДАЕТ (exit=1) на 31641 en-копии (7 категорий); NEG=1 ловит все 7 (exit=0).
- 01.11 17:55 — Задача 3 ✅ (e0dc24e): в REPORT-TZ-08-SPOR-v25 добавлена ПРАВКА v26 — отчёт v25 завышал готовность (52/436 выдавались за «полные словари»); de-hr-проход v25 разрушил L2-переводы (bg 19/436, sk 16/436).
- 01.11 18:00 — Найден и починен КРИТИЧЕСКИЙ регресс прод-кода: коммит ee04bf6b (v24 A7) выкинул var el (menuSub) из updateMenuTexts → ReferenceError на каждом вызове: меню не переводилось, эко-прогон висел на интро-карточке. Фикс: C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\js\ui_menus.js (var el восстановлен) + v21_eco_run.cjs закрывает интро. Проверка: state=playing достижим, pageerrors: нет.
- 01.11 18:05 — Эко-перегон ЗАПУЩЕН реально: node tools/v21_eco_run.cjs http://127.0.0.1:8821 09-Docs/out-dev-factory/eco-v26-s1 1 60 100 (фон, браузер жив — 9 процессов).
- 01.11 18:40 — Задача 4 волна 1 ✅ (9365bae): bg sk sl lt lb — 436/436 реальные переводы (агент + lb вручную); sr x.* фикс; allow-лист +131 когнат. Полных словарей: 36/100.
- Конвейер: агенты работают над lv et pt-PT es-419 (словари), ta te mr gu, si my ar fa (словари), bg sk sl (wiki). Следом: L4-L8 остаток (52 языка) + wiki 70 паков.
- 02.11 (ночь) — Конвейер доперевода волнами (агенты + вручную), все слияния через tools/v26_merge_data.cjs, после каждой волны recheck+commit+push:
  волна 1: bg sk sl lt lb + sr-фикс → 36 полных
  волна 2: ta te mr gu si my ar fa (+kk) → 51
  волна 3: et lv pt-PT es-419 ur he sw → 60
  волна 4-5: be az ky mn ca gl eu sq mk + wiki (bg sk sl lt lv et lb ta te ar fa si my ur he sw kk be az ky mn ca gl eu sq mk is) → словари 65, wiki 61
  волна 6-8: is af zu km lo am hy ka uz tg ps ckb sd as or ha yo ig so rw + no/lv allow-когнаты → 82
  волна 9: kn ml ne bs mt → 87/100 словарей (89% значений), wiki 61/100
- Allow-лист вырос на ~700 легитимных когнатов (интернационализмы, бренды SWISS/WEBGL, звёзды, HUD-аббревиатуры A/E/S) — по языкам, с reason.
