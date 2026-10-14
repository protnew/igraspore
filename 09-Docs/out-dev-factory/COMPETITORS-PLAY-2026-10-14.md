# COMPETITORS: 10 аналогов iGraSpore в Google Play — 2026-10-14

project_tag: 08-iGraSpore · срез: 14.10.2026 18:30 (UTC+3) · снято со страниц Play `hl=en&gl=US` (curl + разбор HTML), языки — из описаний Play и Steam appdetails API.

**Проблема:** нужно понять, с кем iGraSpore будет соседствовать в Play и какой уровень (загрузки, рейтинг, языки, сложность HUD) нормален для жанра.
**Решение:** 10 игр жанра «клетка/микроб/эволюция/agar-like/биосим», цифры только со страниц Play на дату среза; неизвестное помечено «н/д».
**Результат:** таблица ниже + Choser-таблица `08-igraspore-competitors-play-20261014`; выводы для ТЗ v2 (HUD ≤6, 20 языков, без рекламы на старте).

## Таблица 1. Конкуренты (факты Play на 14.10.2026)

| # | Игра | package id | URL | Загрузки | Рейтинг | Отзывы | Языки (источник) | Монетизация | Обновлено |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Cell to Singularity: Evolution (ComputerLunch) | `com.computerlunch.evolution` | https://play.google.com/store/apps/details?id=com.computerlunch.evolution&hl=en | 10M+ | 4.5 | 399K | 17 (Steam, ПК-версия) — Steam appdetails 977400; в Play язык не публикуется | реклама + IAP | 13.10.2026 |
| 2 | Agar.io (Miniclip) | `com.miniclip.agar.io` | https://play.google.com/store/apps/details?id=com.miniclip.agar.io&hl=en | 100M+ | 4.2 | 4.17M | н/д — в Play не указано; Steam-версии нет | реклама + IAP | 27.04.2026 |
| 3 | Plague Inc. (Ndemic Creations) | `com.miniclip.plagueinc` | https://play.google.com/store/apps/details?id=com.miniclip.plagueinc&hl=en | 100M+ | 4.7 | 4.06M | 9 (заявлено в описании Play); 15 в Steam Evolved — Play description «Localised in …»; Steam 246620 | реклама + IAP | 28.09.2026 |
| 4 | Osmos (Hemisphere Games) | `com.hemispheregames.osmos` | https://play.google.com/store/apps/details?id=com.hemispheregames.osmos&hl=en | 1M+ | 4.0 | 92K | 5 (Steam, ПК) — Steam 29180; Play не публикует | без рекламы; цена $4.99 по разметке страницы (проверить; в Play Pass) | 28.09.2026 |
| 5 | Cell Evolution (LM Programming) | `com.LMProgramming.CellEvolution` | https://play.google.com/store/apps/details?id=com.LMProgramming.CellEvolution&hl=en | 10K+ | 4.1 | 334 | ≥4: en + es, pt, pt-BR (What's new) — Play «What's new: Added Spanish, Portuguese, and Brazilian Portuguese» | без рекламы | 13.10.2025 |
| 6 | Microcosmum: survival of cells (Satur Entertainment) | `com.alexanderbyzov.microcosmum` | https://play.google.com/store/apps/details?id=com.alexanderbyzov.microcosmum&hl=en | 1M+ | 4.2 | 29.8K | н/д (Steam-страница только у Microcosmum 2: 17) — Play не публикует; Steam 1486140 = сиквел — не переносить | без рекламы + IAP | 26.08.2026 |
| 7 | Bacterial Takeover: Idle games (SIA Fufla) | `eu.fufla.bacteria` | https://play.google.com/store/apps/details?id=eu.fufla.bacteria&hl=en | 1M+ | 4.2 | 43.5K | н/д — Play не публикует | реклама + IAP | 08.10.2025 |
| 8 | Cell: Idle Factory Incremental (Octocube Games) | `com.OctocubeGamesCompany.CIFI` | https://play.google.com/store/apps/details?id=com.OctocubeGamesCompany.CIFI&hl=en | 500K+ | 4.2 | н/д (не извлечено) | н/д — Play не публикует | реклама + IAP | 12.10.2026 |
| 9 | Tasty Planet Forever (Dingo Games) | `com.dingogames.tastyplanet4` | https://play.google.com/store/apps/details?id=com.dingogames.tastyplanet4&hl=en | 10M+ | 4.0 | 94.8K | 1 (Steam: English) — Steam 946010 | без рекламы + IAP | 07.08.2025 |
| 10 | Spore Evolution–Microbes World (Criss Cross Games) | `com.rexground.microbes` | https://play.google.com/store/apps/details?id=com.rexground.microbes&hl=en | 1M+ | 2.3 | 10.5K | н/д — Play не публикует (фраза «17 languages» на странице относится к блоку похожих игр — не засчитана) | реклама + IAP | 15.04.2026 |

## Таблица 2. Жанр, HUD, ключевые фичи

