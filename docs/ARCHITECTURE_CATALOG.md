# ARCHITECTURE CATALOG — iGraSpore

| # | Развилка | Ур | П | О | Оц | Вес | Файл | W | Score | Статус |
|---|---|---|---|---|---|---|---|---|---|---|
| D1 | Рендеринг (ориг) | 2 | 9 | 3 | y | % | DECISIONS.md | Canvas 2D | 8.36 | DONE→REV |
| D1-REV | Рендеринг (пересмотр) | 2 | 8 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **WebGL raw** | **130** | TABLE |
| D2 | Структура кода | 3 | 9 | 3 | y | % | DECISIONS.md | Монолит | 7.22 | DONE |
| D3 | Простр. запросы | 3 | 9 | 3 | y | % | DECISIONS.md | Grid | 8.89 | DONE |
| D4 | AI поведение | 5 | 4 | 4 | y | % | DECISIONS.md | FSM | 8.24 | DONE |
| D5 | Генерация мира | 4 | 4 | 4 | y | % | DECISIONS.md | Random+interp | 8.45 | DONE |
| D6 | Хранение | 8 | 9 | 3 | y | % | DECISIONS.md | Mem+localStorage | 8.26 | DONE |
| D7 | Кросс-платформа | 0 | 9 | 5 | y | % | DECISIONS.md | Чистый HTML | 8.55 | DONE |
| D8 | Масштаб мира | 4 | 9 | 2 | y | % | DECISIONS.md | Бесконечная | 7.98 | DONE |
| D9 | Звук | 8 | 9 | 4 | y | % | DECISIONS.md | Без звука | 8.57 | DONE |
| D10 | UI/HUD | 7 | 9 | 3 | y | % | DECISIONS.md | HTML overlay | 8.20 | DONE |
| D11 | Данные видов | 4 | 9 | 3 | y | % | DECISIONS.md | JSON inline | 8.56 | DONE |
| D12 | Food web | 4 | 9 | 3 | y | % | DECISIONS.md | Упрощённая | 8.30 | DONE |
| D13 | Моб. контроли | 7 | 9 | 3 | y | % | DECISIONS.md | Джойстик | 7.89 | DONE |
| П1 | Уровень реализма | 2 | 7 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Planetera** | **110** | TABLE |
| П2 | Деплой | 1 | 6 | 5 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Vercel** | **106** | TABLE |
| П3 | Масштаб организмов | 4 | 5 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **2000** | **75** | TABLE |
| П4 | Художественный стиль | 2 | 6 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Planetera** | **117** | TABLE |
| П5 | Арт воды | 2 | 5 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Shader** | **114** | TABLE |
| П6 | Старт UX | 7 | 5 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Катсцена** | **118** | TABLE |
| П7 | Деплой-синхрон | 1 | 4 | 4 | y | 1-3 | ARCHITECTURE_TABLES_FULL.md | **Vercel auto** | **86** | TABLE |

## СВОДКА
- **DONE (оригинал):** 13 развилок D1-D13
- **TABLE (новые):** 8 развилок (D1-REV + П1-П7)
- **Радикальные изменения V3:** рендеринг, деплой, масштаб, старт UX
- **Без изменений:** AI (FSM), коллизии (Grid), UI (HTML), данные (JSON)
