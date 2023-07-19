import Constants from "expo-constants";
const baseUrl = `${Constants.manifest.extra.uri}/api/blocks`;

export const getBlocks = async (data) => {
  console.log(data.coordinates);
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.coordinates),
  });

  const json = await response.json();
  console.log("res", json);

  return json;
};
