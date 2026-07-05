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
        teal: {
          900: "#146B6B",
          700: "#1D8484",
          100: "#DCEFEF",
        },
        coral: {
          600: "#F2896B",
          100: "#FBE3DB",
        },
        mist: {
          50: "#F4FAFA",
        },
        charcoal: {
          teal: "#1F3B3B",
        },
        plum: {
          700: "#5B4B8A",
        },
        sage: {
          600: "#6E9B7A",
        },
        brick: {
          600: "#C0503A",
        },
      },
      fontFamily: {
        display: ["var(--font-quicksand)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "spark-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "70%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "spark-pop": "spark-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
