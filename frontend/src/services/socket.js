import Constants from "expo-constants";
import { io } from "socket.io-client";

const baseUrl = `${Constants.manifest.extra.uri}`;

export const socket = io(baseUrl, {
  path: "/ws/socket.io",
  transports: ["websocket"],
});
