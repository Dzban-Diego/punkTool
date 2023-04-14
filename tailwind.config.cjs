/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f5',
        primary: '#86efac',
        secondary: '#cf2116',
        liked: '#c395e0',
        textColor: '#6a6a6a',
        gray: '#6a6a6a',
        loading: '#5a5a5a',
        orange: '#fa0',

        dark_background: '#272930',
      }
    },
  },
  plugins: [],
};
