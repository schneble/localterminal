import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        x400: '#B0B0B0',
        surface400: '#A0A0A0',
        surface600: '#808080',
        surf7: '#404040',
        surface900: '#1A1A1A',
        surface950: '#121212',
        x950: '#000000',
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: '#ffffff',
        purple: '#3f3cbb',
        midnight: '#121063',
        metal: '#565584',
        tahiti: '#3ab7bf',
        silver: '#ecebff',
        bubblegum: '#ff77e9',
        bermuda: '#78dcca',
        },
        boxShadow: {
            'terminal-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        },
    },
    plugins: [],
} satisfies Config;
