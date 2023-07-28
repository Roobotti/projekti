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

import { socket } from '../services/socket';
import { UserContext } from '../contexts/UserContext';

const MultiPlayer = ({host, user, friend}) => {
  const {room, setRoom} = useContext(UserContext)

  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [abortController, setAbortController] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)


  // send roomname / hostName 
  // send roomname / playerName

  // main -> if logged in socket on...
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
    } )
    socket.on("loading", () => { setIsLoading(true) } )
    socket.on("blocks", ({blocks}) => { 
      setBlocks(blocks) 
      setIsLoading(false)
      setLoaded(true)
    })
    socket.on("ubongo", () => { setGameOver(true) } )

    if (host) socket.on("hostGiveData", () => {
      if (data) socket.emit('board', {"room":room, "board":data});
      if (loaded) socket.emit('blocks', {"room":room, "blocks":blocks});
      else socket.emit("loading", {"room": room})
    }) 

    if (host) newGame()
    if (!host && !isLoading && !loaded) socket.emit('giveData', {"room":room});

  }, [])

  const newGame = async() => {
    setData([])
    setBlocks([])
    setUserReady(false)
    setFriendReady(false)
    setGameOver(false)
    setWin(false)
    setIsLoading(false)
    setLoaded(false)
    if (host){
      response = await getBoard()
      await getBlock(await response)
    }
  }

  const getBoard = async () => {
    try {
      const response = await getOne()
      const parsedResponse = JSON.parse(response)
      socket.emit('board', {"room":room, "board":parsedResponse});
      await setData(parsedResponse)
      return parsedResponse
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBlock = async (board) => {
    try {
      socket.emit('loading', {"room":room, "blocks":response});
      const controller = new AbortController();
      setAbortController(controller);
      const signal = controller.signal
      const response = await getBlocks(board, signal)
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

  const WhoReady = () => {
    return(
      <View>
        { !userReady 

          ? (<Button title="Redy" onPress={sentRedy}/>)
          : ( !friendReady && <Text>waiting for {friend}</Text> )
        }
      </View>
    )
  }

  return (
    <View>
      {loaded && blocks && <BlockRenderer blocks={blocks} /> }
      {isLoading 
        ? ( <Loading /> )
        : ( loaded && <WhoReady /> )
      }
      {friendReady && userReady && (
        <View> 
          <Matrix matrix={data.base}/>
          <Button title="UBONGO" onPress={sentUbongo} />
        </View>
      )}
    </View>
  );
};

export default MultiPlayer;