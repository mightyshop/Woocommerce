/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          100: '#FFE5E0',
          200: '#FFD1C8',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};