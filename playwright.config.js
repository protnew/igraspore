import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './07-QA-and-Testing/playwright',
  testMatch: '**/*.spec.js',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: '.04-Src/07-QA-and-Testing/playwright-results.json' }]],
  outputDir: '.04-Src/07-QA-and-Testing/test-results-e2e',
  use: {
    headless: true,
    viewport: { width: 1400, height: 900 },
    actionTimeout: 12000,
    navigationTimeout: 45000,
    trace: 'off',
    baseURL: 'https://igraspore.pages.dev',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', channel: 'chrome' } },
  ],
});
