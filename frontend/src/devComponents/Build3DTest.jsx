import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import Text from '../components/Text';

import { DevBlockRenderer4colors}  from './devBlocks'
import { Loading } from '../components/Loading';



import * as Animatable from 'react-native-animatable';
import { Matrix3D } from './devMatrix';
import { useContext } from 'react';

import { Game3dContext } from '../contexts/Game3dContext';




const Build3dTest = () => {

  const [ puzzle, setPuzzle ] = useState({})

  const [isLoading, setIsLoading] = useState(false);


  const {visibleTop, setVisibleTop, setBlocks, setSolution} = useContext(Game3dContext)

  useEffect( () => {
    getData()
  },[])
  
  useEffect( () => {
    if (puzzle?.blocks) {
       setBlocks(puzzle.blocks)
    }
    if (puzzle?.solutions) {
       setSolution(puzzle.solutions[0])
    }

  },[puzzle])



  const getData = async () => {
    try {
      setPuzzle({})
      setIsLoading(true)
      const response = await getPuzzle()
      setPuzzle({blocks: response.blocks, solutions: response.solutions })
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={getData} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
        <Text style={{alignSelf: 'center'}}>New board</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => setVisibleTop(!visibleTop)} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
            <Text style={{alignSelf: 'center'}}>
              {visibleTop ? "Hide top layer" : "Show top layer"}
            </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, display:'flex', justifyContent:'center', marginBottom:100}}>
        {puzzle?.solutions && <Matrix3D matrix={puzzle.solutions[0]}/>} 
      </View>

      <View style={{position:'absolute', bottom:5}}>
        {isLoading 
          ? ( <Loading /> )
          : ( puzzle?.blocks && <DevBlockRenderer4colors blocks={puzzle.blocks}/> )

        }
      </View>

    </View>
  );
};

export default Build3dTest;
