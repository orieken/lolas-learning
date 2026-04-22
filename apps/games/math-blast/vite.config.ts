import { defineConfig } from 'vite';
import { withZephyr } from "vite-plugin-zephyr";
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  envDir: '../../../',
  server: { port: 5181, cors: true },
    preview: { port: 5181, cors: true },
  plugins: [vue(), tailwindcss(),
    withZephyr({
        mfConfig: {
      name: 'math_blast',
      filename: 'remoteEntry.js',
      exposes: { './Game': './src/Game.ts' },
      shared: ['vue', 'pinia']
    } })],
  build: { target: 'esnext' }
});
