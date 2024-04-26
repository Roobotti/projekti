/**
 * Rotates the matrix to right
 */
export const rotate = (matrix) => {
  matrix = matrix.filter((row) => row.some((r) => r));

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
  return newArray;
};
