/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo[700],
        secondary: colors.yellow,
        neutral: colors.gray,
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
