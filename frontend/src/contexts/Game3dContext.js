import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { padBlock } from "../tools/PadBlock";
import { blockIsValid } from "../tools/BlockRotations";

export const Game3dContext = createContext();

export const Game3dContextProvider = ({ children }) => {
  const [color, setColor] = useState("red");

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [pressed, setPressed] = useState(null);
  const [visibleTop, setVisibleTop] = useState(true);
  const [blockParts, setBlockParts] = useState([[], [], [], []]);
  const [blocks, setBlocks] = useState([]);
  const [validBlocks, setValidBlocks] = useState([]);
  const [reValidate, setReValidate] = useState(false);
  const [solution, setSolution] = useState(null);
  const [blockColorMap, setBlockColorMap] = useState({});

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

  useEffect(() => {
    if (pressed) {
      const i = blocks.indexOf(pressed);
      const newBlockParts = [...blockParts];
      newBlockParts[i] = [];
      setBlockParts(newBlockParts);
      setValidBlocks((a) => a.filter((b) => b !== pressed));
    }
  }, [pressed]);

  useEffect(() => {
    if (blocks.length) {
      setBlockParts([[], [], [], []]);
      setSelectedBlock(blocks[0]);
    }
  }, [blocks]);

  useEffect(() => {
    if (reValidate) {
      setReValidate(false);
      for (let i = 0; i < 4; i++) {
        if (blocks?.length && blockParts[i].length) {
          setValidBlocks((b) => {
            if (blockIsValid(padBlock(blockParts[i]), blocks[i]))
              return [...b, blocks[i]];
            else return [...b.filter((a) => a !== blocks[i])];
          });
        }
      }
    }
  }, [reValidate, blockParts]);

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
        solution,
        blockColorMap,

        setBlockColorMap,
        setSolution,
        setColor,
        setSelectedBlock,
        setVisibleTop,
        setBlocks,
        addBlockPart,
        deleteBlockPart,
        setPressed,
      }}
    >
      {children}
    </Game3dContext.Provider>
  );
};
