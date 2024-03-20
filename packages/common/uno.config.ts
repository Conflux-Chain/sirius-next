import { defineConfig, presetUno, presetIcons } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { handler } from "@unocss/preset-mini/utils";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["./components/**/*.tsx"],
      outFile: "./dist/uno.css",
    },
  },
  rules: [
    [
      /^bg-gradient-(?:repeating-)?linear-(.+)$/,
      ([, s]) => ({
        "background-image": `linear-gradient${handler.bracket(s)}`,
      }),
    ],
    [
      /^ws-nowrap$/,
      () => ({
        "white-space": 'nowrap',
      }),
    ],
  ],
  shortcuts: {
    "bg-linear-blue":
      "bg-gradient-linear-[(90deg,rgb(131,200,252)0%,rgb(120,241,231)100%)]",
    "bg-linear-blue-hover":
      "bg-gradient-linear-[(90deg,rgb(168,218,255)0%,rgb(182,255,249)100%)]",
    "text-linear-blue": "bg-clip-text bg-linear-blue text-transparent",
    "flex-vertical-center": "flex items-center",
    "flex-horizontal-center": "flex justify-center",
    "flex-center": "flex justify-center items-center",
    "inline-flex-vertical-center": "inline-flex items-center flex-shrink-0",
    "inline-flex-horizontal-center": "inline-flex justify-center",
    "inline-flex-center":
      "inline-flex justify-center items-center flex-shrink-0",
    "absolute-center":
      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  theme: {
    // breakpoints: {
    //   tiny: "350px",
    //   mini: "375px",
    //   mobile: "460px",
    //   sm: "640px",
    //   md: "768px",
    //   lg: "1024px",
    //   xl: "1280px",
    //   "2xl": "1536px",
    //   "3xl": "1920px",
    // },
    colors: {
      blue: {
        dark: "#0077FF",
        normal: "#E7F0FF",
        light: "#F8FAFF",
      },
      black: {
        normal: "#000000",
      },
      white: {
        normal: "#FFFFFF",
      },
      orange: {
        normal: "#EC653B",
        light: "#FFE8E1",
      },
      green: {
        normal: "#2DBD85",
        light: "#EAF8F3",
      },
      red: {
        normal: "#F5465C",
        light: "#FEEDEF",
      },
      gray: {
        100: "#1B1B1C",
        80: "#3C424E",
        60: "#8D939E",
        40: "#B0B6BF",
        20: "#E9EBEE",
        10: "#F2F4F8",
        4: "#F7F8FB",
      },
    },
    boxShadow: {
      normal: "0px 6px 16px 0px #00000014",
    },
  },
  presets: [presetUno(), presetIcons({
    extraProperties: {
      display: 'inline-block',
      'vertical-align': 'middle',
    },
  })],
  transformers: [
    transformerVariantGroup(),
  ],
});
