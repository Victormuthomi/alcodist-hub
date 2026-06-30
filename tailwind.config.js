import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: "#050505",
          800: "#0D0D0D",
          700: "#1A1A1A",
          600: "#262626",
        },
        lab: {
          emerald: "#10B981",
          cobalt: "#3B82F6",
          slate: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
      },
    },
  },
  plugins: [
    typography, // Required for Markdown rendering
  ],
};
