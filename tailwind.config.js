import { nextui} from '@nextui-org/react';
import {zinc} from 'tailwindcss/colors'
/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        gray:zinc
      },
      fontFamily:{
        sans:['Space Grotesk']
      }
    },
  },
  plugins: [nextui()],
  darkMode: "class",

}

