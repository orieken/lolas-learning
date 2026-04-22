import { defineConfig } from 'vite';
import { withZephyr } from 'vite-plugin-zephyr';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    envDir: '../../',
    server: { port: 5173, cors: true },
    preview: { port: 5173, cors: true },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      withZephyr({
        mfConfig: {
          name: 'shell',
          filename: 'remoteEntry.js',
          remotes: {
            freeze_math: 'freeze_math',
            number_detective: 'number_detective',
            letter_detective: 'letter_detective',
            word_detective: 'word_detective',
            letter_flip_detective: 'letter_flip_detective',
            spelling_detective: 'spelling_detective',
            math_blast: 'math_blast',
          },
          shared: ['vue', 'pinia', '@lolas/core-sdk'],
        },
      }),
    ],
    build: { target: 'esnext' },
  };
});
