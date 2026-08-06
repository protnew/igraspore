import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: [
      '.04-Src/07-QA-and-Testing/vitest/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '07-QA-and-Testing/vitest/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
