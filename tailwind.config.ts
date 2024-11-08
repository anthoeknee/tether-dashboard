import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        gray: {
          900: '#030712',  // Your dark background
          800: '#1f2937',
          700: '#374151',
          // ... add other shades
        }
      },
      boxShadow: {
        'custom-gray': '0 0 15px rgba(0,0,0,0.1)', // Custom shadow
      },
      backdropBlur: {
        'lg': '20px', // Example extension if needed
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
