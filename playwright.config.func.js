const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './07-QA-and-Testing/playwright',
  testMatch: 'functional_test.js',
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    headless: true,
    viewport: { width: 1400, height: 900 },
    actionTimeout: 8000,
    navigationTimeout: 20000,
  },
  reporter: [['list']],
  outputDir: 'test-results-func',
});
