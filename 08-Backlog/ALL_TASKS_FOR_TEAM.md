# 📋 ВСЕ незавершённые задачи iGraSpore_V2 — Передача команде на ПОЛНУЮ реализацию

> **Дата:** 2026-11-07
> **Статус:** Готово к передаче команде
> **Режим:** ПОЛНАЯ реализация ВСЕГО проекта
> **Всего задач:** 102+ (12 Sprint + 50 Biochemistry + 40+ BACKLOG)

---

## 🎯 Приоритет 1: Активный спринт (12 задач, ROI 48-79)

**Источник:** `08-Backlog/SPRINT_ACTIVE.md`

| # | ID | Block | Title | ROI | Роль |
|---|----|-------|-------|-----|------|
| 1 | TSK-UX-001 | UX/Core Loop | Visible eat/attack feedback flash+particles | 79.17 | 04-UX + 09-QA |
| 2 | TSK-CAM-001 | Camera/Follow | Start zoom 3-4 with cluster spawn | 77.5 | 01-Arch + 04-UX |
| 3 | TSK-UX-002 | UX/Core Loop | Division shrink clearly visible (50% then grow) | 75.0 | 04-UX |
| 4 | TSK-UX-005 | Onboarding/Tutorial | Tutorial forces real Далее clicks | 75.0 | 04-UX + 09-QA |
| 5 | TSK-UX-007 | UI/Speed | Simplify speed bar to 0.5/1/5/25 | 70.0 | 04-UX |
| 6 | TSK-CAM-002 | Camera/Follow | Lock/Free camera labeled button | 70.0 | 04-UX |
| 7 | TSK-UX-008 | UI/Hints | Collapse control hints to 5 big actions | 62.5 | 04-UX |
| 8 | TSK-UX-003 | UX/Controls | Large labeled action buttons ЕСТЬ/ДЕЛИТЬ/АВТО | 61.33 | 04-UX |
| 9 | TSK-RND-R03 | Realistic Render/Look | Match photo refs halo+grayscale | 60.0 | 01-Arch + 04-UX |
| 10 | TSK-RND-R01 | Realistic Render/Look | Phase-contrast bright organisms always visible | 63.33 | 01-Arch |
| 11 | TSK-UX-004 | UX/Controls | Fix action buttons click reliability | 65.33 | 04-UX + 09-QA |
| 12 | TSK-RND-R02 | Realistic Render/Morphology | Rod/coccus shapes by species | 48.89 | 01-Arch + 04-UX |

**Команда для выполнения:**
```
Роль 04 (UX) → Дизайн интерфейса и эффектов
Роль 01 (Архитектор) → Таблица выбора технологий рендеринга
Роль 09 (QA) → Тесты производительности и UX
```

---

## 🔬 Приоритет 2: Biochemistry Systems (50 задач)

**Источник:** `08-Backlog/task_sample.txt`

### Biochemistry_System_1 (10 задач)
| ID | Title | Роль |
|----|-------|------|
| TSK-V2-0001 | Implement Biochemistry_System_1 component 1 | 05-DBA + 06-DevOps |
| TSK-V2-0002 | Implement Biochemistry_System_1 component 2 | 05-DBA + 06-DevOps |
| TSK-V2-0003 | Implement Biochemistry_System_1 component 3 | 05-DBA + 06-DevOps |
| TSK-V2-0004 | Implement Biochemistry_System_1 component 4 | 05-DBA + 06-DevOps |
| TSK-V2-0005 | Implement Biochemistry_System_1 component 5 | 05-DBA + 06-DevOps |
| TSK-V2-0006 | Implement Biochemistry_System_1 component 6 | 05-DBA + 06-DevOps |
| TSK-V2-0007 | Implement Biochemistry_System_1 component 7 | 05-DBA + 06-DevOps |
| TSK-V2-0008 | Implement Biochemistry_System_1 component 8 | 05-DBA + 06-DevOps |
| TSK-V2-0009 | Implement Biochemistry_System_1 component 9 | 05-DBA + 06-DevOps |
| TSK-V2-0010 | Implement Biochemistry_System_1 component 10 | 05-DBA + 06-DevOps |

