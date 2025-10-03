import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cik': 'linear-gradient(135deg, #039199 0%, #209BB7 50%, #3BC1BC 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 8px)',
        sm: 'calc(var(--radius) - 12px)',
        'cik': '40px',
        'cik-sm': '32px',
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#0D0D0D',
        primary: {
          DEFAULT: '#039199',
          light: '#209BB7',
          lighter: '#3BC1BC',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: 'rgb(245, 166, 31)',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0D0D0D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0D0D0D',
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#0D0D0D',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: 'rgba(13, 13, 13, 0.6)',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        border: '#160505',
        input: '#E5E5E5',
        ring: '#039199',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        open: ['var(--font-open-sans)', 'sans-serif'],
        luckiest: ['var(--font-luckiest)', 'cursive'],
        izhora: ['var(--font-izhora)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 4px 16px rgba(3, 145, 153, 0.2)' },
          '50%': { boxShadow: '0 8px 24px rgba(3, 145, 153, 0.35)' },
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
      },
      boxShadow: {
        'cik': '4px 4px 0 #000000',
        'cik-lg': '6px 6px 0 #000000',
        'cik-xl': '8px 8px 0 #000000',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;