import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          '50': '#f8f7f8',
          '100': '#f0eef0',
          '200': '#dddadd',
          '300': '#bfb9c0',
          '400': '#9c939d',
          '500': '#807681',
          '600': '#686069',
          '700': '#564e56',
          '800': '#494349',
          '900': '#121215',
          '950': '#0d0c0f',
          '1000' : '#020204',
        },
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundColor: 'rgba(55, 55, 55, 0.1)' },
          '100%': { backgroundColor: 'rgba(55, 55, 55, 0.5)' },
        },
      },
      animation: {
        skeleton: 'skeleton 1.5s infinite linear',
      },
    },
  },
  safelist: [
    { pattern: /delay-(75|100|1000|500)/}
  ]
} satisfies Config;
