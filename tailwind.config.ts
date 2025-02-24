import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mainGreen':'#42B27C',
        'mainBlack':'#1E1E1E',
        'mainBlacks':'#2D2D2D',
        'mainGreens':'#134F32'
      },
      fontFamily: {
        sansSerif: ['var(--font-poppins)'],
        serif: ['var(--font-noto-serif)']
      }
    },
  },
  plugins: [],
};
export default config;
