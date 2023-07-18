import { Platform } from "react-native";

const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#FFFFFF",
    primary: "#0366d6",
    appBar: "#24292e",
    backGround: "#f9c2ff",
    blue: "#4c8ffc",
    errorRed: "#d73a4a",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
    primeheading: 20,
  },
  fonts: {
    main: Platform.select({
      android: "Roboto",
      ios: "Arial",
      default: "System",
    }),
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
};

export default theme;
