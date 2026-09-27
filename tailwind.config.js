/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#173b31',
          hover: '#245b43',
          strong: '#102c25',
          soft: '#eaf1ea',
          light: '#a9d7b1',
        },
        accent: {
          DEFAULT: '#93650a',
          hover: '#765108',
          light: '#e5b54a',
        },
        primary: '#173b31',
        background: {
          light: '#ffffff',
          dark: '#16231d',
        },
        surface: {
          light: '#ffffff',
          dark: '#202c24',
        },
        text: {
          main: {
            light: '#20352a',
            dark: '#f3f5ef',
          },
          muted: {
            light: '#64756a',
            dark: '#b8c8ba',
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: 'class',
}
