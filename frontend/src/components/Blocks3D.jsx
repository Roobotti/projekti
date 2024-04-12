import React, { useContext, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AssetsContext } from '../contexts/AssetsContext';
import { Game3dContext } from '../contexts/Game3dContext';

const TouchableVariationBlock = ({id, color}) => {
  const myRef = useRef(null)
  const {blockImageVariationsMapping} = useContext(AssetsContext)
  const {setColor, setSelectedBlock, setPressed} = useContext(Game3dContext)

  handleViewRef = ref => myRef.view = ref

  const handleClick = () => {
    setColor(color)
    setSelectedBlock(id)
  }

  const handleClickIn = () => {
    myRef.view.flash(500)
  }

  const handleClickOut = () => {
    myRef.view.pulse(400)
  }

  const handleLongPress = () => {
    setPressed(id)
    myRef.view.shake(500)
  }

  return (
    <TouchableOpacity onPressIn={handleClickIn}  onPressOut={handleClickOut} onPress={handleClick} onLongPress={handleLongPress}>
      <Animatable.Image
        ref={this.handleViewRef}
        animation={'bounceInLeft'} 
        duration={1000}
        source={blockImageVariationsMapping[id][color]}
        style={styles.blockImage}
      />
    </TouchableOpacity>
    
  )
}


const Blocks3D = ({ blocks }) => {

  const colors = ["red", "green", "blue", "yellow"]
  return (
      <ScrollView horizontal>
            {blocks.map((id, i) => (
              <TouchableVariationBlock key={id} id={id} color={colors[i]}/>
        ))}
        </ScrollView>

  );
};

export default Blocks3D

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
    resizeMode: 'center',


  },
});
