import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import Text from '../components/Text';

import { Hint} from '../components/Matrix';
import DevBlockRenderer  from './devBlocks'
import { Loading } from '../components/Loading';
import { debounce } from 'lodash';


import * as Animatable from 'react-native-animatable';
import { Matrix3D, DevSolution } from './devMatrix';


const Build3DTest = () => {

  const [ puzzle, setPuzzle ] = useState({})

  const [isLoading, setIsLoading] = useState(false);
  const [hintText, setHintText] = useState('Hint availabe') 
  const [hintTimer, setHintTimer] = useState(0)
  const [solution, setSolution] = useState(0)

  useEffect( () => {
    getData()
  },[])

  useEffect( () => {
    setHintText(hintTimer?`   Next in ${hintTimer} s   `:'Hint available')
    if ( hintTimer > 0) {
      const interval = setInterval( () => {
        setHintTimer( c => c - 1)
      }, 1000);
      return () => {
        clearInterval(interval);
      };
  }

  }, [hintTimer])

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

  const handleNextSolution = (n) => {
    puzzle.solutions.length - solution ? setSolution(solution + n) : setSolution(0)
  }

  const handleTouchStart = () => {
    setHintTimer(5)
    debounceSetTimer()
  }
  const debounceSetTimer = debounce(() => { setHintTimer(5)}, 1000); 

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={getData} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
        <Text style={{alignSelf: 'center'}}>New board</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => handleNextSolution(1)} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
            <Text style={{alignSelf: 'center'}}>
              sho 
            </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, display:'flex', justifyContent:'center', marginBottom:100}}>
        {puzzle?.solutions && <Matrix3D matrix={puzzle.solutions[0]}/>} 
      </View>

      <View style={{position:'absolute', bottom:5}}>
        {isLoading 
          ? ( <Loading /> )
          : ( puzzle?.blocks && <DevBlockRenderer blocks={puzzle.blocks}/> )

        }
      </View>

      {puzzle && <Animatable.View 
        animation={'fadeIn'}
        duration={3000}
        style={{
          position:'absolute',
          top: 70,
          right: 10,
          transform: [{rotate: '30deg'}],
          alignSelf: 'center',
          alignSelf:'stretch', 
          padding:10, 
          backgroundColor:'rgba(121, 217, 80, 0.3)',
          borderRadius: 6,
        }}
        >
        <Text style={{alignSelf: 'center'}}>{hintText}</Text>
      </Animatable.View>
      }

    </View>
  );
};

export default Build3DTest;
