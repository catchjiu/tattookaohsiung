import type { Config } from "tailwindcss";

/**
 * Tattoo Kaohsiung — Cyberpunk-Industrial Dark Mode
 * Design tokens live in globals.css; this config extends for content paths
 * and JS-based overrides.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#fafaf9",
          warm: "#f0f0f0",
          muted: "#e0e0e0",
        },
        charcoal: {
          DEFAULT: "#0c0c0c",
          deep: "#1a1a1a",
          soft: "#1a1a1a",
          muted: "#2d2d2d",
        },
        neon: {
          DEFAULT: "#00e5ff",
          muted: "rgba(0, 229, 255, 0.15)",
          subtle: "rgba(0, 229, 255, 0.08)",
        },
        industrial: {
          DEFAULT: "#4a4a4a",
          100: "#e8e8e8",
          200: "#9e9e9e",
          300: "#6b6b6b",
          400: "#4a4a4a",
          500: "#333333",
        },
        bronze: {
          DEFAULT: "#00e5ff",
          muted: "rgba(0, 229, 255, 0.15)",
          subtle: "rgba(0, 229, 255, 0.08)",
        },
      },
      borderRadius: {
        none: "0",
        sharp: "0",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        "tracking-tightest": "-0.03em",
        "tracking-widest": "0.25em",
        "tracking-wider": "0.2em",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
