/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nebula: {
          base: '#030014',
          dark: '#010008',
          void: '#0a0520',
          accent: '#6366f1',
          'accent-light': '#818cf8',
        },
        neon: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          pink: '#ff6ec7',
          purple: '#a855f7',
          blue: '#3b82f6',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'jelly': 'jelly 0.5s ease-out',
        'jelly-hover': 'jellyHover 0.3s ease-out',
        'nebula-drift': 'nebulaDrift 20s ease-in-out infinite',
        'nebula-drift-2': 'nebulaDrift2 25s ease-in-out infinite',
        'nebula-drift-3': 'nebulaDrift3 30s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(40px)' },
          '50%': { opacity: '1', filter: 'blur(60px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        jelly: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15, 0.85)' },
          '40%': { transform: 'scale(0.85, 1.15)' },
          '50%': { transform: 'scale(1.05, 0.95)' },
          '65%': { transform: 'scale(0.95, 1.05)' },
          '75%': { transform: 'scale(1.02, 0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        jellyHover: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05, 0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        nebulaDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(50px, -30px) scale(1.1)' },
          '50%': { transform: 'translate(-30px, 50px) scale(0.9)' },
          '75%': { transform: 'translate(-50px, -20px) scale(1.05)' },
        },
        nebulaDrift2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-60px, 40px) scale(1.15)' },
          '66%': { transform: 'translate(40px, -60px) scale(0.85)' },
        },
        nebulaDrift3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '20%': { transform: 'translate(30px, 60px) scale(1.08)' },
          '40%': { transform: 'translate(-40px, 20px) scale(0.92)' },
          '60%': { transform: 'translate(20px, -40px) scale(1.12)' },
          '80%': { transform: 'translate(-60px, -30px) scale(0.95)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
