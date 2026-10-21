# VERIFY-TZ-08-SPOR-v20-20261021 — независимая проверка отчёта v20

Проверяющий: Grok Bot (независимо), 21.10.2026, UTC+3. Объект: ветка `release-ready-2026-10-14`, HEAD `09e6756`.
Правила: без удаления, без push, без деплоя, без правки конфигов/кода; логи — `C:\Users\Space\kqstage\spor-verify-logs\`.

## Фаза 1 — git
- HEAD = `09e6756` = `origin/release-ready-2026-10-14` (ls-remote подтверждает) — ✅.
- Force-push: нет. Reflog `origin/release-ready-2026-10-14` — линейные «update by push» 5e82e8e→…→09e6756; каждый следующий — потомок предыдущего — ✅.
- Коммитов сессии: **12** (5e82e8e…09e6756), а не 11 (заявлено 11) — мелкое расхождение счёта.
- Soft-reset: локальный коммит `dd3020b` содержал `.10-Archive/aab-20261018-2323/app-release.aab` (111 579 859 б); сброшен `reset HEAD~1` в 23:48:10, **не был запушен** (ни одна remote-ветка его не содержит) — ✅. В пушнутом диапазоне 9e418e0..09e6756 нет блобов > 5 МБ и нет путей *.aab / keystore / *.jks / .env / google-services / password / secret — ✅. Блоб 111 МБ остаётся только в локальном object store (недостижим после gc).
- `*.aab` в `.gitignore:43` — ✅.

## Фаза 2 — AAB
- Файл `06-DevOps-and-Release\android\android\app\build\outputs\bundle\release\app-release.aab`: **3 200 573 б** ✅, sha256 **620314759F1914ADC6E0DB3F84C15A1AC2DB0DB1F816388B72B917E6A7CE9AE2** ✅, mtime **20.10.2026 23:55:10.104** (заявлено 23:55:16 — расхождение 6 с, несущественно).
- `jarsigner -verify` → «jar verified.» ✅ (предупреждения: self-signed upload-ключ, без timestamp — ожидаемо для upload key).
- base/assets/public: 55 файлов; 53/53 совпадают по sha256 с `web-v20` (0 расхождений); +2 `cordova.js`, `cordova_plugins.js` добавлены cap sync (нормально). Заявление «7/7» — подтверждается и расширено до 53/53.
- versionCode **7**, versionName **3.0.0** (proto-манифест в AAB + build.gradle) ✅.
- ⚠️ **Источник ≠ HEAD**: `web-v20/js/biology.js`, `render_effects.js`, `world.js` = незакоммиченные (dirty) версии `.04-Src/v3-webgl/js`, а не HEAD. Плюс 8 файлов (`ai_move, biology_divide, biology_eat, biology_update, render_edu, render_fx, render_helpers, render_surface`.js) в `.04-Src/v3-webgl/js` **не отслеживаются git**, но есть в web-v20/AAB. Заявление «sha = источник» верно только относительно грязного рабочего дерева; «AAB пересобран с HEAD» — **опровергнуто** в части v3-webgl-источника (web-v20 сам закоммичен, поэтому AAB воспроизводим из web-v20).

## Фаза 3 — архив
- `.10-Archive\aab-20261018-2323\app-release.aab` существует, 111 579 859 б, sha256 BBE5A617…829C2 — ✅ (копия, mtime 20.10 23:46).

## Фаза 4 — 21 баг (код в HEAD + тест)
Код-след найден в HEAD `.04-Src/v3-webgl` (git grep) для B1 (VIRUS_SCALE/virusHeadR: config, render_organs, biology_virus), B2 (Escape/#pExit/exitConfirm), B3 (hideGameHud ×), B4 (__igsDemo/autoAI), B5 (#demoExit), B6 (igs.intro.*), B8 (tt/fallback), B9 (#menuFooter), B10, B11, B12 (lang select + replaceState), B13 (__igsTest только при test=1 — проверено: без ?test=1 `typeof __igsTest === 'undefined'`), B14, B17, B21 (#burgerBtn/#actionsPanel), M1 (render_membrane.js), B19 (замер). Тесты: playwright-v20 (11 спеков, 34+ кейса) + vitest virus_scale/membrane — существуют и закоммичены.
- B1 численно (мой замер на web-v20): голова фага 0.378 при медиане бактерий ≈4.7 → 0.08× ✅.
- N/A: **B15** («Pool will have…» дважды) — в v3-меню строка не выводится (есть только ключ `poolWill` в словарях) → N/A обоснован. **B16** (колонии в конце) — в v3 ui_menus нет логики сортировки колоний; N/A «колонии-впереди отсутствуют» — правдоподобно, но не доказано (нет теста/снимка, «grep-пруф в сессии» не сохранён) → ⚠️ частично.
- **B18** отмечен ✅, но фактически тоже N/A: `#spFilterStatus` есть только в legacy `.04-Src/js/ui_menus.js`, в v3 отсутствует; тест проходит веткой «absent». Т.е. фактически N/A = 3, не 2.
- **M1-OFF** — known-red (environment-limited) в v20-суите; **B19** Android — environment-limited. «Все 21 исправлены» — с этими оговорками.

## Фаза 5 — воспроизводимость тестов (чистый worktree HEAD)
- ⚠️ **HEAD не самодостаточен**: `.04-Src/v3-webgl/index.html` грузит 8 js, которых нет в git (ai_move, biology_divide, biology_eat, biology_update, render_edu, render_fx, render_helpers, render_surface) → в чистом checkout 164 консольных ошибки, `ReferenceError: moveOrg is not defined` в gameLoop. Игра из HEAD-источника не работает; работает только закоммиченная копия `web-v20`.
- Тесты: в git — только 17 vitest-файлов (84 теста); у разработчика — 36 файлов (298 тестов): 19 файлов/214 тестов **не закоммичены** (`.gitignore:37 .04-Src/07-QA-and-Testing/*` и др.). Контракт-спеки playwright (hud_contract, i18n_overflow, lab_tests_page) и qa_unit.js тоже вне git. Прогоны разработчика шли на грязном дереве (dirty_count 1037–1045 в results-*.json).
- Прогоны разработчика по results-*.json: 0006 → 431/1/0 (vitest 297/1), 0031 → 431/**1**/0 (report V4 fail). «431 pass, 0 fail» — только после последующего снапшота, полный повтор с 0 fail не зафиксирован.
