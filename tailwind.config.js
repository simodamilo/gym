/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "#fafafa",
        "dark-bg-color": "#1f2023",
        "primary-color": "#8a2be2",
        "secondary-color": "#1f2023",
        "dark-secondary-color": "#fafafa",
        "footer-color": "#af6eeb"
      },
    },
  },
  darkMode: "class",
  plugins: [],
}