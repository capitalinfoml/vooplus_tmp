import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0a0f',
          card: '#12121a',
          elevated: '#1a1a26',
        },
        border: {
          subtle: '#1e1e2e',
          DEFAULT: '#2a2a3e',
          strong: '#3a3a52',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
          dim: '#78350f',
        },
        orange: {
          DEFAULT: '#f97316',
          hover: '#fb923c',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#475569',
        },
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
