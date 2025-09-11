import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: { port: 5175 },
  plugins: [
    federation({
      name: 'letter_detective',
      filename: 'remoteEntry.js',
      exposes: {
        './Game': './src/Game.ts',
      },
      shared: ['@lolas/core-sdk'],
    }),
  ],
  build: { target: 'esnext' },
});

