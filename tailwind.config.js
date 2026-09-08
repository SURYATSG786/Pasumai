/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f5f9f6',
          100: '#e6efe8',
          200: '#c3d9cb',
          300: '#95bca6',
          400: '#679c82',
          500: '#2d6a4f',
          600: '#1b4d38',
          700: '#15382b',
          800: '#112a20',
          900: '#0a1c14',
        },
        amber: {
          50: '#fef7e6',
          100: '#fdecc8',
          200: '#f8d9a0',
          300: '#f3c069',
          400: '#e9a232',
          500: '#d98a1f',
          600: '#c47e1e',
          700: '#9a5f15',
          800: '#744711',
          900: '#53330c',
        },
        teal: {
          50: '#eef6f4',
          100: '#d6ece8',
          200: '#a8d4ca',
          300: '#73bdab',
          400: '#45a08c',
          500: '#2a9d8f',
          600: '#1e7a6c',
          700: '#165d56',
          800: '#114442',
          900: '#0b3231',
        },
        soil: {
          50: '#faf7f2',
          100: '#f3ecdf',
          200: '#e8dac8',
          300: '#d6c09a',
          400: '#c49867',
          500: '#b07a42',
          600: '#8c5d2f',
          700: '#6c4420',
          800: '#503118',
          900: '#39220f',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'soft': '0 4px 24px -8px rgba(27, 45, 40, 0.08)',
        'soft-lg': '0 12px 48px -12px rgba(27, 45, 40, 0.12)',
        'card': '0 2px 16px -4px rgba(27, 79, 63, 0.10), 0 0 0 1px rgba(45, 106, 79, 0.06)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'energy-flow': {
          '0%': { strokeDashoffset: '2000' },
          '100%': { strokeDashoffset: '0' },
        },
        'tank-fade': {
          '0%': { opacity: '0', transform: 'scaleY(0.95)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'pulse-dot': 'pulse-dot 2.2s ease-in-out infinite',
        'count-up': 'count-up 0.5s ease-out forwards',
        'energy-flow': 'energy-flow 2.4s ease-in-out infinite',
        'tank-fade': 'tank-fade 0.7s ease-out forwards',
        'spin-slow': 'spin-slow 18s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
