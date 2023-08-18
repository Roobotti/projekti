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

const InitialcountDown = 5000;
const gameDuration = 3 * 60;
const contestTime = 6;
const proveTime = 30;
const colors = ["red", "green", "blue", "yellow"];

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const { user, friend, room, token, invites, setRoom, setInvites } =
    useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [countdown, setCountdown] = useState(InitialcountDown);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [left, setLeft] = useState(null);
  const [host, setHost] = useState(false);

  const [friendData, setFriendData] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [uboText, setUboText] = useState("UBONGO");

  const [hintText, setHintText] = useState("Hint availabe");
  const [hintTimer, setHintTimer] = useState(gameDuration);
  const [contestTimer, setContestTimer] = useState(contestTime);
  const [proveTimer, setProveTimer] = useState(0);

  const [puzzle, setPuzzle] = useState([]);
  const [colored, setColored] = useState([]);
  const [color, setColor] = useState(null);

  const initialize = () => {
    setIsLoading(false);
    setUserReady(false);
    setFriendReady(false);
    setCountdown(InitialcountDown);
    setGameOver(false);
    setWin(false);
    setLeft(null);
    setHost(false);
    setFriendData(null);
    setClicks(0);
    setHintText("Hint availabe");
    setUboText("UBONGO");
    setHintTimer(gameDuration);
    setContestTimer(contestTime);
    setProveTimer(0);
    setPuzzle([]);
    setColored([]);
    setColor(null);
  };

  const newGame = async () => {
    console.log("new game");
    setUserReady(false);
    setFriendReady(false);
    setGameOver(false);
    setUboText("UBONGO");
    setCountdown(InitialcountDown);
    setHintTimer(gameDuration);
    setContestTimer(contestTime);
    setProveTimer(0);
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

  const submitProve = () => {
    const result = puzzle.solutions.includes(colored);
    console.log("result", result);
    socket.emit("contest_result", { room: room, result: result });
    setProveTimer(0);
    setContestTimer(0);
    setWin(result);
  };

  const sendContest = () => {
    console.log("pc", puzzle);
    socket.emit("contest", { room: room });
    setProveTimer(proveTime + 3);
  };

  const handleUbongoClick = async () => {
    console.log("click");
    if (clicks >= 3) sendUbongo();
    if (clicks >= 0) setUboText(2 - clicks);
    else setUboText("UBONGO");
    setClicks(clicks + 1);
  };

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

  useEffect(() => {
    if (friend) {
      initialize();
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

      socket.on("contested", () => {
        console.log("contested");
        setProveTimer(proveTime);
      });

      socket.on("contestResult", ({ result }) => {
        setProveTimer(0);
        setWin(!result);
      });

      socket.on("left", handleLeft);

      socket.on(`${user}/post`, (data) => {
        switch (data.type) {
          case "cancel_invite":
            setInvites(invites.filter((i) => i !== data.user));
            console.log("invite_removed");
            break;
        }
      });
    }
  }, [friend]);

  //count down
  useEffect(() => {
    if (friendReady && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((c) => c - 100);
      }, 10);
      return () => {
        clearInterval(interval);
      };
    }
  }, [friendReady, countdown]);

  //click down
  useEffect(() => {
    if (clicks > 0) {
      const clickInterval = setInterval(() => {
        if (clicks > 1) {
          setUboText(4 - clicks);
        } else setUboText("UBONGO");
        setClicks((c) => c - 1);
      }, 1000);
      return () => {
        clearInterval(clickInterval);
      };
    }
  }, [clicks]);

  //hint timer
  useEffect(() => {
    if (friendReady && userReady) {
      setHintText(
        hintTimer ? `   Hint in ${hintTimer} s   ` : "Hint available"
      );
      if (hintTimer > 0) {
        const hintInterval = setInterval(() => {
          setHintTimer((c) => c - 1);
        }, 1000);
        return () => {
          clearInterval(hintInterval);
        };
      }
    }
  }, [hintTimer, friendReady, userReady]);

  //contest timer
  useEffect(() => {
    if (gameOver) {
      if (contestTimer > 0) {
        const contestInterval = setInterval(() => {
          setContestTimer((c) => c - 1);
        }, 1000);
        return () => {
          clearInterval(contestInterval);
        };
      }
    }
  }, [gameOver, contestTimer]);

  // setting colored
  useEffect(() => {
    if (puzzle.solutions && puzzle.solutions[0])
      setColored(
        puzzle.solutions[0].map((r) =>
          r.map((c) => (colors.includes(c) ? 1 : c))
        )
      );
  }, [puzzle]);

  //prove timer
  useEffect(() => {
    if (proveTimer === 1) {
      setWin(!win);
      setProveTimer(0);
    }
    if (proveTimer > 0) {
      const proveInterval = setInterval(() => {
        setProveTimer((c) => c - 1);
      }, 1000);
      return () => {
        clearInterval(proveInterval);
      };
    }
  }, [proveTimer]);

  return (
    <GameContext.Provider
      value={{
        submitProve,
        sendRedy,
        sendContest,
        newGame,
        handleUbongoClick,
        isLoading,
        userReady,
        friendReady,
        gameOver,
        win,
        friendData,
        hintText,
        uboText,
        hintTimer,
        setHintTimer,
        contestTimer,
        proveTimer,
        puzzle,
        colored,
        setColored,
        color,
        setColor,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
