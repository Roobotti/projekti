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

import  Constants from "expo-constants";
import { io } from "socket.io-client";


const baseUrl = `${Constants.manifest.extra.ws}`;
const socket = io.connect(baseUrl, {
			path: '/ws/socket.io',
		})

const MultiPlayer = ({host, user, friend}) => {
  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [abortController, setAbortController] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [room, setRoom] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)


  useEffect( () => {
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("connection")
      socket.emit('join', {"user":user, "friend":friend});
    });
    socket.on("lobby", ({room}) => {setRoom(room)})
    socket.on("disconnect", () => {console.log("disconnected") });
    socket.on("redy", () => { setFriendReady(true) } )
    socket.on("board", ({board}) => { 
      setData(board) 
      setBlocks([])
      setLoaded(false)
    } )
    socket.on("loading", () => { setIsLoading(true) } )
    socket.on("blocks", ({blocks}) => { 
      setBlocks(blocks) 
      setIsLoading(false)
      setLoaded(true)
    })
    socket.on("ubongo", () => { setGameOver(true) } )

  }, [])

  const newGame = () => {
    setData(null)
    setBlocks(null)
    setIsLoading(!host)
    setUserReady(false)
    setFriendReady(false)
    setGameOver(false)
    setWin(false)    
    setLoaded(false)
  }

  const getBoard = async () => {
    try {
      setBlocks([])
      setLoaded(false)
      setIsLoading(false)
      if (abortController) {
        console.log("abort")
        abortController.abort(); // Abort the previous fetch request
      }
      const response = await getOne()
      const parsedResponse = JSON.parse(response)
      socket.emit('board', {"room":room, "board":parsedResponse});
      await setData(parsedResponse)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBlock = async () => {
    try {
      socket.emit('loading', {"room":room, "blocks":response});
      const controller = new AbortController();
      setAbortController(controller);
      const signal = controller.signal

      const response = await getBlocks(data, signal)
      console.log("block", response)
      socket.emit('blocks', {"room":room, "blocks":response});
      await setBlocks(response)
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sentRedy = () => {
    socket.emit('redy', {"room":room});
    setUserReady(true)
  };

  const sentUbongo = () => {
    socket.emit('ubongo', {"room":room});
    setGameOver(true)
  };

  if (gameOver) {
    return( 
      <View>
        <Text>!!UBONGO!!</Text>
        <Text> {win ? user : friend} won </Text>
        <Button title="new game?" onPress={newGame} />

      </View>
    )
  }

  if (!userReady) {
    return (
      <View>
        <Button title="Redy" onPress={sentRedy} />
      </View>
    )
  }

  if (!friendReady) {
    return (
      <View>
        <Text>waiting for {friend}</Text>
      </View>
    )
  }

  return (
    <View>
      {host && <Button title="new board" onPress={getBoard} />}
      {data && <Matrix matrix={data.base}/>}
      {host && data && <Button title="get blocks" onPress={getBlock} />}
      {isLoading 
        ? ( <Loading /> )
        : ( 
          loaded && (
          <View>
            <BlockRenderer blocks={blocks} /> 
            <Button title="UBONGO" onPress={sentUbongo} />
          </View>
          )
          )
      }
    </View>
  );
};

export default MultiPlayer;