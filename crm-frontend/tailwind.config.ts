import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f7fc',
        surface: '#ffffff',
        border: '#dce5f4',
        ink: '#0b1f4d',
        muted: '#5b6b86',
        // Logo / marketing site navy
        sidebar: '#061033',
        brand: {
          DEFAULT: '#1d6ff2',
          foreground: '#ffffff',
          soft: '#e8f1fe',
        },
        // Keep orange as a secondary energy accent (site --accent)
        accent: {
          DEFAULT: '#ff5c35',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(11, 31, 77, 0.04), 0 16px 40px -24px rgba(11, 31, 77, 0.28)',
        pop: '0 8px 24px -12px rgba(11, 31, 77, 0.28)',
        glow: '0 0 24px rgba(29, 111, 242, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
