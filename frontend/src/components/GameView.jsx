import React, { useEffect, useContext, useState } from 'react';
import { View, Button } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getOne } from '../services/board'
import { getBlocks } from '../services/blocks';
import Text from './Text';
import { BlocksContext } from '../contexts/BlockContext';
import Matrix from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';



const Board = () => {
  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const getBoard = async () => {
    try {
      setBlocks([])
      setIsLoading(false)
      if (abortController) {
        console.log("abort")
        abortController.abort(); // Abort the previous fetch request
      }
      const response = await getOne()
      const parsedResponse = JSON.parse(response)
      await setData(parsedResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBlock = async () => {
    try {
      setIsLoading(true)
      const controller = new AbortController();
      setAbortController(controller);
      const signal = controller.signal

      const response = await getBlocks(data, signal)
      console.log("block", response)
      await setBlocks(response)
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>

      <Button title="new board" onPress={getBoard} />
      {data && <Matrix matrix={data.base}/>}
      {data && <Button title="get blocks" onPress={getBlock} />}
      {isLoading 
        ? ( <Loading /> )
        : ( blocks && <BlockRenderer blocks={blocks} /> )
      }
    </View>
  );
};

export default Board;
