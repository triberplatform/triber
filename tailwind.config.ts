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
        'mainGreen':'#42B27C'
      },
      fontFamily: {
        serif: ['NotoSerif-Regular', 'serif'],
        sansSerif:['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
};
export default config;
