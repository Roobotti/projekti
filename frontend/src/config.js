import Constants from "expo-constants";

const DEFAULT_APOLLO_URI = "https://fs-projekti-ubongo.onrender.com";
const DEFAULT_WS_URL = "wss://fs-projekti-ubongo.onrender.com";

const extra =
  Constants.expoConfig?.extra ??
  Constants.manifest2?.extra ??
  Constants.manifest?.extra ??
  {};

export const API_URI = extra.uri ?? DEFAULT_APOLLO_URI;
export const WS_URI = extra.ws ?? DEFAULT_WS_URL;