### Biochemistry_System_2 (10 задач)
| ID | Title | Роль |
|----|-------|------|
| TSK-V2-0011 | Implement Biochemistry_System_2 component 1 | 05-DBA + 06-DevOps |
| TSK-V2-0012 | Implement Biochemistry_System_2 component 2 | 05-DBA + 06-DevOps |
| TSK-V2-0013 | Implement Biochemistry_System_2 component 3 | 05-DBA + 06-DevOps |
| TSK-V2-0014 | Implement Biochemistry_System_2 component 4 | 05-DBA + 06-DevOps |
| TSK-V2-0015 | Implement Biochemistry_System_2 component 5 | 05-DBA + 06-DevOps |
| TSK-V2-0016 | Implement Biochemistry_System_2 component 6 | 05-DBA + 06-DevOps |
| TSK-V2-0017 | Implement Biochemistry_System_2 component 7 | 05-DBA + 06-DevOps |
| TSK-V2-0018 | Implement Biochemistry_System_2 component 8 | 05-DBA + 06-DevOps |
| TSK-V2-0019 | Implement Biochemistry_System_2 component 9 | 05-DBA + 06-DevOps |
| TSK-V2-0020 | Implement Biochemistry_System_2 component 10 | 05-DBA + 06-DevOps |

### Biochemistry_System_3 (10 задач)
| TSK-V2-0021 — TSK-V2-0030 | Аналогично | 05-DBA + 06-DevOps |

### Biochemistry_System_4 (10 задач)
| TSK-V2-0031 — TSK-V2-0040 | Аналогично | 05-DBA + 06-DevOps |

### Biochemistry_System_5 (10 задач)
| TSK-V2-0041 — TSK-V2-0050 | Аналогично | 05-DBA + 06-DevOps |

**Команда для выполнения:**
```
Роль 05 (DBA) → Схема данных, миграции
Роль 06 (DevOps) → Инфраструктура, деплой
Роль 08 (Контролёр) → Аудит кода (500 LOC лимит!)
Роль 09 (QA) → Тесты целостности данных
```

---

## 🎮 Приоритет 3: Из BACKLOG.md (40+ задач)

**Источник:** `10-Archive/BACKLOG.md` (полное ТЗ)

### Архитектура и движок (задачи из секции 2.1)
| Фича | Описание | Роль |
|------|----------|------|
| Game Loop | requestAnimationFrame + deltaTime | 01-Arch + 06-DevOps |
| Рендеринг | Canvas 2D (WebGL отклонён) | 01-Arch |
| Формы организмов | 8 форм (circle, rod, spiral, slipper, bell, star, irregular, filament) | 04-UX |
| Камера | Lerp интерполяция | 04-UX |
| Частицы | Массив forEach, лимит 200 | 01-Arch |
| Responsive | innerWidth + onresize | 04-UX |

### Мир и среда (задачи из секции 2.2)
| Фича | Описание | Роль |
|------|----------|------|
| Структура чанка | 1D Float32Array, 512×512px | 05-DBA |
| Генерация | Random + интерполяция | 01-Arch |
| Свет | sin() дня/ночи + глубина, цикл 120 сек | 04-UX |
| Температура/pH | Random + свет, статичны | 05-DBA |
| Кислород | Глобальное значение, пересчёт раз в 5 сек | 05-DBA |
| Масштаб | Бесконечная on-demand, LRU 9×9 чанков | 01-Arch + 05-DBA |

### Организмы и ИИ (задачи из секции 2.3)
| Фича | Описание | Роль |
|------|----------|------|
| Модель организма | 17 полей (x,y,vx,vy,size,energy,species,state,age,dir,target,isPlayer,generation,evoLevel,eatCount,divideCount,stateTimer) | 05-DBA |
| AI | FSM + Utility scoring, 6 состояний | 01-Arch |
| FSM переходы | Пороговые правила | 01-Arch |
| Восприятие | Spatial hash, HashMap 64×64px | 01-Arch + 05-DBA |
| Движение | Brownian + Taxis | 01-Arch |

### Энергия и взаимодействие (задачи из секции 2.4)
| Фича | Описание | Роль |
|------|----------|------|
| Расход энергии | Нелинейный f(size, activity) | 05-DBA |
| Фотосинтез | Только idle, раз в N кадров | 01-Arch |
| Фагоцитоз | По размеру (×1.2) | 01-Arch |
| Деление | Random offset | 01-Arch |
| Циста | Медленный расход ×0.1 | 01-Arch |

### Игрок (задачи из секции 2.5)
| Фича | Описание | Роль |
|------|----------|------|
| Эволюция | Линейная цепочка (4 ступени) | 01-Arch + 04-UX |
| Управление | Face cursor + WASD | 04-UX |
| Союзники | Статические базы (5-10 biomass hubs) | 01-Arch + 04-UX |

