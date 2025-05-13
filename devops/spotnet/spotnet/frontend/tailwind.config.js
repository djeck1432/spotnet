/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'backdrop-dark': 'var(--color-backdrop-dark)',
        'backdrop-darker': 'var(--color-backdrop-darker)',
        'border-light': 'var(--color-border-light)',
        'border-lighter': 'var(--color-border-lighter)',
        'gradient-purple': 'var(--color-gradient-purple)',
        'gradient-transparent': 'var(--color-gradient-transparent)',
        primary: 'var(--primary)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
      },
    },
  },
  plugins: [],
};
