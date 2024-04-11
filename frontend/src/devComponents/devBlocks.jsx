import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AssetsContext } from '../contexts/AssetsContext';
import { Game3dContext } from '../contexts/Game3dContext';

const colorMap = (key) => {
  switch (key[0]) {
    case "r":
      return "red";
    case "g":
      return "green";
    case "y":
      return "yellow";
    case "b":
      return "blue";
    default:
      return "black";
  }
};


const TouchableBlock = ({id}) => {
  const {blockImageMapping} = useContext(AssetsContext)
  const {setColor, setSelectedBlock} = useContext(Game3dContext)
  
  const handleClick = () => {
    setColor(colorMap(id))
    setSelectedBlock(id)
  }

  return (
    <TouchableOpacity onPress={() => handleClick()}>
      <Animatable.Image
        animation={'bounceInLeft'} 
        duration={1000}
        source={blockImageMapping[id]}
        style={styles.blockImage}
      />
    </TouchableOpacity>
    
  )
}

const DevBlockRenderer = ({ blocks }) => {
  
  return (
      <ScrollView horizontal>
            {blocks.map((id) => (
              <TouchableBlock key={id} id={id}/>
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

export default DevBlockRenderer;