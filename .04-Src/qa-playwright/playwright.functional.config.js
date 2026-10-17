// U47: прогон разрезанного функционального набора (60 тестов). testDir — старый QA-каталог.
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '../07-QA-and-Testing/playwright',
  testMatch: ['functional_test.js'],
  timeout: 120000,
  workers: 1,
  reporter: [['list']],
});
