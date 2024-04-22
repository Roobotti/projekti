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
    console.log("new game");
    setUserReady(false);
    setFriendReady(false);
    setGameOver(false);
    setWin(false);

    if (host) {
      getData();
    }
  };

  const handleLeft = useCallback(() => {
    if (friend) {
      socket.emit("host", { user: user, friend: friend, userReady: userReady });
      setLeft(friend);
      setHost(true);
      console.log(friend, "left");
    }
  });

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
          console.log("newGame");
          newGame();
        }
      }
    }
  }, [host, friend]);

  //handles the sockets
  useEffect(() => {
    initialize();
    if (friend) {
      socket.emit("join", { user: user, friend: friend });
      socket.on("room", ({ room, host, blocks, solutions }) => {
        setRoom(room);
        setHost(host === user);
        setPuzzle({ blocks, solutions });
        console.log("join");
      });
      socket.on("redy", () => {
        setFriendReady(true);
      });
      socket.on("game_data", ({ blocks, solutions }) => {
        setPuzzle({ blocks, solutions });
        setIsLoading(false);
      });
      socket.on("ubongo", () => {
        setGameOver(true);
      });

      socket.on("left", handleLeft);
    }
  }, [friend]);

  return (
    <Online3DContext.Provider
      value={{
        sendRedy,
        newGame,
        sendUbongo,
        initialize,
        isLoading,
        userReady,
        friendReady,
        gameOver,
        win,
        friendData,
        setUserReady,
        puzzle,
      }}
    >
      {children}
    </Online3DContext.Provider>
  );
};
