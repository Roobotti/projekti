import Constants from "expo-constants";
import { useAuthStorage } from "../hooks/useStorageContext";

const baseUrl = `${Constants.manifest.extra.uri}/api`;

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

export const signOut = async () => {
  try {
    const authStorage = useAuthStorage();
    await authStorage.removeAccessToken();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

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
    //console.error("Error fetching the user data:", error);
  }
};

export const uploadAvatar = async (token, avatar) => {
  const response = await fetch(`${baseUrl}/users/me/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(avatar),
  });
  console.log("Success:");

  if (!response.ok) {
    throw new Error("Failed to fetch uploadAvatar");
  }

  const data = await response.json();
  return data;
};

export const loadFriend = async (friend) => {
  try {
    const response = await fetch(`${baseUrl}/friend/${friend}`, {
      method: "GET",
    });
    console.log("Success:");

    if (!response.ok) {
      throw new Error("Failed to load friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

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
