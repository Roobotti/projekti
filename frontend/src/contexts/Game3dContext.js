import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { padBlock } from "../tools/PadBlock";
import { blockIsValid } from "../tools/BlockRotations";
import { floor, max, min } from "lodash";

import { UserContext } from "./UserContext";

export const Game3dContext = createContext();

export const Game3dContextProvider = ({ children }) => {
  const { xp, level, streak, addScore } = useContext(UserContext);

  const [color, setColor] = useState("red");

  const [timeStart, setTimeStart] = useState(0);
  const [score, setScore] = useState({
    time: 0,
    base: 100,
    speed: 0,
    total: 0,
  });

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [pressed, setPressed] = useState(null);
  const [visibleTop, setVisibleTop] = useState(true);
  const [blockParts, setBlockParts] = useState([[], [], [], []]);
  const [blocks, setBlocks] = useState([]);
  const [validBlocks, setValidBlocks] = useState([]);
  const [reValidate, setReValidate] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [blockColorMap, setBlockColorMap] = useState({});

  const [xp3D, setXp] = useState(xp);
  const [level3D, setLevel] = useState(level);
  const [streak3D, setStreak] = useState(streak);
  const [newLevel, setNewLevel] = useState(level);

  const [online, setOnline] = useState(false);

  const block_size = {
    r1: 5,
    r2: 5,
    r3: 4,
    r4: 4,
    g1: 5,
    g2: 5,
    g3: 4,
    g4: 4,
    y1: 5,
    y2: 5,
    y3: 5,
    y4: 4,
    b1: 5,
    b2: 5,
    b3: 5,
    b4: 3,
  };

  //Clear all blocks of pressed
  useEffect(() => {
    if (pressed) {
      const i = blocks.indexOf(pressed);
      const newBlockParts = [...blockParts];
      newBlockParts[i] = [];
      setBlockParts(newBlockParts);
      setValidBlocks((a) => a.filter((b) => b !== pressed));
    }
  }, [pressed]);

  //Clear all blockparts
  useEffect(() => {
    if (blocks.length) {
      setBlockParts([[], [], [], []]);
      setValidBlocks([]);
      setSelectedBlock(blocks[0]);
    }
    if (allValid) setAllValid(false);
    setTimeStart(Date.now());
  }, [blocks]);

  //Set all valid blocks
  useEffect(() => {
    if (reValidate) {
      setReValidate(false);
      for (let i = 0; i < 4; i++) {
        if (blocks?.length && blockParts[i].length) {
          setValidBlocks((b) => {
            if (blockIsValid(padBlock(blockParts[i]), blocks[i]))
              return validBlocks.includes(blocks[i]) ? b : [...b, blocks[i]];
            else return [...b.filter((a) => a !== blocks[i])];
          });
        }
      }
    }
  }, [reValidate, blockParts]);

  //Check if all are valid
  useEffect(() => {
    if (validBlocks.length === 2) {
      setAllValid(true);
      if (online) {
        const time = floor((Date.now() - timeStart) / 1000);
        const base = 1000;
        const speed = time <= 180 ? 1000 - time * 5 : max([1, 100 - time * 1]);
        const total = base + speed;

        setScore({ time, base, speed, total });
        setXp(xp);
        setLevel(level);

        let i = level;
        while (50 * i ** 2 + 2000 * i + 500 <= xp + total) {
          i++;
        }

        setTimeStart(Date.now());
        setNewLevel(i);
        addScore(xp + total, i, 0);
      } else {
        const time = floor((Date.now() - timeStart) / 1000);
        const base = 100;
        const speed = time <= 180 ? 1000 - time * 5 : max([1, 100 - time * 1]);
        const total = (base + speed) * (streak + 1);

        setScore({ time, base, speed, total });
        setXp(xp);
        setLevel(level);
        setStreak(min([5, streak + 1]));

        let i = level;
        while (50 * i ** 2 + 2000 * i + 500 <= xp + total) {
          i++;
        }

        setTimeStart(Date.now());
        console.log(total);
        console.log("level: ", i);

        setNewLevel(i);
        addScore(xp + total, i, min([5, streak + 1]));
      }
      setValidBlocks([]);
    }
  }, [validBlocks]);

  const addBlockPart = (block, position) => {
    const i = blocks.indexOf(block);
    const newBlockParts = blockParts;
    newBlockParts[i] = [...blockParts[i], position];
    setBlockParts(newBlockParts);
    if (newBlockParts[i].length >= block_size[block]) setReValidate(true);
  };

  const deleteBlockPart = (block, position) => {
    if (!block) return;
    const i = blocks.indexOf(block);
    const newBlockParts = blockParts;
    newBlockParts[i] = [
      ...blockParts[i].filter((b) => !b.every((p, n) => position[n] === p)),
    ];
    setBlockParts(newBlockParts);
    if (
      newBlockParts[i].length === block_size[block] ||
      newBlockParts[i].length === block_size[block] - 1
    )
      setReValidate(true);
  };

  return (
    <Game3dContext.Provider
      value={{
        color,
        blocks,
        selectedBlock,
        visibleTop,
        validBlocks,
        reValidate,
        pressed,
        blockColorMap,
        allValid,
        score,
        xp3D,
        level3D,
        streak3D,
        newLevel,
        online,

        setXp,
        setLevel,
        setStreak,
        setAllValid,
        setBlockColorMap,
        setColor,
        setSelectedBlock,
        setVisibleTop,
        setBlocks,
        addBlockPart,
        deleteBlockPart,
        setPressed,
        setValidBlocks,
        setOnline,
      }}
    >
      {children}
    </Game3dContext.Provider>
  );
};
