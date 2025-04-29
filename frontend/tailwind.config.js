import daisyui from "daisyui";

module.exports = {
  content: ["*"],
  theme: {
    extend: {},
  },
  pulgins: ["daisyyi"],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
};
