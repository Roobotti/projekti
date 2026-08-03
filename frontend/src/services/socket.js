import { io } from "socket.io-client";
import { API_URI } from "../config";

const baseUrl = API_URI;

/**
 * Creates a socket to the path
 *
 * @returns socket client
 */
export const socket = io(baseUrl, {
  path: "/ws/socket.io",
  transports: ["websocket"],
});
