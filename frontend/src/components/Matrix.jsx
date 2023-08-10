import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

const Matrix = ({matrix}) => {

  const windowWidth = Dimensions.get('window').width;

  const boxHeightInPixels = windowWidth * 0.205; // Adjust the scale factor for desired size
  const gap = windowWidth * 0.0120; // Adjust the scale factor for desired size

  const arrayLength = matrix.length

  return (
    <View style={{...styles.container, gap:gap}}>
      {matrix
        .map((row, rowIndex) => (
        <View key={rowIndex} style={{...styles.row, gap:gap}}>
          {row.map((value, colIndex) => (
            <Animatable.View
              key={colIndex}
              width={boxHeightInPixels}
              height={boxHeightInPixels}
              animation={'bounceInDown'}
              delay={(arrayLength-rowIndex)*200*arrayLength+colIndex*200}
              duration={rowIndex*200*arrayLength+colIndex*200}
              onAnimationBegin ={() => {if (!value) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}}
              useNativeDriver={true}
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
    padding: 5,
    alignItems: 'center',
    gap:2
  },
  row: {
    flexDirection: 'row',
    gap:2
  },
  defaultBox: {
    backgroundColor: 'transparent',
  },
  whiteBox: {
    backgroundColor: 'black',
  },
});

export default Matrix;