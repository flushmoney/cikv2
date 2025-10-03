@@ .. @@
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
-        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
-        'gradient-conic':
-          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
+        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)',
+        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
       },
       borderRadius: {
         lg: 'var(--radius)',
         md: 'calc(var(--radius) - 2px)',
         sm: 'calc(var(--radius) - 4px)',
       },
       colors: {
-        background: '#0A0B0F',
+        background: '#000000',
         foreground: '#FFFFFF',
         primary: {
-          DEFAULT: '#0001FE',
+          DEFAULT: '#FFD700',
           foreground: '#000000',
         },
+        secondary: {
+          DEFAULT: '#1a1a2e',
+          foreground: '#FFFFFF',
+        },
+        accent: {
+          DEFAULT: '#16213e',
+          foreground: '#FFFFFF',
+        },
         card: {
-          DEFAULT: 'rgba(255, 255, 255, 0.05)',
+          DEFAULT: 'rgba(255, 255, 255, 0.1)',
           foreground: '#FFFFFF',
         },
         popover: {
-          DEFAULT: 'rgba(255, 255, 255, 0.05)',
+          DEFAULT: 'rgba(26, 26, 46, 0.95)',
           foreground: '#FFFFFF',
         },
-        secondary: {
-          DEFAULT: 'rgba(255, 255, 255, 0.1)',
-          foreground: '#FFFFFF',
-        },
         muted: {
-          DEFAULT: 'rgba(255, 255, 255, 0.05)',
-          foreground: 'rgba(255, 255, 255, 0.6)',
-        },
-        accent: {
-          DEFAULT: 'rgba(255, 255, 255, 0.1)',
-          foreground: '#FFFFFF',
+          DEFAULT: 'rgba(255, 255, 255, 0.1)',
+          foreground: 'rgba(255, 255, 255, 0.7)',
         },
         destructive: {
           DEFAULT: '#EF4444',
           foreground: '#FFFFFF',
         },
-        border: 'rgba(255, 255, 255, 0.1)',
-        input: 'rgba(255, 255, 255, 0.1)',
-        ring: '#0001FE',
+        border: 'rgba(255, 215, 0, 0.2)',
+        input: 'rgba(255, 255, 255, 0.1)',
+        ring: '#FFD700',
       },
       fontFamily: {
-        mono: ['var(--font-mono)', 'monospace'],
+        sans: ['Inter', 'system-ui', 'sans-serif'],
+        serif: ['Georgia', 'serif'],
+        mono: ['JetBrains Mono', 'monospace'],
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
-        'fade-in': {
-          '0%': { opacity: '0' },
-          '100%': { opacity: '1' },
-        },
-        'scale-in': {
-          '0%': { opacity: '0', transform: 'scale(0.95)' },
-          '100%': { opacity: '1', transform: 'scale(1)' },
-        },
-        'glow': {
-          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 1, 254, 0.3)' },
-          '50%': { boxShadow: '0 0 30px rgba(0, 1, 254, 0.5)' },
+        'golden-glow': {
+          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
+          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
+        },
+        'float': {
+          '0%, 100%': { transform: 'translateY(0px)' },
+          '50%': { transform: 'translateY(-10px)' },
+        },
+        'pulse-gold': {
+          '0%, 100%': { opacity: '1' },
+          '50%': { opacity: '0.8' },
         },
       },
       animation: {
         'accordion-down': 'accordion-down 0.2s ease-out',
         'accordion-up': 'accordion-up 0.2s ease-out',
-        'fade-in': 'fade-in 0.3s ease-out',
-        'scale-in': 'scale-in 0.2s ease-out',
-        'glow': 'glow 2s ease-in-out infinite',
+        'golden-glow': 'golden-glow 3s ease-in-out infinite',
+        'float': 'float 6s ease-in-out infinite',
+        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
       },
     },
   },
   plugins: [require('tailwindcss-animate')],
 };
 export default config;