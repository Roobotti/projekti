import React, { useEffect, useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import {Hint} from './Matrix';
import BlockRenderer, { BlockRendererLarge } from './Blocks';
import { Loading } from './Loading';

import { socket } from '../services/socket';
import { UserContext } from '../contexts/UserContext';
import { loadFriend, newWin } from '../services/users';

import * as Animatable from 'react-native-animatable';

import Text from './Text';

import LottieView from "lottie-react-native";
import { HourGlassTimer } from '../lotties/Timers';

const AnimatedLottieViewUserWait = Animated.createAnimatedComponent(LottieView);

const InitialcountDown = 5000

const MultiPlayer = ({user, friend}) => {
  const {room, token, avatar, invites, setRoom, setInvites} = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(false);

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


  const [hintText, setHintText] = useState('Hint availabe') 
  const [hintTimer, setHintTimer] = useState(3*60)

  const [puzzle, setPuzzle] = useState([])
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

    socket.on("room", ({room, host, blocks, solutions}) => {
      setRoom(room)
      setHost(host === user)
      setPuzzle({blocks, solutions})
      console.log("join")
    })

    socket.on("redy", () => { setFriendReady(true) } )
    socket.on("game_data", ({blocks, solutions}) => { 
      setPuzzle({blocks, solutions})
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

  //hint timer
  useEffect( () => {
    setHintText(hintTimer?`   Hint in ${hintTimer} s   `:'Hint available')
    if ( hintTimer > 0) {
      const hintInterval = setInterval( () => {
        setHintTimer( c => c - 1)
      }, 1000);
      return () => {
        clearInterval(hintInterval);
      };
  }

  }, [hintTimer])

  useEffect( () => {
    if  (left) {setLeft(null)}
    else {
    const getFriend = async () => {
        const data = await loadFriend(friend)
        const json = await data.json()
        setFriendData(json)
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
    setUboText("UBONGO")
    setCountdown(InitialcountDown)
    setWin(false)

    if (host){getData()}
  }

  const getData = async () => {
    try {      
      const response = await getPuzzle()
      socket.emit('data', {"room":room, "blocks":response.blocks, "solutions":response.solutions});
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

  const handleUbongoClick = () => {
    setClicks(clicks + 1)
    if (clicks>=3) sentUbongo()
    if (clicks>0) setUboText(3-clicks)
    else setUboText("UBONGO")
  }

  const UbongoClicker = () => {
    return (
      <View>
        <TouchableOpacity style={styles.ubongo} onPress={() => handleUbongoClick()}>
          <Text style={{fontSize:28}}>{uboText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const HintLabel = () => {
    return (
      <Animatable.View 
        animation={'fadeIn'}
        duration={3000}
        style={styles.hint}
        >
        <Text style={{alignSelf: 'center'}}>{hintText}</Text>
      </Animatable.View>
    )
  }

  if (gameOver) {
    return( 
      <Animatable.View style={styles.winner_container} animation={'bounceIn'} duration={2000}>
        <Animatable.Text> 
          <Text style={{fontSize: 50}}>!!UBONGO!!</Text>
        </Animatable.Text>

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

        <TouchableOpacity style={{...styles.ubongo, padding:10}} onPress={newGame}>
          <Text style={{fontSize:22}}>New game?</Text>
        </TouchableOpacity>

      </Animatable.View>
    )
  }

  const WhoReady = () => {
    return(
      <View >
        { (!userReady && puzzle.blocks) 
          ? (
            <TouchableOpacity  onPress={sentRedy} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(235, 164, 33, 0.4)'}}>
              <Text style={{alignSelf: 'center'}}>Redy</Text>
            </TouchableOpacity>
            )
          : ( !friendReady && (<View>
              <AnimatedLottieViewUserWait
                source={require("../lotties/HourGlass.json")}
                autoPlay
                loop
                speed={2}
                style={{ width: 100, alignSelf:'center' }}
              />
              <Text style={styles.text} >Waiting for {friend}</Text>
            
            </View>) )
        }
      </View>
    )
  }

  const choseBlockRender = () => {
    return (
      friendReady && userReady ? <BlockRenderer blocks={puzzle.blocks} /> : <BlockRendererLarge blocks={puzzle.blocks} />
    )
  }

  return (
    <View style={{flex:1}}>
      <Animatable.View>
        { puzzle.blocks && choseBlockRender() }
        {isLoading 
          ? ( <Loading /> )
          : ( <WhoReady /> )
        }
      </Animatable.View>
      <View style={{flex:1, justifyContent:'center', marginBottom:120}}>
        {friendReady && userReady && (
          <View style={styles.container}> 
            <View 
              pointerEvents={hintTimer?"none":"auto"} 
              onTouchEnd={() => setHintTimer(5)}
            >
              {puzzle?.solutions && <Hint matrix={puzzle.solutions[0]}/>}
            </View>
          </View>
        )}
      </View>
        {friendReady && userReady && <Animatable.View animation={'fadeIn'} duration={5000} delay={4000} style={{position:'absolute', alignSelf:'center', flexDirection: 'row', alignItems:'center', bottom:-10}}>
                  <UbongoClicker style={{alignSelf: 'center'}} />
                  <HourGlassTimer />
        </Animatable.View >}

        {friendReady && userReady && <Animatable.View 
          animation={'fadeIn'}
          duration={5000}
          delay={4000}
          style={styles.hint}
          >
          <Text style={{alignSelf: 'center'}}>{hintText}</Text>
        </Animatable.View>
        }
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',

  },
  ubongo: {
    margin: 20,
    padding: 30,
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 196, 87, 0.2)',
    borderRadius: 20,
  },
  winner_container: {
    flex: 1,
    alignItems: 'center',
    margin: 40,
  },
  text: {
    fontSize: 23,
    marginBottom: 20,
    alignSelf: 'center',

  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,
    marginBottom: 50,
  },
  hint: {
    position:'absolute',
    top: 120,
    right: 10,
    transform: [{rotate: '30deg'}],
    alignSelf: 'center',
    alignSelf:'stretch', 
    padding:10, 
    backgroundColor:'rgba(121, 217, 80, 0.3)',
    borderRadius: 6,
  }
});


export default MultiPlayer;

