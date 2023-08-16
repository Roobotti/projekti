import React, { useState, useContext } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

import { BoardContext } from '../contexts/BoardContext';
import { getOne, getSelected } from '../services/board'
import { getSolutions } from '../services/blocks';

import { BlocksContext } from '../contexts/BlockContext';
import {Matrix} from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';

const SolutionsWrite = () => {
  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);
  const [n, setN] = useState(0);

  const getBoard = async () => {
    try {
      setBlocks([])
      setIsLoading(false)
      const response = await getSolutions()
      setBlocks(response.blocks)
      setN(n+1)
      const parsedBoard = JSON.parse(response.board)
      await setData(parsedBoard)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <View>
      <Button title="new board" onPress={getBoard} />
      {data && <Matrix matrix={data.base}/>}
      {data && <BlockRenderer blocks={blocks}/>}
    </View>
  );
};

export default SolutionsWrite;
