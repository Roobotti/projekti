import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AssetsContext } from '../contexts/AssetsContext';

export const BlockRendererLarge = ({ blocks }) => {
  const {blockImageMapping} = useContext(AssetsContext)
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
  const {blockImageMapping} = useContext(AssetsContext)
  return (
      <ScrollView horizontal>
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