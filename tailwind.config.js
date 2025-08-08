/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: "#FF6F61",
        accent: "#00B3FF",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};