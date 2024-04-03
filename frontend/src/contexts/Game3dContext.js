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
  const [visibleTop, setVisibleTop] = useState(true);
  const [blockParts, setBlockParts] = useState([[], [], [], []]);
  const [blocks, setBlocks] = useState([]);
  const [blocksSize, setBlockSize] = useState([5, 5, 5, 5]);
  const [fullBlocks, setFullBlocks] = useState(0);
  const [validBlocks, setValidBlocks] = useState([]);

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
    setBlockParts([[], [], [], []]);
    setBlockSize([...blocks.map((b) => block_size[b])]);
  }, [blocks]);

  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      if (blocks?.length && blockParts[i].length) {
        setValidBlocks((b) => {
          if (blockIsValid(padBlock(blockParts[i]), blocks[i]))
            return [...b, blocks[i]];
          else return b;
        });
      }
    }
  }, [fullBlocks]);

  const addBlockPart = (block, position) => {
    const i = blocks.indexOf(block);
    const newBlockParts = blockParts;
    newBlockParts[i] = [...blockParts[i], position];
    setBlockParts(newBlockParts);
    if (newBlockParts[i].length === block_size[block])
      setFullBlocks((b) => ++b);
    console.log("new blocks: " + newBlockParts[i]);
    console.log(newBlockParts[i]);
  };

  const deleteBlockPart = (block, position) => {
    const i = blocks.indexOf(block);
    const newBlockParts = blockParts;
    newBlockParts[i] = blockParts[i].filter(
      (b) => !b.every((p, n) => position[n] === p)
    );
    setBlockParts(newBlockParts);
    if (newBlockParts[i].length !== block_size[block])
      setFullBlocks((b) => --b);
    console.log("deleted blocks: " + newBlockParts[i]);
    console.log(newBlockParts[i]);
  };

  return (
    <Game3dContext.Provider
      value={{
        color,
        selectedBlock,
        visibleTop,
        validBlocks,

        setColor,
        setSelectedBlock,
        setVisibleTop,
        setBlocks,
        addBlockPart,
        deleteBlockPart,
      }}
    >
      {children}
    </Game3dContext.Provider>
  );
};
