import { defineConfig } from 'vite';
import { withZephyr } from "vite-plugin-zephyr";
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  envDir: '../../../',
  server: { port: 5175, cors: true },
    preview: { port: 5175, cors: true },
  plugins: [tailwindcss(), withZephyr({
        mfConfig: {
      name: 'letter_detective',
      filename: 'remoteEntry.js',
      exposes: {
        './Game': './src/Game.ts',
      },
      shared: ['@lolas/core-sdk'],
    } })],
  build: { target: 'esnext' },
});
