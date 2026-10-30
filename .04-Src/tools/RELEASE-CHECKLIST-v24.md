# RELEASE-CHECKLIST v24 — обязательный порядок перед каждой сборкой/релизом

1. Стенды: не останавливать 8790/8793/8795/8798/8799/8802/8811; свои поднимать на свободных портах (паттерн 8840).
2. **GATE_WORKERS=1** — единственный стабильный режим playwright-суиты (4/2 воркера = memory-флейки, история LEAD-LOG v20.6/v21).
3. Юниты: `npm test --prefix .04-Src` (порог из ТЗ, не снижать).
4. Суита: `env -u HTTP_PROXY -u HTTPS_PROXY GATE_BASE_URL=http://127.0.0.1:8798 GATE_WORKERS=1 node .04-Src/node_modules/@playwright/test/cli.js test --config playwright.v20.config.js` — 32/32 ×3 подряд.
5. Инструменты: `node tools/v21_hash_full.cjs` (0 diffs), `NEG=1 node tools/v21_hash_full.cjs` (ловит), `node tools/aab_langs.cjs` (OK) + NEG.
6. Сборка: build-www-release → `npx cap sync android` → assembleDebug/bundleDebug(+Release) → sign-local.ps1 → hash 0 diffs → aab_langs на подписанном AAB (проверка СОДЕРЖИМОГО, путь base/assets/public/...).
7. Каждый шаг: коммит+push, строка в LEAD-LOG-v24.
