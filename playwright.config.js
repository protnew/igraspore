import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './07-QA-and-Testing/playwright',
  timeout: 60000,
  expect: {
    timeout: 60000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    baseURL: 'http://localhost:5174',
  },
  webServer: {
    command: 'npm run dev -- --port 5174 --strictPort',
    port: 5174,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
