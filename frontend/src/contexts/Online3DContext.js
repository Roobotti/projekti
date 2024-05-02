import React, { createContext, useContext, useState } from "react";

import { socket } from "../services/socket";
import { UserContext } from "./UserContext";
import { getPuzzle } from "../services/puzzle";
import { newWin } from "../services/users";

export const Online3DContext = createContext();

export const Online3DContextProvider = ({ children }) => {
  const { user, friend, room, token } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [host, setHost] = useState(false);

  const [friendGaveUp, setFriendGaveUp] = useState(false);
  const [userGaveUp, setUserGaveUp] = useState(false);

  const [friendData, setFriendData] = useState(null);

  const [puzzle, setPuzzle] = useState([]);

  const initialize = () => {
    setIsLoading(false);
    setUserReady(false);
    setFriendReady(false);
    setGameOver(false);
    setWin(false);
    setHost(false);
    setFriendData(null);
    setPuzzle([]);
  };

  const newGame = async () => {
    setUserReady(false);
    setFriendReady(false);
    setGameOver(false);
    setWin(false);
    setFriendGaveUp(false);
    setUserGaveUp(false);
    if (host) {
      getData();
    }
  };

  const getData = async () => {
    try {
      const response = await getPuzzle();
      socket.emit("data", {
        room: room,
        blocks: response.blocks,
        solutions: response.solutions,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendRedy = () => {
    socket.emit("userRedy", { room: room, user: user });
    setUserReady(true);
  };

  const sendUbongo = () => {
    socket.emit("ubongo", { room: room });
    newWin(token, friend);
    setWin(true);
    setGameOver(true);
  };

  const giveUp = () => {
    setUserGaveUp(true);
    socket.emit("userGiveUp", { room: room, user: user });
  };

  return (
    <Online3DContext.Provider
      value={{
        sendRedy,
        newGame,
        sendUbongo,
        initialize,
        giveUp,
        isLoading,
        userReady,
        friendReady,
        gameOver,
        win,
        friendData,
        userGaveUp,
        host,
        setUserReady,
        puzzle,
        friendGaveUp,
        setHost,
        setPuzzle,
        setFriendReady,
        setIsLoading,
        setGameOver,
        setFriendGaveUp,
        setUserGaveUp,
      }}
    >
      {children}
    </Online3DContext.Provider>
  );
};
