import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadAvatar, loadFriend, readUsersMe } from "../services/users";
import { useAuthStorage } from "../hooks/useStorageContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const authStorage = useAuthStorage();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [wins, setWins] = useState([]);
  const [loses, setLoses] = useState([]);
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(null);
  const [invites, setInvites] = useState([]);
  const [sentInvite, setSentInvite] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [reFresh, setReFresh] = useState(false);

  useEffect(() => {
    const f = async () => {
      const t = await authStorage.getAccessToken();
      console.log("token:", t);
      setToken(t);
    };
    f();
  }, [user]);

  useEffect(() => {
    const fetcher = async () => {
      try {
        //get the user data from db
        const result = await readUsersMe(
          token || (await authStorage.getAccessToken())
        );
        const friends = (await result) ? result.friends : [];
        const user = (await result) ? result.username : null;
        const requests = (await result) ? result.requests : [];
        const wins = (await result) ? result.wins : [];
        const loses = (await result) ? result.loses : [];
        const avatar = (await result) ? result.avatar : null;
        const sentRequests = (await result) ? result.sentRequests : [];

        console.log("user:", user);
        setUser(await user);
        setFriends(await friends);
        setRequests(requests);
        setSentRequests(sentRequests);
        setWins(wins);
        setLoses(loses);
        setAvatar(avatar);
      } catch (error) {
        console.error("Error fetching da user data:", error);
        setUser(null);
        setFriends([]);
      }
    };
    fetcher();
  }, [token, reFresh]);

  const login = (token) => {
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        friends,
        requests,
        sentRequests,
        wins,
        loses,
        room,
        token,
        invites,
        sentInvite,
        avatar,
        login,
        logout,
        setSentRequests,
        setRequests,
        setReFresh,
        setFriends,
        setInvites,
        setSentInvite,
        setRoom,
        setAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
