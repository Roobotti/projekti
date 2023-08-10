import React from 'react';
import { View, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';


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

export const BlockRendererLarge = ({ blocks }) => {
  const rows = Math.ceil(blocks.length / 2); // Calculate the number of rows needed
  return (
      <ScrollView >
        {[...Array(rows)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {blocks.slice(rowIndex * 2, rowIndex * 2 + 2).map((block, index) => (
              <Animatable.Image
                animation={'bounceIn'} 
                duration={1000} 
                key={index}
                source={blockImageMapping[block]}
                style={styles.blockImageLarge}
              />
            ))}
          </View>
        ))}
        </ScrollView>
  );
};


const BlockRenderer = ({ blocks }) => {
  return (
      <ScrollView horizontal >
            {blocks.map((block) => (
              <Animatable.Image
                animation={'bounceInLeft'} 
                duration={1000}

                key={block}
                source={blockImageMapping[block]}
                style={styles.blockImage}
              />
        ))}
        </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 20
  },
  blockImageLarge: {
    flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'center'
  },
  blockImage: {
    width: 100,
    height: 100,
    resizeMode: 'center'
  },
});

export default BlockRenderer;