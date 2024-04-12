import Constants from "expo-constants";
const baseUrl = `${Constants.expoConfig.extra.uri}/api/puzzle`;

/**
 * Gets random board with set of blocks and all right solutions
 *
 * @returns {{blocks: Array<string> , solutions: Array<Array<string>>}} blocks and solutions.
 */
export const getPuzzle = async () => {
  const response = await fetch(`${baseUrl}`);
  const json = await response.json();
  console.log("resu", json);
  return json;
};
