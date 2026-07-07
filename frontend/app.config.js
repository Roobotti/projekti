import "dotenv/config";

const DEFAULT_APOLLO_URI = "https://fs-projekti-ubongo.onrender.com";
const DEFAULT_WS_URL = "wss://fs-projekti-ubongo.onrender.com";

export default {
  name: "ubongo-app",
  slug: "ubongo-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  backgroundColor: "#000000",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.roobotti.ubongoapp",
  },
  android: {
    softwareKeyboardLayoutMode: "pan",
    package: "com.roobotti.ubongoapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    env: process.env.ENV,
    uri: process.env.APOLLO_URI || DEFAULT_APOLLO_URI,
    ws: process.env.WS_URL || DEFAULT_WS_URL,
    eas: {
      projectId: "a1e55254-e543-4037-bca0-d8b8fce25611",
    },
  },
};
