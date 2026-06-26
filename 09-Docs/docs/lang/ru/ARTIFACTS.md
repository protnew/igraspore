# iGraSpore — Артефакты проекта

## Что это
Браузерная игра-симуляция жизни 100 реальных видов микроорганизмов в луже.
Canvas 2D, один HTML файл, работает без сервера. В духе Spore (клеточная стадия).

## Репозиторий
- **GitHub**: https://github.com/protnew/igraspore
- **GitHub Pages**: https://protnew.github.io/igraspore/
- **Локальный клон**: `/workspace/igraspore/`

## Obsidian (корень проекта)
`C:\Obsidian\New\Projects\iGraSpore\` (`/data/Obsidian/New/Projects/iGraSpore/`)

## Файлы проекта

### Документация (docs/)
| Файл | Описание |
|---|---|
| `docs/ARCHITECTURE.md` | Архитектура движка (концепция, стек, уровни организации, механики) |
| `docs/DECISIONS.md` | 13 архитектурных развилок с параметрическим анализом (9 критериев, веса Σ=100%) |
| `docs/DECISIONS_FULL.md` | Полные развилки со всеми альтернативами |
| `docs/DECISIONS_STATUS.md` | Валидация 10 таблиц (42 решения, 1080 ячеек оценок) |
| `docs/iGraSpore — техническое задание.md` | Полное ТЗ: 100 видов, движок, ИИ, управление, рендеринг, баланс |
| `docs/Бэклог_идей_перезапуск.md` | 4 предложения для перезапуска |

### Локализованная документация (docs/lang/)
| Язык | Код | Файлы |
|---|---|---|
| English (по умолчанию) | en | ARCHITECTURE, SPECS, BACKLOG, ARTIFACTS |
| Русский | ru | ARCHITECTURE, SPECS, BACKLOG, ARTIFACTS |
| Français | fr | ARCHITECTURE, SPECS, BACKLOG, ARTIFACTS |
| Español | es | ARCHITECTURE, SPECS, BACKLOG, ARTIFACTS |
| 中文 | zh | ARCHITECTURE, SPECS, BACKLOG, ARTIFACTS |

### Assets
| Файл | Описание |
|---|---|
| `assets/A_–_J_*.xlsx` | 10 таблиц архитектурных решений |
| `assets/T1_Движки_фреймворки.xlsx` | Таблица 1: сравнение 12 движков × 12 критериев |
| `assets/T2_OpenSource_заготовки.xlsx` | Таблица 2: 14 open-source проектов × 13 критериев |

### Исходный код (src/)
| Файл | Статус | Описание |
|---|---|---|
| `src/index.html` | ❌ Не создан | Вся игра (HTML+CSS+JS) в одном файле |

## Статус
- [x] Репозиторий создан
- [x] ТЗ утверждено (100 видов, 5 категорий)
- [x] Архитектура описана (ARCHITECTURE.md)
- [x] 42 архитектурных решения проанализированы
- [x] Сравнение 12 движков и 14 open-source проектов
- [x] Документация на 5 языках
- [ ] Игра написана (src/index.html)
- [ ] Запушена в GitHub Pages

## Итоговый стек

| Решение | Выбор |
|---|---|
| Рендеринг | Canvas 2D |
| Структура кода | Один файл-монолит |
| Коллизии | Grid (фиксированный spatial hash) |
| AI поведение | FSM |
| Генерация мира | Random + value noise, бесконечный chunk-based |
| Хранение | In-memory + localStorage |
| Кросс-платформа | Чистый HTML |
| Звук | Без звука (MVP) |
| HUD | HTML overlay |
| Данные видов | JSON inline |
| Food web | Упрощённая (кто крупнее — ест) |
| Мобильные | Виртуальный джойстик + кнопки |
