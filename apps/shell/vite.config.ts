import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

const games = path.resolve(__dirname, '../games');

export default defineConfig({
  envDir: '../../',
  server: { port: 5173, cors: true },
  preview: { port: 5173, cors: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'math_blast/Game': `${games}/math-blast/src/Game.ts`,
      'freeze_math/Game': `${games}/freeze-math/src/Game.ts`,
      'number_detective/Game': `${games}/number-detective/src/Game.ts`,
      'letter_detective/Game': `${games}/letter-detective/src/Game.ts`,
      'word_detective/Game': `${games}/word-detective/src/Game.ts`,
      'letter_flip_detective/Game': `${games}/letter-flip-detective/src/Game.ts`,
      'spelling_detective/Game': `${games}/spelling-detective/src/Game.ts`,
    },
  },
  plugins: [vue(), tailwindcss()],
  build: { target: 'esnext' },
});
