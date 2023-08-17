import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

const windowWidth = Dimensions.get('window').width;

const boxHeightInPixels = windowWidth * 0.205; // Adjust the scale factor for desired size
const gap = windowWidth * 0.0120; // Adjust the scale factor for desired size


const colorMap = (key) => {
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

export const ColorBlocks = ({colors, color, setColor }) => {
  return (
    <View style={styles.blocks}>
      {colors.map((c) => (
          <TouchableOpacity
            key={c}
            style={{...colorMap(c), width:boxHeightInPixels, height:boxHeightInPixels, opacity:c===color?1:0.5}}
            onPress={ () => {
              setColor(c)
            }}
          />
          ))
      }
    </View>
  )
}

export const PuzzleProve = ({matrix, color, setColored}) => {
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
              style={colorMap(value)}
            >
              {/* python code gives bit wierd lists*/}
              {value && value !== "None" && <TouchableOpacity
                delayPressIn={0}
                onPress={() => {
                  console.log("r: ", rowIndex, "c: ", colIndex,  "color: from", value, "to ", color )
                  matrix[rowIndex][colIndex] = color
                  setColored(matrix)
                  }
                 }
                style={{flex: 1, padding:1, alignSelf:'stretch'}}
              />}
            </Animatable.View>
          ))}
        </View>
      ))}
    </View>
  );
};



export const Hint = ({matrix}) => {
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
              style={colorMap(value)}
            >
              {/* python code gives bit wierd lists*/}
              {value && value !== "None" && <TouchableOpacity
                /* blocks double tap*/
                delayPressIn={40}
                style={{flex: 1, padding:1, alignSelf:'stretch', backgroundColor:'black'}}
              />}
            </Animatable.View>
          ))}
        </View>
      ))}
    </View>
  );
};

export const Matrix = ({matrix}) => {
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
              style={colorMap(value)}
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
  touch: 
    {flex: 1, padding:1, alignSelf:'stretch'},
  touchHighLight: 
    {flex: 1, padding:1, alignSelf:'stretch', borderWidth: 5, borderColor:'black'},
  blocks: {
    position: 'absolute',
    bottom: 5,
    flex: 1,
    gap: gap,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  row: {
    flexDirection: 'row',
    gap:2
  },
  defaultBox: {
    backgroundColor: 'transparent',
  },
});
