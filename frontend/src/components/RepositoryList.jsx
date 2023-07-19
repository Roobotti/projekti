import React, { useEffect, useContext, useState } from 'react';
import { View, Button } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getOne } from '../services/board'
import { getBlocks } from '../services/blocks';
import Text from './Text';
import { BlocksContext } from '../contexts/BlockContext';

const Board = () => {
  const { data, setData } = useContext(BoardContext);
  const {blocks, setBlocks } = useContext(BlocksContext)

  const getBoard = async () => {
    try {
      const response = await getOne()
      const parsedResponse = JSON.parse(response)
      await setData(parsedResponse)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBlock = async () => {
    try {
      const response = await getBlocks(data)
      console.log("block", response)
      await setBlocks(response)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>
      <Button title="Load Data" onPress={getBoard} />
      {/* Display the loaded data */}
      {data && data.base.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
      <Button title="Load Blocks" onPress={getBlock} />
      {/* Display the loaded data */}
      {blocks && blocks.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
};

export default Board;
