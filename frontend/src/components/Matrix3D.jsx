import React, {useRef, useState, useCallback, useContext, useEffect } from 'react';
import { View,} from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { Edges} from '@react-three/drei'

import { Game3dContext } from '../contexts/Game3dContext';
import useControls from "r3f-native-orbitcontrols"


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
    case "blue":
      return { color: blue, opacity: opacity };
    case "yellow":
      return { color: yellow, opacity: opacity };
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
    const { color, selectedBlock, visibleTop, pressed, setPressed, addBlockPart, deleteBlockPart, validBlocks, reValidate} = useContext(Game3dContext)
    
    useEffect(() => {
      if (pressed === boxBlock){
        setPressed(null)
        setBoxColor("gray")
        setBoxBlock(null)
        setH(0.05)
      }
    }, [pressed]);

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

const Matrix3D = ({matrix}) => {
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
                <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 0, colIndex]} {...colorMap(value)}  />
            ))
          )}
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Box key={`${rowIndex}-${colIndex}`} position={[rowIndex, 1, colIndex]} {...colorMap( value)} />
            ))
          )}
        </group>
      </Canvas>
      </View>
  );
};
export default Matrix3D

