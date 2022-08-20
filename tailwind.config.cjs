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
    //...
  },
};
