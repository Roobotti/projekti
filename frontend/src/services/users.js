import Constants from "expo-constants";
import { useAuthStorage } from "../hooks/useStorageContext";

const baseUrl = `${Constants.expoConfig.extra.uri}/api`;

/**
 * @typedef {{username: string, friends: array<Friend>, requests: array<Friend>, sentRequests: array<Friend>, wins: array<string>, loses: array<string>, lobby: string, avatar: string, disabled: bool | None = None}} UserData
 * @typedef {{username: string, wins: array<string>, loses: array<string>, avatar: string}} FriendData
 * @typedef {{username: string, password: string}} Credentials
 * @typedef {{access_token: string, token_type: string}} Token
 */

/**
 * Fetches the user token, if the credentials are right
 *
 * @param {Credentials} credentials
 * @param credentials.username
 * @param credentials.password
 * @returns {Promise<Token>} Promise object of the users token
 */
export const signIn = async ({ username, password }) => {
  try {
    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);
    const response = await fetch(`${baseUrl}/token`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Sign-in error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
};

/**
 * send request to create new user
 *
 * @param {Credentials} credentials
 * @param credentials.username
 * @param credentials.password
 * @returns {Promise<Token>} Promise object of the response
 */
export const signUp = async ({ username, password }) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      body: formData,
    });

    return response;
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

/**
 * Removes the users acces token from the storage
 *
 * @return Nan
 */
export const signOut = async () => {
  try {
    const authStorage = useAuthStorage();
    await authStorage.removeAccessToken();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

/**
 * request the user data from server
 *
 * @param {Token} token Users token
 * @returns {Promise<UserData>} Promise object of user data
 */
export const readUsersMe = async (token) => {
  try {
    const response = await fetch(`${baseUrl}/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the user data:", error);
  }
};

/**
 * Sends request to change the users avatar
 *
 * @param {Token} token users acces token
 * @param {string} avatar users avatar
 * @returns {Promise<UserData>} promise object about user data
 */
export const uploadAvatar = async (token, avatar) => {
  const response = await fetch(`${baseUrl}/users/me/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(avatar),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch uploadAvatar");
  }

  const data = await response.json();
  return data;
};

/**
 * Sends request to get the friend from db.
 *
 * @param {string} friend
 * @returns {Promise<FriendData>} friend data
 */
export const loadFriend = async (friend) => {
  try {
    const response = await fetch(`${baseUrl}/friend/${friend}`, {
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const loadFriendData = async (friend) => {
  try {
    const response = await fetch(`${baseUrl}/friend/${friend}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to load friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Sends request to update win and lose stats
 *
 * @param {Token} token
 * @param {string} friend
 * @returns {Promise<UserData>} user data
 */
export const newWin = async (token, friend) => {
  try {
    const response = await fetch(`${baseUrl}/users/me/wins/${friend}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the user data:", error);
  }
};

/**
 * Sends request to update requests from db.
 *
 * @param {Token} token
 * @param {string} friend
 * @returns {Promise<Boolean>} true if friend request was sent
 */
export const sendRequest = async (token, friend) => {
  try {
    const response = await fetch(`${baseUrl}/users/me/sentRequests/${friend}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch put request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the PUT sentRequests:", error);
  }
};

/**
 * Sends request to remove friend from users friends.
 *
 * @param {Token} token
 * @param {string} friend
 * @returns {Promise<Boolean>} true if friend was deleted
 */
export const sendDeleteFriend = async (token, friend) => {
  try {
    const response = await fetch(`${baseUrl}/users/me/deleteFriend/${friend}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delte friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Sends request to delete sent request from db.
 *
 * @param {Token} token
 * @param {string} friend
 * @returns {Promise<Boolean>} true if friend request were delted succesfully
 */
export const sendDeleteSentRequest = async (token, friend) => {
  try {
    const response = await fetch(
      `${baseUrl}/users/me/deleteSentRequest/${friend}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delte sent request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Sends request to remove request requests from friend requests.
 *
 * @param {Token} token
 * @param {string} friend
 * @returns {Promise<Boolean>} true if friend request was removed
 */
export const sendDeleteRequest = async (token, friend) => {
  try {
    const response = await fetch(
      `${baseUrl}/users/me/deleteRequest/${friend}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delte request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
