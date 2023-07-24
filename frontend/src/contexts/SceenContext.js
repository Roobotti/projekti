import React, { useState, createContext } from "react";

export const ScreenContext = createContext();

export const ScreenContextProvider = ({ children }) => {
  const [data, setData] = useState();

  return (
    <ScreenContext.Provider value={{ data, setData }}>
      {children}
    </ScreenContext.Provider>
  );
};
