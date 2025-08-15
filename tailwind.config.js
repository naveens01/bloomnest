/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Eco-friendly primary colors
        'eco': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Nature-inspired secondary colors
        'nature': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Earth tones
        'earth': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Ocean blues
        'ocean': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Forest greens
        'forest': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      backgroundImage: {
        'eco-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #86efac 75%, #4ade80 100%)',
        'nature-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
        'earth-gradient': 'linear-gradient(135deg, #fefce8 0%, #fef9c3 25%, #fde047 50%, #eab308 75%, #ca8a04 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #93c5fd 50%, #3b82f6 75%, #1d4ed8 100%)',
        'forest-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 25%, #4ade80 50%, #16a34a 75%, #14532d 100%)',
        'eco-radial': 'radial-gradient(circle at center, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 60%, #86efac 100%)',
        'nature-radial': 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
      },
      boxShadow: {
        'eco-glow': '0 0 20px rgba(34, 197, 94, 0.3)',
        'eco-glow-lg': '0 0 30px rgba(34, 197, 94, 0.4)',
        'nature-glow': '0 0 20px rgba(100, 116, 139, 0.3)',
        'earth-glow': '0 0 20px rgba(234, 179, 8, 0.3)',
        'ocean-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'forest-glow': '0 0 20px rgba(22, 163, 74, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
