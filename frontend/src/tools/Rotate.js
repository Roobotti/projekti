import { useState } from "react";

export const rotate = (matrix) => {
  console.log("kala");
  matrix = matrix.filter((row) => row.includes(1));

  const arrayLength = matrix[0].length;

  const newArray = [];

  for (let i = 0; i < arrayLength; i++) {
    newArray.push([matrix[0][i]]);
  }

  for (let j = 1; j < matrix.length; j++) {
    for (let i = 0; i < arrayLength; i++) {
      newArray[i].push(matrix[j][i]);
    }
  }
  console.log("kala2", newArray);
  return newArray;
};
