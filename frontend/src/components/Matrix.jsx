import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

const color = (key) => {
  switch (key) {
    case 1:
      return { ...styles.defaultBox, backgroundColor: 'rgba(0,0,0,0.90)' };
    case "red":
      return { ...styles.defaultBox, backgroundColor: 'rgba(250,0,0,0.90)' };
    case "green":
      return { ...styles.defaultBox, backgroundColor: 'rgba(0,250,0,0.90)' };
    case "yellow":
      return { ...styles.defaultBox, backgroundColor: 'rgba(250,250,0,0.90)' };
    case "blue":
      return { ...styles.defaultBox, backgroundColor: 'rgba(0,0,250,0.90)' };
    default:
      return styles.defaultBox;
  }
};

const Matrix = ({matrix}) => {

  const windowWidth = Dimensions.get('window').width;

  const boxHeightInPixels = windowWidth * 0.205; // Adjust the scale factor for desired size
  const gap = windowWidth * 0.0120; // Adjust the scale factor for desired size

  const arrayLength = matrix.length
  console.log("m", matrix)

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
              style={color(value)}
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
    alignSelf: 'center',
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
});

export default Matrix;