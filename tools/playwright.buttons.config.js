const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '../.04-Src/07-QA-and-Testing/playwright',
  testMatch: ['buttons_capture.spec.js'],
  timeout: 14400000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: { headless: true, channel: 'chrome', actionTimeout: 15000, navigationTimeout: 45000 },
});
