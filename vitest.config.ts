import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      lines: 25,
      statements: 25,
      functions: 25,
      branches: 50,
    },
    globals: true,
    watch: false,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['tests/e2e/**', '**/node_modules/**', '**/dist/**', '**/coverage/**'],
  },
});
