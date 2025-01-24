const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'], // Update paths based on your project
  theme: {
    extend: {
      colors: {
        primary: '#fff',
        'dashboard-bg': 'rgba(11, 12, 16, 1)',
        'primary-color': '#0b0c10',
        black: '#000',
        brand: '#74d6fd',
        pink: '#e01dee',
        secondary: '#e7ecf0',
        'secondary-color': '#1a1c24',
        'collateral-color': '#1d9259',
        'borrow-color': '#f42222',
        'spinner-bgn': 'rgba(0, 0, 0, 0.5)',
        'spinner-content': '#393939',
        'footer-bg-color': '#00000d',
        'footer-text-color': '#e7ebf5',
        'footer-line-color': 'rgba(231, 235, 245, 0.2)',
        'footer-divider-bg': '#201338',
        gray: '#83919f',
        'light-purple': '#36294e',
        'dark-purple': '#120721',
        'light-blue': '#74d5fd',
        'slider-gray': '#393942',
        'status-opened': '#1edc9e',
        'status-closed': '#433b5a',
        'status-pending': '#83919f',
        'success-color': '#4caf50',
        'error-color': '#ff5a5f',
        'color-overlay': 'rgba(0, 0, 0, 0.5)',
        bg: '#120721',
        'border-color': '#201338',
        'stormy-gray': '#83919f',
        'deep-purple': '#120721',
        'dark-background': '#130713',
        'light-dark-background': '#130713',
        'text-gray': '#798795',
        'modal-border': '#170f2e',
        'warning-colour': '#bdc000',
        'warning-colour-alt': '#272a0a',
        'warning-text-colour': '#f0f0f0',
        'nav-button-hover': '#49abd2',
        'nav-divider-bg': '#36294e',
        'header-bg': 'rgba(7, 0, 22, 0.8)',
        'second-primary': '#fdfdfd',
        'plain-button-bg': '#0e0a16',
        'header-button-bg': '#120721',
      },
      fontFamily: {
        text: ['Rethink Sans', 'sans-serif'],
        primary: ['Open Sans', 'sans-serif'],
        third: ['Allerta Stencil', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        app: "url('../public/desktop-background.png')",
        'app-mobile': "url('../public/mobile-background.png')",
        gradient: 'linear-gradient(73deg, #74d6fd 1.13%, #e01dee 103.45%)',
        'button-gradient': 'linear-gradient(55deg, #74d6fd 0%, #e01dee 100%)',
        'button-gradient-hover': 'linear-gradient(55deg, #74d6fd 0%, #74d6fd 100%)',
        'button-gradient-active': 'linear-gradient(55deg, #58c4ef 0%, #58c4ef 100%)',
        'second-gradient': 'linear-gradient(55deg, #e01dee 0%, #49abd2 49%)',
        'border-gradient': 'linear-gradient(90deg, #49abd2 0%, #df1ced 99.5%)',
        'blue-pink-gradient': 'linear-gradient(90deg, #74d6fd 0%, #e01dee 100%)',
        'blue-pink-gradient-alt': 'linear-gradient(90deg, #49abd2 0%, #e01dee 100%)',
        'blue-pink-gradient-alt2': 'linear-gradient(90deg, #49abd2 100%, #e01dee 100%)',
        'card-bg-gradient': 'linear-gradient(135deg, rgba(116, 214, 253, 0.5) 0%, rgba(11, 12, 16, 0.5) 100%)',
      },
      boxShadow: {
        card: 'inset 4px 4px 9px 0 rgba(153, 234, 255, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.15)',
      },
      blur: {
        card: '42.1875px',
        backdrop: '12px',
      },
      borderWidth: {
        'purple-border': '1px',
        'midnight-purple-border': '1px',
        'midnight-purple-hover-border': '1px',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents }) {
      // Add Base styles
      addBase({
        body: {
          overflowX: 'hidden',
        },
        main: {
          overflow: 'hidden',
        },
        '*': {
          margin: '0',
          padding: '0',
          boxSizing: 'border-box',
          fontFamily: "var(--font-family, 'Open Sans', sans-serif)",
        },
        a: {
          textDecoration: 'none',
        },
        li: {
          listStyleType: 'none',
        },
      });

      // Add Custom Components
      addComponents({
        '.app': {
          '@apply min-h-screen bg-cover bg-center': {},
          backgroundImage: "url('../public/desktop-background.png')",
        },
        '@media (max-width: 768px)': {
          '.app': {
            backgroundImage: "url('../public/mobile-background.png')",
            backgroundPosition: '50% 40%',
            height: '100%',
          },
        },
      });
    }),
  ],
};
