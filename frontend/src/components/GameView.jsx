import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { getSolutions } from '../services/blocks';
import Text from './Text';

import Matrix from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';
import { rotate } from '../tools/Rotate';


const Board = () => {
  const [ data, setData ] = useState([])
  const [ blocks, setBlocks ]  = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect( () => {
    getData()
  },[])

  const getData = async () => {
    try {
      setIsLoading(true)
      const response = await getSolutions()
      const parsedBoard = JSON.parse(response.board)
      const matrix = rotate(await parsedBoard.base)
      setData(matrix)
      setBlocks(response.blocks)
      setIsLoading(false)
      console.log("d", response)
      console.log("b", blocks)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={getData} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
        <Text style={{alignSelf: 'center'}}>New board</Text>
      </TouchableOpacity>
      <View style={{flex: 1, display:'flex', justifyContent:'space-evenly'}}>
        <View>{data && <Matrix matrix={data}/>}</View>
        <View>
          {isLoading 
            ? ( <Loading /> )
            : ( blocks && <BlockRenderer blocks={blocks}/> )
          }
        </View>
      </View>
    </View>
  );
};

export default Board;
