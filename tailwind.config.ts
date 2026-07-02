import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        morelia: {
          bg: "#FFFFFF",
          "bg-alt": "#F5F5F5",
          "bg-dark": "#0A0A0A",
          "bg-footer": "#151515",
          text: "#1A1A1A",
          "text-soft": "#666666",
          accent: "#2D3A35",
          button: "#1C2B27",
          "button-hover": "#111c19",
          badge: "#000000",
          discount: "#6B7C5C",
          shipping: "#7C9B6E",
          whatsapp: "#25D366",
          error: "#D32F2F",
          card: "#F0F0F0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
