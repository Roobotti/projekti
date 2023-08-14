import "dotenv/config";

export default {
  name: "ubongo-app",
  slug: "ubongo-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  backgroundColor: "black",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "black",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "black",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    env: process.env.ENV,
    uri: process.env.APOLLO_URI,
    ws: process.env.WS_URL,
  },
};
