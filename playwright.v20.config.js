import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const qa = path.join(root, '.04-Src', '07-QA-and-Testing');

// TZ v20 — приёмочные спеки БЛОКОВ A–D. Корень стенда задаёт GATE_BASE_URL (по умолчанию :8796).
export default defineConfig({
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
