/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: "jit",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css,html,json,scss,md,mdx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  // darkMode: "media",
  theme: {
    extend: {},
    fontFamily: {
      serif: ["novel", "serif"],
      sans: ["sans-serif"],
      mono: ["monospace"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
      addVariant("child-before", "& > *:before");
      addVariant("child-after", "& > *:after");
    },
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          primary: "#e6bbbe",
          // "primary-content": "#ffffff",
          secondary: "#cbd3eb",
          // "secondary-content": "#ffffff",
          accent: "#b7aad2",
          // "accent-content": "#d99c99",
          neutral: "#292929",
          // "neutral-content": "#415558",
          "base-100": "#f9f9f9",
          // "base-200": "#f9f9f9",
          // "base-300": "#f9f9f9",
          // "base-content": "#464841",
          info: "#a5cec7",
          success: "#b8d2aa",
          warning: "#e4d7a4",
          error: "#d9989c",
        },
      },
      {
        dark: {
          primary: "#e6bbbe",
          // "primary-content": "#ffffff",
          secondary: "#cbd3eb",
          // "secondary-content": "#ffffff",
          accent: "#b7aad2",
          // "accent-content": "#d99c99",
          neutral: "#292929",
          // "neutral-content": "#415558",
          "base-100": "#46484e",
          // "base-200": "#f9f9f9",
          // "base-300": "#f9f9f9",
          "base-content": "#edebef",
          info: "#a5cec7",
          success: "#b8d2aa",
          warning: "#e4d7a4",
          error: "#d9989c",
        },
      },
    ],
  },
};
