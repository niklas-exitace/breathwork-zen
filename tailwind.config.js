/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: '#FAFAF9',
          text: '#292524',
          slate: '#64748B',
          amber: '#B45309',
          paper: '#F5F5F4',
          border: '#E7E5E4',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 1s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.5)', opacity: '0.1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: []
}
