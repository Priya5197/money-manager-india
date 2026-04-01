import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian-themed color palette
        primary: {
          50: '#f5f7fc',
          100: '#ebeef9',
          200: '#d1d9f1',
          300: '#a8b8e6',
          400: '#7e94d8',
          500: '#5b6bc8',
          600: '#4a50b8',
          700: '#3a3d95',
          800: '#2d2e75',
          900: '#242558',
          950: '#1a1a3d',
        },
        // Saffron accent (India flag color)
        saffron: {
          50: '#fef9f3',
          100: '#fef1e0',
          200: '#fdddbf',
          300: '#fcc193',
          400: '#f9a547',
          500: '#f67d1f',
          600: '#e85e0f',
          700: '#bf480e',
          800: '#9a3c0f',
          900: '#7c320e',
          950: '#460f02',
        },
        // Emerald for positive/gains
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#052e16',
        },
        // Rose for negative/losses
        rose: {
          50: '#fff5f7',
          100: '#ffe4e9',
          200: '#ffd0d9',
          300: '#ffacc0',
          400: '#ff7f99',
          500: '#ff497c',
          600: '#f91e63',
          700: '#d91d57',
          800: '#b21650',
          900: '#93134a',
          950: '#540623',
        },
        // Navy for secondary elements
        navy: {
          50: '#f8f9fc',
          100: '#f0f3f9',
          200: '#dde5f2',
          300: '#bdd1e6',
          400: '#8fb3d6',
          500: '#5f8bc9',
          600: '#3f6cb8',
          700: '#2d4a8c',
          800: '#1f3462',
          900: '#132240',
          950: '#0c1628',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        card: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
