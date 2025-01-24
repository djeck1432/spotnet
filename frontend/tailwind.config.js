module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust as per your project structure
  ],
  theme: {
    extend: {
      colors: {
        midnightPurple: '#4B0082',
        'light-purple':  "var(--light-purple)", 
        'dark-purple': 'var(--dark-purple)',
        'secondary': "var(--secondary)",  
        'midnight-purple-border': "var(--midnight-purple-border)"
      },
    },
  },
  plugins: [],
};
