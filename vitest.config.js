import { defineConfig } from 'vitest/config';

function classicWindowPlugin() {
  return {
    name: 'classic-js-window',
    transform(code, id) {
      const n = id.replace(/\\/g, '/');
      if (!n.includes('/.04-Src/js/') || !n.endsWith('.js')) return null;
      if (n.includes('node_modules')) return null;
      const fns = [...code.matchAll(/^function\s+(\w+)/gm)].map(m => m[1]);
      const hoist = fns.map(f =>
        `try { if (typeof ${f} === 'function') globalThis.${f} = ${f}; } catch (e) {}`
      ).join('\n');
      return {
        code:
          "if (typeof globalThis.window === 'undefined') globalThis.window = globalThis;\n" +
          code +
          "\n" + hoist + "\n",
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [classicWindowPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: [
      '.04-Src/07-QA-and-Testing/vitest/**/*.{test,spec}.{js,mjs,cjs}',
    ],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary', 'json'],
      reportsDirectory: '.04-Src/07-QA-and-Testing/coverage',
      reportOnFailure: true,
      include: ['.04-Src/js/**/*.js'],
      exclude: ['**/*.test.js', '**/node_modules/**'],
    },
  },
});
