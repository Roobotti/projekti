import Color from "color";
import { set } from "lodash";

const colouriseLottie = (json, colorByPath) => {
  const nextJson = JSON.parse(JSON.stringify(json));

  Object.entries(colorByPath).forEach(([path, color]) => {
    // incase undefined/null/falsy is passed to color
    if (!color) return;
    const rgbValues = Color(color).object();
    const rFraction = rgbValues.r / 255;
    const gFraction = rgbValues.g / 255;
    const bFraction = rgbValues.b / 255;

    const pathParts = path.split(".");
    set(nextJson, [...pathParts, 0], rFraction);
    set(nextJson, [...pathParts, 1], gFraction);
    set(nextJson, [...pathParts, 2], bFraction);
  });

  return nextJson;
};

export default colouriseLottie;
