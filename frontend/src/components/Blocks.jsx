import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const blockImageMapping = {
  g1: require('../block_images/g1.png'),
  g2: require('../block_images/g2.png'),
  g3: require('../block_images/g3.png'),
  g4: require('../block_images/g4.png'),

  b1: require('../block_images/b1.png'),
  b2: require('../block_images/b2.png'),
  b3: require('../block_images/b3.png'),
  b4: require('../block_images/b4.png'),
  
  r1: require('../block_images/r1.png'),
  r2: require('../block_images/r2.png'),
  r3: require('../block_images/r3.png'),
  r4: require('../block_images/r4.png'),

  y1: require('../block_images/y1.png'),
  y2: require('../block_images/y2.png'),
  y3: require('../block_images/y3.png'),
  y4: require('../block_images/y4.png'),
}

const BlockRenderer = ({ blocks }) => {
  console.log("jejj", blocks)

  const rows = Math.ceil(blocks.length / 2); // Calculate the number of rows needed

  return (
      <ScrollView horizontal >
        {[...Array(rows)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {blocks.slice(rowIndex * 2, rowIndex * 2 + 2).map((block, index) => (
              <Image
                key={index}
                source={blockImageMapping[block]}
                style={styles.blockImage}
              />
            ))}
          </View>
        ))}
        </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {


  },

  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  blockImage: {
    width: 200,
    height: 200,
    marginTop: -20,
    marginHorizontal: -45
  },
});

export default BlockRenderer;