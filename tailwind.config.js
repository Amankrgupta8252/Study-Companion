/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.300'),
            maxWidth: '100%',
          },
        },
      }),
    },
  },
  plugins: [],
  darkMode: 'class',
};