/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tarot-purple': '#4a148c',
        'tarot-gold': '#ffd700',
        'tarot-dark': '#1a0033',
      }
    },
  },
  plugins: [],
}
