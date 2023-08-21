import { createContext, useEffect, useState } from "react";
import { readUsersMe } from "../services/users";
import { useAuthStorage } from "../hooks/useStorageContext";

import { loadFriendData } from "../services/users";

import { socket } from "../services/socket";

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
        setLoading(true);
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
        loading,
        setFriend,
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
