/* @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'akira-sb': ['var(--font-asb)']
      },
      keyframes: {
        flicker: {
          '0%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          },
          '3%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 15px #b8d3ff,0 0 26px #4287f5,0 0 53px #4287f5,0 0 60px #4287f5',
          },
          '5%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          },
          '30%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 15px #b8d3ff,0 0 26px #4287f5,0 0 53px #4287f5,0 0 60px #4287f5',
          },
          '33%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          },
          '35%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 15px #b8d3ff,0 0 26px #4287f5,0 0 53px #4287f5,0 0 60px #4287f5',
          },
          '38%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          },
          '41%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 15px #b8d3ff,0 0 26px #4287f5,0 0 53px #4287f5,0 0 60px #4287f5',
          },
          '43%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          },
          '91%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 15px #b8d3ff,0 0 26px #4287f5,0 0 53px #4287f5,0 0 60px #4287f5',
          },
          '100%': {
            textShadow: '0 0 4px #b8d3ff,0 0 9px #b8d3ff,0 0 13px #b8d3ff,0 0 22px #4287f5,0 0 48px #4287f5,0 0 53px #4287f5',
          }
        },
      },
      animation: {
        'flicker-text': 'flicker 5s infinite',
      },
    },
  },
  plugins: [],
}