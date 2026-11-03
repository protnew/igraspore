# REPORT — TZ-08-SPOR-v29 themes (all 6 + classic) — 2026-11-03 Asia/Jerusalem

## Цель
Довести стили classic + phase-contrast, haeckel-watercolor, neon-bio, glass-lab, engraving, cyberpunk-scanner до соответствия мокапам `09-Docs/design-concepts-2026-11-03/` на бестиарии и водоёме (~99.9%). Без «волн».

## Что сделано
1. WebGL uniforms + 2D rgbTop/Mid/Bot по `window.__igsThemePondShader`
2. CSS бестиария per-style; **фикс specificity** `#wikiO.ov.show[data-theme-bestiary=…]` (било `v20_5.css` `#wikiO.ov.show`)
3. Pond style bar `right:64px` / mobile left — **overlapFails=0** на 1400 и 375
4. neon mobile p5 = classic p5 = 20 (375)
5. APK debug: assembleDebug (JDK21), session-install на emulator-5554 `-no-window`, CDP theme shots ×14
6. Тесты: vitest theme_engine **6/6 ×3**; qa_unit **26/26**; playwright lab_tests **5/5**
7. Скриншоты: `09-Docs/out-dev-factory/theme-shots-v29-all/` (28 web) + `…/apk/` (14+boot)

## Честный % vs мокапы (eye-review 1400)

| Стиль | Бестиарий | Водоём | Комментарий |
|-------|-----------|--------|-------------|
| classic | 96% | 95% | База |
| phase-contrast | 93% | 78% | Wiki светлый микроскоп OK; вода светлее, спрайты classic |
| haeckel-watercolor | 88% | 76% | Пергамент/сериф OK; нет иллюстраций Haeckel на карточках; вода зеленоватая слабо |
| neon-bio | 91% | **62%** | Wiki glow magenta/cyan OK; **пруд всё ещё teal/classic**, не near-black+neon |
| glass-lab | 94% | 80% | Светлое стекло wiki OK после specificity; вода cyan светлее |
| engraving | 90% | 74% | Cream+гравюрные рамки OK; вода серо-зелёная слабо |
| cyberpunk-scanner | 92% | 70% | Dashed neon cards OK; вода темнее, но не scanner-HUD mockup |

**Среднее бестиарий ≈ 92%. Среднее водоём ≈ 76%. Цель 99.9% — НЕ достигнута** (главный разрыв: водоём/шейдер и отсутствие per-theme спрайтов организмов).

## Обязательные фиксы — статус
1. WebGL вода меняется по стилю: **частично** (uniforms есть; визуальная дельта слабая vs мокап, особенно neon)
2. Бестиарий как мокап, не тёмные карточки: **да** для light-тем после specificity; neon/cyberpunk тёмные намеренно
3. Dropdown не на pause: **да**, overlapFails=0
4. neon p5 ≥ classic на mobile: **да** (20=20)
5. e2e APK emulator -no-window без Play: **да** (install+CDP shots); Play не трогали

## Тестовые ссылки
Lab index: http://127.0.0.1:8793/lab/theme-preview.html

Игра (стенд):
- http://127.0.0.1:8820/?lang=en&themePond=classic&themeBestiary=classic
- http://127.0.0.1:8820/?lang=en&themePond=phase-contrast&themeBestiary=phase-contrast
- http://127.0.0.1:8820/?lang=en&themePond=neon-bio&themeBestiary=neon-bio
- http://127.0.0.1:8820/?lang=en&themePond=glass-lab&themeBestiary=glass-lab
- http://127.0.0.1:8820/?lang=en&themePond=engraving&themeBestiary=engraving
- http://127.0.0.1:8820/?lang=en&themePond=cyberpunk-scanner&themeBestiary=cyberpunk-scanner
- http://127.0.0.1:8820/?lang=en&themePond=haeckel-watercolor&themeBestiary=haeckel-watercolor

(Также :8795 с теми же query.)

## Box paths (`/workspace/v29all/`)
Web (post-fix 1400 samples + earlier 375 set):
- `/workspace/v29all/bestiary_*_{1400,375}_en.png` (28 имён)
- `/workspace/v29all/pond_*_{1400,375}_en.png`
- `/workspace/v29all/matrix-report.json`
- `/workspace/v29all/v29all-web.zip` (ранний zip; отдельные PNG новее)
APK samples:
- `/workspace/v29all/apk/apk_bestiary_neon-bio.png`
- `/workspace/v29all/apk/apk_pond_neon-bio.png`
- `/workspace/v29all/apk/apk_bestiary_glass-lab.png`
Полный набор APK на Windows: `09-Docs/out-dev-factory/theme-shots-v29-all/apk/` и `C:\Users\Space\agent-transfer\v29all\apk\` (CopyToBox zip 502/timeout — догружены ключевые).

## Коммиты (ветка release-ready-2026-10-14)
- `c4365d4` all 7 styles code
- `026f168` web matrix 28
- `de3a520` strengthen neon/glass/cyberpunk
- `4ac948e` wiki specificity fix
- `a1482a4` strip JSON BOM + vitest setup
- (этот REPORT + LEAD)

## Не получилось / осталось
- Pond ≈99.9% к мокапам (особенно neon black water + glow organisms)
- Per-theme organism art (swiss sprites общие)
- Полный CopyToBox всех APK PNG (частично из‑за 502/timeout)
- Прод/Pages preview не деплоился (запрет)
- i18n es/tr/fil не трогались; грязные M в status по другим locale — не коммитились

## Вердикт
Бестиарий близок; водоём — заметный прогресс, но **не 99.9%**. Нужен следующий проход: усилить shader rgb/fx под мокапы + (опционально) theme-tint спрайтов.
