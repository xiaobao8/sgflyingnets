import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-cormorant)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f4',
          100: '#e8e6e1',
          200: '#d4d0c8',
          300: '#b5aea2',
          400: '#9a9182',
          500: '#7d7365',
          600: '#6b6155',
          700: '#584f46',
          800: '#4a433c',
          900: '#3f3a34',
          950: '#1f1d1a',
        },
        gold: {
          400: '#c9a962',
          500: '#b8954a',
          600: '#9a7b3d',
        },
        cream: '#faf8f5',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
