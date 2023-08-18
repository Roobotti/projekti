import { createContext, useState } from "react";

const InitialcountDown = 5000;
const gameDuration = 3 * 60;
const contestTime = 6;

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
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

  return (
    <GameContext.Provider
      value={{
        initialize,
        isLoading,
        setIsLoading,
        userReady,
        setUserReady,
        friendReady,
        setFriendReady,
        countdown,
        setCountdown,
        gameOver,
        setGameOver,
        win,
        setWin,
        left,
        setLeft,
        host,
        setHost,
        friendData,
        setFriendData,
        clicks,
        setClicks,
        hintText,
        setHintText,
        uboText,
        setUboText,
        hintTimer,
        setHintTimer,
        contestTimer,
        setContestTimer,
        proveTimer,
        setProveTimer,
        puzzle,
        setPuzzle,
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
