import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a8a43",   // verde principal
        secondary: "#f8fafc", // branco levemente acinzentado
      },
    },
  },
  plugins: [],
} satisfies Config;
