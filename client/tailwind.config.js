/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#217346',     // Primary Green
        accent: '#C5E8CA',      // Accent Green
        'bg-base': '#F9F9F2',   // Background
        'text-main': '#2E2E2E', // Text Color (Jet)
        secondary: '#05755C'    // Secondary
      }
    }
  },
  plugins: []
};
