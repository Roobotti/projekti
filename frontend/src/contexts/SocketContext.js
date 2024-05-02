import { useLocation } from "react-router-native";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { GameContext } from "./GameContext";
import { UserContext } from "./UserContext";
import { socket } from "../services/socket";
import { Online3DContext } from "./Online3DContext";

export const SocketContext = createContext();

const socketContext2D = () => {
  const { user, friend, setRoom, setSentInvite } = useContext(UserContext);
  const {
    initialize,
    setHost,
    setPuzzle,
    setFriendReady,
    setUserReady,
    setIsLoading,
    setGameOver,
    setProveTimer,
    setWin,
  } = useContext(GameContext);
  const location = useLocation();

  const proveTime = 20;

  useEffect(() => {
    const handleUserLeft = () => {
      setHost(true);
      socket.emit("host", { user: user, friend: friend });
      socket.emit("invite", { user: user, friend: friend, mode: "2D" });
      setSentInvite(friend);
    };

    const onRoom = ({
      room,
      host,
      blocks,
      solutions,
      hostRedy,
      playerRedy,
    }) => {
      setRoom(room);
      setHost(host === user);
      setPuzzle({ blocks, solutions });

      if (host === user) {
        setFriendReady(playerRedy);
        setUserReady(hostRedy);
      } else {
        setFriendReady(hostRedy);
        setUserReady(playerRedy);
      }
    };

    const onReady = () => {
      setFriendReady(true);
    };

    const onGameData = ({ blocks, solutions }) => {
      setPuzzle({ blocks, solutions });
      setIsLoading(false);
    };

    const onUbongo = () => {
      setGameOver(true);
    };

    const onContested = () => {
      setProveTimer(proveTime);
    };

    const onContestResult = ({ result }) => {
      setProveTimer(0);
      setWin(!result);
    };

    if (location.pathname === "/MultiPlayer" && friend) {
      socket.emit("join", { user: user, friend: friend });
      socket.on("room", onRoom);
      socket.on("redy", onReady);
      socket.on("game_data", onGameData);
      socket.on("ubongo", onUbongo);
      socket.on("contested", onContested);
      socket.on("contestResult", onContestResult);
      socket.on("userLeft", handleUserLeft);
    }

    return () => {
      socket.off("room", onRoom);
      socket.off("redy", onReady);
      socket.off("game_data", onGameData);
      socket.off("ubongo", onUbongo);
      socket.off("contested", onContested);
      socket.off("contestResult", onContestResult);
      socket.off("userLeft", handleUserLeft);
    };
  }, [friend, location]);
};

const socketContext3D = () => {
  const { user, friend, setRoom, setSentInvite } = useContext(UserContext);
  const {
    setHost,
    setPuzzle,
    setFriendReady,
    setUserReady,
    setIsLoading,
    setGameOver,
    setFriendGaveUp,
    setUserGaveUp,
    newGame,
  } = useContext(Online3DContext);

  const location = useLocation();

  useEffect(() => {
    const handleUserLeft = () => {
      setHost(true);
      socket.emit("host", { user: user, friend: friend });
      socket.emit("invite", { user: user, friend: friend, mode: "3D" });
      setSentInvite(friend);
    };

    const onRoom = ({
      room,
      host,
      blocks,
      solutions,
      hostRedy,
      playerRedy,
      hostGaveUp,
      playerGaveUp,
    }) => {
      setRoom(room);
      setHost(host === user);
      setPuzzle({ blocks, solutions });
      if (host === user) {
        setFriendGaveUp(playerGaveUp);
        setFriendReady(playerRedy);
        setUserGaveUp(hostGaveUp);
        setUserReady(hostRedy);
      } else {
        setFriendGaveUp(hostGaveUp);
        setFriendReady(hostRedy);
        setUserGaveUp(playerGaveUp);
        setUserReady(playerRedy);
      }
    };

    const onReady = () => {
      setFriendReady(true);
    };

    const onGameData = ({ blocks, solutions }) => {
      setPuzzle({ blocks, solutions });
      setIsLoading(false);
    };

    const onUbongo = () => {
      setGameOver(true);
    };

    const onGaveUp = () => {
      setFriendGaveUp(true);
    };

    const onBothGaveUp = () => {
      newGame();
    };

    if (location.pathname === "/MultiPlayer3D" && friend) {
      socket.emit("join", { user: user, friend: friend });
      socket.on("room", onRoom);
      socket.on("redy", onReady);
      socket.on("game_data", onGameData);
      socket.on("ubongo", onUbongo);
      socket.on("userLeft", handleUserLeft);
      socket.on("friendGaveUp", onGaveUp);
      socket.on("bothGaveUp", onBothGaveUp);
    }

    return () => {
      socket.off("room", onRoom);
      socket.off("redy", onReady);
      socket.off("game_data", onGameData);
      socket.off("ubongo", onUbongo);
      socket.off("userLeft", handleUserLeft);
      socket.off("friendGaveUp", onGaveUp);
      socket.off("bothGaveUp", onBothGaveUp);
    };
  }, [friend, location]);
};

export const SocketContextProvider = ({ children }) => {
  const { user, room, sentInvite, setSentInvite } = useContext(UserContext);

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname != "/MultiPlayer3D" &&
      location.pathname != "/MultiPlayer"
    ) {
      if (sentInvite) {
        socket.emit("cancel_invites", { friend: sentInvite, user: user });
        setSentInvite(null);
      }
      socket.emit("leave", { room: room, user: user });
    }
  }, [location]);

  socketContext2D();
  socketContext3D();

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
