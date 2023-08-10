import React, { useEffect, useContext, useState } from 'react';
import { View, Button } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getSolutions } from '../services/blocks';
import Text from './Text';
import { BlocksContext } from '../contexts/BlockContext';
import Matrix from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';
import { rotate } from '../tools/Rotate';


const Board = () => {
  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);

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
    <View>
      <Button title="new board" onPress={getData} />
      {data && <Matrix matrix={data}/>}
      {isLoading 
        ? ( <Loading /> )
        : ( blocks && <BlockRenderer blocks={blocks} /> )
      }
    </View>
  );
};

export default Board;
