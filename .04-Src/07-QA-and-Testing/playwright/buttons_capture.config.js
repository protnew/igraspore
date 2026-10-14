const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'buttons_capture.spec.js',
  timeout: 30 * 60 * 1000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    headless: true,
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:8792',
    actionTimeout: 8000,
    navigationTimeout: 45000,
  },
});
