// playwright.contract.config.js — контракт-тесты TZ v9 (hud_contract, lab_tests_page)
// GATE_BASE_URL — игровой стенд (по умолчанию локальный live-корень :8795)
// LAB_URL — стенд лаба (по умолчанию :8793)
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './.04-Src/07-QA-and-Testing/playwright',
  testMatch: ['hud_contract.spec.js', 'lab_tests_page.spec.js', 'i18n_overflow.spec.js', 'perf_start.spec.js'],
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false, // v20.6: шардинг через workers; i18n-спека сериализует свои страницы сама
  workers: process.env.GATE_WORKERS ? parseInt(process.env.GATE_WORKERS,10) : 4,
  retries: 0,
    reporter: [['list'], ['json', { outputFile: '.04-Src/07-QA-and-Testing/contract-results.json' }]],
  outputDir: '.04-Src/07-QA-and-Testing/test-results-contract',
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 12000,
    navigationTimeout: 45000,
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', channel: 'chrome' } },
  ],
});
