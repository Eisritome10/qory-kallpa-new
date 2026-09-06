/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        marino: {
          50: '#f2f7fb',
          100: '#e1ebf4',
          200: '#c0d6e9',
          300: '#95bada',
          400: '#548fc2',
          500: '#035aa6',
          600: '#034b93',
          700: '#033d80',
          800: '#022e6c',
          900: '#021f59',
          950: '#01102d',
        },
        naranja: {
          50: '#fef9f3',
          100: '#fdf1e1',
          200: '#fce1c1',
          300: '#facd96',
          400: '#f6ad55',
          500: '#f28705',
          600: '#f25c05',
          700: '#a94004',
          800: '#6d2902',
          900: '#3d1701',
        },
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
