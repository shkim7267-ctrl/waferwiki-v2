import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b0f1a',
          800: '#141a2a',
          700: '#1d2437',
          600: '#2a3246',
          500: '#3a445d',
          200: '#cfd6e6'
        },
        accent: {
          700: '#cf3f12',
          600: '#e6451a',
          500: '#ff6a33',
          100: '#ffe1d6'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
