# WebGL vs Canvas — отчёт сравнения 2026-09-22

**Проблема.** Нужно глазами сравнить WebGL и текущий Canvas, не ломая игру.

**Решение.** Добавлен `renderMode=webgl` (цикл cartoon → swiss → webgl). Фон воды — шейдер из `.04-Src/v3-webgl`; организмы/симуляция остаются на Canvas 2D. Дефолт `cartoon`. Нет WebGL → toast и возврат в cartoon.

**Результат.** В одном сайте можно переключить стиль и сравнить.

## Совпадает
- Мир, организмы, еда, движение, меню — тот же runtime `.04-Src/js`
- Управление без смены симуляции

## Отличается
- Фон: WebGL water (рябь, каустика, блик) вместо чистого Canvas fill
- Основной `#c` прозрачный поверх `#glCanvas`

## Файлы
- `.04-Src/js/render_webgl.js`
- `.04-Src/shaders/` (копия из v3-webgl)
- правки: `main_events.js`, `ui_screens.js`, `index.html`