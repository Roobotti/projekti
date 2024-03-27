import React, {useRef, useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import { Matrix } from '../components/Matrix';
import { Canvas, useThree } from '@react-three/fiber/native';

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { GameContext } from '../contexts/GameContext';


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
    const {color, selectedBlock, visibleTop} = useContext(GameContext)


    const onClick = useCallback((e) => {
      e.stopPropagation()
      if (selectedBlock === boxBlock) {
        setBoxColor("gray")
        setBoxBlock(null)
        setOpacity(0.2)
      }
      else {
        setBoxColor(color)
        setBoxBlock(selectedBlock)
        setOpacity(0.8)
      }


    }, [color, opacity, boxBlock]);

    const onHold = useCallback((e) => {
      e.stopPropagation()
      setBoxColor(color)
      setOpacity(0.8)
    }, [color]);

    return opacity && (visibleTop && props.position[1])
      ? ( 
          <mesh
            position= {props.position}
            ref={mesh}
            scale={[1, 1, 1]}
            onClick={onClick}
            onPointerMove={onHold}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={boxColor} 
              transparent={true} 
              opacity={opacity-0.1} 
              flatShading={true}
              metalness={0.1}
              />
          </mesh>
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

export const DevSolution = ({matrix}) => {
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
