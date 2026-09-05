/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#635BFF',
          light: '#EEEDFF',
          dark: '#4F47E0',
        },
        bg: '#F7F7FB',
        ink: {
          DEFAULT: '#171725',
          soft: '#73738A',
        },
        border: '#E8E8F0',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 23, 37, 0.04), 0 8px 24px -12px rgba(23, 23, 37, 0.10)',
        soft: '0 1px 2px rgba(23, 23, 37, 0.06)',
        pop: '0 12px 32px -8px rgba(99, 91, 255, 0.35)',
      },
      spacing: {
        4.5: '18px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0.6)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up-in': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: 0, transform: 'translateY(-8px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'check-pop': 'check-pop 0.3s ease-out',
        'slide-up-in': 'slide-up-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'toast-in': 'toast-in 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
