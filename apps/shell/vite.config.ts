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
          remotes: [
            { type: 'module', name: 'freeze_math', entry: 'freeze_math' },
            { type: 'module', name: 'number_detective', entry: 'number_detective' },
            { type: 'module', name: 'letter_detective', entry: 'letter_detective' },
            { type: 'module', name: 'word_detective', entry: 'word_detective' },
            { type: 'module', name: 'letter_flip_detective', entry: 'letter_flip_detective' },
            { type: 'module', name: 'spelling_detective', entry: 'spelling_detective' },
            { type: 'module', name: 'math_blast', entry: 'math_blast' },
          ],
          shared: ['vue', 'pinia', '@lolas/core-sdk'],
        },
      }),
    ],
    build: { target: 'esnext' },
  };
});
