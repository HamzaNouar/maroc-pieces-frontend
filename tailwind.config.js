/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a2642", // Dark blue from the screenshot
          light: "#2a3a5c",
          dark: "#0f1729",
        },
        secondary: {
          DEFAULT: "#25D366", // WhatsApp green
        },
      },
    },
  },
  plugins: [],
};
