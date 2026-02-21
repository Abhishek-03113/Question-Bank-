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
        'sp-dusk': "rgb(var(--sp-dusk) / <alpha-value>)",
        'sp-amber-mid': "rgb(var(--sp-amber-mid) / <alpha-value>)",
        'sp-terra': "rgb(var(--sp-terra) / <alpha-value>)",
        'sp-honey': "rgb(var(--sp-honey) / <alpha-value>)",
        'sp-sage': "rgb(var(--sp-sage) / <alpha-value>)",
        'sp-rust': "rgb(var(--sp-rust) / <alpha-value>)",
        'sp-cream': "rgb(var(--sp-cream) / <alpha-value>)",
        'sp-parchment': "rgb(var(--sp-parchment) / <alpha-value>)",
        'sp-bark': "rgb(var(--sp-bark) / <alpha-value>)",
        'sp-sun': "rgb(var(--sp-sun) / <alpha-value>)",
        'sp-sand': "rgb(var(--sp-sand) / <alpha-value>)",
        'sp-glass': "rgb(var(--sp-glass) / <alpha-value>)",
        'sp-glass-border': "rgb(var(--sp-glass-border) / <alpha-value>)",
        surface: "rgb(var(--sp-surface) / <alpha-value>)",
        muted: "rgb(var(--sp-muted) / <alpha-value>)",
        border: "rgb(var(--sp-border) / <alpha-value>)",
      },
      fontFamily: {
        fraunces: ["Fraunces", "Georgia", "serif"],
        jetbrains: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        sm: "var(--sp-radius-sm)",
        md: "var(--sp-radius-md)",
        lg: "var(--sp-radius-lg)",
      },
      boxShadow: {
        'sp-sm': 'var(--sp-shadow-sm)',
        'sp-md': 'var(--sp-shadow-md)',
      },
      backdropBlur: {
        glass: '20px',
      },
      keyframes: {
        'sp-fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sp-xp-burst': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'sp-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'sp-spin': { to: { transform: 'rotate(360deg)' } },
        'orb-drift': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-8px) translateX(6px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        'sp-fade-up': 'sp-fade-up 400ms cubic-bezier(.2,.8,.2,1) both',
        'sp-xp-burst': 'sp-xp-burst 700ms ease-out both',
        'sp-flicker': 'sp-flicker 3s infinite',
        'sp-spin': 'sp-spin 6s linear infinite',
        'orb-drift': 'orb-drift 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
};
export default config;
