/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0a",
        secondary: "#2d5016",
        accent: "#f59e0b",
        surface: "#2d5016",
      },
      fontFamily: {
        heading: ["Raleway", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
