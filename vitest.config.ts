import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
    },
    globals: true,
    watch: false,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      'tests/e2e/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**'
    ],
  },
});
