import Constants from "expo-constants";
import { io } from "socket.io-client";

const baseUrl = `${Constants.manifest.extra.ws}`;

export const socket = io(baseUrl, {
  transports: ["websocket"],
});