| # | Игра | Жанр | Сложность HUD (оценка) | Офлайн | Ключевые фичи | Размер |
|---|---|---|---|---|---|---|
| 1 | Cell to Singularity: Evolution | кликер/idle эволюции | средний: 1 зона тапа + 6–10 кнопок меню/улучшений (оценка по описанию) | да (idle) | от клетки до цивилизации, 3D-сцены, факты об эволюции, древо технологий | н/д (Play больше не показывает размер; «Varies with device») |
| 2 | Agar.io | agar-like онлайн | низкий: джойстик + 2 кнопки (split, eject) + лидерборд (оценка) | нет (онлайн) | мультиплеер, деление/выброс массы, скины, сезоны/пасс | н/д (Play больше не показывает размер; «Varies with device») |
| 3 | Plague Inc. | стратегия-симулятор эпидемии | высокий: карта + панели DNA/трейтов/новостей, но через вкладки (оценка) | да | 12 типов болезней, туториал, сценарии, Cure-режим | н/д (Play больше не показывает размер; «Varies with device») |
| 4 | Osmos | физика поглощения (agar-like офлайн) | очень низкий: без кнопок, жесты (тап — выброс, свайп — время, щипок — зум) | да | 72 уровня, 8 миров, эмбиент-саундтрек, Editor's Choice | н/д (Play больше не показывает размер; «Varies with device») |
| 5 | Cell Evolution | песочница-симулятор эволюции клеток | высокий: много настроек симуляции (оценка) | да (вероятно) | гены, части тела, отбор, игра за клетку, редактор вида | н/д (Play больше не показывает размер; «Varies with device») |
| 6 | Microcosmum: survival of cells | RTS микроорганизмов | низкий: перетаскивание от клетки к клетке, 1–3 кнопки (оценка) | да (заявлено) | 72 уровня, гены, без рекламы (заявлено), офлайн | н/д (Play больше не показывает размер; «Varies with device») |
| 7 | Bacterial Takeover: Idle games | idle/инкрементал про бактерий | средний-высокий: счётчики + вкладки улучшений (оценка) | да (idle) | захват планет бактериями, апгрейды, престиж | н/д (Play больше не показывает размер; «Varies with device») |
| 8 | Cell: Idle Factory Incremental | idle/инкрементал | очень высокий: «тонны меню улучшений» (заявлено) | да (заявлено) | деревья навыков, лидерборды, облачные сейвы, кроссплей | н/д (Play больше не показывает размер; «Varies with device») |
| 9 | Tasty Planet Forever | «съешь всё и расти» | низкий: управление движением + пауза (оценка) | да | 8 миров, 150+ уровней, кооп на планшете | н/д (Play больше не показывает размер; «Varies with device») |
| 10 | Spore Evolution–Microbes World | io/эволюция червя-микроба | средний (оценка) | н/д | эволюция, вирусы, апгрейды, io-арена | н/д (Play больше не показывает размер; «Varies with device») |

## Пометки о неопределённости

- **Загрузки/рейтинг/отзывы** — из HTML страницы Play на 14.10.2026 (поле «Downloads», `aria-label="Rated …"`, «… reviews»). Число отзывов у страницы бывает в двух вариантах (шапка vs блок отзывов, напр. Cell to Singularity 399K / 375K) — взято значение шапки.
- **Языки:** Google Play не публикует список языков приложения. Засчитано только: (а) явная фраза в описании Play (Plague Inc — 9, Cell Evolution — en+es+pt+pt-BR), (б) Steam `supported_languages` той же игры (ПК-версия; на Android может отличаться — помечено). Microcosmum: Steam-страница есть только у сиквела Microcosmum 2 (17 языков) — **не засчитано**. Spore Evolution: фраза «Fully localized in 17 languages» на странице стоит в описании другой игры из блока «похожие» — **не засчитано**.
- **Osmos:** в разметке страницы цена $4.99 и участие в Play Pass; проверить вручную в браузере перед публикацией выводов.
- **HUD/глубина биологии** — экспертная оценка по описаниям/скриншотам стора, не замер. Замер (подсчёт видимых элементов по скриншотам) — этап A.4 ТЗ v2.
- **Размер APK** — Play не показывает; APKPure (Bacterial Takeover 1.35.3) — 102,3 МБ, остальные н/д.
- **Cell Lab: Evolution Sandbox** (`com.saterskog.cell_lab`) — страница Play отдаёт Not Found (снята с публикации) → заменена на Spore Evolution–Microbes World. Rebel Inc. исключена (не биология).

## Выводы для iGraSpore

1. Лидеры по загрузкам (Agar.io, Plague Inc — 100M+) имеют либо минимальный HUD (Agar.io: деление + выброс), либо сложный, но спрятанный во вкладки (Plague Inc). Наши 30 постоянных элементов — хуже обоих → P1 ТЗ (≤6) подтверждён.
2. Игры с явной локализацией (Plague Inc 9–15, Cell to Singularity 17 на ПК) — в топе рейтинга 4,5–4,7. Наши 2 реальных языка — минимум в выборке. 20 языков ставят нас выше всех известных значений.
3. Osmos/Microcosmum (без рекламы, офлайн) держат 1M+ при 4,0–4,2 — подтверждает решение 🟡 №4.1 «без рекламы до 10 000».
4. Самый близкий по механике и худший по рейтингу — Spore Evolution (2,3★, реклама+IAP): риск жанра — навязчивая монетизация и непонятные механики. Наш плюс — научная вики 100 видов.

## Choser

- Таблица: `08-igraspore-competitors-play-20261014` (11 строк × 11 критериев, Σ весов 100), state `скрытая`, visibility `hidden`.
- Local: http://localhost:3002/#/table/08-igraspore-competitors-play-20261014
- Cloudflare: https://choser-app-dcy.pages.dev/#/table/08-igraspore-competitors-play-20261014 (появится только после синка по SYNC-CANON v5 — отдельное «да» владельца)
- Итог SAW (из 100): Cell to Singularity 78,0 · Plague Inc 75,8 · Osmos 72,1 · Microcosmum 66,6 · Tasty Planet Forever 65,5 · Agar.io 65,1 · Cell Evolution 58,5 · Bacterial Takeover 52,7 · Spore Evolution 45,9 · **iGraSpore 43,5** · CIFI 41,1.
- Payload: `01-Architecture\Таблицы-выбора\choser-08-igraspore-competitors-20261014.json`
