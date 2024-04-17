import { createContext, useEffect, useState } from "react";
import { readUsersMe, updateScore } from "../services/users";
import { useAuthStorage } from "../hooks/useStorageContext";

import { loadFriendData } from "../services/users";

import { socket } from "../services/socket";
import { update } from "lodash";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const authStorage = useAuthStorage();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [wins, setWins] = useState([]);
  const [loses, setLoses] = useState([]);
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(null);
  const [invites, setInvites] = useState([]);
  const [sentInvite, setSentInvite] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [streak, setStreak] = useState(0);

  const [reFresh, setReFresh] = useState(false);
  const [loading, setLoading] = useState();

  //socket handling
  useEffect(() => {
    socket.on(`${user}/post`, async (data) => {
      console.log("sender", data.user, "user", user);
      const friend = await loadFriendData(data.user);
      switch (data.type) {
        case "invite":
          if (!invites.map((f) => f.username).includes(data.user)) {
            setInvites((prevInvites) => [...prevInvites, friend]);
          }
          break;
        case "cancel_invite":
          setInvites((prevInvites) =>
            prevInvites.filter((i) => i.username !== data.user)
          );
          console.log("Invite_removed");
          break;
        case "accept":
          if (!friends.map((f) => f.username).includes(data.user)) {
            setFriends((prevFriends) => [...prevFriends, friend]);
          }
          setRequests((prevRequests) =>
            prevRequests.filter((f) => f.username !== data.user)
          );
          console.log("accept");
          break;
        case "request":
          if (!requests.map((r) => r.username).includes(friend.username)) {
            setRequests((prevRequests) => [...prevRequests, friend]);
          }
          console.log("request");
          break;
      }
    });

    return () => {
      socket.off(`${user}/post`);
    };
  });

  //get the acces token
  useEffect(() => {
    const f = async () => {
      const t = await authStorage.getAccessToken();
      console.log("token:", t);
      setToken(t);
    };
    f();
  }, [user]);

  // reloads the  userdata
  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);
        //get the user data from db
        const result = await readUsersMe(
          token || (await authStorage.getAccessToken())
        );
        const friends = result ? result.friends : [];
        const user = result ? result.username : null;
        const requests = result ? result.requests : [];
        const wins = result ? result.wins : [];
        const loses = result ? result.loses : [];
        const avatar = result ? result.avatar : null;
        const sentRequests = result ? result.sentRequests : [];
        const xp = result ? result.xp : 0;
        const level = result ? result.level : 0;
        const streak = result ? result.streak : 0;

        console.log("user:", user);
        console.log("xp: ", xp, " level: ", level, " streak: ", streak);
        setUser(user);
        setFriends(await friends);
        setRequests(requests);
        setSentRequests(sentRequests);
        setWins(wins);
        setLoses(loses);
        setAvatar(avatar);
        setXp(xp);
        setLevel(level);
        setStreak(streak);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching da user data:", error);
        setUser(null);
        setFriends([]);
        setLoading(false);
      }
    };
    fetcher();
  }, [token, reFresh]);

  /**
   * sets the users access token
   *
   * @param {string} token
   */
  const login = (token) => {
    setToken(token);
  };

  /**
   * sets the user and its access token to null
   */
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const addScore = (newXp, newLevel, newStreak) => {
    setXp(newXp);
    setLevel(newLevel);
    setStreak(newStreak);
    updateScore(token, xp, level, streak);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        friends,
        friend,
        requests,
        sentRequests,
        wins,
        loses,
        room,
        token,
        invites,
        sentInvite,
        avatar,
        xp,
        level,
        streak,
        loading,
        setFriend,
        login,
        logout,
        addScore,
        setSentRequests,
        setRequests,
        setReFresh,
        setFriends,
        setInvites,
        setSentInvite,
        setRoom,
        setAvatar,
        setXp,
        setLevel,
        setStreak,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
