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
        'christ-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'holy-radial': 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: '#000000',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#FFD700',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#FFA500',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#FF8C00',
          foreground: '#000000',
        },
        card: {
          DEFAULT: 'rgba(255, 215, 0, 0.03)',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: 'rgba(0, 0, 0, 0.95)',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'rgba(255, 215, 0, 0.05)',
          foreground: 'rgba(255, 255, 255, 0.7)',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        border: 'rgba(255, 215, 0, 0.1)',
        input: 'rgba(255, 215, 0, 0.05)',
        ring: '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1', fontWeight: '900' }],
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
      },
      boxShadow: {
        'holy': '0 0 50px rgba(255, 215, 0, 0.3)',
        'divine': '0 0 100px rgba(255, 215, 0, 0.2)',
        'blessed': '0 4px 20px rgba(255, 215, 0, 0.15)',
      },
      keyframes: {
        'holy-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
            transform: 'scale(1.01)'
          },
        },
        'divine-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'sacred-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'blessed-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'holy-pulse': 'holy-pulse 4s ease-in-out infinite',
        'divine-glow': 'divine-glow 3s ease-in-out infinite',
        'sacred-float': 'sacred-float 6s ease-in-out infinite',
        'blessed-shimmer': 'blessed-shimmer 3s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;