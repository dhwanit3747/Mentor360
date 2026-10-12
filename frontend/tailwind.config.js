/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0F8F6',
          100: '#D7EDE7',
          200: '#AFDCD1',
          300: '#7EC4B5',
          400: '#4DAA98',
          500: '#2A8F7C',
          600: '#176B5B', // Primary Brand Teal
          700: '#125447',
          800: '#0F4439',
          900: '#0C352D',
        },
        amber: {
          50: '#FFFDF5',
          100: '#FEF9E6',
          200: '#FDF1C4',
          300: '#FBE49A',
          400: '#F8D166',
          500: '#F4B942', // Warm amber accent
          600: '#D99B22',
          700: '#B27914',
          800: '#8C5A10',
          900: '#69410D',
        },
        charcoal: {
          50: '#F5F7F6',
          100: '#E6EAE8',
          200: '#CAD3CF',
          300: '#A7B6B0',
          400: '#7B928A',
          500: '#5A6F68',
          600: '#43544E',
          700: '#34423D',
          800: '#25332F', // Brand Dark Charcoal
          900: '#19221F',
        },
        surface: {
          bg: '#F7F9F8',
          card: '#FFFFFF',
          border: '#E2ECE8',
          muted: '#F0F4F2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(23, 107, 91, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        card: '0 4px 12px -2px rgba(23, 107, 91, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        floating: '0 12px 28px -4px rgba(23, 107, 91, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
