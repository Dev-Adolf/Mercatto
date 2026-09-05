/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mercatto: {
          blue: '#1F3D7A',
          orange: '#FF6B00',
        }
      }
    },
  },
  plugins: [],
}
