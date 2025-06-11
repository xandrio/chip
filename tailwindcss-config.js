/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // для Angular
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark-horizontal': 'linear-gradient(to right, #0f1a20, #0f1b21, #0f1c22, #0f1d23, #0f1e24)',
      },
    },
  },
  plugins: [],
};