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
          600: '#ea4b1e',
          500: '#ff6a2a',
          100: '#ffe7d9'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
