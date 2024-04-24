//pads block coords to 2x3x3 matrix so that it can be evaluated
export const padBlock = (blockCoords) => {
  // for error cannot se prop '0' of undefined
  if (!blockCoords) return undefined;

  const minX = Math.min(...blockCoords.map((p) => p[0]));
  const maxX = Math.max(...blockCoords.map((p) => p[0]));

  const minZ = Math.min(...blockCoords.map((p) => p[2]));
  const maxZ = Math.max(...blockCoords.map((p) => p[2]));
  const matrix = [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  ];

  for (let z = minZ; z <= maxZ; z++) {
    for (let y = 0; y < 2; y++)
      for (let x = minX; x <= maxX; x++) {
        matrix[y][z - minZ][x - minX] = Number(
          blockCoords.some((p) => p.every((c, i) => c === [x, y, z][i]))
        );
      }
  }
  return matrix;
};
