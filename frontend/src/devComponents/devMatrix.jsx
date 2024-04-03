import React, {useRef, useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import { Matrix } from '../components/Matrix';
import { Canvas, useThree } from '@react-three/fiber/native';
import {Outlines, Edges} from '@react-three/drei'

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { Game3dContext } from '../contexts/Game3dContext';
import { Line, Vector3 } from 'three';


const windowWidth = Dimensions.get('window').width;

const boxHeightInPixels = windowWidth * 0.205; // Adjust the scale factor for desired size
const gap = windowWidth * 0.0120; // Adjust the scale factor for desired size

const state = () => useThree()

const colorMap = (key) => {
  switch (key) {
    case 1:
      return { color: 'rgb(0,0,0)', opacity: 0.8 };
    case "red":
      return { color: 'rgb(250,0,0)', opacity: 0.8 };
    case "green":
      return { color: 'rgb(0,250,0)', opacity: 0.8 };
    case "yellow":
      return { color: 'rgb(250,250,0)', opacity: 0.8 };
    case "blue":
      return { color: 'rgb(0,0,250)', opacity: 0.8 };
    default:
      return { color: 'rgb(0,0,250)', opacity: 0};
  }
};


const Box = (props)  => {
    const mesh = useRef()
    const [boxColor, setBoxColor] = useState(props.color);
    const [boxBlock, setBoxBlock] = useState("")
    const [opacity, setOpacity] = useState(props.opacity);
    const [pos, setPos] = useState([props.position[0], props.position[1], props.position[2]])
    const [h, setH] = useState(0.1);
    const {color, selectedBlock, visibleTop, addBlockPart, deleteBlockPart, validBlocks} = useContext(Game3dContext)
    
    useEffect(() => {
      setPos([pos[0], (h<1) ? props.position[1]-0.5 : props.position[1], pos[2]])
    }, [h]);

    useEffect(() => {
      if (validBlocks.length) {
        setOpacity((validBlocks.some((b) => b === boxBlock)) ? 1 : opacity)
      }
    }, [validBlocks]);

    const onClick = useCallback((e) => {
      e.stopPropagation()
      if (selectedBlock === boxBlock) {
        setBoxColor("gray")
        setBoxBlock(null)
        setH(0.05)
        deleteBlockPart(selectedBlock, [...props.position])
        
        
      }
      else {
        setBoxColor(color)
        setBoxBlock(selectedBlock)
        setH(1)
        addBlockPart(selectedBlock, [...props.position])
        console.log(validBlocks)
      }


    }, [color, opacity, boxBlock]);

    const onHold = useCallback((e) => {
      e.stopPropagation()
      setBoxColor(color)
      setOpacity(0.8)
    }, [color]);

    return opacity && !(!visibleTop && props.position[1])
      ? ( 
          <>
            <mesh
              position = {pos}
              ref={mesh}
              scale={[0.99, h, 0.99]}
              onClick={onClick}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={boxColor} 
                transparent={true} 
                opacity={opacity} 
                flatShading={true}
                metalness={0.1}
                />
              <Edges
                  linewidth={0.5}
                  scale={1}
                  threshold={15}
                  color={selectedBlock === boxBlock ? "white" : "black"}
              />
            </mesh>
          </>

        )
        : (
          <></>
        )
      
  }

export const Board3D = ({matrix}) => {
  const offset = matrix.length/(-2)+0.5
  return (
      <Canvas 
        camera={{ position: [0, 6, 6], near: 1, far: 20 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[0, 10, 10]} angle={0.30} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <group position={[offset*1.2, 0, 0]} scale={1.2}>
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 0, colIndex]} {...colorMap(value)} />
            ))
          )}
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 1, colIndex]} {...colorMap(value)} />
            ))
          )}
        </group>
      </Canvas>
  );
};

export const Matrix3D = ({matrix}) => {
  const offset = matrix.length/(-2)+0.5
  return (
      <Canvas 
        camera={{ position: [0, 6, 6]}}>
        
        <ambientLight intensity={0.6} />
        <spotLight position={[0, 10, 10]} angle={0.30} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <group position={[offset*1.2, 0, 0]} scale={1.2}>
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
                <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 0, colIndex]} {...colorMap(value)} />
            ))
          )}
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 1, colIndex]} {...colorMap(value)} />
            ))
          )}
        </group>
      
      </Canvas>
  );
};

export const DevSolution = ({matrix}) => {
  return (
    <View style={{...styles.container, gap:gap}}>
      {matrix
        .map((row, rowIndex) => (
        <View key={rowIndex} style={{...styles.row, gap:gap}}>
          {row.map((value, colIndex) => (
            <Animatable.View
              key={colIndex}
              animation={'jello'}
              duration={500}
            >

              <View width={boxHeightInPixels} height={boxHeightInPixels} style={colorMap((value ? value === "None" : true) ? 0 : value)}></View>

            </Animatable.View>
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
  container3D: {
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    gap:2,
    perspective: 1000
  },
  touch: 
    {flex: 1, padding:1, alignSelf:'stretch'},
  touchHighLight: 
    {flex: 1, padding:1, alignSelf:'stretch', borderWidth: 5, borderColor:'black'},
  blocks: {
    alignContent:'space-between',
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
  default3DBox: {
    color: 'red',
  },
});
