import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'dark-50': '#f7f7f8',
        'dark-100': '#ececf1',
        'dark-200': '#d9d9e3',
        'dark-300': '#c5c5d2',
        'dark-400': '#acacbe',
        'dark-500': '#8e8ea0',
        'dark-600': '#565869',
        'dark-700': '#40414f',
        'dark-800': '#343541',
        'dark-900': '#202123',
        'dark-950': '#050509',
        medBlue: '#3b82f6',
      },
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
  },
  plugins: [],
  darkMode: 'class',
} satisfies Config;
