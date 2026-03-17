/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "swiss-red": "#E60000", /* Swiss design accent red */
        "swiss-black": "#0F0F0F",
        "swiss-white": "#FAFAFA",
        "swiss-gray": "#EBEBEB",
        "swiss-darkgray": "#222222",
      },
      fontFamily: {
        swiss: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
