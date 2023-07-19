import React, { useState, createContext } from "react";

export const BoardContext = createContext();

export const BoardContextProvider = ({ children }) => {
  const [data, setData] = useState();

  return (
    <BoardContext.Provider value={{ data, setData }}>
      {children}
    </BoardContext.Provider>
  );
};
