/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
module.exports = {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, 'tailwind.config.cjs') },
    autoprefixer: {},
  },
};
