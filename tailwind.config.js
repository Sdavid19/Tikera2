// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/index.css"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      }
    },
  },
  plugins: [],
}
