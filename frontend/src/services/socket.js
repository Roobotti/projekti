import Constants from "expo-constants";
import { io } from "socket.io-client";

const baseUrl = `${Constants.manifest.extra.uri}`;

/**
 * Creates a socket to the path
 *
 * @returns socket client
 */
export const socket = io(baseUrl, {
  path: "/ws/socket.io",
  transports: ["websocket"],
});
