const { defineConfig } = require('@playwright/test');
const path = require('path');
const qa = path.join(__dirname, '.04-Src', '07-QA-and-Testing');
module.exports = defineConfig({
  testDir: path.join(qa, 'playwright-v20'),
  testMatch: '**/*.spec.js',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: path.join(qa, 'v20-results.json') }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 12000,
    trace: 'off',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium', channel: 'chrome' } }],
});
