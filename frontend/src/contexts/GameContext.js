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
const gameDuration = 3;
const contestTime = 6;
const proveTime = 20;
const colors = ["red", "green", "blue", "yellow"];

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const { user, friend, room, token, setRoom } = useContext(UserContext);

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
  const [color, setColor] = useState("red");

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
  /**
   * submits the prove and updates winner
   */
  const submitProve = () => {
    console.log("Solution: ", puzzle.solutions[0]);
    const result = puzzle.solutions.some((r) => r === colored);
    socket.emit("contest_result", { room: room, result: result });
    setProveTimer(0);
    setContestTimer(0);
    setWin(result);
  };
  /**
   * emits contest for opponent
   */
  const sendContest = () => {
    socket.emit("contest", { room: room });
    setProveTimer(proveTime + 1);
  };

  /**
   * @fires setClicks
   * @fires sendUbongo or setUboText
   */
  const handleUbongoClick = async () => {
    if (clicks >= 3) sendUbongo();
    if (clicks >= 0) setUboText(2 - clicks);
    else setUboText("UBONGO");
    setClicks(clicks + 1);
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
    const clickTimer = setTimeout(() => {
      setClicks(0);
      setUboText("UBONGO");
    }, 1000);

    return () => {
      clearTimeout(clickTimer);
    };
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
        initialize,
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
        setUserReady,
        contestTimer,
        proveTimer,
        puzzle,
        colored,
        setColored,
        setColor,
        color,
        setLeft,
        setHost,
        setPuzzle,
        setFriendReady,
        setIsLoading,
        setGameOver,
        setProveTimer,
        setWin,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
