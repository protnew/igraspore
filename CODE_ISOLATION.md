# CODE ISOLATION — 08-iGraSpore_V2

Карта: что спрятано от индекса Obsidian и где видимый указатель.

Обновлено: 2026-07-27

## Скрыто → видимый pointer

| Скрытая папка | Видимый указатель |
|---------------|-------------------|
| `.04-Src/` | `04-Src/` (README) |
| `.04-Src/07-QA-and-Testing/` | `07-QA-and-Testing/` (README) |

## Без pointer (намеренно)

- `node_modules`, `dist`, `coverage`, `test-results`, `playwright-report` — только под `.04-Src/`, без видимого twin.

## Правила

1. Код — только в `.04-Src/` и других папках с точкой.
2. Видимые `04-Src/`, `07-QA-and-Testing/`, `tests/` — указатели (или старое лёгкое + README), не место для node_modules.
3. См. `AGENTS.md`.

