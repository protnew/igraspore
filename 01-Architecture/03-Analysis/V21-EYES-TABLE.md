# V21 Cycle3 — Визуальный разбор глазами (EYES) — 44 скриншота

- Дата: 2026-10-28. Ревьюер: ZCode (визуальный проход).
- Источник: `C:\Users\Space\agent-transfer\igraspore-v21\cycle3\` (всего 400 PNG: 20 языков × 10 экранов × 2 вьюпорта).
- Выборка: 44 PNG. Ограничения соблюдены: каждый из 20 языков ≥2 экрана; каждый из 10 экранов ≥3 языка; вьюпорты 1280 и 390.
- Примечание по префиксам: в каталоге `pt` = `pt-BR`, `zh` = `zh-TW`. `ar` отсутствует (не искался).
- Метод: каждый PNG прочитан инструментом Read (CDN) и разобран визуально по 8 чек-пунктам (английский текст, обрезки, пустые плашки, перекрытия, кнопки <48px, контраст, кодировка ja/zh/ko/hi/bn/th, подписи существ в game/demo).
- Допустимые когнаты-бренд: START / MENU / PAUSE / DEMO / AQUARIUM. Латинские научные названия видов (Synechocystis sp. и т.п.) — не считаются английским текстом (номенклатура).

## Таблица разбора

| № | Файл | Язык | Экран | Вьюпорт | Что видно (1 фраза) | Вердикт | Дефект |
|---|------|------|-------|---------|---------------------|---------|--------|
| 1 | en_1280_menu.png | en | menu | 1280 | Меню: START/DEMO/Aquarium, сложность Easy/Normal/Hard, карточки 101 вида | PASS | «Normal/Hard» приглушены (не выбраны) — низкий контраст, P2 |
| 2 | en_390_game.png | en | game | 390 | Игра: HUD-панель Synechocystis sp., Energy/Age/FPS 60, тосты событий, джойстик | PASS | Тосты затемнены (0.75), мелочь |
| 3 | en_1280_settings.png | en | settings | 1280 | Settings: 7 тумблеров Particles…Economy mode + CLOSE | PASS | Тумблеры ~32px < 48px, P2 (recurring) |
| 4 | ru_1280_menu.png | ru | menu | 1280 | Меню полностью на русском: НАЧАТЬ/ДЕМО-Галерея/АКВАРИУМ, Лёгкий/Обычный/Сложный | PASS | «Сложный» приглушён — контраст, P2 |
| 5 | ru_390_help.png | ru | help | 390 | «КАК ИГРАТЬ»: управление джойстик/кнопки/щипок, ЗАКРЫТЬ | PASS | — |
| 6 | ru_1280_wiki.png | ru | wiki | 1280 | «Вики: жители лужи», поиск, секция «Зелёные (корм) (25)», карточки видов | PASS* | Нижняя карточка уходит под фиксированную кнопку ЗАКРЫТЬ (нет нижнего отступа), P1; серый текст описаний, P2 |
| 7 | de_1280_settings.png | de | settings | 1280 | «Einstellungen»: Teilchen/Blasen/Strömung/Vignette/Balken/Schatten/Sparmodus, кнопка ZU | PASS | Тумблеры ~32px < 48px, P2 (recurring); «ZU» — курьёзно короткая, P2-косметика |
| 8 | de_390_pause.png | de | pause | 390 | Пауза: WEITER / SO GEHT'S / EINSTELLUNGEN / WIKI / Beenden / Mehr | PASS | Смешанный регистр кнопок (Beenden/Mehr vs капс), P2-косметика |
| 9 | es_1280_help.png | es | help | 1280 | «CÓMO JUGAR»: WASD nadar, кто кого ест, легенда цветов | PASS | Кнопка CERRAR ~40px < 48px, P2; тёмно-синяя кнопка — низкий контраст, P2 |
| 10 | es_390_wiki.png | es | wiki | 390 | «Wiki: vida del estanque», Buscar…, «Verdes (comida) (25)» | PASS* | Карточка Spirulina частично обрезана нижней панелью, P2 (скролл возможен) |
| 11 | fr_1280_intro.png | fr | intro | 1280 | Интро: «l'estang aux microbes», «Un microbe. Une goutte d'eau. Une mission.», COMMENCER/PASSER | PASS | «l'estang» вместо «l'étang» (арх. написание или опечатка), P2 |
| 12 | fr_390_death.png | fr | death | 390 | «VOUS ÊTES MORT», причина (vieillissement), статистика, кнопки | PASS | — |
| 13 | it_1280_wiki.png | it | wiki | 1280 | «Wiki: Vita dello stagno», Cerca…, «Verdi (cibo) (25)», карточки | PASS* | Нижняя карточка (Spirulina) частично скрыта за панелью CHIUDI, P1; серое описание, P2 |
| 14 | it_390_aquarium.png | it | aquarium | 390 | «Acquario»: Specie 25/101, галерея существ, спрайты | PASS | — |
| 15 | pt-BR_1280_game.png | pt-BR | game | 1280 | Игра: HUD «Energia/Idade/Divisões», FPS 60, подписи существ читаемы | PASS | — |
| 16 | pt-BR_390_settings.png | pt-BR | settings | 390 | Configurações: тумблеры (Partículas…Modo econômico), FECHAR | PASS | Тумблеры ~32px < 48px, P2 (recurring) |
| 17 | pl_1280_pause.png | pl | pause | 1280 | PAUZA: WZNÓW / JAK GRAĆ / USTAWIENIA / WIKI / Wyjdź | PASS | — (польские диакритики в порядке) |
| 18 | pl_390_intro.png | pl | intro | 390 | Интро: «Jeden mikroorganizm. Kropla wody. Misja.», кнопки START/POMIŃ | PASS | — |
| 19 | uk_1280_death.png | uk | death | 1280 | «ВИ ЗАГИНУЛИ», причина, статистика, кнопки | PASS | — (украинские І/ї/є в порядке) |
| 20 | uk_390_demo.png | uk | demo | 390 | «Демо: Автоматичне відтворення», «Спробуйте самі:», УКРАЇНСЬКА ✓ | PASS | — |
| 21 | tr_1280_demo.png | tr | demo | 1280 | DEMO: «Otomatik oynatma», «Şimdi dene:», TÜRKÇE ✓, кнопки ~52px | PASS | — (ı/ş/ğ в порядке) |
| 22 | tr_390_aquarium.png | tr | aquarium | 390 | «Akvaryum»: галерея видов, подписи спрайтов читаемы | PASS | — |
| 23 | ko_1280_intro.png | ko | intro | 1280 | Интро на хангыле: «시작하기»/«건너뛰기», кнопки ~52px | PASS | — (хангыль рендерится чисто, tofu нет) |
| 24 | ko_390_menu.png | ko | menu | 390 | Меню на хангыле: 시작/데모/아쿠아리움, 난이도 | PASS | Кнопка 난이도-строки ~40px, P2 (recurring small-контролы) |
| 25 | ja_1280_help.png | ja | help | 1280 | 「遊び方」: управление, пищевая цепь, кандзи/каны чисто | PASS | — |
| 26 | ja_390_wiki.png | ja | wiki | 390 | 「ウィキ」: поиск, секция зелёных, карточки видов | PASS* | Нижняя карточка под кнопкой 閉じる, P2 (recurring wiki-паттерн) |
| 27 | zh-TW_1280_settings.png | zh-TW | settings | 1280 | 「設定」: 粒子/氣泡/水流/暈影/血條/陰影/省電模式, 「關閉」 | PASS | Тумблеры ~36px < 48px, P2 (recurring) |
| 28 | zh-TW_390_game.png | zh-TW | game | 390 | Игра: HUD на китайском (能量/年齡/分裂), подписи существ читаемы | PASS | — |
| 29 | hi_1280_menu.png | hi | menu | 1280 | Меню на деванагари: सुरू करें/डेमो/एक्वेरियम, कठिन | PASS | Строка «कठिन» приглушена, P2 (recurring) |
| 30 | hi_390_help.png | hi | help | 390 | «कैसे खेलें»: джойстик/кнопки, «बंद करें» ~52px | PASS | Сероватый текст описаний, P2 (recurring) |
| 31 | bn_1280_wiki.png | bn | wiki | 1280 | উইকি: секция зелёных (২৫), карточки, бенгальские цифры чисто | PASS* | Нижняя карточка под фиксированной кнопкой, P2 (recurring) |
| 32 | bn_390_intro.png | bn | intro | 390 | Интро: «শুরু করুন»/«এড়িয়ে যান», конъюнкты чисто | PASS | — |
| 33 | vi_1280_game.png | vi | game | 1280 | Игра: «Năng lượng/Tuổi/Chia», диакритики чисто, подписи читаемы | PASS | — |
| 34 | vi_390_death.png | vi | death | 390 | «BẠN ĐÃ CHẾT», причина, кнопки ~54px | PASS | — |
| 35 | id_1280_aquarium.png | id | aquarium | 1280 | «Akuarium»: Specie, галерея, спрайты в порядке | PASS | — |
| 36 | id_390_pause.png | id | pause | 390 | «JEDA»: Lanjut/Cara Main/Pengaturan/Wiki/Keluar ~54px | PASS | — |
| 37 | ms_1280_death.png | ms | death | 1280 | «ANDA MATI»: причина penuaan, кнопки ~56px | PASS | — |
| 38 | ms_390_menu.png | ms | menu | 390 | Меню: MULA/DEMO/AKUARIUM, tahap kesukaran | PASS | Строка сложности приглушена, P2 (recurring) |
| 39 | fil_1280_demo.png | fil | demo | 1280 | DEMO: «Awtomatik na pag-play», «Subukan ngayon:», подписи существ читаемы | PASS | — |
| 40 | fil_390_settings.png | fil | settings | 390 | Settings: тумблеры локализованы, кнопка закрытия | PASS | Тумблеры ~32px < 48px, P2 (recurring) |
| 41 | th_1280_pause.png | th | pause | 1280 | «หยุดชั่วคราว»: ไปต่อ/วิธีเล่น/การตั้งค่า/วิกิ/ออก ~54px | PASS | — (тайские гласные/тона корректны) |
| 42 | th_390_aquarium.png | th | aquarium | 390 | สวนสัตว์น้ำ/Aquarium: галерея видов | PASS | — |
| 43 | ja_1280_game.png | ja | game | 1280 | Игра: HUD 「エネルギー/年齢/分裂」, FPS 60, подписи существ читаемы | PASS | — |
| 44 | th_390_settings.png | th | settings | 390 | การตั้งค่า: тумблеры, тайский рендер чистый | PASS | Тумблеры ~32px < 48px, P2 (recurring) |

(*) — PASS с примечанием: контент в целом доступен (скролл), но виден дефект нижней обрезки.

## Итог

**40 PASS / 4 PASS* / 0 FAIL** (жёстких FAIL нет; 4 экрана wiki — PASS с примечанием об обрезке нижней карточки).

- Покрытие: языки 20/20 (en, ru, de, es, fr, it, pt-BR, pl, uk, tr, ko, ja, zh-TW, hi, bn, vi, id, ms, fil, th), экраны 10/10, вьюпорты 1280+390.
- Английский на не-английских экранах: не найден (кроме допустимых брендов START/MENU/PAUSE/DEMO/AQUARIUM и латинской номенклатуры видов).
- Кодировка: ja/zh-TW/ko/hi/bn/th — все скрипты рендерятся чисто, mojibake/tofu не обнаружено.
- Canvas game/demo: подписи существ (Synechocystis sp., Anabaena sp., Paramecium sp.…) читаемы на всех проверенных вьюпортах.

## Список дефектов

| ID | Приоритет | Дефект | Где | Рекомендация |
|----|-----------|--------|-----|--------------|
| D1 | P1 | Контент wiki-карточек заходит под фиксированную нижнюю панель (кнопка ЗАКРЫТЬ/CHIUDI/閉じる/FECHAR): нижняя карточка частично скрыта, нет нижнего отступа скролла | ru_1280_wiki, it_1280_wiki, ja_390_wiki, bn_1280_wiki, es_390_wiki | Добавить padding-bottom к скролл-контейнеру wiki = высота нижней панели |
| D2 | P2 | Тумблеры настроек ~32–36px высотой (< 48px touch target); строка целиком кликабельна, но сам контрол мал | en/de/pt-BR/zh-TW/fil/th settings (recurring) | Увеличить свитч до ≥48px или оставить строку-цель ≥48px с видимой зоной нажатия |
| D3 | P2 | Кнопка CERRAR ~40px в испанском help; на мобиле отдельные мелкие контролы меню ~40px | es_1280_help, ko_390_menu | Минимальная высота кнопок 48px на touch-вьюпортах |
| D4 | P2 | Приглушённый текст: невыбранная сложность («Normal/Hard», «Сложный», «कठिन», tahap), серые описания wiki/help, off-state подписи настроек, затемнённые тосты | en/ru/hi/ms menu, wiki×5, help×2, settings | Поднять контраст вторичного текста минимум до 4.5:1 или добавить чёткую рамку выбранного |
| D5 | P2 | «l'estang aux microbes» во французском интро — архаичное/ошибочное написание (ожид. «l'étang») | fr_1280_intro | Проверить у переводчика; вероятно опечатка |
| D6 | P2 | Косметика: кнопка «ZU» (de settings) излишне короткая; смешанный регистр в de pause (Beenden/Mehr vs капс) | de_1280_settings, de_390_pause | Унифицировать регистр и минимальную ширину кнопок |

P0: не найдено. P1: 1 (D1). P2: 5 (D2–D6).
