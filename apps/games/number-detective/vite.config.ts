import { defineConfig } from 'vite';
import { withZephyr } from 'vite-plugin-zephyr';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  envDir: '../../../',
  server: { port: 5174, cors: true },
  preview: { port: 5174, cors: true },
  plugins: [
    tailwindcss(),
    withZephyr({
      mfConfig: {
        name: 'number_detective',
        filename: 'remoteEntry.js',
        exposes: {
          './Game': './src/Game.ts',
        },
        shared: [],
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
});
