/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta mística y elegante
        'tarot': {
          'dark': '#0a0e27',      // Azul medianoche muy oscuro
          'navy': '#141b3d',      // Azul marino profundo
          'indigo': '#1e2749',    // Índigo oscuro
          'purple': '#2d1b4e',    // Púrpura profundo (sutil)
          'gold': '#c9a96e',      // Dorado elegante (champagne)
          'silver': '#b8c5d6',    // Plata suave
          'accent': '#8b7ab8',    // Lavanda místico
        },
        'mystic': {
          'blue': '#1a2a52',      // Azul místico
          'teal': '#2c5f66',      // Verde azulado profundo
          'bronze': '#9a7b4f',    // Bronce antiguo
        }
      },
      backgroundImage: {
        'gradient-mystic': 'linear-gradient(135deg, #0a0e27 0%, #141b3d 50%, #1e2749 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(20, 27, 61, 0.8) 0%, rgba(10, 14, 39, 0.9) 100%)',
      },
      boxShadow: {
        'mystic': '0 4px 20px rgba(201, 169, 110, 0.15)',
        'mystic-lg': '0 10px 40px rgba(201, 169, 110, 0.25)',
        'glow-gold': '0 0 20px rgba(201, 169, 110, 0.4)',
        'glow-silver': '0 0 15px rgba(184, 197, 214, 0.3)',
      }
    },
  },
  plugins: [],
}
