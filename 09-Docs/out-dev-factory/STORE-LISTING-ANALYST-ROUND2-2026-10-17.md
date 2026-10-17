# STORE-LISTING-ANALYST-ROUND2 — листинг магазина, круг 2 (16 языков) — 17.10.2026 09:05 UTC+3

Аналитик — единственный критик (№20). Session `analyst-08-20261017-0847`. Вход: `09-Docs/i18n-review/store-listing-round2-for-review.md` (обрезка full до 300 знаков) + **полные** файлы `09-Docs/store-listing/<lang>.md` (прочитаны целиком). `store_len`: OK files=32 over=0 (запуск 17.10).
Порог: ≥ 8 = pass. Фразу «данные игрока не собираются» не трогать до №24 (при 1.1/1.2 — обновить во всех 32 и Data safety).

## Сверка замечаний круга 1 (ANALYST-ROUND6)
Все 10 провальных языков круга 1 исправлены по пунктам: sw (kipato/la/furika/Kisiasa/Ukiwezi — нет), fi (syy/piidy/sukkulaeläimet — нет), hu (oszolj el/képezol/lebonterek — нет), it (Micobi/staglio — нет), fil (humagis/ibang bar/daan-daang/Manatiling — нет), no (букмол, gjøm), el (βλεφαριδοφόρα, αυτόματο, παίκτη), da (ciliater/fimredyr), sv (lärosimulering), ms (ialah satu sel, membelah, siliata); cs — «ty» везде; es «formas»; tr «böl», «Latince»; pt-BR «em um lago»; ro «divide-te»; th «สัตว์เซลล์เดียวมีขน».

## Таблица 1. Итог по языкам
| язык | оценка | pass | конкретные правки (обязательны для fail, желательны для pass) |
|---|---|---|---|
| sw | 7.5 | ❌ | full: «vichunguzi (fangasi)» (vichunguzi = исследователи) → «viozeshaji (fangasi)»; «Hii ni mfano» → «Huu ni mfano» (класс m-mi) |
| fi | 7.5 | ❌ | full: «itio» → «itiö»; «vielá» → «vielä» (опечатки в тексте магазина); «jaat itsesi» → «jakaudut» (как в short) |
| hu | 7.5 | ❌ | full: «kiválasztod a szervezet» → «kiválasztod a szervezetet» (падеж); «eszik, osztás» → «evés, osztódás»; «szünet menüben» → «szünetmenüben» |
| fil | 7.5 | ❌ | title «Microbyo» → «Mikrobyo» (как в словаре игры); short «Lawang hiwa: …» → «Hiwa ng lawa: kumain, humati, magtago sa spora.»; full «Walang kinolektang data» → «Walang kinokolektang data»; «hindi libro» → «hindi aklat-aralin» |
| sv | 7.5 | ❌ | full: «Den nedre fältet» → «Det nedre fältet»; «toffeldjur» (= только туфелька) → «ciliater (fransdjur)»; «förblir latin» → «förblir på latin» |
| it | 8.5 | ✅ | — |
| el | 8 | ✅ | желательно: short «χωρίσου» → «διαιρέσου» (деление клетки) |
| no | 8 | ✅ | желательно: «Rundt deg lever rundt hundre» → «Rundt deg lever omkring hundre»; «forblir latinsk» → «forblir på latin» |
| da | 8 | ✅ | short: «skjul i en spore» → «skjul dig i en spore» |
| ms | 8 | ✅ | full: «apabila bahaya» → «apabila berbahaya» |
| es | 8 | ✅ | short: «come, divide, escóndete» → «come, divídete, escóndete» |
| tr | 8.5 | ✅ | — |
| cs | 8.5 | ✅ | желательно: «rozkladače» → «rozkladači» (организмы) |
| ro | 8.5 | ✅ | желательно: «nu o carte» → «nu un manual» |
| pt-BR | 8.5 | ✅ | short: «num esporo» → «em um esporo» (BR-норма, как в full) |
| th | 8.5 | ✅ | — |

Итого круг 2: **11 из 16 pass**, fail — **sw, fi, hu, fil, sv (5)**. С учётом 16 языков, сданных в круге 1: листинг **27 из 32 ≥ 8**.

## Что делать разработчику (U20 круг 3)
1. Внести правки таблицы 1 для 5 fail-языков (обязательно) и для pass-языков с пометкой без «желательно» (da, ms, es, pt-BR).
2. `store_len` — over=0; пакет `store-listing-round3-for-review.md` только по изменённым языкам.
3. Не трогать фразу о данных до №24.
