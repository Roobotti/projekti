import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";

import { socket } from "../services/socket";
import { UserContext } from "./UserContext";
import { getPuzzle } from "../services/puzzle";
import { loadFriend, newWin } from "../services/users";

export const Online3DContext = createContext();

export const Online3DContextProvider = ({ children }) => {
  const { user, friend, room, token, setRoom } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [left, setLeft] = useState(null);
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
    setLeft(null);
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

  //handles friend lefting
  useEffect(() => {
    if (friend) {
      if (left) {
        setLeft(null);
      } else {
        const getFriend = async () => {
          const data = await loadFriend(friend);
          const json = await data.json();
          setFriendData(json);
        };
        getFriend();
        if (host) {
          newGame();
        }
      }
    }
  }, [host, friend]);

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
        setLeft,
        setHost,
        setPuzzle,
        setFriendReady,
        setIsLoading,
        setGameOver,
        setFriendGaveUp,
      }}
    >
      {children}
    </Online3DContext.Provider>
  );
};
