/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        pomodoro: {
          primary: "#e74c3c",
          secondary: "#c0392b",
          light: "#f5f5f5"
        },
        task: {
          add: "#2ecc71",
          hover: "#27ae60"
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
} 