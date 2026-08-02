import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep ocean navy — the primary brand color.
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1c30',
        },
        // Warm sand / gold accent.
        gold: {
          50: '#fbf7ef',
          100: '#f5ebd6',
          200: '#ead4ad',
          300: '#dcb679',
          400: '#d19f52',
          500: '#c68a3a',
          600: '#b0722f',
          700: '#925a2a',
          800: '#784927',
          900: '#653d24',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 42, 67, 0.08), 0 8px 24px rgba(16, 42, 67, 0.06)',
        'card-hover': '0 4px 12px rgba(16, 42, 67, 0.12), 0 16px 40px rgba(16, 42, 67, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;

