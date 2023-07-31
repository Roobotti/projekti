import React, { useEffect, useContext, useState } from 'react';
import { View, Button } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getSolutions } from '../services/blocks';
import Text from './Text';
import { BlocksContext } from '../contexts/BlockContext';
import Matrix from './Matrix';
import BlockRenderer from './Blocks';
import { Loading } from './Loading';

import { socket } from '../services/socket';
import { UserContext } from '../contexts/UserContext';

const InitialcountDown = 5

const MultiPlayer = ({user, friend}) => {
  const {room, setRoom} = useContext(UserContext)

  const { data, setData } = useContext(BoardContext);
  const { blocks, setBlocks } = useContext(BlocksContext)
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [abortController, setAbortController] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [friendReady, setFriendReady] = useState(false);
  const [countdown, setCountdown] = useState(InitialcountDown)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [host, setHost] = useState(false)


  // send roomname / hostName 
  // send roomname / playerName

  // main -> if logged in socket on...
  useEffect( () => {
    socket.emit('join', {"user":user, "friend":friend});

    socket.on("room", ({room, host, blocks, board}) => {
      setRoom(room)
      setHost(host === user)
      setData(board)
      setBlocks(blocks)
      console.log("join")
    })

    socket.on("redy", () => { setFriendReady(true) } )
    socket.on("game_data", ({board, blocks}) => { 
      setData(board)
      setBlocks(blocks)
      setIsLoading(false)
    } )
    socket.on("ubongo", () => { setGameOver(true) } )

  }, [])

  //count down
  useEffect( () => {
    if (friendReady && countdown > 0) {
      const interval = setInterval( () => {
        setCountdown( c => c - 1)
      }, 1000);
      return () => {
        clearInterval(interval);
      };
  }

  }, [friendReady, countdown])

  useEffect( () => {
    if (host) {
      console.log("newGame")
      newGame()}

  }, [host])

  const newGame = async() => {
    setUserReady(false)
    setFriendReady(false)
    setGameOver(false)
    setCountdown(InitialcountDown)
    setWin(false)

    if (host){getData()}
  }

  const getData = async () => {
    try {      
      const response = await getSolutions()
      const parsedBoard = JSON.parse(response.board)
      socket.emit('data', {"room":room, "blocks":response.blocks, "board":parsedBoard});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


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
        { (!userReady && data && blocks) 

          ? (<Button title="Redy" onPress={sentRedy}/>)
          : ( !friendReady && <Text>waiting for {friend}</Text> )
        }
      </View>
    )
  }


  return (
    <View>
      { blocks && <BlockRenderer blocks={blocks} /> }
      {isLoading 
        ? ( <Loading /> )
        : ( <WhoReady /> )
      }
      {friendReady && userReady && (
        <View>
          {(countdown === InitialcountDown) 
            ? (<WhoReady />)
            : (<Text> starts in: {countdown} s</Text>)
          }
          {(countdown === 0) && (
            <View> 
              <Matrix matrix={data.base}/>
              <Button title="UBONGO" onPress={sentUbongo} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default MultiPlayer;