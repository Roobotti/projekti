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

export const signUp = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${baseUrl}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    return null;
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
    console.error("Error fetching the user data:", error);
  }
};
