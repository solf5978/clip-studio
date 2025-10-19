// postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Or just 'tailwindcss' depending on your setup
    autoprefixer: {},
  },
};

export default config;
