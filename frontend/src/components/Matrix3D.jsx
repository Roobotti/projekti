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
    const { color, selectedBlock, visibleTop, pressed, setPressed, blocks, blockParts, validate, validBlocks, reValidate, setBlockParts} = useContext(Game3dContext)
    
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
      const iOld = blocks.indexOf(boxBlock);
      const iNew = blocks.indexOf(selectedBlock);

      if (selectedBlock === boxBlock) {
        setBoxColor("gray")
        //deleteBlockPart(selectedBlock, [...props.position])
        const newParts = blockParts
        newParts[iOld] = [...blockParts[iOld].filter((b) => !b.every((p, n) => [...props.position][n] === p)) ]
        setBlockParts(newParts);
        validate([boxBlock])

        setBoxBlock(null)
        setH(0.05)
        
      }
      else {
        setBoxColor(color)
        setH(1)
        //addBlockPart(selectedBlock, [...props.position], boxBlock)
        //deleteBlockPart(boxBlock, [...props.position])
        const newParts = blockParts
        if (boxBlock) { newParts[iOld] = [...blockParts[iOld].filter((b) => !b.every((p, n) => [...props.position][n] === p)) ] }
        newParts[iNew] = [...blockParts[iNew], [...props.position]]
        setBlockParts(newParts);
        validate(boxBlock ? [boxBlock, selectedBlock] : [selectedBlock])
  

        setBoxBlock(selectedBlock)
      }


    }, [color, opacity, boxBlock, selectedBlock, validBlocks]);


    return opacity && !(!visibleTop && props.position[1])
      ? ( 
          <>
            <mesh
              position = {[ pos[0], pos[1] + 2, pos[2] ]}
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
        <OrbitControls 
          maxPolarAngle={Math.PI/2}
          dampingFactor={0.03}
          rotateSpeed={1.3}
        
        />
        <ambientLight intensity={0.6} />
        <spotLight position={[0, 10, 10]} angle={0.30} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <group position={[offset, 0, 0]} scale={1}>
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

