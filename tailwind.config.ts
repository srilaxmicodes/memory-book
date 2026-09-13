import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff6f0",
        blush: "#f8d7e3",
        rose: "#e8a0bf",
        petal: "#f3c6d4",
        ink: "#3a2a36",
        muted: "#7a6572",
        sree: "#d45d8a",
        dhanush: "#5b7cbf",
        lavender: "#d9ccec",
        mint: "#d8efe6",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(212, 93, 138, 0.12)",
        card: "0 10px 30px rgba(58, 42, 54, 0.08)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both",
        sparkle: "sparkle 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
