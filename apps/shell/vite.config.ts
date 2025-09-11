import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: { port: 5173, cors: true },
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {
        freeze_math: 'http://localhost:5177/assets/remoteEntry.js',
        number_detective: 'http://localhost:5174/assets/remoteEntry.js',
        letter_detective: 'http://localhost:5175/assets/remoteEntry.js',
        word_detective: 'http://localhost:5176/assets/remoteEntry.js',
      },
      shared: ['vue', 'pinia', '@lolas/core-sdk'],
    }),
  ],
  build: {
    target: 'esnext',
  },
});
