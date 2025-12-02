/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#d9fbe9',
          200: '#4ac987',
          300: '#1ca071',
          400: '#17825c',
          500: '#149768',
        },
        'logo-text': '#149f6e',
        'custom-green-random': '#1ece82',
        'secondary-orange': {
          100: '#fccb91',
          200: '#fbae53',
          300: '#e38e2a',
          400: '#c07f33',
        },
        'secondary-turquoise': {
          100: '#9be5f5',
          200: '#37b8d8',
          300: '#14839f',
          400: '#065e73',
        },
        'negative-red': {
          100: '#f4dad2',
          200: '#da8368',
          300: '#b84e2d',
          400: '#8f3d23',
        },
        'neutral-gray': {
          100: '#e5e8eb',
          200: '#a8b3bd',
          300: '#6e8191',
          400: '#4d5a66',
          500: '#374149',
        },
      },
      fontFamily: {
        'cabinet-grotesk': ['CabinetGrotesk-Variable'],
        gantari: ['Gantari-VariableFont_wght'],
        faustina: ['Faustina-VariableFont_wght'],
        'tajawal-bold': ['Tajawal-Bold'],
        'tajawal-extra-bold': ['Tajawal-ExtraBold'],
        'tajawal-regular': ['Tajawal-Regular'],
      },
    },
  },
  plugins: [],
};
