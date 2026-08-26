/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void:     '#050816',
        panel:    '#0B1020',
        ion:      '#55E6FF',
        electric: '#8B5CF6',
        plasma:   '#D946EF',
        cloud:    '#E8EEF9',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        'signal': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        'electric-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
        'signal-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spotlight-glow': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%':       { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      },
      animation: {
        'electric-pulse': 'electric-pulse 2s ease-in-out infinite',
        'signal-in':      'signal-in 0.6s cubic-bezier(0.23,1,0.32,1) both',
        'spotlight-glow': 'spotlight-glow 4s ease infinite',
      },
      backgroundImage: {
        'signal-field': 'radial-gradient(ellipse at 60% 20%, rgba(85,230,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.14) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(217,70,239,0.08) 0%, transparent 45%)',
        'signal-field-light': 'radial-gradient(ellipse at 60% 20%, rgba(85,230,255,0.06) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.07) 0%, transparent 50%)',
      },
    },
  },
  safelist: [
    'from-sky-500', 'to-cyan-400',
    'from-violet-500', 'to-fuchsia-400',
    'from-emerald-500', 'to-lime-400',
    'from-ion', 'to-electric', 'to-plasma',
    'text-ion', 'text-electric', 'text-plasma', 'text-cloud',
    'border-ion', 'border-electric', 'border-plasma',
  ],
  plugins: [],
}
