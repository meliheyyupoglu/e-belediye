import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d6efd",
        "primary-dark": "#084298",
        danger: "#dc3545",
        success: "#198754",
        warning: "#fd7e14",
      },
    },
  },
  plugins: [],
};

export default config;
