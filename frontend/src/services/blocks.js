import Constants from "expo-constants";
const baseUrl = `${Constants.manifest.extra.uri}/api/blocks`;

export const getBlocks = async (data, signal) => {
  console.log(data.coordinates);
  const response = await fetch(baseUrl, {
    signal: signal,
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

export const getSolutions = async () => {
  const response = await fetch(`${baseUrl}&board`);
  const json = await response.json();
  console.log("res", json);

  return json;
};
