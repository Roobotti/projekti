import axios from "axios";
import { API_URI } from "../config";

const baseUrl = `${API_URI}/api/board`;

export const getSelected = async (board) => {
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
