import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import Text from './Text';

import {Matrix, Hint} from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';
import { rotate } from '../tools/Rotate';

import * as Animatable from 'react-native-animatable';


const Board = () => {
  const ht = 5

  const [ puzzle, setPuzzle ] = useState({})

  const [isLoading, setIsLoading] = useState(false);
  const [hintText, setHintText] = useState('Hint availabe') 
  const [hintTimer, setHintTimer] = useState(0)

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


  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={getData} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
        <Text style={{alignSelf: 'center'}}>New board</Text>
      </TouchableOpacity>
      <View style={{flex: 1, display:'flex', justifyContent:'center', marginBottom:100}}>
        <View pointerEvents={hintTimer?"none":"auto"} onTouchStart={() => setHintTimer(5)}>{puzzle?.solutions && <Hint matrix={puzzle.solutions[0]}/>}</View>
      </View>

      <View style={{position:'absolute', bottom:5}}>
        {isLoading 
          ? ( <Loading /> )
          : ( puzzle?.blocks && <BlockRenderer blocks={puzzle.blocks}/> )
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

export default Board;
