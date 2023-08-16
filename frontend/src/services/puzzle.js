import Constants from "expo-constants";
const baseUrl = `${Constants.manifest.extra.uri}/api/puzzle`;

export const getPuzzle = async () => {
  const response = await fetch(`${baseUrl}`);
  const json = await response.json();
  console.log("res", json);
  return json;
};
