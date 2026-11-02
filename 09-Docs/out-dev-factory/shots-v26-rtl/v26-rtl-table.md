# v26 задача 9 — A4 (RTL/dir) и A5 (цифры из реестра): замеры с реального браузера

Стенд: http://127.0.0.1:8821 (локальный, node tools/serve-static.mjs 8821). Съёмка: tools/v26_rtl_shots.cjs, Playwright + Chromium, 2026-11-02T09:40Z.

| Язык | Вьюпорт | dir в DOM | ожидался | класс igs-rtl | Цифры с экрана (образец) | Переполнено элементов | Вылезают за вьюпорт | tt() обращений | реально нет в словаре | Ошибок консоли |
|---|---|---|---|---|---|---|---|---|---|---|
| ar (Арабский) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (ar:diffE, ar:diffN, ar:diffH, ar:poolWill) | 0 |
| ar (Арабский) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (ar:diffE, ar:diffN, ar:diffH, ar:poolWill) | 0 |
| fa (Персидский) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (fa:diffE, fa:diffN, fa:diffH, fa:poolWill) | 0 |
| fa (Персидский) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (fa:diffE, fa:diffN, fa:diffH, fa:poolWill) | 0 |
| ur (Урду) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (ur:diffE, ur:diffN, ur:diffH, ur:poolWill) | 0 |
| ur (Урду) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (ur:diffE, ur:diffN, ur:diffH, ur:poolWill) | 0 |
| he (Иврит) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (he:diffE, he:diffN, he:diffH, he:poolWill) | 0 |
| he (Иврит) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (he:diffE, he:diffN, he:diffH, he:poolWill) | 0 |
| ps (Пушту) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (ps:diffE, ps:diffN, ps:diffH, ps:poolWill) | 0 |
| ps (Пушту) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (ps:diffE, ps:diffN, ps:diffH, ps:poolWill) | 0 |
| ckb (Сорани) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (ckb:diffE, ckb:diffN, ckb:diffH, ckb:poolWill) | 0 |
| ckb (Сорани) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (ckb:diffE, ckb:diffN, ckb:diffH, ckb:poolWill) | 0 |
| sd (Синдхи) | 375px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 63 | 6 (sd:diffE, sd:diffN, sd:diffH, sd:poolWill) | 0 |
| sd (Синдхи) | 1400px | rtl | rtl | да | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (sd:diffE, sd:diffN, sd:diffH, sd:poolWill) | 0 |
| dz (Дзонг-кэ) | 375px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 1 | 63 | 6 (dz:diffE, dz:diffN, dz:diffH, dz:poolWill) | 0 |
| dz (Дзонг-кэ) | 1400px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (dz:diffE, dz:diffN, dz:diffH, dz:poolWill) | 0 |
| ti (Тигринья) | 375px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 1 | 63 | 6 (ti:diffE, ti:diffN, ti:diffH, ti:poolWill) | 0 |
| ti (Тигринья) | 1400px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (ti:diffE, ti:diffN, ti:diffH, ti:poolWill) | 0 |
| pa (Панджаби) | 375px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 1 | 63 | 6 (pa:diffE, pa:diffN, pa:diffH, pa:poolWill) | 0 |
| pa (Панджаби) | 1400px | ltr | ltr | нет | 24 4 100 3 0 0 | 0 | 0 | 62 | 6 (pa:diffE, pa:diffN, pa:diffH, pa:poolWill) | 0 |

## Кадры

- ar 375px: 09-Docs/out-dev-factory/shots-v26-rtl/ar/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ar/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/ar/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/ar/375-game.png
- ar 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/ar/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ar/1400-wiki.png
- fa 375px: 09-Docs/out-dev-factory/shots-v26-rtl/fa/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/fa/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/fa/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/fa/375-game.png
- fa 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/fa/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/fa/1400-wiki.png
- ur 375px: 09-Docs/out-dev-factory/shots-v26-rtl/ur/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ur/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/ur/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/ur/375-game.png
- ur 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/ur/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ur/1400-wiki.png
- he 375px: 09-Docs/out-dev-factory/shots-v26-rtl/he/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/he/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/he/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/he/375-game.png
- he 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/he/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/he/1400-wiki.png
- ps 375px: 09-Docs/out-dev-factory/shots-v26-rtl/ps/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ps/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/ps/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/ps/375-game.png
- ps 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/ps/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ps/1400-wiki.png
- ckb 375px: 09-Docs/out-dev-factory/shots-v26-rtl/ckb/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ckb/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/ckb/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/ckb/375-game.png
- ckb 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/ckb/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ckb/1400-wiki.png
- sd 375px: 09-Docs/out-dev-factory/shots-v26-rtl/sd/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/sd/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/sd/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/sd/375-game.png
- sd 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/sd/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/sd/1400-wiki.png
- dz 375px: 09-Docs/out-dev-factory/shots-v26-rtl/dz/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/dz/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/dz/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/dz/375-game.png
- dz 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/dz/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/dz/1400-wiki.png
- ti 375px: 09-Docs/out-dev-factory/shots-v26-rtl/ti/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ti/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/ti/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/ti/375-game.png
- ti 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/ti/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/ti/1400-wiki.png
- pa 375px: 09-Docs/out-dev-factory/shots-v26-rtl/pa/375-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/pa/375-settings.png · 09-Docs/out-dev-factory/shots-v26-rtl/pa/375-wiki.png · 09-Docs/out-dev-factory/shots-v26-rtl/pa/375-game.png
- pa 1400px: 09-Docs/out-dev-factory/shots-v26-rtl/pa/1400-menu.png · 09-Docs/out-dev-factory/shots-v26-rtl/pa/1400-wiki.png

## Как читать колонки (важно для честности цифр)

- **«tt() обращений»** — сколько раз код вызвал `tt()` до того, как языковой пакет успел загрузиться. Это счётчик `window.__i18nMiss` (config.js:29–35), он НЕ равен числу непереведённых ключей.
- **«реально нет в словаре»** — из этих обращений отфильтрованы ключи, которых нет в загруженном `T.en`. Для en это 1 ключ (`aria.lang`, Д7 в `v26-defects.md`). Для не-английских языков в списке 6 (diffE, diffN, diffH, poolWill + ещё 2): когда язык интерфейса ≠ en, `i18n/en.json` не подгружается, и `T.en` остаётся рукописным inline-набором в config.js, в котором этих ключей нет. Практических последствий нет: все 100 словарей полные (436/436), и на кадрах ниже ни одного сырого ключа не видно — фоллбек нужен только когда перевода нет.
- **«Вылезают за вьюпорт» = 1 у dz/ti/pa на 375px** — это `#scaleL` (линейка масштаба), одинаково ломается в en/ru/th (замер `tools/v26_overflow_detail.cjs`), к переводу и RTL не относится (Д12).
- **«Ошибок консоли» = 0** — после Д9 (404 на `04-Src/fonts.generated.css` и на woff2) ни одной ошибки загрузки; до починки было по 1 на каждый кадр.
