import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const BoardWrite = () => {
  const [matrix, setMatrix] = useState(Array.from({ length: 6 }, () => Array(4).fill(0)));
  const [newMatrix, setNewMatrix] = useState([])

  const windowWidth = Dimensions.get('window').width;
  const boxHeightInPixels = windowWidth * 0.21; // Adjust the scale factor for desired size

  const handleBoxClick = (rowIndex, colIndex) => {
    // Clone the matrix to avoid mutating the original state directly
    const newMatrix = [...matrix];
    // Update the clicked box value to toggle between 1 and 0
    newMatrix[rowIndex][colIndex] = matrix[rowIndex][colIndex] === 0 ? 1 : 0;
    // Update the state with the new matrix
    setMatrix(newMatrix);
  };


function rotateMatrixCounterClockwise(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const rotatedMatrix = [];

  // Transpose the matrix (swap rows and columns)
  for (let j = 0; j < numCols; j++) {
    const newRow = [];
    for (let i = 0; i < numRows; i++) {
      newRow.push(matrix[i][j]);
    }
    rotatedMatrix.push(newRow);
  }

  // Reverse the order of the rows
  rotatedMatrix.reverse();

  return rotatedMatrix;
}


  const handleSubmit = () => {
    const matri = rotateMatrixCounterClockwise(matrix)
    const mat = []
    console.log("--")
    for (let i = 0; i < matri.length; i++) {
      const row = matri[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j]) mat.push([j, i]);
      }
    }
    setNewMatrix([...newMatrix, mat])
    console.log(newMatrix)
    setMatrix(Array.from({ length: 6 }, () => Array(4).fill(0)))
  }

  return (
    <View style={styles.container}>
      {matrix.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              activeOpacity={0.8}
              onPress={() => handleBoxClick(rowIndex, colIndex)}
              width={boxHeightInPixels}
              height={boxHeightInPixels}
              style={[
                styles.box,
                {
                  width: boxHeightInPixels,
                  height: boxHeightInPixels,
                  backgroundColor: value === 1 ? 'black' : 'gray',
                },
              ]}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity  style={styles.submit} onPress={() => handleSubmit()}>
        <Text>submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    borderWidth: 1.5,
    borderColor: 'white',
  },
  defaultBox: {
    backgroundColor: 'transparent',
  },
  whiteBox: {
    backgroundColor: 'black',
  },
  submit: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#ceff96",
    borderRadius: 5,
    margin: 40,
  },
});

export default BoardWrite;
