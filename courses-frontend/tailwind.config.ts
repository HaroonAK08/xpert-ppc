import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f8fc',
        surface: '#ffffff',
        border: '#e3ebf7',
        ink: '#0a1b3f',
        muted: '#6b7a94',
        navy: '#071833',
        brand: {
          DEFAULT: '#1a6ef0',
          foreground: '#ffffff',
          soft: '#e8f1ff',
          soft2: '#eef6ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 4px 24px -6px rgba(10, 27, 63, 0.10), 0 1px 2px rgba(10, 27, 63, 0.04)',
        pop: '0 10px 28px -10px rgba(26, 110, 240, 0.45)',
        card: '0 8px 30px -12px rgba(10, 27, 63, 0.14)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
