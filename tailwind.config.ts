import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      base: '0px',
      mobile: '390px',
      tablet: '744px',
      'tablet-landscape': '1133px',
      desktop: '1440px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      boxShadow: {
        smooth: '0 -4px 6px -1px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-on-hover': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-on-hover::-webkit-scrollbar': {
          display: 'none',
        },
        '.scrollbar-on-hover:hover': {
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
        },
        '.scrollbar-on-hover:hover::-webkit-scrollbar': {
          display: 'block',
          height: '8px',
        },
        '.scrollbar-on-hover:hover::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '.scrollbar-on-hover:hover::-webkit-scrollbar-thumb': {
          background: '#888',
          'border-radius': '4px',
        },
        '.scrollbar-on-hover:hover::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      });
    },
  ],
};

export default config;
