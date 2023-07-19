import React, { useState, createContext } from "react";

export const BlocksContext = createContext();

export const BlocksContextProvider = ({ children }) => {
  const [blocks, setBlocks] = useState();

  return (
    <BlocksContext.Provider value={{ blocks, setBlocks }}>
      {children}
    </BlocksContext.Provider>
  );
};
