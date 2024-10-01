import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"'],
        Thai: ["Noto Sans Thai"],
        Pinyon_Script: ["Pinyon Script"],
        Cinzel_Decorative: ["Cinzel Decorative"],
        Figerona: ["Figerona"],
        Montserrat: ["Montserrat"],
        Bodwars: ["Bodwars"],
        Inter: ["Inter"],
      },
    },
  },
  plugins: [],
}
export default config
