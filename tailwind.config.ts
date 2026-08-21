import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fgPurple: {
          500: "#b52bc9",
          600: "#8b1fa0",
          800: "#3c0c4c",
        },
      },
    },
  },
  plugins: [],
};

export default config;