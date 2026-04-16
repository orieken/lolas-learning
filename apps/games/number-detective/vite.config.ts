import { defineConfig } from 'vite';
import { withZephyr } from "vite-plugin-zephyr";
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  envDir: '../../../',
  server: { port: 5174, cors: true },
    preview: { port: 5174, cors: true },
  resolve: {
    alias: {
      '@lolas/core-sdk': path.resolve(__dirname, '../../../packages/core-sdk'),
    },
    preserveSymlinks: true,
  },
  plugins: [tailwindcss(), withZephyr({
        mfConfig: {
      name: 'number_detective',
      filename: 'remoteEntry.js',
      exposes: {
        './Game': './src/Game.ts',
      },
      shared: [],
    } })],
  build: {
    target: 'esnext',
  },
});
