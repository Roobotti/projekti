import React, {useRef, useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import { Matrix } from '../components/Matrix';
import { Canvas, useThree } from '@react-three/fiber/native';
import {Outlines, Edges, ArcballControls} from '@react-three/drei'

import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { Game3dContext } from '../contexts/Game3dContext';
import useControls from "r3f-native-orbitcontrols"



const windowWidth = Dimensions.get('window').width;

const boxHeightInPixels = windowWidth * 0.205; // Adjust the scale factor for desired size
const gap = windowWidth * 0.0120; // Adjust the scale factor for desired size
const opacity = 0.6



const red     = 'rgb(240, 160, 182)'
const green   = 'rgb(126, 216, 177)'
const blue    = 'rgb(120, 150, 255)'
const yellow  = 'rgb(231, 249, 142)'

const colorMap = (key) => {
  switch (key) {
    case 1: return { color: 'rgb(0,0,0)', opacity: opacity };
    case "red":
      return { color: red, opacity: opacity };
    case "green":
      return { color: green, opacity: opacity };
    case "yellow":
      return { color: yellow, opacity: opacity };
    case "blue":
      return { color: blue, opacity: opacity };
    default:
      return { color: 'rgb(0,200,200)', opacity: 0};
  }
};


const Box = (props)  => {
    const mesh = useRef()
    const [boxColor, setBoxColor] = useState(props.color);
    const [boxBlock, setBoxBlock] = useState("")
    const [opacity, setOpacity] = useState(props.opacity);
    const [pos, setPos] = useState([props.position[0], props.position[1], props.position[2]])
    const [h, setH] = useState(0.1);
    const {color, selectedBlock, visibleTop, addBlockPart, deleteBlockPart, validBlocks, reValidate} = useContext(Game3dContext)
    
    useEffect(() => {
      setPos([pos[0], (h<1) ? props.position[1]-0.5 : props.position[1], pos[2]])
    }, [h]);

    useEffect(() => {
      if (validBlocks.length) {
        setOpacity((validBlocks.includes(boxBlock)) ? 0.9 : props.opacity)
      }
    }, [validBlocks, reValidate]);

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
        setH(1)
        deleteBlockPart(boxBlock, [...props.position])
        setBoxBlock(selectedBlock)
        addBlockPart(selectedBlock, [...props.position])
        console.log(validBlocks)
      }


    }, [color, opacity, boxBlock, selectedBlock]);


    return opacity && !(!visibleTop && props.position[1])
      ? ( 
          <>
            <mesh
              position = {pos}
              ref={mesh}
              scale={[1, h, 1]}
              onClick={onClick}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={colorMap(boxColor).color} 
                transparent={true} 
                opacity={(validBlocks.includes(boxBlock)) ? 0.9 : props.opacity} 
                flatShading={true}
                metalness={0.1}
                />
              <Edges
                  linewidth={0.6}
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
  const [OrbitControls, events] = useControls()
  return (
    <View style={{flex: 1}} {...events}>
      <Canvas 
        camera={{ position: [0, 6, 6]}}>
        <OrbitControls />
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
      </View>
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
