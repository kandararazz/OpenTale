/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cozy: {
          bg: '#FFFFFF',
          card: '#FFFFFF',
          border: '#F0EBE1',
          text: '#2D2825',
          muted: '#7A726C',
        },
        peach: {
          50: '#FFF7F4',
          100: '#FDEEDC',
          200: '#FCD8BF',
          300: '#FBB99B',
          400: '#FFA07A',
          500: '#FF7B54',
          600: '#E05A36',
          700: '#C24524',
          800: '#9E3418',
          900: '#7F2A13',
        },
        sage: {
          50: '#F4F8F5',
          100: '#E8F0E6',
          200: '#CCE0CC',
          300: '#A3C9A8',
          400: '#84B59F',
          500: '#6B9080',
          600: '#4F7263',
          700: '#3D594C',
          800: '#2C4238',
          900: '#1D2E27',
        },
        sky: {
          50: '#F2F8FC',
          100: '#E6F2F7',
          200: '#C2E0EE',
          300: '#94C7DF',
          400: '#579BB1',
          500: '#3A829E',
          600: '#2C677E',
          700: '#204F61',
        },
        butter: {
          50: '#FFFDF5',
          100: '#FFF8DE',
          200: '#FFEFB3',
          300: '#FFE185',
          400: '#F5D061',
          500: '#E0AF26',
        },
        lavender: {
          50: '#FAFAFF',
          100: '#F2EDFE',
          200: '#E2D5FD',
          300: '#C4B0F7',
          400: '#A888E0',
          500: '#8862CD',
        },
        sepia: {
          bg: '#F4ECD8',
          card: '#FAF3E0',
          text: '#433422',
          border: '#E5D6B8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        playful: ['Fredoka', 'cursive', 'sans-serif'],
        dyslexic: ['Lexend', 'OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      boxShadow: {
        'cozy': '0 10px 30px -10px rgba(87, 65, 45, 0.08), 0 4px 12px -4px rgba(87, 65, 45, 0.04)',
        'cozy-hover': '0 20px 40px -12px rgba(87, 65, 45, 0.16), 0 8px 20px -6px rgba(87, 65, 45, 0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'book-flip-next': 'bookFlipNext 0.5s ease-in-out forwards',
        'book-flip-prev': 'bookFlipPrev 0.5s ease-in-out forwards',
        'confetti-bounce': 'confettiBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        bookFlipNext: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(-90deg)', opacity: '0.5' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        bookFlipPrev: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(90deg)', opacity: '0.5' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        confettiBounce: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
