import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#08090b",
          900: "#0f1115",
          850: "#14171d",
          800: "#1a1e26",
          700: "#262b36",
          600: "#383f4f",
          500: "#545d73",
          400: "#7d889e",
          300: "#a9b2c4",
          200: "#d3d8e3",
          100: "#edeef3",
        },
        thread: {
          900: "#450a0a",
          800: "#7f1d1d",
          700: "#991b1b",
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
          300: "#fca5a5",
          light: "#fee2e2",
        },
        sepia: {
          dark: "#2b261f",
          card: "#1e1b17",
          border: "#3d362d",
          text: "#d5cbbf",
          gold: "#d4af37",
        }
      },
      fontFamily: {
        mono: ["Consolas", "Courier New", "monospace"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        'noir-glow': '0 0 25px -5px rgba(220, 38, 38, 0.25)',
        'dossier': '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
};
export default config;
