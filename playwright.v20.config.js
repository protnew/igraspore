import { defineConfig } from '@playwright/test';

// v20.6 G2: шардинг воркерами; GATE_BASE_URL/GATE_WORKERS из окружения
export default defineConfig({
  testDir: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/07-QA-and-Testing/playwright-v20',
  testMatch: '**/*.spec.js',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  workers: process.env.GATE_WORKERS ? parseInt(process.env.GATE_WORKERS, 10) : 4,
  reporter: [['list'], ['json', { outputFile: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/07-QA-and-Testing/v20-results.json' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 12000,
    trace: 'off',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium', channel: 'chrome' } }],
});
