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
        bgPrimary: "rgb(var(--bg-primary) / <alpha-value>)",
        textPrimary: "rgb(var(--text-primary) / <alpha-value>)",
        textMuted: "rgb(var(--text-muted) / <alpha-value>)",
        accentLime: "rgb(var(--accent-lime) / <alpha-value>)",
        accentPink: "rgb(var(--accent-pink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
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
