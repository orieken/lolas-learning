import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import path from 'node:path';

export default defineConfig({
  server: { port: 5177, cors: true },
  resolve: {
    alias: {
      '@lolas/core-sdk': path.resolve(__dirname, '../../../packages/core-sdk'),
    },
    preserveSymlinks: true,
  },
  plugins: [
    federation({
      name: 'freeze_math',
      filename: 'remoteEntry.js',
      exposes: { './Game': './src/Game.ts' },
      shared: ['vue'],
    }),
  ],
  build: { target: 'esnext' },
});