### Баланс экосистемы (задачи из секции 2.6)
| Фича | Описание | Роль |
|------|----------|------|
| 100 видов бактерий | Простейших, грибков | 05-DBA |
| Бесконечная карта | Solar light, nutrients, temp, O2 | 01-Arch + 05-DBA |
| Экосистема | Баланс хищник-жертва | 01-Arch |

**Команда для выполнения:**
```
Роль 01 (Архитектор) → Таблицы выбора технологий
Роль 02 (Математик) → Проверка расчётов, ROI
Роль 04 (UX) → Дизайн интерфейса
Роль 05 (DBA) → Схема данных, миграции
Роль 06 (DevOps) → Инфраструктура
Роль 09 (QA) → Тесты производительности
```

---

## 📊 Итого: ~100+ задач

| Приоритет | Количество | Фокус | Команда |
|-----------|------------|-------|---------|
| **P1** | 12 | UX/Camera/Rendering (спринт) | 04-UX + 09-QA |
| **P2** | 50 | Biochemistry Systems | 05-DBA + 06-DevOps |
| **P3** | 40+ | Полная реализация ТЗ | Все роли |

---

## 🚀 План передачи команде на ПОЛНУЮ реализацию

### Фаза 1: Анализ ВСЕГО (недели 1-2)
```
Роль 01 (Архитектор) → Таблицы выбора для ВСЕХ 40+ фич из BACKLOG.md
Роль 02 (Математик) → Проверка ROI для ВСЕХ таблиц
Роль 03 (CPO) → Полная декомпозиция ВСЕХ 102+ задач
```

### Фаза 2: Детализация ВСЕГО (недели 2-3)
```
Роль 04 (UX) → Дизайн ВСЕХ экранов и эффектов
Роль 05 (DBA) → Схема данных для ВСЕХ сущностей
Роль 09A (Техпис) → ТЗ на ВСЕ фичи (TZ-*.md)
```

### Фаза 3: Инфраструктура для ВСЕГО (неделя 3)
```
Роль 06 (DevOps) → Инфраструктура для ВСЕХ компонентов
Роль 07 (SecOps) → Аудит безопасности ВСЕХ эндпоинтов
```

### Фаза 4: Реализация ВСЕГО (недели 4-8)
```
Разработчики → Код для ВСЕХ 102+ задач
Роль 08 (Контролёр) → Аудит КАЖДОГО файла (500 LOC лимит!)
Роль 09 (QA) → Тесты КАЖДОЙ фичи
```

### Фаза 5: Релиз ПОЛНОЙ реализации (неделя 9)
```
Все роли → Финальная проверка ВСЕГО
Релиз → ПОЛНАЯ реализация готова
```

---

## 📝 Команды для запуска ролей на ПОЛНУЮ реализацию

### Команда на ПОЛНУЮ реализацию ВСЕГО проекта
```markdown
Задача: ПОЛНАЯ реализация ВСЕГО проекта iGraSpore_V2
Прочитай: 08-Backlog/ALL_TASKS_FOR_TEAM.md
Роли: Все 10 ролей (01-09A)
Режим: ПОЛНАЯ реализация ВСЕХ 102+ задач, не частичные задачи
Выход: 09-Docs/out-dev-factory/ (все 10 отчётов + TZ-*.md)
Начни с Фазы 1: Анализ ВСЕГО (роли 01-02, 09A).
```

---

## ⚠️ Важные ограничения

1. **500 LOC лимит** — каждый файл ≤500 строк (Роль 08 контролирует)
2. **Нет физическому удалению** — только soft-delete (in_trash=1)
3. **Бэкап перед записью в БД** — sqlite3.backup()
4. **Коммит после каждого шага** — незакоммиченная работа недопустима
5. **Дисциплина сдачи** — ≥10 скриншотов, анализ ≥3 ролями, таблица «пункт → доказательство»

---

## 🔗 Связанные документы

- **TEAM.md** — оркестрация ролей
- **QUICK-START.md** — быстрый старт
- **SPRINT_ACTIVE.md** — текущий спринт (12 задач)
- **task_sample.txt** — 50 задач Biochemistry
- **BACKLOG.md** — полное ТЗ (40+ фич)

---

**Режим:** ПОЛНАЯ реализация ВСЕХ 102+ задач!

Полностью закончен ответ — 2026-11-07 17:45 (UTC+3)
