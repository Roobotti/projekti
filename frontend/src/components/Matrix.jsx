import React from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';



const Matrix = ({matrix}) => {

  const windowWidth = Dimensions.get('window').width;

  const boxHeightInPixels = windowWidth * 0.21; // Adjust the scale factor for desired size

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