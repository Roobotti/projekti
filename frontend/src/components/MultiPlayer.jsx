import React, { useEffect, useContext, useState, useCallback } from 'react';
import { View, Button, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { BoardContext } from '../contexts/BoardContext';
import { getSolutions } from '../services/blocks';
import { BlocksContext } from '../contexts/BlockContext';
import Matrix from './Matrix';
import BlockRenderer, { BlockRendererLarge } from './Blocks';
import { Loading } from './Loading';

import { socket } from '../services/socket';
import { UserContext } from '../contexts/UserContext';
import { loadFriend, newWin } from '../services/users';

const InitialcountDown = 5000

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
  const [left, setLeft] = useState(null)
  const [host, setHost] = useState(false)
  const [friendData, setFriendData] = useState(null)
  const [clicks, setClicks] = useState(0)
  const [uboText, setUboText] = useState("UBONGO")
  // send roomname / hostName 
  // send roomname / playerName

  const handleLeft = useCallback( () => {
      socket.emit('host', {"user":user, "friend":friend, "userReady":userReady})
      setLeft(friend)
      setHost(true)
      console.log(friend, "left");
  })

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

    socket.on("left", handleLeft)

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
        setCountdown( c => c - 100)
      }, 10);
      return () => {
        clearInterval(interval);
      };
  }

  }, [friendReady, countdown])

  //click down
  useEffect( () => {
    if ( clicks > 0) {
      const interval = setInterval( () => {
        setClicks( c => c - 1)
      }, 1000);
      return () => {
        clearInterval(interval);
      };
  }

  }, [clicks])

  useEffect( () => {
    if  (left) {setLeft(null)}
    else {
    const getFriend = async () => {
        const data = await loadFriend(friend)
        setFriendData(data)
      }
      getFriend()
      if (host) {
        console.log("newGame")
        newGame()}
    }

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
    socket.emit('userRedy', {"room":room, "user":user});
    setUserReady(true)
  };

  const sentUbongo = () => {
    socket.emit('ubongo', {"room":room});
    newWin(token, friend)
    setWin(true)
    setGameOver(true)
  };

  const UbongoClicker = () => {

    const handleUbongoClick = () => {
      setClicks(clicks + 1)
      if (clicks>=5) sentUbongo()
    }

    if (clicks>0) setUboText(6-clicks)
    else setUboText("UBONGO")
    return (
      <View>
        <TouchableOpacity style={styles.ubongo} onPress={() => handleUbongoClick()}>
          <Text style={{fontWeight:'bold', fontSize:22}}>{uboText}</Text>
        </TouchableOpacity>
      </View>
    )
  }


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

  const choseBlockRender = () => {
    return (
      friendReady && userReady ? <BlockRenderer blocks={blocks} /> : <BlockRendererLarge blocks={blocks} />
    )
  }

  return (
    <View>
      <View>
      { blocks && choseBlockRender() }
      {isLoading 
        ? ( <Loading /> )
        : ( <WhoReady /> )
      }
      </View>
      {friendReady && userReady && (
        <View>
          {(countdown === InitialcountDown) 
            ? (<WhoReady />)
            : ((countdown !== 0) && <Text style={styles.text}> starts in: {Math.floor(countdown/1000)} s</Text>)
          }
          {(countdown === 0) && (
            <View style={styles.container}> 
              <Matrix matrix={data.base}/>
              <UbongoClicker />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignContent: 'space-around',
    justifyContent: 'space-between',
    alignItems: 'center'

  },
  ubongo: {
    margin: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 20,
  },
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

