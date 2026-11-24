/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#54172D",
          deep: "#3B1021",
          soft: "#762C43",
          50: "#FBF6F8",
          100: "#F5E9EE",
          200: "#E9D2DB",
        },
        ivory: "#F8F4F1",
        beige: "#EDE3DF",
        rose: "#C6A18D",
        ink: "#252126",
        muted: "#6B646C",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(59, 16, 33, 0.06), 0 12px 32px -12px rgba(59, 16, 33, 0.10)",
        lift: "0 4px 12px -4px rgba(59, 16, 33, 0.10), 0 24px 56px -20px rgba(59, 16, 33, 0.20)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      maxWidth: {
        shell: "1280px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};
