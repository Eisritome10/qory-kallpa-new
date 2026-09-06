/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        marino: {
          50: '#eef3f9',
          100: '#d3e0ee',
          200: '#a7c1dd',
          300: '#7aa2cb',
          400: '#4e83ba',
          500: '#2c649f',
          600: '#1f4d7d',
          700: '#16385c',
          800: '#0f2843',
          900: '#0a1c30',
          950: '#06121f',
        },
        naranja: {
          50: '#fff4ed',
          100: '#ffe4d1',
          200: '#ffc59e',
          300: '#ff9f5f',
          400: '#ff7f33',
          500: '#f8621a',
          600: '#e04c10',
          700: '#b93a0e',
          800: '#933014',
          900: '#772a13',
        },
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
