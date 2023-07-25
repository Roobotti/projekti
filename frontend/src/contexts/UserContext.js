import { createContext, useContext, useEffect, useState } from "react";
import { readUsersMe } from "../services/users";
import { useAuthStorage } from "../hooks/useStorageContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const authStorage = useAuthStorage();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const result = await readUsersMe(await authStorage.getAccessToken());
        const user = (await result) ? result.username : null;
        console.log("user:", user);
        setUser(await user);
      } catch (error) {
        console.error("Error fetching da user data:", error);
        setUser(null);
      }
    };
    fetcher();
  }, [token]);

  const login = (data) => {
    setToken(data);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
