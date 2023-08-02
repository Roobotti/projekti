import React, { useEffect, useContext, useState } from 'react';
import { View, Button, StyleSheet, Image, Text } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getSolutions } from '../services/blocks';
import { BlocksContext } from '../contexts/BlockContext';
import Matrix from './Matrix';
import BlockRenderer, { BlockRendererLarge } from './Blocks';
import { Loading } from './Loading';

import { socket } from '../services/socket';
import { UserContext } from '../contexts/UserContext';
import { loadFriend, newWin } from '../services/users';

const InitialcountDown = 5

const MultiPlayer = ({user, friend}) => {
  const {room, token, avatar, setRoom} = useContext(UserContext)
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
  const [friendData, setFriendData] = useState(null)

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

    socket.on("left", () => {console.log("player left")})

    socket.on(`${user}/post`, (data) => {
      switch (data.type) {
        case "cancel_invite":
          setInvites(invites.filter((i) => i !== data.user));
          console.log("invite_removed");
          break;
      }
    })

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
    const getFriend = async () => {
      const data = await loadFriend(friend)
      setFriendData(data)
    }
    getFriend()
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
    newWin(token, friend)
    setWin(true)
    setGameOver(true)
  };

  if (gameOver) {
    return( 
      <View style={styles.winner_container}>
        <Text style={styles.text}>!!UBONGO!!</Text>

        {win 
          ? (
            <View>
              {<Image source={{ uri: `data:image/jpeg;base64,${avatar}` }} style={styles.avatar} />}
              <Text style={styles.text} > You won </Text>
            </View>)
          : (
            <View>
              {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}
              <Text style={styles.text} > {friend} won </Text>
            </View>
            )
          }
        
        <Button title="new game?" onPress={newGame} />
      </View>
    )
  }

  const WhoReady = () => {
    return(
      <View>
        { (!userReady && data && blocks) 
          ? (<Button title="Redy" onPress={sentRedy}/>)
          : ( !friendReady && <Text style={styles.text} >waiting for {friend}</Text> )
        }
      </View>
    )
  }

  return (
    <View>
      { blocks && <BlockRendererLarge blocks={blocks} /> }
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

const styles = StyleSheet.create({
  winner_container: {
    alignItems: 'center',
    margin: 40,
  },
  text: {
    fontSize: 23,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',

  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 20,

  },
});

export default MultiPlayer;

