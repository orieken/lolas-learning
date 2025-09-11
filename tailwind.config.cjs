/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/shell/index.html',
    './apps/shell/src/**/*.{vue,ts,tsx,js,jsx}',
    './apps/games/**/*.{ts,vue,html}',
    './packages/ui-kit/**/*.{ts,vue,js,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lolaPink: '#FF6EC7',
        lolaBlue: '#4FC3F7',
        lolaGreen: '#4CAF50',
        lolaYellow: '#FFEB3B',
        lolaPurple: '#9575CD',
      },
    },
  },
  plugins: [],
};
