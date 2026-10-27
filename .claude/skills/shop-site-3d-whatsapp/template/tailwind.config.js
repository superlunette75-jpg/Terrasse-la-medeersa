/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font)', 'sans-serif'] },
      // All colours come from the CSS variables in src/index.css (one place to re-theme)
      colors: {
        ink: v('ink'),
        light: v('light'),
        paper: v('paper'),
        accent: v('accent'),
        'accent-2': v('accent-2'),
        'accent-dark': v('accent-dark'),
      },
    },
  },
  plugins: [],
};
