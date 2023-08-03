import React from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';



const Matrix = ({matrix}) => {

  matrix = matrix.filter((row) => row.includes(1))


  const windowWidth = Dimensions.get('window').width;

  const boxHeightInPixels = windowWidth * 0.21; // Adjust the scale factor for desired size

  const arrayLength = matrix[0].length

  const newArray = [];

  for(let i = 0; i < arrayLength; i++){
      newArray.push([matrix[0][i]]);
    };

  for(let j = 1; j < matrix.length; j++){
      for(let i = 0; i < arrayLength; i++){
          newArray[i].push(matrix[j][i]);
        };
  };
  
  console.log("old", matrix)
  console.log("new", newArray)

  return (
    <View style={styles.container}>
      {newArray
        .map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <View
              key={colIndex}
              width={boxHeightInPixels}
              height={boxHeightInPixels}
              style={[
                styles.box,
                value === 1 ? styles.whiteBox : styles.defaultBox,
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {matrix
        .filter((row) => row.includes(1))
        .map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <View
              key={colIndex}
              width={boxHeightInPixels}
              height={boxHeightInPixels}
              style={[
                styles.box,
                value === 1 ? styles.whiteBox : styles.defaultBox,
              ]}
            />
          ))}
        </View>
      ))}
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
});

export default Matrix;