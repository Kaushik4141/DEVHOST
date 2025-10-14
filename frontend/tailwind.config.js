/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#000000',
        'secondary': '#1a1a1a',
      },
      textColor: {
        'primary': '#ffffff',
        'secondary': '#a0a0a0',
      },
    },
  },
  plugins: [],
}