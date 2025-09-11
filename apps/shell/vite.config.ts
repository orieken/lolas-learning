import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const freeze = env.VITE_REMOTE_FREEZE_MATH || 'http://localhost:5177/assets/remoteEntry.js';
  const number = env.VITE_REMOTE_NUMBER_DETECTIVE || 'http://localhost:5174/assets/remoteEntry.js';
  const letter = env.VITE_REMOTE_LETTER_DETECTIVE || 'http://localhost:5175/assets/remoteEntry.js';
  const word = env.VITE_REMOTE_WORD_DETECTIVE || 'http://localhost:5176/assets/remoteEntry.js';
  return {
    server: { port: 5173, cors: true },
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          freeze_math: freeze,
          number_detective: number,
          letter_detective: letter,
          word_detective: word,
        },
        shared: ['vue', 'pinia', '@lolas/core-sdk'],
      }),
    ],
    build: { target: 'esnext' },
  };
});
