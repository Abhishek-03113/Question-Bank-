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
        bgPrimary: "rgb(var(--bg-primary))",
        textPrimary: "rgb(var(--text-primary))",
        textMuted: "rgb(var(--text-muted))",
        accentLime: "rgb(var(--accent-lime))",
        accentPink: "rgb(var(--accent-pink))",
        surface: "rgb(var(--surface))",
        border: "rgb(var(--border))",
      },
      fontFamily: {
        sans: ["var(--font-bricolage)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};
export default config;
