import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        cobalt: "#0b4f7a",
        ember: "#e66f00",
        mist: "#e9eef4",
        mint: "#1f8a70"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
