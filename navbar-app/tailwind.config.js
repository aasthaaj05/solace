/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink-light': '#F7CFD8',
        'cream': '#F4F8D3',
        'teal-light': '#A6F1E0',
        'teal': '#73C7C7',
      },
    },
  },
  plugins: [],
}