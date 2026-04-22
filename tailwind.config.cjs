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
        'lola-bg': '#FDFBF7',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulse_scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'pulse-scale': 'pulse_scale 2s ease-in-out infinite',
      },
      boxShadow: {
        card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        button: '0 4px 0 0 rgba(0, 0, 0, 0.2)',
        'button-active': '0 0 0 0 rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
