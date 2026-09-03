/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#060913',
        },
        gold: {
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
        }
      }
    },
  },
  plugins: [],
}
