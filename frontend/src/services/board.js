import axios from "axios";
import Constants from "expo-constants";
const baseUrl = `${Constants.expoConfig.extra.uri}/api/board`;

export const getSelected = async (board) => {
  console.log(baseUrl);
  const response = await fetch(`${baseUrl}s/${board}`);
  const json = await response.json();

  return json;
};

const deleteOne = async (object) => {
  await axios.delete(`${baseUrl}/${object}`, { headers });
};

const create = async (object) => {
  const request = await axios.post(baseUrl, object, { headers });
  return request.data;
};

export default { getOne, create, deleteOne };
